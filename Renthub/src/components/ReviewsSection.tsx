import { useState, useEffect } from 'react'
import { Review, User as UserType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  User, 
  PaperPlaneRight, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle,
  ChatCircle,
  House,
  MapPin,
  ChatCenteredText,
  CurrencyDollar,
  SealCheck,
  FunnelSimple,
  CaretDown
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

interface ReviewsSectionProps {
  reviews: Review[]
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
  onVoteReview?: (reviewId: string, voteType: 'up' | 'down') => void
  onRespondToReview?: (reviewId: string, response: string) => void
  propertyId: string
  currentUser?: UserType | null
  isOwner?: boolean
}

type SortOption = 'recent' | 'highest' | 'lowest' | 'helpful'
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1'

export function ReviewsSection({ 
  reviews, 
  onAddReview, 
  onVoteReview,
  onRespondToReview,
  propertyId,
  currentUser,
  isOwner = false
}: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [userName, setUserName] = useState('')
  const [comment, setComment] = useState('')
  const [categoryRatings, setCategoryRatings] = useState({
    cleanliness: 0,
    location: 0,
    communication: 0,
    value: 0,
    accuracy: 0
  })
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  useEffect(() => {
    if (currentUser && !userName) {
      setUserName(currentUser.login)
    }
  }, [currentUser])

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const categoryAverages = reviews.length > 0 ? {
    cleanliness: reviews.reduce((sum, r) => sum + (r.ratings?.cleanliness || r.rating), 0) / reviews.length,
    location: reviews.reduce((sum, r) => sum + (r.ratings?.location || r.rating), 0) / reviews.length,
    communication: reviews.reduce((sum, r) => sum + (r.ratings?.communication || r.rating), 0) / reviews.length,
    value: reviews.reduce((sum, r) => sum + (r.ratings?.value || r.rating), 0) / reviews.length,
    accuracy: reviews.reduce((sum, r) => sum + (r.ratings?.accuracy || r.rating), 0) / reviews.length,
  } : null

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 : 0
  }))

  const filteredReviews = reviews.filter(review => {
    if (filterBy === 'all') return true
    return review.rating === parseInt(filterBy)
  })

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return b.createdAt - a.createdAt
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      case 'helpful':
        const aVotes = a.helpfulVotes ? (a.helpfulVotes.up - a.helpfulVotes.down) : 0
        const bVotes = b.helpfulVotes ? (b.helpfulVotes.up - b.helpfulVotes.down) : 0
        return bVotes - aVotes
      default:
        return 0
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userName.trim() || !comment.trim() || rating === 0) {
      toast.error('Please fill in all fields and select a rating')
      return
    }

    if (Object.values(categoryRatings).some(r => r === 0)) {
      toast.error('Please rate all categories')
      return
    }

    onAddReview({
      propertyId,
      userName: userName.trim(),
      userAvatar: currentUser?.avatarUrl,
      rating,
      comment: comment.trim(),
      ratings: categoryRatings,
      verifiedBooking: !!currentUser,
      helpfulVotes: { up: 0, down: 0 },
      votedBy: [],
      userId: currentUser?.id
    })

    setUserName('')
    setComment('')
    setRating(0)
    setCategoryRatings({
      cleanliness: 0,
      location: 0,
      communication: 0,
      value: 0,
      accuracy: 0
    })
    setShowForm(false)
  }

  const handleVote = (reviewId: string, voteType: 'up' | 'down') => {
    if (!currentUser) {
      toast.error('Please sign in to vote')
      return
    }
    onVoteReview?.(reviewId, voteType)
  }

  const handleRespond = (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error('Please enter a response')
      return
    }
    onRespondToReview?.(reviewId, responseText.trim())
    setRespondingTo(null)
    setResponseText('')
  }

  const CategoryRating = ({ 
    label, 
    icon: Icon, 
    value, 
    onChange, 
    average 
  }: { 
    label: string
    icon: any
    value: number
    onChange: (val: number) => void
    average?: number
  }) => {
    const [hovered, setHovered] = useState(0)
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          {average !== undefined && (
            <span className="text-xs text-muted-foreground">{average.toFixed(1)}</span>
          )}
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Star
                size={20}
                weight={star <= (hovered || value) ? 'fill' : 'regular'}
                className={star <= (hovered || value) ? 'text-yellow-500' : 'text-muted-foreground'}
              />
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
            <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
            Reviews & Ratings
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={20}
                    weight={star <= Math.round(averageRating) ? 'fill' : 'regular'}
                    className={star <= Math.round(averageRating) ? 'text-yellow-500' : 'text-muted-foreground'}
                  />
                ))}
              </div>
              <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
        {!showForm && !isOwner && (
          <Button 
            variant="outline"
            onClick={() => setShowForm(true)}
            className="border-primary/30 hover:border-primary/50 hover:bg-primary/5"
          >
            <Star size={18} weight="bold" className="mr-2" />
            Write Review
          </Button>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-2xl bg-secondary/20 border border-border/50">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Rating Breakdown</h4>
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium">{stars}</span>
                  <Star size={14} weight="fill" className="text-yellow-500" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-yellow-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
              </div>
            ))}
          </div>

          {categoryAverages && (
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Category Ratings</h4>
              <div className="space-y-3">
                <CategoryRating 
                  label="Cleanliness" 
                  icon={House} 
                  value={0}
                  onChange={() => {}}
                  average={categoryAverages.cleanliness}
                />
                <CategoryRating 
                  label="Location" 
                  icon={MapPin} 
                  value={0}
                  onChange={() => {}}
                  average={categoryAverages.location}
                />
                <CategoryRating 
                  label="Communication" 
                  icon={ChatCenteredText} 
                  value={0}
                  onChange={() => {}}
                  average={categoryAverages.communication}
                />
                <CategoryRating 
                  label="Value" 
                  icon={CurrencyDollar} 
                  value={0}
                  onChange={() => {}}
                  average={categoryAverages.value}
                />
                <CategoryRating 
                  label="Accuracy" 
                  icon={SealCheck} 
                  value={0}
                  onChange={() => {}}
                  average={categoryAverages.accuracy}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            className="p-6 rounded-2xl bg-secondary/30 border border-border/50 space-y-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="text-sm font-medium mb-3 block">Overall Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      size={32}
                      weight={star <= (hoveredRating || rating) ? 'fill' : 'regular'}
                      className={star <= (hoveredRating || rating) ? 'text-yellow-500' : 'text-muted-foreground'}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <label className="text-sm font-medium block">Category Ratings</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CategoryRating
                  label="Cleanliness"
                  icon={House}
                  value={categoryRatings.cleanliness}
                  onChange={(val) => setCategoryRatings(prev => ({ ...prev, cleanliness: val }))}
                />
                <CategoryRating
                  label="Location"
                  icon={MapPin}
                  value={categoryRatings.location}
                  onChange={(val) => setCategoryRatings(prev => ({ ...prev, location: val }))}
                />
                <CategoryRating
                  label="Communication"
                  icon={ChatCenteredText}
                  value={categoryRatings.communication}
                  onChange={(val) => setCategoryRatings(prev => ({ ...prev, communication: val }))}
                />
                <CategoryRating
                  label="Value"
                  icon={CurrencyDollar}
                  value={categoryRatings.value}
                  onChange={(val) => setCategoryRatings(prev => ({ ...prev, value: val }))}
                />
                <CategoryRating
                  label="Accuracy"
                  icon={SealCheck}
                  value={categoryRatings.accuracy}
                  onChange={(val) => setCategoryRatings(prev => ({ ...prev, accuracy: val }))}
                />
              </div>
            </div>

            <Separator />

            {!currentUser && (
              <div>
                <label className="text-sm font-medium mb-2 block">Your Name</label>
                <Input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="John Doe"
                  className="h-12"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Your Review</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this property..."
                className="min-h-32 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70"
              >
                <PaperPlaneRight size={18} weight="bold" className="mr-2" />
                Submit Review
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setUserName('')
                  setComment('')
                  setRating(0)
                  setCategoryRatings({
                    cleanliness: 0,
                    location: 0,
                    communication: 0,
                    value: 0,
                    accuracy: 0
                  })
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {reviews.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FunnelSimple size={20} className="text-muted-foreground" />
            <Select value={filterBy} onValueChange={(val) => setFilterBy(val as FilterOption)}>
              <SelectTrigger className="w-40" aria-label="Filter reviews">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
            <SelectTrigger className="w-40" aria-label="Sort reviews by">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {sortedReviews.length > 0 ? (
        <div className="space-y-4">
          {sortedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="p-6 rounded-2xl bg-card border border-border/30 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  {review.userAvatar ? (
                    <img src={review.userAvatar} alt={review.userName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={24} weight="bold" className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-lg">{review.userName}</h4>
                      {review.verifiedBooking && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <CheckCircle size={12} weight="fill" />
                          Verified Booking
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        weight={star <= review.rating ? 'fill' : 'regular'}
                        className={star <= review.rating ? 'text-yellow-500' : 'text-muted-foreground'}
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground leading-relaxed mb-4">{review.comment}</p>

                  {review.ratings && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 p-4 rounded-xl bg-secondary/30">
                      {[
                        { label: 'Cleanliness', value: review.ratings.cleanliness, icon: House },
                        { label: 'Location', value: review.ratings.location, icon: MapPin },
                        { label: 'Communication', value: review.ratings.communication, icon: ChatCenteredText },
                        { label: 'Value', value: review.ratings.value, icon: CurrencyDollar },
                        { label: 'Accuracy', value: review.ratings.accuracy, icon: SealCheck },
                      ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="text-center">
                          <Icon size={16} className="text-muted-foreground mx-auto mb-1" />
                          <div className="text-xs text-muted-foreground mb-1">{label}</div>
                          <div className="font-semibold text-sm">{value.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {review.helpfulVotes && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(review.id, 'up')}
                        className="gap-2"
                        disabled={!currentUser || review.votedBy?.includes(currentUser?.id || '')}
                      >
                        <ThumbsUp size={16} />
                        <span className="text-xs">{review.helpfulVotes.up}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVote(review.id, 'down')}
                        className="gap-2"
                        disabled={!currentUser || review.votedBy?.includes(currentUser?.id || '')}
                      >
                        <ThumbsDown size={16} />
                        <span className="text-xs">{review.helpfulVotes.down}</span>
                      </Button>
                    </div>
                  )}

                  <div className="mt-4">
                    {isOwner && !review.landlordResponse && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRespondingTo(review.id)}
                        className="gap-2 ml-auto"
                      >
                        <ChatCircle size={16} />
                        Respond
                      </Button>
                    )}
                  </div>

                  {respondingTo === review.id && (
                    <motion.div
                      className="mt-4 p-4 rounded-xl bg-secondary/30 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Textarea
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response..."
                        className="min-h-24"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRespond(review.id)}
                          className="bg-primary"
                        >
                          Post Response
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setRespondingTo(null)
                            setResponseText('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {review.landlordResponse && (
                    <motion.div
                      className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ChatCircle size={16} className="text-primary" />
                        <span className="text-sm font-semibold text-primary">Response from property owner</span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDistanceToNow(review.landlordResponse.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.landlordResponse.message}</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : !showForm && reviews.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-secondary/20 border border-dashed border-border">
          <Star size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No reviews yet. Be the first to review!</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-secondary/20 border border-dashed border-border">
          <FunnelSimple size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No reviews match your filter</p>
        </div>
      ) : null}
    </div>
  )
}
