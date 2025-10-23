import { PropertyTour, TourAvailability } from './types'

export function calculateTourPaymentAmount(
  paymentType: 'deposit' | 'full',
  availability: TourAvailability
): number {
  if (paymentType === 'deposit') {
    return availability.depositAmount || 0
  }
  return availability.fullPaymentAmount || 0
}

export function canScheduleTour(
  date: Date,
  availability: TourAvailability,
  existingTours: PropertyTour[]
): { allowed: boolean; reason?: string } {
  const now = new Date()
  const requestDate = new Date(date)
  
  const hoursUntilTour = (requestDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (hoursUntilTour < availability.minimumNoticeHours) {
    return {
      allowed: false,
      reason: `Tours require at least ${availability.minimumNoticeHours} hours notice`
    }
  }
  
  const daysUntilTour = hoursUntilTour / 24
  if (daysUntilTour > availability.maximumAdvanceDays) {
    return {
      allowed: false,
      reason: `Tours can only be scheduled up to ${availability.maximumAdvanceDays} days in advance`
    }
  }
  
  const dateTimestamp = requestDate.getTime()
  if (availability.blockedDates.includes(dateTimestamp)) {
    return {
      allowed: false,
      reason: 'This date is blocked by the landlord'
    }
  }
  
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayOfWeek = dayNames[requestDate.getDay()] as any
  if (!availability.availableDays.includes(dayOfWeek)) {
    return {
      allowed: false,
      reason: 'Tours are not available on this day'
    }
  }
  
  const conflictingTours = existingTours.filter(tour => {
    if (tour.status === 'cancelled' || tour.status === 'rejected') return false
    if (!tour.confirmedDate) return false
    
    const tourStart = tour.confirmedDate
    const tourEnd = tourStart + (tour.duration * 60 * 1000)
    const requestStart = dateTimestamp
    const requestEnd = requestStart + (availability.tourDuration * 60 * 1000)
    
    return (requestStart >= tourStart && requestStart < tourEnd) ||
           (requestEnd > tourStart && requestEnd <= tourEnd) ||
           (requestStart <= tourStart && requestEnd >= tourEnd)
  })
  
  if (conflictingTours.length > 0) {
    return {
      allowed: false,
      reason: 'This time slot is already booked'
    }
  }
  
  return { allowed: true }
}

export function getTourStatusColor(status: PropertyTour['status']): string {
  switch (status) {
    case 'pending':
      return 'bg-warning/10 text-warning-foreground border-warning/20'
    case 'payment_required':
      return 'bg-destructive/10 text-destructive-foreground border-destructive/20'
    case 'confirmed':
      return 'bg-accent/10 text-accent-foreground border-accent/20'
    case 'completed':
      return 'bg-primary/10 text-primary-foreground border-primary/20'
    case 'cancelled':
    case 'rejected':
      return 'bg-muted text-muted-foreground border-border'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export function getTourStatusLabel(status: PropertyTour['status']): string {
  switch (status) {
    case 'pending':
      return 'Pending Approval'
    case 'payment_required':
      return 'Payment Required'
    case 'confirmed':
      return 'Confirmed'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    case 'rejected':
      return 'Rejected'
    default:
      return status
  }
}

export function generateTourTimeSlots(
  date: Date,
  availability: TourAvailability,
  existingTours: PropertyTour[]
): Date[] {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayOfWeek = dayNames[date.getDay()] as any
  const dayAvailability = availability.availableTimeSlots.find(slot => slot.day === dayOfWeek)
  
  if (!dayAvailability) return []
  
  const timeSlots: Date[] = []
  
  dayAvailability.slots.forEach(slot => {
    const [startHour, startMinute] = slot.start.split(':').map(Number)
    const [endHour, endMinute] = slot.end.split(':').map(Number)
    
    let currentHour = startHour
    let currentMinute = startMinute
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const slotDate = new Date(date)
      slotDate.setHours(currentHour, currentMinute, 0, 0)
      
      const checkResult = canScheduleTour(slotDate, availability, existingTours)
      if (checkResult.allowed) {
        timeSlots.push(slotDate)
      }
      
      currentMinute += availability.tourDuration
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60)
        currentMinute = currentMinute % 60
      }
    }
  })
  
  return timeSlots
}

export function shouldSendTourReminder(tour: PropertyTour): boolean {
  if (tour.status !== 'confirmed' || tour.reminderSent) return false
  if (!tour.confirmedDate) return false
  
  const now = Date.now()
  const tourDate = tour.confirmedDate
  const hoursUntilTour = (tourDate - now) / (1000 * 60 * 60)
  
  return hoursUntilTour <= 24 && hoursUntilTour > 0
}

export function canCancelTour(tour: PropertyTour, userId: string): boolean {
  if (tour.status === 'cancelled' || tour.status === 'completed') return false
  
  if (tour.requesterId !== userId && tour.landlordId !== userId) return false
  
  if (tour.confirmedDate) {
    const now = Date.now()
    const hoursUntilTour = (tour.confirmedDate - now) / (1000 * 60 * 60)
    return hoursUntilTour > 2
  }
  
  return true
}
