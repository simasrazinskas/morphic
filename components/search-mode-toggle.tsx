'use client'

import { getCookie, setCookie } from '@/lib/utils/cookies'
import { useEffect, useState } from 'react'

export function SearchModeToggle() {
  const [isSearchMode, setIsSearchMode] = useState(true)

  useEffect(() => {
    const savedMode = getCookie('search-mode')
    if (savedMode === null) {
      setCookie('search-mode', 'true')
    } else {
      setIsSearchMode(savedMode === 'true')
    }
  }, [])

  const handleSearchModeChange = (pressed: boolean) => {
    setIsSearchMode(pressed)
    setCookie('search-mode', pressed.toString())
  }

  return null
}

// Original toggle UI code:
/*
import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'
import { Toggle } from './ui/toggle'

return (
  <Toggle
    aria-label="Perjungti paieškos režimą"
    pressed={isSearchMode}
    onPressedChange={handleSearchModeChange}
    variant="outline"
    className={cn(
      'gap-1 px-3 border border-input text-muted-foreground bg-background',
      'data-[state=on]:bg-accent-blue',
      'data-[state=on]:text-accent-blue-foreground',
      'data-[state=on]:border-accent-blue-border',
      'hover:bg-accent hover:text-accent-foreground rounded-full'
    )}
  >
    <Globe className="size-4" />
    <span className="text-xs">Paieška</span>
  </Toggle>
)
*/
