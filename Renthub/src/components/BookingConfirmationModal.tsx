import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, GoogleLogo, Download, CalendarCheck } from '@phosphor-icons/react'
import { Booking, Property } from '@/lib/types'
import { exportBookingToGoogleCalendar, exportBookingToICalendar } from '@/lib/calendarSync'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface BookingConfirmationModalProps {
  open: boolean
  onClose: () => void
  booking: Booking | null
  property: Property | null
}

export function BookingConfirmationModal({ open, onClose, booking, property }: BookingConfirmationModalProps) {
  if (!booking || !property) return null

  const handleExportToGoogle = () => {
    exportBookingToGoogleCalendar(booking, property)
    toast.success('Opening Google Calendar...')
  }

  const handleExportToICal = () => {
    exportBookingToICalendar(booking, property)
    toast.success('Calendar file downloaded!')
  }

  const formatBookingDate = () => {
    if (booking.checkIn && booking.checkOut) {
      return `${format(booking.checkIn, 'MMM d, yyyy')} - ${format(booking.checkOut, 'MMM d, yyyy')}`
    } else if (booking.checkIn && booking.durationMonths) {
      return `${format(booking.checkIn, 'MMM d, yyyy')} (${booking.durationMonths} months)`
    } else if (booking.checkIn && booking.durationYears) {
      return `${format(booking.checkIn, 'MMM d, yyyy')} (${booking.durationYears} years)`
    }
    return 'Date not set'
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="p-4 rounded-full bg-green-500/10"
            >
              <CheckCircle size={48} className="text-green-500" weight="fill" />
            </motion.div>
          </div>
          <DialogTitle className="text-center text-2xl">Booking Confirmed!</DialogTitle>
          <DialogDescription className="text-center">
            Your reservation has been successfully created
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-2">{booking.propertyTitle}</h4>
            <p className="text-sm text-muted-foreground mb-1">{property.location}</p>
            <p className="text-sm font-medium">{formatBookingDate()}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                {booking.status}
              </Badge>
              <Badge variant="outline">{booking.rentalTerm}</Badge>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarCheck className="text-primary" />
              <h4 className="font-semibold">Add to your calendar</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Never miss your check-in date - export this booking to your calendar
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExportToGoogle}
                className="flex-1 gap-2"
              >
                <GoogleLogo />
                Google Calendar
              </Button>
              <Button
                variant="outline"
                onClick={handleExportToICal}
                className="flex-1 gap-2"
              >
                <Download />
                iCalendar
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono text-xs">{booking.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-lg text-primary">${booking.totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
