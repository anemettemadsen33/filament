import { PriceHistory, Property } from './types'

export function generatePriceHistory(property: Property): PriceHistory {
  const history: Array<{ price: number; date: number }> = []
  const currentPrice = property.price
  const startDate = property.createdAt
  const now = Date.now()
  const daysDiff = Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
  
  if (daysDiff < 7) {
    history.push({ price: currentPrice, date: startDate })
    return { propertyId: property.id, history }
  }

  const dataPoints = Math.min(Math.max(5, Math.floor(daysDiff / 7)), 12)
  const baseVariation = currentPrice * 0.15
  
  let previousPrice = currentPrice + (Math.random() - 0.5) * baseVariation

  for (let i = 0; i < dataPoints; i++) {
    const daysAgo = Math.floor((daysDiff / dataPoints) * (dataPoints - i))
    const date = now - (daysAgo * 24 * 60 * 60 * 1000)
    
    const variation = (Math.random() - 0.5) * (baseVariation / 2)
    const priceChange = variation * (1 - i / dataPoints)
    let price = previousPrice + priceChange
    
    price = Math.max(currentPrice * 0.75, Math.min(currentPrice * 1.25, price))
    
    history.push({
      price: Math.round(price),
      date
    })
    
    previousPrice = price
  }

  history.push({ price: currentPrice, date: now })

  return {
    propertyId: property.id,
    history: history.sort((a, b) => a.date - b.date)
  }
}

export function checkPriceAlerts(
  property: Property,
  previousPrice: number,
  alerts: Array<{
    id: string
    propertyId: string
    targetPrice: number
    condition: 'below' | 'above' | 'drops-by'
    percentage?: number
    active: boolean
  }>
): string[] {
  const triggeredAlerts: string[] = []
  
  const activeAlerts = alerts.filter(a => a.propertyId === property.id && a.active)
  
  for (const alert of activeAlerts) {
    let shouldTrigger = false
    
    switch (alert.condition) {
      case 'below':
        shouldTrigger = property.price <= alert.targetPrice && previousPrice > alert.targetPrice
        break
      case 'above':
        shouldTrigger = property.price >= alert.targetPrice && previousPrice < alert.targetPrice
        break
      case 'drops-by':
        if (alert.percentage) {
          const dropThreshold = previousPrice * (1 - alert.percentage / 100)
          shouldTrigger = property.price <= dropThreshold
        }
        break
    }
    
    if (shouldTrigger) {
      triggeredAlerts.push(alert.id)
    }
  }
  
  return triggeredAlerts
}
