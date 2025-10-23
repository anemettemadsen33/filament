import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code } from '@phosphor-icons/react'
import type { MetaTags } from '@/lib/seo-types'

interface MetaTagGeneratorProps {
  metaTags: MetaTags[]
  onAddMetaTags: (tags: MetaTags) => void
  onDeleteMetaTags: (id: string) => void
}

export function MetaTagGenerator({ metaTags }: MetaTagGeneratorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-6 w-6" weight="bold" />
          Meta Tag Generator
        </CardTitle>
        <CardDescription>
          Generate optimized meta tags and Open Graph tags
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12">
          <Code className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
          <p className="text-muted-foreground text-center">
            Meta tag generator - Coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
