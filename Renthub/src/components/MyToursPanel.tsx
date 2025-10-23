import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertyTour, Property } from '@/lib/types'
import { Calendar, Clock, MapPin, Video, Key, XCircle, CreditCard } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { getTourStatusColor, getTourStatusLabel, canCancelTour } from '@/lib/tourUtils'
import { TourDetailModal } from './TourDetailModal'
import { TourPaymentModal } from './TourPaymentModal'

interface MyToursPanelProps {
  tours: PropertyTour[]
  properties: Property[]
  userId: string
  onCancelTour: (tourId: string, reason: string) => void
  onPayForTour: (tourId: string, paymentType: 'deposit' | 'full', paymentDetails: any) => void
}

export function MyToursPanel({
  tours,
  properties,
  userId,
  onCancelTour,
  onPayForTour
}: MyToursPanelProps) {
  const [selectedTour, setSelectedTour] = useState<PropertyTour | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const upcomingTours = tours.filter(t => 
    t.status === 'confirmed' && 
    t.confirmedDate && 
    t.confirmedDate > Date.now()
  )
  
  const pendingTours = tours.filter(t => 
    t.status === 'pending' || t.status === 'payment_required'
  )
  
  const completedTours = tours.filter(t => t.status === 'completed')
  
  const cancelledTours = tours.filter(t => 
    t.status === 'cancelled' || t.status === 'rejected'
  )

  const getTourTypeIcon = (type: PropertyTour['tourType']) => {
    switch (type) {
      case 'in-person':
        return <MapPin className="w-4 h-4" />
      case 'virtual':
        return <Video className="w-4 h-4" />
      case 'self-guided':
        return <Key className="w-4 h-4" />
    }
  }

  const getTourTypeName = (type: PropertyTour['tourType']) => {
    switch (type) {
      case 'in-person':
        return 'In-Person'
      case 'virtual':
        return 'Virtual'
      case 'self-guided':
        return 'Self-Guided'
    }
  }

  const handleViewDetails = (tour: PropertyTour) => {
    setSelectedTour(tour)
    setShowDetailModal(true)
  }

  const handlePayForTour = (tour: PropertyTour) => {
    setSelectedTour(tour)
    setShowPaymentModal(true)
  }

  const handleCancelTour = (tour: PropertyTour) => {
    if (!canCancelTour(tour, userId)) {
      return
    }

    const reason = prompt('Please provide a reason for cancellation:')
    if (reason) {
      onCancelTour(tour.id, reason)
    }
  }

  const renderTourCard = (tour: PropertyTour) => {
    const property = properties.find(p => p.id === tour.propertyId)
    const tourDate = tour.confirmedDate || tour.preferredDate
    const canCancel = canCancelTour(tour, userId)
    const needsPayment = tour.status === 'payment_required'

    return (
      <Card key={tour.id} className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            {property?.images[0] && (
              <img
                src={property.images[0]}
                alt={tour.propertyTitle}
                className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate mb-1">{tour.propertyTitle}</h3>
                  <p className="text-sm text-muted-foreground truncate">{tour.propertyAddress}</p>
                </div>
                <Badge className={getTourStatusColor(tour.status)}>
                  {getTourStatusLabel(tour.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{format(tourDate, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{format(tourDate, 'h:mm a')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getTourTypeIcon(tour.tourType)}
                  <span>{getTourTypeName(tour.tourType)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{tour.duration} min</span>
                </div>
              </div>

              {needsPayment && (
                <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-warning-foreground" />
                      <span className="text-sm font-medium">Payment Required</span>
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handlePayForTour(tour)}
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              )}

              {tour.paymentStatus && tour.paymentStatus !== 'not_paid' && (
                <div className="flex items-center gap-2 mb-4 p-2 bg-accent/10 rounded border border-accent/20">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <span className="text-sm">
                    {tour.paymentStatus === 'deposit_paid' && 'Deposit Paid'}
                    {tour.paymentStatus === 'full_payment' && 'Paid in Full'}
                  </span>
                  {tour.paidAmount && (
                    <span className="ml-auto font-semibold text-sm">${tour.paidAmount}</span>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(tour)}
                  className="flex-1"
                >
                  View Details
                </Button>

                {canCancel && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelTour(tour)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Tours</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="upcoming" className="relative">
                Upcoming
                {upcomingTours.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {upcomingTours.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingTours.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center" variant="destructive">
                    {pendingTours.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedTours.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledTours.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 mt-6">
              {upcomingTours.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming tours</p>
                </div>
              ) : (
                upcomingTours.map(renderTourCard)
              )}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingTours.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending tours</p>
                </div>
              ) : (
                pendingTours.map(renderTourCard)
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedTours.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No completed tours</p>
                </div>
              ) : (
                completedTours.map(renderTourCard)
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4 mt-6">
              {cancelledTours.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <XCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No cancelled tours</p>
                </div>
              ) : (
                cancelledTours.map(renderTourCard)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedTour && (
        <>
          <TourDetailModal
            open={showDetailModal}
            onClose={() => {
              setShowDetailModal(false)
              setSelectedTour(null)
            }}
            tour={selectedTour}
            property={properties.find(p => p.id === selectedTour.propertyId)}
          />

          <TourPaymentModal
            open={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false)
              setSelectedTour(null)
            }}
            tour={selectedTour}
            onPayment={(paymentType, paymentDetails) => {
              onPayForTour(selectedTour.id, paymentType, paymentDetails)
              setShowPaymentModal(false)
              setSelectedTour(null)
            }}
          />
        </>
      )}
    </>
  )
}
