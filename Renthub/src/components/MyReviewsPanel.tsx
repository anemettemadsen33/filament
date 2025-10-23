import { Review, Property } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Star, ChatCircle, Eye, Trash, ThumbsUp, CheckCircle, House, MapPin, ChatCenteredText, CurrencyDollar, SealCheck } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface MyReviewsPanelProps {
  reviews: Review[]
  properties: Property[]
  currentUserName: string
  onViewProperty: (property: Property) => void
  onDeleteReview: (reviewId: string) => void
}

export function MyReviewsPanel({ 
  reviews, 
  properties, 
  currentUserName,
  onViewProperty,
  onDeleteReview
}: MyReviewsPanelProps) {
  const userReviews = reviews.filter(r => r.userName === currentUserName)
  const sortedReviews = [...userReviews].sort((a, b) => b.createdAt - a.createdAt)

  const getProperty = (propertyId: string) => {
    return properties.find(p => p.id === propertyId)
  }

  const handleDeleteReview = (review: Review) => {
    const confirmed = window.confirm('Are you sure you want to delete this review?')
    if (confirmed) {
      onDeleteReview(review.id)
      toast.success('Review deleted successfully')
    }
  }

  if (userReviews.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mx-auto mb-6">
              <ChatCircle size={40} weight="bold" className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Reviews Yet</h3>
            <p className="text-muted-foreground max-w-sm">
              You haven't written any reviews yet. Share your experience with properties you've visited!
            </p>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <ChatCircle size={20} weight="bold" className="text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Reviews</h2>
          <p className="text-sm text-muted-foreground">{userReviews.length} {userReviews.length === 1 ? 'review' : 'reviews'} written</p>
        </div>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-4 pr-4">
          <AnimatePresence mode="popLayout">
            {sortedReviews.map((review, index) => {
              const property = getProperty(review.propertyId)

              return (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.05,
                    layout: { duration: 0.3 }
                  }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {property && (
                            <>
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg font-bold text-foreground">
                                  {property.title}
                                </CardTitle>
                                {review.verifiedBooking && (
                                  <Badge variant="secondary" className="text-xs gap-1">
                                    <CheckCircle size={12} weight="fill" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <CardDescription>
                                {property.location}
                              </CardDescription>
                            </>
                          )}
                        </div>
                        {property && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onViewProperty(property)}
                            className="h-9"
                          >
                            <Eye size={16} weight="bold" className="mr-2" />
                            View
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-primary/20">
                          <AvatarImage src={review.userAvatar} alt={review.userName} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {review.userName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(review.createdAt, 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            weight={star <= review.rating ? 'fill' : 'regular'}
                            className={star <= review.rating ? 'text-yellow-500' : 'text-muted-foreground'}
                          />
                        ))}
                        <span className="ml-2 text-sm font-semibold text-foreground">
                          {review.rating}.0
                        </span>
                      </div>

                      {review.ratings && (
                        <div className="grid grid-cols-5 gap-2 p-3 rounded-xl bg-secondary/30">
                          {[
                            { label: 'Clean', value: review.ratings.cleanliness, icon: House },
                            { label: 'Location', value: review.ratings.location, icon: MapPin },
                            { label: 'Comm.', value: review.ratings.communication, icon: ChatCenteredText },
                            { label: 'Value', value: review.ratings.value, icon: CurrencyDollar },
                            { label: 'Accuracy', value: review.ratings.accuracy, icon: SealCheck },
                          ].map(({ label, value, icon: Icon }) => (
                            <div key={label} className="text-center">
                              <Icon size={14} className="text-muted-foreground mx-auto mb-1" />
                              <div className="text-[10px] text-muted-foreground mb-0.5">{label}</div>
                              <div className="font-semibold text-xs">{value.toFixed(1)}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <Separator />

                      <p className="text-sm text-foreground leading-relaxed">
                        {review.comment}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {review.helpfulVotes && (
                          <div className="flex items-center gap-1">
                            <ThumbsUp size={14} />
                            <span>{review.helpfulVotes.up} helpful</span>
                          </div>
                        )}
                        {review.landlordResponse && (
                          <Badge variant="outline" className="gap-1">
                            <ChatCircle size={12} />
                            Owner responded
                          </Badge>
                        )}
                      </div>

                      {review.landlordResponse && (
                        <>
                          <Separator />
                          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                            <div className="flex items-center gap-2 mb-2">
                              <ChatCircle size={14} className="text-primary" />
                              <span className="text-xs font-semibold text-primary">Owner's Response</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {review.landlordResponse.message}
                            </p>
                          </div>
                        </>
                      )}

                      <Separator />

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteReview(review)}
                        className="w-full text-destructive hover:text-destructive"
                      >
                        <Trash size={16} weight="bold" className="mr-2" />
                        Delete Review
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}
