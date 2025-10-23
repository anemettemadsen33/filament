import { useState, useMemo } from 'react'
import { Property, Booking } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { CalendarBlank, CaretLeft, CaretRight, Plus, X } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface AvailabilityCalendarProps {
  properties: Property[]
  bookings: Booking[]
  onUpdateAvailability: (propertyId: string, blockedDates: number[]) => void
}

export function AvailabilityCalendar({ properties, bookings, onUpdateAvailability }: AvailabilityCalendarProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    properties.length > 0 ? properties[0] : null
  )
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState<number[]>([])
  const [isSelecting, setIsSelecting] = useState(false)

  const handlePropertyChange = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    if (property) {
      setSelectedProperty(property)
      setSelectedDates([])
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const isDateBlocked = (date: Date) => {
    if (!selectedProperty) return false
    const timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    return (selectedProperty.blockedDates || []).includes(timestamp)
  }

  const isDateBooked = (date: Date) => {
    if (!selectedProperty) return false
    const timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    
    return bookings.some(booking => {
      if (booking.propertyId !== selectedProperty.id) return false
      if (booking.status === 'cancelled') return false
      
      if (booking.checkIn && booking.checkOut) {
        const checkIn = new Date(booking.checkIn)
        const checkOut = new Date(booking.checkOut)
        checkIn.setHours(0, 0, 0, 0)
        checkOut.setHours(0, 0, 0, 0)
        const checkDate = new Date(date)
        checkDate.setHours(0, 0, 0, 0)
        return checkDate >= checkIn && checkDate <= checkOut
      }
      
      return false
    })
  }

  const isDateInPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    return checkDate < today
  }

  const isDateSelected = (date: Date) => {
    const timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    return selectedDates.includes(timestamp)
  }

  const handleDateClick = (date: Date) => {
    if (isDateInPast(date) || isDateBooked(date)) return

    const timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    
    setSelectedDates(current => {
      if (current.includes(timestamp)) {
        return current.filter(d => d !== timestamp)
      } else {
        return [...current, timestamp]
      }
    })
  }

  const handleBlockDates = () => {
    if (!selectedProperty || selectedDates.length === 0) return

    const currentBlocked = selectedProperty.blockedDates || []
    const newBlocked = [...new Set([...currentBlocked, ...selectedDates])]
    
    onUpdateAvailability(selectedProperty.id, newBlocked)
    setSelectedDates([])
    toast.success(`Blocked ${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''}`)
  }

  const handleUnblockDates = () => {
    if (!selectedProperty || selectedDates.length === 0) return

    const currentBlocked = selectedProperty.blockedDates || []
    const newBlocked = currentBlocked.filter(d => !selectedDates.includes(d))
    
    onUpdateAvailability(selectedProperty.id, newBlocked)
    setSelectedDates([])
    toast.success(`Unblocked ${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''}`)
  }

  const handleClearSelection = () => {
    setSelectedDates([])
  }

  const renderCalendarGrid = () => {
    if (!selectedProperty) return null

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
    const weeks: React.ReactElement[][] = []
    let days: React.ReactElement[] = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      )
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isPast = isDateInPast(date)
      const isBooked = isDateBooked(date)
      const isBlocked = isDateBlocked(date)
      const isSelected = isDateSelected(date)
      const isToday = new Date().toDateString() === date.toDateString()

      days.push(
        <motion.button
          key={day}
          whileHover={!isPast && !isBooked ? { scale: 1.05 } : {}}
          whileTap={!isPast && !isBooked ? { scale: 0.95 } : {}}
          onClick={() => handleDateClick(date)}
          disabled={isPast || isBooked}
          className={cn(
            'aspect-square rounded-lg p-2 text-sm font-medium transition-all relative',
            'flex items-center justify-center',
            {
              'bg-muted text-muted-foreground cursor-not-allowed': isPast,
              'bg-destructive/80 text-destructive-foreground cursor-not-allowed': isBooked,
              'bg-orange-500/80 text-white': isBlocked && !isSelected && !isBooked,
              'bg-primary text-primary-foreground': isSelected,
              'hover:bg-accent hover:text-accent-foreground cursor-pointer': !isPast && !isBooked && !isSelected,
              'ring-2 ring-primary ring-offset-2': isToday && !isSelected,
              'ring-2 ring-accent ring-offset-2': isToday && isSelected
            }
          )}
        >
          {day}
          {isToday && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current" />
          )}
        </motion.button>
      )

      if ((startingDayOfWeek + day) % 7 === 0 || day === daysInMonth) {
        weeks.push([...days])
        days = []
      }
    }

    return weeks.map((week, weekIndex) => (
      <div key={weekIndex} className="grid grid-cols-7 gap-2">
        {week}
      </div>
    ))
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const propertyBookingsCount = useMemo(() => {
    if (!selectedProperty) return 0
    return bookings.filter(b => b.propertyId === selectedProperty.id && b.status !== 'cancelled').length
  }, [selectedProperty, bookings])

  const blockedDatesCount = selectedProperty?.blockedDates?.length || 0

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <CalendarBlank size={64} className="mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
              <p className="text-muted-foreground">
                Add your first property to start managing availability
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Availability Calendar</CardTitle>
              <CardDescription className="mt-2">
                Manage your property availability and block dates
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarBlank className="mr-2" />
                  Legend
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Calendar Legend</DialogTitle>
                  <DialogDescription>
                    Understanding the calendar color codes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted" />
                    <span className="text-sm">Past dates (unavailable)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-destructive/80" />
                    <span className="text-sm">Booked dates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/80" />
                    <span className="text-sm">Blocked by you</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary" />
                    <span className="text-sm">Selected dates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg border-2 border-primary" />
                    <span className="text-sm">Today</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Select Property</label>
              <Select
                value={selectedProperty?.id}
                onValueChange={handlePropertyChange}
              >
                <SelectTrigger aria-label="Select property">
                  <SelectValue placeholder="Choose a property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:w-auto">
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold">{propertyBookingsCount}</p>
                <p className="text-xs text-muted-foreground">Bookings</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold">{blockedDatesCount}</p>
                <p className="text-xs text-muted-foreground">Blocked</p>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{monthName}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToToday}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPreviousMonth}
                  aria-label="Previous month"
                  title="Previous month"
                >
                  <CaretLeft />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextMonth}
                  aria-label="Next month"
                  title="Next month"
                >
                  <CaretRight />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              {renderCalendarGrid()}
            </div>
          </div>

          <AnimatePresence>
            {selectedDates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20"
              >
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected
                </Badge>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                  >
                    <X className="mr-2" />
                    Clear
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUnblockDates}
                  >
                    Unblock
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleBlockDates}
                  >
                    <Plus className="mr-2" />
                    Block Dates
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
