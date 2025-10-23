import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Property, LockboxInfo } from '@/lib/types'
import { getLockboxTypeLabel } from '@/lib/checkInUtils'
import { Key, Lock, NumberSquareOne, DoorOpen } from '@phosphor-icons/react'

interface LockboxSettingsModalProps {
  open: boolean
  onClose: () => void
  property: Property
  onSave: (propertyId: string, lockboxInfo: LockboxInfo) => void
}

export function LockboxSettingsModal({
  open,
  onClose,
  property,
  onSave
}: LockboxSettingsModalProps) {
  const [lockboxInfo, setLockboxInfo] = useState<LockboxInfo>(
    property.lockbox || {
      enabled: false,
      type: 'smart_lock'
    }
  )

  const handleSave = () => {
    onSave(property.id, lockboxInfo)
    onClose()
  }

  const lockboxTypes = [
    { value: 'smart_lock', label: 'Smart Lock', icon: <Lock className="w-4 h-4" /> },
    { value: 'keypad', label: 'Keypad Entry', icon: <NumberSquareOne className="w-4 h-4" /> },
    { value: 'key_lockbox', label: 'Key Lockbox', icon: <Key className="w-4 h-4" /> },
    { value: 'combination_lock', label: 'Combination Lock', icon: <Lock className="w-4 h-4" /> }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Self Check-In Settings</DialogTitle>
          <DialogDescription>
            Configure lockbox and check-in instructions for {property.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enable Self Check-In</CardTitle>
              <CardDescription>
                Allow guests to check in without meeting you in person
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Self Check-In</Label>
                  <p className="text-sm text-muted-foreground">
                    Guests can access the property using a lockbox or smart lock
                  </p>
                </div>
                <Switch
                  checked={lockboxInfo.enabled}
                  onCheckedChange={(enabled) =>
                    setLockboxInfo({ ...lockboxInfo, enabled })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {lockboxInfo.enabled && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lockbox Type</CardTitle>
                  <CardDescription>
                    Select the type of entry system you have
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Entry System Type</Label>
                    <Select
                      value={lockboxInfo.type}
                      onValueChange={(value) =>
                        setLockboxInfo({
                          ...lockboxInfo,
                          type: value as LockboxInfo['type']
                        })
                      }
                    >
                      <SelectTrigger aria-label="Entry system type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {lockboxTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {type.icon}
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Lockbox Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Front door, main entrance, left side of building"
                      value={lockboxInfo.location || ''}
                      onChange={(e) =>
                        setLockboxInfo({ ...lockboxInfo, location: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Describe where guests can find the lockbox
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Check-In Instructions</CardTitle>
                  <CardDescription>
                    Provide detailed instructions for guests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Additional Instructions</Label>
                    <Textarea
                      id="instructions"
                      placeholder="Provide step-by-step instructions for accessing the property..."
                      rows={4}
                      value={lockboxInfo.instructions || ''}
                      onChange={(e) =>
                        setLockboxInfo({ ...lockboxInfo, instructions: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Include any specific steps or tips for accessing the property
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">WiFi & Amenities</CardTitle>
                  <CardDescription>
                    Share WiFi and other essential information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wifiName">WiFi Network Name</Label>
                    <Input
                      id="wifiName"
                      placeholder="Network SSID"
                      value={lockboxInfo.wifiName || ''}
                      onChange={(e) =>
                        setLockboxInfo({ ...lockboxInfo, wifiName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="wifiPassword">WiFi Password</Label>
                    <Input
                      id="wifiPassword"
                      type="text"
                      placeholder="WiFi password"
                      value={lockboxInfo.wifiPassword || ''}
                      onChange={(e) =>
                        setLockboxInfo({ ...lockboxInfo, wifiPassword: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parking">Parking Instructions</Label>
                    <Textarea
                      id="parking"
                      placeholder="Describe where guests can park..."
                      rows={3}
                      value={lockboxInfo.parkingInstructions || ''}
                      onChange={(e) =>
                        setLockboxInfo({
                          ...lockboxInfo,
                          parkingInstructions: e.target.value
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Contact</CardTitle>
                  <CardDescription>
                    Provide a contact number for emergencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact Number</Label>
                    <Input
                      id="emergency"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={lockboxInfo.emergencyContact || ''}
                      onChange={(e) =>
                        setLockboxInfo({
                          ...lockboxInfo,
                          emergencyContact: e.target.value
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be shared with guests after booking
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
