import { Property } from '@/lib/types'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, CurrencyDollar, X } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface RecentlyViewedPanelProps {
  properties: Property[]
  onPropertyClick: (property: Property) => void
  onClearHistory: () => void
}

export function RecentlyViewedPanel({
  properties,
  onPropertyClick,
  onClearHistory
}: RecentlyViewedPanelProps) {
  const navigate = useNavigate()
  
  if (properties.length === 0) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock size={20} weight="bold" className="text-primary" />
            Recently Viewed
          </CardTitle>
          {properties.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearHistory}
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {properties.map((property) => (
              <Card
                key={property.id}
                className="group cursor-pointer hover:border-primary/50 transition-all duration-300 overflow-hidden"
                onClick={() => {
                  onPropertyClick(property)
                  navigate(`/property/${property.id}`)
                }}
              >
                <div className="flex gap-3 p-3">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                      {property.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin size={12} weight="fill" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-bold text-primary text-sm">
                        <CurrencyDollar size={14} weight="bold" />
                        {formatPrice(property.price)}
                        <span className="text-xs text-muted-foreground font-normal">/month</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {property.bedrooms} bed
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
