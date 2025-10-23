import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Info, FileText } from '@phosphor-icons/react'
import { Booking, Property } from '@/lib/types'

interface CreateLeaseModalProps {
  booking: Booking | null
  property: Property | null
  open: boolean
  onClose: () => void
  onCreate: () => void
}

export function CreateLeaseModal({
  booking,
  property,
  open,
  onClose,
  onCreate
}: CreateLeaseModalProps) {
  const [isCreating, setIsCreating] = useState(false)
  
  if (!booking || !property) return null
  
  const handleCreate = async () => {
    setIsCreating(true)
    try {
      await onCreate()
      onClose()
    } finally {
      setIsCreating(false)
    }
  }
  
  const isShortTerm = booking.rentalTerm === 'short-term'
  const monthlyRent = isShortTerm 
    ? booking.totalPrice 
    : Math.round(booking.totalPrice / ((booking.durationYears || 0) * 12 + (booking.durationMonths || 1)))
  
  const securityDeposit = isShortTerm 
    ? Math.round(monthlyRent * 0.5) 
    : Math.round(monthlyRent * 1.5)
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Lease Agreement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              A lease agreement will be automatically generated based on this booking.
              You can review and customize the terms before sending it for signatures.
            </AlertDescription>
          </Alert>
          
          <div>
            <h3 className="font-semibold mb-3">Booking Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property:</span>
                <span className="font-medium">{property.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tenant:</span>
                <span className="font-medium">{booking.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium capitalize">{booking.rentalTerm.replace('-', ' ')}</span>
              </div>
              {isShortTerm ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in:</span>
                    <span className="font-medium">
                      {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out:</span>
                    <span className="font-medium">
                      {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {booking.durationYears ? `${booking.durationYears} year${booking.durationYears > 1 ? 's' : ''}` : ''}
                    {booking.durationYears && booking.durationMonths ? ' and ' : ''}
                    {booking.durationMonths ? `${booking.durationMonths} month${booking.durationMonths > 1 ? 's' : ''}` : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-3">Lease Terms (Auto-Generated)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Rent:</span>
                <span className="font-medium">${monthlyRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security Deposit:</span>
                <span className="font-medium">${securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Upfront:</span>
                <span className="font-medium">
                  ${(monthlyRent + securityDeposit + (isShortTerm ? 0 : monthlyRent)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>A lease agreement will be created with standard terms and conditions</li>
              <li>You'll be able to review and customize the lease details</li>
              <li>The lease will be sent to the tenant for their signature</li>
              <li>Once both parties sign, the lease becomes legally binding</li>
              <li>You'll receive a copy of the signed lease for your records</li>
            </ol>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            <FileText className="mr-2" />
            {isCreating ? 'Creating...' : 'Create Lease Agreement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
