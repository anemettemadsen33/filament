import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Power, 
  Thermometer, 
  Lock, 
  LockOpen, 
  Camera, 
  Lightbulb,
  Lightning,
  WifiHigh,
  WifiSlash,
  BatteryFull,
  BatteryLow
} from '@phosphor-icons/react'
import { SmartDevice } from '@/lib/types'
import { deviceIcons, deviceTypeNames } from '@/lib/smartHomeUtils'
import { cn } from '@/lib/utils'

interface SmartDeviceCardProps {
  device: SmartDevice
  viewMode: 'grid' | 'list'
  isLandlord: boolean
  onClick: () => void
  onQuickAction: (device: SmartDevice, action: string, value?: any) => void
}

export function SmartDeviceCard({
  device,
  viewMode,
  isLandlord,
  onClick,
  onQuickAction
}: SmartDeviceCardProps) {
  const handleToggle = () => {
    onQuickAction(device, 'toggle')
  }

  const handleBrightnessChange = (value: number[]) => {
    onQuickAction(device, 'setBrightness', value[0])
  }

  const handleTemperatureChange = (value: number[]) => {
    onQuickAction(device, 'setTemperature', value[0])
  }

  if (viewMode === 'list') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <CardContent className="flex items-center gap-4 p-4">
          <div className="text-3xl">{deviceIcons[device.type]}</div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm truncate">{device.name}</h3>
              <Badge variant={device.status === 'online' ? 'default' : 'secondary'} className="text-xs">
                {device.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{device.location}</p>
          </div>

          <div className="flex items-center gap-2">
            {device.battery !== undefined && (
              <div className="flex items-center gap-1 text-xs">
                {device.battery < 20 ? (
                  <BatteryLow className="w-4 h-4 text-warning" />
                ) : (
                  <BatteryFull className="w-4 h-4" />
                )}
                <span>{device.battery}%</span>
              </div>
            )}
            
            {device.capabilities.onOff && (
              <Switch
                checked={device.state.power || false}
                onCheckedChange={handleToggle}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="text-3xl">{deviceIcons[device.type]}</div>
          <div className="flex items-center gap-2">
            <Badge variant={device.status === 'online' ? 'default' : 'secondary'} className="text-xs">
              {device.status === 'online' ? (
                <WifiHigh className="w-3 h-3 mr-1" />
              ) : (
                <WifiSlash className="w-3 h-3 mr-1" />
              )}
              {device.status}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm mb-1">{device.name}</h3>
          <p className="text-xs text-muted-foreground">{device.location}</p>
          <p className="text-xs text-muted-foreground">{deviceTypeNames[device.type]}</p>
        </div>

        {device.capabilities.onOff && (
          <div className="flex items-center justify-between">
            <span className="text-sm">Power</span>
            <Switch
              checked={device.state.power || false}
              onCheckedChange={handleToggle}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {device.capabilities.dimming && device.state.power && (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-sm">Brightness</span>
              <span className="text-sm font-medium">{device.state.brightness}%</span>
            </div>
            <Slider
              value={[device.state.brightness || 0]}
              onValueChange={handleBrightnessChange}
              max={100}
              step={1}
            />
          </div>
        )}

        {device.type === 'thermostat' && (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-sm">Temperature</span>
              <span className="text-sm font-medium">{device.state.targetTemperature}°C</span>
            </div>
            <Slider
              value={[device.state.targetTemperature || 20]}
              onValueChange={handleTemperatureChange}
              min={15}
              max={30}
              step={0.5}
            />
          </div>
        )}

        {device.type === 'lock' && (
          <div className="flex items-center justify-between">
            <span className="text-sm">{device.state.locked ? 'Locked' : 'Unlocked'}</span>
            {device.state.locked ? (
              <Lock className="w-5 h-5 text-accent" />
            ) : (
              <LockOpen className="w-5 h-5 text-warning" />
            )}
          </div>
        )}

        {device.battery !== undefined && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Battery</span>
            <div className="flex items-center gap-1">
              {device.battery < 20 ? (
                <BatteryLow className={cn(
                  "w-4 h-4",
                  device.battery < 10 ? "text-destructive" : "text-warning"
                )} />
              ) : (
                <BatteryFull className="w-4 h-4" />
              )}
              <span>{device.battery}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
