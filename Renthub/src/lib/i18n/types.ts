export type Language = 'en' | 'de' | 'ro' | 'es' | 'fr'

export interface LanguageConfig {
  code: Language
  name: string
  nativeName: string
  flag: string
  rtl?: boolean
}

export const LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' }
]

export const DEFAULT_LANGUAGE: Language = 'en'

export function getLanguageConfig(code: Language): LanguageConfig {
  return LANGUAGES.find(lang => lang.code === code) || LANGUAGES[0]
}
