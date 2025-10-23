import { Property, Booking, Review, User, Conversation, LeaseAgreement, MaintenanceRequest } from './types'

export interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  fromEmail: string
  fromName: string
  enabled: boolean
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailNotificationPreferences {
  newBooking: boolean
  bookingConfirmation: boolean
  bookingCancellation: boolean
  newMessage: boolean
  newReview: boolean
  priceAlert: boolean
  propertyUpdate: boolean
  maintenanceRequest: boolean
  leaseSigningReminder: boolean
  paymentReminder: boolean
}

async function getEmailSettings(): Promise<EmailSettings | null> {
  try {
    // Email settings now stored in localStorage (Spark removed)
    const stored = localStorage.getItem('email-settings')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Failed to get email settings:', error)
    return null
  }
}

async function getEmailPreferences(userId: string): Promise<EmailNotificationPreferences> {
  try {
    // Email preferences now stored in localStorage (Spark removed)
    const stored = localStorage.getItem(`email-prefs-${userId}`)
    const prefs = stored ? JSON.parse(stored) : null
    return prefs || {
      newBooking: true,
      bookingConfirmation: true,
      bookingCancellation: true,
      newMessage: true,
      newReview: true,
      priceAlert: true,
      propertyUpdate: true,
      maintenanceRequest: true,
      leaseSigningReminder: true,
      paymentReminder: true
    }
  } catch (error) {
    console.error('Failed to get email preferences:', error)
    return {
      newBooking: true,
      bookingConfirmation: true,
      bookingCancellation: true,
      newMessage: true,
      newReview: true,
      priceAlert: true,
      propertyUpdate: true,
      maintenanceRequest: true,
      leaseSigningReminder: true,
      paymentReminder: true
    }
  }
}

export async function updateEmailPreferences(userId: string, preferences: Partial<EmailNotificationPreferences>): Promise<void> {
  try {
    const currentPrefs = await getEmailPreferences(userId)
    // Store in localStorage (Spark removed)
    localStorage.setItem(`email-prefs-${userId}`, JSON.stringify({ ...currentPrefs, ...preferences }))
  } catch (error) {
    console.error('Failed to update email preferences:', error)
  }
}

function generateEmailTemplate(
  type: keyof EmailNotificationPreferences,
  data: any
): EmailTemplate {
  const templates: Record<keyof EmailNotificationPreferences, (data: any) => EmailTemplate> = {
    newBooking: (data: { booking: Booking; property: Property; landlord: User }) => ({
      subject: `New Booking Request for ${data.property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .booking-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .label { font-weight: 600; color: #6b7280; }
            .value { color: #111827; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 New Booking Request!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.landlord.login},</p>
              <p>You have received a new booking request for your property.</p>
              
              <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <span class="label">Property:</span>
                  <span class="value">${data.property.title}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Guest:</span>
                  <span class="value">${data.booking.customerName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value">${data.booking.customerEmail}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <span class="value">${data.booking.customerPhone}</span>
                </div>
                ${data.booking.checkIn ? `
                <div class="detail-row">
                  <span class="label">Check-in:</span>
                  <span class="value">${new Date(data.booking.checkIn).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Check-out:</span>
                  <span class="value">${new Date(data.booking.checkOut!).toLocaleDateString()}</span>
                </div>
                ` : ''}
                ${data.booking.durationMonths ? `
                <div class="detail-row">
                  <span class="label">Duration:</span>
                  <span class="value">${data.booking.durationMonths} months</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span class="label">Total Price:</span>
                  <span class="value">€${data.booking.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <p>Please review and respond to this booking request as soon as possible.</p>
              
              <a href="#" class="button">View Booking Details</a>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Booking Request for ${data.property.title}\n\nHi ${data.landlord.login},\n\nYou have received a new booking request.\n\nGuest: ${data.booking.customerName}\nEmail: ${data.booking.customerEmail}\nPhone: ${data.booking.customerPhone}\nTotal: €${data.booking.totalPrice}\n\nPlease review and respond as soon as possible.`
    }),

    bookingConfirmation: (data: { booking: Booking; property: Property; user: User }) => ({
      subject: `Booking Confirmed - ${data.property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .booking-details { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #d1fae5; }
            .label { font-weight: 600; color: #065f46; }
            .value { color: #111827; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.user.login},</p>
              <p>Your booking has been confirmed! We're excited to host you.</p>
              
              <div class="booking-details">
                <h3>Booking Confirmation</h3>
                <div class="detail-row">
                  <span class="label">Property:</span>
                  <span class="value">${data.property.title}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Location:</span>
                  <span class="value">${data.property.location}</span>
                </div>
                ${data.booking.checkIn ? `
                <div class="detail-row">
                  <span class="label">Check-in:</span>
                  <span class="value">${new Date(data.booking.checkIn).toLocaleDateString()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Check-out:</span>
                  <span class="value">${new Date(data.booking.checkOut!).toLocaleDateString()}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span class="label">Booking ID:</span>
                  <span class="value">${data.booking.id}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Price:</span>
                  <span class="value">€${data.booking.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <p>The property owner will contact you shortly with further details.</p>
              
              <a href="#" class="button">View Booking</a>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
              <p>Need help? Contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Booking Confirmed - ${data.property.title}\n\nHi ${data.user.login},\n\nYour booking has been confirmed!\n\nProperty: ${data.property.title}\nLocation: ${data.property.location}\nBooking ID: ${data.booking.id}\nTotal: €${data.booking.totalPrice}\n\nThe property owner will contact you shortly.`
    }),

    bookingCancellation: (data: { booking: Booking; property: Property; user: User }) => ({
      subject: `Booking Cancelled - ${data.property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Cancelled</h1>
            </div>
            <div class="content">
              <p>Hi ${data.user.login},</p>
              <p>Your booking for <strong>${data.property.title}</strong> has been cancelled.</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Booking Cancelled - ${data.property.title}\n\nHi ${data.user.login},\n\nYour booking has been cancelled.\n\nIf you have any questions, please contact support.`
    }),

    newMessage: (data: { conversation: Conversation; senderName: string; message: string; recipientName: string }) => ({
      subject: `New Message from ${data.senderName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .message-box { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 New Message</h1>
            </div>
            <div class="content">
              <p>Hi ${data.recipientName},</p>
              <p>You have received a new message from <strong>${data.senderName}</strong> regarding <strong>${data.conversation.propertyTitle}</strong>.</p>
              
              <div class="message-box">
                <p>${data.message}</p>
              </div>
              
              <a href="#" class="button">Reply to Message</a>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Message from ${data.senderName}\n\nHi ${data.recipientName},\n\nYou have a new message regarding ${data.conversation.propertyTitle}:\n\n"${data.message}"\n\nLog in to reply.`
    }),

    newReview: (data: { review: Review; property: Property; landlord: User }) => ({
      subject: `New Review for ${data.property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .review-box { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
            .rating { color: #f59e0b; font-size: 24px; margin: 10px 0; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⭐ New Review!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.landlord.login},</p>
              <p>You have received a new review for <strong>${data.property.title}</strong>.</p>
              
              <div class="review-box">
                <div class="rating">${'⭐'.repeat(data.review.rating)}</div>
                <p><strong>${data.review.userName}</strong> said:</p>
                <p>"${data.review.comment}"</p>
              </div>
              
              <p>You can respond to this review to engage with your guests.</p>
              
              <a href="#" class="button">View & Respond</a>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Review for ${data.property.title}\n\nHi ${data.landlord.login},\n\nYou have a new review:\n\nRating: ${data.review.rating}/5 stars\nFrom: ${data.review.userName}\n\n"${data.review.comment}"\n\nLog in to respond.`
    }),

    priceAlert: (data: { property: Property; oldPrice: number; newPrice: number; user: User }) => ({
      subject: `Price Drop Alert - ${data.property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .price-box { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .old-price { text-decoration: line-through; color: #6b7280; font-size: 18px; }
            .new-price { color: #10b981; font-size: 32px; font-weight: bold; margin: 10px 0; }
            .savings { color: #059669; font-weight: 600; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Price Drop Alert!</h1>
            </div>
            <div class="content">
              <p>Hi ${data.user.login},</p>
              <p>Great news! The price for <strong>${data.property.title}</strong> has dropped!</p>
              
              <div class="price-box">
                <div class="old-price">€${data.oldPrice.toLocaleString()}</div>
                <div class="new-price">€${data.newPrice.toLocaleString()}</div>
                <div class="savings">Save €${(data.oldPrice - data.newPrice).toLocaleString()}!</div>
              </div>
              
              <p>Don't miss this opportunity to book at a better price!</p>
              
              <a href="#" class="button">View Property</a>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Price Drop Alert - ${data.property.title}\n\nHi ${data.user.login},\n\nThe price has dropped!\n\nOld: €${data.oldPrice}\nNew: €${data.newPrice}\nSavings: €${data.oldPrice - data.newPrice}\n\nView the property now!`
    }),

    propertyUpdate: (data: { property: Property; updateMessage: string; user: User }) => ({
      subject: `Property Update - ${data.property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Property Update</h1>
            </div>
            <div class="content">
              <p>Hi ${data.user.login},</p>
              <p>There's an update for <strong>${data.property.title}</strong>:</p>
              <p>${data.updateMessage}</p>
              <a href="#" class="button">View Property</a>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Property Update - ${data.property.title}\n\nHi ${data.user.login},\n\n${data.updateMessage}`
    }),

    maintenanceRequest: (data: { request: MaintenanceRequest; property: Property; landlord: User }) => ({
      subject: `New Maintenance Request - ${data.property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: 600; margin: 10px 0; }
            .priority-high { background: #fecaca; color: #991b1b; }
            .priority-medium { background: #fed7aa; color: #9a3412; }
            .priority-low { background: #fef3c7; color: #92400e; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔧 Maintenance Request</h1>
            </div>
            <div class="content">
              <p>Hi ${data.landlord.login},</p>
              <p>A new maintenance request has been submitted for <strong>${data.property.title}</strong>.</p>
              <p><strong>Category:</strong> ${data.request.category}</p>
              <p><strong>Priority:</strong> <span class="priority priority-${data.request.priority}">${data.request.priority.toUpperCase()}</span></p>
              <p><strong>Description:</strong></p>
              <p>${data.request.description}</p>
              <a href="#" class="button">View Request</a>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `New Maintenance Request - ${data.property.title}\n\nHi ${data.landlord.login},\n\nCategory: ${data.request.category}\nPriority: ${data.request.priority}\n\nDescription: ${data.request.description}\n\nPlease review and take action.`
    }),

    leaseSigningReminder: (data: { lease: LeaseAgreement; property: Property; tenant: User }) => ({
      subject: `Lease Signing Reminder - ${data.property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📝 Lease Signing Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${data.tenant.login},</p>
              <p>This is a reminder to sign your lease agreement for <strong>${data.property.title}</strong>.</p>
              <p>Please review and sign the lease at your earliest convenience.</p>
              <a href="#" class="button">Sign Lease</a>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Lease Signing Reminder - ${data.property.title}\n\nHi ${data.tenant.login},\n\nPlease sign your lease agreement at your earliest convenience.`
    }),

    paymentReminder: (data: { booking: Booking; property: Property; user: User; amountDue: number; dueDate: Date }) => ({
      subject: `Payment Reminder - ${data.property.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .amount { font-size: 32px; color: #667eea; font-weight: bold; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💳 Payment Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${data.user.login},</p>
              <p>This is a reminder that your payment for <strong>${data.property.title}</strong> is due.</p>
              <div class="amount">€${data.amountDue.toLocaleString()}</div>
              <p><strong>Due Date:</strong> ${data.dueDate.toLocaleDateString()}</p>
              <a href="#" class="button">Make Payment</a>
            </div>
            <div class="footer">
              <p>RentHub - Modern Rental Platform</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Payment Reminder - ${data.property.title}\n\nHi ${data.user.login},\n\nAmount Due: €${data.amountDue}\nDue Date: ${data.dueDate.toLocaleDateString()}\n\nPlease make your payment by the due date.`
    })
  }

  const templateFn = templates[type]
  return templateFn ? templateFn(data) : {
    subject: 'Notification from RentHub',
    html: '<p>You have a new notification.</p>',
    text: 'You have a new notification.'
  }
}

async function sendEmailViaAPI(
  to: string,
  template: EmailTemplate,
  settings: EmailSettings
): Promise<boolean> {
  try {
    const response = await fetch('https://api.smtp.com/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.smtpPassword}`
      },
      body: JSON.stringify({
        from: {
          email: settings.fromEmail,
          name: settings.fromName
        },
        to: [{ email: to }],
        subject: template.subject,
        html: template.html,
        text: template.text
      })
    })

    return response.ok
  } catch (error) {
    console.error('Failed to send email via API:', error)
    return false
  }
}

export async function sendEmail(
  recipientEmail: string,
  recipientUserId: string,
  type: keyof EmailNotificationPreferences,
  data: any
): Promise<boolean> {
  try {
    const settings = await getEmailSettings()
    if (!settings || !settings.enabled) {
      console.log('Email service is disabled or not configured')
      return false
    }

    const preferences = await getEmailPreferences(recipientUserId)
    if (!preferences[type]) {
      console.log(`User has disabled ${type} email notifications`)
      return false
    }

    const template = generateEmailTemplate(type, data)
    
    const success = await sendEmailViaAPI(recipientEmail, template, settings)
    
    const emailLog = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      to: recipientEmail,
      type,
      subject: template.subject,
      status: success ? ('sent' as const) : ('failed' as const),
      sentAt: Date.now(),
      error: success ? null : 'Failed to send email'
    }

    // Store email logs in localStorage (Spark removed)
    const storedLogs = localStorage.getItem('email-logs')
    const logs = storedLogs ? JSON.parse(storedLogs) : []
    localStorage.setItem('email-logs', JSON.stringify([emailLog, ...logs].slice(0, 100)))

    return success
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export async function sendNewBookingEmail(
  booking: Booking,
  property: Property,
  landlord: User
): Promise<void> {
  if (landlord.email) {
    await sendEmail(landlord.email, landlord.id, 'newBooking', { booking, property, landlord })
  }
}

export async function sendBookingConfirmationEmail(
  booking: Booking,
  property: Property,
  user: User
): Promise<void> {
  if (user.email) {
    await sendEmail(user.email, user.id, 'bookingConfirmation', { booking, property, user })
  }
}

export async function sendBookingCancellationEmail(
  booking: Booking,
  property: Property,
  user: User
): Promise<void> {
  if (user.email) {
    await sendEmail(user.email, user.id, 'bookingCancellation', { booking, property, user })
  }
}

export async function sendNewMessageEmail(
  conversation: Conversation,
  senderName: string,
  message: string,
  recipientEmail: string,
  recipientUserId: string,
  recipientName: string
): Promise<void> {
  await sendEmail(recipientEmail, recipientUserId, 'newMessage', {
    conversation,
    senderName,
    message,
    recipientName
  })
}

export async function sendNewReviewEmail(
  review: Review,
  property: Property,
  landlord: User
): Promise<void> {
  if (landlord.email) {
    await sendEmail(landlord.email, landlord.id, 'newReview', { review, property, landlord })
  }
}

export async function sendPriceAlertEmail(
  property: Property,
  oldPrice: number,
  newPrice: number,
  user: User
): Promise<void> {
  if (user.email) {
    await sendEmail(user.email, user.id, 'priceAlert', { property, oldPrice, newPrice, user })
  }
}

export async function sendPropertyUpdateEmail(
  property: Property,
  updateMessage: string,
  user: User
): Promise<void> {
  if (user.email) {
    await sendEmail(user.email, user.id, 'propertyUpdate', { property, updateMessage, user })
  }
}

export async function sendMaintenanceRequestEmail(
  request: MaintenanceRequest,
  property: Property,
  landlord: User
): Promise<void> {
  if (landlord.email) {
    await sendEmail(landlord.email, landlord.id, 'maintenanceRequest', { request, property, landlord })
  }
}

export async function sendLeaseSigningReminderEmail(
  lease: LeaseAgreement,
  property: Property,
  tenant: User
): Promise<void> {
  if (tenant.email) {
    await sendEmail(tenant.email, tenant.id, 'leaseSigningReminder', { lease, property, tenant })
  }
}

export async function sendPaymentReminderEmail(
  booking: Booking,
  property: Property,
  user: User,
  amountDue: number,
  dueDate: Date
): Promise<void> {
  if (user.email) {
    await sendEmail(user.email, user.id, 'paymentReminder', { booking, property, user, amountDue, dueDate })
  }
}
