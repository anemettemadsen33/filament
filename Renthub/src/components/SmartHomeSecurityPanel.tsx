import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from '@phosphor-icons/react'
import { Property, SmartDevice } from '@/lib/types'

interface SmartHomeSecurityPanelProps {
  property: Property
  devices: SmartDevice[]
  isLandlord: boolean
}

export function SmartHomeSecurityPanel({
  property,
  devices,
  isLandlord
}: SmartHomeSecurityPanelProps) {
  const securityDevices = devices.filter(d => 
    ['camera', 'lock', 'doorbell', 'alarm', 'sensor'].includes(d.type)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Monitoring</CardTitle>
        <CardDescription>View security devices and recent events</CardDescription>
      </CardHeader>
      <CardContent>
        {securityDevices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldCheck className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No security devices</h3>
            <p className="text-sm text-muted-foreground">
              Add security devices to monitor your property
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {securityDevices.map(device => (
              <div
                key={device.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="font-medium">{device.name}</div>
                  <div className="text-sm text-muted-foreground">{device.location}</div>
                </div>
                <Badge variant={device.status === 'online' ? 'default' : 'secondary'}>
                  {device.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
