import { Voucher, VoucherValidation, Property, User, Booking } from './types'

export function generateVoucherCode(prefix: string = 'RENT'): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export function validateVoucher(
  voucher: Voucher | undefined,
  property: Property,
  user: User | null,
  bookingDetails: {
    price: number
    rentalTerm: 'short-term' | 'long-term'
    durationDays?: number
    durationMonths?: number
  }
): VoucherValidation {
  if (!voucher) {
    return {
      valid: false,
      message: 'Voucher not found'
    }
  }

  if (!voucher.active) {
    return {
      valid: false,
      message: 'This voucher is no longer active'
    }
  }

  const now = Date.now()
  if (now < voucher.validFrom) {
    return {
      valid: false,
      message: 'This voucher is not valid yet'
    }
  }

  if (now > voucher.validUntil) {
    return {
      valid: false,
      message: 'This voucher has expired'
    }
  }

  if (voucher.currentUses >= voucher.maxUses) {
    return {
      valid: false,
      message: 'This voucher has reached its maximum usage limit'
    }
  }

  if (user && voucher.maxUsesPerUser) {
    const userUsageCount = (voucher.usedBy || []).filter(id => id === user.id).length
    if (userUsageCount >= voucher.maxUsesPerUser) {
      return {
        valid: false,
        message: 'You have already used this voucher the maximum number of times'
      }
    }
  }

  if (voucher.propertyId && voucher.propertyId !== property.id) {
    return {
      valid: false,
      message: 'This voucher is not valid for this property'
    }
  }

  if (voucher.rentalTermRestriction && voucher.rentalTermRestriction !== bookingDetails.rentalTerm) {
    return {
      valid: false,
      message: `This voucher is only valid for ${voucher.rentalTermRestriction} rentals`
    }
  }

  if (voucher.propertyTypeRestriction && !voucher.propertyTypeRestriction.includes(property.type)) {
    return {
      valid: false,
      message: `This voucher is not valid for ${property.type}s`
    }
  }

  if (voucher.minBookingValue && bookingDetails.price < voucher.minBookingValue) {
    return {
      valid: false,
      message: `Minimum booking value of $${voucher.minBookingValue} required`
    }
  }

  if (voucher.minBookingDays && bookingDetails.durationDays && bookingDetails.durationDays < voucher.minBookingDays) {
    return {
      valid: false,
      message: `Minimum booking duration of ${voucher.minBookingDays} days required`
    }
  }

  if (voucher.minBookingMonths && bookingDetails.durationMonths && bookingDetails.durationMonths < voucher.minBookingMonths) {
    return {
      valid: false,
      message: `Minimum booking duration of ${voucher.minBookingMonths} months required`
    }
  }

  const { discountAmount, finalPrice } = calculateDiscount(voucher, bookingDetails.price)

  return {
    valid: true,
    message: 'Voucher applied successfully',
    voucher,
    discountAmount,
    finalPrice
  }
}

export function calculateDiscount(voucher: Voucher, originalPrice: number): { discountAmount: number; finalPrice: number } {
  let discountAmount = 0

  switch (voucher.type) {
    case 'percentage':
      discountAmount = (originalPrice * voucher.value) / 100
      break
    case 'fixed':
      discountAmount = Math.min(voucher.value, originalPrice)
      break
    case 'free-nights':
      break
    default:
      discountAmount = 0
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount)

  return { discountAmount, finalPrice }
}

export function getVoucherBadgeColor(category: Voucher['category']): string {
  switch (category) {
    case 'early-bird':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'long-stay':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'first-booking':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'referral':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    case 'seasonal':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
    case 'loyalty':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
    case 'custom':
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

export function formatVoucherValue(voucher: Voucher): string {
  switch (voucher.type) {
    case 'percentage':
      return `${voucher.value}% OFF`
    case 'fixed':
      return `$${voucher.value} OFF`
    case 'free-nights':
      return `${voucher.value} FREE NIGHT${voucher.value > 1 ? 'S' : ''}`
    default:
      return 'DISCOUNT'
  }
}

export function getEligibleVouchers(
  vouchers: Voucher[],
  property: Property,
  user: User | null,
  bookingDetails: {
    price: number
    rentalTerm: 'short-term' | 'long-term'
    durationDays?: number
    durationMonths?: number
  }
): Voucher[] {
  return vouchers
    .filter(voucher => {
      const validation = validateVoucher(voucher, property, user, bookingDetails)
      return validation.valid
    })
    .sort((a, b) => {
      const discountA = calculateDiscount(a, bookingDetails.price).discountAmount
      const discountB = calculateDiscount(b, bookingDetails.price).discountAmount
      return discountB - discountA
    })
}

export function getAutoApplyVouchers(
  vouchers: Voucher[],
  property: Property,
  user: User | null,
  bookingDetails: {
    price: number
    rentalTerm: 'short-term' | 'long-term'
    durationDays?: number
    durationMonths?: number
  }
): Voucher | null {
  const eligibleVouchers = getEligibleVouchers(vouchers, property, user, bookingDetails).filter(v => v.autoApply)
  
  if (eligibleVouchers.length === 0) return null
  
  return eligibleVouchers.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0]
}
