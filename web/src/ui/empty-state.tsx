import { cn } from '~/lib/cn'

interface EmptyStateProps {
  message: string
  className?: string
}

export function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={cn('flex items-center justify-center rounded-lg border border-dashed border-border py-12', className)}
    >
      <p className="text-sm text-foreground-muted">{message}</p>
    </div>
  )
}
