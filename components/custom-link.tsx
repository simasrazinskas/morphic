import { cn } from '@/lib/utils'
import { AnchorHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

type CustomLinkProps = Omit<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  'ref'
> & {
  children: ReactNode
}

export function Citing({
  href,
  children,
  className,
  ...props
}: CustomLinkProps) {
  const childrenText = children?.toString() || ''
  const isNumber = /^\d+$/.test(childrenText)

  // Hide citation icons by using a single style for all links
  // Previously, isNumber links had special styling
  const linkClasses = cn(
    'hidden', // Hide all citations completely
    className
  )

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClasses}
      {...props}
    >
      {children}
    </a>
  )
}
