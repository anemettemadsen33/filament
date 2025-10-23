import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Key, Lock, NumberSquareOne, DoorOpen, Copy, Check, Clock, MapPin, WifiHigh, Car, Phone } from '@phosphor-icons/react'
import { Booking, Property } from '@/lib/types'
import { 
  getCheckInInstructions, 
  getLockboxTypeLabel, 
  getLockboxTypeIcon,
  isAccessCodeValid,
  canGenerateAccessCode 
} from '@/lib/checkInUtils'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface CheckInModalProps {
  open: boolean
  onClose: () => void
  booking: Booking
  property: Property
  onGenerateAccessCode: (bookingId: string) => void
  onCompleteCheckIn: (bookingId: string) => void
}

export function CheckInModal({
  open,
  onClose,
  booking,
  property,
  onGenerateAccessCode,
  onCompleteCheckIn
}: CheckInModalProps) {
  const [copied, setCopied] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)

  const hasAccessCode = !!booking.checkInInfo?.accessCode
  const isCodeValid = hasAccessCode && isAccessCodeValid(booking)
  const canGenerate = canGenerateAccessCode(booking)
  const hasCheckedIn = !!booking.checkInInfo?.checkInCompletedAt
  const lockbox = property.lockbox

  const handleCopyCode = async () => {
    if (booking.checkInInfo?.accessCode) {
      await navigator.clipboard.writeText(booking.checkInInfo.accessCode)
      setCopied(true)
      toast.success('Access code copied!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleGenerateCode = () => {
    onGenerateAccessCode(booking.id)
  }

  const handleCheckIn = () => {
    setCheckingIn(true)
    setTimeout(() => {
      onCompleteCheckIn(booking.id)
      setCheckingIn(false)
      toast.success('Check-in completed successfully! 🎉')
    }, 1500)
  }

  const getLockboxIcon = () => {
    switch (lockbox?.type) {
      case 'smart_lock':
        return <Lock className="w-6 h-6" />
      case 'keypad':
        return <NumberSquareOne className="w-6 h-6" />
      case 'key_lockbox':
        return <Key className="w-6 h-6" />
      case 'combination_lock':
        return <Lock className="w-6 h-6" />
      default:
        return <DoorOpen className="w-6 h-6" />
    }
  }

  if (!lockbox?.enabled) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Check-In Information</DialogTitle>
            <DialogDescription>
              Self check-in is not available for this property
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 text-center">
            <p className="text-muted-foreground">
              Please contact the host for check-in instructions.
            </p>
          </div>
          <Button onClick={onClose} className="w-full">Close</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {getLockboxIcon()}
            </div>
            <div>
              <DialogTitle>Self Check-In</DialogTitle>
              <DialogDescription>
                {getLockboxTypeLabel(lockbox.type)} • {property.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {hasCheckedIn && (
            <Card className="border-accent bg-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-accent">
                  <Check className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Checked In Successfully</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.checkInInfo?.checkInCompletedAt && 
                        format(booking.checkInInfo.checkInCompletedAt, 'PPp')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in:</span>
                <span className="font-medium">
                  {booking.checkIn ? format(booking.checkIn, 'PPp') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-out:</span>
                <span className="font-medium">
                  {booking.checkOut ? format(booking.checkOut, 'PPp') : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rental Term:</span>
                <Badge variant="secondary">{booking.rentalTerm}</Badge>
              </div>
            </CardContent>
          </Card>

          {!hasAccessCode && !hasCheckedIn && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-muted">
                    <Key className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Generate Access Code</h3>
                    <p className="text-sm text-muted-foreground">
                      {canGenerate 
                        ? 'Get your access code to unlock the property'
                        : 'Access code will be available 48 hours before check-in'}
                    </p>
                  </div>
                  <Button 
                    onClick={handleGenerateCode}
                    disabled={!canGenerate}
                    className="w-full"
                  >
                    {canGenerate ? 'Generate Access Code' : 'Not Available Yet'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {hasAccessCode && (
            <>
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key />
                    Your Access Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-mono font-bold tracking-wider">
                        {booking.checkInInfo?.accessCode}
                      </span>
                      {!isCodeValid && (
                        <Badge variant="destructive">Expired</Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                    >
                      {copied ? <Check /> : <Copy />}
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Valid from 24 hours before check-in</p>
                    <p>• Expires 24 hours after check-out</p>
                    <p>• Keep this code secure and private</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Check-In Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                        {lockbox.location && (
                          <p className="text-sm text-muted-foreground">
                            Lockbox location: {lockbox.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {lockbox.instructions && (
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5">
                          <DoorOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">Instructions</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {lockbox.instructions}
                          </p>
                        </div>
                      </div>
                    )}

                    {lockbox.wifiName && (
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5">
                          <WifiHigh className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">WiFi Information</p>
                          <div className="text-sm text-muted-foreground space-y-1 mt-1">
                            <div className="flex justify-between">
                              <span>Network:</span>
                              <span className="font-mono">{lockbox.wifiName}</span>
                            </div>
                            {lockbox.wifiPassword && (
                              <div className="flex justify-between">
                                <span>Password:</span>
                                <span className="font-mono">{lockbox.wifiPassword}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {lockbox.parkingInstructions && (
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">Parking</p>
                          <p className="text-sm text-muted-foreground">
                            {lockbox.parkingInstructions}
                          </p>
                        </div>
                      </div>
                    )}

                    {lockbox.emergencyContact && (
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded bg-primary/10 text-primary mt-0.5">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium">Emergency Contact</p>
                          <p className="text-sm text-muted-foreground">
                            {lockbox.emergencyContact}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {!hasCheckedIn && isCodeValid && (
                <Button 
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="w-full"
                  size="lg"
                >
                  {checkingIn ? 'Checking In...' : 'Complete Check-In'}
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
