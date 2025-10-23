# Email Notification Service - Complete Guide

## Overview

The RentHub platform now includes a comprehensive email notification system that sends real-time email notifications to users for important events like bookings, messages, reviews, and more.

## Features

### ✨ Key Capabilities

1. **Professional Email Templates**
   - Beautiful HTML email designs
   - Responsive layouts that work on all devices
   - Branded color schemes and typography
   - Plain text fallbacks for accessibility

2. **10 Notification Types**
   - New Booking Requests (for landlords)
   - Booking Confirmations (for tenants)
   - Booking Cancellations
   - New Messages
   - New Reviews
   - Price Alerts
   - Property Updates
   - Maintenance Requests
   - Lease Signing Reminders
   - Payment Reminders

3. **SMTP Configuration**
   - Works with any SMTP provider (Gmail, SendGrid, Mailgun, etc.)
   - Secure password/API key storage
   - Test email functionality
   - Enable/disable email service

4. **User Preferences**
   - Granular control per notification type
   - Users can opt-in/opt-out of specific emails
   - Persistent preference storage
   - Easy management through dashboard

5. **Email Logs**
   - Track all sent emails
   - View delivery status
   - Debug failed sends
   - Recent activity monitoring

## Setup Instructions

### 1. Access Email Settings

1. Sign in to your account
2. Click on your profile avatar
3. Select "My Dashboard"
4. Navigate to the "Email" tab

### 2. Configure SMTP Settings

You have several options for SMTP providers:

#### Option A: Gmail (Free)

1. **SMTP Host**: `smtp.gmail.com`
2. **SMTP Port**: `587`
3. **SMTP Username**: Your Gmail address
4. **SMTP Password**: App Password (not your Gmail password)
   - Go to Google Account Settings → Security → 2-Step Verification → App Passwords
   - Generate a new app password for "Mail"
   - Use this password in the settings
5. **From Email**: Your Gmail address or custom email
6. **From Name**: RentHub (or your preferred name)

#### Option B: SendGrid (Recommended for Production)

1. **SMTP Host**: `smtp.sendgrid.net`
2. **SMTP Port**: `587`
3. **SMTP Username**: `apikey` (literally the word "apikey")
4. **SMTP Password**: Your SendGrid API Key
5. **From Email**: Your verified sender email
6. **From Name**: RentHub

#### Option C: Mailgun

1. **SMTP Host**: `smtp.mailgun.org`
2. **SMTP Port**: `587`
3. **SMTP Username**: Your Mailgun SMTP username
4. **SMTP Password**: Your Mailgun SMTP password
5. **From Email**: Your verified sender email
6. **From Name**: RentHub

#### Option D: Amazon SES

1. **SMTP Host**: `email-smtp.region.amazonaws.com`
2. **SMTP Port**: `587`
3. **SMTP Username**: Your SMTP username from SES
4. **SMTP Password**: Your SMTP password from SES
5. **From Email**: Your verified sender email
6. **From Name**: RentHub

### 3. Enable Email Service

1. Toggle the "Enable Email Service" switch to ON
2. Fill in all required SMTP settings
3. Click "Save Settings"
4. Click "Send Test Email" to verify configuration

### 4. Configure Notification Preferences

Navigate to the "Preferences" tab to customize which notifications you want to receive:

- **New Booking Requests**: Notifications when someone books your property
- **Booking Confirmations**: Confirmation emails when your booking is confirmed
- **Booking Cancellations**: Alerts when a booking is cancelled
- **New Messages**: Notifications for new messages in conversations
- **New Reviews**: Alerts when your property receives a review
- **Price Alerts**: Notifications when prices drop on favorite properties
- **Property Updates**: Updates about properties you're following
- **Maintenance Requests**: Alerts for new maintenance issues
- **Lease Signing Reminders**: Reminders to sign lease agreements
- **Payment Reminders**: Alerts for upcoming payment due dates

## Email Templates

### 1. New Booking Request

**Sent to**: Property landlord  
**Triggered when**: A guest submits a booking request

**Contains**:
- Guest details (name, email, phone)
- Property information
- Booking dates or duration
- Total price
- Payment details
- Quick action button to view booking

### 2. Booking Confirmation

**Sent to**: Guest who made the booking  
**Triggered when**: Booking is confirmed

**Contains**:
- Booking confirmation details
- Property information and location
- Check-in/check-out dates
- Booking ID for reference
- Total amount paid
- Next steps and contact information

### 3. Booking Cancellation

**Sent to**: Both landlord and guest  
**Triggered when**: A booking is cancelled

**Contains**:
- Cancellation confirmation
- Property details
- Original booking information
- Support contact information

### 4. New Message

**Sent to**: Message recipient  
**Triggered when**: A new message is received

**Contains**:
- Sender name and avatar
- Message preview
- Property context
- Quick reply button
- Conversation link

### 5. New Review

**Sent to**: Property landlord  
**Triggered when**: A guest leaves a review

**Contains**:
- Star rating (visual)
- Review text
- Reviewer name
- Property information
- Button to view and respond to review

### 6. Price Alert

**Sent to**: Users watching a property  
**Triggered when**: Property price drops

**Contains**:
- Old vs new price comparison
- Savings amount
- Property details
- Urgency messaging
- Book now button

### 7. Property Update

**Sent to**: Users interested in a property  
**Triggered when**: Property details are updated

**Contains**:
- Update description
- Property information
- What changed
- View property button

### 8. Maintenance Request

**Sent to**: Property landlord  
**Triggered when**: A maintenance issue is reported

**Contains**:
- Issue category and priority
- Detailed description
- Reporter information
- Property details
- Action required button

### 9. Lease Signing Reminder

**Sent to**: Tenant  
**Triggered when**: Lease needs to be signed

**Contains**:
- Property details
- Lease terms overview
- Deadline information
- Digital signing link
- Support contact

### 10. Payment Reminder

**Sent to**: Tenant  
**Triggered when**: Payment is due

**Contains**:
- Amount due
- Due date
- Property information
- Payment instructions
- Late payment policy

## Integration Points

### Automatic Email Triggers

Emails are automatically sent when these events occur:

1. **Booking Created** → Confirmation to guest + notification to landlord
2. **Booking Cancelled** → Notification to both parties
3. **Review Posted** → Notification to landlord
4. **Message Sent** → Notification to recipient
5. **Price Changed** → Alert to users with price alerts
6. **Maintenance Request Created** → Notification to landlord
7. **Lease Created** → Signing reminder to tenant
8. **Payment Due** → Reminder to tenant

### Developer Integration

To send emails programmatically:

```typescript
import {
  sendNewBookingEmail,
  sendBookingConfirmationEmail,
  sendNewMessageEmail,
  sendNewReviewEmail,
  // ... other email functions
} from '@/lib/emailService'

// Example: Send booking confirmation
const booking = { /* booking data */ }
const property = { /* property data */ }
const user = { /* user data */ }

await sendBookingConfirmationEmail(booking, property, user)
```

### Custom Email Templates

To modify email templates, edit `/src/lib/emailService.ts`:

```typescript
function generateEmailTemplate(
  type: keyof EmailNotificationPreferences,
  data: any
): EmailTemplate {
  // Customize templates here
}
```

## Monitoring and Logs

### View Email Logs

1. Go to Dashboard → Email tab
2. Click on "Email Logs" tab
3. View recent email activity

Each log entry shows:
- ✅ Sent status or ❌ Failed status
- Email subject
- Recipient email
- Timestamp
- Error message (if failed)

### Troubleshooting Failed Emails

Common issues and solutions:

**Problem**: Test email fails  
**Solution**: 
- Verify SMTP credentials are correct
- Check that SMTP port is correct (usually 587)
- Ensure "Enable Email Service" is ON
- For Gmail, use App Password not regular password

**Problem**: Emails not being sent  
**Solution**:
- Check Email Logs for error messages
- Verify email service is enabled
- Check user preferences haven't disabled that notification type
- Ensure recipient email address is valid

**Problem**: Emails going to spam  
**Solution**:
- Use a verified sender domain
- Configure SPF, DKIM, and DMARC records
- Consider using a professional email service (SendGrid, Mailgun)
- Ensure "From Email" matches your domain

## Best Practices

### For Landlords

1. **Enable all booking notifications** - Never miss a booking request
2. **Respond quickly to new messages** - Email alerts help you stay responsive
3. **Monitor maintenance requests** - Get instant notifications for urgent issues
4. **Review email logs regularly** - Ensure important emails are being delivered

### For Tenants

1. **Keep booking confirmations** - Save these emails for your records
2. **Enable message notifications** - Stay updated on landlord communications
3. **Set up price alerts** - Get notified when prices drop on favorites
4. **Enable payment reminders** - Never miss a payment deadline

### For Administrators

1. **Use professional SMTP provider** - Gmail is fine for testing, but use SendGrid/Mailgun for production
2. **Monitor email logs** - Check for failed sends regularly
3. **Verify sender domain** - Set up proper email authentication
4. **Test all email types** - Ensure templates render correctly
5. **Keep backup of SMTP credentials** - Store securely

## Privacy and Security

### Data Protection

- SMTP passwords are stored securely in the database
- Email preferences are user-specific and private
- Email logs are limited to last 100 entries
- No email content is stored, only metadata

### User Control

- Users can disable any notification type
- Users can disable all emails by turning off email service
- Opt-out links can be added to email templates
- Users control their own email preferences

### Compliance

- Emails include unsubscribe information
- User data is processed according to privacy policy
- Email preferences are respected at all times
- No spam or marketing emails without consent

## FAQ

**Q: Can I use my personal Gmail account?**  
A: Yes, but you must create an App Password. Regular Gmail passwords won't work with SMTP.

**Q: How many emails can I send?**  
A: This depends on your SMTP provider:
- Gmail: ~500 emails/day
- SendGrid Free: 100 emails/day
- SendGrid Paid: Unlimited
- Mailgun: 5,000 free emails/month

**Q: Will users get too many emails?**  
A: Users can customize which notifications they receive in their preferences. Default settings are reasonable.

**Q: Can I customize email templates?**  
A: Yes, templates are in `/src/lib/emailService.ts`. You can modify HTML and styling.

**Q: What if SMTP credentials change?**  
A: Simply update them in Dashboard → Email → SMTP Settings and save.

**Q: Can I track email opens?**  
A: Not by default, but you can add tracking pixels to templates if needed.

**Q: Do emails work offline?**  
A: No, emails require an active internet connection and configured SMTP server.

**Q: What happens if email sending fails?**  
A: The action (booking, message, etc.) still completes successfully. Email is supplementary. Check logs for failures.

## Technical Details

### Architecture

```
User Action (e.g., Create Booking)
    ↓
App.tsx Handler Function
    ↓
Email Service Function
    ↓
Check Settings (enabled?)
    ↓
Check User Preferences (opted-in?)
    ↓
Generate Email Template
    ↓
Send via SMTP API
    ↓
Log Result
    ↓
Return Success/Failure
```

### Database Schema

```typescript
// SMTP Settings
interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string  // Encrypted
  fromEmail: string
  fromName: string
  enabled: boolean
}

// User Preferences (per user)
interface EmailNotificationPreferences {
  newBooking: boolean
  bookingConfirmation: boolean
  // ... other notification types
}

// Email Logs
interface EmailLog {
  id: string
  to: string
  type: string
  subject: string
  status: 'sent' | 'failed'
  sentAt: number
  error: string | null
}
```

### API Integration

Currently uses standard SMTP protocol. Can be extended to use:
- SendGrid API
- Mailgun API
- Amazon SES API
- Postmark API
- Any other email service API

## Support

For issues or questions:

1. Check the Email Logs tab for error messages
2. Review this documentation
3. Verify SMTP settings are correct
4. Test with "Send Test Email" button
5. Contact platform support if issues persist

## Updates and Changelog

**v1.0.0** - Initial Release
- 10 email notification types
- SMTP configuration
- User preferences
- Email logging
- Professional templates
- Integration with all major platform events

---

**Note**: This email service is designed to integrate with your existing Filament dashboard for centralized email configuration management.
