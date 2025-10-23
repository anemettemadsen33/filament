import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PropertyTour, Property } from '@/lib/types'
import { Calendar, Clock, MapPin, Video, Key, Phone, EnvelopeSimple, User, CreditCard, ChatCircle } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { getTourStatusColor, getTourStatusLabel } from '@/lib/tourUtils'

interface TourDetailModalProps {
  open: boolean
  onClose: () => void
  tour: PropertyTour
  property?: Property
}

export function TourDetailModal({ open, onClose, tour, property }: TourDetailModalProps) {
  const tourDate = tour.confirmedDate || tour.preferredDate

  const getTourTypeIcon = (type: PropertyTour['tourType']) => {
    switch (type) {
      case 'in-person':
        return <MapPin className="w-5 h-5" />
      case 'virtual':
        return <Video className="w-5 h-5" />
      case 'self-guided':
        return <Key className="w-5 h-5" />
    }
  }

  const getTourTypeName = (type: PropertyTour['tourType']) => {
    switch (type) {
      case 'in-person':
        return 'In-Person Tour'
      case 'virtual':
        return 'Virtual Tour'
      case 'self-guided':
        return 'Self-Guided Tour'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl">Tour Details</DialogTitle>
            <Badge className={getTourStatusColor(tour.status)}>
              {getTourStatusLabel(tour.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {property?.images[0] && (
            <img
              src={property.images[0]}
              alt={tour.propertyTitle}
              className="w-full h-48 object-cover rounded-lg"
            />
          )}

          <div>
            <h3 className="font-semibold text-lg mb-1">{tour.propertyTitle}</h3>
            <p className="text-muted-foreground">{tour.propertyAddress}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Tour Schedule
            </h4>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p className="font-medium">{format(tourDate, 'EEEE, MMMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Time</p>
                <p className="font-medium">{format(tourDate, 'h:mm a')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="font-medium">{tour.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <div className="flex items-center gap-2 font-medium">
                  {getTourTypeIcon(tour.tourType)}
                  {getTourTypeName(tour.tourType)}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Requester Information
            </h4>
            <div className="space-y-3 pl-7">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{tour.requesterName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <EnvelopeSimple className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{tour.requesterEmail}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{tour.requesterPhone}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Number of Attendees</p>
                <p className="font-medium">{tour.numberOfAttendees || 1} person(s)</p>
              </div>
            </div>
          </div>

          {tour.message && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <ChatCircle className="w-5 h-5 text-primary" />
                  Message
                </h4>
                <div className="pl-7 p-4 bg-muted rounded-lg">
                  <p className="text-sm">{tour.message}</p>
                </div>
              </div>
            </>
          )}

          {tour.specialRequests && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Special Requests</h4>
                <div className="pl-7 p-4 bg-muted rounded-lg">
                  <p className="text-sm">{tour.specialRequests}</p>
                </div>
              </div>
            </>
          )}

          {tour.paymentRequired && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Information
                </h4>
                <div className="space-y-3 pl-7">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge variant={tour.paymentStatus === 'not_paid' ? 'destructive' : 'default'}>
                        {tour.paymentStatus === 'deposit_paid' && 'Deposit Paid'}
                        {tour.paymentStatus === 'full_payment' && 'Full Payment'}
                        {tour.paymentStatus === 'not_paid' && 'Not Paid'}
                      </Badge>
                    </div>
                    {tour.paidAmount && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                        <p className="font-semibold text-lg">${tour.paidAmount}</p>
                      </div>
                    )}
                  </div>
                  {tour.paymentDate && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                      <p className="font-medium">{format(tour.paymentDate, 'MMM d, yyyy h:mm a')}</p>
                    </div>
                  )}
                  {tour.transactionId && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                      <p className="font-mono text-sm">{tour.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {(tour.status === 'cancelled' || tour.status === 'rejected') && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-destructive">
                  {tour.status === 'cancelled' ? 'Cancellation' : 'Rejection'} Reason
                </h4>
                <div className="pl-7 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <p className="text-sm">{tour.cancellationReason || tour.rejectionReason}</p>
                </div>
              </div>
            </>
          )}

          {tour.feedback && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Tour Feedback</h4>
                <div className="pl-7 space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Rating</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < tour.feedback!.rating ? 'text-warning' : 'text-muted'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {tour.feedback.comment && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Comment</p>
                      <p className="text-sm">{tour.feedback.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {tour.metadata?.meetingLink && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Virtual Tour Link</h4>
                <div className="pl-7">
                  <a
                    href={tour.metadata.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {tour.metadata.meetingLink}
                  </a>
                </div>
              </div>
            </>
          )}

          {tour.metadata?.directions && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold">Directions</h4>
                <div className="pl-7 p-4 bg-muted rounded-lg">
                  <p className="text-sm">{tour.metadata.directions}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
