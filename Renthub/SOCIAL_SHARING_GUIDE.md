# Social Sharing Feature Guide

## Overview

The Social Sharing feature allows users to share properties across multiple social media platforms and communication channels. This enhances property visibility and enables users to easily share listings with friends, family, and their networks.

## Supported Platforms

### Social Media
- **Facebook** - Share to Facebook timeline
- **Twitter/X** - Share as a tweet
- **LinkedIn** - Share on LinkedIn feed

### Messaging Apps
- **WhatsApp** - Share via WhatsApp (mobile & web)
- **Telegram** - Share via Telegram

### Other Options
- **Email** - Share via email client
- **Copy Link** - Copy property URL to clipboard
- **Native Share** - Use device's native share menu (when available)

## Components

### SharePropertyButton

A compact dropdown button component for quick property sharing.

**Usage:**
```tsx
import { SharePropertyButton } from '@/components/SharePropertyButton'

<SharePropertyButton 
  property={property}
  variant="outline"
  size="default"
  showLabel={true}
/>
```

**Props:**
- `property` - The property object to share
- `variant` - Button variant: `default`, `outline`, `ghost`, `link`
- `size` - Button size: `default`, `sm`, `lg`, `icon`
- `showLabel` - Whether to show "Share" text label
- `className` - Additional CSS classes

**Features:**
- Dropdown menu with all sharing options
- Platform-specific icons with brand colors
- One-click sharing to any platform
- Copy link with visual feedback
- Automatic mobile detection for WhatsApp

### SharePropertyModal

A detailed modal for sharing properties with customization options.

**Usage:**
```tsx
import { SharePropertyModal } from '@/components/SharePropertyModal'

<SharePropertyModal 
  property={property}
  open={showModal}
  onClose={() => setShowModal(false)}
/>
```

**Features:**
- Property preview with image
- Editable share link
- Custom message input (for supported platforms)
- Visual grid of sharing options
- Native share integration
- Copy link functionality
- Platform-specific instructions

## Utility Functions

Located in `@/lib/socialSharing.ts`:

### Core Functions

```typescript
// Share to a specific platform
shareProperty({ 
  property, 
  platform: 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'telegram' | 'email',
  customMessage?: string 
})

// Copy link to clipboard
await copyToClipboard(property)

// Generate shareable URL
const url = generateShareUrl(property)

// Generate share text
const text = generateShareText(property, customMessage)

// Check if native share is available
const canShare = canUseNativeShare()

// Use native share API
await shareViaWebAPI(property)
```

### Platform-Specific Functions

```typescript
shareOnFacebook({ property, platform: 'facebook' })
shareOnTwitter({ property, platform: 'twitter' })
shareOnWhatsApp({ property, platform: 'whatsapp' })
shareOnLinkedIn({ property, platform: 'linkedin' })
shareOnTelegram({ property, platform: 'telegram' })
shareViaEmail({ property, platform: 'email' })
```

## Implementation Locations

### PropertyCard Component
- Added share dropdown button to top-left action buttons
- Located next to favorite and compare buttons
- Prevents event propagation to card click

### PropertyDetailsPage
- Share button in header action buttons
- Positioned with favorite and compare buttons
- Uses `SharePropertyButton` component

### PropertyDetailModal
- Share button in modal header
- Uses `SharePropertyButton` component
- Replaced old basic share implementation

## Share URL Format

Share URLs follow this pattern:
```
{origin}/property/{propertyId}
```

Example: `https://renthub.com/property/prop-12345`

## Share Message Format

Default share messages include:
- Property type (apartment, house, studio, condo)
- Property title
- Price with appropriate term (per night or per month)
- Location

Example:
```
Check out this apartment: Modern Downtown Loft - $2500/month in New York City!
```

## Mobile Optimization

### WhatsApp Detection
- Automatically detects mobile devices
- Uses `whatsapp://` protocol on mobile
- Falls back to `web.whatsapp.com` on desktop

### Native Share API
- Automatically detects browser support
- Shows "Share via System" option when available
- Provides native share sheet on supported devices

## Browser Compatibility

### Full Support
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Opera

### Native Share API
- ✅ Safari (iOS & macOS)
- ✅ Chrome (Android)
- ✅ Edge (Windows with sharing enabled)
- ❌ Firefox (no support)

### Clipboard API
- ✅ All modern browsers (HTTPS required)
- ⚠️ May require user permission on first use

## Features by Platform

### Facebook
- Opens share dialog in popup window
- Pre-fills URL
- User can add their own message

### Twitter/X
- Opens tweet composer in popup window
- Pre-fills text and URL
- Respects 280 character limit

### WhatsApp
- Mobile: Opens WhatsApp app directly
- Desktop: Opens WhatsApp Web
- Pre-fills message with text and URL

### LinkedIn
- Opens share dialog in popup window
- Pre-fills URL
- User can add commentary

### Telegram
- Opens Telegram share interface
- Pre-fills text and URL
- Works on desktop and mobile

### Email
- Opens default email client
- Pre-fills subject and body
- Includes property details and URL

## User Experience

### Success Feedback
- Toast notifications for successful shares
- "Copied!" state for copy link button
- Platform name in success message

### Error Handling
- Graceful fallbacks if sharing fails
- Console logging for debugging
- User-friendly error messages

### Visual Feedback
- Brand colors for each platform icon
- Hover effects on buttons
- Active states
- Loading states where applicable

## Analytics Opportunities

The sharing feature provides opportunities to track:
- Which platforms are most popular
- Share conversion rates
- Properties most shared
- Time of day patterns
- Geographic patterns

To implement tracking, add analytics calls to the share functions:
```typescript
// Example analytics tracking
shareProperty({ property, platform })
trackEvent('property_shared', {
  propertyId: property.id,
  platform: platform,
  timestamp: Date.now()
})
```

## SEO Benefits

### Open Graph Tags
Consider adding Open Graph meta tags to property pages for better social previews:

```html
<meta property="og:title" content="{property.title}" />
<meta property="og:description" content="{property.description}" />
<meta property="og:image" content="{property.images[0]}" />
<meta property="og:url" content="{propertyUrl}" />
<meta property="og:type" content="website" />
```

### Twitter Cards
Add Twitter Card meta tags for enhanced Twitter sharing:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{property.title}" />
<meta name="twitter:description" content="{property.description}" />
<meta name="twitter:image" content="{property.images[0]}" />
```

## Customization

### Custom Share Messages
Users can customize share messages for supported platforms:

```tsx
<SharePropertyModal 
  property={property}
  open={true}
  onClose={() => {}}
/>
```

The modal includes a textarea where users can write custom messages. This works for:
- ✅ Twitter
- ✅ WhatsApp
- ✅ Telegram
- ✅ Email
- ❌ Facebook (uses FB's composer)
- ❌ LinkedIn (uses LI's composer)

### Styling
The share components use Tailwind CSS and can be styled via:
- `className` prop
- Tailwind classes
- CSS variables for brand colors
- shadcn/ui theme tokens

## Best Practices

1. **Always provide copy link option** - Not all users want to share publicly
2. **Use platform icons** - Visual recognition improves UX
3. **Provide feedback** - Toast notifications confirm actions
4. **Mobile optimization** - Detect device type for WhatsApp
5. **Graceful degradation** - Fall back if native share unavailable
6. **Error handling** - Don't let share failures break the app
7. **Prevent propagation** - Stop clicks from triggering parent elements
8. **Accessibility** - Ensure keyboard navigation works
9. **Analytics** - Track share patterns for insights
10. **SEO optimization** - Add Open Graph and Twitter Card tags

## Future Enhancements

Potential improvements to consider:

1. **More Platforms**
   - Pinterest (for property images)
   - Reddit (for community discussions)
   - SMS (direct mobile sharing)
   - QR Code generation

2. **Enhanced Analytics**
   - Track share success rates
   - A/B test share messages
   - Measure referral traffic

3. **Social Proof**
   - Display share count on properties
   - Show "Shared X times" badge
   - Highlight trending properties

4. **Custom Campaigns**
   - UTM parameter support
   - Referral tracking
   - Affiliate links

5. **Rich Previews**
   - Dynamic Open Graph images
   - Video thumbnails
   - Interactive previews

## Troubleshooting

### Links not copying
- Ensure HTTPS is enabled
- Check clipboard permissions
- Verify Clipboard API support

### WhatsApp not opening
- Check URL encoding
- Verify mobile detection
- Test on actual devices

### Share popup blocked
- Modern browsers block popups by default
- User must click share button (not programmatic)
- Add popup blocker detection

### Native share not working
- Check browser support
- Verify HTTPS
- Test on supported devices

## Support

For issues or questions about the social sharing feature:
1. Check browser console for errors
2. Verify property data is complete
3. Test in different browsers
4. Check network tab for API calls
5. Review toast notifications for errors
