import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SmartDevice, SmartDeviceActivity, Property, User } from '@/lib/types'
import { SmartHomeControlPanel } from './SmartHomeControlPanel'
import { getOnlineDevices, getOfflineDevices } from '@/lib/smartHomeUtils'
import { House, Lightning } from '@phosphor-icons/react'

interface SmartHomeManagementPanelProps {
  properties: Property[]
  devices: SmartDevice[]
  activities: SmartDeviceActivity[]
  currentUser: User
  onUpdateDevice: (device: SmartDevice) => void
  onAddDevice: (device: Omit<SmartDevice, 'id' | 'lastUpdated' | 'installedAt'>) => void
  onRemoveDevice: (deviceId: string) => void
  onDeviceAction: (deviceId: string, action: string, value?: any) => void
}

export function SmartHomeManagementPanel({
  properties,
  devices,
  activities,
  currentUser,
  onUpdateDevice,
  onAddDevice,
  onRemoveDevice,
  onDeviceAction
}: SmartHomeManagementPanelProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    properties.length > 0 ? properties[0].id : ''
  )

  const selectedProperty = properties.find(p => p.id === selectedPropertyId)
  const propertyDevices = devices.filter(d => d.propertyId === selectedPropertyId)
  const propertyActivities = activities.filter(a => a.propertyId === selectedPropertyId)

  const isLandlord = properties.some(p => 
    p.landlord?.id === currentUser.id || p.ownerEmail === currentUser.email
  )

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <House className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No properties found</h3>
          <p className="text-sm text-muted-foreground">
            Add properties to manage their smart devices
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!selectedProperty) {
    return null
  }

  return (
    <div className="space-y-6">
      {properties.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Property</CardTitle>
            <CardDescription>Choose a property to manage its smart devices</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
              <SelectTrigger aria-label="Select property">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {properties.map(property => (
                  <SelectItem key={property.id} value={property.id}>
                    <div className="flex items-center gap-2">
                      <span>{property.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {devices.filter(d => d.propertyId === property.id).length} devices
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <SmartHomeControlPanel
        property={selectedProperty}
        devices={propertyDevices}
        activities={propertyActivities}
        currentUser={currentUser}
        isLandlord={isLandlord}
        onUpdateDevice={onUpdateDevice}
        onAddDevice={onAddDevice}
        onRemoveDevice={onRemoveDevice}
        onDeviceAction={onDeviceAction}
      />
    </div>
  )
}
