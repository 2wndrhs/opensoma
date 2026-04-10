'use client'

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '~/lib/cn'

interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<typeof BaseCheckbox.Root>,
  'children' | 'onCheckedChange'
> {
  children?: ReactNode
  onCheckedChange?: (checked: boolean) => void
  labelClassName?: string
}

export function Checkbox({ children, className, labelClassName, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2 text-sm text-foreground', labelClassName)}>
      <BaseCheckbox.Root
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded border border-border transition-colors',
          'data-[checked]:border-primary data-[checked]:bg-primary',
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
          className,
        )}
        onCheckedChange={(checked) => onCheckedChange?.(checked)}
        {...props}
      >
        <BaseCheckbox.Indicator className="text-primary-foreground">
          <CheckIcon />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {children ? <span>{children}</span> : null}
    </label>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
