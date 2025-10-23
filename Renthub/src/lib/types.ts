export interface LandlordBadge {
  id: string
  type: 'verified' | 'superhost' | 'responsive' | 'quality' | 'eco-friendly' | 'pet-friendly' | 'family-friendly' | 'accessibility' | 'longterm-expert' | 'flexible'
  name: string
  description: string
  icon?: string
  earnedAt: number
}

export interface LandlordVerification {
  verified: boolean
  verifiedAt?: number
  identity: boolean
  email: boolean
  phone: boolean
  businessLicense?: boolean
  backgroundCheck?: boolean
  taxId?: boolean
  proofOfOwnership?: boolean
}

export interface LandlordStats {
  totalProperties: number
  activeListings: number
  totalBookings: number
  responseTime: number
  responseRate: number
  averageRating: number
  reviewCount: number
  yearsOnPlatform: number
  completionRate: number
  repeatGuestRate?: number
}

export interface Landlord {
  id: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  bio?: string
  languages?: string[]
  joinedAt: number
  verification: LandlordVerification
  stats: LandlordStats
  badges: LandlordBadge[]
  isSuperhost: boolean
}

export interface VirtualTour {
  id: string
  type: '360' | 'video'
  url: string
  thumbnail?: string
  title: string
  description?: string
  duration?: number
  roomName?: string
  createdAt: number
}

export interface LockboxInfo {
  enabled: boolean
  type: 'key_lockbox' | 'smart_lock' | 'keypad' | 'combination_lock'
  instructions?: string
  location?: string
  accessCode?: string
  accessCodeExpiresAt?: number
  wifiName?: string
  wifiPassword?: string
  parkingInstructions?: string
  emergencyContact?: string
}

export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  type: 'apartment' | 'house' | 'studio' | 'condo'
  rentalTerm: 'short-term' | 'long-term'
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  amenities: string[]
  available: boolean
  createdAt: number
  ownerName?: string
  ownerEmail?: string
  ownerPhone?: string
  views?: number
  favorites?: number
  blockedDates?: number[]
  landlord?: Landlord
  virtualTours?: VirtualTour[]
  lockbox?: LockboxInfo
}

export interface Booking {
  id: string
  propertyId: string
  propertyTitle: string
  rentalTerm: 'short-term' | 'long-term'
  customerName: string
  customerEmail: string
  customerPhone: string
  checkIn?: number
  checkOut?: number
  durationMonths?: number
  durationYears?: number
  totalPrice: number
  voucherCode?: string
  discountAmount?: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: number
  userId?: string
  paymentOption?: 'deposit-only' | 'full-payment'
  depositAmount?: number
  paymentDetails?: {
    accountName: string
    accountNumber: string
    bankName: string
    iban?: string
  }
  checkInInfo?: {
    accessCode?: string
    accessCodeGeneratedAt?: number
    checkInMethod?: 'self' | 'host'
    checkInCompletedAt?: number
    checkOutCompletedAt?: number
  }
}

export interface Review {
  id: string
  propertyId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: number
  userId?: string
  ratings?: {
    cleanliness: number
    location: number
    communication: number
    value: number
    accuracy: number
  }
  photos?: string[]
  verifiedBooking?: boolean
  landlordResponse?: {
    message: string
    createdAt: number
    responderId: string
  }
  helpfulVotes?: {
    up: number
    down: number
  }
  votedBy?: string[]
}

export interface PropertyAnalytics {
  propertyId: string
  views: number
  favorites: number
  contactRequests: number
  lastViewed?: number
}

export interface FilterState {
  searchQuery: string
  propertyType: string
  rentalTerm: string
  minPrice: number
  maxPrice: number
  bedrooms: string
  verifiedOnly?: boolean
  superhostOnly?: boolean
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'bedrooms' | 'area'

export interface User {
  id: string
  login: string
  email: string
  phone?: string
  avatarUrl: string
  isOwner: boolean
  createdAt: number
  preferences?: {
    rentalTerm?: 'short-term' | 'long-term' | 'all'
    priceRange?: { min: number; max: number }
    propertyType?: string
    bedrooms?: string
  }
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  message: string
  timestamp: number
  read: boolean
  isAI?: boolean
}

export interface Conversation {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage?: string
  participants: {
    userId: string
    userName: string
    userAvatar?: string
    userEmail?: string
    isOwner: boolean
  }[]
  lastMessage?: string
  lastMessageTime?: number
  unreadCount: number
  createdAt: number
  mode?: 'ai' | 'agent'
  agentRequested?: boolean
}

export interface Notification {
  id: string
  userId: string
  type: 'message' | 'booking' | 'price_drop' | 'new_property' | 'review' | 'confirmation' | 'property_update'
  title: string
  message: string
  propertyId?: string
  conversationId?: string
  bookingId?: string
  read: boolean
  createdAt: number
  actionUrl?: string
  metadata?: Record<string, unknown>
}



export interface PriceHistory {
  propertyId: string
  history: Array<{
    price: number
    date: number
  }>
  marketInsights?: {
    medianPrice: number
    neighborhood: string
    pricePerSqft: number
    isPricedFairly: boolean
    percentageVsMarket: number
  }
}

export interface PropertyCoordinates {
  lat: number
  lng: number
}

export interface PropertyWithLocation extends Property {
  coordinates: PropertyCoordinates
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface MapViewState {
  center: PropertyCoordinates
  zoom: number
}

export interface PropertyCluster {
  id: string
  coordinates: PropertyCoordinates
  properties: PropertyWithLocation[]
  count: number
}

export interface Discount {
  id: string
  code: string
  type: 'early-bird' | 'long-stay' | 'first-booking' | 'referral' | 'seasonal' | 'custom'
  value: number
  valueType: 'percentage' | 'fixed'
  propertyId?: string
  landlordId: string
  validFrom: number
  validUntil: number
  maxUses: number
  currentUses: number
  minBookingDays?: number
  minBookingMonths?: number
  active: boolean
  description?: string
}

export interface UserVerification {
  email: boolean
  phone: boolean
  id: boolean
  backgroundCheck: boolean
  verifiedAt?: number
}

export interface UserStats {
  yearsOnPlatform: number
  totalBookings: number
  responseRate: number
  averageRating: number
  isSuperhost: boolean
}

export interface VerifiedUser extends User {
  verification?: UserVerification
  stats?: UserStats
  profileCompletion?: number
}

export interface Recommendation {
  propertyId: string
  score: number
  reasons: string[]
  basedOn: 'favorites' | 'views' | 'similar-users' | 'preferences'
}

export interface NotificationSettings {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  categories: {
    messages: boolean
    bookings: boolean
    priceDrops: boolean
    newProperties: boolean
    reviews: boolean
  }
}

export interface RoommateProfile {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  age?: number
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say'
  occupation?: string
  bio: string
  location: string
  budgetMin: number
  budgetMax: number
  moveInDate?: number
  active: boolean
  createdAt: number
  updatedAt: number
  verification?: {
    email: boolean
    phone: boolean
    identity: boolean
  }
  views?: number
  matches?: number
  lastActive?: number
  
  lookingFor: {
    genderPreference?: 'male' | 'female' | 'any'
    ageRangeMin?: number
    ageRangeMax?: number
    roommateCount?: number
  }
  
  lifestyle: {
    interests: string[]
    languages: string[]
  }
  
  preferences: {
    propertyType: ('apartment' | 'house' | 'studio' | 'condo')[]
    bedrooms: number[]
    cleanliness: number
    socialLevel: number
    pets: 'yes' | 'no' | 'negotiable' | boolean
    smoking: 'yes' | 'no' | 'outside-only' | boolean
    workFromHome: boolean
    guestsFrequency: 'never' | 'occasionally' | 'frequently'
    sleepSchedule: 'early-bird' | 'night-owl' | 'flexible'
    sharingPreferences?: string[]
  }
}

export interface RoommateMatch {
  id: string
  profileId: string
  matchedProfileId: string
  matchScore?: number
  compatibilityFactors?: {
    budget: number
    location: number
    lifestyle: number
    preferences: number
    schedule: number
  }
  status: 'pending' | 'liked' | 'mutual' | 'declined' | 'chatting'
  createdAt: number
  conversationId?: string
  aiRecommendation?: string
  likedByUser?: boolean
}

export interface Voucher {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'free-nights'
  value: number
  description: string
  propertyId?: string
  landlordId?: string
  category: 'early-bird' | 'long-stay' | 'first-booking' | 'referral' | 'seasonal' | 'loyalty' | 'custom'
  validFrom: number
  validUntil: number
  maxUses: number
  currentUses: number
  maxUsesPerUser?: number
  minBookingDays?: number
  minBookingMonths?: number
  rentalTermRestriction?: 'short-term' | 'long-term'
  propertyTypeRestriction?: ('apartment' | 'house' | 'studio' | 'condo')[]
  minBookingValue?: number
  active: boolean
  createdAt: number
  createdBy: string
  usedBy?: string[]
  isPublic: boolean
  autoApply?: boolean
  stackable?: boolean
  priority?: number
}

export interface VoucherUsage {
  id: string
  voucherId: string
  voucherCode: string
  userId: string
  userName: string
  propertyId: string
  propertyTitle: string
  bookingId?: string
  discountAmount: number
  originalPrice: number
  finalPrice: number
  usedAt: number
}

export interface VoucherValidation {
  valid: boolean
  message: string
  voucher?: Voucher
  discountAmount?: number
  finalPrice?: number
}

export interface LeaseAgreement {
  id: string
  propertyId: string
  propertyTitle: string
  propertyAddress: string
  landlordId: string
  landlordName: string
  landlordEmail: string
  landlordPhone?: string
  tenantId: string
  tenantName: string
  tenantEmail: string
  tenantPhone: string
  bookingId?: string
  
  leaseType: 'fixed-term' | 'month-to-month' | 'periodic'
  rentalTerm: 'short-term' | 'long-term'
  startDate: number
  endDate: number
  duration: {
    months?: number
    years?: number
    days?: number
  }
  
  financials: {
    monthlyRent: number
    securityDeposit: number
    firstMonthRent: number
    lastMonthRent?: number
    petDeposit?: number
    keyDeposit?: number
    totalUpfront: number
    paymentDueDay: number
    lateFee?: number
    currency: string
  }
  
  terms: {
    petsAllowed: boolean
    smokingAllowed: boolean
    sublettingAllowed: boolean
    maxOccupants: number
    utilities: {
      name: string
      includedInRent: boolean
      estimatedCost?: number
    }[]
    parkingSpaces?: number
    storageUnit?: boolean
    furnished: boolean
  }
  
  responsibilities: {
    landlord: string[]
    tenant: string[]
  }
  
  specialClauses: string[]
  
  status: 'draft' | 'pending_landlord' | 'pending_tenant' | 'active' | 'expired' | 'terminated' | 'renewed'
  
  signatures: {
    landlord?: {
      signedAt: number
      signature: string
      ipAddress?: string
    }
    tenant?: {
      signedAt: number
      signature: string
      ipAddress?: string
    }
  }
  
  createdAt: number
  updatedAt: number
  activatedAt?: number
  terminatedAt?: number
  terminationReason?: string
  
  documents: {
    id: string
    name: string
    type: 'lease' | 'addendum' | 'inspection' | 'receipt' | 'notice' | 'other'
    url?: string
    uploadedAt: number
    uploadedBy: string
  }[]
  
  renewalStatus?: {
    offered: boolean
    offeredAt?: number
    accepted?: boolean
    respondedAt?: number
    newLeaseId?: string
  }
  
  metadata?: {
    templateVersion?: string
    jurisdiction?: string
    governingLaw?: string
  }
}

export interface LeaseTemplate {
  id: string
  name: string
  description: string
  jurisdiction: string
  leaseType: 'fixed-term' | 'month-to-month' | 'periodic'
  rentalTerm: 'short-term' | 'long-term'
  defaultClauses: string[]
  requiredFields: string[]
  isPublic: boolean
  createdBy: string
  createdAt: number
  usageCount: number
}

export interface LeaseRenewal {
  id: string
  originalLeaseId: string
  newLeaseId?: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  offeredAt: number
  respondedAt?: number
  proposedStartDate: number
  proposedEndDate: number
  proposedRent: number
  rentIncrease?: number
  rentIncreasePercentage?: number
  terms: string
  response?: string
}

export interface LeaseNotice {
  id: string
  leaseId: string
  type: 'termination' | 'renewal' | 'rent_increase' | 'violation' | 'maintenance' | 'inspection' | 'other'
  title: string
  description: string
  issuedBy: string
  issuedTo: string
  issuedAt: number
  effectiveDate?: number
  requiresResponse: boolean
  responded?: boolean
  respondedAt?: number
  response?: string
  status: 'pending' | 'acknowledged' | 'resolved' | 'disputed'
}

export interface MaintenanceRequest {
  id: string
  propertyId: string
  propertyTitle: string
  propertyAddress?: string
  tenantId: string
  tenantName: string
  tenantEmail: string
  tenantPhone?: string
  landlordId: string
  landlordName: string
  leaseId?: string
  
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'pest' | 'safety' | 'cosmetic' | 'other'
  title: string
  description: string
  location: string
  
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'scheduled' | 'completed' | 'cancelled'
  
  photos?: string[]
  videos?: string[]
  
  preferredAccessTime?: string
  accessInstructions?: string
  permissionToEnter: boolean
  
  estimatedCost?: number
  actualCost?: number
  
  createdAt: number
  updatedAt: number
  acknowledgedAt?: number
  scheduledDate?: number
  completedAt?: number
  cancelledAt?: number
  
  landlordNotes?: string
  tenantNotes?: string
  
  assignedTo?: {
    id: string
    name: string
    company?: string
    phone?: string
    email?: string
  }
  
  updates: {
    id: string
    timestamp: number
    userId: string
    userName: string
    message: string
    status?: MaintenanceRequest['status']
    photos?: string[]
  }[]
  
  completionNotes?: string
  completionPhotos?: string[]
  tenantApproval?: {
    approved: boolean
    approvedAt: number
    feedback?: string
    rating?: number
  }
}

export interface MaintenanceCategory {
  id: string
  name: string
  icon: string
  description: string
  averageResponseTime: number
  commonIssues: string[]
}

export interface PropertyTour {
  id: string
  propertyId: string
  propertyTitle: string
  propertyAddress: string
  propertyImage?: string
  landlordId: string
  landlordName: string
  landlordEmail?: string
  landlordPhone?: string
  requesterId: string
  requesterName: string
  requesterEmail: string
  requesterPhone?: string
  
  preferredDate: number
  alternativeDates?: number[]
  confirmedDate?: number
  duration: number
  tourType: 'in-person' | 'virtual' | 'self-guided'
  
  status: 'pending' | 'payment_required' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
  
  paymentRequired: boolean
  paymentStatus?: 'not_paid' | 'deposit_paid' | 'full_payment'
  depositAmount?: number
  fullPaymentAmount?: number
  paidAmount?: number
  paymentDate?: number
  paymentMethod?: string
  transactionId?: string
  
  message?: string
  specialRequests?: string
  numberOfAttendees?: number
  
  cancellationReason?: string
  rejectionReason?: string
  
  reminderSent?: boolean
  feedbackSubmitted?: boolean
  feedback?: {
    rating: number
    comment?: string
    submittedAt: number
  }
  
  createdAt: number
  updatedAt: number
  confirmedAt?: number
  completedAt?: number
  cancelledAt?: number
  
  metadata?: {
    checkInCode?: string
    meetingLink?: string
    directions?: string
    parkingInstructions?: string
  }
}

export interface TourAvailability {
  propertyId: string
  landlordId: string
  availableDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
  availableTimeSlots: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
    slots: {
      start: string
      end: string
    }[]
  }[]
  blockedDates: number[]
  minimumNoticeHours: number
  maximumAdvanceDays: number
  tourDuration: number
  allowVirtualTours: boolean
  allowSelfGuided: boolean
  requiresPayment: boolean
  depositAmount?: number
  fullPaymentAmount?: number
}

export interface TourPaymentDetails {
  accountName: string
  accountNumber: string
  bankName: string
  iban?: string
  swiftCode?: string
  paymentInstructions?: string
}

export interface BackgroundCheckRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  requestedBy: string
  requestedByName: string
  propertyId?: string
  propertyTitle?: string
  leaseId?: string
  
  personalInfo: {
    fullName: string
    dateOfBirth: number
    ssn?: string
    governmentId: string
    idType: 'passport' | 'drivers-license' | 'national-id' | 'other'
    currentAddress: string
    previousAddresses?: {
      address: string
      from: number
      to: number
    }[]
  }
  
  employmentInfo: {
    employed: boolean
    employer?: string
    position?: string
    monthlyIncome?: number
    employmentStartDate?: number
    employmentVerificationDoc?: string
  }
  
  consentProvided: boolean
  consentProvidedAt?: number
  
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired'
  
  requestedChecks: {
    criminalRecord: boolean
    creditScore: boolean
    employmentVerification: boolean
    rentalHistory: boolean
    evictionRecords: boolean
    identityVerification: boolean
  }
  
  results?: BackgroundCheckResults
  
  createdAt: number
  updatedAt: number
  completedAt?: number
  expiresAt?: number
  
  cost: number
  paymentStatus: 'unpaid' | 'paid' | 'refunded'
  transactionId?: string
  
  notes?: string
  internalNotes?: string
}

export interface BackgroundCheckResults {
  overallStatus: 'approved' | 'conditional' | 'denied' | 'review-required'
  riskScore: number
  completedAt: number
  
  criminalRecord?: {
    status: 'clear' | 'records-found' | 'not-available'
    details?: string
    recordsFound?: {
      type: string
      date: number
      jurisdiction: string
      disposition: string
    }[]
  }
  
  creditScore?: {
    score: number
    rating: 'excellent' | 'good' | 'fair' | 'poor'
    details: string
    outstandingDebts?: number
    bankruptcies?: number
    collections?: number
    latePayments?: number
  }
  
  employmentVerification?: {
    verified: boolean
    employer: string
    position: string
    monthlyIncome: number
    employmentLength: number
    details: string
  }
  
  rentalHistory?: {
    status: 'good' | 'fair' | 'poor' | 'not-available'
    previousLandlords: {
      name: string
      property: string
      from: number
      to: number
      referenceVerified: boolean
      paymentHistory: 'excellent' | 'good' | 'fair' | 'poor'
      comments?: string
    }[]
    latePayments?: number
    evictions?: number
  }
  
  evictionRecords?: {
    found: boolean
    count: number
    records?: {
      date: number
      location: string
      status: string
      details: string
    }[]
  }
  
  identityVerification?: {
    verified: boolean
    matchScore: number
    documentType: string
    documentVerified: boolean
    addressVerified: boolean
    ssnVerified?: boolean
    details: string
  }
  
  recommendations: string[]
  warnings: string[]
  redFlags: string[]
}

export interface BackgroundCheckProvider {
  id: string
  name: string
  description: string
  supportedChecks: string[]
  averageProcessingTime: number
  cost: number
  accuracy: number
  enabled: boolean
}

export interface BackgroundCheckSettings {
  propertyId?: string
  landlordId: string
  
  requireBackgroundCheck: boolean
  autoRequestOnApplication: boolean
  
  requiredChecks: {
    criminalRecord: boolean
    creditScore: boolean
    employmentVerification: boolean
    rentalHistory: boolean
    evictionRecords: boolean
    identityVerification: boolean
  }
  
  minimumCreditScore?: number
  allowCriminalRecords: boolean
  allowEvictionHistory: boolean
  
  whoPaysFee: 'tenant' | 'landlord' | 'split'
  
  expirationDays: number
  
  autoApprovalRules?: {
    minCreditScore?: number
    maxEvictions: number
    maxCriminalRecords: number
    minRiskScore: number
  }
  
  notifyOnCompletion: boolean
  notifyOnFailure: boolean
}

export interface BackgroundCheckTemplate {
  id: string
  name: string
  description: string
  checkTypes: string[]
  estimatedCost: number
  estimatedTime: number
  recommended: boolean
  popularFor: ('apartments' | 'houses' | 'commercial' | 'all')[]
}

export interface InsurancePlan {
  id: string
  providerId: string
  providerName: string
  providerLogo?: string
  providerRating: number
  
  name: string
  description: string
  category: 'property' | 'tenant' | 'landlord' | 'liability' | 'contents' | 'comprehensive'
  targetAudience: ('landlord' | 'tenant' | 'both')[]
  
  coverage: {
    propertyDamage?: number
    liability?: number
    personalProperty?: number
    lossOfRent?: number
    medicalPayments?: number
    legalFees?: number
    naturalDisasters?: boolean
    theft?: boolean
    fire?: boolean
    water?: boolean
    vandalism?: boolean
    additionalLiving?: number
  }
  
  pricing: {
    basePrice: number
    billingCycle: 'monthly' | 'quarterly' | 'annual'
    currency: string
    discounts?: {
      name: string
      description: string
      percentage: number
      conditions: string[]
    }[]
  }
  
  deductible: number
  deductibleOptions?: number[]
  
  features: string[]
  exclusions: string[]
  
  requirements: {
    minPropertyValue?: number
    maxPropertyValue?: number
    propertyTypes: ('apartment' | 'house' | 'studio' | 'condo')[]
    minTenantAge?: number
    securityRequirements?: string[]
    inspectionRequired: boolean
  }
  
  claimsProcess: {
    averageProcessingTime: number
    onlineClaimSubmission: boolean
    phoneSupport247: boolean
    claimApprovalRate: number
  }
  
  popular: boolean
  recommended: boolean
  featured: boolean
  
  rating: number
  reviewCount: number
  
  tags: string[]
  
  createdAt: number
  updatedAt: number
}

export interface InsuranceProvider {
  id: string
  name: string
  logo?: string
  description: string
  website?: string
  phone?: string
  email?: string
  rating: number
  reviewCount: number
  yearsInBusiness: number
  licensedIn: string[]
  specialties: string[]
  claimSatisfactionRate: number
  financialStrength: string
  accreditations: string[]
}

export interface InsurancePolicy {
  id: string
  policyNumber: string
  planId: string
  planName: string
  providerId: string
  providerName: string
  
  policyHolderId: string
  policyHolderName: string
  policyHolderEmail: string
  policyHolderType: 'landlord' | 'tenant'
  
  propertyId?: string
  propertyTitle?: string
  propertyAddress?: string
  leaseId?: string
  
  coverageDetails: InsurancePlan['coverage']
  
  pricing: {
    premium: number
    billingCycle: 'monthly' | 'quarterly' | 'annual'
    totalAnnualCost: number
    nextPaymentDate: number
    nextPaymentAmount: number
    paymentMethod?: string
    autoRenewal: boolean
  }
  
  deductible: number
  
  effectiveDate: number
  expirationDate: number
  
  status: 'active' | 'pending' | 'expired' | 'cancelled' | 'suspended'
  
  beneficiaries?: {
    name: string
    relationship: string
    percentage: number
  }[]
  
  documents: {
    id: string
    name: string
    type: 'policy' | 'declaration' | 'endorsement' | 'certificate' | 'claim' | 'receipt'
    url?: string
    uploadedAt: number
  }[]
  
  claims: InsuranceClaim[]
  
  paymentHistory: {
    id: string
    date: number
    amount: number
    status: 'paid' | 'pending' | 'failed' | 'refunded'
    transactionId?: string
  }[]
  
  createdAt: number
  updatedAt: number
  cancelledAt?: number
  cancellationReason?: string
  
  metadata?: {
    discountsApplied?: string[]
    specialConditions?: string[]
    inspectionDate?: number
    inspectionResults?: string
  }
}

export interface InsuranceClaim {
  id: string
  claimNumber: string
  policyId: string
  policyNumber: string
  
  claimantId: string
  claimantName: string
  claimantEmail: string
  claimantPhone?: string
  
  propertyId?: string
  propertyAddress?: string
  
  incidentDate: number
  reportedDate: number
  
  claimType: 'property-damage' | 'theft' | 'fire' | 'water' | 'liability' | 'natural-disaster' | 'vandalism' | 'other'
  
  description: string
  location: string
  
  estimatedDamageAmount: number
  claimedAmount: number
  approvedAmount?: number
  paidAmount?: number
  
  status: 'submitted' | 'under-review' | 'investigating' | 'approved' | 'partially-approved' | 'denied' | 'closed' | 'appealed'
  
  priority: 'low' | 'medium' | 'high' | 'urgent'
  
  evidence: {
    photos?: string[]
    videos?: string[]
    policeReport?: string
    witnesses?: {
      name: string
      contact: string
      statement: string
    }[]
    receipts?: string[]
    estimates?: {
      provider: string
      amount: number
      document?: string
    }[]
  }
  
  adjuster?: {
    id: string
    name: string
    email: string
    phone: string
    assignedAt: number
  }
  
  timeline: {
    id: string
    timestamp: number
    action: string
    actor: string
    notes?: string
    status?: InsuranceClaim['status']
  }[]
  
  denialReason?: string
  appealSubmitted?: boolean
  appealDate?: number
  appealNotes?: string
  
  paymentDetails?: {
    method: string
    accountNumber?: string
    scheduledDate?: number
    paidDate?: number
    transactionId?: string
  }
  
  createdAt: number
  updatedAt: number
  closedAt?: number
  
  notes?: string
  internalNotes?: string
}

export interface InsuranceQuote {
  id: string
  planId: string
  planName: string
  providerId: string
  providerName: string
  
  requesterId: string
  requesterName: string
  requesterEmail: string
  requesterType: 'landlord' | 'tenant'
  
  propertyId?: string
  propertyDetails?: {
    address: string
    type: 'apartment' | 'house' | 'studio' | 'condo'
    value: number
    area: number
    age?: number
    securityFeatures?: string[]
  }
  
  coverageRequested: {
    propertyDamage?: number
    liability?: number
    personalProperty?: number
    lossOfRent?: number
    additionalLiving?: number
  }
  
  deductible: number
  
  quotedPremium: {
    monthly: number
    quarterly: number
    annual: number
  }
  
  discountsApplied: {
    name: string
    amount: number
    percentage: number
  }[]
  
  totalAnnualCost: number
  
  validUntil: number
  
  status: 'draft' | 'pending' | 'provided' | 'accepted' | 'declined' | 'expired'
  
  acceptedAt?: number
  declinedAt?: number
  declinedReason?: string
  
  policyId?: string
  
  createdAt: number
  updatedAt: number
  
  notes?: string
  agentNotes?: string
}

export interface InsuranceComparison {
  plans: InsurancePlan[]
  criteria: {
    propertyValue?: number
    coverageNeeded: string[]
    budget: number
    propertyType: 'apartment' | 'house' | 'studio' | 'condo'
    userType: 'landlord' | 'tenant'
  }
  recommendations: {
    planId: string
    score: number
    reasons: string[]
    bestFor: string[]
  }[]
}

export interface InsuranceSettings {
  userId: string
  userType: 'landlord' | 'tenant'
  
  requireTenantInsurance: boolean
  minimumCoverage?: {
    liability?: number
    personalProperty?: number
  }
  
  preferredProviders: string[]
  autoRenewal: boolean
  
  notificationSettings: {
    renewalReminders: boolean
    reminderDaysBefore: number
    paymentReminders: boolean
    claimUpdates: boolean
    policyChanges: boolean
  }
  
  paymentPreference?: {
    method: 'monthly' | 'quarterly' | 'annual'
    autoPayEnabled: boolean
  }
}

export type SmartDeviceType = 
  | 'thermostat' 
  | 'light' 
  | 'lock' 
  | 'camera' 
  | 'doorbell' 
  | 'alarm' 
  | 'blinds' 
  | 'plug' 
  | 'speaker' 
  | 'sensor'
  | 'air-quality'
  | 'garage'
  | 'appliance'

export type SmartDeviceStatus = 'online' | 'offline' | 'error' | 'updating'

export interface SmartDevice {
  id: string
  propertyId: string
  name: string
  type: SmartDeviceType
  brand: string
  model?: string
  location: string
  status: SmartDeviceStatus
  
  battery?: number
  firmwareVersion?: string
  lastUpdated: number
  installedAt: number
  
  capabilities: {
    onOff?: boolean
    dimming?: boolean
    colorControl?: boolean
    temperature?: boolean
    humidity?: boolean
    motion?: boolean
    camera?: boolean
    lock?: boolean
    scheduling?: boolean
    energyMonitoring?: boolean
  }
  
  state: {
    power?: boolean
    brightness?: number
    color?: string
    temperature?: number
    targetTemperature?: number
    humidity?: number
    locked?: boolean
    mode?: string
    volume?: number
    schedule?: boolean
    energyUsage?: number
    [key: string]: any
  }
  
  settings?: {
    autoLock?: boolean
    autoLockDelay?: number
    motionSensitivity?: 'low' | 'medium' | 'high'
    nightMode?: boolean
    notifications?: boolean
    scheduleEnabled?: boolean
  }
  
  metadata?: {
    serialNumber?: string
    macAddress?: string
    ipAddress?: string
    wifiSignal?: number
    manufacturer?: string
  }
}

export interface SmartDeviceGroup {
  id: string
  propertyId: string
  name: string
  icon?: string
  devices: string[]
  createdAt: number
}

export interface SmartDeviceScene {
  id: string
  propertyId: string
  name: string
  description?: string
  icon?: string
  actions: {
    deviceId: string
    deviceName: string
    action: string
    value: any
  }[]
  active: boolean
  createdBy: string
  createdAt: number
  lastActivated?: number
}

export interface SmartDeviceAutomation {
  id: string
  propertyId: string
  name: string
  description?: string
  enabled: boolean
  
  trigger: {
    type: 'schedule' | 'device' | 'condition' | 'manual'
    deviceId?: string
    condition?: {
      property: string
      operator: '=' | '!=' | '>' | '<' | '>=' | '<='
      value: any
    }
    schedule?: {
      time?: string
      days?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[]
      sunrise?: boolean
      sunset?: boolean
    }
  }
  
  actions: {
    deviceId: string
    deviceName: string
    action: string
    value: any
    delay?: number
  }[]
  
  createdBy: string
  createdAt: number
  updatedAt: number
  lastTriggered?: number
  timesTriggered: number
}

export interface SmartHomeSettings {
  propertyId: string
  landlordId: string
  
  guestAccessEnabled: boolean
  guestAccessDevices: string[]
  guestAccessSchedule?: {
    start?: string
    end?: string
  }
  
  tenantControlEnabled: boolean
  tenantControlDevices: string[]
  tenantRestrictedDevices: string[]
  
  energyMonitoringEnabled: boolean
  energyAlerts: boolean
  energyThreshold?: number
  
  securityAlertsEnabled: boolean
  securityNotificationEmails: string[]
  securityNotificationPhones: string[]
  
  autoAwayMode: boolean
  autoAwayDelay?: number
  
  voiceControlEnabled: boolean
  voiceAssistant?: 'alexa' | 'google' | 'siri' | 'none'
  
  dataRetentionDays: number
  shareDataWithTenant: boolean
}

export interface SmartDeviceActivity {
  id: string
  deviceId: string
  deviceName: string
  propertyId: string
  action: string
  previousState?: any
  newState?: any
  triggeredBy: 'user' | 'automation' | 'schedule' | 'system'
  userId?: string
  userName?: string
  timestamp: number
  location?: string
}

export interface SmartHomeEnergyData {
  propertyId: string
  deviceId?: string
  date: number
  consumption: number
  cost?: number
  breakdown?: {
    heating: number
    cooling: number
    lighting: number
    appliances: number
    other: number
  }
}

export interface SmartHomeSecurityEvent {
  id: string
  propertyId: string
  type: 'motion' | 'door-open' | 'door-closed' | 'lock' | 'unlock' | 'alarm' | 'camera-triggered' | 'window-open'
  deviceId: string
  deviceName: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  timestamp: number
  resolved: boolean
  resolvedAt?: number
  snapshot?: string
  video?: string
  location?: string
}

export type ARObjectType = 
  | 'furniture'
  | 'appliance'
  | 'decoration'
  | 'lighting'
  | 'plant'
  | 'electronics'
  | 'measurement'

export interface ARObject {
  id: string
  name: string
  type: ARObjectType
  category: string
  modelUrl?: string
  thumbnailUrl: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  color?: string
  style?: string
  price?: number
  brand?: string
  description?: string
}

export interface ARPlacedObject {
  id: string
  objectId: string
  object: ARObject
  position: {
    x: number
    y: number
    z: number
  }
  rotation: {
    x: number
    y: number
    z: number
  }
  scale: {
    x: number
    y: number
    z: number
  }
  placedAt: number
}

export interface ARSession {
  id: string
  propertyId: string
  propertyTitle: string
  userId?: string
  userName?: string
  roomName?: string
  placedObjects: ARPlacedObject[]
  screenshots: string[]
  duration: number
  startedAt: number
  endedAt?: number
  savedAt?: number
  shared: boolean
  shareLink?: string
}

export interface ARRoom {
  id: string
  propertyId: string
  name: string
  type: 'living-room' | 'bedroom' | 'kitchen' | 'bathroom' | 'dining-room' | 'office' | 'other'
  dimensions: {
    width: number
    height: number
    depth: number
  }
  floorPlan?: string
  panoramaImage?: string
  arEnabled: boolean
  createdAt: number
}

export interface ARTourSettings {
  propertyId: string
  landlordId: string
  arEnabled: boolean
  allowFurniturePlacement: boolean
  allowMeasurements: boolean
  allowScreenshots: boolean
  allowSharing: boolean
  presetScenes: {
    id: string
    name: string
    description: string
    thumbnail: string
    objects: ARPlacedObject[]
  }[]
  guidedTour: boolean
  guidedSteps?: {
    roomId: string
    instruction: string
    duration: number
    highlightObjects?: string[]
  }[]
  analyticsEnabled: boolean
}

export interface ARMeasurement {
  id: string
  sessionId: string
  type: 'distance' | 'area' | 'height' | 'volume'
  startPoint: { x: number; y: number; z: number }
  endPoint?: { x: number; y: number; z: number }
  value: number
  unit: 'cm' | 'm' | 'ft' | 'in'
  label?: string
  timestamp: number
}

export interface ARAnalytics {
  propertyId: string
  totalSessions: number
  totalDuration: number
  averageSessionDuration: number
  totalObjectsPlaced: number
  mostPlacedObjects: {
    objectId: string
    objectName: string
    count: number
  }[]
  popularRooms: {
    roomId: string
    roomName: string
    visits: number
  }[]
  conversionRate: number
  sessionsWithBooking: number
  screenshots: number
  sharedSessions: number
  deviceTypes: {
    mobile: number
    tablet: number
    desktop: number
  }
  lastUpdated: number
}
