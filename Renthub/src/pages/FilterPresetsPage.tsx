import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Sparkle, MagnifyingGlass, ArrowLeft, Check } from '@phosphor-icons/react'
import { popularFilterPresets, FilterPreset, getPresetsByCategory } from '@/lib/filterPresets'
import { FilterState } from '@/lib/types'
import { motion } from 'framer-motion'

interface FilterPresetsPageProps {
  onApplyPreset: (filters: FilterState) => void
}

export function FilterPresetsPage({ onApplyPreset }: FilterPresetsPageProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FilterPreset['category'] | 'all'>('all')

  const filteredPresets = popularFilterPresets.filter(preset => {
    const matchesSearch = 
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: 'all' as const, label: 'All Presets', count: popularFilterPresets.length },
    { value: 'popular' as const, label: 'Popular', count: getPresetsByCategory('popular').length },
    { value: 'lifestyle' as const, label: 'Lifestyle', count: getPresetsByCategory('lifestyle').length },
    { value: 'budget' as const, label: 'Budget', count: getPresetsByCategory('budget').length },
    { value: 'type' as const, label: 'Property Type', count: getPresetsByCategory('type').length }
  ]

  const handleApplyPreset = (preset: FilterPreset) => {
    onApplyPreset(preset.filters)
    navigate('/')
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 -ml-2 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-2xl" />
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 ring-1 ring-primary/20">
                  <Sparkle className="w-10 h-10 text-primary" weight="fill" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Search Presets
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Quick-start templates for {popularFilterPresets.length} common property searches
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search presets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
                id="presets-search"
                name="presetsSearch"
                aria-label="Search presets"
              />
            </div>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="h-12"
                >
                  Clear Search
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-10 overflow-x-auto pb-3 scrollbar-hide">
          {categories.map(cat => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat.value)}
              className="whitespace-nowrap h-11 px-5 transition-all"
              size="lg"
            >
              {cat.label}
              <Badge
                variant={selectedCategory === cat.value ? 'secondary' : 'outline'}
                className="ml-2.5 h-6 min-w-6 px-2 text-xs font-bold"
              >
                {cat.count}
              </Badge>
            </Button>
          ))}
        </div>

        {filteredPresets.length > 0 && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredPresets.length}</span> {filteredPresets.length === 1 ? 'preset' : 'presets'}
              {searchQuery && (
                <> matching "<span className="font-semibold text-foreground">{searchQuery}</span>"</>
              )}
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPresets.map((preset, index) => {
            const Icon = preset.icon
            
            return (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group cursor-pointer h-full flex flex-col">
                  <div className="space-y-4 flex-1 flex flex-col">
                    <div className="flex items-start gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br from-background to-muted ring-1 ring-border shadow-sm ${preset.color}`}>
                        <Icon className="w-7 h-7" weight="duotone" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{preset.name}</h3>
                          <Badge variant="outline" className="text-xs capitalize shrink-0">
                            {preset.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {preset.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Filter Settings
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {preset.filters.propertyType !== 'all' && (
                          <Badge variant="secondary" className="font-medium">
                            {preset.filters.propertyType}
                          </Badge>
                        )}
                        {preset.filters.rentalTerm !== 'all' && (
                          <Badge variant="secondary" className="font-medium">
                            {preset.filters.rentalTerm}
                          </Badge>
                        )}
                        {preset.filters.maxPrice < 10000 && (
                          <Badge variant="secondary" className="font-medium">
                            €{preset.filters.minPrice}-{preset.filters.maxPrice}
                          </Badge>
                        )}
                        {preset.filters.bedrooms !== 'all' && (
                          <Badge variant="secondary" className="font-medium">
                            {preset.filters.bedrooms} bedroom{preset.filters.bedrooms !== '1' ? 's' : ''}
                          </Badge>
                        )}
                        {preset.filters.verifiedOnly && (
                          <Badge variant="secondary" className="font-medium">
                            <Check className="w-3 h-3 mr-1" weight="bold" />
                            Verified Only
                          </Badge>
                        )}
                        {preset.filters.superhostOnly && (
                          <Badge variant="secondary" className="font-medium">
                            <Check className="w-3 h-3 mr-1" weight="bold" />
                            Superhost Only
                          </Badge>
                        )}
                        {preset.filters.searchQuery && (
                          <Badge variant="secondary" className="font-medium">
                            Keywords: {preset.filters.searchQuery}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleApplyPreset(preset)}
                      className="w-full group-hover:shadow-md transition-all mt-auto"
                      size="lg"
                    >
                      Apply Preset
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredPresets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Sparkle className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
            <h3 className="text-xl font-semibold mb-2">No presets found</h3>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
