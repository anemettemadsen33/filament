import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from '@phosphor-icons/react'
import type { CompetitorAnalysis } from '@/lib/seo-types'

interface CompetitorAnalyzerProps {
  analyses: CompetitorAnalysis[]
  onAddAnalysis: (analysis: CompetitorAnalysis) => void
  onDeleteAnalysis: (id: string) => void
}

export function CompetitorAnalyzer({ analyses }: CompetitorAnalyzerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-6 w-6" weight="bold" />
          Competitor Analysis
        </CardTitle>
        <CardDescription>
          Compare your SEO strategy with competitors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12">
          <Target className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
          <p className="text-muted-foreground text-center">
            Competitor analysis tool - Coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
