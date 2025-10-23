import { useState } from 'react'
import { Property, PropertyAnalytics, Booking } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Buildings, 
  Eye, 
  Heart, 
  EnvelopeSimple, 
  TrendUp, 
  Pencil, 
  Trash,
  CalendarCheck,
  MapPin,
  CheckCircle,
  XCircle
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface MyPropertiesPanelProps {
  properties: Property[]
  analytics: Record<string, PropertyAnalytics>
  bookings: Booking[]
  currentUserId: string
  onViewProperty: (property: Property) => void
  onEditProperty?: (property: Property) => void
  onDeleteProperty: (propertyId: string) => void
  onToggleAvailability: (propertyId: string) => void
}

export function MyPropertiesPanel({ 
  properties, 
  analytics, 
  bookings,
  currentUserId,
  onViewProperty,
  onEditProperty,
  onDeleteProperty,
  onToggleAvailability
}: MyPropertiesPanelProps) {
  const [expandedProperty, setExpandedProperty] = useState<string | null>(null)

  const userProperties = properties.filter(p => p.ownerEmail === currentUserId || p.id.includes(currentUserId))
  const sortedProperties = [...userProperties].sort((a, b) => b.createdAt - a.createdAt)

  const handleDeleteProperty = (property: Property) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${property.title}"? This action cannot be undone.`)
    if (confirmed) {
      onDeleteProperty(property.id)
      toast.success('Property deleted successfully')
    }
  }

  const handleToggleAvailability = (property: Property) => {
    onToggleAvailability(property.id)
    toast.success(property.available ? 'Property marked as unavailable' : 'Property marked as available')
  }

  const getPropertyBookings = (propertyId: string) => {
    return bookings.filter(b => b.propertyId === propertyId && b.status !== 'cancelled')
  }

  const getPropertyStats = (propertyId: string) => {
    const stats = analytics[propertyId]
    const propertyBookings = getPropertyBookings(propertyId)
    
    return {
      views: stats?.views || 0,
      favorites: stats?.favorites || 0,
      contacts: stats?.contactRequests || 0,
      bookings: propertyBookings.length
    }
  }

  if (userProperties.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto mb-6">
              <Buildings size={40} weight="bold" className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Properties Listed</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              You haven't listed any properties yet. Start earning by listing your first property!
            </p>
            <Button 
              onClick={() => window.dispatchEvent(new CustomEvent('openAddPropertyModal'))}
              className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold"
            >
              List Your First Property
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Buildings size={20} weight="bold" className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Properties</h2>
            <p className="text-sm text-muted-foreground">{userProperties.length} {userProperties.length === 1 ? 'listing' : 'listings'}</p>
          </div>
        </div>
        <Button 
          onClick={() => window.dispatchEvent(new CustomEvent('openAddPropertyModal'))}
          className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold"
        >
          Add Property
        </Button>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4 pr-4">
          <AnimatePresence mode="popLayout">
            {sortedProperties.map((property, index) => {
              const stats = getPropertyStats(property.id)
              const isExpanded = expandedProperty === property.id
              const propertyBookings = getPropertyBookings(property.id)

              return (
                <motion.div
                  key={property.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05,
                    layout: { duration: 0.3 }
                  }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <CardTitle className="text-lg font-bold text-foreground">
                              {property.title}
                            </CardTitle>
                            <Badge className={property.available ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                              {property.available ? (
                                <>
                                  <CheckCircle size={14} weight="bold" className="mr-1" />
                                  Available
                                </>
                              ) : (
                                <>
                                  <XCircle size={14} weight="bold" className="mr-1" />
                                  Unavailable
                                </>
                              )}
                            </Badge>
                            <Badge variant="outline" className="font-semibold">
                              {property.rentalTerm === 'short-term' ? 'Short-term' : 'Long-term'}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <MapPin size={14} weight="bold" />
                            <span>{property.location}</span>
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewProperty(property)}
                          className="h-9"
                        >
                          <Eye size={16} weight="bold" className="mr-2" />
                          View
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-2xl font-bold text-primary mb-1">
                          ${property.price.toLocaleString()}
                          <span className="text-sm text-muted-foreground font-normal ml-1">
                            / {property.rentalTerm === 'short-term' ? 'night' : 'month'}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {property.bedrooms} bed • {property.bathrooms} bath • {property.area} m²
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <p className="text-sm font-semibold text-foreground mb-3">Performance</p>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Eye size={16} weight="bold" className="text-primary" />
                            </div>
                            <p className="text-lg font-bold text-foreground">{stats.views}</p>
                            <p className="text-xs text-muted-foreground">Views</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Heart size={16} weight="bold" className="text-red-500" />
                            </div>
                            <p className="text-lg font-bold text-foreground">{stats.favorites}</p>
                            <p className="text-xs text-muted-foreground">Favorites</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-accent/5 border border-accent/10">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <EnvelopeSimple size={16} weight="bold" className="text-accent" />
                            </div>
                            <p className="text-lg font-bold text-foreground">{stats.contacts}</p>
                            <p className="text-xs text-muted-foreground">Contacts</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <CalendarCheck size={16} weight="bold" className="text-green-500" />
                            </div>
                            <p className="text-lg font-bold text-foreground">{stats.bookings}</p>
                            <p className="text-xs text-muted-foreground">Bookings</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleAvailability(property)}
                          className="flex-1"
                        >
                          {property.available ? 'Mark Unavailable' : 'Mark Available'}
                        </Button>
                        {onEditProperty && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditProperty(property)}
                          >
                            <Pencil size={16} weight="bold" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProperty(property)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash size={16} weight="bold" />
                        </Button>
                      </div>

                      {propertyBookings.length > 0 && (
                        <>
                          <motion.div layout>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedProperty(isExpanded ? null : property.id)}
                              className="w-full"
                            >
                              {isExpanded ? 'Hide Bookings' : `Show Bookings (${propertyBookings.length})`}
                            </Button>
                          </motion.div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-3 overflow-hidden"
                              >
                                <Separator />
                                <div className="space-y-2">
                                  <p className="text-sm font-semibold text-foreground">Recent Bookings</p>
                                  {propertyBookings.slice(0, 3).map((booking) => (
                                    <div key={booking.id} className="p-3 rounded-lg bg-muted/50 border border-border/30">
                                      <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-semibold text-foreground">{booking.customerName}</p>
                                        <Badge className={booking.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                                          {booking.status}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                                      <p className="text-sm font-bold text-primary mt-2">${booking.totalPrice.toLocaleString()}</p>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}
