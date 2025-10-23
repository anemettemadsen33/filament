import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PropertyWithLocation, FilterState, Property } from '@/lib/types'
import { addCoordinatesToProperties } from '@/lib/mapUtils'
import { PropertyMap } from '@/components/PropertyMap'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchFilterBar } from '@/components/SearchFilterBar'
import { EnhancedAIChatButton } from '@/components/EnhancedAIChatButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MapTrifold, List, Funnel, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface MapViewPageProps {
  properties: Property[]
  favorites: string[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onToggleFavorite: (id: string) => void
  onToggleCompare: (id: string) => void
  onPropertyClick: (property: Property) => void
  compareList: string[]
}

export function MapViewPage({
  properties,
  favorites,
  filters,
  onFiltersChange,
  onToggleFavorite,
  onToggleCompare,
  onPropertyClick,
  compareList
}: MapViewPageProps) {
  const navigate = useNavigate()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'map' | 'split'>('split')

  const propertiesWithCoords = useMemo(() => {
    return addCoordinatesToProperties(properties)
  }, [properties])

  const filteredProperties = useMemo(() => {
    return propertiesWithCoords.filter(property => {
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        if (
          !property.title.toLowerCase().includes(query) &&
          !property.location.toLowerCase().includes(query) &&
          !property.description.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      if (filters.propertyType !== 'all' && property.type !== filters.propertyType) {
        return false
      }

      if (filters.rentalTerm !== 'all' && property.rentalTerm !== filters.rentalTerm) {
        return false
      }

      if (property.price < filters.minPrice || property.price > filters.maxPrice) {
        return false
      }

      if (filters.bedrooms !== 'all') {
        const bedroomsFilter = parseInt(filters.bedrooms)
        if (property.bedrooms < bedroomsFilter) {
          return false
        }
      }

      return true
    })
  }, [propertiesWithCoords, filters])

  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) return null
    return filteredProperties.find(p => p.id === selectedPropertyId) || null
  }, [selectedPropertyId, filteredProperties])

  const handlePropertyClick = (property: PropertyWithLocation) => {
    setSelectedPropertyId(property.id)
  }

  const handleViewDetails = (property: Property) => {
    navigate(`/property/${property.id}`)
  }

  const handleClearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      propertyType: 'all',
      rentalTerm: 'all',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 'all'
    })
  }

  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.propertyType !== 'all' ||
    filters.rentalTerm !== 'all' ||
    filters.minPrice !== 0 ||
    filters.maxPrice !== 10000 ||
    filters.bedrooms !== 'all'

  return (
    <div className="flex flex-col min-h-[calc(100vh-5rem)]">
      <div className="border-b bg-background/95 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 max-w-[1600px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <MapTrifold size={24} weight="fill" className="text-primary-foreground" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Map View
                </span>
              </h1>
              <p className="text-sm text-muted-foreground pl-15">
                Explore <strong>{filteredProperties.length}</strong> {filteredProperties.length === 1 ? 'property' : 'properties'} on the interactive map
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'map' | 'split')} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="map" className="gap-2">
                    <MapTrifold size={18} weight="fill" />
                    <span className="hidden sm:inline">Map Only</span>
                    <span className="sm:hidden">Map</span>
                  </TabsTrigger>
                  <TabsTrigger value="split" className="gap-2">
                    <List size={18} weight="bold" />
                    <span className="hidden sm:inline">Split View</span>
                    <span className="sm:hidden">Split</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button
                variant={showFilters ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 whitespace-nowrap"
              >
                <Funnel size={18} weight="bold" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 bg-accent text-accent-foreground">
                    {[
                      filters.searchQuery && 1,
                      filters.propertyType !== 'all' && 1,
                      filters.rentalTerm !== 'all' && 1,
                      (filters.minPrice !== 0 || filters.maxPrice !== 10000) && 1,
                      filters.bedrooms !== 'all' && 1
                    ].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="p-4 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Funnel size={16} weight="bold" />
                  Filter Properties
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="h-8 w-8 p-0"
                >
                  <X size={18} />
                </Button>
              </div>
              <SearchFilterBar
                filters={filters}
                onFiltersChange={onFiltersChange}
                onReset={handleClearFilters}
              />
              {hasActiveFilters && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-8"
                  >
                    Clear All
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      <div className={cn(
        'flex-1 flex',
        viewMode === 'map' ? 'flex-col' : 'flex-col lg:flex-row'
      )}>
        <div className={cn(
          'relative bg-muted/20',
          viewMode === 'map' ? 'flex-1' : 'flex-1 lg:w-3/5'
        )}>
          <PropertyMap
            properties={filteredProperties}
            selectedPropertyId={selectedPropertyId}
            onPropertyClick={handlePropertyClick}
            className="w-full h-full min-h-[500px] lg:min-h-0"
          />

          {filteredProperties.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-10">
              <Card className="p-8 max-w-md text-center shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mx-auto mb-4">
                  <MapTrifold size={32} className="text-muted-foreground" weight="fill" />
                </div>
                <h3 className="font-bold text-xl mb-2">No Properties Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters to see more results on the map
                </p>
                {hasActiveFilters && (
                  <Button onClick={handleClearFilters} className="gap-2">
                    <X size={18} />
                    Clear Filters
                  </Button>
                )}
              </Card>
            </div>
          )}
        </div>

        {viewMode === 'split' && (
          <div className="border-t lg:border-t-0 lg:border-l bg-background w-full lg:w-2/5">
            <ScrollArea className="h-[400px] lg:h-full">
              <div className="p-4 space-y-3">
                {selectedProperty ? (
                  <div className="mb-4 animate-in slide-in-from-right-2 duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="default" className="gap-1.5">
                        <MapTrifold size={14} weight="fill" />
                        Selected Property
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPropertyId(null)}
                        className="h-7 px-2 gap-1"
                      >
                        <X size={14} />
                        <span className="text-xs">Clear</span>
                      </Button>
                    </div>
                    <PropertyCard
                      property={selectedProperty}
                      onClick={() => handleViewDetails(selectedProperty)}
                      isFavorite={favorites.includes(selectedProperty.id)}
                      onToggleFavorite={() => onToggleFavorite(selectedProperty.id)}
                      onToggleCompare={() => onToggleCompare(selectedProperty.id)}
                      isInCompare={compareList.includes(selectedProperty.id)}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 bg-muted/30 rounded-lg border border-dashed">
                    <MapTrifold size={32} className="mx-auto mb-2 text-muted-foreground" weight="duotone" />
                    <p className="text-sm text-muted-foreground font-medium">
                      Click on a marker to see details
                    </p>
                  </div>
                )}

                {filteredProperties.length > 0 && (
                  <div className={cn(
                    selectedProperty && 'border-t pt-4 mt-4'
                  )}>
                    {selectedProperty && (
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <List size={16} weight="bold" />
                        Other Properties ({filteredProperties.length - 1})
                      </h3>
                    )}
                    
                    {filteredProperties
                      .filter(p => p.id !== selectedPropertyId)
                      .slice(0, 20)
                      .map(property => (
                        <div key={property.id} className="mb-3">
                          <PropertyCard
                            property={property}
                            onClick={() => handleViewDetails(property)}
                            isFavorite={favorites.includes(property.id)}
                            onToggleFavorite={() => onToggleFavorite(property.id)}
                            onToggleCompare={() => onToggleCompare(property.id)}
                            isInCompare={compareList.includes(property.id)}
                          />
                        </div>
                      ))}
                      
                    {filteredProperties.length > 20 && (
                      <Card className="p-4 text-center bg-muted/30">
                        <p className="text-sm text-muted-foreground">
                          Showing first 20 properties. Use filters to narrow down results.
                        </p>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      <EnhancedAIChatButton
        properties={properties}
        onPropertySelect={(propertyId) => {
          const property = properties.find(p => p.id === propertyId)
          if (property) {
            onPropertyClick(property)
          }
        }}
      />
    </div>
  )
}
