import { Property, Booking, User, MaintenanceRequest } from './types'

export interface SMSSettings {
  apiKey: string
  apiSecret: string
  senderId: string
  enabled: boolean
}

export interface SMSNotificationPreferences {
  urgentBooking: boolean
  bookingConfirmation: boolean
  urgentMaintenance: boolean
  checkInReminder: boolean
  checkOutReminder: boolean
  paymentDue: boolean
}

export interface SMSTemplate {
  message: string
}

async function getSMSSettings(): Promise<SMSSettings | null> {
  try {
    const settings = await window.spark.kv.get<SMSSettings>('sms-settings')
    return settings || null
  } catch (error) {
    console.error('Failed to get SMS settings:', error)
    return null
  }
}

async function getSMSPreferences(userId: string): Promise<SMSNotificationPreferences> {
  try {
    const prefs = await window.spark.kv.get<SMSNotificationPreferences>(`sms-prefs-${userId}`)
    return prefs || {
      urgentBooking: true,
      bookingConfirmation: true,
      urgentMaintenance: true,
      checkInReminder: true,
      checkOutReminder: true,
      paymentDue: true
    }
  } catch (error) {
    console.error('Failed to get SMS preferences:', error)
    return {
      urgentBooking: true,
      bookingConfirmation: true,
      urgentMaintenance: true,
      checkInReminder: true,
      checkOutReminder: true,
      paymentDue: true
    }
  }
}

export async function updateSMSPreferences(userId: string, preferences: Partial<SMSNotificationPreferences>): Promise<void> {
  try {
    const currentPrefs = await getSMSPreferences(userId)
    await window.spark.kv.set(`sms-prefs-${userId}`, { ...currentPrefs, ...preferences })
  } catch (error) {
    console.error('Failed to update SMS preferences:', error)
  }
}

function generateSMSTemplate(
  type: keyof SMSNotificationPreferences,
  data: any
): SMSTemplate {
  const templates: Record<keyof SMSNotificationPreferences, (data: any) => SMSTemplate> = {
    urgentBooking: (data: { booking: Booking; property: Property; landlord: User }) => ({
      message: `🚨 URGENT: New booking for ${data.property.title}! Guest: ${data.booking.customerName}. Check-in: ${data.booking.checkIn ? new Date(data.booking.checkIn).toLocaleDateString() : 'TBD'}. Total: €${data.booking.totalPrice}. Please confirm ASAP! - RentHub`
    }),

    bookingConfirmation: (data: { booking: Booking; property: Property; user: User }) => ({
      message: `✅ Booking confirmed! ${data.property.title}, ${data.property.location}. ${data.booking.checkIn ? `Check-in: ${new Date(data.booking.checkIn).toLocaleDateString()}` : ''}. Booking ID: ${data.booking.id}. - RentHub`
    }),

    urgentMaintenance: (data: { request: MaintenanceRequest; property: Property; landlord: User }) => ({
      message: `🔧 URGENT MAINTENANCE: ${data.property.title} - ${data.request.category} (Priority: ${data.request.priority.toUpperCase()}). ${data.request.description.substring(0, 50)}... Please address immediately! - RentHub`
    }),

    checkInReminder: (data: { booking: Booking; property: Property; user: User; hoursUntilCheckIn: number }) => ({
      message: `📍 Check-in reminder: ${data.property.title} in ${data.hoursUntilCheckIn} hours! Address: ${data.property.location}. Contact: ${data.property.landlord?.phone || data.property.ownerPhone || 'TBD'}. Have a great stay! - RentHub`
    }),

    checkOutReminder: (data: { booking: Booking; property: Property; user: User; hoursUntilCheckOut: number }) => ({
      message: `📦 Check-out reminder: ${data.property.title} in ${data.hoursUntilCheckOut} hours. Please ensure property is tidy and keys are returned. Thank you for staying with us! - RentHub`
    }),

    paymentDue: (data: { booking: Booking; property: Property; user: User; amountDue: number; daysUntilDue: number }) => ({
      message: `💳 Payment reminder: €${data.amountDue} due in ${data.daysUntilDue} days for ${data.property.title}. Please make payment to avoid late fees. Booking ID: ${data.booking.id}. - RentHub`
    })
  }

  const templateFn = templates[type]
  return templateFn ? templateFn(data) : {
    message: 'You have a new notification from RentHub.'
  }
}

function isPhoneNumberValid(phone: string): boolean {
  const cleanPhone = phone.replace(/\D/g, '')
  return cleanPhone.length >= 10 && cleanPhone.length <= 15
}

async function sendSMSViaAPI(
  to: string,
  message: string,
  settings: SMSSettings
): Promise<boolean> {
  try {
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${settings.apiKey}:${settings.apiSecret}`)}`
      },
      body: new URLSearchParams({
        To: to,
        From: settings.senderId,
        Body: message
      })
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send SMS via API:', error)
    return false
  }
}

export async function sendSMS(
  recipientPhone: string,
  recipientUserId: string,
  type: keyof SMSNotificationPreferences,
  data: any
): Promise<boolean> {
  try {
    if (!isPhoneNumberValid(recipientPhone)) {
      console.log('Invalid phone number format')
      return false
    }

    const settings = await getSMSSettings()
    if (!settings || !settings.enabled) {
      console.log('SMS service is disabled or not configured')
      return false
    }

    const preferences = await getSMSPreferences(recipientUserId)
    if (!preferences[type]) {
      console.log(`User has disabled ${type} SMS notifications`)
      return false
    }

    const template = generateSMSTemplate(type, data)
    
    const success = await sendSMSViaAPI(recipientPhone, template.message, settings)
    
    const smsLog = {
      id: `sms-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      to: recipientPhone,
      type,
      message: template.message,
      status: success ? ('sent' as const) : ('failed' as const),
      sentAt: Date.now(),
      error: success ? null : 'Failed to send SMS'
    }

    const logs = await window.spark.kv.get<typeof smsLog[]>('sms-logs') || []
    await window.spark.kv.set('sms-logs', [smsLog, ...logs].slice(0, 100))

    return success
  } catch (error) {
    console.error('Failed to send SMS:', error)
    return false
  }
}

function isUrgentBooking(booking: Booking): boolean {
  if (!booking.checkIn) return false
  
  const checkInDate = new Date(booking.checkIn)
  const now = new Date()
  const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  return hoursUntilCheckIn <= 24 && hoursUntilCheckIn > 0
}

export async function sendUrgentBookingSMS(
  booking: Booking,
  property: Property,
  landlord: User
): Promise<void> {
  if (isUrgentBooking(booking) && landlord.phone) {
    await sendSMS(landlord.phone, landlord.id, 'urgentBooking', { booking, property, landlord })
  }
}

export async function sendNewBookingSMS(
  booking: Booking,
  property: Property,
  landlord: User
): Promise<void> {
  if (landlord.phone) {
    if (isUrgentBooking(booking)) {
      await sendSMS(landlord.phone, landlord.id, 'urgentBooking', { booking, property, landlord })
    }
  }
}

export async function sendBookingConfirmationSMS(
  booking: Booking,
  property: Property,
  user: User
): Promise<void> {
  if (user.phone) {
    await sendSMS(user.phone, user.id, 'bookingConfirmation', { booking, property, user })
  }
}

export async function sendUrgentMaintenanceSMS(
  request: MaintenanceRequest,
  property: Property,
  landlord: User
): Promise<void> {
  if (request.priority === 'high' && landlord.phone) {
    await sendSMS(landlord.phone, landlord.id, 'urgentMaintenance', { request, property, landlord })
  }
}

export async function sendCheckInReminderSMS(
  booking: Booking,
  property: Property,
  user: User
): Promise<void> {
  if (!user.phone || !booking.checkIn) return
  
  const checkInDate = new Date(booking.checkIn)
  const now = new Date()
  const hoursUntilCheckIn = Math.round((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60))
  
  if (hoursUntilCheckIn > 0 && hoursUntilCheckIn <= 24) {
    await sendSMS(user.phone, user.id, 'checkInReminder', { booking, property, user, hoursUntilCheckIn })
  }
}

export async function sendCheckOutReminderSMS(
  booking: Booking,
  property: Property,
  user: User
): Promise<void> {
  if (!user.phone || !booking.checkOut) return
  
  const checkOutDate = new Date(booking.checkOut)
  const now = new Date()
  const hoursUntilCheckOut = Math.round((checkOutDate.getTime() - now.getTime()) / (1000 * 60 * 60))
  
  if (hoursUntilCheckOut > 0 && hoursUntilCheckOut <= 24) {
    await sendSMS(user.phone, user.id, 'checkOutReminder', { booking, property, user, hoursUntilCheckOut })
  }
}

export async function sendPaymentDueSMS(
  booking: Booking,
  property: Property,
  user: User,
  amountDue: number,
  dueDate: Date
): Promise<void> {
  if (!user.phone) return
  
  const now = new Date()
  const daysUntilDue = Math.round((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilDue >= 0 && daysUntilDue <= 3) {
    await sendSMS(user.phone, user.id, 'paymentDue', { booking, property, user, amountDue, daysUntilDue })
  }
}

export async function scheduleCheckInCheckOutReminders(
  booking: Booking,
  property: Property,
  user: User
): Promise<void> {
  if (!booking.checkIn || !booking.checkOut) return
  
  const now = new Date()
  const checkInDate = new Date(booking.checkIn)
  const checkOutDate = new Date(booking.checkOut)
  
  const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  const hoursUntilCheckOut = (checkOutDate.getTime() - now.getTime()) / (1000 * 60 * 60)
  
  if (hoursUntilCheckIn > 0 && hoursUntilCheckIn <= 24) {
    await sendCheckInReminderSMS(booking, property, user)
  }
  
  if (hoursUntilCheckOut > 0 && hoursUntilCheckOut <= 24) {
    await sendCheckOutReminderSMS(booking, property, user)
  }
}
