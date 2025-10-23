import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Property, User } from '@/lib/types'
import { 
  calculateRecommendations, 
  groupRecommendationsByCategory, 
  generateAIRecommendation,
  RecommendationScore,
  UserBehavior 
} from '@/lib/recommendations'
import { PropertyCard } from './PropertyCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Sparkle, TrendUp, Clock, Heart, Lightbulb } from '@phosphor-icons/react'
import { Skeleton } from './ui/skeleton'
import { ScrollArea } from './ui/scroll-area'

interface SmartRecommendationsPanelProps {
  properties: Property[]
  user: User | null
  favorites: string[]
  recentlyViewed: string[]
  compareList: string[]
  onToggleFavorite: (propertyId: string) => void
  onToggleCompare: (propertyId: string) => void
  onPropertyClick: (property: Property) => void
  className?: string
}

export function SmartRecommendationsPanel({
  properties,
  user,
  favorites,
  recentlyViewed,
  compareList,
  onToggleFavorite,
  onToggleCompare,
  onPropertyClick,
  className
}: SmartRecommendationsPanelProps) {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([])
  const [aiRecommendations, setAiRecommendations] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [loadingAI, setLoadingAI] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const calculateRecs = () => {
      setLoading(true)
      
      const behavior: UserBehavior = {
        viewedProperties: recentlyViewed,
        favoriteProperties: favorites,
        searchHistory: [],
        bookingHistory: [],
        reviewedProperties: [],
        clickedCategories: properties
          .filter(p => recentlyViewed.includes(p.id))
          .map(p => p.type),
        timeOnProperty: {}
      }

      const recs = calculateRecommendations(
        properties,
        user,
        behavior,
        recentlyViewed,
        favorites
      )

      setRecommendations(recs.slice(0, 20))
      setLoading(false)
    }

    calculateRecs()
  }, [properties, user, favorites, recentlyViewed])

  const loadAIRecommendations = async (propertyIds: string[]) => {
    setLoadingAI(true)
    const newRecommendations: Record<string, string> = {}

    for (const id of propertyIds.slice(0, 5)) {
      const property = properties.find(p => p.id === id)
      const recScore = recommendations.find(r => r.propertyId === id)
      
      if (property && recScore && !aiRecommendations[id]) {
        try {
          const aiRec = await generateAIRecommendation(property, user, recScore.reasons)
          newRecommendations[id] = aiRec
        } catch (error) {
          console.error('Error generating AI recommendation:', error)
        }
      }
    }

    setAiRecommendations(prev => ({ ...prev, ...newRecommendations }))
    setLoadingAI(false)
  }

  useEffect(() => {
    if (recommendations.length > 0 && user) {
      const topPropertyIds = recommendations.slice(0, 5).map(r => r.propertyId)
      loadAIRecommendations(topPropertyIds)
    }
  }, [recommendations, user])

  const groupedRecommendations = groupRecommendationsByCategory(recommendations)
  
  const categoryIcons: Record<string, any> = {
    'perfect-match': Sparkle,
    'great-fit': Heart,
    'you-might-like': Lightbulb,
    'trending': TrendUp,
    'new-listing': Clock
  }

  const categoryLabels: Record<string, string> = {
    'perfect-match': 'Perfect Matches',
    'great-fit': 'Great Fits',
    'you-might-like': 'You Might Like',
    'trending': 'Trending',
    'new-listing': 'New Listings'
  }

  const categoryDescriptions: Record<string, string> = {
    'perfect-match': 'Properties that match your preferences perfectly',
    'great-fit': 'Properties similar to what you\'ve been viewing',
    'you-might-like': 'Discover something new',
    'trending': 'Popular properties in your area',
    'new-listing': 'Fresh properties just listed'
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'perfect-match': 'bg-accent text-accent-foreground',
      'great-fit': 'bg-primary text-primary-foreground',
      'you-might-like': 'bg-secondary text-secondary-foreground',
      'trending': 'bg-destructive/10 text-destructive',
      'new-listing': 'bg-muted text-muted-foreground'
    }
    return colors[category] || 'bg-muted text-muted-foreground'
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle className="text-accent" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>Finding properties you'll love...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle className="text-accent" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>Start browsing to get personalized recommendations</CardDescription>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Lightbulb className="mx-auto mb-4" size={48} />
          <p>View some properties and add favorites to see personalized recommendations</p>
        </CardContent>
      </Card>
    )
  }

  const categoriesWithProperties = Object.entries(groupedRecommendations)
    .filter(([_, recs]) => recs.length > 0)
    .sort(([catA], [catB]) => {
      const order = ['perfect-match', 'great-fit', 'new-listing', 'trending', 'you-might-like']
      return order.indexOf(catA) - order.indexOf(catB)
    })

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkle className="text-accent" />
              Smart Recommendations
            </CardTitle>
            <CardDescription>
              {recommendations.length} properties curated for you
            </CardDescription>
          </div>
          {user && (
            <Badge variant="outline" className="gap-1">
              <Sparkle size={14} />
              AI-Powered
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-6">
            <TabsTrigger value="all" className="gap-1">
              All
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                {recommendations.length}
              </Badge>
            </TabsTrigger>
            {categoriesWithProperties.slice(0, 4).map(([category, recs]) => {
              const Icon = categoryIcons[category]
              return (
                <TabsTrigger key={category} value={category} className="gap-1">
                  {Icon && <Icon size={14} />}
                  <span className="hidden sm:inline">
                    {categoryLabels[category].split(' ')[0]}
                  </span>
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                    {recs.length}
                  </Badge>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value="all" className="space-y-8 mt-0">
            {categoriesWithProperties.map(([category, recs]) => {
              const Icon = categoryIcons[category]
              return (
                <div key={category} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="text-muted-foreground" size={20} />}
                      <h3 className="font-semibold text-lg">{categoryLabels[category]}</h3>
                      <Badge variant="outline">{recs.length}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground -mt-2">
                    {categoryDescriptions[category]}
                  </p>
                  <ScrollArea className="w-full">
                    <div className="flex gap-4 pb-4">
                      {recs.slice(0, 6).map((rec) => {
                        const property = properties.find(p => p.id === rec.propertyId)
                        if (!property) return null

                        return (
                          <div key={property.id} className="flex-shrink-0 w-[320px] space-y-3">
                            <PropertyCard
                              property={property}
                              isFavorite={favorites.includes(property.id)}
                              isInCompare={compareList.includes(property.id)}
                              onToggleFavorite={onToggleFavorite}
                              onToggleCompare={onToggleCompare}
                              onClick={() => {
                                onPropertyClick(property)
                                navigate(`/property/${property.id}`)
                              }}
                            />
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getCategoryColor(rec.category)}>
                                  {rec.score}% match
                                </Badge>
                              </div>
                              {rec.reasons.length > 0 && (
                                <div className="space-y-1">
                                  {rec.reasons.slice(0, 3).map((reason, idx) => (
                                    <p key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                      <span className="text-accent mt-0.5">•</span>
                                      {reason}
                                    </p>
                                  ))}
                                </div>
                              )}
                              {user && aiRecommendations[property.id] && (
                                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <Sparkle className="text-accent flex-shrink-0 mt-0.5" size={16} />
                                    <p className="text-xs text-foreground leading-relaxed">
                                      {aiRecommendations[property.id]}
                                    </p>
                                  </div>
                                </div>
                              )}
                              {user && !aiRecommendations[property.id] && loadingAI && (
                                <Skeleton className="h-20 w-full" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )
            })}
          </TabsContent>

          {categoriesWithProperties.map(([category, recs]) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-0">
              <div className="mb-6">
                <p className="text-muted-foreground">{categoryDescriptions[category]}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recs.map((rec) => {
                  const property = properties.find(p => p.id === rec.propertyId)
                  if (!property) return null

                  return (
                    <div key={property.id} className="space-y-3">
                      <PropertyCard
                        property={property}
                        isFavorite={favorites.includes(property.id)}
                        isInCompare={compareList.includes(property.id)}
                        onToggleFavorite={onToggleFavorite}
                        onToggleCompare={onToggleCompare}
                        onClick={() => {
                          onPropertyClick(property)
                          navigate(`/property/${property.id}`)
                        }}
                      />
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(rec.category)}>
                            {rec.score}% match
                          </Badge>
                        </div>
                        {rec.reasons.length > 0 && (
                          <div className="space-y-1">
                            {rec.reasons.slice(0, 3).map((reason, idx) => (
                              <p key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                <span className="text-accent mt-0.5">•</span>
                                {reason}
                              </p>
                            ))}
                          </div>
                        )}
                        {user && aiRecommendations[property.id] && (
                          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <Sparkle className="text-accent flex-shrink-0 mt-0.5" size={16} />
                              <p className="text-xs text-foreground leading-relaxed">
                                {aiRecommendations[property.id]}
                              </p>
                            </div>
                          </div>
                        )}
                        {user && !aiRecommendations[property.id] && loadingAI && (
                          <Skeleton className="h-20 w-full" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
