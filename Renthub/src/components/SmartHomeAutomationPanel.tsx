import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Lightning } from '@phosphor-icons/react'
import { Property, SmartDevice } from '@/lib/types'

interface SmartHomeAutomationPanelProps {
  property: Property
  devices: SmartDevice[]
  isLandlord: boolean
}

export function SmartHomeAutomationPanel({
  property,
  devices,
  isLandlord
}: SmartHomeAutomationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation & Scenes</CardTitle>
        <CardDescription>Create automated routines for your smart devices</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Lightning className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No automations yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create automated scenes and routines for your devices
          </p>
          {isLandlord && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Automation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
