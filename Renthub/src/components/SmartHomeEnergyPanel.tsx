import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartLine } from '@phosphor-icons/react'
import { Property, SmartDevice } from '@/lib/types'
import { generateEnergyData } from '@/lib/smartHomeUtils'

interface SmartHomeEnergyPanelProps {
  property: Property
  devices: SmartDevice[]
}

export function SmartHomeEnergyPanel({
  property,
  devices
}: SmartHomeEnergyPanelProps) {
  const energyData = generateEnergyData(property.id, 7)
  const totalConsumption = energyData.reduce((sum, d) => sum + d.consumption, 0)
  const avgDaily = totalConsumption / energyData.length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsumption.toFixed(1)} kWh</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDaily.toFixed(1)} kWh</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Est. Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalConsumption * 0.15).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption</CardTitle>
          <CardDescription>Monitor your energy usage over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {energyData.slice().reverse().map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{new Date(data.date).toLocaleDateString()}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{data.consumption.toFixed(1)} kWh</span>
                  <span className="text-sm text-muted-foreground">${data.cost?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
