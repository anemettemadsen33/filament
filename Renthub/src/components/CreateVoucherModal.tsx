import { useState } from 'react'
import { Voucher } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon, Sparkle } from '@phosphor-icons/react'
import { generateVoucherCode } from '@/lib/voucherUtils'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface CreateVoucherModalProps {
  open: boolean
  onClose: () => void
  onCreate: (voucher: Omit<Voucher, 'id' | 'createdAt' | 'currentUses' | 'usedBy'>) => void
  userId: string
  propertyId?: string
}

export function CreateVoucherModal({ open, onClose, onCreate, userId, propertyId }: CreateVoucherModalProps) {
  const [formData, setFormData] = useState({
    code: generateVoucherCode(),
    type: 'percentage' as Voucher['type'],
    value: 10,
    category: 'custom' as Voucher['category'],
    description: '',
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    maxUses: 100,
    maxUsesPerUser: 1,
    minBookingDays: 0,
    minBookingMonths: 0,
    minBookingValue: 0,
    rentalTermRestriction: undefined as 'short-term' | 'long-term' | undefined,
    active: true,
    isPublic: true,
    autoApply: false,
    stackable: false,
    priority: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.code.trim()) {
      toast.error('Voucher code is required')
      return
    }

    if (formData.value <= 0) {
      toast.error('Value must be greater than 0')
      return
    }

    if (formData.maxUses <= 0) {
      toast.error('Max uses must be greater than 0')
      return
    }

    if (formData.validUntil <= formData.validFrom) {
      toast.error('End date must be after start date')
      return
    }

    const voucher: Omit<Voucher, 'id' | 'createdAt' | 'currentUses' | 'usedBy'> = {
      code: formData.code.toUpperCase().trim(),
      type: formData.type,
      value: formData.value,
      category: formData.category,
      description: formData.description.trim(),
      propertyId: propertyId,
      validFrom: formData.validFrom.getTime(),
      validUntil: formData.validUntil.getTime(),
      maxUses: formData.maxUses,
      maxUsesPerUser: formData.maxUsesPerUser || undefined,
      minBookingDays: formData.minBookingDays || undefined,
      minBookingMonths: formData.minBookingMonths || undefined,
      minBookingValue: formData.minBookingValue || undefined,
      rentalTermRestriction: formData.rentalTermRestriction,
      active: formData.active,
      isPublic: formData.isPublic,
      autoApply: formData.autoApply,
      stackable: formData.stackable,
      priority: formData.priority,
      createdBy: userId
    }

    onCreate(voucher)
    toast.success('Voucher created successfully!')
    onClose()
    setFormData({
      code: generateVoucherCode(),
      type: 'percentage',
      value: 10,
      category: 'custom',
      description: '',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      maxUses: 100,
      maxUsesPerUser: 1,
      minBookingDays: 0,
      minBookingMonths: 0,
      minBookingValue: 0,
      rentalTermRestriction: undefined,
      active: true,
      isPublic: true,
      autoApply: false,
      stackable: false,
      priority: 0
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Voucher</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Voucher Code</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="RENT2024"
                  className="font-mono"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setFormData({ ...formData, code: generateVoucherCode() })}
                  aria-label="Generate voucher code"
                  title="Generate voucher code"
                >
                  <Sparkle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Voucher['category'] })}
              >
                <SelectTrigger aria-label="Voucher category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early-bird">Early Bird</SelectItem>
                  <SelectItem value="long-stay">Long Stay</SelectItem>
                  <SelectItem value="first-booking">First Booking</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="seasonal">Seasonal</SelectItem>
                  <SelectItem value="loyalty">Loyalty</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Discount Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as Voucher['type'] })}
              >
                <SelectTrigger aria-label="Discount type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="free-nights">Free Nights</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">
                {formData.type === 'percentage' ? 'Percentage (%)' : formData.type === 'fixed' ? 'Amount ($)' : 'Number of Nights'}
              </Label>
              <Input
                id="value"
                type="number"
                min="0"
                step={formData.type === 'percentage' ? '1' : '0.01'}
                max={formData.type === 'percentage' ? '100' : undefined}
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Get 10% off your booking when you book early"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valid From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(formData.validFrom, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.validFrom}
                    onSelect={(date) => date && setFormData({ ...formData, validFrom: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Valid Until</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {format(formData.validUntil, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.validUntil}
                    onSelect={(date) => date && setFormData({ ...formData, validUntil: date })}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUses">Maximum Uses</Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUsesPerUser">Max Uses Per User</Label>
              <Input
                id="maxUsesPerUser"
                type="number"
                min="0"
                value={formData.maxUsesPerUser}
                onChange={(e) => setFormData({ ...formData, maxUsesPerUser: parseInt(e.target.value) || 0 })}
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBookingDays">Min Days</Label>
              <Input
                id="minBookingDays"
                type="number"
                min="0"
                value={formData.minBookingDays}
                onChange={(e) => setFormData({ ...formData, minBookingDays: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minBookingMonths">Min Months</Label>
              <Input
                id="minBookingMonths"
                type="number"
                min="0"
                value={formData.minBookingMonths}
                onChange={(e) => setFormData({ ...formData, minBookingMonths: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minBookingValue">Min Value ($)</Label>
              <Input
                id="minBookingValue"
                type="number"
                min="0"
                value={formData.minBookingValue}
                onChange={(e) => setFormData({ ...formData, minBookingValue: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rentalTerm">Rental Term Restriction</Label>
            <Select
              value={formData.rentalTermRestriction || 'none'}
              onValueChange={(value) => setFormData({ 
                ...formData, 
                rentalTermRestriction: value === 'none' ? undefined : value as 'short-term' | 'long-term'
              })}
            >
              <SelectTrigger id="rentalTerm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Restriction</SelectItem>
                <SelectItem value="short-term">Short-term Only</SelectItem>
                <SelectItem value="long-term">Long-term Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isPublic">Publicly Visible</Label>
              <Switch
                id="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="autoApply">Auto-Apply</Label>
              <Switch
                id="autoApply"
                checked={formData.autoApply}
                onCheckedChange={(checked) => setFormData({ ...formData, autoApply: checked })}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Voucher
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
