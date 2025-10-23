import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Ticket, X, Check, Warning } from '@phosphor-icons/react'
import { Voucher, VoucherValidation } from '@/lib/types'
import { formatVoucherValue } from '@/lib/voucherUtils'

interface VoucherInputProps {
  onApply: (code: string) => void
  onRemove: () => void
  onBrowse?: () => void
  appliedVoucher?: Voucher
  validation?: VoucherValidation
  disabled?: boolean
}

export function VoucherInput({
  onApply,
  onRemove,
  onBrowse,
  appliedVoucher,
  validation,
  disabled = false
}: VoucherInputProps) {
  const [code, setCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  const handleApply = async () => {
    if (!code.trim()) return
    
    setIsApplying(true)
    await onApply(code.trim().toUpperCase())
    setCode('')
    setIsApplying(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply()
    }
  }

  return (
    <div className="space-y-3">
      {appliedVoucher ? (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="font-semibold text-sm">Voucher Applied</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="px-2 py-1 bg-background rounded text-xs font-mono font-semibold">
                  {appliedVoucher.code}
                </code>
                <Badge variant="secondary" className="text-xs">
                  {formatVoucherValue(appliedVoucher)}
                </Badge>
              </div>
              {appliedVoucher.description && (
                <p className="text-xs text-muted-foreground mt-2">
                  {appliedVoucher.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              disabled={disabled}
              className="h-8 w-8 flex-shrink-0"
              aria-label="Remove voucher"
              title="Remove voucher"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter voucher code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={disabled || isApplying}
                className="pl-10"
                id="voucher-code"
                name="voucherCode"
                aria-label="Voucher code"
              />
            </div>
            <Button
              onClick={handleApply}
              disabled={!code.trim() || disabled || isApplying}
              variant="secondary"
            >
              {isApplying ? 'Applying...' : 'Apply'}
            </Button>
          </div>

          {onBrowse && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBrowse}
              disabled={disabled}
              className="w-full"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Browse Available Vouchers
            </Button>
          )}

          {validation && !validation.valid && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <Warning className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{validation.message}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
