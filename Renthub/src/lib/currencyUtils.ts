export interface Currency {
  code: string
  symbol: string
  name: string
  flag: string
  locale: string
}

export interface ExchangeRates {
  [key: string]: number
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', flag: '🇷🇴', locale: 'ro-RO' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳', locale: 'zh-CN' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', locale: 'en-AU' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭', locale: 'de-CH' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', locale: 'en-IN' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', flag: '🇧🇷', locale: 'pt-BR' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', flag: '🇲🇽', locale: 'es-MX' }
]

export const DEFAULT_CURRENCY = 'USD'

export async function fetchExchangeRates(baseCurrency: string = DEFAULT_CURRENCY): Promise<ExchangeRates> {
  try {
    // Use default rates instead of LLM for local development
    return getDefaultExchangeRates(baseCurrency)
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
    return getDefaultExchangeRates(baseCurrency)
  }
}

function getDefaultExchangeRates(baseCurrency: string): ExchangeRates {
  const defaultRates: ExchangeRates = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    RON: 4.55,
    JPY: 149.50,
    CNY: 7.24,
    CAD: 1.35,
    AUD: 1.52,
    CHF: 0.88,
    INR: 83.12,
    BRL: 4.87,
    MXN: 17.05
  }

  if (baseCurrency === DEFAULT_CURRENCY) {
    return defaultRates
  }

  const baseRate = defaultRates[baseCurrency] || 1
  const converted: ExchangeRates = {}
  
  for (const [currency, rate] of Object.entries(defaultRates)) {
    converted[currency] = rate / baseRate
  }
  
  return converted
}

export function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const fromRate = rates[fromCurrency] || 1
  const toRate = rates[toCurrency] || 1

  const amountInBase = amount / fromRate
  const convertedAmount = amountInBase * toRate

  return Math.round(convertedAmount * 100) / 100
}

export function formatCurrency(
  amount: number,
  currencyCode: string,
  showDecimals: boolean = true
): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
  
  if (!currency) {
    return `${amount.toFixed(showDecimals ? 2 : 0)}`
  }

  try {
    const formatter = new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0
    })
    
    return formatter.format(amount)
  } catch (error) {
    return `${currency.symbol}${amount.toFixed(showDecimals ? 2 : 0)}`
  }
}

export function getCurrencySymbol(currencyCode: string): string {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode)
  return currency?.symbol || currencyCode
}

export function getCurrencyByCode(code: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find(c => c.code === code)
}

export async function refreshExchangeRates(currentCurrency: string): Promise<ExchangeRates> {
  return await fetchExchangeRates(currentCurrency)
}

export function shouldRefreshRates(lastUpdated: number | null): boolean {
  if (!lastUpdated) return true
  
  const ONE_HOUR = 60 * 60 * 1000
  const now = Date.now()
  
  return (now - lastUpdated) > ONE_HOUR
}
