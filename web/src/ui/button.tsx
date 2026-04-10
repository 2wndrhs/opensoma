import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '~/lib/cn'

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover cursor-pointer',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-hover cursor-pointer',
  ghost: 'text-foreground-muted hover:bg-muted cursor-pointer',
  danger: 'bg-danger text-white hover:bg-red-600 cursor-pointer',
} as const

const sizes = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled}
      {...props}
    />
  ),
)

Button.displayName = 'Button'
