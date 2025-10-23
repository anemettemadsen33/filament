# Multi-Language Support Guide

## Overview

RentHub now features comprehensive multi-language support with 8 languages, allowing users worldwide to access the platform in their preferred language. The internationalization (i18n) system provides real-time language switching, persistent preferences, and full RTL (right-to-left) support for Arabic.

## Supported Languages

- 🇺🇸 **English** (Default)
- 🇪🇸 **Spanish** (Español)
- 🇫🇷 **French** (Français)
- 🇩🇪 **German** (Deutsch) - Currently using English fallback
- 🇨🇳 **Chinese** (中文) - Currently using English fallback
- 🇯🇵 **Japanese** (日本語) - Currently using English fallback
- 🇧🇷 **Portuguese** (Português) - Currently using English fallback
- 🇸🇦 **Arabic** (العربية) - Currently using English fallback with RTL support

## Features

### 1. Language Switcher

The language switcher is available in two locations:

- **Header Navigation**: Globe icon button that opens a dropdown menu
- **User Profile Modal**: Full language settings panel with detailed options

#### Header Switcher Usage
```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

<LanguageSwitcher 
  variant="ghost"      // Button variant: default, ghost, outline
  size="icon"          // Button size: default, sm, lg, icon
  showLabel={false}    // Show language name alongside icon
  align="end"          // Dropdown alignment: start, center, end
/>
```

### 2. Translation System

The application uses a context-based translation system with type-safe keys.

#### Using Translations in Components
```tsx
import { useTranslation } from '@/lib/i18n/context'

function MyComponent() {
  const { t, language, isRTL } = useTranslation()
  
  return (
    <div>
      <h1>{t.hero.title}</h1>
      <p>{t.hero.subtitle}</p>
      <button>{t.common.search}</button>
    </div>
  )
}
```

### 3. Translation Structure

Translations are organized into logical categories:

- **common**: Shared terms (search, filter, save, cancel, etc.)
- **nav**: Navigation menu items
- **hero**: Homepage hero section
- **property**: Property-related terms
- **filter**: Filter and sort options
- **booking**: Booking process terminology
- **review**: Review system labels
- **dashboard**: Dashboard and analytics
- **messages**: Messaging system
- **roommate**: Roommate matching feature
- **lease**: Lease agreement terms
- **maintenance**: Maintenance request system
- **notifications**: Notification types and actions
- **errors**: Error messages
- **success**: Success messages
- **preferences**: User preferences and settings
- **empty**: Empty state messages

### 4. RTL (Right-to-Left) Support

The system automatically detects RTL languages (currently Arabic) and applies appropriate layout direction:

```tsx
// In I18nProvider
<div dir={isRTL ? 'rtl' : 'ltr'}>
  {children}
</div>
```

All components automatically adapt to RTL layout thanks to Tailwind CSS logical properties.

### 5. Persistent Preferences

Language preferences are automatically saved using the `useKV` hook:

- Persists across browser sessions
- Syncs across devices for authenticated users
- No manual save action required

## Architecture

### File Structure

```
src/
├── lib/
│   └── i18n/
│       ├── types.ts           # Language type definitions
│       ├── index.ts           # Translation utilities
│       ├── context.tsx        # I18n React context provider
│       └── locales/
│           ├── en.ts          # English translations
│           ├── es.ts          # Spanish translations
│           └── fr.ts          # French translations
└── components/
    ├── LanguageSwitcher.tsx   # Language selection dropdown
    └── LanguageSettings.tsx   # Full language settings panel
```

### Core Components

#### 1. I18nProvider
Wraps the entire application and provides translation context:

```tsx
import { I18nProvider } from '@/lib/i18n/context'

function App() {
  return (
    <I18nProvider>
      <YourApp />
    </I18nProvider>
  )
}
```

#### 2. useTranslation Hook
Primary hook for accessing translations in components:

```tsx
const { t, language, setLanguage, isRTL } = useTranslation()

// t: Translation object with all strings
// language: Current language code
// setLanguage: Function to change language
// isRTL: Boolean indicating RTL layout
```

## Adding New Languages

### Step 1: Create Translation File

Create a new file in `src/lib/i18n/locales/` (e.g., `de.ts` for German):

```typescript
import { TranslationKeys } from './en'

export const de: TranslationKeys = {
  common: {
    search: 'Suchen',
    filter: 'Filtern',
    // ... all other keys
  },
  // ... all other categories
}
```

### Step 2: Register Language

Add the language to `src/lib/i18n/index.ts`:

```typescript
import { de } from './locales/de'

const translations: Record<Language, TranslationKeys> = {
  en,
  es,
  fr,
  de, // Add your new language
  // ...
}
```

### Step 3: Update Language Config

Add language metadata to `src/lib/i18n/types.ts`:

```typescript
export const LANGUAGES: LanguageConfig[] = [
  // ...
  { 
    code: 'de', 
    name: 'German', 
    nativeName: 'Deutsch', 
    flag: '🇩🇪',
    rtl: false // Set to true for RTL languages
  },
]
```

## Translation Coverage

The current implementation provides translations for:

### ✅ Fully Translated
- English (en)
- Spanish (es)
- French (fr)

### 🚧 Planned
- German (de)
- Chinese (zh)
- Japanese (ja)
- Portuguese (pt)
- Arabic (ar) with RTL support

## Best Practices

### 1. Always Use Translation Keys
❌ **Don't:**
```tsx
<button>Save</button>
```

✅ **Do:**
```tsx
<button>{t.common.save}</button>
```

### 2. Keep Translations Concise
- Use short, clear phrases
- Avoid full sentences where possible
- Consider character limits for buttons and labels

### 3. Maintain Consistency
- Use the same translation for repeated terms
- Follow existing categorization patterns
- Keep parallel structure across languages

### 4. Test RTL Languages
- Verify layout doesn't break with RTL
- Check icon positions
- Test modal and dropdown alignments

### 5. Handle Plurals and Numbers
For complex pluralization, consider using interpolation:

```tsx
// In translation file
reviews: '{count} reviews'

// In component
const reviewText = t.property.reviews.replace('{count}', reviewCount.toString())
```

## Demo Page

Visit `/language` to see the multi-language system in action:

- Language selector with all options
- Translation examples across different categories
- Real-time language switching demonstration
- RTL layout preview

## Performance Considerations

- **Bundle Size**: Each language adds ~10KB to bundle
- **Loading**: Translations load synchronously (included in main bundle)
- **Switching**: Language changes are instant (no network requests)
- **Caching**: Language preference cached in localStorage via useKV

## Accessibility

- Language switcher has proper ARIA labels
- Dropdown menu is keyboard navigable
- Screen readers announce language changes
- Native language names improve recognition

## Future Enhancements

- [ ] Complete all language translations
- [ ] Add language auto-detection based on browser settings
- [ ] Implement lazy loading for language files
- [ ] Add date/time localization
- [ ] Add number and currency formatting
- [ ] Add pluralization rules support
- [ ] Add translation management UI for admins
- [ ] Add machine translation fallback for missing keys

## Troubleshooting

### Translations Not Updating
- Ensure I18nProvider wraps your component tree
- Check that useTranslation is called inside I18nProvider
- Verify translation keys exist in all language files

### RTL Layout Issues
- Check that container uses logical properties (start/end vs left/right)
- Verify Tailwind classes are RTL-compatible
- Test with `dir="rtl"` attribute

### Missing Translations
- System falls back to English for missing keys
- Check console for warnings about missing translation keys
- Verify translation file exports TranslationKeys type

## Support

For issues or questions about the multi-language system:
- Check this documentation first
- Review the demo page at `/language`
- Examine existing translation files for examples
- Test with the language switcher in the header
