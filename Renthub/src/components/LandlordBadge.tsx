import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  CheckCircle, 
  Star, 
  Lightning, 
  Medal, 
  Leaf, 
  PawPrint, 
  Users, 
  WheelchairMotion,
  CalendarCheck,
  ClockCounterClockwise
} from '@phosphor-icons/react'
import { LandlordBadge as LandlordBadgeType } from '@/lib/types'

interface LandlordBadgeProps {
  badge: LandlordBadgeType
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const BADGE_ICONS: Record<LandlordBadgeType['type'], React.ElementType> = {
  verified: CheckCircle,
  superhost: Star,
  responsive: Lightning,
  quality: Medal,
  'eco-friendly': Leaf,
  'pet-friendly': PawPrint,
  'family-friendly': Users,
  accessibility: WheelchairMotion,
  'longterm-expert': CalendarCheck,
  flexible: ClockCounterClockwise
}

const BADGE_COLORS: Record<LandlordBadgeType['type'], string> = {
  verified: 'bg-blue-500/10 text-blue-600 border-blue-200',
  superhost: 'bg-amber-500/10 text-amber-600 border-amber-200',
  responsive: 'bg-purple-500/10 text-purple-600 border-purple-200',
  quality: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  'eco-friendly': 'bg-green-500/10 text-green-600 border-green-200',
  'pet-friendly': 'bg-orange-500/10 text-orange-600 border-orange-200',
  'family-friendly': 'bg-pink-500/10 text-pink-600 border-pink-200',
  accessibility: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
  'longterm-expert': 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
  flexible: 'bg-teal-500/10 text-teal-600 border-teal-200'
}

export function LandlordBadge({ badge, size = 'md', showLabel = false }: LandlordBadgeProps) {
  const Icon = BADGE_ICONS[badge.type]
  const colorClass = BADGE_COLORS[badge.type]
  
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20
  
  const BadgeContent = (
    <Badge 
      variant="outline" 
      className={`${colorClass} gap-1 ${size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'md' ? 'text-sm px-2.5 py-1' : 'text-base px-3 py-1.5'}`}
    >
      <Icon size={iconSize} weight="fill" />
      {showLabel && <span>{badge.name}</span>}
    </Badge>
  )
  
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {BadgeContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{badge.name}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
            {badge.earnedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                Earned {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
