import { useState } from 'react'
import { Booking, Property } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CalendarCheck, MapPin, Eye, XCircle, Buildings, GoogleLogo, Download, Key } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { exportBookingToGoogleCalendar, exportBookingToICalendar } from '@/lib/calendarSync'
import { CheckInModal } from './CheckInModal'

interface MyBookingsPanelProps {
  bookings: Booking[]
  properties: Property[]
  onViewProperty: (property: Property) => void
  onCancelBooking: (bookingId: string) => void
  onGenerateAccessCode?: (bookingId: string) => void
  onCompleteCheckIn?: (bookingId: string) => void
}

export function MyBookingsPanel({ 
  bookings, 
  properties, 
  onViewProperty, 
  onCancelBooking,
  onGenerateAccessCode,
  onCompleteCheckIn
}: MyBookingsPanelProps) {
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null)
  const [checkInModalOpen, setCheckInModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const sortedBookings = [...bookings].sort((a, b) => b.createdAt - a.createdAt)

  const handleCancelBooking = (booking: Booking) => {
    if (booking.status === 'cancelled') {
      toast.error('This booking is already cancelled')
      return
    }

    const confirmed = window.confirm('Are you sure you want to cancel this booking?')
    if (confirmed) {
      onCancelBooking(booking.id)
      toast.success('Booking cancelled successfully')
    }
  }

  const getProperty = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)
  }

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'cancelled':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const formatDuration = (booking: Booking) => {
    if (booking.rentalTerm === 'short-term' && booking.checkIn && booking.checkOut) {
      const nights = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24))
      return `${nights} ${nights === 1 ? 'night' : 'nights'}`
    } else if (booking.rentalTerm === 'long-term') {
      const parts: string[] = []
      if (booking.durationYears) {
        parts.push(`${booking.durationYears} ${booking.durationYears === 1 ? 'year' : 'years'}`)
      }
      if (booking.durationMonths) {
        parts.push(`${booking.durationMonths} ${booking.durationMonths === 1 ? 'month' : 'months'}`)
      }
      return parts.join(' ')
    }
    return 'N/A'
  }

  if (bookings.length === 0) {
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
              <CalendarCheck size={40} weight="bold" className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground max-w-sm">
              You haven't made any reservations yet. Browse properties to book your perfect space!
            </p>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <CalendarCheck size={20} weight="bold" className="text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Bookings</h2>
          <p className="text-sm text-muted-foreground">{bookings.length} total {bookings.length === 1 ? 'reservation' : 'reservations'}</p>
        </div>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4 pr-4">
          <AnimatePresence mode="popLayout">
            {sortedBookings.map((booking, index) => {
              const property = getProperty(booking.propertyId)
              const isExpanded = expandedBooking === booking.id

              return (
                <motion.div
                  key={booking.id}
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
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg font-bold text-foreground">
                              {booking.propertyTitle}
                            </CardTitle>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          <CardDescription className="flex items-center gap-2">
                            <span className="text-xs">Booked on {format(booking.createdAt, 'MMM dd, yyyy')}</span>
                          </CardDescription>
                        </div>
                        {property && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewProperty(property)}
                            className="h-9"
                          >
                            <Eye size={16} weight="bold" className="mr-2" />
                            View
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Rental Type</p>
                          <Badge variant="outline" className="font-semibold">
                            {booking.rentalTerm === 'short-term' ? 'Short-term' : 'Long-term'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="text-sm font-semibold text-foreground">{formatDuration(booking)}</p>
                        </div>
                      </div>

                      {booking.rentalTerm === 'short-term' && booking.checkIn && booking.checkOut && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Check-in</p>
                            <p className="text-sm font-semibold text-foreground">
                              {format(booking.checkIn, 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Check-out</p>
                            <p className="text-sm font-semibold text-foreground">
                              {format(booking.checkOut, 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      )}

                      <Separator />

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total Price</p>
                        <p className="text-2xl font-bold text-primary">
                          ${booking.totalPrice.toLocaleString()}
                        </p>
                      </div>

                      <motion.div layout>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                          className="w-full"
                        >
                          {isExpanded ? 'Hide Details' : 'Show Details'}
                        </Button>
                      </motion.div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4 overflow-hidden"
                          >
                            <Separator />
                            
                            <div>
                              <p className="text-sm font-semibold text-foreground mb-2">Customer Details</p>
                              <div className="space-y-2 text-sm">
                                <p><span className="text-muted-foreground">Name:</span> {booking.customerName}</p>
                                <p><span className="text-muted-foreground">Email:</span> {booking.customerEmail}</p>
                                <p><span className="text-muted-foreground">Phone:</span> {booking.customerPhone}</p>
                              </div>
                            </div>

                            {booking.paymentDetails && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-sm font-semibold text-foreground mb-2">Payment Details</p>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="text-muted-foreground">Bank:</span> {booking.paymentDetails.bankName}</p>
                                    <p><span className="text-muted-foreground">Account Name:</span> {booking.paymentDetails.accountName}</p>
                                    <p><span className="text-muted-foreground">Account Number:</span> {booking.paymentDetails.accountNumber}</p>
                                    {booking.paymentDetails.iban && (
                                      <p><span className="text-muted-foreground">IBAN:</span> {booking.paymentDetails.iban}</p>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}

                            {booking.status !== 'cancelled' && (
                              <>
                                <Separator />
                                {property?.lockbox?.enabled && (
                                  <>
                                    <div className="space-y-2">
                                      <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                        <Key className="text-accent" />
                                        Self Check-In Available
                                      </p>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedBooking(booking)
                                          setCheckInModalOpen(true)
                                        }}
                                        className="w-full gap-2"
                                      >
                                        <Key />
                                        {booking.checkInInfo?.checkInCompletedAt 
                                          ? 'View Check-In Details' 
                                          : booking.checkInInfo?.accessCode 
                                          ? 'View Access Code' 
                                          : 'Get Access Code'}
                                      </Button>
                                    </div>
                                    <Separator />
                                  </>
                                )}
                                <div className="space-y-2">
                                  <p className="text-sm font-semibold text-foreground mb-2">Export to Calendar</p>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        exportBookingToGoogleCalendar(booking, property)
                                        toast.success('Opening Google Calendar...')
                                      }}
                                      className="flex-1 gap-2"
                                    >
                                      <GoogleLogo />
                                      Google Calendar
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        exportBookingToICalendar(booking, property)
                                        toast.success('Calendar file downloaded!')
                                      }}
                                      className="flex-1 gap-2"
                                    >
                                      <Download />
                                      iCalendar
                                    </Button>
                                  </div>
                                </div>
                                <Separator />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleCancelBooking(booking)}
                                  className="w-full"
                                >
                                  <XCircle size={16} weight="bold" className="mr-2" />
                                  Cancel Booking
                                </Button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {selectedBooking && (
        <CheckInModal
          open={checkInModalOpen}
          onClose={() => {
            setCheckInModalOpen(false)
            setSelectedBooking(null)
          }}
          booking={selectedBooking}
          property={properties.find(p => p.id === selectedBooking.propertyId)!}
          onGenerateAccessCode={(bookingId) => {
            if (onGenerateAccessCode) {
              onGenerateAccessCode(bookingId)
            }
          }}
          onCompleteCheckIn={(bookingId) => {
            if (onCompleteCheckIn) {
              onCompleteCheckIn(bookingId)
            }
          }}
        />
      )}
    </div>
  )
}
