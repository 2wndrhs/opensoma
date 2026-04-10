import type { ReactNode } from 'react'

import { cn } from '~/lib/cn'

interface CardProps {
  className?: string
  children: ReactNode
}

export function Card({ className, children }: CardProps) {
  return <div className={cn('rounded-lg bg-surface shadow-sm', className)}>{children}</div>
}

export function CardHeader({ className, children }: CardProps) {
  return <div className={cn('px-6 pt-6 pb-0', className)}>{children}</div>
}

export function CardContent({ className, children }: CardProps) {
  return <div className={cn('p-6', className)}>{children}</div>
}
