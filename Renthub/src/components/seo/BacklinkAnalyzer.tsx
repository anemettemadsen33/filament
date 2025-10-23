import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link as LinkIcon } from '@phosphor-icons/react'
import type { BacklinkData } from '@/lib/seo-types'

interface BacklinkAnalyzerProps {
  backlinks: BacklinkData[]
  onAddBacklink: (backlink: BacklinkData) => void
  onDeleteBacklink: (id: string) => void
}

export function BacklinkAnalyzer({ backlinks }: BacklinkAnalyzerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-6 w-6" weight="bold" />
          Backlink Analyzer
        </CardTitle>
        <CardDescription>
          Analyze domain authority and backlink profiles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12">
          <LinkIcon className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
          <p className="text-muted-foreground text-center">
            Backlink analysis tool - Coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
