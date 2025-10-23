import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'
import { Property, Booking } from '@/lib/types'
import { toast } from 'sonner'
import { CalendarBlank, Clock, CreditCard, User, Envelope, Phone, Sparkle, CheckCircle, Wallet, CurrencyDollar } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { addDays, differenceInDays, format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { motion, AnimatePresence } from 'framer-motion'

interface BookingModalProps {
  property: Property | null
  open: boolean
  onClose: () => void
  onBook: (booking: Booking) => void
}

export function BookingModal({ property, open, onClose, onBook }: BookingModalProps) {
  const [step, setStep] = useState<'details' | 'invoice'>(property?.rentalTerm === 'short-term' ? 'details' : 'details')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [durationMonths, setDurationMonths] = useState<string>('12')
  const [durationYears, setDurationYears] = useState<string>('0')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentOption, setPaymentOption] = useState<'deposit-only' | 'full-payment'>('deposit-only')
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null)

  if (!property) return null

  const isShortTerm = property.rentalTerm === 'short-term'
  const depositAmount = property.price

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

  const calculatePaymentAmount = () => {
    if (isShortTerm) {
      return calculateTotalPrice()
    } else {
      if (paymentOption === 'deposit-only') {
        return depositAmount
      } else {
        return property.price + depositAmount
      }
    }
  }

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Please fill in all customer details')
      return
    }

    if (isShortTerm && (!dateRange?.from || !dateRange?.to)) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    if (!isShortTerm && parseInt(durationMonths) === 0 && parseInt(durationYears) === 0) {
      toast.error('Please select rental duration')
      return
    }

    const totalPrice = calculateTotalPrice()
    const paymentAmount = calculatePaymentAmount()

    const booking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      propertyId: property.id,
      propertyTitle: property.title,
      rentalTerm: property.rentalTerm,
      customerName,
      customerEmail,
      customerPhone,
      checkIn: dateRange?.from?.getTime(),
      checkOut: dateRange?.to?.getTime(),
      durationMonths: !isShortTerm ? parseInt(durationMonths) : undefined,
      durationYears: !isShortTerm ? parseInt(durationYears) : undefined,
      totalPrice,
      paymentOption: !isShortTerm ? paymentOption : undefined,
      depositAmount: !isShortTerm ? depositAmount : undefined,
      status: 'pending',
      createdAt: Date.now(),
      paymentDetails: {
        accountName: 'RentHub Property Management',
        accountNumber: '1234567890',
        bankName: 'International Bank',
        iban: 'GB29NWBK60161331926819'
      }
    }

    setCurrentBooking(booking)
    setStep('invoice')
  }

  const handleConfirmBooking = () => {
    if (!currentBooking) return
    
    onBook(currentBooking)
    toast.success('Booking confirmed! 🎉', {
      description: 'Check your email for payment details.'
    })
    
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setStep('details')
    setDateRange(undefined)
    setDurationMonths('12')
    setDurationYears('0')
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')
    setPaymentOption('deposit-only')
    setCurrentBooking(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const isDateBlocked = (date: Date) => {
    const timestamp = date.getTime()
    return property.blockedDates?.includes(timestamp) || false
  }

  const totalPrice = calculateTotalPrice()
  const nights = isShortTerm && dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background/98 to-primary/5 backdrop-blur-2xl border-border/40 shadow-2xl p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {step === 'details' ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <DialogHeader className="space-y-3 pb-2">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3 flex-wrap">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent via-accent/90 to-accent/70 flex items-center justify-center shadow-lg shadow-accent/30 flex-shrink-0"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        {isShortTerm ? (
                          <CalendarBlank size={24} weight="fill" className="text-white" />
                        ) : (
                          <Clock size={24} weight="fill" className="text-white" />
                        )}
                      </motion.div>
                      <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                        Reserve Your Space
                      </span>
                    </DialogTitle>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <p className="text-base font-semibold text-foreground/80 truncate">{property.title}</p>
                      <Badge className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 px-2 py-0.5 text-xs font-semibold whitespace-nowrap">
                        {isShortTerm ? 'Short-term Rental' : 'Long-term Lease'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-br from-accent/10 to-accent/5 px-3 py-2 rounded-lg border border-accent/20">
                    <Sparkle size={18} weight="fill" className="text-accent" />
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-medium">Price per {isShortTerm ? 'night' : 'month'}</p>
                      <p className="text-lg font-bold text-accent">${property.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <form onSubmit={handleSubmitDetails} className="space-y-5 mt-5">
                <motion.div 
                  className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-card via-card to-secondary/20 border-2 border-border/40 shadow-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <span className="w-1 h-5 bg-gradient-to-b from-primary via-primary/80 to-accent rounded-full shadow-lg shadow-primary/20" />
                      {isShortTerm ? 'Choose Your Dates' : 'Select Duration'}
                    </h3>
                  </div>

                  {isShortTerm ? (
                    <div className="w-full">
                      <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-background via-background/95 to-secondary/30 border border-border/40">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={1}
                          disabled={(date) => date < new Date() || isDateBlocked(date)}
                          className="w-full mx-auto scale-95 sm:scale-100"
                        />
                      </div>
                      {dateRange?.from && dateRange?.to && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 rounded-xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/30"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-[10px] text-muted-foreground font-bold mb-0.5 uppercase">Check-in</p>
                                <p className="text-xs font-bold text-foreground">{format(dateRange.from, 'MMM dd, yyyy')}</p>
                              </div>
                              <div className="h-8 w-px bg-border/60" />
                              <div>
                                <p className="text-[10px] text-muted-foreground font-bold mb-0.5 uppercase">Check-out</p>
                                <p className="text-xs font-bold text-foreground">{format(dateRange.to, 'MMM dd, yyyy')}</p>
                              </div>
                              <div className="h-8 w-px bg-border/60" />
                              <div>
                                <p className="text-[10px] text-muted-foreground font-bold mb-0.5 uppercase">Duration</p>
                                <p className="text-xs font-bold text-accent">{nights} {nights === 1 ? 'Night' : 'Nights'}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.div 
                          className="space-y-2"
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Label htmlFor="years" className="text-sm font-bold text-foreground/90 uppercase">Years</Label>
                          <Select value={durationYears} onValueChange={setDurationYears}>
                            <SelectTrigger id="years" className="h-12 bg-gradient-to-br from-background to-secondary/30 border-2 border-border/50 hover:border-primary/50 transition-all text-base font-semibold rounded-lg" aria-label="Years">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[0, 1, 2, 3, 4, 5].map(year => (
                                <SelectItem key={year} value={year.toString()} className="text-base">
                                  {year} {year === 1 ? 'Year' : 'Years'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>

                        <motion.div 
                          className="space-y-2"
                          whileHover={{ scale: 1.01 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Label htmlFor="months" className="text-sm font-bold text-foreground/90 uppercase">Months</Label>
                          <Select value={durationMonths} onValueChange={setDurationMonths}>
                            <SelectTrigger id="months" className="h-12 bg-gradient-to-br from-background to-secondary/30 border-2 border-border/50 hover:border-primary/50 transition-all text-base font-semibold rounded-lg" aria-label="Months">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i).map(month => (
                                <SelectItem key={month} value={month.toString()} className="text-base">
                                  {month} {month === 1 ? 'Month' : 'Months'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {!isShortTerm && totalPrice > 0 && (
                    <motion.div 
                      className="mt-4 space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-bold text-foreground/90 uppercase flex items-center gap-2">
                          <Wallet size={18} weight="fill" className="text-primary" />
                          Payment Option
                        </Label>
                      </div>
                      
                      <RadioGroup value={paymentOption} onValueChange={(value: 'deposit-only' | 'full-payment') => setPaymentOption(value)}>
                        <motion.div 
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentOption === 'deposit-only' 
                              ? 'border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/10' 
                              : 'border-border/50 bg-gradient-to-br from-background to-secondary/20 hover:border-primary/30'
                          }`}
                          onClick={() => setPaymentOption('deposit-only')}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <RadioGroupItem value="deposit-only" id="deposit-only" className="border-2" />
                          <Label htmlFor="deposit-only" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-sm">Pay Security Deposit Only</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Reserve now, pay first month's rent later</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-lg font-black bg-gradient-to-br from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                                  ${depositAmount.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">due today</p>
                              </div>
                            </div>
                          </Label>
                        </motion.div>

                        <motion.div 
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            paymentOption === 'full-payment' 
                              ? 'border-accent bg-gradient-to-br from-accent/10 via-accent/5 to-transparent shadow-lg shadow-accent/10' 
                              : 'border-border/50 bg-gradient-to-br from-background to-secondary/20 hover:border-accent/30'
                          }`}
                          onClick={() => setPaymentOption('full-payment')}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <RadioGroupItem value="full-payment" id="full-payment" className="border-2" />
                          <Label htmlFor="full-payment" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-sm">Pay Deposit + First Month</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Security deposit + first month's rent upfront</p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="text-lg font-black bg-gradient-to-br from-accent via-accent/90 to-accent/70 bg-clip-text text-transparent">
                                  ${(property.price + depositAmount).toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">due today</p>
                              </div>
                            </div>
                          </Label>
                        </motion.div>
                      </RadioGroup>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {totalPrice > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3 rounded-xl bg-gradient-to-br from-accent/15 via-accent/10 to-accent/5 border border-accent/30"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-muted-foreground uppercase">
                              {isShortTerm ? 'Total Investment' : 'Total Lease Value'}
                            </p>
                            {isShortTerm && nights > 0 && (
                              <p className="text-xs text-muted-foreground font-medium">{nights} {nights === 1 ? 'night' : 'nights'} selected</p>
                            )}
                            {!isShortTerm && (
                              <p className="text-xs text-muted-foreground font-medium">
                                {parseInt(durationYears) > 0 && `${durationYears} ${parseInt(durationYears) === 1 ? 'year' : 'years'}`}
                                {parseInt(durationYears) > 0 && parseInt(durationMonths) > 0 && ' + '}
                                {parseInt(durationMonths) > 0 && `${durationMonths} ${parseInt(durationMonths) === 1 ? 'month' : 'months'}`}
                              </p>
                            )}
                          </div>
                          <motion.p 
                            className="text-2xl font-black bg-gradient-to-br from-accent via-accent/90 to-accent/70 bg-clip-text text-transparent"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            ${totalPrice.toLocaleString()}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <Separator className="bg-gradient-to-r from-transparent via-border to-transparent h-px" />

                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-primary via-primary/80 to-accent rounded-full shadow-lg shadow-primary/20" />
                    Your Information
                  </h3>

                  <div className="grid gap-3">
                    <motion.div 
                      className="space-y-1.5"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Label htmlFor="customerName" className="text-xs font-bold text-foreground/90 uppercase">Full Name *</Label>
                      <div className="relative group">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="customerName"
                          placeholder="Enter your full name"
                          className="pl-11 h-10 bg-gradient-to-br from-background to-secondary/20 border-2 border-border/50 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-lg text-sm font-medium"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      className="space-y-1.5"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Label htmlFor="customerEmail" className="text-xs font-bold text-foreground/90 uppercase">Email Address *</Label>
                      <div className="relative group">
                        <Envelope size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-11 h-10 bg-gradient-to-br from-background to-secondary/20 border-2 border-border/50 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-lg text-sm font-medium"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div 
                      className="space-y-1.5"
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Label htmlFor="customerPhone" className="text-xs font-bold text-foreground/90 uppercase">Phone Number *</Label>
                      <div className="relative group">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          id="customerPhone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="pl-11 h-10 bg-gradient-to-br from-background to-secondary/20 border-2 border-border/50 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-lg text-sm font-medium"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClose} 
                    className="flex-1 h-11 font-bold text-sm border-2 border-border/60 hover:bg-secondary/80 hover:border-border rounded-lg transition-all"
                  >
                    Cancel
                  </Button>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      disabled={totalPrice === 0}
                      className="w-full h-11 bg-gradient-to-r from-accent via-accent/95 to-accent/85 hover:from-accent/95 hover:to-accent/75 text-white font-bold text-sm shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                    >
                      Continue to Payment →
                    </Button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="invoice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <DialogHeader className="space-y-3 pb-2">
                <DialogTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3 flex-wrap">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0"
                    whileHover={{ scale: 1.05, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <CreditCard size={24} weight="fill" className="text-white" />
                  </motion.div>
                  <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                    Payment Details
                  </span>
                </DialogTitle>
                <p className="text-muted-foreground text-sm sm:text-base">Complete your booking with a secure bank transfer</p>
              </DialogHeader>

              <div className="space-y-3 sm:space-y-4 mt-5">
                <motion.div 
                  className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/30"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-accent via-accent/80 to-accent/60 rounded-full shadow-lg shadow-accent/20" />
                    Booking Summary
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground font-medium text-xs">Property</span>
                      <span className="font-bold text-xs sm:text-sm truncate max-w-[60%]">{property.title}</span>
                    </div>
                    {isShortTerm && dateRange?.from && dateRange?.to ? (
                      <>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-muted-foreground font-medium text-xs">Check-in</span>
                          <span className="font-bold text-xs sm:text-sm">{format(dateRange.from, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-muted-foreground font-medium text-xs">Check-out</span>
                          <span className="font-bold text-xs sm:text-sm">{format(dateRange.to, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-muted-foreground font-medium text-xs">Duration</span>
                          <span className="font-bold text-xs sm:text-sm text-primary">{nights} {nights === 1 ? 'Night' : 'Nights'}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-muted-foreground font-medium text-xs">Duration</span>
                        <span className="font-bold text-xs sm:text-sm text-primary">
                          {parseInt(durationYears) > 0 && `${durationYears} ${parseInt(durationYears) === 1 ? 'year' : 'years'}`}
                          {parseInt(durationYears) > 0 && parseInt(durationMonths) > 0 && ' + '}
                          {parseInt(durationMonths) > 0 && `${durationMonths} ${parseInt(durationMonths) === 1 ? 'month' : 'months'}`}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground font-medium text-xs">Customer</span>
                      <span className="font-bold text-xs sm:text-sm truncate max-w-[60%]">{customerName}</span>
                    </div>
                    
                    {!isShortTerm && (
                      <>
                        <Separator className="bg-gradient-to-r from-transparent via-accent/30 to-transparent h-px my-1" />
                        <div className="flex justify-between items-center py-1">
                          <span className="text-muted-foreground font-medium text-xs">Payment Option</span>
                          <Badge className={`text-xs ${paymentOption === 'deposit-only' ? 'bg-primary/10 text-primary border-primary/30' : 'bg-accent/10 text-accent border-accent/30'}`}>
                            {paymentOption === 'deposit-only' ? 'Deposit Only' : 'Deposit + First Month'}
                          </Badge>
                        </div>
                        <Separator className="bg-gradient-to-r from-transparent via-border/20 to-transparent h-px my-1" />
                        <div className="space-y-1.5 p-3 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border/30">
                          <p className="text-xs font-bold text-foreground/80 uppercase mb-1">Payment Breakdown</p>
                          {paymentOption === 'deposit-only' ? (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium text-xs">Security Deposit</span>
                                <span className="font-bold text-xs sm:text-sm">${depositAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center pt-1 border-t border-border/20">
                                <span className="text-muted-foreground font-medium text-xs italic">First Month Rent</span>
                                <span className="font-medium text-xs sm:text-sm text-muted-foreground italic">Pay later</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium text-xs">Security Deposit</span>
                                <span className="font-bold text-xs sm:text-sm">${depositAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground font-medium text-xs">First Month Rent</span>
                                <span className="font-bold text-xs sm:text-sm">${property.price.toLocaleString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="flex justify-between items-center py-1 mt-1">
                          <span className="text-muted-foreground font-medium text-xs">Total Lease Duration</span>
                          <span className="font-bold text-xs sm:text-sm text-primary">
                            {parseInt(durationYears) > 0 && `${durationYears} ${parseInt(durationYears) === 1 ? 'year' : 'years'}`}
                            {parseInt(durationYears) > 0 && parseInt(durationMonths) > 0 && ' + '}
                            {parseInt(durationMonths) > 0 && `${durationMonths} ${parseInt(durationMonths) === 1 ? 'month' : 'months'}`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-muted-foreground font-medium text-xs">Total Lease Value</span>
                          <span className="font-bold text-xs sm:text-sm text-muted-foreground">${totalPrice.toLocaleString()}</span>
                        </div>
                      </>
                    )}
                    
                    <Separator className="bg-gradient-to-r from-transparent via-accent/30 to-transparent h-px my-1" />
                    <div className="flex justify-between items-center py-1.5 px-2 rounded-lg bg-gradient-to-r from-accent/20 to-accent/10">
                      <span className="text-sm font-black">Amount Due Now</span>
                      <span className="text-xl sm:text-2xl font-black bg-gradient-to-br from-accent via-accent/90 to-accent/70 bg-clip-text text-transparent">
                        ${calculatePaymentAmount().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/30"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-to-b from-primary via-primary/80 to-primary/60 rounded-full shadow-lg shadow-primary/20" />
                    Bank Transfer Information
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase">Account Name</p>
                      <p className="font-bold text-xs sm:text-sm">{currentBooking?.paymentDetails?.accountName}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase">Bank Name</p>
                      <p className="font-bold text-xs sm:text-sm">{currentBooking?.paymentDetails?.bankName}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase">Account Number</p>
                      <p className="font-mono font-bold text-xs sm:text-sm">{currentBooking?.paymentDetails?.accountNumber}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                      <p className="text-[10px] text-muted-foreground font-bold mb-1 uppercase">IBAN</p>
                      <p className="font-mono font-bold text-xs sm:text-sm break-all">{currentBooking?.paymentDetails?.iban}</p>
                    </div>
                  </div>

                  <motion.div 
                    className="mt-3 p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 border border-yellow-500/40"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                        <Sparkle size={16} weight="fill" className="text-yellow-600 dark:text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400 mb-0.5">Important: Include Reference ID</p>
                        <p className="text-[11px] sm:text-xs text-yellow-700 dark:text-yellow-500">
                          Please add <span className="font-mono font-black bg-yellow-500/20 px-1 py-0.5 rounded">{currentBooking?.id.slice(0, 12)}</span> in your transfer reference
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <div className="flex gap-3 pt-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('details')} 
                    className="flex-1 h-11 font-bold text-sm border-2 border-border/60 hover:bg-secondary/80 hover:border-border rounded-lg transition-all"
                  >
                    ← Back to Details
                  </Button>
                  <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="button"
                      onClick={handleConfirmBooking}
                      className="w-full h-11 bg-gradient-to-r from-accent via-accent/95 to-accent/85 hover:from-accent/95 hover:to-accent/75 text-white font-bold text-sm shadow-xl shadow-accent/30 hover:shadow-2xl hover:shadow-accent/40 transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} weight="fill" />
                      Confirm Booking
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
