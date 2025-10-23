import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Property } from '@/lib/types'
import { PropertyCard } from '@/components/PropertyCard'
import { EnhancedAIChatButton } from '@/components/EnhancedAIChatButton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, TrendUp, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface ExplorePageProps {
  properties: Property[]
  favorites: string[]
  compareList: string[]
  onToggleFavorite: (id: string) => void
  onToggleCompare: (id: string) => void
  onPropertyClick: (property: Property) => void
}

export function ExplorePage({
  properties,
  favorites,
  compareList,
  onToggleFavorite,
  onToggleCompare,
  onPropertyClick
}: ExplorePageProps) {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<'trending' | 'new' | 'luxury' | 'budget'>('trending')

  const topLocations = useMemo(() => {
    const locationCount: Record<string, number> = {}
    properties.forEach(p => {
      const city = p.location.split(',')[0].trim()
      locationCount[city] = (locationCount[city] || 0) + 1
    })
    return Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([city, count]) => ({ city, count }))
  }, [properties])

  const categorizedProperties = useMemo(() => {
    switch (selectedCategory) {
      case 'trending':
        return [...properties].sort((a, b) => b.createdAt - a.createdAt).slice(0, 12)
      case 'new':
        return [...properties].sort((a, b) => b.createdAt - a.createdAt).slice(0, 12)
      case 'luxury':
        return [...properties]
          .filter(p => p.price > 2000)
          .sort((a, b) => b.price - a.price)
          .slice(0, 12)
      case 'budget':
        return [...properties]
          .filter(p => p.price < 1000)
          .sort((a, b) => a.price - b.price)
          .slice(0, 12)
      default:
        return properties.slice(0, 12)
    }
  }, [properties, selectedCategory])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-[1600px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/25">
            <Sparkle size={28} weight="fill" className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Explore Properties</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Discover trending locations and featured listings</p>
          </div>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin size={24} className="text-primary" weight="fill" />
            Popular Locations
          </h2>
          <div className="overflow-x-auto -mx-6 px-6 pb-2">
            <div className="flex gap-3 min-w-max">
              {topLocations.map(({ city, count }) => (
                <Button
                  key={city}
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-3 px-4 min-w-[140px] whitespace-nowrap"
                >
                  <span className="font-semibold text-sm">{city}</span>
                  <Badge variant="secondary" className="text-xs">
                    {count} {count === 1 ? 'property' : 'properties'}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendUp size={24} className="text-accent" weight="bold" />
            <h2 className="text-xl sm:text-2xl font-bold">Featured Collections</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'trending' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('trending')}
              className="text-sm sm:text-base"
            >
              Trending Now
            </Button>
            <Button
              variant={selectedCategory === 'new' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('new')}
              className="text-sm sm:text-base"
            >
              Newly Listed
            </Button>
            <Button
              variant={selectedCategory === 'luxury' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('luxury')}
              className="text-sm sm:text-base"
            >
              Luxury Properties
            </Button>
            <Button
              variant={selectedCategory === 'budget' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('budget')}
              className="text-sm sm:text-base"
            >
              Budget Friendly
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {categorizedProperties.map((property, index) => (
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
                onToggleCompare={onToggleCompare}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

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
