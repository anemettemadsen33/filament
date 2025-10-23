import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Power, 
  Thermometer, 
  Lock, 
  LockOpen, 
  Camera, 
  Lightbulb, 
  Plus,
  GridFour,
  ListBullets,
  ChartLine,
  Gear,
  Lightning,
  ShieldCheck
} from '@phosphor-icons/react'
import { SmartDevice, SmartDeviceActivity, Property, User } from '@/lib/types'
import { deviceIcons, getUniqueLocations, getOnlineDevices, getOfflineDevices, getLowBatteryDevices } from '@/lib/smartHomeUtils'
import { SmartDeviceCard } from './SmartDeviceCard'
import { SmartDeviceDetailModal } from './SmartDeviceDetailModal'
import { SmartHomeAutomationPanel } from './SmartHomeAutomationPanel'
import { SmartHomeEnergyPanel } from './SmartHomeEnergyPanel'
import { SmartHomeSecurityPanel } from './SmartHomeSecurityPanel'
import { SmartHomeSettingsModal } from './SmartHomeSettingsModal'
import { AddSmartDeviceModal } from './AddSmartDeviceModal'
import { cn } from '@/lib/utils'

interface SmartHomeControlPanelProps {
  property: Property
  devices: SmartDevice[]
  activities: SmartDeviceActivity[]
  currentUser: User | null
  isLandlord: boolean
  onUpdateDevice: (device: SmartDevice) => void
  onAddDevice: (device: Omit<SmartDevice, 'id' | 'lastUpdated' | 'installedAt'>) => void
  onRemoveDevice: (deviceId: string) => void
  onDeviceAction: (deviceId: string, action: string, value?: any) => void
}

export function SmartHomeControlPanel({
  property,
  devices,
  activities,
  currentUser,
  isLandlord,
  onUpdateDevice,
  onAddDevice,
  onRemoveDevice,
  onDeviceAction
}: SmartHomeControlPanelProps) {
  const [selectedDevice, setSelectedDevice] = useState<SmartDevice | null>(null)
  const [showDeviceDetail, setShowDeviceDetail] = useState(false)
  const [showAddDevice, setShowAddDevice] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterLocation, setFilterLocation] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const locations = getUniqueLocations(devices)
  const onlineDevices = getOnlineDevices(devices)
  const offlineDevices = getOfflineDevices(devices)
  const lowBatteryDevices = getLowBatteryDevices(devices)

  const filteredDevices = devices.filter(device => {
    if (filterLocation !== 'all' && device.location !== filterLocation) return false
    if (filterType !== 'all' && device.type !== filterType) return false
    return true
  })

  const handleDeviceClick = (device: SmartDevice) => {
    setSelectedDevice(device)
    setShowDeviceDetail(true)
  }

  const handleQuickAction = (device: SmartDevice, action: string, value?: any) => {
    onDeviceAction(device.id, action, value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Smart Home Control</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {property.title}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLandlord && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
              >
                <Gear className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddDevice(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Device
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{onlineDevices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{offlineDevices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Battery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{lowBatteryDevices.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="devices">
            <GridFour className="w-4 h-4 mr-2" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Lightning className="w-4 h-4 mr-2" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="energy">
            <ChartLine className="w-4 h-4 mr-2" />
            Energy
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="activity">
            <ListBullets className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm bg-background"
                aria-label="Filter by location"
              >
                <option value="all">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm bg-background"
                aria-label="Filter by device type"
              >
                <option value="all">All Types</option>
                <option value="light">Lights</option>
                <option value="thermostat">Thermostats</option>
                <option value="lock">Locks</option>
                <option value="camera">Cameras</option>
                <option value="sensor">Sensors</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <GridFour className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <ListBullets className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {filteredDevices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GridFour className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No devices found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isLandlord ? 'Add your first smart device to get started' : 'No devices available in this property'}
                </p>
                {isLandlord && (
                  <Button onClick={() => setShowAddDevice(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Device
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
            )}>
              {filteredDevices.map(device => (
                <SmartDeviceCard
                  key={device.id}
                  device={device}
                  viewMode={viewMode}
                  isLandlord={isLandlord}
                  onClick={() => handleDeviceClick(device)}
                  onQuickAction={handleQuickAction}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="automation">
          <SmartHomeAutomationPanel
            property={property}
            devices={devices}
            isLandlord={isLandlord}
          />
        </TabsContent>

        <TabsContent value="energy">
          <SmartHomeEnergyPanel
            property={property}
            devices={devices}
          />
        </TabsContent>

        <TabsContent value="security">
          <SmartHomeSecurityPanel
            property={property}
            devices={devices}
            isLandlord={isLandlord}
          />
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                View all device activity and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ChartLine className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Device activity will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.slice(0, 50).map(activity => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="text-2xl">{deviceIcons[devices.find(d => d.id === activity.deviceId)?.type || 'sensor']}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{activity.deviceName}</span>
                            <Badge variant="outline" className="text-xs">
                              {activity.location}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.action}
                            {activity.userName && (
                              <span className="ml-1">by {activity.userName}</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedDevice && (
        <SmartDeviceDetailModal
          device={selectedDevice}
          open={showDeviceDetail}
          onClose={() => {
            setShowDeviceDetail(false)
            setSelectedDevice(null)
          }}
          isLandlord={isLandlord}
          onUpdate={onUpdateDevice}
          onRemove={onRemoveDevice}
          onAction={onDeviceAction}
        />
      )}

      {isLandlord && (
        <>
          <AddSmartDeviceModal
            propertyId={property.id}
            open={showAddDevice}
            onClose={() => setShowAddDevice(false)}
            onAdd={onAddDevice}
          />
          <SmartHomeSettingsModal
            property={property}
            open={showSettings}
            onClose={() => setShowSettings(false)}
          />
        </>
      )}
    </div>
  )
}
