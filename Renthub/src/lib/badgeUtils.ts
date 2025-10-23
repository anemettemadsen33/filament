import { LandlordBadge, LandlordStats, LandlordVerification } from './types'

export const BADGE_DEFINITIONS: Record<LandlordBadge['type'], { name: string; description: string }> = {
  verified: {
    name: 'Verified Landlord',
    description: 'Identity and ownership verified by RentHub'
  },
  superhost: {
    name: 'Superhost',
    description: 'Consistently high ratings and exceptional hospitality'
  },
  responsive: {
    name: 'Quick Responder',
    description: 'Responds to inquiries within 1 hour on average'
  },
  quality: {
    name: 'Quality Host',
    description: 'Maintains properties to the highest standards'
  },
  'eco-friendly': {
    name: 'Eco-Friendly',
    description: 'Properties feature sustainable and eco-conscious amenities'
  },
  'pet-friendly': {
    name: 'Pet Friendly',
    description: 'Welcomes guests with furry companions'
  },
  'family-friendly': {
    name: 'Family Friendly',
    description: 'Provides amenities and safety features for families with children'
  },
  accessibility: {
    name: 'Accessibility Champion',
    description: 'Properties designed for guests with mobility needs'
  },
  'longterm-expert': {
    name: 'Long-Term Expert',
    description: 'Specializes in extended stays and tenant relationships'
  },
  flexible: {
    name: 'Flexible Host',
    description: 'Offers flexible check-in/check-out and booking terms'
  }
}

export function calculateBadges(
  stats: LandlordStats,
  verification: LandlordVerification,
  propertyAmenities: string[][]
): LandlordBadge[] {
  const badges: LandlordBadge[] = []
  const now = Date.now()

  if (verification.verified && verification.identity && verification.email) {
    badges.push({
      id: 'verified',
      type: 'verified',
      name: BADGE_DEFINITIONS.verified.name,
      description: BADGE_DEFINITIONS.verified.description,
      earnedAt: verification.verifiedAt || now
    })
  }

  if (
    stats.averageRating >= 4.8 &&
    stats.reviewCount >= 10 &&
    stats.responseRate >= 95 &&
    stats.completionRate >= 98 &&
    stats.yearsOnPlatform >= 1
  ) {
    badges.push({
      id: 'superhost',
      type: 'superhost',
      name: BADGE_DEFINITIONS.superhost.name,
      description: BADGE_DEFINITIONS.superhost.description,
      earnedAt: now
    })
  }

  if (stats.responseTime <= 60 && stats.responseRate >= 90) {
    badges.push({
      id: 'responsive',
      type: 'responsive',
      name: BADGE_DEFINITIONS.responsive.name,
      description: BADGE_DEFINITIONS.responsive.description,
      earnedAt: now
    })
  }

  if (stats.averageRating >= 4.5 && stats.reviewCount >= 5) {
    badges.push({
      id: 'quality',
      type: 'quality',
      name: BADGE_DEFINITIONS.quality.name,
      description: BADGE_DEFINITIONS.quality.description,
      earnedAt: now
    })
  }

  const allAmenities = propertyAmenities.flat()
  
  if (allAmenities.some(a => a.toLowerCase().includes('solar') || a.toLowerCase().includes('eco') || a.toLowerCase().includes('energy efficient'))) {
    badges.push({
      id: 'eco-friendly',
      type: 'eco-friendly',
      name: BADGE_DEFINITIONS['eco-friendly'].name,
      description: BADGE_DEFINITIONS['eco-friendly'].description,
      earnedAt: now
    })
  }

  if (allAmenities.some(a => a.toLowerCase().includes('pet'))) {
    badges.push({
      id: 'pet-friendly',
      type: 'pet-friendly',
      name: BADGE_DEFINITIONS['pet-friendly'].name,
      description: BADGE_DEFINITIONS['pet-friendly'].description,
      earnedAt: now
    })
  }

  if (allAmenities.some(a => a.toLowerCase().includes('family') || a.toLowerCase().includes('playground') || a.toLowerCase().includes('crib'))) {
    badges.push({
      id: 'family-friendly',
      type: 'family-friendly',
      name: BADGE_DEFINITIONS['family-friendly'].name,
      description: BADGE_DEFINITIONS['family-friendly'].description,
      earnedAt: now
    })
  }

  if (allAmenities.some(a => a.toLowerCase().includes('wheelchair') || a.toLowerCase().includes('accessible'))) {
    badges.push({
      id: 'accessibility',
      type: 'accessibility',
      name: BADGE_DEFINITIONS.accessibility.name,
      description: BADGE_DEFINITIONS.accessibility.description,
      earnedAt: now
    })
  }

  if (stats.totalBookings >= 20 && stats.completionRate >= 95) {
    badges.push({
      id: 'longterm-expert',
      type: 'longterm-expert',
      name: BADGE_DEFINITIONS['longterm-expert'].name,
      description: BADGE_DEFINITIONS['longterm-expert'].description,
      earnedAt: now
    })
  }

  if (stats.responseRate >= 85 && stats.completionRate >= 90) {
    badges.push({
      id: 'flexible',
      type: 'flexible',
      name: BADGE_DEFINITIONS.flexible.name,
      description: BADGE_DEFINITIONS.flexible.description,
      earnedAt: now
    })
  }

  return badges
}

export function getVerificationProgress(verification: LandlordVerification): {
  percentage: number
  completed: number
  total: number
  missing: string[]
} {
  const checks = [
    { key: 'email', label: 'Email verification', value: verification.email },
    { key: 'phone', label: 'Phone verification', value: verification.phone },
    { key: 'identity', label: 'Identity verification', value: verification.identity },
    { key: 'proofOfOwnership', label: 'Proof of ownership', value: verification.proofOfOwnership },
    { key: 'backgroundCheck', label: 'Background check', value: verification.backgroundCheck }
  ]

  const completed = checks.filter(c => c.value).length
  const total = checks.length
  const missing = checks.filter(c => !c.value).map(c => c.label)

  return {
    percentage: Math.round((completed / total) * 100),
    completed,
    total,
    missing
  }
}

export function shouldShowSuperhost(stats: LandlordStats): boolean {
  return stats.averageRating >= 4.8 && 
         stats.reviewCount >= 10 && 
         stats.responseRate >= 95 &&
         stats.completionRate >= 98
}
