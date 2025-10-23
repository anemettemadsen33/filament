import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkle } from '@phosphor-icons/react'
import { popularFilterPresets, getPresetsByCategory } from '@/lib/filterPresets'
import { FilterState } from '@/lib/types'
import { motion } from 'framer-motion'

interface QuickFilterPresetsProps {
  currentFilters: FilterState
  onApplyPreset: (filters: FilterState) => void
  category?: 'popular' | 'lifestyle' | 'budget' | 'type' | 'all'
  showAllButton?: boolean
  onShowAll?: () => void
}

export function QuickFilterPresets({ 
  currentFilters, 
  onApplyPreset, 
  category = 'all',
  showAllButton = true,
  onShowAll
}: QuickFilterPresetsProps) {
  const presets = category === 'all' 
    ? popularFilterPresets.slice(0, 8)
    : getPresetsByCategory(category)

  const isPresetActive = (preset: typeof popularFilterPresets[0]) => {
    return JSON.stringify(preset.filters) === JSON.stringify(currentFilters)
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle className="w-4 h-4 text-primary" weight="duotone" />
          <h3 className="text-sm font-semibold">Quick Filters</h3>
        </div>
        {showAllButton && onShowAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onShowAll}
            className="h-8 text-xs"
          >
            View All
          </Button>
        )}
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {presets.map((preset, index) => {
            const Icon = preset.icon
            const active = isPresetActive(preset)
            
            return (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Button
                  variant={active ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onApplyPreset(preset.filters)}
                  className={`h-auto py-2 px-3 flex-col items-start gap-1 min-w-[140px] ${
                    active ? '' : 'hover:border-primary'
                  }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon 
                      className={`w-4 h-4 ${active ? 'text-primary-foreground' : preset.color}`} 
                      weight="duotone" 
                    />
                    <span className="text-xs font-semibold flex-1 text-left">{preset.name}</span>
                    {active && (
                      <Check className="w-3 h-3" weight="bold" />
                    )}
                  </div>
                  <p className={`text-[10px] leading-tight text-left line-clamp-2 ${
                    active ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {preset.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {preset.filters.maxPrice < 10000 && (
                      <Badge 
                        variant={active ? 'secondary' : 'outline'} 
                        className="h-4 px-1 text-[9px]"
                      >
                        €{preset.filters.maxPrice}
                      </Badge>
                    )}
                    {preset.filters.bedrooms !== 'all' && (
                      <Badge 
                        variant={active ? 'secondary' : 'outline'} 
                        className="h-4 px-1 text-[9px]"
                      >
                        {preset.filters.bedrooms}BR
                      </Badge>
                    )}
                  </div>
                </Button>
              </motion.div>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
