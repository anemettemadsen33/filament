import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Property, Booking, Voucher, VoucherValidation, User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { VoucherInput } from '@/components/VoucherInput'
import { VoucherBrowserModal } from '@/components/VoucherBrowserModal'
import { toast } from 'sonner'
import { CalendarBlank, Clock, CreditCard, User as UserIcon, Envelope, Phone, ArrowLeft, CheckCircle, MapPin, Bed, Bathtub, Tag } from '@phosphor-icons/react'
import { addDays, differenceInDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { motion } from 'framer-motion'
import { validateVoucher, calculateDiscount } from '@/lib/voucherUtils'

interface BookingPageProps {
  properties: Property[]
  currentUser: User | null
  vouchers: Voucher[]
  onBook: (booking: Booking) => void
  onApplyVoucher: (voucherId: string, userId: string) => void
}

export function BookingPage({ properties, currentUser, vouchers, onBook, onApplyVoucher }: BookingPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [step, setStep] = useState<'details' | 'invoice'>(property?.rentalTerm === 'short-term' ? 'details' : 'details')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [durationMonths, setDurationMonths] = useState<string>('12')
  const [durationYears, setDurationYears] = useState<string>('0')
  const [customerName, setCustomerName] = useState(currentUser?.login || '')
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '')
  const [customerPhone, setCustomerPhone] = useState('')
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null)
  const [voucherValidation, setVoucherValidation] = useState<VoucherValidation | null>(null)
  const [showVoucherBrowser, setShowVoucherBrowser] = useState(false)

  useEffect(() => {
    if (id) {
      const foundProperty = properties.find(p => p.id === id)
      if (foundProperty) {
        setProperty(foundProperty)
      } else {
        toast.error('Property not found')
        navigate('/')
      }
    }
  }, [id, properties, navigate])

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.login)
      setCustomerEmail(currentUser.email)
    }
  }, [currentUser])

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const isShortTerm = property.rentalTerm === 'short-term'

  const calculateTotalPrice = () => {
    if (isShortTerm && dateRange?.from && dateRange?.to) {
      const nights = differenceInDays(dateRange.to, dateRange.from)
      return nights * property.price
    } else if (!isShortTerm) {
      const months = parseInt(durationMonths) || 0
      const years = parseInt(durationYears) || 0
      const totalMonths = months + (years * 12)
      return totalMonths * property.price
    }
    return 0
  }

  const totalPrice = calculateTotalPrice()
  const serviceFee = totalPrice * 0.05
  const cleaningFee = isShortTerm ? 50 : 0
  const subtotal = totalPrice + serviceFee + cleaningFee
  
  const discountAmount = appliedVoucher && voucherValidation?.valid 
    ? calculateDiscount(appliedVoucher, subtotal).discountAmount 
    : 0
  const finalTotal = subtotal - discountAmount

  const handleApplyVoucher = (code: string) => {
    const voucher = vouchers.find(v => v.code.toUpperCase() === code.toUpperCase())
    
    const bookingDetails = {
      price: subtotal,
      rentalTerm: property.rentalTerm,
      durationDays: isShortTerm && dateRange?.from && dateRange?.to 
        ? differenceInDays(dateRange.to, dateRange.from) 
        : undefined,
      durationMonths: !isShortTerm 
        ? parseInt(durationMonths) + parseInt(durationYears) * 12 
        : undefined
    }

    const validation = validateVoucher(voucher, property, currentUser, bookingDetails)
    
    setVoucherValidation(validation)
    
    if (validation.valid) {
      setAppliedVoucher(validation.voucher!)
      toast.success(`Voucher applied! You saved $${validation.discountAmount?.toFixed(2)}`)
    } else {
      setAppliedVoucher(null)
      toast.error(validation.message)
    }
  }

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null)
    setVoucherValidation(null)
    toast.success('Voucher removed')
  }

  const isBlockedDate = (date: Date) => {
    if (!property.blockedDates) return false
    return property.blockedDates.some(blockedTime => {
      const blockedDate = new Date(blockedTime)
      return (
        date.getFullYear() === blockedDate.getFullYear() &&
        date.getMonth() === blockedDate.getMonth() &&
        date.getDate() === blockedDate.getDate()
      )
    })
  }

  const handleBooking = () => {
    if (!customerName || !customerEmail) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isShortTerm && (!dateRange?.from || !dateRange?.to)) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    if (!isShortTerm && parseInt(durationMonths) + parseInt(durationYears) * 12 === 0) {
      toast.error('Please select a rental duration')
      return
    }

    if (appliedVoucher && currentUser) {
      onApplyVoucher(appliedVoucher.id, currentUser.id)
    }

    const booking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      propertyId: property.id,
      propertyTitle: property.title,
      userId: currentUser?.id || customerName,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      rentalTerm: property.rentalTerm,
      checkIn: dateRange?.from?.getTime(),
      checkOut: dateRange?.to?.getTime(),
      durationMonths: !isShortTerm ? parseInt(durationMonths) + parseInt(durationYears) * 12 : undefined,
      totalPrice: finalTotal,
      voucherCode: appliedVoucher?.code,
      discountAmount: discountAmount,
      status: 'pending',
      createdAt: Date.now()
    }

    onBook(booking)
    toast.success('Booking request submitted!', {
      description: 'The property owner will review your request.'
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Book Your Stay</CardTitle>
                <CardDescription>Complete the booking for this amazing property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      ${property.price}/{isShortTerm ? 'night' : 'month'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin size={16} />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Bed size={16} className="text-muted-foreground" />
                      <span>{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bathtub size={16} className="text-muted-foreground" />
                      <span>{property.bathrooms} baths</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {isShortTerm ? (
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <CalendarBlank />
                      Select Your Dates
                    </Label>
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      disabled={(date) => date < new Date() || isBlockedDate(date)}
                      className="rounded-lg border p-3"
                      numberOfMonths={1}
                    />
                    {dateRange?.from && dateRange?.to && (
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Check-in</span>
                          <span className="font-medium">{format(dateRange.from, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Check-out</span>
                          <span className="font-medium">{format(dateRange.to, 'MMM dd, yyyy')}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Total Nights</span>
                          <span>{differenceInDays(dateRange.to, dateRange.from)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <Clock />
                      Rental Duration
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="years" className="text-sm text-muted-foreground">Years</Label>
                        <Select value={durationYears} onValueChange={setDurationYears}>
                          <SelectTrigger id="years" aria-label="Years">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((y) => (
                              <SelectItem key={y} value={String(y)}>{y} {y === 1 ? 'year' : 'years'}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="months" className="text-sm text-muted-foreground">Months</Label>
                        <Select value={durationMonths} onValueChange={setDurationMonths}>
                          <SelectTrigger id="months" aria-label="Months">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                              <SelectItem key={m} value={String(m)}>{m} {m === 1 ? 'month' : 'months'}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <Label className="flex items-center gap-2 text-base font-semibold">
                    <UserIcon />
                    Your Information
                  </Label>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name *</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="pl-10"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm text-muted-foreground">Email *</Label>
                      <div className="relative">
                        <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                          id="email"
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="pl-10"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone (optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                          id="phone"
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="pl-10"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {isShortTerm && dateRange?.from && dateRange?.to ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ${property.price} × {differenceInDays(dateRange.to, dateRange.from)} nights
                      </span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                  ) : !isShortTerm ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ${property.price} × {parseInt(durationMonths) + parseInt(durationYears) * 12} months
                      </span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                  ) : null}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service fee (5%)</span>
                    <span className="font-medium">${serviceFee.toFixed(2)}</span>
                  </div>

                  {isShortTerm && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cleaning fee</span>
                      <span className="font-medium">${cleaningFee.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-semibold">
                    <Tag className="w-4 h-4" />
                    Apply Voucher Code
                  </Label>
                  <VoucherInput
                    onApply={handleApplyVoucher}
                    onRemove={handleRemoveVoucher}
                    onBrowse={() => setShowVoucherBrowser(true)}
                    appliedVoucher={appliedVoucher || undefined}
                    validation={voucherValidation || undefined}
                    disabled={!totalPrice}
                  />
                </div>

                {discountAmount > 0 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-700 dark:text-green-400">Voucher Discount</span>
                      <span className="text-sm font-bold text-green-700 dark:text-green-400">-${discountAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <div className="text-right">
                    {discountAmount > 0 && (
                      <div className="text-sm text-muted-foreground line-through">${subtotal.toFixed(2)}</div>
                    )}
                    <span className="text-2xl font-bold text-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  className="w-full h-12 text-base font-semibold gap-2"
                  size="lg"
                  disabled={
                    !customerName ||
                    !customerEmail ||
                    (isShortTerm && (!dateRange?.from || !dateRange?.to)) ||
                    (!isShortTerm && parseInt(durationMonths) + parseInt(durationYears) * 12 === 0)
                  }
                >
                  <CheckCircle />
                  Confirm Booking
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  You won't be charged yet. The property owner will review your request first.
                </p>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-sm">Free cancellation</p>
                      <p className="text-xs text-muted-foreground">Cancel up to 48 hours before check-in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-sm">Instant confirmation</p>
                      <p className="text-xs text-muted-foreground">Your booking will be confirmed instantly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-sm">Secure payment</p>
                      <p className="text-xs text-muted-foreground">All transactions are encrypted and secure</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <VoucherBrowserModal
        open={showVoucherBrowser}
        onClose={() => setShowVoucherBrowser(false)}
        vouchers={vouchers}
        property={property}
        user={currentUser}
        bookingDetails={{
          price: subtotal,
          rentalTerm: property.rentalTerm,
          durationDays: isShortTerm && dateRange?.from && dateRange?.to 
            ? differenceInDays(dateRange.to, dateRange.from) 
            : undefined,
          durationMonths: !isShortTerm 
            ? parseInt(durationMonths) + parseInt(durationYears) * 12 
            : undefined
        }}
        onApplyVoucher={handleApplyVoucher}
        appliedVoucherCode={appliedVoucher?.code}
      />
    </div>
  )
}
