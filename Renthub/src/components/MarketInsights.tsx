import { useMemo } from 'react'
import { TrendUp, TrendDown, ChartLine, CurrencyDollar, MapPin, CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PriceHistory, Property } from '@/lib/types'

interface MarketInsightsProps {
  priceHistory: PriceHistory
  property: Property
  allProperties: Property[]
}

export function MarketInsights({ priceHistory, property, allProperties }: MarketInsightsProps) {
  const marketStats = useMemo(() => {
    const similarProperties = allProperties.filter(
      p => p.id !== property.id &&
      p.type === property.type &&
      p.rentalTerm === property.rentalTerm &&
      p.available
    )

    if (similarProperties.length === 0) {
      return null
    }

    const prices = similarProperties.map(p => p.price)
    const medianPrice = prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)]
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const pricePerSqft = property.price / property.area
    const avgPricePerSqft = similarProperties.reduce((sum, p) => sum + (p.price / p.area), 0) / similarProperties.length

    const percentageVsMedian = ((property.price - medianPrice) / medianPrice) * 100
    const isPricedFairly = Math.abs(percentageVsMedian) <= 10

    return {
      medianPrice,
      avgPrice,
      pricePerSqft,
      avgPricePerSqft,
      percentageVsMedian,
      isPricedFairly,
      similarCount: similarProperties.length
    }
  }, [property, allProperties])

  if (!marketStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>
            Not enough data to generate market insights
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getPricePositionPercentage = () => {
    return Math.max(0, Math.min(100, 50 + marketStats.percentageVsMedian))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLine size={24} weight="duotone" />
          Market Insights
        </CardTitle>
        <CardDescription>
          Compare this property with similar listings in the area
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Price Position</p>
              <div className="flex items-center gap-2">
                {marketStats.isPricedFairly ? (
                  <CheckCircle className="text-green-600" size={20} weight="fill" />
                ) : marketStats.percentageVsMedian > 0 ? (
                  <TrendUp className="text-destructive" size={20} weight="bold" />
                ) : (
                  <TrendDown className="text-green-600" size={20} weight="bold" />
                )}
                <Badge variant={marketStats.isPricedFairly ? "default" : "secondary"}>
                  {marketStats.isPricedFairly
                    ? 'Fairly Priced'
                    : marketStats.percentageVsMedian > 0
                    ? `${Math.abs(marketStats.percentageVsMedian).toFixed(1)}% Above Market`
                    : `${Math.abs(marketStats.percentageVsMedian).toFixed(1)}% Below Market`
                  }
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Lower</span>
              <span>Market Average</span>
              <span>Higher</span>
            </div>
            <Progress value={getPricePositionPercentage()} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Based on {marketStats.similarCount} similar {property.type}s in the area
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CurrencyDollar size={16} />
              <span className="text-xs font-medium">Median Price</span>
            </div>
            <p className="text-2xl font-bold">${marketStats.medianPrice}</p>
            <p className="text-xs text-muted-foreground">
              {property.rentalTerm === 'short-term' ? 'per night' : 'per month'}
            </p>
          </div>

          <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin size={16} />
              <span className="text-xs font-medium">Price per sq ft</span>
            </div>
            <p className="text-2xl font-bold">${marketStats.pricePerSqft.toFixed(2)}</p>
            <div className="flex items-center gap-1 text-xs">
              {marketStats.pricePerSqft < marketStats.avgPricePerSqft ? (
                <>
                  <TrendDown className="text-green-600" size={14} weight="bold" />
                  <span className="text-green-600">
                    {(((marketStats.avgPricePerSqft - marketStats.pricePerSqft) / marketStats.avgPricePerSqft) * 100).toFixed(1)}% below avg
                  </span>
                </>
              ) : (
                <>
                  <TrendUp className="text-destructive" size={14} weight="bold" />
                  <span className="text-destructive">
                    {(((marketStats.pricePerSqft - marketStats.avgPricePerSqft) / marketStats.avgPricePerSqft) * 100).toFixed(1)}% above avg
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {!marketStats.isPricedFairly && (
          <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
            <WarningCircle className="text-accent-foreground mt-0.5" size={20} weight="fill" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Market Analysis</p>
              <p className="text-xs text-muted-foreground">
                {marketStats.percentageVsMedian > 0
                  ? `This property is priced ${Math.abs(marketStats.percentageVsMedian).toFixed(1)}% higher than similar listings. You may want to negotiate or wait for a price drop.`
                  : `This property is priced ${Math.abs(marketStats.percentageVsMedian).toFixed(1)}% lower than similar listings. This could be a great deal!`
                }
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          <p className="text-sm font-medium">Price Breakdown</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <span className="text-muted-foreground">Your Price:</span>
            <span className="font-semibold">${property.price}</span>
            
            <span className="text-muted-foreground">Average:</span>
            <span>${marketStats.avgPrice.toFixed(0)}</span>
            
            <span className="text-muted-foreground">Median:</span>
            <span>${marketStats.medianPrice}</span>
            
            <span className="text-muted-foreground">Difference:</span>
            <span className={marketStats.percentageVsMedian > 0 ? 'text-destructive' : 'text-green-600'}>
              {marketStats.percentageVsMedian > 0 ? '+' : ''}${(property.price - marketStats.medianPrice).toFixed(0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
