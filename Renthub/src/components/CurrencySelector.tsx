import { useState } from 'react'
import { CurrencyDollar, Check, ArrowsClockwise } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useCurrency } from '@/lib/currencyContext'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function CurrencySelector() {
  const {
    currentCurrency,
    currencies,
    setCurrentCurrency,
    refreshRates,
    isLoading,
    lastUpdated
  } = useCurrency()

  const [open, setOpen] = useState(false)

  const handleCurrencyChange = (code: string) => {
    setCurrentCurrency(code)
    setOpen(false)
  }

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await refreshRates()
  }

  const selectedCurrency = currencies.find(c => c.code === currentCurrency)

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never'
    
    const now = Date.now()
    const diff = now - lastUpdated
    const minutes = Math.floor(diff / (60 * 1000))
    const hours = Math.floor(diff / (60 * 60 * 1000))
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return new Date(lastUpdated).toLocaleDateString()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 h-9 px-3"
        >
          <CurrencyDollar className="h-4 w-4" weight="duotone" />
          <span className="font-medium">{selectedCurrency?.code}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {selectedCurrency?.symbol}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-3">
          <div>
            <h4 className="font-semibold text-sm">Select Currency</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Updated: {formatLastUpdated()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <ArrowsClockwise
              className={cn(
                "h-4 w-4",
                isLoading && "animate-spin"
              )}
              weight="bold"
            />
          </Button>
        </div>
        
        <Separator />
        
        <ScrollArea className="h-[320px]">
          <div className="p-2">
            {currencies.map((currency, index) => {
              const isSelected = currency.code === currentCurrency
              
              return (
                <motion.button
                  key={currency.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleCurrencyChange(currency.code)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg",
                    "hover:bg-accent transition-colors",
                    isSelected && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currency.flag}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">
                        {currency.code}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {currency.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {currency.symbol}
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary" weight="bold" />
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </ScrollArea>
        
        <Separator />
        
        <div className="p-3 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Exchange rates are updated automatically every hour
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
