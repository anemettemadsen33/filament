import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Property, Review, PropertyAnalytics, Booking, User, PriceHistory } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ReviewsSection } from '@/components/ReviewsSection'
import { SimilarProperties } from '@/components/SimilarProperties'
import { PriceHistoryChart } from '@/components/PriceHistoryChart'
import { MarketInsights } from '@/components/MarketInsights'
import { PriceAlertModal, PriceAlert } from '@/components/PriceAlertModal'
import { LandlordProfile } from '@/components/LandlordProfile'
import { VirtualTourGallery } from '@/components/VirtualTourGallery'
import { PropertyLocationMap } from '@/components/PropertyLocationMap'
import { SharePropertyButton } from '@/components/SharePropertyButton'
import { generatePriceHistory } from '@/lib/priceHistoryUtils'
import { ArrowLeft, Heart, MapPin, Bed, Bathtub, Ruler, Calendar, User as UserIcon, Eye, Phone, Scales, Bell, CheckCircle, Key } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Separator } from '@/components/ui/separator'

interface PropertyDetailsPageProps {
  properties: Property[]
  favorites: string[]
  reviews: Review[]
  analytics: Record<string, PropertyAnalytics>
  compareList: string[]
  currentUser?: User | null
  onToggleFavorite: (id: string) => void
  onToggleCompare: (id: string) => void
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  onContactRequest: (propertyId: string) => void
  onBookProperty: (booking: Booking) => void
  onTrackView: (propertyId: string) => void
  onStartConversation?: (propertyId: string, initialMessage: string) => void
  onVoteReview?: (reviewId: string, voteType: 'up' | 'down') => void
  onRespondToReview?: (reviewId: string, response: string) => void
}

export function PropertyDetailsPage({
  properties,
  favorites,
  reviews,
  analytics,
  compareList,
  currentUser,
  onToggleFavorite,
  onToggleCompare,
  onAddReview,
  onContactRequest,
  onBookProperty,
  onTrackView,
  onStartConversation,
  onVoteReview,
  onRespondToReview
}: PropertyDetailsPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [priceHistoryData, setPriceHistoryData] = useLocalStorage<Record<string, PriceHistory>>('price-history', {})
  const [priceAlerts, setPriceAlerts] = useLocalStorage<PriceAlert[]>('price-alerts', [])
  const [showAlertModal, setShowAlertModal] = useState(false)

  const property = properties.find(p => p.id === id)
  const propertyReviews = reviews.filter(r => r.propertyId === id)
  const propertyAnalytics = id ? analytics[id] : undefined
  const isFavorite = id ? favorites.includes(id) : false
  const isInCompare = id ? compareList.includes(id) : false

  const priceHistory = useMemo(() => {
    if (!property || !id) return null
    
    if (priceHistoryData && priceHistoryData[id]) {
      return priceHistoryData[id]
    }
    
    const generated = generatePriceHistory(property)
    setPriceHistoryData((current) => ({
      ...current,
      [id]: generated
    }))
    return generated
  }, [property, id, priceHistoryData])

  useEffect(() => {
    if (id && property) {
      onTrackView(id)
    }
  }, [id])

  const handleSetAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    }
    setPriceAlerts((current) => [newAlert, ...(current || [])])
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg overflow-hidden">
                {property.images.slice(0, 4).map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`${property.title} ${idx + 1}`}
                    className={`w-full h-64 object-cover ${idx === 0 ? 'col-span-2 h-96' : ''}`}
                  />
                ))}
              </div>

              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold">{property.title}</h1>
                      <div className="flex gap-2">
                        <Badge variant={property.available ? 'default' : 'secondary'}>
                          {property.available ? 'Available' : 'Unavailable'}
                        </Badge>
                        <Badge className={property.rentalTerm === 'short-term' ? 'bg-blue-500' : 'bg-purple-500'}>
                          {property.rentalTerm === 'short-term' ? 'Short-term' : 'Long-term'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base text-muted-foreground">
                      <MapPin size={18} weight="fill" className="text-accent" />
                      <span>{property.location}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`, '_blank')
                        }}
                      >
                        View on Google Maps
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onToggleFavorite(property.id)}
                      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart size={20} weight={isFavorite ? 'fill' : 'regular'} className={isFavorite ? 'text-red-500' : ''} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onToggleCompare(property.id)}
                      aria-label={isInCompare ? "Remove from comparison" : "Add to comparison"}
                      title={isInCompare ? "Remove from comparison" : "Add to comparison"}
                    >
                      <Scales size={20} weight={isInCompare ? 'fill' : 'regular'} className={isInCompare ? 'text-accent' : ''} />
                    </Button>
                    <SharePropertyButton 
                      property={property} 
                      variant="outline" 
                      size="icon" 
                      showLabel={false}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Bed size={20} className="text-primary" />
                    <span className="text-sm">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bathtub size={20} className="text-primary" />
                    <span className="text-sm">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler size={20} className="text-primary" />
                    <span className="text-sm">{property.area} sqft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    <span className="text-sm">{property.type}</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {property.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="justify-center">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {property.lockbox?.enabled && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle size={24} className="text-accent" weight="fill" />
                        Self Check-In Available
                      </h2>
                      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Key size={24} weight="bold" className="text-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-2">Easy keyless check-in</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                              Check yourself in with the {property.lockbox.type === 'combination_lock' ? 'keypad' : property.lockbox.type === 'smart_lock' ? 'smart lock' : 'lockbox'}. You'll receive a unique access code after booking.
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle size={16} weight="fill" className="text-accent" />
                              <span>No need to coordinate with the host</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {propertyAnalytics && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Property Stats</h2>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-secondary/50 rounded-lg">
                          <Eye size={24} className="mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{propertyAnalytics.views || 0}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center p-4 bg-secondary/50 rounded-lg">
                          <Heart size={24} className="mx-auto mb-2 text-red-500" />
                          <p className="text-2xl font-bold">{propertyAnalytics.favorites || 0}</p>
                          <p className="text-xs text-muted-foreground">Favorites</p>
                        </div>
                        <div className="text-center p-4 bg-secondary/50 rounded-lg">
                          <Phone size={24} className="mx-auto mb-2 text-accent" />
                          <p className="text-2xl font-bold">{propertyAnalytics.contactRequests || 0}</p>
                          <p className="text-xs text-muted-foreground">Contacts</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </Card>

              {property.virtualTours && property.virtualTours.length > 0 && (
                <Card className="p-6">
                  <VirtualTourGallery tours={property.virtualTours} propertyTitle={property.title} />
                </Card>
              )}

              <PropertyLocationMap location={property.location} title={property.title} />

              {property.landlord && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About the Host</h2>
                  <LandlordProfile landlord={property.landlord} />
                </Card>
              )}

              <ReviewsSection
                reviews={propertyReviews}
                propertyId={property.id}
                onAddReview={onAddReview}
                onVoteReview={onVoteReview}
                onRespondToReview={onRespondToReview}
                currentUser={currentUser}
                isOwner={currentUser?.id === property.landlord?.id}
              />

              {priceHistory && (
                <div className="space-y-6">
                  <PriceHistoryChart
                    priceHistory={priceHistory}
                    currentPrice={property.price}
                  />
                  <MarketInsights
                    priceHistory={priceHistory}
                    property={property}
                    allProperties={properties}
                  />
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-4xl font-bold text-primary">
                    ${property.price.toLocaleString()}
                    <span className="text-base font-normal text-muted-foreground">
                      /{property.rentalTerm === 'short-term' ? 'night' : 'month'}
                    </span>
                  </p>
                </div>

                {property.landlord && (
                  <>
                    <Separator className="my-4" />
                    <div className="mb-6">
                      <p className="text-sm font-semibold mb-3">Hosted by</p>
                      <LandlordProfile landlord={property.landlord} compact />
                    </div>
                  </>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate(`/booking/${property.id}`)}
                    className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
                    size="lg"
                    disabled={!property.available}
                  >
                    <Calendar size={20} className="mr-2" />
                    Book Now
                  </Button>
                  <Button
                    onClick={() => navigate(`/contact/${property.id}`)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Phone size={20} className="mr-2" />
                    Contact Owner
                  </Button>
                  <Button
                    onClick={() => setShowAlertModal(true)}
                    variant="secondary"
                    className="w-full"
                    size="lg"
                  >
                    <Bell size={20} className="mr-2" />
                    Set Price Alert
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <SimilarProperties
              currentProperty={property}
              allProperties={properties}
              favorites={favorites}
              onPropertyClick={(p) => navigate(`/property/${p.id}`)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        </motion.div>
      </div>

      <PriceAlertModal
        open={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        propertyId={property.id}
        propertyTitle={property.title}
        currentPrice={property.price}
        onSetAlert={handleSetAlert}
      />
    </div>
  )
}
