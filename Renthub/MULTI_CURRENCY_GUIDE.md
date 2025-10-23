# Multi-Currency Support Guide

## Overview

RentHub now supports multi-currency functionality, allowing users to view property prices in their preferred currency. The system features real-time exchange rate conversion powered by AI, automatic currency detection, and seamless integration across the entire platform.

## Features

### 🌍 Supported Currencies

The platform supports 12 major world currencies:

- 🇺🇸 **USD** - US Dollar ($)
- 🇪🇺 **EUR** - Euro (€)
- 🇬🇧 **GBP** - British Pound (£)
- 🇷🇴 **RON** - Romanian Leu (lei)
- 🇯🇵 **JPY** - Japanese Yen (¥)
- 🇨🇳 **CNY** - Chinese Yuan (¥)
- 🇨🇦 **CAD** - Canadian Dollar (C$)
- 🇦🇺 **AUD** - Australian Dollar (A$)
- 🇨🇭 **CHF** - Swiss Franc (Fr)
- 🇮🇳 **INR** - Indian Rupee (₹)
- 🇧🇷 **BRL** - Brazilian Real (R$)
- 🇲🇽 **MXN** - Mexican Peso (Mex$)

### 💱 Exchange Rate Management

- **AI-Powered Rates**: Exchange rates are fetched using GPT-4o-mini for realistic, up-to-date conversions
- **Automatic Updates**: Rates refresh automatically every hour to maintain accuracy
- **Manual Refresh**: Users can manually refresh rates at any time via the currency selector
- **Fallback System**: If AI fails, default rates are used to ensure uninterrupted service
- **Persistent Storage**: Rates and last update timestamp are stored locally for offline access

### 🔄 Currency Conversion

- **Real-Time Conversion**: All prices are converted in real-time when currency is changed
- **Accurate Calculations**: Conversion uses current exchange rates with proper rounding
- **Base Currency**: All properties are stored in USD and converted to the selected currency
- **Formatting**: Prices are formatted according to the locale and conventions of each currency

### 🎨 User Interface

#### Currency Selector
- **Location**: Top navigation bar, next to language and theme toggles
- **Visual Design**: 
  - Shows current currency code and symbol
  - Currency icon (dollar sign) for quick recognition
  - Popover dropdown with all available currencies
  - Country flags for visual identification
  - Last updated timestamp
  - Refresh button with loading state

#### Currency Selection Dialog
- **Search & Filter**: Easy scrolling through 12 currencies
- **Visual Information**:
  - Country flag emoji
  - Currency code (e.g., USD, EUR)
  - Full currency name
  - Currency symbol
  - Selected currency indicator (checkmark)
- **Animations**: Smooth staggered entrance animations for each currency option
- **Responsive Design**: Works seamlessly on mobile and desktop

#### Price Display Component
- **Consistent Formatting**: All prices use the `PriceDisplay` component
- **Automatic Conversion**: Prices convert based on selected currency
- **Size Variants**: sm, md, lg, xl for different use cases
- **Decimal Control**: Optional decimal places (useful for large amounts)
- **Custom Styling**: Supports className prop for custom styling

## Technical Implementation

### Core Files

#### 1. `src/lib/currencyUtils.ts`
Utility functions for currency operations:

```typescript
// Fetch exchange rates from AI
fetchExchangeRates(baseCurrency: string): Promise<ExchangeRates>

// Convert price between currencies
convertPrice(amount: number, fromCurrency: string, toCurrency: string, rates: ExchangeRates): number

// Format price according to currency locale
formatCurrency(amount: number, currencyCode: string, showDecimals: boolean): string

// Get currency metadata
getCurrencyByCode(code: string): Currency | undefined
getCurrencySymbol(currencyCode: string): string

// Rate refresh management
shouldRefreshRates(lastUpdated: number | null): boolean
refreshExchangeRates(currentCurrency: string): Promise<ExchangeRates>
```

#### 2. `src/lib/currencyContext.tsx`
React context provider for global currency state:

```typescript
interface CurrencyContextValue {
  currentCurrency: string
  currencies: Currency[]
  exchangeRates: ExchangeRates
  isLoading: boolean
  lastUpdated: number | null
  setCurrentCurrency: (code: string) => void
  convertPrice: (amount: number, fromCurrency?: string) => number
  formatPrice: (amount: number, showDecimals?: boolean) => string
  refreshRates: () => Promise<void>
}

// Usage
const { currentCurrency, convertPrice, formatPrice } = useCurrency()
```

#### 3. `src/components/CurrencySelector.tsx`
Currency selection UI component with dropdown popover

#### 4. `src/components/PriceDisplay.tsx`
Reusable component for displaying converted prices:

```typescript
<PriceDisplay 
  amount={1200}
  originalCurrency="USD"
  showDecimals={false}
  size="lg"
  className="text-primary"
/>
```

### Integration Points

#### App.tsx Wrapper
```typescript
export default function App() {
  return (
    <Router>
      <I18nProvider>
        <CurrencyProvider>
          <AppContent />
        </CurrencyProvider>
      </I18nProvider>
    </Router>
  )
}
```

#### Layout Header
```typescript
<CurrencySelector />
<LanguageSwitcher />
<ThemeToggle />
```

#### Property Card Component
```typescript
<Badge className="...">
  <PriceDisplay 
    amount={property.price} 
    showDecimals={false} 
    size="md" 
  />
  /{property.rentalTerm === 'short-term' ? 'night' : 'mo'}
</Badge>
```

## Usage Examples

### Basic Usage in Components

```typescript
import { useCurrency } from '@/lib/currencyContext'
import { PriceDisplay } from '@/components/PriceDisplay'

function PropertyDetails({ property }) {
  const { currentCurrency, formatPrice } = useCurrency()
  
  return (
    <div>
      {/* Option 1: Use PriceDisplay component */}
      <PriceDisplay 
        amount={property.price}
        size="xl"
        className="text-primary"
      />
      
      {/* Option 2: Use formatPrice directly */}
      <span>{formatPrice(property.price)}</span>
      
      {/* Current currency info */}
      <p>Showing prices in {currentCurrency}</p>
    </div>
  )
}
```

### Converting from Different Base Currency

```typescript
const { convertPrice } = useCurrency()

// Convert EUR to current currency
const convertedPrice = convertPrice(100, 'EUR')
```

### Manual Rate Refresh

```typescript
const { refreshRates, isLoading } = useCurrency()

<Button onClick={refreshRates} disabled={isLoading}>
  {isLoading ? 'Refreshing...' : 'Refresh Rates'}
</Button>
```

## Data Flow

1. **Initialization**:
   - CurrencyProvider loads saved currency preference from `useKV`
   - Checks if exchange rates need refresh (> 1 hour old)
   - Fetches rates via AI if needed
   - Stores rates and timestamp

2. **Currency Change**:
   - User selects new currency from dropdown
   - `setCurrentCurrency()` is called
   - New rates are fetched relative to selected currency
   - All components re-render with converted prices
   - Preference is saved to `useKV`

3. **Price Display**:
   - Component receives original price in USD
   - `convertPrice()` converts to current currency using rates
   - `formatPrice()` formats according to locale
   - Displays formatted price with proper symbol

4. **Rate Refresh**:
   - Automatic: Every hour when app is active
   - Manual: User clicks refresh button
   - AI generates new rates via GPT-4o-mini
   - Rates update across all components
   - Timestamp updates

## Persistence

All currency preferences and data are persisted using the Spark KV store:

- **currency**: Current selected currency code (string)
- **exchangeRates**: Exchange rate object (ExchangeRates)
- **currencyLastUpdated**: Timestamp of last rate update (number)

This ensures:
- User preferences persist across sessions
- Rates don't need to be fetched on every page load
- Offline functionality with cached rates
- Seamless experience across devices

## Best Practices

### 1. Always Use PriceDisplay Component
```typescript
// ✅ Good
<PriceDisplay amount={property.price} />

// ❌ Avoid
<span>${property.price}</span>
```

### 2. Handle Loading States
```typescript
const { isLoading } = useCurrency()

{isLoading ? <Skeleton /> : <PriceDisplay amount={price} />}
```

### 3. Provide Fallbacks
```typescript
const { formatPrice } = useCurrency()

// Component handles errors gracefully
<span>{formatPrice(price) || '$0.00'}</span>
```

### 4. Consider Decimal Places
```typescript
// For large amounts, hide decimals
<PriceDisplay amount={50000} showDecimals={false} />

// For precise amounts, show decimals
<PriceDisplay amount={99.99} showDecimals={true} />
```

## Customization

### Adding New Currencies

Edit `src/lib/currencyUtils.ts`:

```typescript
export const SUPPORTED_CURRENCIES: Currency[] = [
  // ...existing currencies
  { 
    code: 'SGD', 
    symbol: 'S$', 
    name: 'Singapore Dollar', 
    flag: '🇸🇬', 
    locale: 'en-SG' 
  }
]
```

### Changing Refresh Interval

Edit `shouldRefreshRates()` in `currencyUtils.ts`:

```typescript
export function shouldRefreshRates(lastUpdated: number | null): boolean {
  if (!lastUpdated) return true
  
  const TWO_HOURS = 2 * 60 * 60 * 1000  // Change from 1 hour
  const now = Date.now()
  
  return (now - lastUpdated) > TWO_HOURS
}
```

### Custom Price Formatting

Extend the `formatCurrency()` function for special formatting needs:

```typescript
// Add thousands separator options
// Add currency position (before/after)
// Add custom symbol replacements
```

## Testing

### Test Currency Selection
1. Open currency dropdown in header
2. Select different currency
3. Verify all prices update
4. Check that selection persists after refresh

### Test Rate Refresh
1. Note current "Updated" timestamp
2. Wait 1+ hour or click refresh button
3. Verify rates update
4. Check timestamp changes

### Test Conversion Accuracy
1. Select USD (base currency)
2. Note a price (e.g., $1000)
3. Switch to EUR
4. Verify conversion is reasonable (~€920)
5. Switch back to USD
6. Verify original price displays

### Test Edge Cases
- No internet connection (uses cached rates)
- AI service failure (uses fallback rates)
- Very large numbers (>1 million)
- Very small numbers (<1)
- Rapid currency switching

## Performance Considerations

- **Memoization**: Context value is memoized to prevent unnecessary re-renders
- **Lazy Loading**: Exchange rates only fetch when needed
- **Caching**: Rates cached for 1 hour to minimize AI calls
- **Efficient Updates**: Only affected components re-render on currency change
- **Optimized Calculations**: Conversion happens once per render cycle

## Troubleshooting

### Prices Not Converting
- Check if CurrencyProvider wraps your component tree
- Verify useCurrency() is called inside a component
- Ensure exchangeRates object is populated

### Rates Not Refreshing
- Check lastUpdated timestamp
- Verify shouldRefreshRates() logic
- Check network connectivity
- Review AI service status

### Formatting Issues
- Verify currency locale is correct
- Check Intl.NumberFormat browser support
- Ensure currency code is valid ISO 4217

### Performance Issues
- Check if too many PriceDisplay components render simultaneously
- Consider pagination for large property lists
- Use React.memo for expensive components

## Future Enhancements

Potential improvements for future versions:

1. **Crypto Currency Support**: Add Bitcoin, Ethereum, etc.
2. **Historical Rates**: Show price history in different currencies
3. **Custom Rate Sources**: Allow admins to configure rate API
4. **Rate Comparison**: Compare rates from multiple sources
5. **Alert System**: Notify when favorable exchange rates
6. **Bulk Currency Operations**: Convert multiple properties at once
7. **Currency Analytics**: Track which currencies users prefer
8. **Regional Auto-Detection**: Automatically select currency based on location

## Conclusion

The multi-currency system provides a seamless, user-friendly experience for international users. With AI-powered exchange rates, persistent preferences, and comprehensive UI integration, users can confidently browse properties in their preferred currency.

For questions or issues, refer to the codebase or contact the development team.
