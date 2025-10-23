# Planning Guide

A modern rental platform that connects property owners with potential renters, providing an elegant and intuitive way to browse, list, and manage rental properties.

**Experience Qualities**:
1. **Trustworthy** - Design should evoke confidence and professionalism, making users feel secure when listing or renting properties
2. **Effortless** - Browsing and listing properties should feel smooth and natural, with minimal friction in the user journey
3. **Inviting** - The interface should feel welcoming and aspirational, making users excited about finding or offering their perfect space

**Complexity Level**: Light Application (multiple features with basic state)
- The platform needs property listings, search/filter capabilities, and basic user interactions without requiring complex account systems or payment processing at this stage

## Essential Features

### Property Listing Display
- **Functionality**: Display available rental properties with photos, details, price, and location
- **Purpose**: Allow renters to discover available properties quickly and efficiently
- **Trigger**: User lands on homepage or navigates to listings page
- **Progression**: View grid of properties → Click on property card → See detailed view with full information → Contact owner option
- **Success criteria**: Properties display with clear imagery, pricing, and key details; smooth transitions between list and detail views

### User Authentication & Profile
- **Functionality**: Users can sign in with their GitHub account and manage their profile preferences
- **Purpose**: Provide personalized experience with saved preferences and authentication for bookings
- **Trigger**: User clicks "Sign In" button in header or is prompted when attempting to book
- **Progression**: Click sign in → Authenticate with GitHub → Profile created → Set search preferences → Preferences auto-apply to filters
- **Success criteria**: Seamless GitHub OAuth, persistent user session, preferences sync across devices, clear profile management

### User Preferences & Personalization
- **Functionality**: Authenticated users can save default search preferences (rental term, property type, price range, bedrooms)
- **Purpose**: Streamline property browsing by automatically applying user's preferred filters
- **Trigger**: User clicks on their profile avatar → Opens profile modal → Adjusts preferences → Saves
- **Progression**: Open profile → Set rental term preference → Set property type → Set bedrooms → Adjust price range → Save → Filters auto-apply on next visit
- **Success criteria**: Preferences persist across sessions, auto-apply on login, easy to update, visual confirmation of saved preferences

### User Dashboard & Account Management
- **Functionality**: Comprehensive dashboard for authenticated users to manage all their activities in one place
- **Purpose**: Provide users with a centralized hub to view and manage bookings, properties, reviews, and account settings
- **Trigger**: User clicks on their profile avatar → Selects "My Dashboard" from dropdown menu
- **Progression**: Click dashboard → View overview with quick stats → Navigate between tabs (Overview, Bookings, Properties, Reviews) → Manage individual items → Access settings → Sign out
- **Success criteria**: Fast tab switching, accurate stats display, easy item management, responsive layout, clear navigation

### My Bookings Management
- **Functionality**: View all user's property reservations with detailed information and ability to cancel bookings
- **Purpose**: Help users track their rental reservations and manage their booking history
- **Trigger**: User opens dashboard → Navigates to Bookings tab
- **Progression**: View bookings list → Expand booking for details → View property → Cancel booking if needed → Confirm cancellation
- **Success criteria**: Clear booking status indicators, expandable details, easy cancellation, real-time updates

### My Properties Management
- **Functionality**: Property owners can view and manage all their listed properties with performance analytics
- **Purpose**: Enable owners to track property performance, manage availability, and view bookings for their properties
- **Trigger**: User opens dashboard → Navigates to Properties tab
- **Progression**: View properties list → See performance metrics → Toggle availability → View property bookings → Edit or delete property
- **Success criteria**: Clear analytics display, easy availability toggle, property booking tracking, delete confirmation

### My Reviews Management
- **Functionality**: Users can view all reviews they've written and delete them if desired
- **Purpose**: Allow users to track their review history and manage their feedback
- **Trigger**: User opens dashboard → Navigates to Reviews tab
- **Progression**: View reviews list → See property details → View associated property → Delete review if needed
- **Success criteria**: Chronological review display, easy property navigation, simple deletion with confirmation

### Favorites/Wishlist System
- **Functionality**: Users can save properties to a favorites list for easy access later
- **Purpose**: Allow users to create a shortlist of properties they're interested in without losing track
- **Trigger**: User clicks heart icon on property card
- **Progression**: Click heart icon → Property added to favorites → View favorites badge in header → Filter to show only favorites
- **Success criteria**: Instant visual feedback, persistent storage across sessions, easy access to view all favorites

### Advanced Sorting
- **Functionality**: Sort properties by newest, price (low to high, high to low), bedrooms, or area
- **Purpose**: Help users find properties that match their priorities beyond basic filtering
- **Trigger**: User selects sort option from dropdown
- **Progression**: Select sort criteria → Results reorder instantly → Visual confirmation of active sort
- **Success criteria**: Smooth reordering animation, clear indication of current sort, multiple useful sort options

### Property Search & Filtering
- **Functionality**: Filter properties by location, price range, property type, and amenities
- **Purpose**: Help users narrow down options to find properties matching their specific needs
- **Trigger**: User interacts with search bar or filter controls
- **Progression**: Enter search criteria → Apply filters → See filtered results update in real-time → Refine filters as needed
- **Success criteria**: Instant visual feedback, clear active filter indicators, easy filter reset option

### Image Gallery
- **Functionality**: Full-screen image viewer with navigation through property photos
- **Purpose**: Allow users to view property images in detail
- **Trigger**: User clicks on property image in detail view
- **Progression**: Click image → Gallery opens full-screen → Navigate with arrows or dots → Close to return
- **Success criteria**: Smooth transitions, keyboard navigation support, clear close/navigation controls

### Dark Mode
- **Functionality**: Toggle between light and dark color schemes
- **Purpose**: Provide comfortable viewing in different lighting conditions and user preferences
- **Trigger**: User clicks theme toggle button in header
- **Progression**: Click theme toggle → Smooth transition to dark/light mode → Preference saved
- **Success criteria**: Seamless color transitions, all components properly styled in both modes, persistent preference

### Share Property
- **Functionality**: Share property listings via native share or copy link to clipboard
- **Purpose**: Enable viral growth and help users share interesting properties with others
- **Trigger**: User clicks share icon in property detail modal
- **Progression**: Click share → Native share dialog (if available) or copy link → Confirmation toast
- **Success criteria**: Works across devices, fallback to clipboard copy, clear success feedback

### Contact Form
- **Functionality**: Send inquiry message to property owner
- **Purpose**: Core business function connecting potential renters with property owners
- **Trigger**: User clicks "Contact Owner" button in property detail modal
- **Progression**: Click contact button → Fill form (name, email, phone, message) → Submit → Confirmation
- **Success criteria**: Clear form validation, pre-filled message template, success confirmation

### Add New Property Listing
- **Functionality**: Property owners can create new rental listings with photos, description, price, rental term (short-term/long-term), and details
- **Purpose**: Enable property owners to showcase their rentals to potential tenants
- **Trigger**: User clicks "List Property" or similar action button
- **Progression**: Click add property → Select rental term (short-term/long-term) → Fill form with details → Upload photos → Preview listing → Publish
- **Success criteria**: Intuitive form layout, clear rental term selection, clear validation messages, successful submission confirmation

### Property Booking & Reservation ⭐ ENHANCED
- **Functionality**: Users can reserve properties with calendar date selection for short-term rentals or duration selection for long-term rentals. Long-term rentals offer flexible payment options allowing clients to choose between deposit-only reservation or full upfront payment (first month rent + deposit).
- **Purpose**: Core business function allowing renters to book properties with payment via bank transfer, providing financial flexibility for long-term lease agreements
- **Trigger**: User clicks "Reserve Now" button in property detail modal
- **Progression**: Click reserve → Select dates (short-term) or duration in months/years (long-term) → **[Long-term only] Choose payment option (deposit-only or full payment)** → Enter customer details → View invoice with bank transfer details showing amount due based on selected option → Confirm booking
- **Success criteria**: Calendar blocks already-booked dates for short-term, duration selector for long-term, clear payment option selection for long-term rentals, clear pricing calculation with payment breakdown, complete payment invoice with bank details showing correct amount due, booking confirmation with saved payment preference

**Payment Options for Long-term Rentals**:
- **Deposit Only**: Client pays security deposit equal to one month's rent to reserve the property, then pays monthly rent separately
- **Full Payment**: Client pays first month's rent plus security deposit upfront for immediate move-in
- Visual radio button selection with clear pricing display for each option
- Invoice dynamically updates to show breakdown based on selected payment option
- Payment preference saved with booking for landlord reference

### Property Details View
- **Functionality**: Detailed view of individual property with gallery, amenities, description, rental term badge, booking options, contact information, reviews, analytics, and similar properties
- **Purpose**: Provide comprehensive information to help renters make informed decisions and easily book or inquire
- **Trigger**: User clicks on a property card from the listing grid
- **Progression**: Click property → View hero image → See rental term (short/long-term) → Scroll through details → Review amenities → Read reviews → See similar properties → Reserve property or contact owner
- **Success criteria**: All relevant information easily accessible, clear rental term indication, prominent booking button, professional presentation

### Reviews & Ratings System ⭐ ENHANCED
- **Functionality**: Comprehensive review system with category ratings (cleanliness, location, communication, value, accuracy), verified booking badges, landlord responses, helpful votes, filtering, and sorting
- **Purpose**: Build trust through detailed feedback, enable property owners to respond to reviews, and help users make informed decisions based on comprehensive ratings
- **Trigger**: User clicks "Write Review" button in property detail page, or property owner clicks "Respond" on a review
- **Progression**: 
  - **Submit Review**: Click write review → Rate overall (1-5 stars) → Rate 5 categories (cleanliness, location, communication, value, accuracy) → Enter name (if not logged in) → Write detailed comment → Submit → Review appears with verified badge if user has booking
  - **View Reviews**: See average rating → View rating breakdown chart → See category averages → Filter by star rating (all/5/4/3/2/1) → Sort by (recent/highest/lowest/helpful) → View detailed reviews with category breakdowns
  - **Vote on Reviews**: Click thumbs up/down to mark review as helpful → Vote count updates
  - **Landlord Response**: Property owner views review → Clicks "Respond" → Writes response → Posts → Response appears under review → Reviewer gets notification
- **Success criteria**: Category ratings provide detailed feedback, landlord responses show engagement, helpful votes highlight quality reviews, verified badges build trust, filtering/sorting helps users find relevant reviews, rating breakdown shows distribution, responsive layout on mobile

### Property Analytics
- **Functionality**: Track views, favorites, and contact requests for each property
- **Purpose**: Provide valuable insights to property owners about interest levels
- **Trigger**: Automatically tracked when users view, favorite, or contact about properties
- **Progression**: User interacts with property → Analytics updated → Owner sees engagement metrics in detail modal
- **Success criteria**: Accurate tracking, clear visualization, total engagement metric

### Similar Properties Recommendation
- **Functionality**: Intelligent recommendation of similar properties based on type, price, location, size, and amenities
- **Purpose**: Keep users engaged and help them discover alternatives
- **Trigger**: Displayed automatically at bottom of property detail modal
- **Progression**: User views property → Scrolls to bottom → Sees 3-4 similar properties → Clicks to explore
- **Success criteria**: Relevant recommendations, diverse but similar options, smooth navigation to recommended properties

### Interactive Map View
- **Functionality**: Visual representation of all properties on an interactive map with clustering, filtering, and property details
- **Purpose**: Help users discover properties based on geographic location and visualize property distribution
- **Trigger**: User clicks "Map View" button in navigation or homepage
- **Progression**: Navigate to map → View property markers/clusters → Zoom/pan to explore → Filter properties → Click marker to see details → View full property details
- **Success criteria**: Smooth map interactions, accurate property locations, responsive clustering at different zoom levels, clear property markers, integrated filtering, property tooltips on marker hover

### Map Clustering & Property Markers
- **Functionality**: Dynamically cluster nearby properties at lower zoom levels, show individual markers at higher zoom levels with property type icons
- **Purpose**: Prevent visual clutter and provide intuitive navigation at any zoom level
- **Trigger**: User zooms in/out on map view
- **Progression**: View clusters at city level → Zoom in → Clusters split into smaller groups → Zoom further → Individual markers appear with type icons
- **Success criteria**: Smart clustering algorithm, clear cluster count display, smooth transitions between zoom levels, distinct property type icons (house, apartment, studio, condo)

### Map Property Filtering
- **Functionality**: Apply filters to map view to show only relevant properties with real-time updates
- **Purpose**: Allow users to narrow down property search while maintaining geographic context
- **Trigger**: User opens filter panel in map view and adjusts filters
- **Progression**: Open filters → Select property type → Set rental term → Adjust price range → Select bedrooms → See map update in real-time
- **Success criteria**: Instant map updates, filter count display, easy filter reset, visual indication of active filters

### Split View Mode
- **Functionality**: Toggle between map-only view and split view showing map alongside property list
- **Purpose**: Provide flexibility in how users explore properties geographically
- **Trigger**: User toggles view mode in map page header
- **Progression**: Open map view → Toggle split view → See selected property details in sidebar → Scroll property list → Click property to highlight on map
- **Success criteria**: Smooth view transitions, synchronized selection between map and list, responsive layout on mobile

### Price History & Market Insights
- **Functionality**: Display historical price data for properties with visual charts and comparative market analysis
- **Purpose**: Help renters make informed decisions by understanding price trends and market positioning
- **Trigger**: Automatically displayed on property details page below reviews section
- **Progression**: View property details → Scroll to price history → See historical chart → Review market insights → Compare with similar properties → Set price alert
- **Success criteria**: Clear trend visualization, accurate market comparisons, actionable insights, price alert creation

### Price Alert System
- **Functionality**: Users can create custom price alerts for properties they're interested in
- **Purpose**: Notify users when property prices change according to their specified conditions
- **Trigger**: User clicks "Set Price Alert" button on property details page or in sidebar
- **Progression**: Click set alert → Choose condition (below/above/drops by) → Enter target price or percentage → Enable email notifications → Confirm → View in dashboard alerts tab
- **Success criteria**: Flexible alert conditions, easy setup, persistent storage, dashboard management, triggered status indicators

### Saved Searches with Alerts
- **Functionality**: Users can save their search criteria and receive notifications when new properties match their filters
- **Purpose**: Keep users engaged by automatically notifying them of relevant new listings without requiring manual searches
- **Trigger**: User applies filters on homepage → Clicks "Save Current" button in Saved Searches panel
- **Progression**: Apply search filters → Click save → Name the search → Enable/disable alerts → Choose alert frequency (instant/daily/weekly) → Save → Receive notifications for matching properties → View match count → Load saved search to see results
- **Success criteria**: Easy search saving, flexible alert frequencies, accurate property matching, match count tracking, quick search loading, edit/delete functionality, dashboard management

### Search Alert Management
- **Functionality**: Comprehensive dashboard panel for managing saved searches and notification preferences
- **Purpose**: Give users full control over their search alerts with detailed preferences and match tracking
- **Trigger**: User navigates to Dashboard → Clicks Alerts tab → Views search alerts section
- **Progression**: View dashboard → Navigate to alerts → See active/inactive searches → Toggle alert on/off → Edit alert frequency → View new match count → Load search to view results → Delete unwanted searches
- **Success criteria**: Clear active/inactive separation, instant toggle, frequency editing, match count badges, one-click search loading, easy deletion with confirmation


### Notification Center
- **Functionality**: Centralized notification hub with real-time alerts for messages, bookings, price drops, reviews, and property updates
- **Purpose**: Keep users informed of important events and activities related to their account
- **Trigger**: User clicks bell icon in header navigation
- **Progression**: Click notification bell → View notification list with unread count → Read notification details → Click notification to navigate to related content → Mark as read or delete individual notifications → Mark all as read or clear all
- **Success criteria**: Real-time notifications, unread badge counter, categorized by type with icons, timestamp display, click to navigate, persistent storage, notification filtering by type, empty state guidance

### Photo Enhancement AI
- **Functionality**: AI-powered photo enhancement tools to improve property listing images with automated and manual adjustments
- **Purpose**: Help property owners create professional-looking listings by enhancing their photos without needing photo editing expertise
- **Trigger**: User clicks "Enhance" button next to image URL field when adding/editing property, or manages photos through Photo Gallery Manager
- **Progression**: Add image URL → Click Enhance button → Select enhancement options (Auto Enhance, Brighten, Darken, Contrast, Vibrance, Sharpen, Denoise) → Preview enhanced image with side-by-side comparison → Apply enhancement → Photo updated → Batch enhance multiple photos in gallery manager
- **Success criteria**: One-click auto enhancement, manual control options, real-time preview, side-by-side comparison view, AI-generated enhancement descriptions, batch processing support, seamless integration with property listing flow, professional results that increase listing appeal

### Multi-Language Support
- **Functionality**: Complete internationalization with support for 8 languages (English, Spanish, French, German, Chinese, Japanese, Portuguese, Arabic)
- **Purpose**: Make RentHub accessible to users worldwide by providing a fully localized experience in their preferred language
- **Trigger**: User clicks language switcher (globe icon) in header or changes language in profile settings
- **Progression**: Click language switcher → Select preferred language from dropdown with flags and native names → Interface instantly updates to selected language → Language preference saved automatically → RTL layout support for Arabic
- **Success criteria**: Real-time language switching without page reload, comprehensive translation coverage across all features (navigation, properties, bookings, messages, dashboard), persistent language preference, RTL support, visual language indicators with flags, integrated in user profile settings

## Edge Case Handling
- **Trigger**: Displayed automatically in property detail modal
- **Progression**: View property details → Scroll to similar properties → Click on similar property → View new property details
- **Success criteria**: Relevant matches, smooth navigation between properties, up to 3 recommendations

### AI-Powered Natural Language Search
- **Functionality**: Search properties using natural language descriptions powered by GPT-4
- **Purpose**: Revolutionary search experience that understands user intent and preferences
- **Trigger**: User clicks "AI Search" button in header
- **Progression**: Click AI Search → Describe desired property naturally → AI analyzes and matches → View filtered results → Clear filter if needed
- **Success criteria**: Accurate understanding of queries, relevant results, graceful handling of no matches, clear feedback

### Advanced NLP Chatbot ⭐ NEW
- **Functionality**: Intelligent AI assistant with advanced natural language processing, intent recognition, entity extraction, sentiment analysis, and contextual conversation management
- **Purpose**: Provide highly personalized property search assistance through sophisticated conversation that understands user needs, remembers context, and adapts responses based on sentiment
- **Trigger**: User clicks floating chat button in bottom-right corner
- **Progression**: Click chat button → AI greets with introduction → User asks in natural language → AI analyzes intent, extracts entities (location, price, bedrooms, amenities), detects sentiment → AI maintains conversation context → Provides property recommendations → Shows suggested properties inline → User can click to view details → Context persists across messages → AI adapts tone based on user sentiment
- **Success criteria**: Accurate intent classification (search/question/comparison/booking/recommendation/complaint), precise entity extraction, context retention across conversation, sentiment-aware responses, relevant property suggestions, seamless property navigation

**Advanced NLP Features**:
- **Intent Recognition**: Classifies user messages into 9 categories (search, question, comparison, booking, recommendation, information, greeting, complaint, unknown) with confidence scores
- **Entity Extraction**: Automatically identifies and extracts location, price ranges, property types, bedroom counts, amenities, rental terms, dates, and area preferences from natural language
- **Sentiment Analysis**: Analyzes emotional tone (-1 to 1 scale) and adjusts response accordingly - empathetic for complaints, enthusiastic for positive sentiment
- **Contextual Memory**: Maintains conversation history and builds user preference profile across messages - remembers location, budget, property type, bedroom needs, and amenities mentioned
- **Smart Clarification**: Detects when user intent is unclear and asks targeted clarification questions
- **Property Filtering**: Automatically filters available properties based on extracted preferences and conversation context
- **Visual Insights Toggle**: Optional technical view showing detected intent, sentiment scores, extracted entities, and confidence levels for transparency
- **Inline Property Cards**: Displays matching properties directly in chat with images, key details, and one-click navigation
- **Context Indicators**: Shows active search context (location, type, bedrooms, budget) below chat input for transparency
- **Multi-turn Conversations**: Handles follow-up questions, comparisons, and refinements naturally without losing context
- **Adaptive Responses**: Generates contextually appropriate responses based on intent type - helpful for questions, enthusiastic for searches, comparative for comparisons

**Component Design**:
- Floating gradient button with message count badge
- Expanded chat window with gradient header
- AI assistant avatar with brain icon
- Insights panel showing NLP analysis (intent, sentiment, entities)
- Color-coded message bubbles based on sentiment
- Inline property cards with images and quick view
- Context badge display for active preferences
- Smooth animations and transitions
- Mobile-responsive design

### AI Chat Assistant
- **Functionality**: Real-time conversational AI assistant that helps users find properties, answers questions, and provides recommendations
- **Purpose**: Provide instant, personalized assistance through natural conversation about rental properties
- **Trigger**: User clicks floating chat button in bottom-right corner
- **Progression**: Click chat button → Chat window opens → User types question → AI responds with helpful information and property recommendations → User can ask follow-up questions → Close chat when done
- **Success criteria**: Fast AI responses, context-aware answers about properties, friendly conversational tone, smooth animations, accessible from all pages

### Property Comparison Tool
- **Functionality**: Compare 2-3 properties side-by-side in a detailed comparison table
- **Purpose**: Help users make informed decisions by directly comparing key features and amenities
- **Trigger**: User clicks compare icon on property cards
- **Progression**: Click compare on properties (up to 3) → Click compare badge in header → View side-by-side comparison → Remove properties or view details → Make decision
- **Success criteria**: Clear visual comparison, easy to add/remove properties, all key attributes compared, amenities checklist

### Recently Viewed Properties
- **Functionality**: Track and display the last 10 properties viewed by the user
- **Purpose**: Allow users to quickly return to properties they've previously explored
- **Trigger**: Automatically tracked when viewing property details
- **Progression**: View property → Property added to recently viewed → Access from sidebar panel → Click to re-open property
- **Success criteria**: Automatic tracking, persistent storage, chronological order, clear history option

### Saved Searches
- **Functionality**: Save filter combinations with custom names and quickly reload them
- **Purpose**: Enable users to save and reuse complex search criteria without re-entering filters
- **Trigger**: User clicks "Save Current" in saved searches panel
- **Progression**: Apply filters → Save search with name → Access from sidebar → Load saved search → Share search link
- **Success criteria**: Easy to save/name, persistent storage, one-click reload, shareable via URL

### Roommate Matching
- **Functionality**: AI-powered compatibility-based roommate matching with swipe-style interface
- **Purpose**: Help users find compatible roommates based on lifestyle, budget, and preferences
- **Trigger**: User clicks "Roommates" in navigation
- **Progression**: Create profile with preferences → Browse potential matches → Like or pass profiles → Match when both like each other → View compatibility score → Start conversation → Find housing together
- **Success criteria**: Intuitive profile creation, accurate compatibility scoring, smooth card animations, clear match indicators, AI-powered recommendations

### Smart Recommendations Engine
- **Functionality**: Intelligent property recommendations based on viewing history, favorites, and user preferences with AI-generated explanations
- **Purpose**: Help users discover properties they're likely to love through advanced matching algorithms
- **Trigger**: Automatically displayed on homepage after viewing properties or adding favorites
- **Progression**: View properties → Add favorites → Smart recommendations panel appears → Browse categorized recommendations (Perfect Match, Great Fit, New Listings) → See match scores and reasons → Read AI-generated explanations → Click to view property
- **Success criteria**: Accurate recommendations, clear match reasons, personalized AI insights, categorized by match quality, updated in real-time based on user behavior, seamless integration with property cards

### Email Notification Service
- **Functionality**: Real-time email notifications sent to users for important platform events (bookings, messages, reviews, price alerts, etc.)
- **Purpose**: Keep users informed about critical activities even when they're not actively using the platform
- **Trigger**: Automatic on relevant events (booking created, message received, review posted, etc.) OR manual configuration in dashboard
- **Progression**: Access Dashboard → Navigate to Email tab → Configure SMTP settings (Gmail, SendGrid, Mailgun, etc.) → Enable email service → Customize notification preferences → Receive beautiful HTML emails → View email logs → Monitor delivery status
- **Success criteria**: Professional email templates, successful SMTP integration, user preference controls, delivery tracking, support for 10+ notification types, integration with all major platform events, robust error handling

## Edge Case Handling
- **No Properties Available**: Display elegant empty state with call-to-action to add first property
- **No Search Results**: Show helpful message with suggestions to adjust filters, option to clear all filters
- **No Favorites Yet**: When favorites filter is active but list is empty, show encouraging message to start favoriting
- **No Recently Viewed**: Panel doesn't display if history is empty
- **No Saved Searches**: Empty state encourages users to save their first search
- **Invalid Booking Dates**: Prevent selecting already-booked dates for short-term rentals with calendar blocking
- **Zero Duration**: Prevent booking submission if no rental duration is selected for long-term rentals
- **Missing Customer Details**: Validate all customer information before proceeding to payment invoice
- **Comparison Limit**: Prevent adding more than 3 properties to comparison with toast notification
- **Missing Property Images**: Use attractive placeholder images that maintain visual consistency
- **Long Property Descriptions**: Implement "Read more" expansion to keep cards uniform
- **Slow Image Loading**: Show skeleton loaders to maintain layout stability
- **Form Validation Errors**: Inline validation with constructive guidance, prevent submission until resolved
- **Browser Share API Unavailable**: Gracefully fallback to clipboard copy with appropriate messaging
- **Theme Preference**: Respect system theme preference on first visit, save user's choice for subsequent visits
- **User Not Authenticated**: Show sign in button, allow browsing without auth, prompt for login on booking attempts
- **Authentication Failure**: Display friendly error message, provide retry option
- **No User Preferences Set**: Use default filter values, encourage users to set preferences via profile
- **No User Bookings**: Display elegant empty state encouraging users to browse properties
- **No User Properties**: Show encouraging message with call-to-action to list first property
- **No User Reviews**: Display inviting empty state suggesting users write their first review
- **Property Owner Deletion**: Confirm deletion with warning that action cannot be undone
- **Booking Cancellation**: Confirm cancellation before processing, update booking status instead of deleting
- **Review Deletion**: Confirm deletion before removing review from system
- **AI Chat Error**: Gracefully handle API failures with friendly error message, allow retry
- **AI Chat Empty Input**: Disable send button when message input is empty
- **AI Chat Loading State**: Show animated typing indicator while AI processes response
- **No Properties on Map**: Display empty state with message encouraging filter adjustments
- **Map Load Failure**: Show error state with retry button, fallback to list view option
- **Properties Without Coordinates**: Assign approximate coordinates based on location name, add small random offset for visual separation
- **Single Property in Cluster**: Display as individual marker rather than cluster
- **Too Many Properties**: Show cluster with count, require zoom for individual markers
- **Mobile Map Interaction**: Optimize touch gestures for zoom/pan, larger tap targets for markers
- **Slow Map Rendering**: Show loading skeleton, lazy load property details on marker interaction
- **Price History Not Available**: If property is new (less than 7 days), show message that history is being generated
- **No Similar Properties for Market Insights**: Display message that market analysis isn't available yet with property count
- **Invalid Price Alert Values**: Validate target price and percentage inputs, prevent negative or zero values
- **Duplicate Price Alerts**: Allow multiple alerts per property with different conditions
- **Price Alert Already Triggered**: Show "Triggered" badge in alerts dashboard, keep alert active for future changes
- **Too Many Price Alerts**: No hard limit, but group by property in dashboard for better organization
- **No Notifications**: Display elegant empty state with bell icon and encouraging message
- **Only Unread Filter Active with No Unread**: Show message that all notifications have been read
- **Notification for Deleted Property**: Handle gracefully by showing notification but disabling property link
- **Rapid Notification Creation**: Batch notifications to prevent overwhelming users, group similar events
- **Notification Navigation**: Clear indication when notification link is unavailable or expired
- **No Roommate Profile**: Show create profile prompt with benefits explanation
- **User Not Signed In (Roommates)**: Display sign-in requirement with feature preview
- **No More Profiles to View**: Show empty state encouraging checking back later
- **No Liked Profiles**: Display encouraging message to start discovering
- **No Mutual Matches**: Show empty state explaining mutual match concept
- **Match Already Has Conversation**: Navigate to existing conversation instead of creating new one
- **Incomplete Profile**: Require minimum fields (bio, location, budget) before showing matches
- **No Recommendations**: Display encouraging message when no viewing history or favorites exist yet
- **AI Recommendation Errors**: Gracefully degrade to simple match scores if AI fails to generate explanations
- **Loading Recommendations**: Show skeleton loaders while calculating match scores
- **Low Match Scores**: Only display properties with scores above threshold (minimum viable match)
- **Photo Enhancement Errors**: Gracefully handle AI API failures with friendly error message, allow retry
- **Invalid Image URLs**: Validate URL format before allowing enhancement, provide clear error feedback
- **Missing Images for Enhancement**: Disable enhancement button when no image URL is provided
- **Too Many Photos**: No hard limit but recommend 6-10 photos for optimal listing performance
- **Photo Enhancement Loading**: Show animated progress indicator while AI processes enhancements
- **Batch Enhancement Failure**: If some images fail in batch, enhance successful ones and report failures
- **Enhanced Photo Preview**: Always show side-by-side comparison before applying to prevent unwanted changes
- **Email SMTP Configuration Invalid**: Validate SMTP settings before enabling, provide clear error messages
- **Email Send Failure**: Log failures with error details, allow retry, don't block main operations
- **Missing User Email**: Skip email notification gracefully if recipient email not available
- **User Disabled Email Notifications**: Respect user preferences and skip sending specific notification types
- **Email Service Disabled**: Don't attempt to send emails when service is globally disabled
- **SMTP Connection Timeout**: Handle timeouts gracefully with retry logic and user feedback
- **Email Template Rendering Error**: Fallback to plain text version if HTML rendering fails
- **Too Many Emails**: Implement rate limiting to prevent spam, batch similar notifications
- **Invalid Email Addresses**: Validate email format before attempting to send
- **Email Logs Full**: Limit to last 100 emails, automatically purge older entries

## Design Direction

The design should feel ultra-modern, luxurious, and cutting-edge - evoking the quality of premium digital products with glassmorphism, gradient accents, and fluid animations. The interface balances minimalism with rich visual details, using subtle gradients, backdrop blur effects, and generous spacing to create a sophisticated, high-end aesthetic that feels both professional and inviting.

## Color Selection

Complementary color scheme with vibrant blues and warm orange accents, enhanced with gradient treatments and transparency effects to create depth and visual interest.

- **Primary Color**: Vibrant sophisticated blue `oklch(0.42 0.15 255)` - communicates trust and modernity with higher saturation for a contemporary feel
- **Secondary Colors**: Ultra-light gray `oklch(0.96 0.008 250)` for backgrounds with subtle warmth, creating a clean canvas that enhances content
- **Accent Color**: Warm vibrant orange `oklch(0.65 0.18 35)` for calls-to-action - energetic and inviting, creates strong visual contrast with primary
- **Background**: Soft off-white `oklch(0.98 0.005 250)` with gradient overlays for depth and visual interest (dark mode: `oklch(0.13 0.01 250)`)
- **Foreground/Background Pairings**:
  - Light Mode Background (Soft Off-White `oklch(0.98 0.005 250)`): Dark text `oklch(0.20 0.015 250)` - Ratio 15.1:1 ✓
  - Light Mode Card (Pure White `oklch(1 0 0)`): Dark text `oklch(0.20 0.015 250)` - Ratio 16.2:1 ✓
  - Light Mode Primary (Vibrant Blue `oklch(0.42 0.15 255)`): White text `oklch(0.99 0 0)` - Ratio 8.2:1 ✓
  - Dark Mode Background (Deep Slate `oklch(0.13 0.01 250)`): Light text `oklch(0.97 0.005 250)` - Ratio 16.8:1 ✓
  - Dark Mode Card (Dark Slate `oklch(0.16 0.012 250)`): Light text `oklch(0.97 0.005 250)` - Ratio 15.2:1 ✓
  - Dark Mode Primary (Bright Blue `oklch(0.55 0.18 260)`): White text `oklch(0.99 0 0)` - Ratio 6.1:1 ✓
  - Accent (Warm Orange `oklch(0.65 0.18 35)`): White text `oklch(0.99 0 0)` - Ratio 5.8:1 ✓

## Font Selection

Typography should convey modern professionalism with excellent readability - using a clean geometric sans-serif that feels contemporary and approachable while maintaining the sophistication expected in real estate.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Bold / 36px / -0.02em letter spacing / 1.2 line height
  - H2 (Section Headers): Inter SemiBold / 28px / -0.01em letter spacing / 1.3 line height
  - H3 (Card Titles): Inter SemiBold / 20px / normal letter spacing / 1.4 line height
  - Body (Descriptions): Inter Regular / 16px / normal letter spacing / 1.6 line height
  - Small (Metadata): Inter Medium / 14px / normal letter spacing / 1.5 line height
  - Price Display: Inter Bold / 24px / -0.01em letter spacing / 1.2 line height

## Animations

Animations should feel premium and fluid, creating a sense of luxury and polish - smooth transitions with elastic easing communicate quality and attention to detail. Each interaction should feel responsive and delightful, using staggered animations and natural physics to guide user attention and create moments of joy.

- **Purposeful Meaning**: Fluid transitions with elastic easing create premium feel; property cards lift with shadow enhancement on hover; gradient overlays fade in smoothly; staggered entry animations for property grids create visual flow; modal overlays use backdrop blur with gentle scale and fade
- **Hierarchy of Movement**: Property images use subtle scale transforms (1.08x) with long durations; card hover states lift 8px with shadow transitions; staggered grid animations (80ms delays) create cascading effect; form inputs show subtle border color transitions; loading states use floating animations with infinite loops

## Component Selection

- **Components**: 
  - Cards with glassmorphism effects using backdrop-blur and transparency, enhanced hover states with shadow and lift animations
  - Dialog modals with backdrop blur and gradient overlays for premium feel
  - Input, Select with enhanced focus states, gradient borders on interaction
  - Calendar component for short-term rental date selection with blocked dates
  - Badge components with gradient backgrounds and shadows, including rental term badges
  - Button variants with gradient fills, shadow effects, and hover animations
  - Skeleton loaders with shimmer effects
  - Enhanced spacing with icon containers using colored backgrounds
  - Heart icon for favorites with fill animation and persistent state
  - Full-screen image gallery with navigation
  - Contact form modal with validation
  - Booking modal with multi-step flow (details → invoice)
  - Theme toggle with smooth transitions
  - Share functionality with native API support
  - Sort dropdown with multiple options
  - Reviews section with star ratings and user comments
  - Property analytics panel with engagement metrics
  - Similar properties recommendation grid
  - AI search modal with natural language input
  - Staggered animations for review entries
  - Interactive map with D3 visualization
  - Property markers with custom icons per type
  - Cluster markers with dynamic sizing based on property count
  - Map zoom controls with smooth transitions
  - Map recenter button for quick navigation
  - Property tooltip cards on marker hover
  - Split view layout with synchronized selection
  - Map filter panel with real-time updates
  - View mode toggle (map only vs split view)
  - Smart recommendations panel with categorized matches
  - Recommendation cards with match scores and AI insights
  - Tabbed interface for recommendation categories
  - Horizontal scrollable recommendation grids
  - Match percentage badges with color coding
  - AI-generated property explanations with sparkle icon
  
- **Customizations**: 
  - Custom gradient backgrounds for header logo and buttons
  - Glassmorphic cards with backdrop-blur-sm and transparency
  - Enhanced property cards with animated hover states and heart favorites
  - Gradient text treatments for headings using bg-clip-text
  - Icon containers with colored backgrounds for visual hierarchy
  - Staggered animation system for grid items
  - Enhanced empty states with floating animations
  - Full-screen image gallery with backdrop blur and navigation controls
  - Dark mode with smooth color transitions
  - Favorites badge counter in header
  - Share button with fallback to clipboard
  
- **States**: 
  - Buttons: Gradient backgrounds with shadow effects, hover enhances shadows and adjusts gradient, scale preserved for premium feel
  - Cards: Lift 8px on hover with enhanced shadow (shadow-2xl), border opacity changes, image scales 1.08x with gradient overlay fade-in
  - Inputs: Border transitions to primary color with glow effect, background opacity changes
  - Filters: Active state with gradient accents, count badges with gradient backgrounds
  - Heart icon: Toggles between outline and filled with color change animation, synced across card and detail view
  - Theme toggle: Icon animates between sun and moon, smooth color transitions across entire UI
  - Gallery: Full-screen overlay with navigation, image transitions with scale and fade
  - Sort bar: Displays result count and active sort option
  
- **Icon Selection**: 
  - MagnifyingGlass (bold weight) for search emphasis
  - Sliders for filters on mobile
  - Funnel (bold weight) for desktop filters
  - House (duotone) with MagnifyingGlass for empty states
  - Buildings (bold) with gradient container for logo
  - Plus (bold) for adding properties
  - Heart for favorites with animation (outline/fill states)
  - Sparkle (fill) for special highlights
  - EnvelopeSimple for contact actions
  - Check (bold) in colored containers for amenities
  - ShareNetwork for sharing properties
  - Moon/Sun for theme toggle
  - Images for gallery trigger
  - SortAscending for sort bar
  - CaretLeft/CaretRight for gallery navigation
  - User, Phone for contact form
  - PaperPlaneRight for form submission
  - Star (fill/outline) for reviews and ratings
  - Eye, TrendUp for analytics
  - MagicWand for AI search feature
  - Scales for property comparison
  - Clock for recently viewed
  - BookmarkSimple for saved searches
  - FloppyDisk for save actions
  - ShareNetwork for sharing searches
  - CalendarCheck (bold) for booking/reservation actions
  - CalendarBlank (fill) for short-term calendar selection
  - CreditCard (fill) for payment invoice
  - User, Envelope, Phone for customer details forms
  - SignIn, SignOut for authentication actions
  - UserCircle for user profile/account
  - Gear for settings and preferences
  - SquaresFour for dashboard
  - Pencil for edit actions
  - Trash for delete actions
  - CheckCircle/XCircle for status indicators
  - MapPin for location display
  - ChatCircle for reviews section
  - TrendUp/TrendDown (bold) for price trends and market analysis
  - ChartLine (duotone) for price history visualization
  - Bell (duotone/fill) for price alerts and notifications
  - CurrencyDollar for pricing information
  - CheckCircle (fill) for fairly priced indicator
  - WarningCircle (fill) for market analysis warnings
  - Funnel for notification filtering
  - ArrowRight for navigation to detailed views
  - Users (bold) for roommate matching navigation
  - Heart (outline/fill) for liking roommate profiles  
  - Sparkle (fill) for roommate discovery section
  - Moon/Sun for sleep schedule indicators
  - Empty for no profiles empty state
  - FileText for lease agreements and documents
  - PencilSimple for digital signature
  - Download for lease document downloads
  - Clock for pending signatures
  - Globe (duotone) for language switcher and internationalization
  - Translate for translation features
  - CheckCircle (fill) for selected language indicator
  
- **Spacing**: 
  - Container padding: px-4 sm:px-6 lg:px-8 (increased from previous)
  - Section spacing: py-12 (header 20, main sections)
  - Card internal padding: p-6 (increased for breathing room)
  - Grid gaps: gap-6 md:gap-8 (generous spacing)
  - Button heights: h-11 to h-14 for better touch targets
  - Input heights: h-12 to h-14 for prominence
  - Icon containers: w-10 h-10 to w-12 h-12 with rounded-xl
  
- **Mobile**: 
  - Mobile-first responsive grid system
  - Sheet component for mobile filters with rounded-t-2xl styling
  - Enhanced touch targets (h-12 minimum on interactive elements)
  - Simplified header with responsive logo sizing
  - Full-screen modals with proper overflow handling
  - Staggered animations preserved on mobile for delight
  - Gradient backgrounds adapt to smaller screens

## Digital Lease Agreements

**Functionality**: Complete digital lease agreement system allowing landlords and tenants to create, sign, and manage legally binding rental contracts electronically.

**Purpose**: Streamline the rental process by eliminating paper contracts, reducing turnaround time, and providing secure digital records for both parties.

**Trigger**: Landlord creates lease from confirmed booking, or manually initiates new lease agreement.

**Progression**: 
- Landlord views confirmed booking → Creates lease agreement → System auto-populates from booking details → Landlord reviews/customizes terms → Sends for signatures → Tenant receives notification → Tenant reviews lease → Both parties sign electronically → Lease becomes active → Digital copies available for download

**Success criteria**: 
- Seamless lease generation from bookings
- Clear presentation of all terms and conditions
- Simple electronic signature process (typed or drawn)
- Real-time signature status tracking
- Secure document storage and retrieval
- Compliance with digital signature laws
- Email notifications for all parties
- Easy access to active and historical leases

**Key Features**:
- Auto-generation from booking details
- Customizable lease templates
- Comprehensive financial terms display
- Property terms and conditions
- Landlord and tenant responsibilities
- Special clauses support
- Electronic signature capture (typed or drawn)
- Signature verification and timestamps
- Status tracking (draft, pending, active, expired, terminated)
- Document download as text/PDF format
- Lease renewal management
- Expiration alerts
- Multi-party signature workflow
- Lease termination with reasons
- Full audit trail of changes and signatures

## Maintenance Requests (Tenant → Landlord)

**Functionality**: Comprehensive maintenance request system allowing tenants to report property issues to landlords with full tracking, photo documentation, priority levels, and status updates throughout the resolution process.

**Purpose**: Provide a streamlined communication channel for property maintenance issues, ensuring quick response times, proper documentation, and accountability for both tenants and landlords.

**Trigger**: Tenant discovers a maintenance issue → Opens dashboard → Creates new maintenance request

**Progression**: 
- Tenant identifies issue → Navigates to Maintenance tab in dashboard → Clicks "New Request" → Selects issue category (plumbing, electrical, HVAC, appliance, structural, pest, safety, cosmetic, other) → Enters title and detailed description → Specifies location in property → Sets priority level (low, medium, high, urgent) → Adds photos (optional) → Provides access information and preferred times → Submits request → Landlord receives notification → Landlord acknowledges and updates status → Schedules repair work → Marks as completed with notes → Tenant reviews and approves work → Request closed

**Success criteria**: 
- Simple issue reporting workflow
- Clear category selection with visual icons
- Comprehensive issue documentation with photos
- Real-time status tracking for both parties
- Automated notifications at each status change
- Scheduling capabilities for maintenance visits
- Access permission management for entry
- Work completion verification by tenant
- Photo documentation before and after repair
- Priority-based request sorting
- Overdue request highlighting
- Full conversation history and updates

**Key Features**:
- **9 Issue Categories**: Plumbing, Electrical, HVAC, Appliances, Structural, Pest Control, Safety, Cosmetic, Other (each with descriptive icons)
- **Priority Levels**: Low (blue), Medium (yellow), High (orange), Urgent (red) with color-coded badges
- **Photo Upload**: Multiple photo support for documenting issues visually
- **Location Specification**: Specific area within property (e.g., "Kitchen sink", "Master bedroom")
- **Access Management**: 
  - Preferred access times
  - Special access instructions
  - Permission to enter when tenant is away
- **Status Workflow**: 
  - Submitted (initial state)
  - Acknowledged (landlord has seen it)
  - Scheduled (repair date set)
  - In Progress (work underway)
  - Completed (work done, awaiting approval)
  - Cancelled (request cancelled)
- **Updates Thread**: Chronological conversation between tenant and landlord with status change logs
- **Scheduling**: Calendar integration for setting maintenance appointments
- **Completion Documentation**: 
  - Landlord adds completion notes
  - Photo evidence of completed work
  - Tenant approval with star rating
  - Feedback mechanism
- **Filtering & Sorting**: 
  - Filter by status, priority, property
  - Sort by date, priority, or status
- **Analytics Dashboard**:
  - Active requests count
  - Urgent requests alert
  - Requests awaiting tenant approval
  - Average response time
- **Dual Views**: 
  - Tenant view: Requests I've submitted
  - Landlord view: Requests for my properties
- **Notifications**: 
  - New request alerts for landlords
  - Status update notifications for tenants
  - Scheduled appointment reminders
  - Completion approval requests
- **Overdue Tracking**: Visual indicators for overdue scheduled maintenance
- **Work Approval System**: 
  - 5-star rating for completed work
  - Approval/decline mechanism
  - Optional feedback comments
  
**Component Design**:
- Clean, card-based request list with status and priority badges
- Detailed modal view with all request information
- Separate creation modal with step-by-step category selection
- Photo grid display for multiple images
- Access information clearly presented
- Update timeline showing all communication
- Color-coded priority and status indicators throughout
- Mobile-responsive design with touch-friendly controls

## Property Management Dashboard (Advanced)

**Functionality**: Comprehensive analytics dashboard providing landlords with advanced insights into portfolio performance, revenue tracking, occupancy rates, and property health monitoring.

**Purpose**: Empower property owners and managers with data-driven insights to optimize their rental business, identify opportunities, and address issues proactively.

**Trigger**: User navigates to Dashboard → Overview tab (default view for property owners)

**Progression**: 
- View dashboard → Select time range (7d/30d/90d/all time) → Review key metrics (total revenue, average occupancy, active leases, maintenance issues) → Identify properties needing attention → Switch between Performance, Top Performers, and Portfolio Overview tabs → Click property for detailed view → Take action on insights

**Success criteria**: 
- Real-time portfolio metrics update based on selected time range
- Clear visualization of revenue, occupancy, and performance data
- Quick identification of underperforming properties
- Actionable insights for maintenance and occupancy issues
- Smooth animations and responsive design
- Intuitive navigation between different data views
- Accurate calculations across all metrics

**Key Features**:
- **Dynamic Time Range Selection**: Switch between 7 days, 30 days, 90 days, or all-time views
- **Revenue Tracking**: Total revenue across portfolio with growth percentage indicators
- **Occupancy Analytics**: 
  - Average occupancy rate across all properties
  - Individual property occupancy with color-coded status (Excellent/Good/Low)
  - Visual progress bars for quick assessment
- **Active Lease Monitoring**: Count of active leases across portfolio
- **Maintenance Overview**: 
  - Total open maintenance requests
  - Urgent issue highlighting
  - Property-specific maintenance tracking
- **Properties Needing Attention**: 
  - Automatic detection of properties with issues
  - Low occupancy alerts (< 50%)
  - Maintenance issue flagging
  - Stale listing detection (no bookings in 30+ days)
  - Quick action buttons for each flagged property
- **Performance Tab**: 
  - Comprehensive list of all properties with performance metrics
  - Revenue, occupancy rate, ratings, bookings, and views per property
  - Active lease and maintenance issue badges
  - One-click navigation to property details
- **Top Performers Tab**: 
  - Ranked list of highest revenue properties
  - Position badges (1st, 2nd, 3rd, etc.)
  - Quick comparison of top 5 performers
  - Revenue, occupancy, and booking metrics
- **Portfolio Overview Tab**: 
  - Total portfolio summary statistics
  - Average rating across all properties
  - Portfolio-wide occupancy visualization
  - Properties with active leases ratio
  - Total views, bookings, and reviews
- **Advanced Metrics**:
  - Occupancy rate calculation for short-term rentals based on booked dates
  - 100% occupancy for long-term properties with active leases
  - Average rating computation across all reviews
  - Last booked date tracking
  - Growth indicators with trend arrows
- **Visual Design**:
  - Color-coded border indicators on metric cards
  - Icon-based visual hierarchy
  - Animated entry transitions
  - Responsive grid layouts
  - Alert badges for urgent items
  - Progress bars for percentage metrics
- **Empty States**: Friendly messaging when no properties exist yet
- **Performance Optimizations**: Memoized calculations for large datasets

**Component Design**:
- Clean metric cards with color-coded left borders
- Tabbed interface for different data views
- Property cards with embedded performance data
- Warning cards for attention-needed properties
- Animated list items with staggered entry
- Responsive layouts adapting to screen sizes
- Consistent icon usage for metric types
- Badge overlays for status indicators

## Multi-Currency Support

**Functionality**: Comprehensive multi-currency system allowing users to view and compare property prices in 12 different currencies with AI-powered real-time exchange rate conversion.

**Purpose**: Make RentHub accessible to international users by allowing them to view prices in their preferred currency, eliminating mental conversion calculations and providing accurate pricing information in familiar denominations.

**Trigger**: User clicks currency selector (dollar sign icon) in header navigation

**Progression**: 
- Click currency selector → Currency dropdown opens → Browse 12 supported currencies with flags → Select preferred currency → Exchange rates fetch/convert → All prices update across platform → Selection persists → User can manually refresh rates → Rates auto-refresh hourly

**Success criteria**: 
- Seamless currency switching without page reload
- Accurate real-time conversion using current exchange rates
- Persistent currency preference across sessions
- Clear visual indication of selected currency
- Support for 12 major world currencies
- Automatic rate refresh every hour
- Manual refresh capability with loading state
- Proper locale-specific formatting for each currency
- Consistent price display across all components
- Fast conversion calculations
- Graceful fallback if rate fetching fails

**Key Features**:
- **12 Supported Currencies**: 
  - USD (US Dollar) 🇺🇸
  - EUR (Euro) 🇪🇺
  - GBP (British Pound) 🇬🇧
  - RON (Romanian Leu) 🇷🇴
  - JPY (Japanese Yen) 🇯🇵
  - CNY (Chinese Yuan) 🇨🇳
  - CAD (Canadian Dollar) 🇨🇦
  - AUD (Australian Dollar) 🇦🇺
  - CHF (Swiss Franc) 🇨🇭
  - INR (Indian Rupee) 🇮🇳
  - BRL (Brazilian Real) 🇧🇷
  - MXN (Mexican Peso) 🇲🇽

- **AI-Powered Exchange Rates**:
  - Real-time rates generated by GPT-4o-mini
  - Realistic conversion values based on current market
  - Automatic updates every hour
  - Manual refresh button with loading state
  - Fallback to default rates if AI fails
  - Timestamp showing last update time

- **Currency Selector Component**:
  - Prominent dollar icon in header
  - Shows current currency code and symbol
  - Popover dropdown with scrollable list
  - Country flag emojis for visual identification
  - Currency name and symbol display
  - Selected currency checkmark indicator
  - Last updated timestamp with relative time
  - Refresh button with animated loading
  - Smooth staggered animations on open

- **Price Display System**:
  - Dedicated `PriceDisplay` component for consistency
  - Automatic conversion from base USD
  - Locale-specific formatting (e.g., 1,000.00 vs 1.000,00)
  - Size variants (sm, md, lg, xl)
  - Optional decimal places
  - Custom styling support
  - Real-time updates on currency change

- **Conversion Engine**:
  - Base currency: USD for all stored prices
  - Accurate mathematical conversion
  - Proper rounding to 2 decimal places
  - Cross-currency conversion support
  - Efficient calculation caching

- **Persistence & Caching**:
  - Currency preference saved via useKV
  - Exchange rates cached locally
  - Last update timestamp stored
  - Offline functionality with cached rates
  - Synced across user devices

- **Integration Points**:
  - Property cards (listing prices)
  - Property detail modals
  - Booking invoices
  - Dashboard revenue metrics
  - Analytics charts
  - Price alerts
  - Market insights
  - Everywhere prices are displayed

**Component Design**:
- Clean currency selector button with icon and code
- Elegant popover with rounded corners and shadow
- Flag emojis for instant currency recognition
- Color-coded selection with primary accent
- Hover states on currency options
- Loading spinner on refresh button
- Responsive layout for mobile
- Accessible keyboard navigation
- Smooth animations and transitions

## Advanced Analytics Dashboard

**Functionality**: Comprehensive analytics dashboard with interactive charts showing revenue trends, occupancy patterns, and property performance over time. Provides landlords with visual insights through line charts, area charts, bar charts, and detailed metrics.

**Purpose**: Enable data-driven decision making by visualizing key business metrics, identifying trends, and comparing property performance. Help landlords understand revenue patterns, optimize occupancy, and track growth over time.

**Trigger**: User navigates to Dashboard → Analytics tab

**Progression**: 
- Open Analytics tab → View summary metrics (total revenue, bookings, occupancy, avg booking value) → Select time range (3/6/12 months) → Navigate between Revenue, Occupancy, and Performance tabs → Analyze revenue charts → Review occupancy trends → Compare property performance → Identify top performers → Make data-driven decisions

**Success criteria**: 
- Interactive charts with smooth animations
- Clear visualization of trends over time
- Accurate revenue and occupancy calculations
- Meaningful growth indicators
- Responsive charts across screen sizes
- Fast data processing and rendering
- Intuitive tab-based navigation
- Helpful tooltips on chart hover

**Key Features**:
- **Summary Metrics Cards**:
  - Total Revenue with growth percentage vs. previous period
  - Total Bookings with growth percentage
  - Occupancy Rate (last 30 days average)
  - Average Booking Value
  - Color-coded growth indicators (green for positive, red for negative)
  - TrendUp/TrendDown icons for visual clarity

- **Time Range Selector**: 
  - 3 months, 6 months, or 12 months views
  - Applies to all charts uniformly
  - Persistent selection across tab switches

- **Revenue Tab**:
  - **Revenue Over Time**: Area chart showing monthly revenue trends with gradient fill
  - **Revenue vs Bookings**: Dual-axis line chart comparing revenue (left axis) with booking count (right axis)
  - Smooth curves with data points
  - Custom tooltips showing formatted values

- **Occupancy Tab**:
  - **Occupancy Trends**: Bar chart showing monthly occupancy percentage
  - **Occupancy Breakdown**: Summary cards showing:
    - Total available days across all properties
    - Total booked days
    - Total available (unbooked) days
  - Percentage-based visualization
  - Color-coded bars

- **Performance Tab**:
  - **Top Performing Properties**: Horizontal bar chart ranking properties by revenue
  - **Detailed Property Cards**: Each top property shows:
    - Position badge (#1, #2, etc.)
    - Total revenue
    - Total bookings
    - Average rating with star icon
    - Occupancy rate
    - Total views
  - Expandable details with staggered animations
  - Top 5 properties featured

- **Chart Features**:
  - Recharts library integration for professional visualizations
  - Responsive containers adapting to screen width
  - Custom color palette matching app theme
  - Grid lines for easier reading
  - Axis labels with proper formatting:
    - Currency formatting for revenue ($1,234)
    - Percentage formatting for occupancy (75.5%)
    - Number formatting for counts (1,234)
  - Interactive tooltips with context-specific information
  - Smooth animations on data load
  - Legend for multi-series charts

- **Calculations**:
  - Revenue aggregated by month for selected time range
  - Occupancy calculated from booking check-in/check-out dates
  - Growth percentages comparing last 30 days vs previous 30 days
  - Average booking value: total revenue / booking count
  - Property occupancy: (booked days / available days) × 100
  - Ratings averaged across all property reviews

- **Empty States**: 
  - Friendly messages when no bookings exist
  - Helpful guidance to get started
  - Maintained layout structure

- **Performance Optimizations**:
  - Memoized calculations using useMemo
  - Efficient date range filtering
  - Optimized chart re-renders
  - Fast data aggregation algorithms

**Component Design**:
- Clean, modern chart design with theme-aware colors
- Card-based layout for sections
- Tab navigation for different chart views
- Animated metric cards with hover effects
- Color-coded status indicators
- Professional typography hierarchy
- Generous white space around charts
- Responsive grid adapting to screen sizes
- Consistent spacing and alignment
- Accessible color contrasts in charts

**Technical Implementation**:
- Uses `recharts` library for data visualization
- `date-fns` for date calculations and formatting
- Utility functions for revenue, occupancy, and performance calculations
- TypeScript interfaces for type safety
- Responsive chart containers
- Theme-aware color system using CSS variables
- Optimized rendering with React hooks

## Property Import (Bulk Upload)

**Functionality**: Comprehensive CSV/Excel import system allowing landlords to bulk upload multiple properties at once, with validation, preview, and error handling.

**Purpose**: Save time for property managers and landlords with multiple listings by enabling batch import instead of manual one-by-one entry. Streamline onboarding for large property portfolios.

**Trigger**: User clicks dropdown arrow next to "Add Property" button → Selects "Import Properties"

**Progression**: 
- Click Import Properties → Upload CSV/Excel file (drag & drop or browse) → System parses file → Validates all property data → Preview valid/invalid properties → Review errors if any → Import valid properties → Confirmation with count

**Success criteria**: 
- Support for both CSV and Excel (.xlsx, .xls) formats
- Drag-and-drop file upload with visual feedback
- Real-time parsing and validation
- Clear error messages for invalid data
- Preview interface showing valid vs invalid properties
- Batch import of all valid properties
- Downloadable template with sample data
- Field documentation in modal
- Fast processing for large files (100+ properties)

**Key Features**:
- **File Upload Interface**: 
  - Drag-and-drop zone with visual hover state
  - File browse button
  - Support for .csv, .xlsx, .xls formats
  - File type validation
  - Visual file type indicators

- **Template Download**: 
  - One-click download of sample CSV template
  - Pre-populated with 3 example properties
  - All required and optional fields included
  - Proper formatting examples
  - Field separation guidance

- **Data Parsing**: 
  - CSV parsing with quote handling
  - Excel parsing with tab/cell reading
  - Row-by-row data extraction
  - Header mapping to property fields
  - Multi-value field support (semicolon-separated for images/amenities)

- **Field Validation**: 
  - **Required Fields**: title, description, price, location, type, rentalTerm, bedrooms, bathrooms, area
  - **Optional Fields**: images, amenities, ownerName, ownerEmail, ownerPhone
  - Type checking (numbers, strings, enums)
  - Range validation (price > 0, bedrooms 0-20, etc.)
  - Email format validation
  - Property type must be: apartment, house, studio, or condo
  - Rental term must be: short-term or long-term
  - Minimum character lengths for descriptions

- **Preview Interface**: 
  - Side-by-side valid vs invalid properties
  - Color-coded status indicators (green for valid, red for errors)
  - Property cards showing key details
  - Expandable error messages per property
  - Row number tracking
  - Summary badges (X Valid, Y Errors)
  - Scroll area for large imports

- **Error Handling**: 
  - Per-property error list
  - Per-field error messages
  - Clear, actionable error descriptions
  - Invalid file format detection
  - Empty file handling
  - Graceful parsing failures
  - Option to upload different file

- **Import Process**: 
  - Progress indicator during parsing
  - Animated processing state
  - Automatic property ID generation
  - Timestamp assignment
  - Default values for views/favorites
  - Batch addition to property list
  - Success confirmation toast

- **Field Documentation**: 
  - Tabbed interface (Required / Optional fields)
  - Visual field list with icons
  - Format instructions for multi-value fields
  - Example values shown in template

**Component Design**:
- Modal dialog with multi-step flow (upload → processing → preview)
- Gradient accent colors matching app theme
- Drag-and-drop zone with border animations
- File type badges with icons
- Progress bar for processing
- Animated step transitions using framer-motion
- Scrollable preview area
- Color-coded validation cards
- Prominent action buttons
- Mobile-responsive layout
- Alert boxes for important info

**Technical Implementation**:
- Custom CSV parser with quote/comma handling
- Excel file reading via ArrayBuffer
- TypeScript interfaces for type safety
- Validation utility functions
- Row-to-Property transformation logic
- Batch state updates
- Template generation function
- File download helper

**User Experience**:
- Dropdown menu from "Add Property" button
- Clear option differentiation (single vs bulk)
- Visual file upload feedback
- Real-time validation feedback
- Clear error explanations
- One-click template download
- Fast import for valid properties
- Ability to retry with corrected file
- Success confirmation with count

