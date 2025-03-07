import { Link, Search, Video } from 'lucide-react'
import React from 'react'
import { Badge } from './ui/badge'

type ToolBadgeProps = {
  tool: string
  children: React.ReactNode
  className?: string
}

export const ToolBadge: React.FC<ToolBadgeProps> = ({
  tool,
  children,
  className
}) => {
  const icon: Record<string, React.ReactNode> = {
    search: <Search size={10} />,
    retrieve: <Link size={10} />,
    video_search: <Video size={10} />
  }

  return (
    <Badge className={className} variant={'secondary'}>
      {icon[tool]}
      <span className="ml-1 text-[8px] leading-tight sm:text-xs md:leading-normal">
        {children}
      </span>
    </Badge>
  )
}
