import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, GoogleLogo, Download, Copy, CheckCircle, CalendarBlank } from '@phosphor-icons/react'
import { Booking, Property } from '@/lib/types'
import {
  exportBookingToGoogleCalendar,
  exportBookingToICalendar,
  exportAllBookingsToICalendar,
  copyCalendarFeedUrl
} from '@/lib/calendarSync'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface CalendarSyncPanelProps {
  bookings: Booking[]
  properties: Property[]
  userId: string
}

export function CalendarSyncPanel({ bookings, properties, userId }: CalendarSyncPanelProps) {
  const [copiedFeed, setCopiedFeed] = useState(false)
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])

  const activeBookings = bookings.filter(b => b.status !== 'cancelled')

  const handleExportToGoogle = (booking: Booking) => {
    const property = properties.find(p => p.id === booking.propertyId)
    exportBookingToGoogleCalendar(booking, property)
    toast.success('Opening Google Calendar...')
  }

  const handleExportToICal = (booking: Booking) => {
    const property = properties.find(p => p.id === booking.propertyId)
    exportBookingToICalendar(booking, property)
    toast.success('Calendar file downloaded!')
  }

  const handleExportAllToICal = () => {
    const bookingsToExport = selectedBookings.length > 0
      ? activeBookings.filter(b => selectedBookings.includes(b.id))
      : activeBookings

    if (bookingsToExport.length === 0) {
      toast.error('No bookings to export')
      return
    }

    exportAllBookingsToICalendar(bookingsToExport, properties)
    toast.success(`${bookingsToExport.length} booking(s) exported!`)
  }

  const handleCopyFeedUrl = async () => {
    try {
      copyCalendarFeedUrl(userId)
      setCopiedFeed(true)
      toast.success('Calendar feed URL copied to clipboard!')
      setTimeout(() => setCopiedFeed(false), 2000)
    } catch (error) {
      toast.error('Failed to copy URL')
    }
  }

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    )
  }

  const selectAllBookings = () => {
    setSelectedBookings(activeBookings.map(b => b.id))
  }

  const clearSelection = () => {
    setSelectedBookings([])
  }

  const formatBookingDate = (booking: Booking): string => {
    if (booking.checkIn && booking.checkOut) {
      return `${format(booking.checkIn, 'MMM d, yyyy')} - ${format(booking.checkOut, 'MMM d, yyyy')}`
    } else if (booking.checkIn && booking.durationMonths) {
      const startDate = new Date(booking.checkIn)
      return `${format(startDate, 'MMM d, yyyy')} (${booking.durationMonths} months)`
    } else if (booking.checkIn && booking.durationYears) {
      const startDate = new Date(booking.checkIn)
      return `${format(startDate, 'MMM d, yyyy')} (${booking.durationYears} years)`
    }
    return 'Date not set'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Calendar Sync</CardTitle>
              <CardDescription>Export your bookings to your favorite calendar app</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Quick Export</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleExportAllToICal}
                  disabled={activeBookings.length === 0}
                  variant="outline"
                  className="gap-2"
                >
                  <Download />
                  Export All to iCal
                  {selectedBookings.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedBookings.length}
                    </Badge>
                  )}
                </Button>
                {selectedBookings.length > 0 && (
                  <Button onClick={clearSelection} variant="ghost" size="sm">
                    Clear Selection
                  </Button>
                )}
                {activeBookings.length > 0 && selectedBookings.length === 0 && (
                  <Button onClick={selectAllBookings} variant="ghost" size="sm">
                    Select All
                  </Button>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-2">Calendar Feed (Coming Soon)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Subscribe to a live calendar feed that automatically updates with your bookings
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyFeedUrl}
                  variant="outline"
                  className="gap-2"
                  disabled
                >
                  {copiedFeed ? <CheckCircle /> : <Copy />}
                  {copiedFeed ? 'Copied!' : 'Copy Feed URL'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use this URL to subscribe in Calendar apps like Apple Calendar, Outlook, or any iCal-compatible application
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeBookings.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Bookings</CardTitle>
            <CardDescription>
              Select bookings to export or add individual bookings to your calendar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeBookings.map((booking) => {
                const property = properties.find(p => p.id === booking.propertyId)
                const isSelected = selectedBookings.includes(booking.id)

                return (
                  <div
                    key={booking.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => toggleBookingSelection(booking.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {isSelected && (
                            <CheckCircle className="text-primary flex-shrink-0" weight="fill" />
                          )}
                          <h4 className="font-semibold truncate">{booking.propertyTitle}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {formatBookingDate(booking)}
                        </p>
                        {property && (
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                            {booking.status}
                          </Badge>
                          <Badge variant="outline">{booking.rentalTerm}</Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportToGoogle(booking)}
                          className="gap-2 whitespace-nowrap"
                        >
                          <GoogleLogo />
                          Google
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExportToICal(booking)}
                          className="gap-2"
                        >
                          <Download />
                          iCal
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 rounded-full bg-muted mb-4">
              <CalendarBlank className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Active Bookings</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Once you have bookings, you'll be able to export them to your calendar apps
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
