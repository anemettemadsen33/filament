import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Property, MaintenanceRequest, User } from '@/lib/types'
import { Wrench, Drop, Lightning, Fan, CookingPot, House, Bug, ShieldWarning, PaintBrush, Plus, X, Camera, Upload } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface CreateMaintenanceRequestModalProps {
  open: boolean
  onClose: () => void
  property: Property
  user: User
  leaseId?: string
  onCreate: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => void
}

const CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing', icon: Drop, description: 'Leaks, clogs, water issues' },
  { id: 'electrical', name: 'Electrical', icon: Lightning, description: 'Outlets, lights, wiring' },
  { id: 'hvac', name: 'HVAC', icon: Fan, description: 'Heating, cooling, ventilation' },
  { id: 'appliance', name: 'Appliances', icon: CookingPot, description: 'Fridge, stove, washer, dryer' },
  { id: 'structural', name: 'Structural', icon: House, description: 'Walls, floors, ceiling, doors' },
  { id: 'pest', name: 'Pest Control', icon: Bug, description: 'Insects, rodents' },
  { id: 'safety', name: 'Safety', icon: ShieldWarning, description: 'Locks, alarms, hazards' },
  { id: 'cosmetic', name: 'Cosmetic', icon: PaintBrush, description: 'Paint, minor repairs' },
  { id: 'other', name: 'Other', icon: Wrench, description: 'Other issues' }
] as const

const PRIORITY_COLORS = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
}

export function CreateMaintenanceRequestModal({ open, onClose, property, user, leaseId, onCreate }: CreateMaintenanceRequestModalProps) {
  const [category, setCategory] = useState<MaintenanceRequest['category']>('other')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [priority, setPriority] = useState<MaintenanceRequest['priority']>('medium')
  const [photos, setPhotos] = useState<string[]>([])
  const [preferredAccessTime, setPreferredAccessTime] = useState('')
  const [accessInstructions, setAccessInstructions] = useState('')
  const [permissionToEnter, setPermissionToEnter] = useState(false)
  const [tenantNotes, setTenantNotes] = useState('')
  const [photoInput, setPhotoInput] = useState('')

  const handleAddPhoto = () => {
    if (photoInput.trim()) {
      setPhotos([...photos, photoInput.trim()])
      setPhotoInput('')
    }
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    const landlordId = property.landlord?.id || `landlord-${property.id}`
    const landlordName = property.landlord?.name || property.ownerName || 'Property Owner'

    onCreate({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyAddress: property.location,
      tenantId: user.id,
      tenantName: user.login,
      tenantEmail: user.email,
      tenantPhone: '',
      landlordId,
      landlordName,
      leaseId,
      category,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      priority,
      status: 'submitted',
      photos: photos.length > 0 ? photos : undefined,
      preferredAccessTime: preferredAccessTime.trim() || undefined,
      accessInstructions: accessInstructions.trim() || undefined,
      permissionToEnter,
      tenantNotes: tenantNotes.trim() || undefined,
      updates: []
    })

    setCategory('other')
    setTitle('')
    setDescription('')
    setLocation('')
    setPriority('medium')
    setPhotos([])
    setPreferredAccessTime('')
    setAccessInstructions('')
    setPermissionToEnter(false)
    setTenantNotes('')
    setPhotoInput('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Maintenance Request</DialogTitle>
          <DialogDescription>
            Report an issue at {property.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Category *</Label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id as MaintenanceRequest['category'])}
                    className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      category === cat.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Icon size={24} weight={category === cat.id ? 'fill' : 'regular'} />
                    <span className="text-xs font-medium text-center">{cat.name}</span>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {CATEGORIES.find(c => c.id === category)?.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Please describe the issue in detail, including when it started and any steps you've taken..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location in Property *</Label>
            <Input
              id="location"
              placeholder="e.g., Kitchen sink, Master bedroom closet"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as MaintenanceRequest['priority'])}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${PRIORITY_COLORS.low}`} />
                    Low - Can wait a few weeks
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${PRIORITY_COLORS.medium}`} />
                    Medium - Should be fixed soon
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${PRIORITY_COLORS.high}`} />
                    High - Needs attention this week
                  </div>
                </SelectItem>
                <SelectItem value="urgent">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${PRIORITY_COLORS.urgent}`} />
                    Urgent - Emergency requiring immediate attention
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Photos (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter photo URL"
                value={photoInput}
                onChange={(e) => setPhotoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddPhoto()
                  }
                }}
              />
              <Button type="button" onClick={handleAddPhoto} variant="outline" size="icon" aria-label="Add photo" title="Add photo">
                <Plus size={20} />
              </Button>
            </div>
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove photo"
                      title="Remove photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Camera size={14} />
              Photos help landlords understand and prioritize the issue
            </p>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h4 className="font-semibold">Access Information</h4>

            <div className="space-y-2">
              <Label htmlFor="preferred-time">Preferred Access Time</Label>
              <Input
                id="preferred-time"
                placeholder="e.g., Weekdays after 5pm, Weekends anytime"
                value={preferredAccessTime}
                onChange={(e) => setPreferredAccessTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="access-instructions">Access Instructions</Label>
              <Textarea
                id="access-instructions"
                placeholder="Any special instructions for accessing the property or specific area..."
                value={accessInstructions}
                onChange={(e) => setAccessInstructions(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="permission-to-enter">Permission to Enter</Label>
                <p className="text-xs text-muted-foreground">
                  Allow landlord/maintenance staff to enter if you're not home
                </p>
              </div>
              <Switch
                id="permission-to-enter"
                checked={permissionToEnter}
                onCheckedChange={setPermissionToEnter}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any other information that might be helpful..."
              value={tenantNotes}
              onChange={(e) => setTenantNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Upload size={20} />
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
