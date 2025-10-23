import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkle, 
  FunnelSimple,
  Check,
  CaretRight
} from '@phosphor-icons/react'
import { popularFilterPresets, FilterPreset, getPresetsByCategory } from '@/lib/filterPresets'
import { FilterState } from '@/lib/types'
import { motion } from 'framer-motion'

interface FilterPresetsPanelProps {
  currentFilters: FilterState
  onApplyPreset: (filters: FilterState) => void
  onClose?: () => void
}

export function FilterPresetsPanel({ currentFilters, onApplyPreset, onClose }: FilterPresetsPanelProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<FilterPreset['category']>('popular')

  const handleApplyPreset = (preset: FilterPreset) => {
    setSelectedPreset(preset.id)
    onApplyPreset(preset.filters)
    if (onClose) {
      setTimeout(onClose, 300)
    }
  }

  const isPresetActive = (preset: FilterPreset) => {
    return JSON.stringify(preset.filters) === JSON.stringify(currentFilters)
  }

  const categories = [
    { value: 'popular' as const, label: 'Popular', count: getPresetsByCategory('popular').length },
    { value: 'lifestyle' as const, label: 'Lifestyle', count: getPresetsByCategory('lifestyle').length },
    { value: 'budget' as const, label: 'Budget', count: getPresetsByCategory('budget').length },
    { value: 'type' as const, label: 'Type', count: getPresetsByCategory('type').length }
  ]

  return (
    <Card className="border-none shadow-lg">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Sparkle className="w-5 h-5 text-primary" weight="fill" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Filter Presets</h3>
            <p className="text-sm text-muted-foreground">Quick search templates for popular needs</p>
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as FilterPreset['category'])}>
          <TabsList className="grid w-full grid-cols-4">
            {categories.map(cat => (
              <TabsTrigger key={cat.value} value={cat.value} className="relative">
                {cat.label}
                <Badge variant="secondary" className="ml-1.5 h-5 min-w-5 px-1 text-xs">
                  {cat.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.value} value={cat.value} className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {getPresetsByCategory(cat.value).map((preset, index) => {
                    const Icon = preset.icon
                    const active = isPresetActive(preset)
                    
                    return (
                      <motion.div
                        key={preset.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button
                          onClick={() => handleApplyPreset(preset)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md group ${
                            active
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg bg-background ring-1 ring-border ${preset.color}`}>
                              <Icon className="w-5 h-5" weight="duotone" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm">{preset.name}</h4>
                                {active && (
                                  <Badge variant="default" className="h-5 px-1.5">
                                    <Check className="w-3 h-3" weight="bold" />
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {preset.description}
                              </p>
                              
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {preset.filters.propertyType !== 'all' && (
                                  <Badge variant="secondary" className="h-5 text-xs">
                                    {preset.filters.propertyType}
                                  </Badge>
                                )}
                                {preset.filters.rentalTerm !== 'all' && (
                                  <Badge variant="secondary" className="h-5 text-xs">
                                    {preset.filters.rentalTerm}
                                  </Badge>
                                )}
                                {preset.filters.maxPrice < 10000 && (
                                  <Badge variant="secondary" className="h-5 text-xs">
                                    €{preset.filters.minPrice}-{preset.filters.maxPrice}
                                  </Badge>
                                )}
                                {preset.filters.bedrooms !== 'all' && (
                                  <Badge variant="secondary" className="h-5 text-xs">
                                    {preset.filters.bedrooms} bed{preset.filters.bedrooms !== '1' ? 's' : ''}
                                  </Badge>
                                )}
                                {preset.filters.verifiedOnly && (
                                  <Badge variant="secondary" className="h-5 text-xs">
                                    Verified
                                  </Badge>
                                )}
                                {preset.filters.superhostOnly && (
                                  <Badge variant="secondary" className="h-5 text-xs">
                                    Superhost
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <CaretRight 
                              className={`w-5 h-5 text-muted-foreground transition-all group-hover:translate-x-1 ${
                                active ? 'text-primary' : ''
                              }`}
                              weight="bold"
                            />
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <div className="pt-4 border-t space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FunnelSimple className="w-4 h-4" />
            <span>Presets are starting points. You can further refine filters after applying.</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
