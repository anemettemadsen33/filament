import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format } from 'date-fns'
import { TrendUp, TrendDown, Minus } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PriceHistory } from '@/lib/types'

interface PriceHistoryChartProps {
  priceHistory: PriceHistory
  currentPrice: number
}

export function PriceHistoryChart({ priceHistory, currentPrice }: PriceHistoryChartProps) {
  const chartData = useMemo(() => {
    return priceHistory.history
      .sort((a, b) => a.date - b.date)
      .map(item => ({
        date: format(new Date(item.date), 'MMM dd'),
        fullDate: format(new Date(item.date), 'MMM dd, yyyy'),
        price: item.price
      }))
  }, [priceHistory.history])

  const priceChange = useMemo(() => {
    if (priceHistory.history.length < 2) return { amount: 0, percentage: 0, trend: 'neutral' as const }
    
    const sortedHistory = [...priceHistory.history].sort((a, b) => a.date - b.date)
    const oldestPrice = sortedHistory[0].price
    const change = currentPrice - oldestPrice
    const percentage = (change / oldestPrice) * 100
    
    return {
      amount: Math.abs(change),
      percentage: Math.abs(percentage),
      trend: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const
    }
  }, [priceHistory.history, currentPrice])

  const getTrendIcon = () => {
    switch (priceChange.trend) {
      case 'up':
        return <TrendUp className="text-destructive" size={20} weight="bold" />
      case 'down':
        return <TrendDown className="text-green-600" size={20} weight="bold" />
      default:
        return <Minus className="text-muted-foreground" size={20} />
    }
  }

  const getTrendColor = () => {
    switch (priceChange.trend) {
      case 'up':
        return 'text-destructive'
      case 'down':
        return 'text-green-600'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
        <CardDescription>
          Track how the price has changed over time
        </CardDescription>
        {priceChange.trend !== 'neutral' && (
          <div className="flex items-center gap-2 mt-4">
            {getTrendIcon()}
            <div className="flex flex-col">
              <span className={`text-sm font-semibold ${getTrendColor()}`}>
                {priceChange.trend === 'up' ? '+' : '-'}${priceChange.amount.toFixed(0)} ({priceChange.percentage.toFixed(1)}%)
              </span>
              <span className="text-xs text-muted-foreground">
                Since {format(new Date(Math.min(...priceHistory.history.map(h => h.date))), 'MMM yyyy')}
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-sm font-medium">{payload[0].payload.fullDate}</p>
                      <p className="text-lg font-bold text-primary">
                        ${payload[0].value}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
