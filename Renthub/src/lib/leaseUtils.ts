import { LeaseAgreement, LeaseTemplate, Property, Booking } from './types'

export const DEFAULT_LEASE_CLAUSES = {
  common: [
    'The tenant agrees to pay rent on or before the due date each month.',
    'The security deposit will be returned within 30 days after lease termination, minus any deductions for damages.',
    'The tenant must provide written notice at least 30 days before vacating the property.',
    'The landlord must provide at least 24 hours notice before entering the property, except in emergencies.',
    'The tenant is responsible for maintaining the property in good condition and reporting any damages promptly.',
  ],
  shortTerm: [
    'This is a short-term rental agreement subject to local short-term rental regulations.',
    'Check-in time is after 3:00 PM and check-out time is before 11:00 AM unless otherwise arranged.',
    'The property must be left in the same condition as upon arrival, normal wear and tear excepted.',
    'Excessive noise or disturbances may result in immediate termination of this agreement.',
  ],
  longTerm: [
    'This lease is binding for the entire term unless terminated according to the terms herein.',
    'Rent increases may only occur with proper notice as required by law, typically 60-90 days.',
    'The tenant has the right to quiet enjoyment of the property throughout the lease term.',
    'Any modifications to the property require written consent from the landlord.',
  ],
  pets: [
    'A refundable pet deposit is required for each approved pet.',
    'Pets must be registered with the landlord and kept under control at all times.',
    'The tenant is responsible for any damage caused by pets.',
    'Certain breeds or types of pets may be restricted; please consult your landlord.',
  ],
  utilities: [
    'The tenant is responsible for setting up and paying for utilities not included in the rent.',
    'Utilities included in rent are specified in the lease agreement and may not be separately metered.',
    'The landlord reserves the right to pass through utility cost increases to the tenant with proper notice.',
  ]
}

export const LANDLORD_RESPONSIBILITIES = [
  'Maintain the property in habitable condition',
  'Make necessary repairs in a timely manner',
  'Comply with all building, housing, and health codes',
  'Maintain common areas (if applicable)',
  'Ensure all appliances and systems are in working order at move-in',
  'Provide functioning smoke detectors and carbon monoxide detectors',
  'Maintain the structural integrity of the property',
  'Respect tenant privacy and provide notice before entry',
]

export const TENANT_RESPONSIBILITIES = [
  'Pay rent on time each month',
  'Maintain the property in clean and sanitary condition',
  'Dispose of trash and waste properly',
  'Use all appliances and systems responsibly',
  'Report maintenance issues and damages promptly',
  'Not damage or remove property fixtures',
  'Comply with all lease terms and community rules',
  'Allow landlord access for repairs and inspections with proper notice',
]

export function generateLeaseFromBooking(
  booking: Booking,
  property: Property,
  landlordId: string,
  landlordName: string,
  landlordEmail: string,
  landlordPhone?: string
): Omit<LeaseAgreement, 'id' | 'createdAt' | 'updatedAt'> {
  const isShortTerm = booking.rentalTerm === 'short-term'
  
  const startDate = booking.checkIn || Date.now()
  let endDate: number
  let duration: LeaseAgreement['duration'] = {}
  
  if (isShortTerm && booking.checkIn && booking.checkOut) {
    endDate = booking.checkOut
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    duration.days = days
  } else {
    const months = booking.durationMonths || 12
    const years = booking.durationYears || 0
    duration.months = months
    duration.years = years
    const endDateObj = new Date(startDate)
    endDateObj.setMonth(endDateObj.getMonth() + months)
    endDateObj.setFullYear(endDateObj.getFullYear() + years)
    endDate = endDateObj.getTime()
  }
  
  const monthlyRent = isShortTerm 
    ? booking.totalPrice 
    : Math.round(booking.totalPrice / ((duration.years || 0) * 12 + (duration.months || 1)))
  
  const securityDeposit = isShortTerm 
    ? Math.round(monthlyRent * 0.5) 
    : Math.round(monthlyRent * 1.5)
  
  const specialClauses: string[] = []
  
  if (booking.voucherCode) {
    specialClauses.push(
      `A discount of $${booking.discountAmount?.toLocaleString() || 0} has been applied using voucher code "${booking.voucherCode}".`
    )
  }
  
  const defaultUtilities = [
    { name: 'Water', includedInRent: false },
    { name: 'Electricity', includedInRent: false },
    { name: 'Gas', includedInRent: false },
    { name: 'Internet', includedInRent: false },
    { name: 'Trash Collection', includedInRent: true },
  ]
  
  const petsAllowed = property.amenities?.includes('Pet-Friendly') || false
  const furnished = property.amenities?.includes('Furnished') || false
  const parkingSpaces = property.amenities?.includes('Parking') ? 1 : 0
  
  const baseClauses = [...DEFAULT_LEASE_CLAUSES.common]
  
  if (isShortTerm) {
    baseClauses.push(...DEFAULT_LEASE_CLAUSES.shortTerm)
  } else {
    baseClauses.push(...DEFAULT_LEASE_CLAUSES.longTerm)
  }
  
  if (petsAllowed) {
    baseClauses.push(...DEFAULT_LEASE_CLAUSES.pets)
  }
  
  baseClauses.push(...DEFAULT_LEASE_CLAUSES.utilities)
  
  return {
    propertyId: property.id,
    propertyTitle: property.title,
    propertyAddress: property.location,
    landlordId,
    landlordName,
    landlordEmail,
    landlordPhone,
    tenantId: booking.userId || 'guest',
    tenantName: booking.customerName,
    tenantEmail: booking.customerEmail,
    tenantPhone: booking.customerPhone,
    bookingId: booking.id,
    
    leaseType: isShortTerm ? 'fixed-term' : 'fixed-term',
    rentalTerm: booking.rentalTerm,
    startDate,
    endDate,
    duration,
    
    financials: {
      monthlyRent,
      securityDeposit,
      firstMonthRent: monthlyRent,
      lastMonthRent: isShortTerm ? undefined : monthlyRent,
      petDeposit: petsAllowed ? 300 : undefined,
      totalUpfront: isShortTerm 
        ? monthlyRent + securityDeposit 
        : monthlyRent * 2 + securityDeposit + (petsAllowed ? 300 : 0),
      paymentDueDay: 1,
      lateFee: 50,
      currency: 'USD'
    },
    
    terms: {
      petsAllowed,
      smokingAllowed: false,
      sublettingAllowed: false,
      maxOccupants: property.bedrooms * 2,
      utilities: defaultUtilities,
      parkingSpaces,
      storageUnit: false,
      furnished
    },
    
    responsibilities: {
      landlord: [...LANDLORD_RESPONSIBILITIES],
      tenant: [...TENANT_RESPONSIBILITIES]
    },
    
    specialClauses,
    
    status: 'draft',
    signatures: {},
    documents: [],
    
    metadata: {
      templateVersion: '1.0',
      jurisdiction: 'General',
      governingLaw: 'Local jurisdiction laws apply'
    }
  }
}

export function calculateLeaseUpfrontCost(lease: LeaseAgreement): number {
  return lease.financials.totalUpfront
}

export function calculateMonthlyDue(lease: LeaseAgreement): number {
  return lease.financials.monthlyRent
}

export function isLeaseActive(lease: LeaseAgreement): boolean {
  const now = Date.now()
  return (
    lease.status === 'active' &&
    lease.startDate <= now &&
    lease.endDate >= now
  )
}

export function isLeaseExpiringSoon(lease: LeaseAgreement, daysThreshold: number = 30): boolean {
  if (lease.status !== 'active') return false
  
  const now = Date.now()
  const threshold = now + (daysThreshold * 24 * 60 * 60 * 1000)
  
  return lease.endDate <= threshold && lease.endDate >= now
}

export function canRenewLease(lease: LeaseAgreement): boolean {
  return (
    (lease.status === 'active' || isLeaseExpiringSoon(lease, 60)) &&
    !lease.renewalStatus?.offered
  )
}

export function getDaysUntilExpiry(lease: LeaseAgreement): number {
  const now = Date.now()
  const diff = lease.endDate - now
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getLeaseDuration(lease: LeaseAgreement): string {
  const { years, months, days } = lease.duration
  
  if (days) {
    return `${days} day${days > 1 ? 's' : ''}`
  }
  
  const parts: string[] = []
  if (years) parts.push(`${years} year${years > 1 ? 's' : ''}`)
  if (months) parts.push(`${months} month${months > 1 ? 's' : ''}`)
  
  return parts.join(' and ')
}

export function validateLeaseSignature(lease: LeaseAgreement, userId: string): {
  canSign: boolean
  reason?: string
  role?: 'landlord' | 'tenant'
} {
  if (lease.status === 'active') {
    return { canSign: false, reason: 'Lease is already active' }
  }
  
  if (lease.status === 'terminated' || lease.status === 'expired') {
    return { canSign: false, reason: 'Lease has been terminated or expired' }
  }
  
  const isLandlord = userId === lease.landlordId
  const isTenant = userId === lease.tenantId
  
  if (!isLandlord && !isTenant) {
    return { canSign: false, reason: 'You are not a party to this lease' }
  }
  
  if (isLandlord && lease.signatures.landlord) {
    return { canSign: false, reason: 'You have already signed this lease' }
  }
  
  if (isTenant && lease.signatures.tenant) {
    return { canSign: false, reason: 'You have already signed this lease' }
  }
  
  return {
    canSign: true,
    role: isLandlord ? 'landlord' : 'tenant'
  }
}

export function isLeaseFullySigned(lease: LeaseAgreement): boolean {
  return !!(lease.signatures.landlord && lease.signatures.tenant)
}

export async function generateLeasePDF(lease: LeaseAgreement): Promise<string> {
  return `data:text/plain;charset=utf-8,${encodeURIComponent(generateLeaseText(lease))}`
}

function generateLeaseText(lease: LeaseAgreement): string {
  const duration = getLeaseDuration(lease)
  const startDate = new Date(lease.startDate).toLocaleDateString()
  const endDate = new Date(lease.endDate).toLocaleDateString()
  
  let text = `RESIDENTIAL LEASE AGREEMENT\n\n`
  text += `This Lease Agreement ("Agreement") is entered into on ${new Date(lease.createdAt).toLocaleDateString()}\n\n`
  text += `BETWEEN:\n`
  text += `Landlord: ${lease.landlordName}\n`
  text += `Email: ${lease.landlordEmail}\n`
  if (lease.landlordPhone) text += `Phone: ${lease.landlordPhone}\n`
  text += `\nAND:\n`
  text += `Tenant: ${lease.tenantName}\n`
  text += `Email: ${lease.tenantEmail}\n`
  text += `Phone: ${lease.tenantPhone}\n\n`
  
  text += `PROPERTY:\n`
  text += `${lease.propertyTitle}\n`
  text += `${lease.propertyAddress}\n\n`
  
  text += `LEASE TERM:\n`
  text += `Type: ${lease.leaseType === 'fixed-term' ? 'Fixed Term' : 'Month-to-Month'}\n`
  text += `Duration: ${duration}\n`
  text += `Start Date: ${startDate}\n`
  text += `End Date: ${endDate}\n\n`
  
  text += `FINANCIAL TERMS:\n`
  text += `Monthly Rent: $${lease.financials.monthlyRent.toLocaleString()}\n`
  text += `Security Deposit: $${lease.financials.securityDeposit.toLocaleString()}\n`
  text += `Payment Due: Day ${lease.financials.paymentDueDay} of each month\n`
  text += `Late Fee: $${lease.financials.lateFee}\n`
  text += `Total Upfront Cost: $${lease.financials.totalUpfront.toLocaleString()}\n\n`
  
  text += `PROPERTY TERMS:\n`
  text += `Pets Allowed: ${lease.terms.petsAllowed ? 'Yes' : 'No'}\n`
  text += `Smoking Allowed: ${lease.terms.smokingAllowed ? 'Yes' : 'No'}\n`
  text += `Subletting Allowed: ${lease.terms.sublettingAllowed ? 'Yes' : 'No'}\n`
  text += `Maximum Occupants: ${lease.terms.maxOccupants}\n`
  text += `Furnished: ${lease.terms.furnished ? 'Yes' : 'No'}\n`
  if (lease.terms.parkingSpaces) text += `Parking Spaces: ${lease.terms.parkingSpaces}\n`
  text += `\n`
  
  text += `UTILITIES:\n`
  lease.terms.utilities.forEach(utility => {
    text += `- ${utility.name}: ${utility.includedInRent ? 'Included in rent' : 'Tenant responsibility'}\n`
  })
  text += `\n`
  
  text += `LANDLORD RESPONSIBILITIES:\n`
  lease.responsibilities.landlord.forEach((resp, i) => {
    text += `${i + 1}. ${resp}\n`
  })
  text += `\n`
  
  text += `TENANT RESPONSIBILITIES:\n`
  lease.responsibilities.tenant.forEach((resp, i) => {
    text += `${i + 1}. ${resp}\n`
  })
  text += `\n`
  
  if (lease.specialClauses.length > 0) {
    text += `SPECIAL CLAUSES:\n`
    lease.specialClauses.forEach((clause, i) => {
      text += `${i + 1}. ${clause}\n`
    })
    text += `\n`
  }
  
  text += `GENERAL TERMS AND CONDITIONS:\n`
  DEFAULT_LEASE_CLAUSES.common.forEach((clause, i) => {
    text += `${i + 1}. ${clause}\n`
  })
  
  if (lease.rentalTerm === 'short-term') {
    text += `\nSHORT-TERM RENTAL SPECIFIC TERMS:\n`
    DEFAULT_LEASE_CLAUSES.shortTerm.forEach((clause, i) => {
      text += `${i + 1}. ${clause}\n`
    })
  } else {
    text += `\nLONG-TERM RENTAL SPECIFIC TERMS:\n`
    DEFAULT_LEASE_CLAUSES.longTerm.forEach((clause, i) => {
      text += `${i + 1}. ${clause}\n`
    })
  }
  
  text += `\n\nSIGNATURES:\n\n`
  
  if (lease.signatures.landlord) {
    text += `Landlord: ${lease.landlordName}\n`
    text += `Signed: ${new Date(lease.signatures.landlord.signedAt).toLocaleString()}\n`
    text += `Signature: ${lease.signatures.landlord.signature}\n\n`
  } else {
    text += `Landlord: ________________________ Date: __________\n\n`
  }
  
  if (lease.signatures.tenant) {
    text += `Tenant: ${lease.tenantName}\n`
    text += `Signed: ${new Date(lease.signatures.tenant.signedAt).toLocaleString()}\n`
    text += `Signature: ${lease.signatures.tenant.signature}\n\n`
  } else {
    text += `Tenant: ________________________ Date: __________\n\n`
  }
  
  return text
}
