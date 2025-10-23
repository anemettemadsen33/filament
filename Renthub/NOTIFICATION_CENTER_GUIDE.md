# Notification Center Implementation Guide

## Overview

The Notification Center is a comprehensive real-time notification system integrated throughout RentHub. It keeps users informed about important events including messages, bookings, price changes, reviews, and property updates.

## Features

### 1. **Centralized Notification Hub**
- Accessible via bell icon in the header navigation
- Displays unread count badge with animations
- Side sheet interface with smooth transitions
- Organized chronologically with newest first

### 2. **Notification Types**

The system supports 7 notification types, each with distinct icons and colors:

| Type | Icon | Color | Triggers |
|------|------|-------|----------|
| `message` | ChatCircle | Blue | New messages, inquiries |
| `booking` | CalendarCheck | Green | New bookings, booking confirmations |
| `price_drop` | TrendDown | Orange | Price alerts triggered |
| `new_property` | House | Purple | New properties matching criteria |
| `review` | Star | Yellow | New reviews on properties |
| `confirmation` | CheckCircle | Emerald | Actions confirmed (listings, bookings) |
| `property_update` | House | Indigo | Property availability/details changed |

### 3. **Smart Filtering**

Users can filter notifications by:
- **All**: View all notifications
- **Unread**: Only unread notifications
- **Messages**: Message-related notifications only
- **Bookings**: Booking-related notifications only

Each filter tab shows a badge with the count of matching notifications.

### 4. **Interactive Actions**

- **Click notification**: Navigate to related content (property, conversation, booking)
- **Mark as read**: Individual notification marking
- **Mark all as read**: Bulk action for all notifications
- **Delete**: Remove individual notifications
- **Clear all**: Remove all user notifications

### 5. **Dashboard Integration**

The dashboard features:
- **Notification Summary Card**: Shows 5 most recent notifications
- **Quick Stats**: Displays unread notification count
- **Activity Overview**: Real-time updates on user activity

## Implementation Details

### Data Structure

```typescript
interface Notification {
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
```

### Automatic Notification Creation

Notifications are automatically created for:

1. **New Reviews**: When a user leaves a review on a property
   - Sent to: Property owner
   - Type: `review`

2. **New Bookings**: When a property is booked
   - Sent to: Both renter (confirmation) and property owner (booking)
   - Types: `confirmation`, `booking`

3. **New Property Listings**: When a user lists a property
   - Sent to: Property owner
   - Type: `confirmation`

4. **New Messages**: When someone sends a message about a property
   - Sent to: Property owner
   - Type: `message`

5. **Price Alerts**: When price conditions are met
   - Sent to: Users with active price alerts
   - Type: `price_drop`

### Helper Functions

#### Creating Notifications

```typescript
import { createNotification } from '@/lib/notifications'

const notification = await createNotification(
  userId,
  'booking',
  'New Booking Received',
  'John Doe has booked your property for $2,500',
  {
    propertyId: 'property-123',
    bookingId: 'booking-456',
    actionUrl: '/property/property-123'
  }
)
```

#### Adding to State

```typescript
const addNotification = async (
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  options?: { ... }
) => {
  const notification = await createNotification(userId, type, title, message, options)
  setNotifications((current) => [notification, ...(current || [])])
}
```

### Price Monitoring

The `priceMonitor.ts` utility provides:
- **Price change detection**: Compares old and new property prices
- **Alert checking**: Evaluates if price alerts should trigger
- **Notification generation**: Creates price drop notifications

```typescript
import { detectPriceChanges, checkPriceAlerts } from '@/lib/priceMonitor'

// Detect price changes
const changes = detectPriceChanges(oldProperties, newProperties)

// Check and trigger alerts
for (const change of changes) {
  const property = properties.find(p => p.id === change.propertyId)
  if (property) {
    const notifications = await checkPriceAlerts(change, alerts, property)
    // Add notifications to state
  }
}
```

## User Experience

### Visual Design

- **Staggered animations**: Notifications animate in with 50ms delays
- **Read/unread states**: Unread notifications have colored background
- **Icon containers**: Circular backgrounds with type-specific colors
- **Hover effects**: Smooth transitions on hover with action buttons reveal
- **Empty states**: Encouraging messages when no notifications exist

### Accessibility

- **Keyboard navigation**: Full keyboard support for all actions
- **Screen reader friendly**: Proper ARIA labels and semantic HTML
- **Focus management**: Clear focus indicators
- **Color contrast**: WCAG AA compliant color ratios

### Mobile Optimization

- **Full-width sheet**: Responsive design for mobile screens
- **Touch-friendly**: Large tap targets (minimum 44px)
- **Smooth animations**: Optimized for mobile performance
- **Swipe gestures**: Native sheet swipe-to-close on mobile

## Best Practices

### 1. Notification Creation
- Always include relevant context (propertyId, actionUrl)
- Keep titles concise (< 60 characters)
- Make messages actionable and clear
- Include specific details (prices, names, dates)

### 2. Performance
- Use functional updates with `setNotifications`
- Avoid creating duplicate notifications
- Clean up old notifications periodically
- Batch notification creation when possible

### 3. User Experience
- Don't overwhelm users with too many notifications
- Group similar events when appropriate
- Provide clear actions for each notification
- Make navigation intuitive and fast

## Future Enhancements

Potential improvements for the notification system:

1. **Email Notifications**: Send email digests of notifications
2. **Push Notifications**: Browser push notifications for critical events
3. **Notification Preferences**: User settings for notification types
4. **Rich Notifications**: Include images and action buttons
5. **Notification History**: Archive with search and filtering
6. **Group Notifications**: Combine similar notifications
7. **Scheduled Digests**: Daily/weekly notification summaries
8. **Priority Levels**: Mark notifications as urgent/normal/low
9. **Snooze Feature**: Remind me later functionality
10. **In-app Sounds**: Subtle audio cues for new notifications

## Troubleshooting

### Notifications not appearing
- Check if userId matches current user
- Verify notification is being added to KV store
- Check filter settings in notification center

### Duplicate notifications
- Ensure createNotification is called only once per event
- Check for multiple event handlers
- Use unique IDs for deduplication

### Navigation not working
- Verify actionUrl or propertyId is set correctly
- Check if onNotificationClick handler is properly wired
- Ensure navigation routes exist

## Summary

The Notification Center provides a robust, user-friendly system for keeping users informed about important events in RentHub. With automatic notification creation, smart filtering, and seamless integration throughout the app, it ensures users never miss critical updates about their properties, bookings, and interactions.
