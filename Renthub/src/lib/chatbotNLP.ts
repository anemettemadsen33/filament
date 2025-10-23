import { Property } from './types'

export interface Intent {
  type: 'search' | 'question' | 'comparison' | 'booking' | 'recommendation' | 'information' | 'greeting' | 'complaint' | 'unknown'
  confidence: number
}

export interface Entity {
  type: 'location' | 'price' | 'propertyType' | 'bedrooms' | 'amenity' | 'rentalTerm' | 'date' | 'area'
  value: string | number
  raw: string
}

export interface Sentiment {
  score: number
  label: 'positive' | 'negative' | 'neutral'
}

export interface ConversationContext {
  lastIntent?: Intent
  mentionedProperties: string[]
  userPreferences: {
    location?: string
    minPrice?: number
    maxPrice?: number
    propertyType?: string
    bedrooms?: number
    amenities?: string[]
    rentalTerm?: 'short-term' | 'long-term'
  }
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: number
  }>
}

export interface NLPAnalysis {
  intent: Intent
  entities: Entity[]
  sentiment: Sentiment
  context: ConversationContext
  suggestedProperties?: Property[]
  needsClarification: boolean
  clarificationQuestion?: string
}

// Local NLP analysis without external API
function analyzeMessageLocally(message: string, context: ConversationContext): {
  intent: Intent
  entities: Entity[]
  sentiment: Sentiment
  needsClarification: boolean
  clarificationQuestion?: string
} {
  const lowerMessage = message.toLowerCase()
  
  // Intent detection
  let intent: Intent = { type: 'unknown', confidence: 0.5 }
  
  const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'bună', 'salut']
  if (greetings.some(g => lowerMessage.includes(g))) {
    intent = { type: 'greeting', confidence: 0.9 }
  } else if (lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking for') || lowerMessage.includes('show me') || lowerMessage.includes('caut')) {
    intent = { type: 'search', confidence: 0.85 }
  } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best') || lowerMessage.includes('recoman')) {
    intent = { type: 'recommendation', confidence: 0.85 }
  } else if (lowerMessage.includes('compare') || lowerMessage.includes('difference') || lowerMessage.includes('vs')) {
    intent = { type: 'comparison', confidence: 0.8 }
  } else if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('rent') || lowerMessage.includes('lease')) {
    intent = { type: 'booking', confidence: 0.8 }
  } else if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('why') || lowerMessage.includes('when') || lowerMessage.includes('?')) {
    intent = { type: 'question', confidence: 0.75 }
  } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('complaint') || lowerMessage.includes('bad') || lowerMessage.includes('terrible')) {
    intent = { type: 'complaint', confidence: 0.8 }
  } else {
    intent = { type: 'information', confidence: 0.6 }
  }
  
  // Entity extraction
  const entities: Entity[] = []
  
  // Location extraction
  const locations = ['new york', 'san francisco', 'los angeles', 'chicago', 'boston', 'seattle', 'miami', 'austin', 'downtown', 'uptown', 'brooklyn', 'manhattan']
  for (const loc of locations) {
    if (lowerMessage.includes(loc)) {
      entities.push({
        type: 'location',
        value: loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        raw: loc
      })
    }
  }
  
  // Price extraction
  const priceMatches = message.match(/\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:dollars?|k|thousand)?/gi)
  if (priceMatches) {
    priceMatches.forEach(match => {
      let value = parseFloat(match.replace(/[,$k]/gi, ''))
      if (match.toLowerCase().includes('k') || match.toLowerCase().includes('thousand')) {
        value *= 1000
      }
      entities.push({
        type: 'price',
        value: value,
        raw: match
      })
    })
  }
  
  // Bedrooms extraction
  const bedroomMatches = message.match(/(\d+)\s*(?:bed(?:room)?s?|br)/i)
  if (bedroomMatches) {
    entities.push({
      type: 'bedrooms',
      value: parseInt(bedroomMatches[1]),
      raw: bedroomMatches[0]
    })
  }
  
  // Property type extraction
  const propertyTypes = ['apartment', 'house', 'condo', 'studio', 'loft', 'townhouse', 'villa']
  for (const type of propertyTypes) {
    if (lowerMessage.includes(type)) {
      entities.push({
        type: 'propertyType',
        value: type,
        raw: type
      })
    }
  }
  
  // Amenities extraction
  const amenities = ['parking', 'pool', 'gym', 'balcony', 'garden', 'pet-friendly', 'furnished', 'wifi', 'ac', 'air conditioning', 'dishwasher', 'washer', 'dryer']
  for (const amenity of amenities) {
    if (lowerMessage.includes(amenity)) {
      entities.push({
        type: 'amenity',
        value: amenity,
        raw: amenity
      })
    }
  }
  
  // Rental term extraction
  if (lowerMessage.includes('short term') || lowerMessage.includes('short-term') || lowerMessage.includes('vacation') || lowerMessage.includes('weekly') || lowerMessage.includes('monthly')) {
    entities.push({
      type: 'rentalTerm',
      value: 'short-term',
      raw: 'short-term'
    })
  } else if (lowerMessage.includes('long term') || lowerMessage.includes('long-term') || lowerMessage.includes('yearly') || lowerMessage.includes('annual')) {
    entities.push({
      type: 'rentalTerm',
      value: 'long-term',
      raw: 'long-term'
    })
  }
  
  // Sentiment analysis
  const positiveWords = ['great', 'good', 'excellent', 'perfect', 'love', 'amazing', 'wonderful', 'fantastic', 'best']
  const negativeWords = ['bad', 'terrible', 'awful', 'worst', 'hate', 'horrible', 'poor', 'disappointed']
  
  const positiveCount = positiveWords.filter(w => lowerMessage.includes(w)).length
  const negativeCount = negativeWords.filter(w => lowerMessage.includes(w)).length
  
  let sentimentScore = (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1)
  let sentimentLabel: 'positive' | 'negative' | 'neutral' = 'neutral'
  
  if (sentimentScore > 0.3) {
    sentimentLabel = 'positive'
  } else if (sentimentScore < -0.3) {
    sentimentLabel = 'negative'
  }
  
  const sentiment: Sentiment = {
    score: sentimentScore,
    label: sentimentLabel
  }
  
  // Determine if clarification is needed
  const needsClarification = intent.confidence < 0.7 && entities.length === 0
  const clarificationQuestion = needsClarification 
    ? "I'd be happy to help! Could you tell me more about what you're looking for? For example, location, budget, or property type?"
    : undefined
  
  return {
    intent,
    entities,
    sentiment,
    needsClarification,
    clarificationQuestion
  }
}

export async function analyzeUserMessage(
  message: string,
  context: ConversationContext,
  availableProperties: Property[]
): Promise<NLPAnalysis> {
  try {
    // Local NLP implementation without external API
    const analysis = analyzeMessageLocally(message, context)
    
    const updatedContext: ConversationContext = {
      ...context,
      lastIntent: analysis.intent,
      conversationHistory: [
        ...context.conversationHistory,
        { role: 'user', content: message, timestamp: Date.now() }
      ]
    }

    if (analysis.entities && analysis.entities.length > 0) {
      analysis.entities.forEach((entity: Entity) => {
        switch (entity.type) {
          case 'location':
            updatedContext.userPreferences.location = entity.value as string
            break
          case 'price':
            const priceValue = typeof entity.value === 'string' ? parseFloat(entity.value) : entity.value
            if (entity.raw.includes('under') || entity.raw.includes('less') || entity.raw.includes('max')) {
              updatedContext.userPreferences.maxPrice = priceValue
            } else if (entity.raw.includes('over') || entity.raw.includes('more') || entity.raw.includes('min')) {
              updatedContext.userPreferences.minPrice = priceValue
            }
            break
          case 'propertyType':
            updatedContext.userPreferences.propertyType = entity.value as string
            break
          case 'bedrooms':
            updatedContext.userPreferences.bedrooms = typeof entity.value === 'string' ? parseInt(entity.value) : entity.value
            break
          case 'amenity':
            if (!updatedContext.userPreferences.amenities) {
              updatedContext.userPreferences.amenities = []
            }
            if (!updatedContext.userPreferences.amenities.includes(entity.value as string)) {
              updatedContext.userPreferences.amenities.push(entity.value as string)
            }
            break
          case 'rentalTerm':
            updatedContext.userPreferences.rentalTerm = entity.value as 'short-term' | 'long-term'
            break
        }
      })
    }

    let suggestedProperties: Property[] = []
    if (analysis.intent.type === 'search' || analysis.intent.type === 'recommendation') {
      suggestedProperties = filterPropertiesByPreferences(
        availableProperties,
        updatedContext.userPreferences
      )
    }

    return {
      intent: analysis.intent,
      entities: analysis.entities || [],
      sentiment: analysis.sentiment,
      context: updatedContext,
      suggestedProperties: suggestedProperties.slice(0, 5),
      needsClarification: analysis.needsClarification || false,
      clarificationQuestion: analysis.clarificationQuestion
    }
  } catch (error) {
    console.error('NLP Analysis error:', error)
    
    return {
      intent: { type: 'unknown', confidence: 0.5 },
      entities: [],
      sentiment: { score: 0, label: 'neutral' },
      context: {
        ...context,
        conversationHistory: [
          ...context.conversationHistory,
          { role: 'user', content: message, timestamp: Date.now() }
        ]
      },
      needsClarification: false
    }
  }
}

function filterPropertiesByPreferences(
  properties: Property[],
  preferences: ConversationContext['userPreferences']
): Property[] {
  return properties.filter(property => {
    if (!property.available) return false
    
    if (preferences.location) {
      const locationLower = preferences.location.toLowerCase()
      if (!property.location.toLowerCase().includes(locationLower)) return false
    }
    
    if (preferences.minPrice !== undefined && property.price < preferences.minPrice) return false
    if (preferences.maxPrice !== undefined && property.price > preferences.maxPrice) return false
    
    if (preferences.propertyType && property.type !== preferences.propertyType) return false
    
    if (preferences.bedrooms !== undefined && property.bedrooms < preferences.bedrooms) return false
    
    if (preferences.rentalTerm && property.rentalTerm !== preferences.rentalTerm) return false
    
    if (preferences.amenities && preferences.amenities.length > 0) {
      const hasAllAmenities = preferences.amenities.every(amenity =>
        property.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
      )
      if (!hasAllAmenities) return false
    }
    
    return true
  })
}

export async function generateContextualResponse(
  analysis: NLPAnalysis,
  properties: Property[]
): Promise<string> {
  const { intent, entities, sentiment, context, suggestedProperties, needsClarification, clarificationQuestion } = analysis

  if (needsClarification && clarificationQuestion) {
    return clarificationQuestion
  }

  // Local response generation without external API
  let response = ''

  if (intent.type === 'greeting') {
    const greetings = [
      "Hello! I'm your AI rental assistant. I can help you find the perfect property. What are you looking for?",
      "Hi there! Looking for a place to rent? I can help you search based on location, price, bedrooms, and more. What interests you?",
      "Welcome! I'm here to help you find your ideal rental property. Tell me what you're looking for!",
      "Hey! Ready to find your next home? Let me know your preferences and I'll suggest some great options."
    ]
    response = greetings[Math.floor(Math.random() * greetings.length)]
  } 
  
  else if (intent.type === 'search' || intent.type === 'recommendation') {
    if (suggestedProperties && suggestedProperties.length > 0) {
      const prefs: string[] = []
      if (context.userPreferences.location) prefs.push(context.userPreferences.location)
      if (context.userPreferences.bedrooms) prefs.push(`${context.userPreferences.bedrooms}+ bedrooms`)
      if (context.userPreferences.maxPrice) prefs.push(`under $${context.userPreferences.maxPrice.toLocaleString()}`)
      
      response = `Great! I found ${suggestedProperties.length} propert${suggestedProperties.length === 1 ? 'y' : 'ies'} ${prefs.length > 0 ? `matching ${prefs.join(', ')}` : 'for you'}. `
      
      if (suggestedProperties.length === 1) {
        const p = suggestedProperties[0]
        response += `Check out ${p.title} in ${p.location} - ${p.bedrooms} bed, ${p.bathrooms} bath for $${p.price.toLocaleString()}/month. Would you like to know more?`
      } else {
        response += `I've shown them below. They range from $${Math.min(...suggestedProperties.map(p => p.price)).toLocaleString()} to $${Math.max(...suggestedProperties.map(p => p.price)).toLocaleString()}/month. Click any property to see full details!`
      }
    } else {
      const prefs = Object.keys(context.userPreferences).length
      if (prefs > 0) {
        response = "I couldn't find exact matches with those criteria. Would you like to adjust your budget, location, or number of bedrooms? I have many other great properties available!"
      } else {
        response = "I'd love to help you find properties! Could you tell me what you're looking for? Location, price range, or number of bedrooms would be a great start."
      }
    }
  }
  
  else if (intent.type === 'comparison') {
    if (suggestedProperties && suggestedProperties.length >= 2) {
      const p1 = suggestedProperties[0]
      const p2 = suggestedProperties[1]
      response = `Comparing these options: ${p1.title} ($${p1.price.toLocaleString()}, ${p1.bedrooms}br) is ${p1.price > p2.price ? 'pricier but might offer more amenities' : 'more affordable'} than ${p2.title} ($${p2.price.toLocaleString()}, ${p2.bedrooms}br). Both are great choices! Which features matter most to you?`
    } else {
      response = "I can help compare properties! Please specify which ones you'd like to compare, or let me suggest some options first."
    }
  }
  
  else if (intent.type === 'booking') {
    response = "Excellent! To book a property, click on it to view full details, then use the 'Book Now' button. You can select your check-in/out dates and complete the reservation. Need help finding the right property first?"
  }
  
  else if (intent.type === 'question') {
    response = "I'm here to answer your questions! Whether it's about specific properties, the booking process, amenities, or rental terms, feel free to ask. What would you like to know?"
  }
  
  else if (intent.type === 'complaint') {
    if (sentiment.label === 'negative') {
      response = "I'm sorry to hear you're experiencing an issue. I want to help make this right. Could you tell me more about what's wrong so I can assist you better?"
    } else {
      response = "I understand your concern. Let me help you find a solution. What specific issue are you facing with the property or booking?"
    }
  }
  
  else if (intent.type === 'information') {
    response = "I can provide information about our properties, rental process, pricing, amenities, and more. What would you like to know about?"
  }
  
  else {
    response = "I'm not quite sure what you're looking for. Could you tell me more? For example, are you searching for a property, have questions about booking, or need information about a specific listing?"
  }

  return response
}

export function createEmptyContext(): ConversationContext {
  return {
    mentionedProperties: [],
    userPreferences: {},
    conversationHistory: []
  }
}

export async function extractPropertyIntent(message: string): Promise<{
  wantsToSee: boolean
  propertyId?: string
}> {
  const lowerMessage = message.toLowerCase()
  
  const viewKeywords = ['show', 'see', 'view', 'details', 'tell me more', 'interested in', 'look at']
  const wantsToSee = viewKeywords.some(keyword => lowerMessage.includes(keyword))
  
  const propertyIdMatch = message.match(/property[- ]?(\d+)/i) || message.match(/id[:\s]*([a-z0-9-]+)/i)
  const propertyId = propertyIdMatch ? propertyIdMatch[1] : undefined
  
  return { wantsToSee, propertyId }
}
