import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartLine } from '@phosphor-icons/react'
import type { RankingData } from '@/lib/seo-types'

interface AnalyticsDashboardProps {
  rankings: RankingData[]
  onAddRanking: (ranking: RankingData) => void
}

export function AnalyticsDashboard({ rankings }: AnalyticsDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartLine className="h-6 w-6" weight="bold" />
          Analytics Dashboard
        </CardTitle>
        <CardDescription>
          Track keyword rankings and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12">
          <ChartLine className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
          <p className="text-muted-foreground text-center">
            Analytics dashboard - Coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
