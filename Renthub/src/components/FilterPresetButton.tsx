import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkle } from '@phosphor-icons/react'
import { popularFilterPresets } from '@/lib/filterPresets'
import { FilterState } from '@/lib/types'

interface FilterPresetButtonProps {
  currentFilters: FilterState
  onClick: () => void
  variant?: 'default' | 'outline'
}

export function FilterPresetButton({ currentFilters, onClick, variant = 'outline' }: FilterPresetButtonProps) {
  const activePreset = popularFilterPresets.find(
    preset => JSON.stringify(preset.filters) === JSON.stringify(currentFilters)
  )

  return (
    <Button
      variant={variant}
      onClick={onClick}
      className="relative gap-2"
    >
      <Sparkle className="w-4 h-4" weight={activePreset ? 'fill' : 'regular'} />
      <span>Filter Presets</span>
      {activePreset && (
        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
          {activePreset.name}
        </Badge>
      )}
    </Button>
  )
}
