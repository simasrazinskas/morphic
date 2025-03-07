'use client'

import { cn } from '@/lib/utils'
import {
  BookCheck,
  Film,
  Image,
  MessageCircleMore,
  Newspaper,
  Repeat2,
  Search
} from 'lucide-react'
import React from 'react'
import { ToolBadge } from './tool-badge'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

type SectionProps = {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
  title?: string
  separator?: boolean
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  size = 'md',
  title,
  separator = false
}) => {
  const iconSize = 16
  const iconClassName = 'mr-1.5 text-muted-foreground'
  let icon: React.ReactNode
  switch (title) {
    case 'Paveikslėliai':
      // eslint-disable-next-line jsx-a11y/alt-text
      icon = <Image size={iconSize} className={iconClassName} />
      break
    case 'Vaizdo įrašai':
      icon = <Film size={iconSize} className={iconClassName} />
      break
    case 'Šaltiniai':
      icon = <Newspaper size={iconSize} className={iconClassName} />
      break
    case 'Atsakymas':
      icon = <BookCheck size={iconSize} className={iconClassName} />
      break
    case 'Susiję':
      icon = <Repeat2 size={iconSize} className={iconClassName} />
      break
    case 'Papildomi':
      icon = <MessageCircleMore size={iconSize} className={iconClassName} />
      break
    default:
      icon = <Search size={iconSize} className={iconClassName} />
  }

  return (
    <>
      {separator && <Separator className="my-2 bg-primary/10" />}
      <section
        className={cn(
          ` ${size === 'sm' ? 'py-1' : size === 'lg' ? 'py-4' : 'py-1'}`,
          className
        )}
      >
        {title && (
          <Badge
            variant="secondary"
            className="flex items-center leading-none w-fit my-1"
          >
            {icon}
            {title}
          </Badge>
        )}
        {children}
      </section>
    </>
  )
}

export function ToolArgsSection({
  children,
  tool
}: {
  children: React.ReactNode
  tool: string
}) {
  return (
    <Section size="sm" className="py-0 flex items-center justify-between">
      <ToolBadge tool={tool}>{children}</ToolBadge>
    </Section>
  )
}
