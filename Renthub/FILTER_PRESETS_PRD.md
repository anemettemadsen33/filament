# Filter Presets Feature - Product Requirements Document

Enable users to quickly apply pre-configured search filters through an intuitive preset system for discovering rental properties efficiently.

**Experience Qualities**:
1. **Effortless** - Instantly apply complex filter combinations with a single click
2. **Discoverable** - Visual preset cards make it easy to explore different property categories
3. **Empowering** - Both curated and custom presets give users flexibility and control

**Complexity Level**: Light Application (multiple features with basic state)
This feature provides a streamlined way to navigate complex filter combinations without overwhelming users, while maintaining persistence for future sessions.

## Essential Features

### Pre-Configured Filter Templates
- **Functionality**: 12 curated filter presets covering popular search scenarios (Student Housing, Family Homes, Luxury Apartments, Budget Friendly, Pet Friendly, etc.)
- **Purpose**: Eliminates the need for users to manually configure filters for common use cases
- **Trigger**: User browses the Filter Presets page or uses Quick Filter buttons on the home page
- **Progression**: User lands on page → Browses preset cards → Clicks "Apply Preset" → Filters applied → Redirected to results
- **Success Criteria**: Users can apply any preset and see appropriate filtered results within 2 seconds

### Category Organization
- **Functionality**: Presets organized into 4 categories (Popular, Lifestyle, Budget, Property Type) with visual filtering
- **Purpose**: Helps users quickly find relevant presets without scanning all options
- **Trigger**: User selects category tab or filter button
- **Progression**: View all presets → Select category → See filtered subset → Apply chosen preset
- **Success Criteria**: Category switching feels instant (<100ms) with smooth animations

### Visual Preset Cards
- **Functionality**: Each preset displayed as a card with icon, name, description, and filter summary badges
- **Purpose**: Provides clear understanding of what each preset does before applying
- **Trigger**: User views Filter Presets page
- **Progression**: Cards load with staggered animation → User reads details → Sees filter badges → Makes informed choice
- **Success Criteria**: Users understand preset behavior without needing to test it

### Quick Filter Panel
- **Functionality**: Compact horizontal scrolling panel showing popular presets on the home page sidebar
- **Purpose**: Provides immediate access to common filters without leaving the main search view
- **Trigger**: User views home page
- **Progression**: See Quick Filters panel → Scroll horizontally → Click preset → Filters applied instantly
- **Success Criteria**: Users discover and use quick filters within first session

### Search & Discovery
- **Functionality**: Search bar on Filter Presets page to find presets by name or description
- **Purpose**: Allows quick access when users know what they're looking for
- **Trigger**: User types in search field
- **Progression**: Type query → See filtered results in real-time → Find relevant preset → Apply
- **Success Criteria**: Search results update immediately as user types

### Active State Indication
- **Functionality**: Visual feedback showing which preset is currently active based on filter state
- **Purpose**: Helps users understand their current filter context
- **Trigger**: User applies preset or manually sets matching filters
- **Progression**: Apply preset → Button shows checkmark and active styling → User understands current state
- **Success Criteria**: Active state is immediately obvious without confusion

## Edge Case Handling
- **No Results Found**: When search query returns no presets, show friendly empty state with suggestions
- **Mobile Navigation**: On small screens, category buttons scroll horizontally to maintain accessibility
- **Filter Modifications**: If user modifies a preset's filters, active state is removed to indicate custom configuration
- **Route Integration**: Applying preset from dedicated page redirects back to results, while sidebar presets apply in-place

## Design Direction

The design should feel efficient and professional while remaining approachable. Think of Apple's Smart Albums or Spotify's curated playlists - purposeful collections that feel hand-picked rather than algorithmically generated. The interface should emphasize clarity and speed, with just enough visual polish to feel delightful.

Minimal interface serves the core purpose - quick decisions lead to immediate results without distraction.

## Color Selection

**Triadic** color scheme using the existing palette with each preset category having visual distinction through icon colors.

- **Primary Color (Indigo oklch(0.45 0.15 250))**: Main brand actions and active states - communicates trust and reliability
- **Secondary Colors (Muted oklch(0.96 0.005 250))**: Card backgrounds and subtle containers - provides visual rest
- **Accent Color (Green oklch(0.65 0.15 145))**: Sparkle/magic icons suggesting curation - adds energy without overwhelming
- **Foreground/Background Pairings**:
  - Background (oklch(0.98 0.005 250)): Foreground text oklch(0.20 0.01 250) - Ratio 14.2:1 ✓
  - Card (oklch(1 0 0)): Card foreground oklch(0.20 0.01 250) - Ratio 15.8:1 ✓
  - Primary (oklch(0.45 0.15 250)): Primary foreground oklch(0.99 0 0) - Ratio 8.3:1 ✓
  - Muted (oklch(0.96 0.005 250)): Muted foreground oklch(0.50 0.01 250) - Ratio 7.1:1 ✓
  - Accent (oklch(0.65 0.15 145)): Accent foreground oklch(0.99 0 0) - Ratio 5.2:1 ✓

Each preset uses a category-specific icon color (blue for students, green for families, amber for luxury, etc.) to aid visual scanning while maintaining overall coherence.

## Font Selection

**Inter** for all UI elements with purposeful typographic hierarchy that emphasizes readability and efficient scanning.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/36px/tight letter spacing - Strong entry point
  - H2 (Section Headers): Inter SemiBold/20px/normal - Clear organization
  - H3 (Preset Names): Inter SemiBold/18px/normal - Scannable cards
  - Body (Descriptions): Inter Regular/14px/1.5 line height - Readable details
  - Badge Text: Inter Medium/11px/tight - Compact information density
  - Button Text: Inter SemiBold/14px/normal - Clear actions

## Animations

Animations prioritize feedback and spatial continuity - users should feel the interface responding to their actions while maintaining performance.

- **Purposeful Meaning**: Staggered card entrance creates rhythm, active state transitions reinforce selections, category switches feel responsive
- **Hierarchy of Movement**:
  - High priority: Button hover states and active preset transitions (100-150ms)
  - Medium priority: Card entrance animations and category fades (200-300ms)
  - Low priority: Page transitions and decorative effects (400-500ms)

All animations use easing functions that feel natural (ease-out for entrances, ease-in-out for state changes).

## Component Selection

- **Components**: 
  - Card (shadcn) - Main container for preset display with hover states
  - Button (shadcn) - Primary actions with variant support for active/inactive states
  - Badge (shadcn) - Filter summary pills showing preset configuration
  - Input (shadcn) - Search field with icon integration
  - Tabs (shadcn) alternative: Custom category buttons for better touch targets
  - ScrollArea (shadcn) - Horizontal scrolling for quick presets panel
  
- **Customizations**: 
  - Custom preset card layout with icon positioning and badge arrangement
  - Enhanced button styles for active preset indication with checkmark icon
  - Category filter buttons with count badges
  - Horizontal scroll container with fade edges for quick filters
  
- **States**: 
  - Preset cards: default, hover (elevated shadow + border color), loading
  - Apply buttons: default, hover, active (primary color), loading
  - Category buttons: inactive (outline), active (filled with primary)
  - Search input: empty, focused (ring), filled with results
  
- **Icon Selection**: 
  - Phosphor Icons with duotone weight for preset categories (Student, House, Crown, etc.)
  - Sparkle for "Quick Filters" header and magical feeling
  - MagnifyingGlass for search input
  - Check for active preset confirmation
  - FunnelSimple for main navigation button
  
- **Spacing**: 
  - Container padding: px-4 sm:px-6 lg:px-8, py-12
  - Card gaps: gap-6 for grid layout
  - Internal card padding: p-6 for comfortable spacing
  - Badge spacing: gap-1.5 for tight grouping
  - Section spacing: space-y-4 for clear hierarchy
  
- **Mobile**: 
  - Grid: 1 column on mobile, 2 on tablet (md:), 3 on desktop (lg:)
  - Category buttons: Horizontal scroll on mobile with pb-2 for scrollbar spacing
  - Quick filters: Always horizontal scroll with compact sizing
  - Navigation: Filter Presets accessible from hamburger menu on mobile
  - Search bar: Full width on mobile with appropriate touch targets
  - Cards maintain readability with adjusted padding on small screens
