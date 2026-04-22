import NextLink, { type LinkProps as NextLinkProps } from 'next/link'
import { type AnchorHTMLAttributes, forwardRef } from 'react'

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> & NextLinkProps

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ prefetch = false, ...props }, ref) => (
  <NextLink ref={ref} prefetch={prefetch} {...props} />
))

Link.displayName = 'Link'

export default Link
