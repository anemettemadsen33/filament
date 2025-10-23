import { BackgroundCheckRequest, BackgroundCheckResults, BackgroundCheckProvider, BackgroundCheckTemplate } from './types'

export const BACKGROUND_CHECK_PROVIDERS: BackgroundCheckProvider[] = [
  {
    id: 'standard',
    name: 'Standard Background Check',
    description: 'Basic criminal record and identity verification',
    supportedChecks: ['criminalRecord', 'identityVerification'],
    averageProcessingTime: 2,
    cost: 29.99,
    accuracy: 95,
    enabled: true
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Check',
    description: 'Full background check including credit, employment, and rental history',
    supportedChecks: ['criminalRecord', 'creditScore', 'employmentVerification', 'rentalHistory', 'evictionRecords', 'identityVerification'],
    averageProcessingTime: 5,
    cost: 59.99,
    accuracy: 98,
    enabled: true
  },
  {
    id: 'premium',
    name: 'Premium Tenant Screening',
    description: 'Most thorough screening with extended criminal history and detailed credit analysis',
    supportedChecks: ['criminalRecord', 'creditScore', 'employmentVerification', 'rentalHistory', 'evictionRecords', 'identityVerification'],
    averageProcessingTime: 7,
    cost: 89.99,
    accuracy: 99,
    enabled: true
  }
]

export const BACKGROUND_CHECK_TEMPLATES: BackgroundCheckTemplate[] = [
  {
    id: 'basic',
    name: 'Basic Screening',
    description: 'Essential checks for standard rentals',
    checkTypes: ['criminalRecord', 'identityVerification'],
    estimatedCost: 29.99,
    estimatedTime: 2,
    recommended: false,
    popularFor: ['apartments', 'houses']
  },
  {
    id: 'standard',
    name: 'Standard Screening',
    description: 'Recommended for most rental properties',
    checkTypes: ['criminalRecord', 'creditScore', 'rentalHistory', 'identityVerification'],
    estimatedCost: 49.99,
    estimatedTime: 3,
    recommended: true,
    popularFor: ['apartments', 'houses', 'all']
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Screening',
    description: 'Complete tenant verification for premium properties',
    checkTypes: ['criminalRecord', 'creditScore', 'employmentVerification', 'rentalHistory', 'evictionRecords', 'identityVerification'],
    estimatedCost: 59.99,
    estimatedTime: 5,
    recommended: false,
    popularFor: ['houses', 'commercial']
  }
]

export async function simulateBackgroundCheck(request: BackgroundCheckRequest): Promise<BackgroundCheckResults> {
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  const baseScore = Math.floor(Math.random() * 30) + 70
  const creditScore = Math.floor(Math.random() * 300) + 550
  
  const results: BackgroundCheckResults = {
    overallStatus: baseScore >= 80 ? 'approved' : baseScore >= 65 ? 'conditional' : 'review-required',
    riskScore: baseScore,
    completedAt: Date.now(),
    recommendations: [],
    warnings: [],
    redFlags: []
  }
  
  if (request.requestedChecks.criminalRecord) {
    const hasCriminalRecord = Math.random() > 0.85
    results.criminalRecord = {
      status: hasCriminalRecord ? 'records-found' : 'clear',
      details: hasCriminalRecord 
        ? 'Minor traffic violations found in the last 5 years'
        : 'No criminal records found in our database',
      recordsFound: hasCriminalRecord ? [
        {
          type: 'Traffic Violation',
          date: Date.now() - (365 * 24 * 60 * 60 * 1000 * 2),
          jurisdiction: 'State Court',
          disposition: 'Paid fine'
        }
      ] : []
    }
    
    if (hasCriminalRecord) {
      results.warnings.push('Minor traffic violations found')
    } else {
      results.recommendations.push('Clean criminal record')
    }
  }
  
  if (request.requestedChecks.creditScore) {
    const rating = creditScore >= 720 ? 'excellent' : creditScore >= 650 ? 'good' : creditScore >= 580 ? 'fair' : 'poor'
    results.creditScore = {
      score: creditScore,
      rating,
      details: `Credit score of ${creditScore} indicates ${rating} creditworthiness`,
      outstandingDebts: Math.floor(Math.random() * 15000),
      bankruptcies: 0,
      collections: rating === 'poor' ? Math.floor(Math.random() * 3) : 0,
      latePayments: Math.floor(Math.random() * 5)
    }
    
    if (rating === 'excellent' || rating === 'good') {
      results.recommendations.push(`${rating === 'excellent' ? 'Excellent' : 'Good'} credit score (${creditScore})`)
    } else if (rating === 'poor') {
      results.redFlags.push(`Low credit score (${creditScore})`)
    } else {
      results.warnings.push(`Fair credit score (${creditScore})`)
    }
  }
  
  if (request.requestedChecks.employmentVerification && request.employmentInfo.employed) {
    const verified = Math.random() > 0.1
    results.employmentVerification = {
      verified,
      employer: request.employmentInfo.employer || 'Tech Company Inc.',
      position: request.employmentInfo.position || 'Software Engineer',
      monthlyIncome: request.employmentInfo.monthlyIncome || 5000,
      employmentLength: Math.floor((Date.now() - (request.employmentInfo.employmentStartDate || Date.now())) / (30 * 24 * 60 * 60 * 1000)),
      details: verified 
        ? 'Employment and income verified with employer'
        : 'Unable to verify employment - manual review required'
    }
    
    if (verified && (request.employmentInfo.monthlyIncome || 0) >= 3000) {
      results.recommendations.push('Stable employment with verified income')
    } else if (!verified) {
      results.warnings.push('Employment verification pending')
    }
  }
  
  if (request.requestedChecks.rentalHistory) {
    const hasGoodHistory = Math.random() > 0.2
    results.rentalHistory = {
      status: hasGoodHistory ? 'good' : 'fair',
      previousLandlords: [
        {
          name: 'John Smith Properties',
          property: '123 Main St, Apt 4B',
          from: Date.now() - (365 * 24 * 60 * 60 * 1000 * 3),
          to: Date.now() - (365 * 24 * 60 * 60 * 1000),
          referenceVerified: true,
          paymentHistory: hasGoodHistory ? 'excellent' : 'good',
          comments: hasGoodHistory 
            ? 'Excellent tenant, always paid on time'
            : 'Good tenant, occasional late payments'
        }
      ],
      latePayments: hasGoodHistory ? 0 : Math.floor(Math.random() * 3),
      evictions: 0
    }
    
    if (hasGoodHistory) {
      results.recommendations.push('Positive rental history with good references')
    } else {
      results.warnings.push('Some late payments in rental history')
    }
  }
  
  if (request.requestedChecks.evictionRecords) {
    const hasEvictions = Math.random() > 0.95
    results.evictionRecords = {
      found: hasEvictions,
      count: hasEvictions ? 1 : 0,
      records: hasEvictions ? [
        {
          date: Date.now() - (365 * 24 * 60 * 60 * 1000 * 5),
          location: 'County Court',
          status: 'Settled',
          details: 'Eviction filed but settled before completion'
        }
      ] : []
    }
    
    if (hasEvictions) {
      results.redFlags.push('Previous eviction record found (resolved)')
    } else {
      results.recommendations.push('No eviction records found')
    }
  }
  
  if (request.requestedChecks.identityVerification) {
    const matchScore = Math.floor(Math.random() * 15) + 85
    results.identityVerification = {
      verified: matchScore >= 90,
      matchScore,
      documentType: request.personalInfo.idType,
      documentVerified: matchScore >= 90,
      addressVerified: matchScore >= 85,
      ssnVerified: matchScore >= 95,
      details: matchScore >= 90 
        ? 'Identity fully verified with high confidence'
        : 'Identity verification completed with minor discrepancies'
    }
    
    if (matchScore >= 95) {
      results.recommendations.push('Identity verified with high confidence')
    } else if (matchScore < 90) {
      results.warnings.push('Minor discrepancies in identity verification')
    }
  }
  
  if (results.redFlags.length > 0) {
    results.overallStatus = 'review-required'
  } else if (results.warnings.length > 2) {
    results.overallStatus = 'conditional'
  }
  
  return results
}

export function calculateBackgroundCheckCost(requestedChecks: BackgroundCheckRequest['requestedChecks']): number {
  let cost = 0
  
  if (requestedChecks.criminalRecord) cost += 15
  if (requestedChecks.creditScore) cost += 20
  if (requestedChecks.employmentVerification) cost += 10
  if (requestedChecks.rentalHistory) cost += 10
  if (requestedChecks.evictionRecords) cost += 5
  if (requestedChecks.identityVerification) cost += 10
  
  return cost
}

export function getBackgroundCheckStatusColor(status: BackgroundCheckRequest['status']): string {
  switch (status) {
    case 'pending':
      return 'text-muted-foreground'
    case 'processing':
      return 'text-warning'
    case 'completed':
      return 'text-accent'
    case 'failed':
      return 'text-destructive'
    case 'expired':
      return 'text-muted-foreground'
    default:
      return 'text-foreground'
  }
}

export function getBackgroundCheckStatusBadge(status: BackgroundCheckRequest['status']): string {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'processing':
      return 'default'
    case 'completed':
      return 'default'
    case 'failed':
      return 'destructive'
    case 'expired':
      return 'secondary'
    default:
      return 'secondary'
  }
}

export function getResultsStatusColor(status: BackgroundCheckResults['overallStatus']): string {
  switch (status) {
    case 'approved':
      return 'text-accent'
    case 'conditional':
      return 'text-warning'
    case 'denied':
      return 'text-destructive'
    case 'review-required':
      return 'text-warning'
    default:
      return 'text-foreground'
  }
}

export function getRiskScoreColor(score: number): string {
  if (score >= 80) return 'text-accent'
  if (score >= 65) return 'text-warning'
  return 'text-destructive'
}

export function getCreditRatingColor(rating: string): string {
  switch (rating) {
    case 'excellent':
      return 'text-accent'
    case 'good':
      return 'text-primary'
    case 'fair':
      return 'text-warning'
    case 'poor':
      return 'text-destructive'
    default:
      return 'text-foreground'
  }
}
