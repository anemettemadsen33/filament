import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SmartDevice } from '@/lib/types'
import { deviceTypeNames } from '@/lib/smartHomeUtils'
import { Power, Trash, Info, Lightning } from '@phosphor-icons/react'

interface SmartDeviceDetailModalProps {
  device: SmartDevice
  open: boolean
  onClose: () => void
  isLandlord: boolean
  onUpdate: (device: SmartDevice) => void
  onRemove: (deviceId: string) => void
  onAction: (deviceId: string, action: string, value?: any) => void
}

export function SmartDeviceDetailModal({
  device,
  open,
  onClose,
  isLandlord,
  onUpdate,
  onRemove,
  onAction
}: SmartDeviceDetailModalProps) {
  const handleToggle = () => {
    onAction(device.id, 'toggle')
  }

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove this device?')) {
      onRemove(device.id)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{device.name}</DialogTitle>
            <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
              {device.status}
            </Badge>
          </div>
          <DialogDescription>
            {deviceTypeNames[device.type]} • {device.location}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="control" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="control">
              <Power className="w-4 h-4 mr-2" />
              Control
            </TabsTrigger>
            <TabsTrigger value="info">
              <Info className="w-4 h-4 mr-2" />
              Info
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Lightning className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-4">
            {device.capabilities.onOff && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">Power</span>
                <Switch
                  checked={device.state.power || false}
                  onCheckedChange={handleToggle}
                />
              </div>
            )}

            {device.capabilities.dimming && device.state.power && (
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Brightness</span>
                  <span className="text-sm font-medium">{device.state.brightness}%</span>
                </div>
                <Slider
                  value={[device.state.brightness || 0]}
                  onValueChange={(value) => onAction(device.id, 'setBrightness', value[0])}
                  max={100}
                  step={1}
                />
              </div>
            )}

            {device.type === 'thermostat' && (
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Target Temperature</span>
                  <span className="text-sm font-medium">{device.state.targetTemperature}°C</span>
                </div>
                <Slider
                  value={[device.state.targetTemperature || 20]}
                  onValueChange={(value) => onAction(device.id, 'setTemperature', value[0])}
                  min={15}
                  max={30}
                  step={0.5}
                />
                <div className="text-sm text-muted-foreground">
                  Current: {device.state.temperature}°C • Humidity: {device.state.humidity}%
                </div>
              </div>
            )}

            {device.type === 'lock' && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">{device.state.locked ? 'Locked' : 'Unlocked'}</span>
                <Button
                  onClick={() => onAction(device.id, device.state.locked ? 'unlock' : 'lock')}
                  variant={device.state.locked ? 'default' : 'outline'}
                >
                  {device.state.locked ? 'Unlock' : 'Lock'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Brand</span>
                <span className="font-medium">{device.brand}</span>
              </div>
              {device.model && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium">{device.model}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Firmware</span>
                <span className="font-medium">{device.firmwareVersion || 'N/A'}</span>
              </div>
              {device.battery !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Battery</span>
                  <span className="font-medium">{device.battery}%</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Installed</span>
                <span className="font-medium">{new Date(device.installedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">{new Date(device.lastUpdated).toLocaleString()}</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {device.settings?.autoLock !== undefined && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Auto Lock</div>
                  <div className="text-sm text-muted-foreground">
                    Lock automatically after {device.settings.autoLockDelay}s
                  </div>
                </div>
                <Switch checked={device.settings.autoLock} disabled />
              </div>
            )}

            {device.settings?.notifications !== undefined && (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="font-medium">Notifications</div>
                <Switch checked={device.settings.notifications} disabled />
              </div>
            )}

            {isLandlord && (
              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={handleRemove}
                  className="w-full"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Remove Device
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
