import { Bell, Trash, CheckCircle, X } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PriceAlert } from '@/components/PriceAlertModal'
import { Property } from '@/lib/types'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

interface PriceAlertsPanelProps {
  alerts: PriceAlert[]
  properties: Property[]
  onDeleteAlert: (alertId: string) => void
  onToggleAlert: (alertId: string) => void
  onViewProperty: (propertyId: string) => void
}

export function PriceAlertsPanel({
  alerts,
  properties,
  onDeleteAlert,
  onToggleAlert,
  onViewProperty
}: PriceAlertsPanelProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={24} weight="duotone" />
            Price Alerts
          </CardTitle>
          <CardDescription>
            Get notified when property prices change
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bell size={32} weight="duotone" className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Price Alerts</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              You haven't set up any price alerts yet. Visit a property page to create one.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  const getConditionText = (alert: PriceAlert) => {
    switch (alert.condition) {
      case 'below':
        return `Drops below $${alert.targetPrice}`
      case 'above':
        return `Goes above $${alert.targetPrice}`
      case 'drops-by':
        return `Drops by ${alert.percentage}%`
      default:
        return ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell size={24} weight="duotone" />
          Price Alerts
        </CardTitle>
        <CardDescription>
          You have {alerts.filter(a => a.active).length} active alert{alerts.filter(a => a.active).length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const property = properties.find(p => p.id === alert.propertyId)
            
            if (!property) return null

            const isTriggered = 
              (alert.condition === 'below' && property.price <= alert.targetPrice) ||
              (alert.condition === 'above' && property.price >= alert.targetPrice)

            return (
              <div
                key={alert.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => onViewProperty(property.id)}
                        className="text-sm font-semibold hover:text-primary transition-colors truncate block"
                      >
                        {property.title}
                      </button>
                      <p className="text-xs text-muted-foreground">{property.location}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isTriggered && (
                        <Badge variant="default" className="bg-green-600">
                          <CheckCircle size={14} className="mr-1" weight="fill" />
                          Triggered
                        </Badge>
                      )}
                      <Badge variant={alert.active ? 'default' : 'secondary'}>
                        {alert.active ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Current: </span>
                      <span className="font-semibold">${property.price}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Alert: </span>
                      <span className="font-semibold">{getConditionText(alert)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Created {format(new Date(alert.createdAt), 'MMM dd, yyyy')}</span>
                    {alert.emailNotification && (
                      <>
                        <span>•</span>
                        <span>Email notifications enabled</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleAlert(alert.id)}
                    aria-label={alert.active ? 'Pause alert' : 'Activate alert'}
                    title={alert.active ? 'Pause alert' : 'Activate alert'}
                  >
                    {alert.active ? (
                      <Bell size={18} weight="fill" />
                    ) : (
                      <Bell size={18} />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteAlert(alert.id)}
                    aria-label="Delete alert"
                    title="Delete alert"
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
