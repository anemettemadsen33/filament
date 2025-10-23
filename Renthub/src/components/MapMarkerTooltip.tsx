import { PropertyWithLocation } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bed, Bathtub, ArrowsOut, ArrowRight } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface MapMarkerTooltipProps {
  property: PropertyWithLocation
  onViewDetails: () => void
  onClose: () => void
}

export function MapMarkerTooltip({ property, onViewDetails, onClose }: MapMarkerTooltipProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="w-80 overflow-hidden shadow-2xl border-border/50 bg-card/98 backdrop-blur-sm">
          <div className="relative h-32 overflow-hidden">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {!property.available && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 right-2 shadow-lg"
              >
                Not Available
              </Badge>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-base line-clamp-1">{property.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1 -mr-2 flex-shrink-0"
                onClick={onClose}
                aria-label="Close tooltip"
                title="Close tooltip"
              >
                <ArrowRight size={14} />
              </Button>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <MapPin size={14} />
              <span className="line-clamp-1">{property.location}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {property.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {property.rentalTerm === 'short-term' ? 'Short-term' : 'Long-term'}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Bed size={14} />
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Bathtub size={14} />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowsOut size={14} />
                <span>{property.area}m²</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <span className="text-xl font-bold text-primary">€{property.price}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  /{property.rentalTerm === 'short-term' ? 'night' : 'month'}
                </span>
              </div>
              <Button size="sm" onClick={onViewDetails} className="gap-2">
                View Details
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
