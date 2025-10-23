import { en } from './locales/en'
import { es } from './locales/es'
import { fr } from './locales/fr'
import { ro } from './locales/ro'
import { Language } from './types'
import type { TranslationKeys } from './locales/en'

const translations: Record<Language, TranslationKeys> = {
  en,
  es,
  fr,
  ro
}

export function getTranslations(language: Language): TranslationKeys {
  return translations[language] || translations.en
}

export function translate(
  language: Language,
  key: string
): string {
  const keys = key.split('.')
  const t = getTranslations(language)
  
  let value: any = t
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }
  
  return typeof value === 'string' ? value : key
}
