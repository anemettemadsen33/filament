import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  Star, 
  Clock, 
  ChatCircle, 
  CheckCircle,
  Buildings,
  Calendar,
  ChartBar,
  ShieldCheck
} from '@phosphor-icons/react'
import { Landlord } from '@/lib/types'
import { LandlordBadge } from './LandlordBadge'
import { getVerificationProgress } from '@/lib/badgeUtils'

interface LandlordProfileProps {
  landlord: Landlord
  compact?: boolean
}

export function LandlordProfile({ landlord, compact = false }: LandlordProfileProps) {
  const verificationProgress = getVerificationProgress(landlord.verification)
  
  const formatResponseTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }

  if (compact) {
    return (
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 border-2 border-primary/10">
          <AvatarImage src={landlord.avatar} alt={landlord.name} />
          <AvatarFallback>{landlord.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate">{landlord.name}</h4>
            {landlord.verification.verified && (
              <CheckCircle size={16} weight="fill" className="text-blue-600 shrink-0" />
            )}
            {landlord.isSuperhost && (
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 text-xs px-1.5 py-0">
                <Star size={12} weight="fill" className="mr-0.5" />
                Superhost
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {landlord.stats.averageRating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={14} weight="fill" className="text-amber-500" />
                <span className="font-medium text-foreground">{landlord.stats.averageRating.toFixed(1)}</span>
                <span>({landlord.stats.reviewCount})</span>
              </div>
            )}
            {landlord.stats.responseTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatResponseTime(landlord.stats.responseTime)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Buildings size={14} />
              <span>{landlord.stats.activeListings} {landlord.stats.activeListings === 1 ? 'listing' : 'listings'}</span>
            </div>
          </div>
          
          {landlord.badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {landlord.badges.slice(0, 3).map((badge) => (
                <LandlordBadge key={badge.id} badge={badge} size="sm" />
              ))}
              {landlord.badges.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{landlord.badges.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="h-20 w-20 border-2 border-primary/10">
          <AvatarImage src={landlord.avatar} alt={landlord.name} />
          <AvatarFallback className="text-2xl">{landlord.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold">{landlord.name}</h3>
            {landlord.verification.verified && (
              <CheckCircle size={24} weight="fill" className="text-blue-600" />
            )}
          </div>
          
          {landlord.isSuperhost && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 mb-3">
              <Star size={16} weight="fill" className="mr-1" />
              Superhost
            </Badge>
          )}
          
          {landlord.bio && (
            <p className="text-sm text-muted-foreground mb-3">{landlord.bio}</p>
          )}
          
          {landlord.languages && landlord.languages.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChatCircle size={16} />
              <span>Speaks: {landlord.languages.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <ShieldCheck size={20} />
            Verification Status
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Profile Verification</span>
              <span className="font-medium">{verificationProgress.percentage}%</span>
            </div>
            <Progress value={verificationProgress.percentage} className="h-2" />
            <div className="flex flex-wrap gap-2 mt-3">
              {landlord.verification.email && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle size={12} className="mr-1" weight="fill" />
                  Email
                </Badge>
              )}
              {landlord.verification.phone && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle size={12} className="mr-1" weight="fill" />
                  Phone
                </Badge>
              )}
              {landlord.verification.identity && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle size={12} className="mr-1" weight="fill" />
                  Identity
                </Badge>
              )}
              {landlord.verification.proofOfOwnership && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle size={12} className="mr-1" weight="fill" />
                  Ownership
                </Badge>
              )}
              {landlord.verification.backgroundCheck && (
                <Badge variant="outline" className="text-xs">
                  <CheckCircle size={12} className="mr-1" weight="fill" />
                  Background
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <ChartBar size={20} />
            Host Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Star size={16} weight="fill" className="text-amber-500" />
                Rating
              </div>
              <p className="text-2xl font-bold">
                {landlord.stats.averageRating > 0 ? landlord.stats.averageRating.toFixed(1) : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">
                {landlord.stats.reviewCount} {landlord.stats.reviewCount === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock size={16} />
                Response Time
              </div>
              <p className="text-2xl font-bold">{formatResponseTime(landlord.stats.responseTime)}</p>
              <p className="text-xs text-muted-foreground">
                {landlord.stats.responseRate}% response rate
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Buildings size={16} />
                Properties
              </div>
              <p className="text-2xl font-bold">{landlord.stats.totalProperties}</p>
              <p className="text-xs text-muted-foreground">
                {landlord.stats.activeListings} active
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar size={16} />
                Experience
              </div>
              <p className="text-2xl font-bold">{landlord.stats.yearsOnPlatform}</p>
              <p className="text-xs text-muted-foreground">
                {landlord.stats.yearsOnPlatform === 1 ? 'year' : 'years'} hosting
              </p>
            </div>
          </div>
        </div>
        
        {landlord.badges.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3">Badges & Recognition</h4>
              <div className="flex flex-wrap gap-2">
                {landlord.badges.map((badge) => (
                  <LandlordBadge key={badge.id} badge={badge} size="md" showLabel />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
