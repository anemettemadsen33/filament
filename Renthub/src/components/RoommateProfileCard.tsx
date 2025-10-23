import { RoommateProfile } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  MapPin, 
  Calendar, 
  CurrencyDollar, 
  Heart, 
  X, 
  ChatCircle,
  ShieldCheck,
  Briefcase,
  Bed,
  Moon,
  Sun,
  Sparkle,
  Users,
  PawPrint,
  Prohibit
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface RoommateProfileCardProps {
  profile: RoommateProfile
  onLike?: (profileId: string) => void
  onPass?: (profileId: string) => void
  onMessage?: (profileId: string) => void
  onViewDetails?: (profile: RoommateProfile) => void
  showActions?: boolean
  compact?: boolean
}

export function RoommateProfileCard({
  profile,
  onLike,
  onPass,
  onMessage,
  onViewDetails,
  showActions = true,
  compact = false
}: RoommateProfileCardProps) {
  const verifiedCount = profile.verification ? Object.values(profile.verification).filter(Boolean).length : 0

  const getSleepScheduleIcon = () => {
    if (profile.preferences.sleepSchedule === 'early-bird') return <Sun className="w-4 h-4" />
    if (profile.preferences.sleepSchedule === 'night-owl') return <Moon className="w-4 h-4" />
    return <Sparkle className="w-4 h-4" />
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (compact) {
    return (
      <Card 
        className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => onViewDetails?.(profile)}
      >
        <div className="flex gap-4">
          <Avatar className="w-16 h-16 flex-shrink-0">
            <AvatarImage src={profile.userAvatar} alt={profile.userName} />
            <AvatarFallback>{getInitials(profile.userName)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{profile.userName}</h3>
              {verifiedCount > 0 && (
                <ShieldCheck className="w-4 h-4 text-primary" weight="fill" />
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
              {profile.age && <span>{profile.age} years old</span>}
              {profile.occupation && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {profile.occupation}
                </span>
              )}
            </div>
            
            <p className="text-sm text-foreground line-clamp-2 mb-2">{profile.bio}</p>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{profile.location}</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.userAvatar} alt={profile.userName} />
                <AvatarFallback className="text-xl">{getInitials(profile.userName)}</AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-bold">{profile.userName}</h3>
                  {verifiedCount > 0 && (
                    <Badge variant="secondary" className="gap-1">
                      <ShieldCheck className="w-3 h-3" weight="fill" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {profile.age && (
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {profile.age} years old
                    </span>
                  )}
                  {profile.gender && profile.gender !== 'prefer-not-to-say' && (
                    <span className="capitalize">{profile.gender}</span>
                  )}
                  {profile.occupation && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {profile.occupation}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="text-foreground mb-4 leading-relaxed">{profile.bio}</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{profile.location}</span>
            </div>
            
            {profile.moveInDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {new Date(profile.moveInDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <CurrencyDollar className="w-4 h-4 text-muted-foreground" />
              <span>${profile.budgetMin} - ${profile.budgetMax}/mo</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Bed className="w-4 h-4 text-muted-foreground" />
              <span>{profile.preferences.bedrooms.join(', ')} bedroom{profile.preferences.bedrooms.length > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <h4 className="text-sm font-semibold mb-2">Lifestyle</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1">
                  {getSleepScheduleIcon()}
                  {profile.preferences.sleepSchedule.replace('-', ' ')}
                </Badge>
                {profile.preferences.pets && (
                  <Badge variant="outline" className="gap-1">
                    <PawPrint className="w-3 h-3" />
                    Pet friendly
                  </Badge>
                )}
                {!profile.preferences.smoking && (
                  <Badge variant="outline" className="gap-1">
                    <Prohibit className="w-3 h-3" />
                    Non-smoker
                  </Badge>
                )}
                {profile.preferences.workFromHome && (
                  <Badge variant="outline">Works from home</Badge>
                )}
              </div>
            </div>

            {profile.lifestyle.interests.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.lifestyle.interests.slice(0, 6).map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                  {profile.lifestyle.interests.length > 6 && (
                    <Badge variant="secondary">+{profile.lifestyle.interests.length - 6} more</Badge>
                  )}
                </div>
              </div>
            )}

            {profile.lifestyle.languages.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.lifestyle.languages.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold mb-2">Looking for</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>
                  {profile.lookingFor.roommateCount || 1} roommate{(profile.lookingFor.roommateCount || 1) > 1 ? 's' : ''}
                  {profile.lookingFor.ageRangeMin && profile.lookingFor.ageRangeMax && (
                    <>, ages {profile.lookingFor.ageRangeMin}-{profile.lookingFor.ageRangeMax}</>
                  )}
                </span>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="flex gap-2 pt-4 border-t">
              {onPass && (
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => onPass(profile.id)}
                >
                  <X className="w-5 h-5" />
                  Pass
                </Button>
              )}
              {onMessage && (
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => onMessage(profile.id)}
                >
                  <ChatCircle className="w-5 h-5" />
                  Message
                </Button>
              )}
              {onLike && (
                <Button
                  size="lg"
                  className="flex-1 gap-2"
                  onClick={() => onLike(profile.id)}
                >
                  <Heart className="w-5 h-5" weight="fill" />
                  Like
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
