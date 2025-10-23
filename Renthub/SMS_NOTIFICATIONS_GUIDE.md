# SMS Notifications Guide

## Overview

The SMS Notifications feature provides urgent, real-time alerts for critical booking and maintenance events. This complements the email notification system by ensuring landlords and tenants receive time-sensitive information immediately via SMS.

## Key Features

### 🚨 Urgent Booking Alerts
- Automatic SMS sent to landlords when a booking check-in is within 24 hours
- Includes guest name, check-in date, and total price
- Ensures landlords can respond quickly to last-minute bookings

### ✅ Booking Confirmations
- SMS confirmation sent to guests after successful booking
- Includes property name, location, and booking ID
- Provides instant reassurance to guests

### 🔧 Urgent Maintenance Notifications
- High-priority maintenance requests trigger immediate SMS alerts
- Helps landlords address critical issues quickly
- Includes category, priority level, and brief description

### 📍 Check-in/Check-out Reminders
- 24-hour advance reminders for both check-in and check-out
- Includes property address and contact information
- Reduces no-shows and improves guest experience

### 💳 Payment Reminders
- SMS alerts sent 3 days before payment due dates
- Helps avoid late fees and maintains cash flow
- Includes amount due and booking reference

## Architecture

### Core Components

#### SMS Service (`src/lib/smsService.ts`)
- **Purpose**: Core SMS notification logic and API integration
- **Key Functions**:
  - `sendSMS()` - Main SMS sending function with preference checking
  - `sendUrgentBookingSMS()` - Handles urgent booking alerts
  - `sendBookingConfirmationSMS()` - Guest confirmation messages
  - `sendUrgentMaintenanceSMS()` - Critical maintenance alerts
  - `sendCheckInReminderSMS()` - 24-hour check-in reminders
  - `sendCheckOutReminderSMS()` - 24-hour check-out reminders
  - `sendPaymentDueSMS()` - Payment due alerts

#### SMS Settings Panel (`src/components/SMSSettingsPanel.tsx`)
- **Purpose**: User interface for SMS configuration
- **Features**:
  - Provider credentials management (API key, secret, sender ID)
  - Enable/disable SMS service
  - Per-notification type preferences
  - Activity log viewer
  - Setup guide for Twilio and other providers

### Data Models

#### SMSSettings
```typescript
{
  apiKey: string          // Twilio Account SID or provider API key
  apiSecret: string       // Auth Token or API secret
  senderId: string        // Phone number or approved sender ID
  enabled: boolean        // Master switch for SMS service
}
```

#### SMSNotificationPreferences
```typescript
{
  urgentBooking: boolean          // Bookings within 24 hours
  bookingConfirmation: boolean    // Guest confirmations
  urgentMaintenance: boolean      // High-priority maintenance
  checkInReminder: boolean        // 24h check-in alerts
  checkOutReminder: boolean       // 24h check-out alerts
  paymentDue: boolean            // 3-day payment reminders
}
```

#### User Type Extension
The `User` interface now includes an optional `phone` field:
```typescript
interface User {
  // ... existing fields
  phone?: string  // Phone number for SMS notifications
}
```

## Setup Instructions

### 1. SMS Provider Setup (Twilio)

1. **Create Twilio Account**
   - Visit [twilio.com](https://www.twilio.com)
   - Sign up for a free or paid account
   - Verify your email and phone number

2. **Get API Credentials**
   - Navigate to Console Dashboard
   - Copy your **Account SID** (API Key)
   - Copy your **Auth Token** (API Secret)
   - Keep these credentials secure

3. **Purchase Phone Number**
   - Go to Phone Numbers → Buy a Number
   - Select a number with SMS capabilities
   - This becomes your Sender ID

4. **Configure in RentHub**
   - Go to Dashboard → SMS tab
   - Enter Account SID as API Key
   - Enter Auth Token as API Secret
   - Enter purchased number as Sender ID
   - Enable the SMS service

### 2. Alternative Providers

#### Nexmo (Vonage)
- API Key: Your Nexmo API key
- API Secret: Your Nexmo API secret
- Sender ID: Approved sender name or number

#### AWS SNS
- API Key: AWS Access Key ID
- API Secret: AWS Secret Access Key
- Sender ID: Registered sender ID

#### Custom Provider
- Modify the `sendSMSViaAPI()` function in `smsService.ts`
- Update API endpoint and request format
- Maintain the same function signature

### 3. User Configuration

#### For Users Receiving SMS
1. Add phone number to user profile
2. Go to Dashboard → SMS tab
3. Configure notification preferences
4. Save preferences

#### For Property Owners
1. Ensure landlord phone number is set in property data
2. Configure which notification types to receive
3. Test SMS delivery

## Integration Points

### App.tsx Integration
The main application automatically triggers SMS notifications:

```typescript
const handleAddBooking = (booking: Booking) => {
  // ... booking creation logic
  
  // Send email confirmation
  sendBookingConfirmationEmail(booking, property, currentUser)
  
  // Send SMS confirmation to guest
  sendBookingConfirmationSMS(booking, property, currentUser)
  
  // Schedule check-in/check-out reminders
  scheduleCheckInCheckOutReminders(booking, property, currentUser)
  
  // If urgent, notify landlord via SMS
  if (property.landlord) {
    sendNewBookingSMS(booking, property, landlordUser)
  }
}
```

### Maintenance Integration
When integrated with the maintenance system:

```typescript
if (request.priority === 'high' && landlord.phone) {
  await sendUrgentMaintenanceSMS(request, property, landlord)
}
```

## SMS Message Templates

### Urgent Booking
```
🚨 URGENT: New booking for [Property]! 
Guest: [Name]. Check-in: [Date]. 
Total: €[Amount]. Please confirm ASAP! - RentHub
```

### Booking Confirmation
```
✅ Booking confirmed! [Property], [Location]. 
Check-in: [Date]. Booking ID: [ID]. - RentHub
```

### Urgent Maintenance
```
🔧 URGENT MAINTENANCE: [Property] - [Category] 
(Priority: HIGH). [Description]... 
Please address immediately! - RentHub
```

### Check-in Reminder
```
📍 Check-in reminder: [Property] in [Hours] hours! 
Address: [Location]. Contact: [Phone]. 
Have a great stay! - RentHub
```

### Check-out Reminder
```
📦 Check-out reminder: [Property] in [Hours] hours. 
Please ensure property is tidy and keys are returned. 
Thank you for staying with us! - RentHub
```

### Payment Due
```
💳 Payment reminder: €[Amount] due in [Days] days 
for [Property]. Please make payment to avoid late fees. 
Booking ID: [ID]. - RentHub
```

## Best Practices

### 1. Phone Number Management
- Store phone numbers in E.164 format (+country code)
- Validate phone numbers before sending
- Allow users to update their phone numbers easily

### 2. Cost Management
- SMS notifications are only sent for urgent events
- Users can disable notification types they don't need
- Monitor SMS logs to track usage and costs

### 3. Compliance
- Comply with local SMS marketing regulations (TCPA, GDPR, etc.)
- Include opt-out instructions in messages
- Store user consent for SMS communications
- Respect quiet hours (no messages late at night)

### 4. Message Quality
- Keep messages under 160 characters when possible
- Use clear, actionable language
- Include relevant identifiers (booking IDs, property names)
- Always include brand name (RentHub)

### 5. Error Handling
- Log all SMS attempts (success and failure)
- Retry failed messages with exponential backoff
- Alert administrators of consistent failures
- Provide fallback to email if SMS fails

## Testing

### Test Mode Setup
1. Use Twilio test credentials for development
2. Configure test phone numbers in Twilio console
3. Monitor test message logs in dashboard

### Test Scenarios
- ✅ Urgent booking (within 24 hours)
- ✅ Booking confirmation
- ✅ High-priority maintenance request
- ✅ Check-in reminder (24h before)
- ✅ Check-out reminder (24h before)
- ✅ Payment due notification (3 days before)

## Monitoring & Logs

### SMS Activity Log
The SMS Settings Panel includes a log viewer showing:
- **Message Type**: Category of notification
- **Recipient**: Phone number (partially masked)
- **Status**: Sent or Failed
- **Timestamp**: When message was sent
- **Message Content**: Full message text
- **Error Details**: Failure reasons if applicable

### Log Storage
- Logs stored in `spark.kv` under key `sms-logs`
- Limited to 100 most recent messages
- Automatically pruned to save storage

## Security Considerations

### API Credentials
- Store API keys and secrets in KV storage
- Never expose credentials in client-side code
- Use environment variables in production
- Rotate credentials periodically

### Phone Number Privacy
- Mask phone numbers in logs (show last 4 digits only)
- Don't share user phone numbers with third parties
- Implement rate limiting to prevent abuse
- Validate phone numbers before storage

### User Permissions
- Only property owners can configure SMS settings
- Users control their own notification preferences
- Landlords cannot see tenant phone numbers (unless shared)

## Future Enhancements

### Planned Features
1. **Two-way SMS**: Allow recipients to reply to messages
2. **Scheduled Messages**: Pre-schedule notifications
3. **Bulk SMS**: Send messages to multiple recipients
4. **SMS Templates**: Customizable message templates
5. **Analytics Dashboard**: Delivery rates, open rates, response times
6. **Multi-language Support**: Localized SMS messages
7. **Smart Timing**: Send messages at optimal times based on timezone
8. **Message Threading**: Group related messages in conversations

### Integration Opportunities
1. **Calendar Integration**: Sync with booking calendars
2. **Payment Gateway**: Payment confirmation via SMS
3. **Review Requests**: SMS review reminders after stay
4. **Emergency Alerts**: Critical property issue notifications
5. **Verification Codes**: SMS-based 2FA for security

## Troubleshooting

### Common Issues

#### SMS Not Sending
- Check if SMS service is enabled in settings
- Verify API credentials are correct
- Ensure phone number format is valid (+country code)
- Check SMS logs for specific error messages
- Verify Twilio account has sufficient credits

#### User Not Receiving SMS
- Confirm user has valid phone number in profile
- Check user's notification preferences
- Verify phone number is not on carrier blocklist
- Check if message was marked as spam

#### Wrong Phone Number Format
- Use E.164 format: +[country code][number]
- Example: +14155552671 (US), +447911123456 (UK)
- Remove spaces, dashes, and parentheses

#### Rate Limiting
- Twilio has rate limits per phone number
- Consider spreading messages across time
- Upgrade Twilio account for higher limits

## Support

For SMS notification issues:
1. Check the SMS Activity Log in dashboard
2. Review Twilio console for delivery reports
3. Verify account credits and limits
4. Contact Twilio support for provider-specific issues
5. Review local SMS regulations for compliance

## Technical Reference

### API Endpoints
The service uses the Twilio Messages API:
```
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json
```

### Required Permissions
- Read/write access to user phone numbers
- Read/write access to SMS settings (KV storage)
- API credentials for SMS provider

### Dependencies
- No additional npm packages required
- Uses native Fetch API for HTTP requests
- Leverages Spark KV for storage

### Performance
- SMS sending is asynchronous (non-blocking)
- Average delivery time: 1-5 seconds
- Logs are cached for quick access
- Minimal impact on application performance

---

**Note**: This feature complements but does not replace email notifications. Critical information should always be sent via both email and SMS when possible.
