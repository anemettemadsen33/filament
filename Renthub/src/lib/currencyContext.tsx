import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import {
  Currency,
  ExchangeRates,
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  fetchExchangeRates,
  convertPrice,
  formatCurrency,
  getCurrencyByCode,
  shouldRefreshRates
} from './currencyUtils'

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

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined)

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}

interface CurrencyProviderProps {
  children: ReactNode
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currentCurrency, setCurrentCurrencyState] = useLocalStorage<string>('currency', DEFAULT_CURRENCY)
  const [exchangeRates, setExchangeRates] = useLocalStorage<ExchangeRates>('exchangeRates', {})
  const [lastUpdated, setLastUpdated] = useLocalStorage<number | null>('currencyLastUpdated', null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initializeRates = async () => {
      if (shouldRefreshRates(lastUpdated || null)) {
        await loadExchangeRates()
      }
    }
    
    initializeRates()
  }, [])

  const loadExchangeRates = async () => {
    setIsLoading(true)
    try {
      const rates = await fetchExchangeRates(currentCurrency || DEFAULT_CURRENCY)
      setExchangeRates(() => rates)
      setLastUpdated(() => Date.now())
    } catch (error) {
      console.error('Failed to load exchange rates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetCurrentCurrency = async (code: string) => {
    setCurrentCurrencyState(() => code)
    await loadExchangeRates()
  }

  const handleConvertPrice = (amount: number, fromCurrency: string = DEFAULT_CURRENCY): number => {
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) {
      return amount
    }
    return convertPrice(amount, fromCurrency, currentCurrency || DEFAULT_CURRENCY, exchangeRates)
  }

  const handleFormatPrice = (amount: number, showDecimals: boolean = true): string => {
    return formatCurrency(amount, currentCurrency || DEFAULT_CURRENCY, showDecimals)
  }

  const handleRefreshRates = async () => {
    await loadExchangeRates()
  }

  const value: CurrencyContextValue = {
    currentCurrency: currentCurrency || DEFAULT_CURRENCY,
    currencies: SUPPORTED_CURRENCIES,
    exchangeRates: exchangeRates || {},
    isLoading,
    lastUpdated: lastUpdated || null,
    setCurrentCurrency: handleSetCurrentCurrency,
    convertPrice: handleConvertPrice,
    formatPrice: handleFormatPrice,
    refreshRates: handleRefreshRates
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}
