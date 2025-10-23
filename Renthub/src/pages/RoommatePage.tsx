import { useState, useEffect } from 'react'
import { RoommateProfile, RoommateMatch, User } from '@/lib/types'
import { RoommateProfileCard } from '@/components/RoommateProfileCard'
import { CreateRoommateProfileModal } from '@/components/CreateRoommateProfileModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Users, 
  Plus, 
  Heart, 
  Sparkle, 
  ChatCircle, 
  User as UserIcon,
  MagnifyingGlass,
  Sliders,
  Empty
} from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'sonner'

interface RoommatePageProps {
  currentUser: User | null
  profiles: RoommateProfile[]
  myProfile?: RoommateProfile
  matches: RoommateMatch[]
  onCreateProfile: (profile: Omit<RoommateProfile, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt' | 'lastActive'>) => void
  onUpdateProfile: (profile: Omit<RoommateProfile, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt' | 'lastActive'>) => void
  onLikeProfile: (profileId: string) => void
  onPassProfile: (profileId: string) => void
  onStartConversation: (matchId: string) => void
}

export function RoommatePage({
  currentUser,
  profiles,
  myProfile,
  matches,
  onCreateProfile,
  onUpdateProfile,
  onLikeProfile,
  onPassProfile,
  onStartConversation
}: RoommatePageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('discover')

  const availableProfiles = profiles.filter(p => 
    p.userId !== currentUser?.id && 
    p.active &&
    !matches.some(m => m.matchedProfileId === p.id)
  )

  const currentProfile = availableProfiles[currentProfileIndex]

  const likedProfiles = matches
    .filter(m => m.status === 'liked' && m.likedByUser)
    .map(m => profiles.find(p => p.id === m.matchedProfileId))
    .filter(Boolean) as RoommateProfile[]

  const mutualMatches = matches
    .filter(m => m.status === 'mutual')
    .map(m => ({
      match: m,
      profile: profiles.find(p => p.id === m.matchedProfileId)
    }))
    .filter(item => item.profile) as Array<{ match: RoommateMatch; profile: RoommateProfile }>

  const handleLike = () => {
    if (currentProfile) {
      onLikeProfile(currentProfile.id)
      toast.success('Profile liked!')
      setCurrentProfileIndex(prev => prev + 1)
    }
  }

  const handlePass = () => {
    if (currentProfile) {
      onPassProfile(currentProfile.id)
      setCurrentProfileIndex(prev => prev + 1)
    }
  }

  const handleMessage = (profileId: string) => {
    const match = matches.find(m => 
      m.matchedProfileId === profileId && m.status === 'mutual'
    )
    if (match) {
      onStartConversation(match.id)
    }
  }

  useEffect(() => {
    if (currentProfileIndex >= availableProfiles.length) {
      setCurrentProfileIndex(0)
    }
  }, [availableProfiles.length, currentProfileIndex])

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Sign in to find roommates</h2>
          <p className="text-muted-foreground">
            Create an account to start matching with compatible roommates
          </p>
        </Card>
      </div>
    )
  }

  if (!myProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <UserIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">Create Your Roommate Profile</h2>
          <p className="text-muted-foreground mb-6">
            Tell us about yourself and what you're looking for in a roommate
          </p>
          <Button size="lg" onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            Create Profile
          </Button>
        </Card>

        <CreateRoommateProfileModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={onCreateProfile}
          userName={currentUser.login}
          userAvatar={currentUser.avatarUrl}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Roommate Matching</h1>
            <p className="text-muted-foreground">
              Find your perfect roommate based on lifestyle compatibility
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowCreateModal(true)}>
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Sparkle className="w-6 h-6 text-primary" weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold">{availableProfiles.length}</p>
                <p className="text-sm text-muted-foreground">Available Profiles</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/10">
                <Heart className="w-6 h-6 text-accent" weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold">{likedProfiles.length}</p>
                <p className="text-sm text-muted-foreground">Profiles Liked</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/10">
                <Users className="w-6 h-6 text-green-600" weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mutualMatches.length}</p>
                <p className="text-sm text-muted-foreground">Mutual Matches</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="discover" className="gap-2">
            <Sparkle className="w-4 h-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="liked" className="gap-2">
            <Heart className="w-4 h-4" />
            Liked ({likedProfiles.length})
          </TabsTrigger>
          <TabsTrigger value="matches" className="gap-2">
            <Users className="w-4 h-4" />
            Matches ({mutualMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-0">
          {availableProfiles.length === 0 ? (
            <Card className="p-12 text-center">
              <Empty className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No more profiles</h3>
              <p className="text-muted-foreground">
                Check back later for new roommate profiles
              </p>
            </Card>
          ) : currentProfile ? (
            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProfile.id}
                  initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: -90 }}
                  transition={{ duration: 0.3 }}
                >
                  <RoommateProfileCard
                    profile={currentProfile}
                    onLike={handleLike}
                    onPass={handlePass}
                    showActions={true}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="text-center mt-4 text-sm text-muted-foreground">
                {currentProfileIndex + 1} of {availableProfiles.length} profiles
              </div>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="liked" className="mt-0">
          {likedProfiles.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No liked profiles yet</h3>
              <p className="text-muted-foreground">
                Profiles you like will appear here. Start discovering!
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {likedProfiles.map((profile) => (
                <RoommateProfileCard
                  key={profile.id}
                  profile={profile}
                  showActions={false}
                  compact={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches" className="mt-0">
          {mutualMatches.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No mutual matches yet</h3>
              <p className="text-muted-foreground">
                When someone you liked also likes you back, they'll appear here
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {mutualMatches.map(({ match, profile }) => (
                <Card key={match.id} className="p-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-1">
                      <RoommateProfileCard
                        profile={profile}
                        showActions={false}
                        compact={true}
                      />
                    </div>
                  </div>

                  {match.matchScore && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Compatibility</span>
                        <Badge variant="secondary">{Math.round(match.matchScore)}%</Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${match.matchScore}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full gap-2" 
                    onClick={() => handleMessage(profile.id)}
                  >
                    <ChatCircle className="w-4 h-4" />
                    Start Conversation
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateRoommateProfileModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={onUpdateProfile}
        existingProfile={myProfile}
        userName={currentUser.login}
        userAvatar={currentUser.avatarUrl}
      />
    </div>
  )
}
