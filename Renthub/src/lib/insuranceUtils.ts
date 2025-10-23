import { InsurancePlan, InsuranceProvider, InsuranceQuote, InsuranceComparison, Property } from './types'

export const insuranceProviders: InsuranceProvider[] = [
  {
    id: 'provider-1',
    name: 'SafeHome Insurance',
    logo: '🏠',
    description: 'Leading provider of property and tenant insurance with 24/7 support',
    website: 'https://safehome.example.com',
    phone: '+1-800-555-0100',
    email: 'support@safehome.example.com',
    rating: 4.8,
    reviewCount: 15420,
    yearsInBusiness: 25,
    licensedIn: ['All 50 States', 'Canada'],
    specialties: ['Property Insurance', 'Landlord Protection', 'Tenant Coverage'],
    claimSatisfactionRate: 94,
    financialStrength: 'A+',
    accreditations: ['Better Business Bureau A+', 'AM Best Rating A+', 'ISO Certified']
  },
  {
    id: 'provider-2',
    name: 'Guardian Property Shield',
    logo: '🛡️',
    description: 'Comprehensive coverage for landlords and property managers',
    website: 'https://guardian.example.com',
    phone: '+1-800-555-0200',
    email: 'info@guardian.example.com',
    rating: 4.6,
    reviewCount: 8930,
    yearsInBusiness: 18,
    licensedIn: ['USA', 'Puerto Rico'],
    specialties: ['Landlord Insurance', 'Multi-Property Coverage', 'Rental Income Protection'],
    claimSatisfactionRate: 91,
    financialStrength: 'A',
    accreditations: ['BBB Accredited', 'NAIC Member', 'State Licensed']
  },
  {
    id: 'provider-3',
    name: 'RenterSecure',
    logo: '🔒',
    description: 'Affordable tenant insurance with flexible coverage options',
    website: 'https://rentersecure.example.com',
    phone: '+1-800-555-0300',
    email: 'hello@rentersecure.example.com',
    rating: 4.7,
    reviewCount: 12100,
    yearsInBusiness: 12,
    licensedIn: ['48 States'],
    specialties: ['Renters Insurance', 'Contents Coverage', 'Liability Protection'],
    claimSatisfactionRate: 89,
    financialStrength: 'A-',
    accreditations: ['BBB A Rating', 'Consumer Choice Award', 'TrustPilot 4.5/5']
  },
  {
    id: 'provider-4',
    name: 'TotalCover Insurance Group',
    logo: '🌟',
    description: 'Complete protection for residential properties and tenants',
    website: 'https://totalcover.example.com',
    phone: '+1-800-555-0400',
    email: 'claims@totalcover.example.com',
    rating: 4.9,
    reviewCount: 22500,
    yearsInBusiness: 35,
    licensedIn: ['All 50 States', 'International'],
    specialties: ['Comprehensive Coverage', 'Premium Properties', 'High-Value Items'],
    claimSatisfactionRate: 96,
    financialStrength: 'A++',
    accreditations: ['AM Best A++', 'Forbes Top Rated', 'Industry Leader Award']
  }
]

export const insurancePlans: InsurancePlan[] = [
  {
    id: 'plan-tenant-basic',
    providerId: 'provider-3',
    providerName: 'RenterSecure',
    providerLogo: '🔒',
    providerRating: 4.7,
    name: 'Basic Renter Protection',
    description: 'Essential coverage for tenants with personal property and liability protection',
    category: 'tenant',
    targetAudience: ['tenant'],
    coverage: {
      personalProperty: 20000,
      liability: 100000,
      medicalPayments: 1000,
      additionalLiving: 5000,
      theft: true,
      fire: true,
      water: true,
      vandalism: true
    },
    pricing: {
      basePrice: 15,
      billingCycle: 'monthly',
      currency: 'USD',
      discounts: [
        {
          name: 'Multi-Year Discount',
          description: 'Save 10% when you pay annually',
          percentage: 10,
          conditions: ['Annual payment']
        },
        {
          name: 'Security System',
          description: 'Discount for properties with security systems',
          percentage: 5,
          conditions: ['Verified security system']
        }
      ]
    },
    deductible: 500,
    deductibleOptions: [250, 500, 1000],
    features: [
      'Personal property coverage up to $20,000',
      'Liability protection up to $100,000',
      'Medical payments to others',
      'Additional living expenses',
      'Theft and fire protection',
      'Water damage coverage',
      '24/7 claims support',
      'Online claim filing'
    ],
    exclusions: [
      'Intentional damage',
      'Flood damage (separate policy required)',
      'Earthquake damage',
      'Pets damage to property',
      'Business property'
    ],
    requirements: {
      propertyTypes: ['apartment', 'studio', 'condo'],
      minTenantAge: 18,
      inspectionRequired: false
    },
    claimsProcess: {
      averageProcessingTime: 7,
      onlineClaimSubmission: true,
      phoneSupport247: true,
      claimApprovalRate: 89
    },
    popular: true,
    recommended: true,
    featured: false,
    rating: 4.6,
    reviewCount: 3420,
    tags: ['affordable', 'tenant', 'basic', 'popular'],
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000
  },
  {
    id: 'plan-tenant-premium',
    providerId: 'provider-3',
    providerName: 'RenterSecure',
    providerLogo: '🔒',
    providerRating: 4.7,
    name: 'Premium Renter Coverage',
    description: 'Comprehensive protection with higher coverage limits and additional benefits',
    category: 'tenant',
    targetAudience: ['tenant'],
    coverage: {
      personalProperty: 50000,
      liability: 300000,
      medicalPayments: 5000,
      additionalLiving: 15000,
      theft: true,
      fire: true,
      water: true,
      vandalism: true,
      naturalDisasters: true
    },
    pricing: {
      basePrice: 35,
      billingCycle: 'monthly',
      currency: 'USD',
      discounts: [
        {
          name: 'Annual Payment',
          description: 'Save 15% with annual payment',
          percentage: 15,
          conditions: ['Full year payment']
        },
        {
          name: 'Bundling Discount',
          description: 'Save when combined with auto insurance',
          percentage: 10,
          conditions: ['Active auto insurance policy']
        }
      ]
    },
    deductible: 250,
    deductibleOptions: [100, 250, 500, 1000],
    features: [
      'Personal property coverage up to $50,000',
      'Liability protection up to $300,000',
      'Enhanced medical payments',
      'Extended additional living expenses',
      'Natural disaster coverage',
      'Identity theft protection',
      'Valuable items rider included',
      'Worldwide coverage',
      'Replacement cost coverage',
      'No claims bonus'
    ],
    exclusions: [
      'Intentional damage',
      'War and terrorism',
      'Nuclear hazards'
    ],
    requirements: {
      propertyTypes: ['apartment', 'studio', 'condo', 'house'],
      minTenantAge: 18,
      inspectionRequired: false
    },
    claimsProcess: {
      averageProcessingTime: 5,
      onlineClaimSubmission: true,
      phoneSupport247: true,
      claimApprovalRate: 92
    },
    popular: true,
    recommended: true,
    featured: true,
    rating: 4.8,
    reviewCount: 2156,
    tags: ['premium', 'tenant', 'comprehensive', 'featured'],
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000
  },
  {
    id: 'plan-landlord-basic',
    providerId: 'provider-2',
    providerName: 'Guardian Property Shield',
    providerLogo: '🛡️',
    providerRating: 4.6,
    name: 'Landlord Essentials',
    description: 'Basic protection for rental property owners',
    category: 'landlord',
    targetAudience: ['landlord'],
    coverage: {
      propertyDamage: 250000,
      liability: 500000,
      lossOfRent: 12000,
      legalFees: 5000,
      fire: true,
      water: true,
      vandalism: true,
      theft: true
    },
    pricing: {
      basePrice: 125,
      billingCycle: 'monthly',
      currency: 'USD',
      discounts: [
        {
          name: 'Multi-Property',
          description: 'Save 15% on 3+ properties',
          percentage: 15,
          conditions: ['3 or more properties insured']
        },
        {
          name: 'Claims-Free',
          description: 'Discount for no claims in 3 years',
          percentage: 10,
          conditions: ['No claims in past 36 months']
        }
      ]
    },
    deductible: 1000,
    deductibleOptions: [500, 1000, 2500, 5000],
    features: [
      'Property damage coverage up to $250,000',
      'Liability protection up to $500,000',
      'Loss of rental income coverage',
      'Legal fee protection',
      'Tenant-caused damage coverage',
      'Building and structures protection',
      'Landlord liability coverage',
      'Fair rental value protection'
    ],
    exclusions: [
      'Normal wear and tear',
      'Flood (separate policy)',
      'Earthquake (separate policy)',
      'Intentional tenant damage beyond deposit',
      'Vacant property (over 60 days)'
    ],
    requirements: {
      propertyTypes: ['apartment', 'studio', 'condo', 'house'],
      minPropertyValue: 50000,
      maxPropertyValue: 500000,
      securityRequirements: ['Smoke detectors', 'Fire extinguisher'],
      inspectionRequired: true
    },
    claimsProcess: {
      averageProcessingTime: 10,
      onlineClaimSubmission: true,
      phoneSupport247: true,
      claimApprovalRate: 88
    },
    popular: true,
    recommended: true,
    featured: false,
    rating: 4.5,
    reviewCount: 1890,
    tags: ['landlord', 'basic', 'property-owner', 'rental-income'],
    createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 20 * 24 * 60 * 60 * 1000
  },
  {
    id: 'plan-landlord-premium',
    providerId: 'provider-1',
    providerName: 'SafeHome Insurance',
    providerLogo: '🏠',
    providerRating: 4.8,
    name: 'Premier Landlord Protection',
    description: 'Comprehensive coverage for serious property investors',
    category: 'landlord',
    targetAudience: ['landlord'],
    coverage: {
      propertyDamage: 1000000,
      liability: 2000000,
      lossOfRent: 50000,
      legalFees: 25000,
      medicalPayments: 10000,
      fire: true,
      water: true,
      vandalism: true,
      theft: true,
      naturalDisasters: true
    },
    pricing: {
      basePrice: 285,
      billingCycle: 'monthly',
      currency: 'USD',
      discounts: [
        {
          name: 'Portfolio Owner',
          description: 'Premium discount for 5+ properties',
          percentage: 20,
          conditions: ['5 or more properties']
        },
        {
          name: 'Property Management',
          description: 'Discount for professional management',
          percentage: 8,
          conditions: ['Professional property management company']
        },
        {
          name: 'Safety Features',
          description: 'Advanced security and safety systems',
          percentage: 12,
          conditions: ['Security system', 'Fire suppression', 'Water leak detection']
        }
      ]
    },
    deductible: 2500,
    deductibleOptions: [1000, 2500, 5000, 10000],
    features: [
      'Property damage coverage up to $1,000,000',
      'Liability protection up to $2,000,000',
      'Extended loss of rent coverage',
      'Comprehensive legal fee protection',
      'Natural disaster coverage',
      'Malicious tenant damage coverage',
      'Equipment breakdown coverage',
      'Ordinance and law coverage',
      'Emergency repairs covered',
      'Tenant screening assistance',
      'Legal consultation included',
      'Property management support'
    ],
    exclusions: [
      'War and terrorism',
      'Nuclear incidents',
      'Pollution (unless sudden)',
      'Intentional acts'
    ],
    requirements: {
      propertyTypes: ['apartment', 'studio', 'condo', 'house'],
      minPropertyValue: 100000,
      maxPropertyValue: 5000000,
      securityRequirements: ['Security system', 'Smoke detectors', 'Fire extinguisher', 'CO detector'],
      inspectionRequired: true
    },
    claimsProcess: {
      averageProcessingTime: 7,
      onlineClaimSubmission: true,
      phoneSupport247: true,
      claimApprovalRate: 94
    },
    popular: true,
    recommended: true,
    featured: true,
    rating: 4.9,
    reviewCount: 4230,
    tags: ['landlord', 'premium', 'comprehensive', 'investor', 'featured'],
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 10 * 24 * 60 * 60 * 1000
  },
  {
    id: 'plan-comprehensive-1',
    providerId: 'provider-4',
    providerName: 'TotalCover Insurance Group',
    providerLogo: '🌟',
    providerRating: 4.9,
    name: 'Complete Property & Tenant Package',
    description: 'All-in-one solution for landlords requiring tenant insurance',
    category: 'comprehensive',
    targetAudience: ['landlord', 'tenant', 'both'],
    coverage: {
      propertyDamage: 500000,
      liability: 1000000,
      personalProperty: 30000,
      lossOfRent: 30000,
      medicalPayments: 5000,
      legalFees: 15000,
      additionalLiving: 10000,
      fire: true,
      water: true,
      vandalism: true,
      theft: true,
      naturalDisasters: true
    },
    pricing: {
      basePrice: 180,
      billingCycle: 'monthly',
      currency: 'USD',
      discounts: [
        {
          name: 'Bundle Savings',
          description: 'Combined landlord and tenant coverage',
          percentage: 25,
          conditions: ['Both landlord and tenant coverage']
        }
      ]
    },
    deductible: 1000,
    deductibleOptions: [500, 1000, 2500],
    features: [
      'Combined landlord and tenant coverage',
      'Property damage protection',
      'Tenant personal property coverage',
      'Comprehensive liability protection',
      'Loss of rent coverage',
      'Legal fees included',
      'Natural disaster coverage',
      'Single policy management',
      'Coordinated claims process',
      'Premium savings through bundling'
    ],
    exclusions: [
      'Flood (available as add-on)',
      'Earthquake (available as add-on)',
      'Business activities'
    ],
    requirements: {
      propertyTypes: ['apartment', 'studio', 'condo', 'house'],
      minPropertyValue: 75000,
      inspectionRequired: true
    },
    claimsProcess: {
      averageProcessingTime: 6,
      onlineClaimSubmission: true,
      phoneSupport247: true,
      claimApprovalRate: 96
    },
    popular: true,
    recommended: true,
    featured: true,
    rating: 4.9,
    reviewCount: 5670,
    tags: ['comprehensive', 'bundle', 'landlord', 'tenant', 'premium', 'featured'],
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000
  },
  {
    id: 'plan-liability-only',
    providerId: 'provider-1',
    providerName: 'SafeHome Insurance',
    providerLogo: '🏠',
    providerRating: 4.8,
    name: 'Liability Shield',
    description: 'Focused liability protection for landlords and tenants',
    category: 'liability',
    targetAudience: ['landlord', 'tenant', 'both'],
    coverage: {
      liability: 1000000,
      medicalPayments: 10000,
      legalFees: 10000
    },
    pricing: {
      basePrice: 45,
      billingCycle: 'monthly',
      currency: 'USD'
    },
    deductible: 0,
    features: [
      'Up to $1M liability coverage',
      'Medical payments to others',
      'Legal defense costs',
      'Personal injury protection',
      'Property damage liability',
      'No deductible on liability claims'
    ],
    exclusions: [
      'Property damage',
      'Personal property',
      'Intentional acts'
    ],
    requirements: {
      propertyTypes: ['apartment', 'studio', 'condo', 'house'],
      inspectionRequired: false
    },
    claimsProcess: {
      averageProcessingTime: 5,
      onlineClaimSubmission: true,
      phoneSupport247: true,
      claimApprovalRate: 91
    },
    popular: false,
    recommended: false,
    featured: false,
    rating: 4.7,
    reviewCount: 890,
    tags: ['liability', 'basic', 'affordable'],
    createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 40 * 24 * 60 * 60 * 1000
  }
]

export function filterInsurancePlans(
  plans: InsurancePlan[],
  filters: {
    userType?: 'landlord' | 'tenant' | 'both'
    maxBudget?: number
    minCoverage?: number
    category?: InsurancePlan['category']
    providerId?: string
  }
): InsurancePlan[] {
  return plans.filter(plan => {
    if (filters.userType && !plan.targetAudience.includes(filters.userType)) {
      return false
    }
    if (filters.maxBudget && plan.pricing.basePrice > filters.maxBudget) {
      return false
    }
    if (filters.minCoverage) {
      const totalCoverage = 
        (plan.coverage.propertyDamage || 0) +
        (plan.coverage.liability || 0) +
        (plan.coverage.personalProperty || 0)
      if (totalCoverage < filters.minCoverage) {
        return false
      }
    }
    if (filters.category && plan.category !== filters.category) {
      return false
    }
    if (filters.providerId && plan.providerId !== filters.providerId) {
      return false
    }
    return true
  })
}

export function calculateInsuranceQuote(
  plan: InsurancePlan,
  property?: Property,
  customCoverage?: Partial<InsurancePlan['coverage']>,
  customDeductible?: number
): InsuranceQuote {
  let basePremium = plan.pricing.basePrice
  
  if (customDeductible && customDeductible !== plan.deductible) {
    if (customDeductible < plan.deductible) {
      basePremium *= 1.15
    } else if (customDeductible > plan.deductible) {
      basePremium *= 0.92
    }
  }
  
  const discountsApplied: InsuranceQuote['discountsApplied'] = []
  
  if (plan.pricing.discounts) {
    plan.pricing.discounts.forEach(discount => {
      if (discount.name === 'Security System' && property?.amenities.some(a => 
        a.toLowerCase().includes('security') || a.toLowerCase().includes('alarm')
      )) {
        const discountAmount = basePremium * (discount.percentage / 100)
        discountsApplied.push({
          name: discount.name,
          amount: discountAmount,
          percentage: discount.percentage
        })
        basePremium -= discountAmount
      }
    })
  }
  
  const monthly = Math.round(basePremium * 100) / 100
  const quarterly = Math.round(monthly * 3 * 0.98 * 100) / 100
  const annual = Math.round(monthly * 12 * 0.9 * 100) / 100
  
  return {
    id: `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    planId: plan.id,
    planName: plan.name,
    providerId: plan.providerId,
    providerName: plan.providerName,
    requesterId: 'current-user',
    requesterName: 'User',
    requesterEmail: 'user@example.com',
    requesterType: plan.targetAudience.includes('tenant') ? 'tenant' : 'landlord',
    propertyId: property?.id,
    propertyDetails: property ? {
      address: property.location,
      type: property.type,
      value: property.price * 200,
      area: property.area
    } : undefined,
    coverageRequested: customCoverage || plan.coverage,
    deductible: customDeductible || plan.deductible,
    quotedPremium: {
      monthly,
      quarterly,
      annual
    },
    discountsApplied,
    totalAnnualCost: annual,
    validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    status: 'provided',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}

export function compareInsurancePlans(
  plans: InsurancePlan[],
  criteria: InsuranceComparison['criteria']
): InsuranceComparison {
  const scorePlan = (plan: InsurancePlan): number => {
    let score = 0
    
    const monthlyCost = plan.pricing.basePrice
    if (monthlyCost <= criteria.budget) {
      score += 30
      const savingsPercentage = ((criteria.budget - monthlyCost) / criteria.budget) * 100
      score += Math.min(savingsPercentage / 2, 20)
    }
    
    const coverageMatch = criteria.coverageNeeded.filter(needed => {
      if (needed === 'property' && plan.coverage.propertyDamage) return true
      if (needed === 'liability' && plan.coverage.liability) return true
      if (needed === 'personal' && plan.coverage.personalProperty) return true
      if (needed === 'rent' && plan.coverage.lossOfRent) return true
      return false
    }).length
    score += (coverageMatch / criteria.coverageNeeded.length) * 30
    
    if (plan.targetAudience.includes(criteria.userType)) {
      score += 10
    }
    
    score += (plan.rating / 5) * 10
    
    return Math.round(score)
  }
  
  const recommendations = plans.map(plan => {
    const score = scorePlan(plan)
    const reasons: string[] = []
    const bestFor: string[] = []
    
    if (plan.pricing.basePrice <= criteria.budget) {
      reasons.push('Within your budget')
    }
    if (plan.popular) {
      reasons.push('Popular choice among users')
      bestFor.push('Most users')
    }
    if (plan.rating >= 4.7) {
      reasons.push('Highly rated by customers')
    }
    if (plan.featured) {
      reasons.push('Featured plan with comprehensive benefits')
      bestFor.push('Complete protection')
    }
    if (plan.claimsProcess.onlineClaimSubmission && plan.claimsProcess.phoneSupport247) {
      reasons.push('Excellent claims support')
    }
    
    if (plan.category === 'tenant') {
      bestFor.push('Renters')
    } else if (plan.category === 'landlord') {
      bestFor.push('Property owners')
    } else if (plan.category === 'comprehensive') {
      bestFor.push('Complete coverage needs')
    }
    
    return {
      planId: plan.id,
      score,
      reasons,
      bestFor
    }
  }).sort((a, b) => b.score - a.score)
  
  return {
    plans,
    criteria,
    recommendations
  }
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatCoverageAmount(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount}`
}

export function getInsuranceRecommendation(userType: 'landlord' | 'tenant', property?: Property): string {
  if (userType === 'tenant') {
    return 'As a tenant, we recommend starting with Basic Renter Protection for essential coverage, or upgrade to Premium if you have valuable items.'
  }
  
  if (property) {
    const estimatedValue = property.price * 200
    if (estimatedValue > 500000) {
      return 'For high-value properties, we recommend Premier Landlord Protection with comprehensive coverage and high liability limits.'
    }
    if (estimatedValue > 250000) {
      return 'Your property would benefit from standard Landlord Essentials coverage with optional upgrades for natural disasters.'
    }
  }
  
  return 'We recommend reviewing our Landlord Essentials plan to protect your investment and rental income.'
}
