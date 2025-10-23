import { useState, useEffect } from 'react'
import { Property, Recommendation } from '@/lib/types'
import { PropertyCard } from './PropertyCard'
import { Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Skeleton } from './ui/skeleton'

interface SmartRecommendationsProps {
  currentProperty?: Property
  allProperties: Property[]
  favorites: string[]
  recentlyViewed: string[]
  userPreferences?: {
    propertyType?: string
    rentalTerm?: string
    priceRange?: { min: number; max: number }
    bedrooms?: string
  }
  onPropertyClick: (property: Property) => void
  onToggleFavorite: (propertyId: string) => void
  onToggleCompare: (propertyId: string) => void
  compareList: string[]
  maxRecommendations?: number
}

export function SmartRecommendations({
  currentProperty,
  allProperties,
  favorites,
  recentlyViewed,
  userPreferences,
  onPropertyClick,
  onToggleFavorite,
  onToggleCompare,
  compareList,
  maxRecommendations = 3,
}: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [reasons, setReasons] = useState<Record<string, string[]>>({})

  useEffect(() => {
    generateRecommendations()
  }, [currentProperty, favorites, recentlyViewed, userPreferences])

  const generateRecommendations = async () => {
    setLoading(true)

    try {
      const availableProperties = allProperties.filter(
        p => p.available && p.id !== currentProperty?.id
      )

      if (availableProperties.length === 0) {
        setRecommendations([])
        setLoading(false)
        return
      }

      const scoredProperties: Array<{ property: Property; score: number; reasons: string[] }> = []

      for (const property of availableProperties) {
        let score = 0
        const propertyReasons: string[] = []

        if (currentProperty) {
          if (property.type === currentProperty.type) {
            score += 30
            propertyReasons.push('Same property type')
          }

          if (property.location === currentProperty.location) {
            score += 25
            propertyReasons.push('Same neighborhood')
          }

          if (property.rentalTerm === currentProperty.rentalTerm) {
            score += 20
            propertyReasons.push('Same rental term')
          }

          const priceDiff = Math.abs(property.price - currentProperty.price)
          if (priceDiff < currentProperty.price * 0.2) {
            score += 15
            propertyReasons.push('Similar price range')
          }

          if (property.bedrooms === currentProperty.bedrooms) {
            score += 10
            propertyReasons.push('Same number of bedrooms')
          }
        }

        if (favorites.length > 0) {
          const favoriteProperties = allProperties.filter(p => favorites.includes(p.id))
          const mostCommonType = getMostCommon(favoriteProperties.map(p => p.type))
          const mostCommonLocation = getMostCommon(favoriteProperties.map(p => p.location))

          if (property.type === mostCommonType) {
            score += 20
            propertyReasons.push('Matches your favorite property type')
          }

          if (property.location === mostCommonLocation) {
            score += 15
            propertyReasons.push('In your preferred area')
          }
        }

        if (userPreferences) {
          if (userPreferences.propertyType && userPreferences.propertyType !== 'all' && property.type === userPreferences.propertyType) {
            score += 25
            propertyReasons.push('Matches your preference')
          }

          if (userPreferences.rentalTerm && userPreferences.rentalTerm !== 'all' && property.rentalTerm === userPreferences.rentalTerm) {
            score += 20
            propertyReasons.push('Preferred rental term')
          }

          if (userPreferences.priceRange) {
            const { min, max } = userPreferences.priceRange
            if (property.price >= min && property.price <= max) {
              score += 15
              propertyReasons.push('Within your budget')
            }
          }

          if (userPreferences.bedrooms && userPreferences.bedrooms !== 'all' && property.bedrooms.toString() === userPreferences.bedrooms) {
            score += 10
            propertyReasons.push('Right number of bedrooms')
          }
        }

        if (recentlyViewed.length > 0 && !recentlyViewed.includes(property.id)) {
          const viewedProperties = allProperties.filter(p => recentlyViewed.slice(0, 5).includes(p.id))
          const avgPrice = viewedProperties.reduce((sum, p) => sum + p.price, 0) / viewedProperties.length
          
          if (Math.abs(property.price - avgPrice) < avgPrice * 0.3) {
            score += 10
            propertyReasons.push('Similar to what you\'ve viewed')
          }
        }

        if (property.views && property.views > 50) {
          score += 5
          propertyReasons.push('Popular choice')
        }

        if (property.amenities && property.amenities.length > 5) {
          score += 5
          propertyReasons.push('Well-equipped')
        }

        if (property.createdAt > Date.now() - 7 * 24 * 60 * 60 * 1000) {
          score += 5
          propertyReasons.push('Newly listed')
        }

        if (score > 0) {
          scoredProperties.push({ property, score, reasons: propertyReasons.slice(0, 3) })
        }
      }

      scoredProperties.sort((a, b) => b.score - a.score)

      const topRecommendations = scoredProperties.slice(0, maxRecommendations)
      setRecommendations(topRecommendations.map(r => r.property))
      
      const reasonsMap: Record<string, string[]> = {}
      topRecommendations.forEach(r => {
        reasonsMap[r.property.id] = r.reasons
      })
      setReasons(reasonsMap)

    } catch (error) {
      console.error('Error generating recommendations:', error)
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }

  const getMostCommon = <T,>(arr: T[]): T | undefined => {
    if (arr.length === 0) return undefined
    const counts = new Map<T, number>()
    arr.forEach(item => counts.set(item, (counts.get(item) || 0) + 1))
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0][0]
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkle size={24} weight="fill" className="text-primary" />
          <h2 className="text-2xl font-bold">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-2xl" />
          ))}
        </div>
      </section>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkle size={20} weight="fill" className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Recommended for You</h2>
          <p className="text-sm text-muted-foreground">
            Based on your preferences and browsing history
          </p>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PropertyCard
              property={property}
              isFavorite={favorites.includes(property.id)}
              isInCompare={compareList.includes(property.id)}
              onClick={() => onPropertyClick(property)}
              onToggleFavorite={onToggleFavorite}
              onToggleCompare={onToggleCompare}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
