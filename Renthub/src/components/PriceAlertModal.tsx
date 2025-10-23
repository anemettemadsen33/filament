import { useState } from 'react'
import { Bell, X } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export interface PriceAlert {
  id: string
  propertyId: string
  userId: string
  targetPrice: number
  condition: 'below' | 'above' | 'drops-by'
  percentage?: number
  emailNotification: boolean
  active: boolean
  createdAt: number
}

interface PriceAlertModalProps {
  open: boolean
  onClose: () => void
  propertyId: string
  propertyTitle: string
  currentPrice: number
  onSetAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void
}

export function PriceAlertModal({
  open,
  onClose,
  propertyId,
  propertyTitle,
  currentPrice,
  onSetAlert
}: PriceAlertModalProps) {
  const [condition, setCondition] = useState<'below' | 'above' | 'drops-by'>('below')
  const [targetPrice, setTargetPrice] = useState(Math.floor(currentPrice * 0.9).toString())
  const [percentage, setPercentage] = useState('10')
  const [emailNotification, setEmailNotification] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const price = parseFloat(targetPrice)
    const pct = parseFloat(percentage)

    if (condition === 'drops-by' && (isNaN(pct) || pct <= 0 || pct > 100)) {
      toast.error('Please enter a valid percentage between 1 and 100')
      return
    }

    if (condition !== 'drops-by' && (isNaN(price) || price <= 0)) {
      toast.error('Please enter a valid price')
      return
    }

    const alert: Omit<PriceAlert, 'id' | 'createdAt'> = {
      propertyId,
      userId: 'current-user',
      targetPrice: condition === 'drops-by' ? currentPrice * (1 - pct / 100) : price,
      condition,
      percentage: condition === 'drops-by' ? pct : undefined,
      emailNotification,
      active: true
    }

    onSetAlert(alert)
    toast.success('Price alert created! You\'ll be notified when the price changes.')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell size={24} weight="duotone" />
            Set Price Alert
          </DialogTitle>
          <DialogDescription>
            Get notified when the price for "{propertyTitle}" changes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Price</Label>
              <div className="px-4 py-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">${currentPrice}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Alert Condition</Label>
              <RadioGroup value={condition} onValueChange={(value) => setCondition(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="below" id="below" />
                  <Label htmlFor="below" className="font-normal cursor-pointer">
                    When price drops below a specific amount
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="above" id="above" />
                  <Label htmlFor="above" className="font-normal cursor-pointer">
                    When price goes above a specific amount
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="drops-by" id="drops-by" />
                  <Label htmlFor="drops-by" className="font-normal cursor-pointer">
                    When price drops by a percentage
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {condition === 'drops-by' ? (
              <div className="space-y-2">
                <Label htmlFor="percentage">Percentage Drop</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="percentage"
                    type="number"
                    min="1"
                    max="100"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="10"
                    required
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Alert when price drops to ${(currentPrice * (1 - parseFloat(percentage || '0') / 100)).toFixed(0)} or below
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="targetPrice">Target Price</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">$</span>
                  <Input
                    id="targetPrice"
                    type="number"
                    min="1"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder={currentPrice.toString()}
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between space-x-2 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="email-notification" className="cursor-pointer">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive email when price alert triggers
                </p>
              </div>
              <Switch
                id="email-notification"
                checked={emailNotification}
                onCheckedChange={setEmailNotification}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Alert
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
