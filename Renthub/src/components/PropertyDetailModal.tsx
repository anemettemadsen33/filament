import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Property, Review, PropertyAnalytics, Booking, User, ARSession } from '@/lib/types'
import { MapPin, Bed, Bathtub, ArrowsOut, Check, EnvelopeSimple, ShareNetwork, Heart, Images, CalendarCheck, Eye, Cube } from '@phosphor-icons/react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageGallery } from '@/components/ImageGallery'
import { ContactFormModal } from '@/components/ContactFormModal'
import { ReviewsSection } from '@/components/ReviewsSection'
import { PropertyAnalyticsPanel } from '@/components/PropertyAnalyticsPanel'
import { SimilarProperties } from '@/components/SimilarProperties'
import { BookingModal } from '@/components/BookingModal'
import { LandlordProfile } from '@/components/LandlordProfile'
import { SharePropertyButton } from '@/components/SharePropertyButton'
import { ARVirtualTourViewer } from '@/components/ARVirtualTourViewer'
import { ARTourBadge } from '@/components/ARTourBadge'
import { toast } from 'sonner'

interface PropertyDetailModalProps {
  property: Property | null
  open: boolean
  onClose: () => void
  isFavorite: boolean
  onToggleFavorite: (propertyId: string) => void
  reviews: Review[]
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  analytics?: PropertyAnalytics
  allProperties: Property[]
  currentUser: User | null
  onContactRequest: (propertyId: string) => void
  onBookProperty: (booking: Booking) => void
  onStartConversation: (propertyId: string, initialMessage: string) => void
  onVoteReview?: (reviewId: string, voteType: 'up' | 'down') => void
  onRespondToReview?: (reviewId: string, response: string) => void
  onSaveARSession?: (session: ARSession) => void
}

export function PropertyDetailModal({ 
  property, 
  open, 
  onClose, 
  isFavorite, 
  onToggleFavorite,
  reviews,
  onAddReview,
  analytics,
  allProperties,
  currentUser,
  onContactRequest,
  onBookProperty,
  onStartConversation,
  onVoteReview,
  onRespondToReview,
  onSaveARSession
}: PropertyDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showARTour, setShowARTour] = useState(false)

  if (!property) return null

  const handleToggleFavorite = () => {
    onToggleFavorite(property.id)
    if (!isFavorite) {
      toast.success('Added to favorites')
    } else {
      toast('Removed from favorites')
    }
  }

  const handleContactClick = () => {
    setShowContactForm(true)
    onContactRequest(property.id)
  }

  const handlePropertyClick = (clickedProperty: Property) => {
    onClose()
    setTimeout(() => {
      const event = new CustomEvent('openProperty', { detail: clickedProperty })
      window.dispatchEvent(event)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent pr-20">
            {property.title}
          </DialogTitle>
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin size={18} weight="fill" className="text-primary" />
            <span className="font-medium">{property.location}</span>
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
          
          <div className="absolute top-6 right-6 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
              className="w-11 h-11 rounded-xl border-border/50"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                size={20} 
                weight={isFavorite ? "fill" : "regular"}
                className={isFavorite ? "text-red-500" : "text-foreground"}
              />
            </Button>
            <SharePropertyButton 
              property={property} 
              variant="outline" 
              size="icon" 
              showLabel={false}
              className="w-11 h-11 rounded-xl border-border/50"
            />
          </div>
        </DialogHeader>

        <div className="space-y-8">
          <div 
            className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 shadow-xl cursor-pointer group"
            onClick={() => setShowGallery(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2">
                <Images size={20} weight="bold" />
                <span className="font-semibold">View All Photos</span>
              </div>
            </div>
            
            {property.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-md px-4 py-3 rounded-full">
                {property.images.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-8 h-2.5'
                        : 'bg-white/50 hover:bg-white/75 w-2.5 h-2.5'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
                ${property.price.toLocaleString()}
              </span>
              <span className="text-xl text-muted-foreground font-medium">
                /{property.rentalTerm === 'short-term' ? 'night' : 'month'}
              </span>
            </div>
            <div className="flex gap-2">
              <Badge className="text-base px-4 py-2 bg-primary/10 text-primary border-0 font-semibold">
                {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
              </Badge>
              <Badge className="text-base px-4 py-2 bg-accent/10 text-accent border-0 font-semibold">
                {property.rentalTerm === 'short-term' ? 'Short-term' : 'Long-term'}
              </Badge>
            </div>
          </div>

          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bed size={24} weight="fill" className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{property.bedrooms}</p>
                <p className="text-sm text-muted-foreground font-medium">Bedrooms</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bathtub size={24} weight="fill" className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{property.bathrooms}</p>
                <p className="text-sm text-muted-foreground font-medium">Bathrooms</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <ArrowsOut size={24} weight="bold" className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{property.area}</p>
                <p className="text-sm text-muted-foreground font-medium">sqft</p>
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
              Description
            </h3>
            <p className="text-muted-foreground leading-relaxed text-base">{property.description}</p>
          </div>

          {property.amenities.length > 0 && (
            <>
              <Separator className="bg-border/50" />
              <div>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/30"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check size={16} weight="bold" className="text-primary" />
                      </div>
                      <span className="text-sm font-medium">{amenity}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="bg-border/50" />

          {analytics && (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                  <h3 className="font-bold text-xl">Property Stats</h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-card border border-border/30 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 mx-auto">
                      <Eye size={24} weight="bold" className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold mb-1">{analytics.views}</p>
                    <p className="text-sm text-muted-foreground font-medium">Views</p>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border/30 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-3 mx-auto">
                      <Heart size={24} weight="bold" className="text-red-500" />
                    </div>
                    <p className="text-3xl font-bold mb-1">{analytics.favorites}</p>
                    <p className="text-sm text-muted-foreground font-medium">Favorites</p>
                  </div>
                  <div className="p-4 rounded-xl bg-card border border-border/30 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-3 mx-auto">
                      <EnvelopeSimple size={24} weight="bold" className="text-green-500" />
                    </div>
                    <p className="text-3xl font-bold mb-1">{analytics.contactRequests}</p>
                    <p className="text-sm text-muted-foreground font-medium">Contacts</p>
                  </div>
                </div>
              </div>
              <Separator className="bg-border/50" />
            </>
          )}

          {property.landlord && (
            <>
              <div>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                  About the Host
                </h3>
                <LandlordProfile landlord={property.landlord} />
              </div>
              <Separator className="bg-border/50" />
            </>
          )}

          <ReviewsSection 
            reviews={reviews}
            onAddReview={onAddReview}
            propertyId={property.id}
            onVoteReview={onVoteReview}
            onRespondToReview={onRespondToReview}
            currentUser={currentUser}
            isOwner={currentUser?.id === property.landlord?.id}
          />

          <Separator className="bg-border/50" />

          <SimilarProperties
            currentProperty={property}
            allProperties={allProperties}
            onPropertyClick={handlePropertyClick}
            favorites={[]}
            onToggleFavorite={onToggleFavorite}
          />

          <Separator className="bg-border/50" />

          <div className="space-y-3">
            <Button 
              onClick={() => setShowARTour(true)}
              variant="outline"
              className="w-full border-primary/30 hover:bg-primary/5 font-semibold group" 
              size="lg"
            >
              <Cube size={20} weight="duotone" className="mr-2 group-hover:animate-bounce" />
              Start AR Virtual Tour
              <ARTourBadge className="ml-2" />
            </Button>

            <div className="flex gap-4">
              <Button 
                onClick={() => setShowBookingModal(true)}
                className="flex-1 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300" 
                size="lg"
              >
                <CalendarCheck size={20} weight="bold" className="mr-2" />
                Reserve Now
              </Button>
              <Button 
                onClick={handleContactClick}
                variant="outline"
                className="flex-1 border-border/50 hover:bg-secondary font-semibold" 
                size="lg"
              >
                <EnvelopeSimple size={20} weight="bold" className="mr-2" />
                Contact Owner
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
      
      <ImageGallery 
        images={property.images}
        open={showGallery}
        onClose={() => setShowGallery(false)}
        initialIndex={currentImageIndex}
      />
      
      <ContactFormModal
        property={property}
        currentUser={currentUser}
        open={showContactForm}
        onClose={() => setShowContactForm(false)}
        onStartConversation={onStartConversation}
      />

      <BookingModal
        property={property}
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBook={onBookProperty}
      />

      {onSaveARSession && (
        <ARVirtualTourViewer
          property={property}
          open={showARTour}
          onClose={() => setShowARTour(false)}
          onSessionSave={onSaveARSession}
        />
      )}
    </Dialog>
  )
}
