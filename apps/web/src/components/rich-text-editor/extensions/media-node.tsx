'use client'

import { ArrowClockwise, CircleNotch, Trash } from '@phosphor-icons/react'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Node } from '@tiptap/react'
import clsx from 'clsx'
import type { MouseEvent, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

export type UploadStatus = 'uploading' | 'failed' | null

export type MediaOptions = {
  onRetryUpload?: (nodeId: string, file: File) => void
}

export type MediaAttributes = {
  id: string
  file?: File
  src?: string
  alt?: string
  title?: string
  uploadStatus: UploadStatus
  progress: number
}

type SetMediaOptions = {
  file: File
}

declare module '@tiptap/react' {
  interface Commands<ReturnType> {
    media: {
      setMedia: (options: SetMediaOptions) => ReturnType
    }
  }
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    media: {
      setMedia: (options: SetMediaOptions) => ReturnType
    }
  }
}

const fileStore = new Map<string, File>()

export function getFile(id: string): File | undefined {
  return fileStore.get(id)
}

export function removeFile(id: string): void {
  fileStore.delete(id)
}

export const MediaNode = Node.create<MediaOptions>({
  name: 'media',
  group: 'block',
  draggable: true,
  selectable: true,
  atom: true,

  addOptions() {
    return {
      onRetryUpload: undefined,
    }
  },

  addAttributes() {
    return {
      id: { default: null },
      file: { default: null, rendered: false },
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      uploadStatus: { default: null, rendered: false },
      progress: { default: 0, rendered: false },
    }
  },

  parseHTML() {
    return [{ tag: 'img' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt, title: HTMLAttributes.title }]
  },

  addNodeView() {
    return ({ editor, node, getPos }) => {
      const dom = document.createElement('div')
      const root = createRoot(dom)
      let currentNode = node
      let objectUrl = getObjectUrl(node)

      const updateAttributes = (attributes: Partial<MediaAttributes>) => {
        const position = typeof getPos === 'function' ? getPos() : getPos

        if (typeof position !== 'number') {
          return
        }

        editor.view.dispatch(
          editor.state.tr.setNodeMarkup(position, undefined, {
            ...currentNode.attrs,
            ...attributes,
          }),
        )
      }

      const handleRetry = () => {
        const { id } = currentNode.attrs as MediaAttributes
        const file = (currentNode.attrs as MediaAttributes).file ?? fileStore.get(id)

        if (!file || !id) {
          return
        }

        updateAttributes({ uploadStatus: 'uploading' })
        this.options.onRetryUpload?.(id, file)
      }

      const handleDelete = () => {
        const position = typeof getPos === 'function' ? getPos() : getPos

        if (typeof position !== 'number') {
          return
        }

        editor.view.dispatch(editor.state.tr.delete(position, position + currentNode.nodeSize))
      }

      const renderNode = (renderedNode: ProseMirrorNode) => {
        const attrs = renderedNode.attrs as MediaAttributes

        root.render(
          <MediaNodeView
            attrs={attrs}
            selected={editor.isActive(this.name, { id: attrs.id })}
            onRetry={handleRetry}
            onDelete={handleDelete}
          />,
        )
      }

      renderNode(node)

      return {
        dom,
        update: (updatedNode) => {
          if (updatedNode.type !== currentNode.type) {
            return false
          }

          const nextObjectUrl = getObjectUrl(updatedNode)
          if (objectUrl && objectUrl !== nextObjectUrl) {
            URL.revokeObjectURL(objectUrl)
          }

          currentNode = updatedNode
          objectUrl = nextObjectUrl
          renderNode(updatedNode)
          return true
        },
        ignoreMutation: () => true,
        destroy: () => {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl)
          }

          const id = (currentNode.attrs as MediaAttributes).id
          if (id) fileStore.delete(id)

          root.unmount()
        },
      }
    }
  },

  addCommands() {
    return {
      setMedia:
        (options) =>
        ({ tr, dispatch }) => {
          const id = crypto.randomUUID()
          fileStore.set(id, options.file)

          const attrs: MediaAttributes = {
            id,
            file: options.file,
            src: URL.createObjectURL(options.file),
            alt: options.file.name,
            title: options.file.name,
            uploadStatus: 'uploading',
            progress: 0,
          }
          const node = this.type.create(attrs)

          if (dispatch) {
            const { $from } = tr.selection
            const pos = $from.end() + 1
            tr.insert(Math.min(pos, tr.doc.content.size), node)
          }

          return true
        },
    }
  },
})

type MediaNodeViewProps = {
  attrs: MediaAttributes
  selected: boolean
  onRetry: () => void
  onDelete: () => void
}

function MediaNodeView({ attrs, selected, onRetry, onDelete }: MediaNodeViewProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden rounded-xl border bg-muted/30',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
      )}
      contentEditable={false}
      data-drag-handle
    >
      {attrs.src ? (
        <img
          src={attrs.src}
          alt={attrs.alt ?? ''}
          title={attrs.title}
          className={clsx('block h-auto max-w-full', attrs.uploadStatus && 'opacity-60')}
          draggable={false}
        />
      ) : (
        <div className="flex min-h-40 min-w-40 items-center justify-center bg-muted text-sm text-foreground-muted">
          이미지 없음
        </div>
      )}
      {attrs.uploadStatus ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/65 backdrop-blur-xs">
          {attrs.uploadStatus === 'uploading' ? (
            <>
              <OverlayIcon>
                <CircleNotch size={28} className="animate-spin" weight="bold" />
              </OverlayIcon>
              <div className="flex w-48 flex-col items-center gap-1.5">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-200"
                    style={{ width: `${attrs.progress}%` }}
                  />
                </div>
                <span className="text-xs text-foreground-muted tabular-nums">{attrs.progress}%</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <OverlayButton label="다시 시도" onClick={onRetry}>
                <ArrowClockwise size={18} weight="bold" />
              </OverlayButton>
              <OverlayButton label="삭제" onClick={onDelete} tone="danger">
                <Trash size={18} weight="bold" />
              </OverlayButton>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

type OverlayButtonProps = {
  children: ReactNode
  label: string
  onClick: () => void
  tone?: 'default' | 'danger'
}

function OverlayButton({ children, label, onClick, tone = 'default' }: OverlayButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onClick()
  }

  return (
    <button
      type="button"
      className={clsx(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm shadow-sm transition-colors focus:outline-none',
        tone === 'danger'
          ? 'border-danger/30 bg-danger text-white hover:bg-danger-hover'
          : 'border-border bg-background text-foreground hover:bg-muted',
      )}
      onClick={handleClick}
      aria-label={label}
      contentEditable={false}
    >
      {children}
    </button>
  )
}

function OverlayIcon({ children }: { children: ReactNode }) {
  return (
    <div
      className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-background text-foreground shadow-sm"
      contentEditable={false}
    >
      {children}
    </div>
  )
}

function getObjectUrl(node: ProseMirrorNode) {
  const src = (node.attrs as MediaAttributes).src
  return typeof src === 'string' && src.startsWith('blob:') ? src : null
}
