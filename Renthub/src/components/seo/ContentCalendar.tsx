import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@phosphor-icons/react'
import type { ContentCalendarItem } from '@/lib/seo-types'

interface ContentCalendarProps {
  items: ContentCalendarItem[]
  onAddItem: (item: ContentCalendarItem) => void
  onUpdateItem: (id: string, updates: Partial<ContentCalendarItem>) => void
  onDeleteItem: (id: string) => void
}

export function ContentCalendar({ items }: ContentCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6" weight="bold" />
          Content Calendar
        </CardTitle>
        <CardDescription>
          Plan and schedule your content strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
          <p className="text-muted-foreground text-center">
            Content calendar - Coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
