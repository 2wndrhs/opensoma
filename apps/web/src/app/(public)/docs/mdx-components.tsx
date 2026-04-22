import type { AnchorHTMLAttributes, ReactNode, TableHTMLAttributes } from 'react'

import Link from '@/ui/link'

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode }
type TableProps = TableHTMLAttributes<HTMLTableElement> & { children?: ReactNode }

export const mdxComponents = {
  a: ({ href, children, ...props }: AnchorProps) => {
    if (href?.startsWith('/') || href?.startsWith('#')) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  },
  table: ({ children, ...props }: TableProps) => (
    <div className="overflow-x-auto">
      <table {...props}>{children}</table>
    </div>
  ),
}
