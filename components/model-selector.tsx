'use client'

import { Model } from '@/lib/types/models'
import { setCookie } from '@/lib/utils/cookies'
import { useEffect, useState } from 'react'

function groupModelsByProvider(models: Model[]) {
  return models.reduce((groups, model) => {
    const provider = model.provider
    if (!groups[provider]) {
      groups[provider] = []
    }
    groups[provider].push(model)
    return groups
  }, {} as Record<string, Model[]>)
}

export function ModelSelector() {
  const [open, setOpen] = useState(false)
  const [selectedModelId, setSelectedModelId] = useState<string>(
    'anthropic:claude-3-5-sonnet-latest'
  )

  useEffect(() => {
    // Set Claude 3.5 Sonnet as default with provider prefix
    setCookie('selected-model', 'anthropic:claude-3-5-sonnet-latest')
  }, [])

  // Hidden UI, but still maintaining the model selection functionality
  return null

  /* Original UI code kept as comments
  const handleModelSelect = (id: string) => {
    setSelectedModelId(id === selectedModelId ? '' : id)
    setCookie('selected-model', id)
    setOpen(false)
  }

  const groupedModels = groupModelsByProvider(models)
  const selectedModel = models.find(m => createModelId(m) === selectedModelId)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="text-sm rounded-full shadow-none focus:ring-0"
        >
          {selectedModel ? (
            <div className="flex items-center space-x-1">
              <Image
                src={`/providers/logos/${selectedModel.providerId}.svg`}
                alt={selectedModel.provider}
                width={18}
                height={18}
                className="bg-white rounded-full border"
              />
              <span className="text-xs font-medium">{selectedModel.name}</span>
              {isReasoningModel(selectedModel.id) && (
                <Lightbulb size={12} className="text-accent-blue-foreground" />
              )}
            </div>
          ) : (
            'Pasirinkite modelį'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandInput placeholder="Ieškoti modelių..." />
          <CommandList>
            <CommandEmpty>Modelių nerasta.</CommandEmpty>
            {Object.entries(groupedModels).map(([provider, models]) => (
              <CommandGroup key={provider} heading={provider}>
                {models.map(model => {
                  const modelId = createModelId(model)
                  return (
                    <CommandItem
                      key={modelId}
                      value={modelId}
                      onSelect={handleModelSelect}
                      className="flex justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Image
                          src={`/providers/logos/${model.providerId}.svg`}
                          alt={model.provider}
                          width={18}
                          height={18}
                          className="bg-white rounded-full border"
                        />
                        <span className="text-xs font-medium">
                          {model.name}
                        </span>
                      </div>
                      <Check
                        className={`h-4 w-4 ${
                          selectedModelId === modelId
                            ? 'opacity-100'
                            : 'opacity-0'
                        }`}
                      />
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
  */
}
