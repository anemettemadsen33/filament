import { Property, User, FilterState } from './types'

export interface RecommendationScore {
  propertyId: string
  score: number
  reasons: string[]
  category: 'perfect-match' | 'great-fit' | 'you-might-like' | 'trending' | 'new-listing'
}

export interface UserBehavior {
  viewedProperties: string[]
  favoriteProperties: string[]
  searchHistory: FilterState[]
  bookingHistory: string[]
  reviewedProperties: string[]
  clickedCategories: string[]
  timeOnProperty: Record<string, number>
}

export interface RecommendationEngine {
  getUserBehavior: (userId: string) => Promise<UserBehavior>
  calculateRecommendations: (
    properties: Property[],
    user: User | null,
    behavior: UserBehavior,
    recentlyViewed: string[],
    favorites: string[]
  ) => RecommendationScore[]
  generateAIRecommendation: (
    property: Property,
    user: User | null,
    behavior: UserBehavior
  ) => Promise<string>
}

export function calculatePropertySimilarity(prop1: Property, prop2: Property): number {
  let score = 0
  
  if (prop1.type === prop2.type) score += 30
  
  if (prop1.rentalTerm === prop2.rentalTerm) score += 20
  
  if (prop1.bedrooms === prop2.bedrooms) {
    score += 15
  } else if (Math.abs(prop1.bedrooms - prop2.bedrooms) <= 1) {
    score += 8
  }
  
  const priceDiff = Math.abs(prop1.price - prop2.price)
  const avgPrice = (prop1.price + prop2.price) / 2
  const priceSimPct = 1 - Math.min(priceDiff / avgPrice, 1)
  score += priceSimPct * 15
  
  const areaDiff = Math.abs(prop1.area - prop2.area)
  const avgArea = (prop1.area + prop2.area) / 2
  const areaSimPct = 1 - Math.min(areaDiff / avgArea, 1)
  score += areaSimPct * 10
  
  const prop1Amenities = new Set(prop1.amenities)
  const prop2Amenities = new Set(prop2.amenities)
  const commonAmenities = [...prop1Amenities].filter(a => prop2Amenities.has(a))
  const amenitySimilarity = commonAmenities.length / Math.max(prop1Amenities.size, prop2Amenities.size)
  score += amenitySimilarity * 10
  
  return Math.min(score, 100)
}

export function calculateRecommendationScore(
  property: Property,
  user: User | null,
  behavior: UserBehavior,
  recentlyViewed: string[],
  favorites: string[],
  allProperties: Property[]
): RecommendationScore {
  let score = 0
  const reasons: string[] = []
  let category: RecommendationScore['category'] = 'you-might-like'
  
  if (!property.available) {
    return {
      propertyId: property.id,
      score: 0,
      reasons: ['Property not available'],
      category: 'you-might-like'
    }
  }
  
  if (recentlyViewed.includes(property.id) || favorites.includes(property.id)) {
    return {
      propertyId: property.id,
      score: 0,
      reasons: ['Already viewed or favorited'],
      category: 'you-might-like'
    }
  }
  
  const daysSinceListed = (Date.now() - property.createdAt) / (1000 * 60 * 60 * 24)
  if (daysSinceListed <= 3) {
    score += 15
    reasons.push('New listing')
    category = 'new-listing'
  }
  
  if (user?.preferences) {
    const prefs = user.preferences
    
    if (prefs.propertyType && prefs.propertyType !== 'all' && property.type === prefs.propertyType) {
      score += 25
      reasons.push(`Matches your preferred property type: ${property.type}`)
    }
    
    if (prefs.rentalTerm && prefs.rentalTerm !== 'all' && property.rentalTerm === prefs.rentalTerm) {
      score += 20
      reasons.push(`Matches your preferred rental term: ${property.rentalTerm}`)
    }
    
    if (prefs.bedrooms && prefs.bedrooms !== 'all') {
      const prefBedrooms = parseInt(prefs.bedrooms)
      if (property.bedrooms === prefBedrooms) {
        score += 20
        reasons.push(`Has ${property.bedrooms} bedroom${property.bedrooms !== 1 ? 's' : ''}`)
      }
    }
    
    if (prefs.priceRange) {
      const { min, max } = prefs.priceRange
      if (property.price >= min && property.price <= max) {
        score += 15
        reasons.push('Within your budget')
      }
    }
  }
  
  const viewedProperties = recentlyViewed
    .map(id => allProperties.find(p => p.id === id))
    .filter((p): p is Property => p !== undefined)
  
  if (viewedProperties.length > 0) {
    const similarities = viewedProperties.map(viewed => 
      calculatePropertySimilarity(property, viewed)
    )
    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length
    
    if (avgSimilarity >= 70) {
      score += avgSimilarity * 0.3
      reasons.push('Very similar to properties you viewed')
      category = 'perfect-match'
    } else if (avgSimilarity >= 50) {
      score += avgSimilarity * 0.2
      reasons.push('Similar to your recent searches')
      category = 'great-fit'
    }
  }
  
  const favoriteProperties = favorites
    .map(id => allProperties.find(p => p.id === id))
    .filter((p): p is Property => p !== undefined)
  
  if (favoriteProperties.length > 0) {
    const similarities = favoriteProperties.map(fav =>
      calculatePropertySimilarity(property, fav)
    )
    const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length
    
    if (avgSimilarity >= 60) {
      score += avgSimilarity * 0.4
      reasons.push('Similar to your favorite properties')
      category = 'perfect-match'
    }
  }
  
  if (property.landlord?.stats.averageRating && property.landlord.stats.averageRating >= 4.5) {
    score += 10
    reasons.push(`Highly rated landlord (${property.landlord.stats.averageRating}★)`)
  }
  
  if (property.landlord?.verification.verified) {
    score += 8
    reasons.push('Verified landlord')
  }
  
  if (property.virtualTours && property.virtualTours.length > 0) {
    score += 5
    reasons.push('Virtual tour available')
  }
  
  const pricePerSqft = property.price / property.area
  const avgPricePerSqft = allProperties
    .filter(p => p.type === property.type && p.available)
    .reduce((sum, p) => sum + p.price / p.area, 0) / allProperties.length
  
  if (pricePerSqft < avgPricePerSqft * 0.9) {
    score += 12
    reasons.push('Great value for area')
  }
  
  if (behavior.clickedCategories.includes(property.type)) {
    score += 10
    reasons.push(`You often view ${property.type} properties`)
  }
  
  if (score >= 80) {
    category = 'perfect-match'
  } else if (score >= 60) {
    category = 'great-fit'
  }
  
  return {
    propertyId: property.id,
    score: Math.min(score, 100),
    reasons,
    category
  }
}

export function calculateRecommendations(
  properties: Property[],
  user: User | null,
  behavior: UserBehavior,
  recentlyViewed: string[],
  favorites: string[]
): RecommendationScore[] {
  const scores = properties.map(property =>
    calculateRecommendationScore(property, user, behavior, recentlyViewed, favorites, properties)
  )
  
  return scores
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
}

export async function generateAIRecommendation(
  property: Property,
  user: User | null,
  reasons: string[]
): Promise<string> {
  const userContext = user?.preferences 
    ? `User preferences: ${user.preferences.propertyType || 'any'} property, ${user.preferences.rentalTerm || 'any'} term, budget: $${user.preferences.priceRange?.min || 0}-$${user.preferences.priceRange?.max || 10000}`
    : 'No specific user preferences set'
  
  const matchReasons = reasons.join(', ')
  
  const promptText = `You are a helpful real estate assistant for RentHub. Generate a brief, personalized recommendation (2-3 sentences max) for why this property might be perfect for the user.

Property: ${property.title}
Type: ${property.type}
Price: $${property.price}/month
Bedrooms: ${property.bedrooms}
Location: ${property.location}
Key features: ${property.amenities.slice(0, 4).join(', ')}

${userContext}

Match reasons: ${matchReasons}

Write a compelling, friendly recommendation that highlights why this property is a great match. Be specific and enthusiastic but concise.`

  try {
    const recommendation = await window.spark.llm(promptText, 'gpt-4o-mini')
    return recommendation
  } catch (error) {
    return `This ${property.type} in ${property.location} matches your preferences and offers great value at $${property.price.toLocaleString()}/month.`
  }
}

export function groupRecommendationsByCategory(
  recommendations: RecommendationScore[]
): Record<string, RecommendationScore[]> {
  const groups: Record<string, RecommendationScore[]> = {
    'perfect-match': [],
    'great-fit': [],
    'you-might-like': [],
    'trending': [],
    'new-listing': []
  }
  
  recommendations.forEach(rec => {
    groups[rec.category].push(rec)
  })
  
  return groups
}
