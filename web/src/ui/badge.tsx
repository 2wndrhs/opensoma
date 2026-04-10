import type { ReactNode } from 'react'

import { cn } from '~/lib/cn'

const badgeVariants = {
  default: 'bg-muted text-foreground-muted',
  primary: 'bg-primary-light text-primary',
  success: 'bg-success-muted text-success-foreground',
  danger: 'bg-danger-muted text-danger-foreground',
  warning: 'bg-warning-muted text-warning-foreground',
  info: 'bg-info-muted text-info-foreground',
} as const

interface BadgeProps {
  variant?: keyof typeof badgeVariants
  className?: string
  children: ReactNode
}

export function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
