import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SmartDevice, SmartDeviceType } from '@/lib/types'
import { deviceBrands, deviceTypeNames } from '@/lib/smartHomeUtils'
import { toast } from 'sonner'

interface AddSmartDeviceModalProps {
  propertyId: string
  open: boolean
  onClose: () => void
  onAdd: (device: Omit<SmartDevice, 'id' | 'lastUpdated' | 'installedAt'>) => void
}

export function AddSmartDeviceModal({
  propertyId,
  open,
  onClose,
  onAdd
}: AddSmartDeviceModalProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<SmartDeviceType>('light')
  const [brand, setBrand] = useState(deviceBrands[0])
  const [location, setLocation] = useState('')

  const handleSubmit = () => {
    if (!name || !location) {
      toast.error('Please fill in all required fields')
      return
    }

    const newDevice: Omit<SmartDevice, 'id' | 'lastUpdated' | 'installedAt'> = {
      propertyId,
      name,
      type,
      brand,
      location,
      status: 'online',
      capabilities: {
        onOff: true,
        dimming: type === 'light',
        temperature: type === 'thermostat',
        lock: type === 'lock',
        camera: type === 'camera'
      },
      state: {
        power: false
      }
    }

    onAdd(newDevice)
    setName('')
    setLocation('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Smart Device</DialogTitle>
          <DialogDescription>
            Add a new smart device to this property
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="device-name">Device Name *</Label>
            <Input
              id="device-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Living Room Light"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-type">Type *</Label>
            <select
              id="device-type"
              value={type}
              onChange={(e) => setType(e.target.value as SmartDeviceType)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              {Object.entries(deviceTypeNames).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-brand">Brand *</Label>
            <select
              id="device-brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-background"
            >
              {deviceBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-location">Location *</Label>
            <Input
              id="device-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Living Room"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Device</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
