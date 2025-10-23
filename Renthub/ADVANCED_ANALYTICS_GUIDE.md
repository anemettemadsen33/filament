# Advanced Analytics Dashboard - Implementation Guide

## Overview

The Advanced Analytics Dashboard provides property owners with comprehensive insights into their rental business performance through interactive charts and detailed metrics. This feature transforms raw booking and property data into actionable business intelligence.

## Feature Location

**Navigation Path**: Dashboard → Analytics Tab

**User Access**: Available to all authenticated users with properties

## Core Components

### 1. Analytics Utilities (`src/lib/analyticsUtils.ts`)

Provides calculation functions for all analytics metrics:

#### Key Functions

**`calculateRevenueOverTime(bookings, startDate, endDate)`**
- Aggregates revenue by month for the selected time range
- Returns array of data points with: month, revenue, bookings count, average booking value
- Filters out cancelled bookings
- Used by revenue charts

**`calculateOccupancyTrends(properties, bookings, startDate, endDate)`**
- Calculates occupancy percentage by month
- Considers check-in/check-out dates overlapping with each month
- Returns: month, occupancy rate, total days, booked days, available days
- Handles both short-term and long-term rentals

**`calculatePropertyPerformance(properties, bookings, reviews, analytics)`**
- Computes performance metrics for each property
- Includes: total revenue, booking count, average rating, occupancy rate, views
- Sorts by revenue (highest first)
- Returns top 5 performers

**`calculateAnalyticsSummary(bookings, properties, reviews, analytics)`**
- Generates overview statistics for all properties
- Calculates growth percentages (comparing last 30 vs previous 30 days)
- Returns: total revenue, total bookings, average booking value, occupancy rate, views, ratings, growth indicators

**Helper Functions**
- `formatCurrency(amount)`: Formats numbers as USD currency ($1,234)
- `formatPercentage(value)`: Formats as percentage (75.5%)
- `formatNumber(value)`: Formats with thousand separators (1,234)

### 2. Advanced Analytics Dashboard Component (`src/components/AdvancedAnalyticsDashboard.tsx`)

Main dashboard component with charts and visualizations.

#### Props
```typescript
{
  properties: Property[]        // User's properties
  bookings: Booking[]          // Related bookings
  reviews: Review[]            // Property reviews
  analytics: Record<string, any> // View/interaction data
}
```

#### State Management
- `timeRange`: User-selected time period (3, 6, or 12 months)
- Computed values cached with `useMemo` for performance

#### Sections

**Summary Metrics** (Top Cards)
- Total Revenue with growth indicator
- Total Bookings with growth indicator
- Occupancy Rate (30-day average)
- Average Booking Value
- Color-coded trend arrows (green up / red down)

**Revenue Tab**
1. **Revenue Over Time** (Area Chart)
   - Monthly revenue visualization
   - Gradient fill under the line
   - Currency-formatted Y-axis
   - Smooth curve interpolation

2. **Revenue vs Bookings** (Dual-axis Line Chart)
   - Left axis: Revenue in dollars
   - Right axis: Booking count
   - Two colored lines for comparison
   - Helps identify booking value trends

**Occupancy Tab**
1. **Occupancy Trends** (Bar Chart)
   - Monthly occupancy percentages
   - Rounded bar corners
   - Percentage-formatted Y-axis
   - Color-coded bars

2. **Occupancy Summary Cards**
   - Total Days: All available days across properties
   - Booked Days: Successfully booked days
   - Available Days: Still unbooked days

**Performance Tab**
1. **Top Performing Properties** (Horizontal Bar Chart)
   - Properties ranked by revenue
   - Truncated titles for long property names
   - Revenue-formatted X-axis

2. **Detailed Property Cards**
   - Position badge (#1, #2, etc.)
   - Revenue highlighted in large text
   - Grid of metrics: Bookings, Rating (with star), Occupancy, Views
   - Animated entrance with stagger effect

## Chart Configuration

### Recharts Library
All charts use the `recharts` library with custom theming:

**Color Palette**
```typescript
const CHART_COLORS = [
  'oklch(0.45 0.15 250)',  // Primary blue
  'oklch(0.65 0.15 145)',  // Accent green
  'oklch(0.70 0.15 35)',   // Warning yellow
  'oklch(0.60 0.20 25)',   // Destructive red
  'oklch(0.55 0.18 250)',  // Secondary blue
  'oklch(0.60 0.18 145)'   // Secondary green
]
```

**Common Configuration**
- `ResponsiveContainer`: 100% width, 350px height
- `CartesianGrid`: Dashed lines using border color
- Font size: 12px for axes
- Stroke color: muted-foreground for axes
- Custom tooltips with formatted values

### Custom Tooltip
Displays context-aware information on hover:
- Shows month/period name
- Formats currency values as $X,XXX
- Formats percentages as XX.X%
- Formats booking counts as integers
- Styled card with border and shadow

## Integration with Dashboard

The Advanced Analytics Dashboard is integrated into the main Dashboard page:

```typescript
// src/pages/DashboardPage.tsx
<TabsContent value="analytics">
  <AdvancedAnalyticsDashboard
    properties={myProperties}
    bookings={bookings.filter(b => 
      myProperties.some(p => p.id === b.propertyId)
    )}
    reviews={reviews.filter(r =>
      myProperties.some(p => p.id === r.propertyId)
    )}
    analytics={analytics}
  />
</TabsContent>
```

**Filtering Logic**
- Only shows data for properties owned by current user
- Bookings filtered to user's properties
- Reviews filtered to user's properties
- Analytics data passed through directly

## Data Flow

```
Bookings + Properties + Reviews + Analytics
           ↓
    Analytics Utilities
           ↓
  Calculated Metrics & Trends
           ↓
   Chart Data Arrays
           ↓
    Recharts Components
           ↓
   Visual Charts & Graphs
```

## Calculations Deep Dive

### Revenue Calculation
```typescript
// For each month in range:
1. Filter bookings created in that month
2. Exclude cancelled bookings
3. Sum totalPrice from all bookings
4. Calculate average: total / count
5. Return { month, revenue, bookings, averageBookingValue }
```

### Occupancy Calculation
```typescript
// For each month in range:
1. Calculate total available days = properties.length × days_in_month
2. For each booking with checkIn/checkOut:
   a. Find overlap with current month
   b. Calculate overlapping days
   c. Add to bookedDays counter
3. occupancyRate = (bookedDays / totalDays) × 100
4. Cap at 100% max
5. Return { month, occupancyRate, totalDays, bookedDays, availableDays }
```

### Growth Calculation
```typescript
// Revenue/Booking Growth:
1. Get current period bookings (last 30 days)
2. Get previous period bookings (30-60 days ago)
3. Sum revenue for each period
4. growth = ((current - previous) / previous) × 100
5. Handle edge cases (zero previous revenue)
```

### Property Performance
```typescript
// For each property:
1. Filter bookings for this property (exclude cancelled)
2. Sum totalPrice for revenue
3. Calculate average rating from reviews
4. Get view count from analytics
5. Calculate 30-day occupancy:
   - Count booked days in last 30 days
   - occupancy = (booked / 30) × 100
6. Return sorted by revenue (highest first)
```

## Performance Optimizations

### Memoization
All expensive calculations use `useMemo`:
- `revenueData` - Recalculates only when bookings or date range changes
- `occupancyData` - Recalculates only when properties, bookings, or dates change
- `propertyPerformance` - Recalculates only when dependencies change
- `summary` - Recalculates only when bookings, properties, or reviews change

### Efficient Filtering
- Date comparisons using timestamps (faster than Date objects)
- Array filters with early returns
- Single-pass aggregations where possible

### Chart Rendering
- Recharts handles virtualization internally
- ResponsiveContainer debounces resize events
- Tooltip renders only on hover

## Responsive Design

### Desktop (≥1024px)
- 4-column grid for summary metrics
- Full-width charts
- Side-by-side property cards

### Tablet (768px - 1023px)
- 2-column grid for summary metrics
- Full-width charts
- Stacked property cards

### Mobile (<768px)
- Single column for all metrics
- Full-width charts with horizontal scroll if needed
- Vertical property card stacking
- Condensed spacing

## Empty States

When no data exists:
- Charts show empty grids
- Helpful messages guide users to add properties/bookings
- Layout structure maintained

## Accessibility

- All charts have proper ARIA labels
- Color is not the only indicator (icons + text)
- Keyboard navigation supported
- Contrast ratios meet WCAG AA standards
- Tooltips accessible via keyboard

## Future Enhancements

Potential additions:
- Export charts as images/PDF
- Custom date range selection
- Property comparison mode
- Predictive analytics (forecast future revenue)
- Benchmark against market averages
- More granular filtering (by property type, location)
- Year-over-year comparisons
- Seasonal trend analysis
- Revenue per square foot metrics
- Custom metric builder

## Testing Scenarios

### Test Data Requirements
1. Multiple properties (at least 3)
2. Bookings spanning several months
3. Mix of confirmed and cancelled bookings
4. Properties with various review ratings
5. Different property types and locations

### Key Test Cases
1. **Empty State**: No bookings → Shows 0 revenue, helpful message
2. **Single Booking**: One booking → Chart shows single data point
3. **Growth Calculation**: Compare periods → Shows accurate percentage
4. **Occupancy Edge Cases**: 
   - 100% occupancy → Caps at 100%
   - Overlapping bookings → Handles correctly
   - Long-term bookings → Spans multiple months
5. **Time Range Switch**: Change 3/6/12 months → Updates all charts
6. **Cancelled Bookings**: Should be excluded from revenue
7. **Multiple Properties**: Top performers ranked correctly

## Troubleshooting

### Charts Not Rendering
- Check that `recharts` is installed
- Verify data arrays are not empty
- Ensure ResponsiveContainer has parent with defined height

### Incorrect Calculations
- Verify date ranges are correct (startDate < endDate)
- Check booking status filtering (exclude cancelled)
- Ensure numeric values (not strings) for calculations

### Performance Issues
- Check if memoization dependencies are correct
- Reduce data set size for testing
- Profile with React DevTools

### Styling Issues
- Verify CSS custom properties are defined
- Check Tailwind classes are generated
- Ensure theme colors are in OKLCH format

## Code Example

```typescript
// Using analytics utilities directly
import {
  calculateRevenueOverTime,
  calculateAnalyticsSummary,
  formatCurrency
} from '@/lib/analyticsUtils'

const startDate = subMonths(new Date(), 6)
const endDate = new Date()

const revenueData = calculateRevenueOverTime(
  bookings,
  startDate,
  endDate
)

const summary = calculateAnalyticsSummary(
  bookings,
  properties,
  reviews,
  analytics
)

console.log(`Total Revenue: ${formatCurrency(summary.totalRevenue)}`)
console.log(`Growth: ${summary.revenueGrowth.toFixed(1)}%`)
```

## Dependencies

- `recharts`: ^2.15.1 (chart library)
- `date-fns`: ^3.6.0 (date utilities)
- `framer-motion`: ^12.6.3 (animations)
- React 19+
- TypeScript 5+

## Conclusion

The Advanced Analytics Dashboard transforms raw rental data into actionable insights through beautiful, interactive charts. It helps property owners understand their business performance, identify trends, and make data-driven decisions to optimize their rental operations.
