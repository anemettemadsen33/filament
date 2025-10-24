import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Property, FilterState, SortOption, User } from '@/lib/types'
import { PropertyCard } from '@/components/PropertyCard'
import { SearchFilterBar } from '@/components/SearchFilterBar'
import { EmptyState } from '@/components/EmptyState'
import { SortBar } from '@/components/SortBar'
import { AISearchModal } from '@/components/AISearchModal'
import { PropertyComparisonModal } from '@/components/PropertyComparisonModal'
import { RecentlyViewedPanel } from '@/components/RecentlyViewedPanel'
import { SavedSearchesPanel, SavedSearch } from '@/components/SavedSearchesPanel'
import { SmartRecommendationsPanel } from '@/components/SmartRecommendationsPanel'
import { EnhancedAIChatButton } from '@/components/EnhancedAIChatButton'
import { QuickFilterPresets } from '@/components/QuickFilterPresets'
import { Button } from '@/components/ui/button'
import { MagicWand, Scales, Sparkle, MapTrifold } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface HomePageProps {
  properties: Property[]
  favorites: string[]
  filters: FilterState
  sortBy: SortOption
  showFavoritesOnly: boolean
  compareList: string[]
  recentlyViewed: string[]
  savedSearches: SavedSearch[]
  analytics: Record<string, any>
  user?: User | null
  onFiltersChange: (filters: FilterState) => void
  onSortChange: (sort: SortOption) => void
  onToggleFavorite: (id: string) => void
  onToggleCompare: (id: string) => void
  onRemoveFromCompare: (id: string) => void
  onSetShowFavoritesOnly: (show: boolean) => void
  onClearRecentlyViewed: () => void
  onSaveSearch: (search: Omit<SavedSearch, 'id' | 'createdAt'>) => void
  onUpdateSearch?: (searchId: string, updates: Partial<SavedSearch>) => void
  onDeleteSearch: (id: string) => void
  onLoadSearch: (filters: FilterState) => void
  onResetFilters: () => void
  onPropertyClick: (property: Property) => void
  onAISearchResults: (results: Property[]) => void
  onClearAISearch: () => void
}

export function HomePage({
  properties,
  favorites,
  filters,
  sortBy,
  showFavoritesOnly,
  compareList,
  recentlyViewed,
  savedSearches,
  user,
  onFiltersChange,
  onSortChange,
  onToggleFavorite,
  onToggleCompare,
  onRemoveFromCompare,
  onSetShowFavoritesOnly,
  onClearRecentlyViewed,
  onSaveSearch,
  onUpdateSearch,
  onDeleteSearch,
  onLoadSearch,
  onResetFilters,
  onPropertyClick,
  onAISearchResults,
  onClearAISearch
}: HomePageProps) {
  const navigate = useNavigate()
  const [showAISearch, setShowAISearch] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [aiFilteredProperties, setAIFilteredProperties] = useState<Property[] | null>(null)

  const filteredAndSortedProperties = useMemo(() => {
    let baseProperties = properties || []
    
    if (aiFilteredProperties) {
      baseProperties = aiFilteredProperties
    }
    
    let result = baseProperties.filter(property => {
      if (showFavoritesOnly && !favorites.includes(property.id)) {
        return false
      }

      const matchesSearch = 
        property.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      
      const matchesType = filters.propertyType === 'all' || property.type === filters.propertyType
      const matchesRentalTerm = filters.rentalTerm === 'all' || property.rentalTerm === filters.rentalTerm
      const matchesPrice = property.price >= filters.minPrice && property.price <= filters.maxPrice
      const matchesBedrooms = filters.bedrooms === 'all' || property.bedrooms >= parseInt(filters.bedrooms)
      const matchesVerified = !filters.verifiedOnly || (property.landlord?.verification?.verified ?? false)
      const matchesSuperhost = !filters.superhostOnly || (property.landlord?.isSuperhost ?? false)

      return matchesSearch && matchesType && matchesRentalTerm && matchesPrice && matchesBedrooms && matchesVerified && matchesSuperhost
    })

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'bedrooms':
        result.sort((a, b) => b.bedrooms - a.bedrooms)
        break
      case 'area':
        result.sort((a, b) => b.area - a.area)
        break
      case 'newest':
      default:
        result.sort((a, b) => b.createdAt - a.createdAt)
        break
    }

    return result
  }, [properties, filters, sortBy, showFavoritesOnly, favorites, aiFilteredProperties])

  const handleAISearchResults = (results: Property[]) => {
    setAIFilteredProperties(results)
    onAISearchResults(results)
    onSetShowFavoritesOnly(false)
  }

  const handleClearAISearch = () => {
    setAIFilteredProperties(null)
    onClearAISearch()
  }

  const handleToggleCompare = (propertyId: string) => {
    if (compareList.includes(propertyId)) {
      onRemoveFromCompare(propertyId)
    } else {
      if (compareList.length >= 3) {
        toast.error('You can compare up to 3 properties at a time')
        return
      }
      toast.success('Property added to comparison')
      onToggleCompare(propertyId)
    }
  }

  const recentlyViewedProperties = useMemo(() => {
    return recentlyViewed
      .map(id => properties.find(p => p.id === id))
      .filter((p): p is Property => p !== undefined)
  }, [recentlyViewed, properties])

  const compareProperties = useMemo(() => {
    return compareList
      .map(id => properties.find(p => p.id === id))
      .filter((p): p is Property => p !== undefined)
  }, [compareList, properties])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-[1600px]">
      <motion.div 
        className="mb-8 sm:mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
            <Sparkle size={28} weight="fill" className="text-accent sm:w-8 sm:h-8" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              {showFavoritesOnly ? 'Your Favorites' : aiFilteredProperties ? 'AI Search Results' : 'Discover Your Next Home'}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant="outline"
              onClick={() => navigate('/map')}
              className="h-11 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
              aria-label="View properties on map"
            >
              <MapTrifold size={20} weight="bold" className="text-primary mr-2" />
              Map View
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowAISearch(true)}
              className="h-11 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
              aria-label="Open AI search"
            >
              <MagicWand size={20} weight="bold" className="text-primary mr-2" />
              AI Search
            </Button>
            {compareList.length > 0 && (
              <Button 
                variant="outline"
                onClick={() => setShowComparison(true)}
                className="relative h-11 border-accent/30 hover:border-accent/50 hover:bg-accent/5"
                aria-label={`Compare ${compareList.length} properties`}
              >
                <Scales size={20} weight="bold" className="text-accent" />
                <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs font-bold">
                  {compareList.length}
                </Badge>
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-muted-foreground text-lg sm:text-xl font-medium">
            {showFavoritesOnly 
              ? `${filteredAndSortedProperties.length} favorite ${filteredAndSortedProperties.length === 1 ? 'property' : 'properties'}`
              : aiFilteredProperties
              ? `${filteredAndSortedProperties.length} AI-matched ${filteredAndSortedProperties.length === 1 ? 'property' : 'properties'}`
              : <>Browse <span className="text-primary font-bold">{properties?.length || 0}</span> available properties</>
            }
          </p>
          {filters.rentalTerm !== 'all' && !aiFilteredProperties && (
            <Badge className={`font-semibold ${
              filters.rentalTerm === 'short-term' 
                ? 'bg-blue-500 text-white' 
                : 'bg-purple-500 text-white'
            }`}>
              {filters.rentalTerm === 'short-term' ? 'Short-term Rentals' : 'Long-term Rentals'}
            </Badge>
          )}
          {aiFilteredProperties && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAISearch}
              className="text-xs"
            >
              Clear AI Filter
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="lg:col-span-1 space-y-6">
          <SearchFilterBar
            filters={filters}
            onFiltersChange={onFiltersChange}
            onReset={onResetFilters}
          />
          
          <QuickFilterPresets 
            currentFilters={filters}
            onApplyPreset={onFiltersChange}
            category="popular"
            showAllButton={true}
            onShowAll={() => navigate('/filter-presets')}
          />
          
          {recentlyViewedProperties.length > 0 && (
            <RecentlyViewedPanel
              properties={recentlyViewedProperties}
              onPropertyClick={onPropertyClick}
              onClearHistory={onClearRecentlyViewed}
            />
          )}
          
          <SavedSearchesPanel
            searches={savedSearches}
            currentFilters={filters}
            onLoadSearch={onLoadSearch}
            onSaveSearch={onSaveSearch}
            onUpdateSearch={onUpdateSearch}
            onDeleteSearch={onDeleteSearch}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <SortBar 
            value={sortBy}
            onChange={onSortChange}
            totalProperties={filteredAndSortedProperties.length}
          />
          
          {filteredAndSortedProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredAndSortedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.08,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <PropertyCard
                    property={property}
                    onClick={() => {
                      onPropertyClick(property)
                      navigate(`/property/${property.id}`)
                    }}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={onToggleFavorite}
                    isInCompare={compareList.includes(property.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <EmptyState />
            </motion.div>
          )}
        </div>
      </motion.div>

      {!showFavoritesOnly && !aiFilteredProperties && filteredAndSortedProperties.length > 0 && (recentlyViewed.length > 0 || favorites.length > 0) && (
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SmartRecommendationsPanel
            properties={properties}
            user={user || null}
            favorites={favorites}
            recentlyViewed={recentlyViewed}
            compareList={compareList}
            onToggleFavorite={onToggleFavorite}
            onToggleCompare={handleToggleCompare}
            onPropertyClick={onPropertyClick}
          />
        </motion.div>
      )}

      <AISearchModal
        open={showAISearch}
        onClose={() => setShowAISearch(false)}
        properties={properties}
        onSearchResults={handleAISearchResults}
      />

      <PropertyComparisonModal
        open={showComparison}
        onClose={() => setShowComparison(false)}
        properties={compareProperties}
        onRemoveProperty={onRemoveFromCompare}
        onViewProperty={(property) => {
          onPropertyClick(property)
          navigate(`/property/${property.id}`)
        }}
      />

      <EnhancedAIChatButton
        properties={properties}
        onPropertySelect={(propertyId) => {
          const property = properties.find(p => p.id === propertyId)
          if (property) {
            onPropertyClick(property)
            navigate(`/property/${propertyId}`)
          }
        }}
      />
    </div>
  )
}

// Default export for compatibility with lazy loading
export default HomePage
