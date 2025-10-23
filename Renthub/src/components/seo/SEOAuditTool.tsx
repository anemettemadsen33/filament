import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gauge } from '@phosphor-icons/react'
import type { SEOAudit } from '@/lib/seo-types'

interface SEOAuditToolProps {
  audits: SEOAudit[]
  onAddAudit: (audit: SEOAudit) => void
  onDeleteAudit: (id: string) => void
}

export function SEOAuditTool({ audits }: SEOAuditToolProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-6 w-6" weight="bold" />
          SEO Audit
        </CardTitle>
        <CardDescription>
          Comprehensive website SEO analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12">
          <Gauge className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
          <p className="text-muted-foreground text-center">
            SEO audit tool - Coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
