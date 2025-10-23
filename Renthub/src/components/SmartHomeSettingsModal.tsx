import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Property } from '@/lib/types'

interface SmartHomeSettingsModalProps {
  property: Property
  open: boolean
  onClose: () => void
}

export function SmartHomeSettingsModal({
  property,
  open,
  onClose
}: SmartHomeSettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Smart Home Settings</DialogTitle>
          <DialogDescription>
            Configure smart home options for {property.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Guest Access</div>
              <div className="text-sm text-muted-foreground">
                Allow tenants to control devices
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Energy Monitoring</div>
              <div className="text-sm text-muted-foreground">
                Track energy consumption
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Security Alerts</div>
              <div className="text-sm text-muted-foreground">
                Receive notifications for security events
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
