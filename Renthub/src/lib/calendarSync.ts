import { Booking, Property } from './types'

export interface CalendarEvent {
  id: string
  title: string
  description: string
  location: string
  startDate: Date
  endDate: Date
  url?: string
}

function formatICalDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function generateICalEvent(event: CalendarEvent): string {
  const lines: string[] = []
  
  lines.push('BEGIN:VEVENT')
  lines.push(`UID:${event.id}@renthub.app`)
  lines.push(`DTSTAMP:${formatICalDate(new Date())}`)
  lines.push(`DTSTART:${formatICalDate(event.startDate)}`)
  lines.push(`DTEND:${formatICalDate(event.endDate)}`)
  lines.push(`SUMMARY:${escapeICalText(event.title)}`)
  lines.push(`DESCRIPTION:${escapeICalText(event.description)}`)
  lines.push(`LOCATION:${escapeICalText(event.location)}`)
  
  if (event.url) {
    lines.push(`URL:${event.url}`)
  }
  
  lines.push('STATUS:CONFIRMED')
  lines.push('SEQUENCE:0')
  lines.push('END:VEVENT')
  
  return lines.join('\r\n')
}

export function generateICalFile(events: CalendarEvent[]): string {
  const lines: string[] = []
  
  lines.push('BEGIN:VCALENDAR')
  lines.push('VERSION:2.0')
  lines.push('PRODID:-//RentHub//Calendar Sync//EN')
  lines.push('CALSCALE:GREGORIAN')
  lines.push('METHOD:PUBLISH')
  lines.push('X-WR-CALNAME:RentHub Bookings')
  lines.push('X-WR-TIMEZONE:UTC')
  lines.push('X-WR-CALDESC:Your RentHub booking schedule')
  
  events.forEach(event => {
    lines.push(generateICalEvent(event))
  })
  
  lines.push('END:VCALENDAR')
  
  return lines.join('\r\n')
}

export function bookingToCalendarEvent(booking: Booking, property?: Property): CalendarEvent {
  const startDate = booking.checkIn ? new Date(booking.checkIn) : new Date()
  let endDate: Date
  
  if (booking.checkOut) {
    endDate = new Date(booking.checkOut)
  } else if (booking.durationMonths) {
    endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + booking.durationMonths)
  } else if (booking.durationYears) {
    endDate = new Date(startDate)
    endDate.setFullYear(endDate.getFullYear() + booking.durationYears)
  } else {
    endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 1)
  }
  
  const title = `Rental: ${booking.propertyTitle}`
  const description = [
    `Booking ID: ${booking.id}`,
    `Property: ${booking.propertyTitle}`,
    `Guest: ${booking.customerName}`,
    `Email: ${booking.customerEmail}`,
    `Phone: ${booking.customerPhone}`,
    `Status: ${booking.status}`,
    `Total Price: $${booking.totalPrice.toLocaleString()}`,
    booking.rentalTerm === 'short-term' 
      ? `Duration: ${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
      : `Duration: ${booking.durationMonths || booking.durationYears} ${booking.durationMonths ? 'months' : 'years'}`
  ].join('\n')
  
  return {
    id: booking.id,
    title,
    description,
    location: property?.location || '',
    startDate,
    endDate,
    url: `${window.location.origin}/booking/${booking.id}`
  }
}

export function downloadICalFile(icalContent: string, filename: string = 'renthub-bookings.ics') {
  const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const formatGoogleDate = (date: Date) => {
    return formatICalDate(date).replace(/[-:]/g, '')
  }
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`
  })
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function exportBookingToGoogleCalendar(booking: Booking, property?: Property) {
  const event = bookingToCalendarEvent(booking, property)
  const url = generateGoogleCalendarUrl(event)
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function exportBookingToICalendar(booking: Booking, property?: Property) {
  const event = bookingToCalendarEvent(booking, property)
  const icalContent = generateICalFile([event])
  downloadICalFile(icalContent, `booking-${booking.id}.ics`)
}

export function exportAllBookingsToICalendar(bookings: Booking[], properties: Property[]) {
  const events = bookings.map(booking => {
    const property = properties.find(p => p.id === booking.propertyId)
    return bookingToCalendarEvent(booking, property)
  })
  
  const icalContent = generateICalFile(events)
  downloadICalFile(icalContent, 'all-renthub-bookings.ics')
}

export function getICalendarFeedUrl(userId: string): string {
  return `${window.location.origin}/api/calendar/feed/${userId}.ics`
}

export function copyCalendarFeedUrl(userId: string): string {
  const url = getICalendarFeedUrl(userId)
  navigator.clipboard.writeText(url)
  return url
}
