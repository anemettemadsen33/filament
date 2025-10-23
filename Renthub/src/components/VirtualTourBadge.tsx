import { Badge } from '@/components/ui/badge'
import { Cube, Video } from '@phosphor-icons/react'
import { VirtualTour } from '@/lib/types'

interface VirtualTourBadgeProps {
  tours: VirtualTour[]
  variant?: 'default' | 'compact'
}

export function VirtualTourBadge({ tours, variant = 'default' }: VirtualTourBadgeProps) {
  if (!tours || tours.length === 0) return null

  const has360 = tours.some(t => t.type === '360')
  const hasVideo = tours.some(t => t.type === 'video')

  if (variant === 'compact') {
    return (
      <Badge variant="secondary" className="gap-1">
        <Cube />
        Virtual Tour
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {has360 && (
        <Badge variant="default" className="gap-1">
          <Cube />
          360° Tour
        </Badge>
      )}
      {hasVideo && (
        <Badge variant="secondary" className="gap-1">
          <Video />
          Video Tour
        </Badge>
      )}
    </div>
  )
}
