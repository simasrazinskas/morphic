'use client'

import { ToolInvocation } from 'ai'
import { ToolArgsSection } from './section'

interface SearchSectionProps {
  tool: ToolInvocation
}

export function SearchSection({ tool }: SearchSectionProps) {
  const query = tool.args?.query as string | undefined

  // Just display the search query without any collapsible functionality
  return <ToolArgsSection tool="search">{query}</ToolArgsSection>
}
