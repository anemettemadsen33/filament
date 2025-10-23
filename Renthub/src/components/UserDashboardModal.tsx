import { useState } from 'react'
import { User, Property, Booking, Review, PropertyAnalytics } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MyBookingsPanel } from '@/components/MyBookingsPanel'
import { MyPropertiesPanel } from '@/components/MyPropertiesPanel'
import { MyReviewsPanel } from '@/components/MyReviewsPanel'
import { UserProfileModal } from '@/components/UserProfileModal'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  CalendarCheck, 
  Buildings, 
  ChatCircle, 
  Gear,
  SignOut,
  Heart,
  Eye,
  TrendUp
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface UserDashboardModalProps {
  open: boolean
  onClose: () => void
  user: User
  properties: Property[]
  bookings: Booking[]
  reviews: Review[]
  analytics: Record<string, PropertyAnalytics>
  favorites: string[]
  onViewProperty: (property: Property) => void
  onUpdatePreferences: (preferences: User['preferences']) => void
  onCancelBooking: (bookingId: string) => void
  onDeleteProperty: (propertyId: string) => void
  onTogglePropertyAvailability: (propertyId: string) => void
  onDeleteReview: (reviewId: string) => void
  onSignOut: () => void
}

export function UserDashboardModal({
  open,
  onClose,
  user,
  properties,
  bookings,
  reviews,
  analytics,
  favorites,
  onViewProperty,
  onUpdatePreferences,
  onCancelBooking,
  onDeleteProperty,
  onTogglePropertyAvailability,
  onDeleteReview,
  onSignOut
}: UserDashboardModalProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [showProfileModal, setShowProfileModal] = useState(false)

  const userBookings = bookings.filter(b => b.customerEmail === user.email || b.customerName === user.login)
  const userProperties = properties.filter(p => p.ownerEmail === user.email || p.id.includes(user.id))
  const userReviews = reviews.filter(r => r.userName === user.login)

  const totalViews = userProperties.reduce((sum, p) => sum + (analytics[p.id]?.views || 0), 0)
  const totalContactRequests = userProperties.reduce((sum, p) => sum + (analytics[p.id]?.contactRequests || 0), 0)
  const activeBookings = userBookings.filter(b => b.status !== 'cancelled').length

  const initials = user.login.slice(0, 2).toUpperCase()

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-card/95 backdrop-blur-xl border-border/50 p-0">
          <div className="flex flex-col h-full">
            <DialogHeader className="px-8 pt-8 pb-6 border-b border-border/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-4 border-primary/20 shadow-lg">
                    <AvatarImage src={user.avatarUrl} alt={user.login} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {user.login}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowProfileModal(true)}
                    variant="outline"
                    className="h-10"
                  >
                    <Gear size={18} weight="bold" className="mr-2" />
                    Settings
                  </Button>
                  <Button
                    onClick={onSignOut}
                    variant="outline"
                    className="h-10 text-destructive hover:text-destructive"
                  >
                    <SignOut size={18} weight="bold" className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="px-8 pt-6 border-b border-border/30">
                <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                  <TabsTrigger value="overview" className="gap-2">
                    <TrendUp size={18} weight="bold" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="bookings" className="gap-2">
                    <CalendarCheck size={18} weight="bold" />
                    Bookings
                    {userBookings.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {userBookings.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="properties" className="gap-2">
                    <Buildings size={18} weight="bold" />
                    Properties
                    {userProperties.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {userProperties.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="gap-2">
                    <ChatCircle size={18} weight="bold" />
                    Reviews
                    {userReviews.length > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {userReviews.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-auto px-8 py-6">
                <TabsContent value="overview" className="mt-0">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-xl font-bold text-foreground mb-4">Quick Stats</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                                <Buildings size={24} weight="bold" className="text-primary" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground mb-1">{userProperties.length}</p>
                            <p className="text-sm text-muted-foreground">Properties Listed</p>
                          </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <CalendarCheck size={24} weight="bold" className="text-green-500" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground mb-1">{activeBookings}</p>
                            <p className="text-sm text-muted-foreground">Active Bookings</p>
                          </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <Heart size={24} weight="bold" className="text-red-500" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground mb-1">{favorites.length}</p>
                            <p className="text-sm text-muted-foreground">Favorites</p>
                          </CardContent>
                        </Card>

                        <Card className="border-border/50 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                                <ChatCircle size={24} weight="bold" className="text-accent" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-foreground mb-1">{userReviews.length}</p>
                            <p className="text-sm text-muted-foreground">Reviews Written</p>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>

                    {userProperties.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <h3 className="text-xl font-bold text-foreground mb-4">Property Performance</h3>
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="text-center p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-3">
                                  <Eye size={24} weight="bold" className="text-primary" />
                                </div>
                                <p className="text-3xl font-bold text-foreground mb-1">{totalViews}</p>
                                <p className="text-sm text-muted-foreground">Total Views</p>
                              </div>
                              <div className="text-center p-4 rounded-xl bg-accent/5 border border-accent/10">
                                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-3">
                                  <TrendUp size={24} weight="bold" className="text-accent" />
                                </div>
                                <p className="text-3xl font-bold text-foreground mb-1">{totalContactRequests}</p>
                                <p className="text-sm text-muted-foreground">Contact Requests</p>
                              </div>
                              <div className="text-center p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                                  <CalendarCheck size={24} weight="bold" className="text-green-500" />
                                </div>
                                <p className="text-3xl font-bold text-foreground mb-1">
                                  {bookings.filter(b => userProperties.some(p => p.id === b.propertyId) && b.status !== 'cancelled').length}
                                </p>
                                <p className="text-sm text-muted-foreground">Property Bookings</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <h3 className="text-xl font-bold text-foreground mb-4">Account Information</h3>
                      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Username</p>
                              <p className="text-base font-semibold text-foreground">{user.login}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Email</p>
                              <p className="text-base font-semibold text-foreground">{user.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                              <p className="text-base font-semibold text-foreground">
                                {new Date(user.createdAt).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                              <p className="text-base font-semibold text-foreground">
                                {user.isOwner ? 'Property Owner' : 'Renter'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </TabsContent>

                <TabsContent value="bookings" className="mt-0">
                  <MyBookingsPanel
                    bookings={userBookings}
                    properties={properties}
                    onViewProperty={onViewProperty}
                    onCancelBooking={onCancelBooking}
                  />
                </TabsContent>

                <TabsContent value="properties" className="mt-0">
                  <MyPropertiesPanel
                    properties={properties}
                    analytics={analytics}
                    bookings={bookings}
                    currentUserId={user.email}
                    onViewProperty={onViewProperty}
                    onDeleteProperty={onDeleteProperty}
                    onToggleAvailability={onTogglePropertyAvailability}
                  />
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">
                  <MyReviewsPanel
                    reviews={reviews}
                    properties={properties}
                    currentUserName={user.login}
                    onViewProperty={onViewProperty}
                    onDeleteReview={onDeleteReview}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <UserProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdatePreferences={onUpdatePreferences}
      />
    </>
  )
}
