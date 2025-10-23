import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Property, SortOption } from '@/lib/types'
import { PropertyCard } from '@/components/PropertyCard'
import { EmptyState } from '@/components/EmptyState'
import { SortBar } from '@/components/SortBar'
import { Heart } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface FavoritesPageProps {
  properties: Property[]
  favorites: string[]
  compareList: string[]
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  onToggleFavorite: (id: string) => void
  onToggleCompare: (id: string) => void
  onPropertyClick: (property: Property) => void
}

export function FavoritesPage({
  properties,
  favorites,
  compareList,
  sortBy,
  onSortChange,
  onToggleFavorite,
  onToggleCompare,
  onPropertyClick
}: FavoritesPageProps) {
  const navigate = useNavigate()

  const favoriteProperties = useMemo(() => {
    let result = properties.filter(p => favorites.includes(p.id))

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
  }, [properties, favorites, sortBy])

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25">
            <Heart size={28} weight="fill" className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Favorite Properties</h1>
            <p className="text-muted-foreground">
              {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="space-y-6">
            <SortBar 
              value={sortBy}
              onChange={onSortChange}
              totalProperties={favoriteProperties.length}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProperties.map((property, index) => (
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
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                    isInCompare={compareList.includes(property.id)}
                    onToggleCompare={onToggleCompare}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <Heart size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">No Favorites Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring properties and save your favorites by clicking the heart icon.
              </p>
              <Button onClick={() => navigate('/')}>
                Browse Properties
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
