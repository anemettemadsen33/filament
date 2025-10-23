import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { PriceHistory } from '@/lib/types'

interface PriceTrendBadgeProps {
  priceHistory: PriceHistory
  currentPrice: number
  compact?: boolean
}

export function PriceTrendBadge({ priceHistory, currentPrice, compact = false }: PriceTrendBadgeProps) {
  if (priceHistory.history.length < 2) {
    return null
  }

  const sortedHistory = [...priceHistory.history].sort((a, b) => a.date - b.date)
  const oldestPrice = sortedHistory[0].price
  const change = currentPrice - oldestPrice
  const percentage = (change / oldestPrice) * 100

  if (Math.abs(percentage) < 1) {
    return null
  }

  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {trend === 'up' && <TrendUp className="text-destructive" size={14} weight="bold" />}
        {trend === 'down' && <TrendDown className="text-green-600" size={14} weight="bold" />}
        {trend === 'neutral' && <Minus className="text-muted-foreground" size={14} />}
        <span className={`text-xs font-semibold ${
          trend === 'up' ? 'text-destructive' : trend === 'down' ? 'text-green-600' : 'text-muted-foreground'
        }`}>
          {Math.abs(percentage).toFixed(0)}%
        </span>
      </div>
    )
  }

  return (
    <Badge
      variant="secondary"
      className={`flex items-center gap-1 ${
        trend === 'up' ? 'bg-red-50 text-red-700 border-red-200' : 
        trend === 'down' ? 'bg-green-50 text-green-700 border-green-200' : 
        ''
      }`}
    >
      {trend === 'up' && <TrendUp size={12} weight="bold" />}
      {trend === 'down' && <TrendDown size={12} weight="bold" />}
      {trend === 'neutral' && <Minus size={12} />}
      <span className="text-xs font-semibold">
        {trend === 'up' ? '+' : ''}{percentage.toFixed(1)}%
      </span>
    </Badge>
  )
}
