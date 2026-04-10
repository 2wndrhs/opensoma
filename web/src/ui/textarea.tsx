'use client'

import { forwardRef, type TextareaHTMLAttributes } from 'react'

import { cn } from '~/lib/cn'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'block w-full resize-y rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
      'placeholder:text-foreground-muted',
      'focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
))

Textarea.displayName = 'Textarea'
