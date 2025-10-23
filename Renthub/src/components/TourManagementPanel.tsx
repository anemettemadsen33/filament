import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertyTour, Property } from '@/lib/types'
import { Calendar, Clock, Phone, MapPin, Video, Key, CheckCircle, XCircle, CreditCard, User } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { getTourStatusColor, getTourStatusLabel } from '@/lib/tourUtils'
import { toast } from 'sonner'
import { TourDetailModal } from './TourDetailModal'

interface TourManagementPanelProps {
  tours: PropertyTour[]
  properties: Property[]
  onConfirmTour: (tourId: string, confirmedDate: number) => void
  onRejectTour: (tourId: string, reason: string) => void
  onCancelTour: (tourId: string, reason: string) => void
  onCompleteTour: (tourId: string) => void
}

export function TourManagementPanel({
  tours,
  properties,
  onConfirmTour,
  onRejectTour,
  onCancelTour,
  onCompleteTour
}: TourManagementPanelProps) {
  const [selectedTour, setSelectedTour] = useState<PropertyTour | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const pendingTours = tours.filter(t => t.status === 'pending')
  const paymentRequiredTours = tours.filter(t => t.status === 'payment_required')
  const confirmedTours = tours.filter(t => t.status === 'confirmed')
  const completedTours = tours.filter(t => t.status === 'completed')
  const cancelledTours = tours.filter(t => t.status === 'cancelled' || t.status === 'rejected')

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

  const renderTourCard = (tour: PropertyTour) => {
    const property = properties.find(p => p.id === tour.propertyId)
    const isPending = tour.status === 'pending'
    const isPaymentRequired = tour.status === 'payment_required'
    const isConfirmed = tour.status === 'confirmed'
    const tourDate = tour.confirmedDate || tour.preferredDate

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
                  <User className="w-4 h-4" />
                  <span>{tour.numberOfAttendees || 1} attendee(s)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={''} />
                  <AvatarFallback>{tour.requesterName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{tour.requesterName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{tour.requesterPhone}</span>
                  </div>
                </div>
              </div>

              {tour.paymentRequired && tour.paymentStatus && (
                <div className="flex items-center gap-2 mb-4 p-2 bg-accent/10 rounded border border-accent/20">
                  <CreditCard className="w-4 h-4 text-accent" />
                  <span className="text-sm">
                    {tour.paymentStatus === 'deposit_paid' && 'Deposit Paid'}
                    {tour.paymentStatus === 'full_payment' && 'Full Payment Received'}
                    {tour.paymentStatus === 'not_paid' && 'Payment Pending'}
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

                {isPending && tour.paymentStatus === 'deposit_paid' && (
                  <Button
                    size="sm"
                    onClick={() => onConfirmTour(tour.id, tour.preferredDate)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                )}

                {isPending && tour.paymentStatus === 'full_payment' && (
                  <Button
                    size="sm"
                    onClick={() => onConfirmTour(tour.id, tour.preferredDate)}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                )}

                {(isPending || isPaymentRequired) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const reason = prompt('Reason for rejection:')
                      if (reason) onRejectTour(tour.id, reason)
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                )}

                {isConfirmed && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCompleteTour(tour.id)}
                  >
                    Mark Complete
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
          <CardTitle>Tour Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="pending" className="relative">
                Pending
                {pendingTours.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center" variant="destructive">
                    {pendingTours.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="payment" className="relative">
                Payment
                {paymentRequiredTours.length > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center" variant="destructive">
                    {paymentRequiredTours.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="confirmed">
                Confirmed ({confirmedTours.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedTours.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledTours.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-6">
              {pendingTours.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending tour requests</p>
                </div>
              ) : (
                pendingTours.map(renderTourCard)
              )}
            </TabsContent>

            <TabsContent value="payment" className="space-y-4 mt-6">
              {paymentRequiredTours.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No tours awaiting payment</p>
                </div>
              ) : (
                paymentRequiredTours.map(renderTourCard)
              )}
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-4 mt-6">
              {confirmedTours.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No confirmed tours</p>
                </div>
              ) : (
                confirmedTours.map(renderTourCard)
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-6">
              {completedTours.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
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
        <TourDetailModal
          open={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedTour(null)
          }}
          tour={selectedTour}
          property={properties.find(p => p.id === selectedTour.propertyId)}
        />
      )}
    </>
  )
}
