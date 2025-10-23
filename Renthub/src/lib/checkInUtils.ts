import { Booking, Property } from './types'

export function generateAccessCode(length: number = 6): string {
  const digits = '0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)]
  }
  return code
}

export function generateCheckInAccessCode(booking: Booking, property: Property): string {
  if (!property.lockbox?.enabled) {
    throw new Error('Self check-in not available for this property')
  }

  if (property.lockbox.type === 'smart_lock') {
    return generateAccessCode(8)
  } else if (property.lockbox.type === 'keypad') {
    return generateAccessCode(4)
  } else if (property.lockbox.type === 'key_lockbox') {
    return generateAccessCode(4)
  } else if (property.lockbox.type === 'combination_lock') {
    return generateAccessCode(4)
  }
  
  return generateAccessCode(6)
}

export function getAccessCodeExpiryTime(booking: Booking, property: Property): number {
  const checkOutTime = booking.checkOut || Date.now() + (30 * 24 * 60 * 60 * 1000)
  const buffer = 24 * 60 * 60 * 1000
  return checkOutTime + buffer
}

export function isAccessCodeValid(booking: Booking): boolean {
  if (!booking.checkInInfo?.accessCode) return false
  if (!booking.checkInInfo?.accessCodeGeneratedAt) return false
  
  const now = Date.now()
  const checkInTime = booking.checkIn || 0
  const checkOutTime = booking.checkOut || (now + 30 * 24 * 60 * 60 * 1000)
  const buffer = 24 * 60 * 60 * 1000
  
  const validFrom = checkInTime - buffer
  const validUntil = checkOutTime + buffer
  
  return now >= validFrom && now <= validUntil
}

export function canGenerateAccessCode(booking: Booking): boolean {
  const now = Date.now()
  const checkInTime = booking.checkIn || 0
  const advanceWindow = 48 * 60 * 60 * 1000
  
  return now >= (checkInTime - advanceWindow)
}

export function getCheckInInstructions(property: Property, accessCode: string): string {
  const lockbox = property.lockbox
  if (!lockbox || !lockbox.enabled) return ''

  let instructions = `Welcome to ${property.title}!\n\n`
  instructions += `📍 Location: ${property.location}\n\n`
  
  if (lockbox.type === 'smart_lock') {
    instructions += `🔐 Smart Lock Access\n`
    instructions += `Your access code: ${accessCode}\n`
    instructions += `• Enter the code on the smart lock keypad\n`
    instructions += `• Press # to confirm\n`
    instructions += `• The door will unlock automatically\n\n`
  } else if (lockbox.type === 'keypad') {
    instructions += `🔢 Keypad Entry\n`
    instructions += `Your access code: ${accessCode}\n`
    instructions += `• Enter the code on the keypad\n`
    instructions += `• Press * to unlock\n\n`
  } else if (lockbox.type === 'key_lockbox') {
    instructions += `🔑 Key Lockbox\n`
    instructions += `Lockbox code: ${accessCode}\n`
    instructions += `• Find the lockbox at: ${lockbox.location || 'main entrance'}\n`
    instructions += `• Enter the code to open the lockbox\n`
    instructions += `• Retrieve the key and lock the property\n`
    instructions += `• Return the key to the lockbox when you leave\n\n`
  } else if (lockbox.type === 'combination_lock') {
    instructions += `🔒 Combination Lock\n`
    instructions += `Combination: ${accessCode}\n`
    instructions += `• Find the lock at: ${lockbox.location || 'main door'}\n`
    instructions += `• Align the numbers to match the code\n\n`
  }

  if (lockbox.instructions) {
    instructions += `📋 Additional Instructions:\n${lockbox.instructions}\n\n`
  }

  if (lockbox.wifiName && lockbox.wifiPassword) {
    instructions += `📶 WiFi Information:\n`
    instructions += `Network: ${lockbox.wifiName}\n`
    instructions += `Password: ${lockbox.wifiPassword}\n\n`
  }

  if (lockbox.parkingInstructions) {
    instructions += `🚗 Parking:\n${lockbox.parkingInstructions}\n\n`
  }

  if (lockbox.emergencyContact) {
    instructions += `🆘 Emergency Contact:\n${lockbox.emergencyContact}\n`
  }

  return instructions
}

export function getLockboxTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'smart_lock': 'Smart Lock',
    'keypad': 'Keypad Entry',
    'key_lockbox': 'Key Lockbox',
    'combination_lock': 'Combination Lock'
  }
  return labels[type] || type
}

export function getLockboxTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    'smart_lock': '🔐',
    'keypad': '🔢',
    'key_lockbox': '🔑',
    'combination_lock': '🔒'
  }
  return icons[type] || '🔐'
}

export function simulateCheckIn(booking: Booking, accessCode: string): boolean {
  if (!booking.checkInInfo?.accessCode) return false
  return booking.checkInInfo.accessCode === accessCode
}

export function simulateCheckOut(booking: Booking): boolean {
  return booking.status === 'confirmed' && !!booking.checkInInfo?.checkInCompletedAt
}
