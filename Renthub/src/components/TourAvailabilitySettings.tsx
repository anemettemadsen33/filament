import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { TourAvailability } from '@/lib/types'
import { Calendar, Clock, CreditCard, Plus, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TourAvailabilitySettingsProps {
  propertyId: string
  landlordId: string
  availability?: TourAvailability
  onSave: (availability: TourAvailability) => void
}

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
] as const

export function TourAvailabilitySettings({
  propertyId,
  landlordId,
  availability,
  onSave
}: TourAvailabilitySettingsProps) {
  const [availableDays, setAvailableDays] = useState<string[]>(
    availability?.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  )
  const [minimumNoticeHours, setMinimumNoticeHours] = useState(
    availability?.minimumNoticeHours || 24
  )
  const [maximumAdvanceDays, setMaximumAdvanceDays] = useState(
    availability?.maximumAdvanceDays || 30
  )
  const [tourDuration, setTourDuration] = useState(
    availability?.tourDuration || 30
  )
  const [allowVirtualTours, setAllowVirtualTours] = useState(
    availability?.allowVirtualTours || false
  )
  const [allowSelfGuided, setAllowSelfGuided] = useState(
    availability?.allowSelfGuided || false
  )
  const [requiresPayment, setRequiresPayment] = useState(
    availability?.requiresPayment || false
  )
  const [depositAmount, setDepositAmount] = useState(
    availability?.depositAmount || 100
  )
  const [fullPaymentAmount, setFullPaymentAmount] = useState(
    availability?.fullPaymentAmount || 500
  )

  const [timeSlots, setTimeSlots] = useState<{
    day: string
    start: string
    end: string
  }[]>(
    availability?.availableTimeSlots.flatMap(slot =>
      slot.slots.map(s => ({
        day: slot.day,
        start: s.start,
        end: s.end
      }))
    ) || [
      { day: 'monday', start: '09:00', end: '17:00' },
      { day: 'tuesday', start: '09:00', end: '17:00' },
      { day: 'wednesday', start: '09:00', end: '17:00' },
      { day: 'thursday', start: '09:00', end: '17:00' },
      { day: 'friday', start: '09:00', end: '17:00' }
    ]
  )

  const handleDayToggle = (day: string) => {
    setAvailableDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const handleAddTimeSlot = () => {
    setTimeSlots(prev => [
      ...prev,
      { day: 'monday', start: '09:00', end: '17:00' }
    ])
  }

  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpdateTimeSlot = (
    index: number,
    field: 'day' | 'start' | 'end',
    value: string
  ) => {
    setTimeSlots(prev =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    )
  }

  const handleSave = () => {
    if (availableDays.length === 0) {
      toast.error('Please select at least one available day')
      return
    }

    if (timeSlots.length === 0) {
      toast.error('Please add at least one time slot')
      return
    }

    if (requiresPayment && !depositAmount && !fullPaymentAmount) {
      toast.error('Please set at least one payment amount')
      return
    }

    const groupedTimeSlots = availableDays.map(day => ({
      day: day as any,
      slots: timeSlots
        .filter(slot => slot.day === day)
        .map(slot => ({
          start: slot.start,
          end: slot.end
        }))
    }))

    const newAvailability: TourAvailability = {
      propertyId,
      landlordId,
      availableDays: availableDays as any,
      availableTimeSlots: groupedTimeSlots,
      blockedDates: availability?.blockedDates || [],
      minimumNoticeHours,
      maximumAdvanceDays,
      tourDuration,
      allowVirtualTours,
      allowSelfGuided,
      requiresPayment,
      depositAmount: requiresPayment ? depositAmount : undefined,
      fullPaymentAmount: requiresPayment ? fullPaymentAmount : undefined
    }

    onSave(newAvailability)
    toast.success('Tour availability settings saved!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tour Availability Settings</CardTitle>
        <CardDescription>
          Configure when and how potential tenants can schedule property tours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Require Payment
              </Label>
              <p className="text-sm text-muted-foreground">
                Only accept tours from clients who have paid a deposit or full payment
              </p>
            </div>
            <Switch
              checked={requiresPayment}
              onCheckedChange={setRequiresPayment}
            />
          </div>

          {requiresPayment && (
            <div className="grid md:grid-cols-2 gap-4 pl-7">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Deposit Amount ($)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Refundable security deposit
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-payment-amount">Full Payment Amount ($)</Label>
                <Input
                  id="full-payment-amount"
                  type="number"
                  min="0"
                  value={fullPaymentAmount}
                  onChange={(e) => setFullPaymentAmount(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground">
                  Complete upfront payment
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Available Days
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DAYS_OF_WEEK.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={value}
                  checked={availableDays.includes(value)}
                  onCheckedChange={() => handleDayToggle(value)}
                />
                <Label htmlFor={value} className="cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Time Slots
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddTimeSlot}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Slot
            </Button>
          </div>
          <div className="space-y-3">
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Day</Label>
                  <Select
                    value={slot.day}
                    onValueChange={(value) => handleUpdateTimeSlot(index, 'day', value)}
                  >
                    <SelectTrigger aria-label="Day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={slot.start}
                    onChange={(e) => handleUpdateTimeSlot(index, 'start', e.target.value)}
                    aria-label="Start time"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={slot.end}
                    onChange={(e) => handleUpdateTimeSlot(index, 'end', e.target.value)}
                    aria-label="End time"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveTimeSlot(index)}
                  disabled={timeSlots.length === 1}
                  aria-label="Remove time slot"
                  title="Remove time slot"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-notice">Minimum Notice (hours)</Label>
            <Input
              id="min-notice"
              type="number"
              min="1"
              value={minimumNoticeHours}
              onChange={(e) => setMinimumNoticeHours(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-advance">Maximum Advance (days)</Label>
            <Input
              id="max-advance"
              type="number"
              min="1"
              value={maximumAdvanceDays}
              onChange={(e) => setMaximumAdvanceDays(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Tour Duration (minutes)</Label>
            <Select
              value={String(tourDuration)}
              onValueChange={(value) => setTourDuration(Number(value))}
            >
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Tour Options</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Allow Virtual Tours</p>
                <p className="text-sm text-muted-foreground">Enable video call tours</p>
              </div>
              <Switch
                checked={allowVirtualTours}
                onCheckedChange={setAllowVirtualTours}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Allow Self-Guided Tours</p>
                <p className="text-sm text-muted-foreground">Let visitors tour independently</p>
              </div>
              <Switch
                checked={allowSelfGuided}
                onCheckedChange={setAllowSelfGuided}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
