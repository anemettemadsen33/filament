import { useCurrency } from '@/lib/currencyContext'
import { cn } from '@/lib/utils'
import { DEFAULT_CURRENCY } from '@/lib/currencyUtils'

interface PriceDisplayProps {
  amount: number
  className?: string
  showDecimals?: boolean
  originalCurrency?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function PriceDisplay({
  amount,
  className,
  showDecimals = true,
  originalCurrency = DEFAULT_CURRENCY,
  size = 'md'
}: PriceDisplayProps) {
  const { convertPrice, formatPrice, currentCurrency } = useCurrency()

  const convertedAmount = convertPrice(amount, originalCurrency)
  const formattedPrice = formatPrice(convertedAmount, showDecimals)

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl'
  }

  return (
    <span className={cn('font-bold', sizeClasses[size], className)}>
      {formattedPrice}
    </span>
  )
}
