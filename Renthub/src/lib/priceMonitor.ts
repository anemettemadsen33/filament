import { Property, Notification } from '@/lib/types'
import { PriceAlert } from '@/components/PriceAlertModal'
import { createNotification } from '@/lib/notifications'

export interface PriceChange {
  propertyId: string
  oldPrice: number
  newPrice: number
  percentageChange: number
}

export function detectPriceChanges(
  oldProperties: Property[],
  newProperties: Property[]
): PriceChange[] {
  const changes: PriceChange[] = []

  newProperties.forEach(newProp => {
    const oldProp = oldProperties.find(p => p.id === newProp.id)
    
    if (oldProp && oldProp.price !== newProp.price) {
      const percentageChange = ((newProp.price - oldProp.price) / oldProp.price) * 100
      
      changes.push({
        propertyId: newProp.id,
        oldPrice: oldProp.price,
        newPrice: newProp.price,
        percentageChange
      })
    }
  })

  return changes
}

export async function checkPriceAlerts(
  priceChange: PriceChange,
  alerts: PriceAlert[],
  property: Property
): Promise<Notification[]> {
  const triggeredNotifications: Notification[] = []

  const relevantAlerts = alerts.filter(
    alert => alert.propertyId === priceChange.propertyId && alert.active
  )

  for (const alert of relevantAlerts) {
    let shouldTrigger = false
    let message = ''

    switch (alert.condition) {
      case 'below':
        if (priceChange.newPrice < alert.targetPrice!) {
          shouldTrigger = true
          message = `Price dropped to $${priceChange.newPrice.toLocaleString()} (was $${priceChange.oldPrice.toLocaleString()})`
        }
        break
      
      case 'above':
        if (priceChange.newPrice > alert.targetPrice!) {
          shouldTrigger = true
          message = `Price increased to $${priceChange.newPrice.toLocaleString()} (was $${priceChange.oldPrice.toLocaleString()})`
        }
        break
      
      case 'drops-by':
        if (priceChange.percentageChange < 0 && Math.abs(priceChange.percentageChange) >= alert.percentage!) {
          shouldTrigger = true
          message = `Price dropped by ${Math.abs(priceChange.percentageChange).toFixed(1)}% to $${priceChange.newPrice.toLocaleString()}`
        }
        break
    }

    if (shouldTrigger) {
      const notification = await createNotification(
        alert.userId,
        'price_drop',
        `Price Alert: ${property.title}`,
        message,
        {
          propertyId: property.id,
          actionUrl: `/property/${property.id}`,
          metadata: {
            alertId: alert.id,
            oldPrice: priceChange.oldPrice,
            newPrice: priceChange.newPrice,
            percentageChange: priceChange.percentageChange
          }
        }
      )
      
      triggeredNotifications.push(notification)
    }
  }

  return triggeredNotifications
}

export function generatePropertyUpdateNotification(
  property: Property,
  userId: string,
  updateType: 'availability' | 'details' | 'images'
): Notification {
  let message = ''
  
  switch (updateType) {
    case 'availability':
      message = property.available 
        ? `"${property.title}" is now available for rent`
        : `"${property.title}" is no longer available`
      break
    case 'details':
      message = `Property details updated for "${property.title}"`
      break
    case 'images':
      message = `New photos added to "${property.title}"`
      break
  }

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type: 'property_update',
    title: 'Property Updated',
    message,
    propertyId: property.id,
    actionUrl: `/property/${property.id}`,
    read: false,
    createdAt: Date.now()
  }
}
