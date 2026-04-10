'use client'

import { Field } from '@base-ui/react/field'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

import { cn } from '~/lib/cn'

export interface InputProps extends ComponentPropsWithoutRef<typeof Field.Control> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <Field.Control
    ref={ref}
    className={cn(
      'block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm transition-colors',
      'placeholder:text-foreground-muted',
      'focus:border-ring focus:ring-1 focus:ring-ring focus:outline-none',
      'data-[invalid]:border-danger data-[invalid]:focus:ring-danger',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  />
))

Input.displayName = 'Input'
