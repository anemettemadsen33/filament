import { Property } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { X, MapPin, Bed, Bathtub, Ruler, CurrencyDollar, Check, Minus } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface PropertyComparisonModalProps {
  properties: Property[]
  open: boolean
  onClose: () => void
  onRemoveProperty: (propertyId: string) => void
  onViewProperty: (property: Property) => void
}

export function PropertyComparisonModal({
  properties,
  open,
  onClose,
  onRemoveProperty,
  onViewProperty
}: PropertyComparisonModalProps) {
  if (properties.length === 0) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const allAmenities = Array.from(
    new Set(properties.flatMap(p => p.amenities))
  ).sort()

  const comparisonRows = [
    {
      label: 'Price',
      icon: CurrencyDollar,
      getValue: (p: Property) => formatPrice(p.price),
      highlight: true
    },
    {
      label: 'Location',
      icon: MapPin,
      getValue: (p: Property) => p.location
    },
    {
      label: 'Type',
      icon: null,
      getValue: (p: Property) => p.type.charAt(0).toUpperCase() + p.type.slice(1)
    },
    {
      label: 'Bedrooms',
      icon: Bed,
      getValue: (p: Property) => `${p.bedrooms} bed${p.bedrooms !== 1 ? 's' : ''}`
    },
    {
      label: 'Bathrooms',
      icon: Bathtub,
      getValue: (p: Property) => `${p.bathrooms} bath${p.bathrooms !== 1 ? 's' : ''}`
    },
    {
      label: 'Area',
      icon: Ruler,
      getValue: (p: Property) => `${p.area.toLocaleString()} sq ft`
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Compare Properties</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              aria-label="Close comparison"
              title="Close comparison"
            >
              <X size={20} />
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Side-by-side comparison of {properties.length} properties
          </p>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-140px)]">
          <div className="p-6">
            <div className="grid gap-6" style={{ gridTemplateColumns: `200px repeat(${properties.length}, 1fr)` }}>
              <div className="sticky left-0 bg-background z-10">
                <div className="h-48 mb-4" />
                {comparisonRows.map((row, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 h-16 font-semibold text-sm ${
                      row.highlight ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {row.icon && <row.icon size={18} weight="bold" />}
                    {row.label}
                  </div>
                ))}
                
                <div className="mt-8">
                  <div className="font-semibold text-sm mb-4">Amenities</div>
                  {allAmenities.map((amenity, idx) => (
                    <div key={idx} className="h-12 flex items-center text-sm text-muted-foreground">
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              {properties.map((property) => (
                <div key={property.id} className="space-y-4">
                  <Card className="overflow-hidden group">
                    <div className="relative h-48">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full bg-background/90 backdrop-blur-sm"
                          onClick={() => onRemoveProperty(property.id)}
                          aria-label="Remove from comparison"
                          title="Remove from comparison"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-white text-sm line-clamp-2 mb-1">
                          {property.title}
                        </h3>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-7 text-xs"
                          onClick={() => onViewProperty(property)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {comparisonRows.map((row, idx) => (
                    <div
                      key={idx}
                      className={`h-16 flex items-center justify-center text-center px-2 rounded-lg ${
                        row.highlight ? 'bg-primary/5 font-bold text-primary' : 'bg-muted/30'
                      }`}
                    >
                      <span className="text-sm">{row.getValue(property)}</span>
                    </div>
                  ))}

                  <div className="mt-8 space-y-2">
                    <div className="h-4" />
                    {allAmenities.map((amenity, idx) => (
                      <div key={idx} className="h-12 flex items-center justify-center">
                        {property.amenities.includes(amenity) ? (
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Check size={18} weight="bold" className="text-green-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Minus size={18} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
