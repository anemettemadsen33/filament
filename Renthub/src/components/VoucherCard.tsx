import { Voucher } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check, Calendar, Tag, Gift } from '@phosphor-icons/react'
import { getVoucherBadgeColor, formatVoucherValue } from '@/lib/voucherUtils'
import { useState } from 'react'
import { toast } from 'sonner'

interface VoucherCardProps {
  voucher: Voucher
  onApply?: (code: string) => void
  showApplyButton?: boolean
  isApplied?: boolean
  compact?: boolean
}

export function VoucherCard({ voucher, onApply, showApplyButton = true, isApplied = false, compact = false }: VoucherCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucher.code)
    setCopied(true)
    toast.success('Voucher code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApply = () => {
    if (onApply) {
      onApply(voucher.code)
    }
  }

  const usagePercentage = (voucher.currentUses / voucher.maxUses) * 100
  const isExpiringSoon = voucher.validUntil - Date.now() < 7 * 24 * 60 * 60 * 1000
  const daysUntilExpiry = Math.ceil((voucher.validUntil - Date.now()) / (24 * 60 * 60 * 1000))

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${compact ? 'p-3' : 'p-4'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={getVoucherBadgeColor(voucher.category)}>
                  {voucher.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Badge>
                <span className="text-lg font-bold text-primary">
                  {formatVoucherValue(voucher)}
                </span>
              </div>
            </div>
          </div>

          {!compact && (
            <p className="text-sm text-muted-foreground mb-3">
              {voucher.description}
            </p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <code className="px-3 py-1.5 bg-muted rounded-md font-mono text-sm font-semibold tracking-wider">
              {voucher.code}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyCode}
              className="h-8 w-8"
              aria-label={copied ? "Code copied" : "Copy voucher code"}
              title={copied ? "Code copied" : "Copy voucher code"}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          {!compact && (
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Valid until {new Date(voucher.validUntil).toLocaleDateString()}
                  {isExpiringSoon && (
                    <span className="ml-1 text-amber-600 font-medium">
                      ({daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'} left)
                    </span>
                  )}
                </span>
              </div>
              
              {voucher.minBookingDays && (
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Minimum {voucher.minBookingDays} days booking required</span>
                </div>
              )}
              
              {voucher.minBookingMonths && (
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Minimum {voucher.minBookingMonths} months booking required</span>
                </div>
              )}

              {voucher.minBookingValue && (
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Minimum booking value: ${voucher.minBookingValue}</span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full transition-all ${usagePercentage > 80 ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>
                <span className="text-xs">
                  {voucher.currentUses}/{voucher.maxUses} used
                </span>
              </div>
            </div>
          )}
        </div>

        {showApplyButton && (
          <Button
            onClick={handleApply}
            disabled={isApplied || !voucher.active}
            size={compact ? 'sm' : 'default'}
            className="flex-shrink-0"
          >
            {isApplied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Applied
              </>
            ) : (
              'Apply'
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}
