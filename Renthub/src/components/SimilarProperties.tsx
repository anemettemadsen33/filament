import { Property } from '@/lib/types'
import { PropertyCard } from '@/components/PropertyCard'
import { motion } from 'framer-motion'
import { Sparkle } from '@phosphor-icons/react'

interface SimilarPropertiesProps {
  currentProperty: Property
  allProperties: Property[]
  onPropertyClick: (property: Property) => void
  favorites: string[]
  onToggleFavorite: (propertyId: string) => void
}

export function SimilarProperties({ 
  currentProperty, 
  allProperties, 
  onPropertyClick,
  favorites,
  onToggleFavorite 
}: SimilarPropertiesProps) {
  const getSimilarProperties = (): Property[] => {
    const similar = allProperties
      .filter(p => p.id !== currentProperty.id)
      .map(property => {
        let score = 0
        
        if (property.type === currentProperty.type) score += 3
        if (Math.abs(property.price - currentProperty.price) < currentProperty.price * 0.2) score += 2
        if (property.bedrooms === currentProperty.bedrooms) score += 2
        if (property.location === currentProperty.location) score += 4
        if (Math.abs(property.area - currentProperty.area) < currentProperty.area * 0.2) score += 1
        
        const commonAmenities = property.amenities.filter(a => 
          currentProperty.amenities.includes(a)
        ).length
        score += commonAmenities * 0.5
        
        return { property, score }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.property)

    return similar
  }

  const similarProperties = getSimilarProperties()

  if (similarProperties.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-xl flex items-center gap-2">
        <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
        Similar Properties
        <Sparkle size={20} weight="fill" className="text-accent ml-1" />
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {similarProperties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PropertyCard
              property={property}
              onClick={() => onPropertyClick(property)}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
