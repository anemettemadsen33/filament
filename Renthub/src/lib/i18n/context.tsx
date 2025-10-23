import { createContext, useContext, ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Language, DEFAULT_LANGUAGE, getLanguageConfig } from './types'
import { getTranslations } from './index'
import type { TranslationKeys } from './locales/en'

interface I18nContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
  isRTL: boolean
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>('app-language', DEFAULT_LANGUAGE)
  
  const t = getTranslations(language || DEFAULT_LANGUAGE)
  const languageConfig = getLanguageConfig(language || DEFAULT_LANGUAGE)
  const isRTL = languageConfig.rtl || false

  return (
    <I18nContext.Provider value={{ language: language || DEFAULT_LANGUAGE, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}
