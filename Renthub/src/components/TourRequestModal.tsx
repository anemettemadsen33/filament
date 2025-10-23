import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Property, PropertyTour, TourAvailability, User } from '@/lib/types'
import { Calendar as CalendarIcon, Clock, MapPin, Video, Key, CreditCard, Info } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { generateTourTimeSlots, canScheduleTour } from '@/lib/tourUtils'

interface TourRequestModalProps {
  open: boolean
  onClose: () => void
  property: Property
  availability: TourAvailability
  existingTours: PropertyTour[]
  currentUser: User | null
  onRequestTour: (tour: Omit<PropertyTour, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function TourRequestModal({
  open,
  onClose,
  property,
  availability,
  existingTours,
  currentUser,
  onRequestTour
}: TourRequestModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [tourType, setTourType] = useState<'in-person' | 'virtual' | 'self-guided'>('in-person')
  const [numberOfAttendees, setNumberOfAttendees] = useState('1')
  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [message, setMessage] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit')

  const availableTimeSlots = selectedDate
    ? generateTourTimeSlots(selectedDate, availability, existingTours)
    : []

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(undefined)
  }

  const getTourTypeIcon = (type: typeof tourType) => {
    switch (type) {
      case 'in-person':
        return <MapPin className="w-4 h-4" />
      case 'virtual':
        return <Video className="w-4 h-4" />
      case 'self-guided':
        return <Key className="w-4 h-4" />
    }
  }

  const handleSubmit = () => {
    if (!currentUser) {
      toast.error('Please sign in to request a tour')
      return
    }

    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time')
      return
    }

    if (!phone) {
      toast.error('Please provide a phone number')
      return
    }

    const [hours, minutes] = selectedTime.split(':').map(Number)
    const tourDateTime = new Date(selectedDate)
    tourDateTime.setHours(hours, minutes, 0, 0)

    const checkResult = canScheduleTour(tourDateTime, availability, existingTours)
    if (!checkResult.allowed) {
      toast.error(checkResult.reason || 'This time slot is not available')
      return
    }

    const paymentAmount = paymentOption === 'deposit'
      ? availability.depositAmount || 0
      : availability.fullPaymentAmount || 0

    const newTour: Omit<PropertyTour, 'id' | 'createdAt' | 'updatedAt'> = {
      propertyId: property.id,
      propertyTitle: property.title,
      propertyAddress: property.location,
      propertyImage: property.images[0],
      landlordId: property.landlord?.id || 'unknown',
      landlordName: property.landlord?.name || property.ownerName || 'Property Owner',
      landlordEmail: property.landlord?.email || property.ownerEmail,
      landlordPhone: property.landlord?.phone || property.ownerPhone,
      requesterId: currentUser.id,
      requesterName: currentUser.login,
      requesterEmail: currentUser.email,
      requesterPhone: phone,
      preferredDate: tourDateTime.getTime(),
      duration: availability.tourDuration,
      tourType,
      status: availability.requiresPayment ? 'payment_required' : 'pending',
      paymentRequired: availability.requiresPayment,
      paymentStatus: 'not_paid',
      depositAmount: availability.depositAmount,
      fullPaymentAmount: availability.fullPaymentAmount,
      message,
      specialRequests,
      numberOfAttendees: parseInt(numberOfAttendees) || 1
    }

    onRequestTour(newTour)
    toast.success('Tour request submitted successfully!')
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setTourType('in-person')
    setNumberOfAttendees('1')
    setMessage('')
    setSpecialRequests('')
    setPaymentOption('deposit')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Schedule Property Tour</DialogTitle>
          <DialogDescription>
            {property.title} - {property.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {availability.requiresPayment && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-warning-foreground mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium text-warning-foreground">Payment Required</p>
                  <p className="text-sm text-muted-foreground">
                    To ensure serious inquiries, this property requires a payment before confirming your tour.
                    The landlord will only accept tours from clients who have paid a deposit or full payment.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label>Tour Type</Label>
            <RadioGroup value={tourType} onValueChange={(value: any) => setTourType(value)}>
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person" className="flex items-center gap-2 cursor-pointer flex-1">
                    <MapPin className="w-4 h-4" />
                    <span>In-Person Tour</span>
                    <Badge variant="secondary" className="ml-auto">Recommended</Badge>
                  </Label>
                </div>
                {availability.allowVirtualTours && (
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="virtual" id="virtual" />
                    <Label htmlFor="virtual" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Video className="w-4 h-4" />
                      <span>Virtual Tour</span>
                    </Label>
                  </div>
                )}
                {availability.allowSelfGuided && (
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="self-guided" id="self-guided" />
                    <Label htmlFor="self-guided" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Key className="w-4 h-4" />
                      <span>Self-Guided Tour</span>
                    </Label>
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
                  const dayOfWeek = dayNames[date.getDay()] as any
                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))
                  const isBlocked = availability.blockedDates.includes(date.getTime())
                  const isDayAvailable = availability.availableDays.includes(dayOfWeek)
                  
                  return isPast || isBlocked || !isDayAvailable
                }}
                className="rounded-lg border"
              />
            </div>

            <div className="space-y-4">
              {selectedDate && (
                <div className="space-y-3">
                  <Label>Available Time Slots</Label>
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                      {availableTimeSlots.map((slot) => {
                        const timeString = format(slot, 'HH:mm')
                        return (
                          <Button
                            key={timeString}
                            variant={selectedTime === timeString ? 'default' : 'outline'}
                            className="justify-start"
                            onClick={() => setSelectedTime(timeString)}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {format(slot, 'h:mm a')}
                          </Button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground border rounded-lg">
                      No available time slots for this date
                    </div>
                  )}
                </div>
              )}

              {selectedDate && selectedTime && (
                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm font-medium mb-1">Selected Tour Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Duration: {availability.tourDuration} minutes
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">Number of Attendees</Label>
              <Select value={numberOfAttendees} onValueChange={setNumberOfAttendees}>
                <SelectTrigger id="attendees" aria-label="Number of attendees">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={String(num)}>
                      {num} {num === 1 ? 'person' : 'people'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message to Landlord (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and mention any questions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="special-requests">Special Requests (Optional)</Label>
            <Textarea
              id="special-requests"
              placeholder="Any special accommodations or requirements..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={2}
            />
          </div>

          {availability.requiresPayment && (
            <div className="space-y-3 p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <Label className="text-base font-semibold">Payment Option</Label>
              </div>
              <RadioGroup value={paymentOption} onValueChange={(value: any) => setPaymentOption(value)}>
                <div className="flex flex-col gap-3">
                  {availability.depositAmount && (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                      <RadioGroupItem value="deposit" id="deposit" />
                      <Label htmlFor="deposit" className="cursor-pointer flex-1">
                        <div className="flex items-center justify-between">
                          <span>Pay Deposit</span>
                          <span className="font-semibold">${availability.depositAmount}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Refundable security deposit
                        </p>
                      </Label>
                    </div>
                  )}
                  {availability.fullPaymentAmount && (
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full" className="cursor-pointer flex-1">
                        <div className="flex items-center justify-between">
                          <span>Pay Full Amount</span>
                          <span className="font-semibold">${availability.fullPaymentAmount}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Complete payment upfront
                        </p>
                      </Label>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedDate || !selectedTime || !phone}>
            {availability.requiresPayment ? 'Proceed to Payment' : 'Request Tour'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
