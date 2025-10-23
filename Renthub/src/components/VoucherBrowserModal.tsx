import { useState, useMemo } from 'react'
import { Voucher, Property, User } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VoucherCard } from './VoucherCard'
import { MagnifyingGlass, Ticket, Tag, Gift } from '@phosphor-icons/react'
import { getEligibleVouchers } from '@/lib/voucherUtils'

function VoucherEmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
    </div>
  )
}

interface VoucherBrowserModalProps {
  open: boolean
  onClose: () => void
  vouchers: Voucher[]
  property?: Property
  user: User | null
  bookingDetails?: {
    price: number
    rentalTerm: 'short-term' | 'long-term'
    durationDays?: number
    durationMonths?: number
  }
  onApplyVoucher?: (code: string) => void
  appliedVoucherCode?: string
}

export function VoucherBrowserModal({
  open,
  onClose,
  vouchers,
  property,
  user,
  bookingDetails,
  onApplyVoucher,
  appliedVoucherCode
}: VoucherBrowserModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'eligible' | 'trending'>('all')

  const eligibleVouchers = useMemo(() => {
    if (!property || !bookingDetails) return []
    return getEligibleVouchers(vouchers, property, user, bookingDetails)
  }, [vouchers, property, user, bookingDetails])

  const filteredVouchers = useMemo(() => {
    let voucherList: Voucher[] = []

    switch (activeTab) {
      case 'all':
        voucherList = vouchers.filter(v => v.isPublic && v.active)
        break
      case 'eligible':
        voucherList = eligibleVouchers
        break
      case 'trending':
        voucherList = vouchers
          .filter(v => v.isPublic && v.active)
          .sort((a, b) => b.currentUses - a.currentUses)
          .slice(0, 10)
        break
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      voucherList = voucherList.filter(v => 
        v.code.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query)
      )
    }

    return voucherList
  }, [vouchers, eligibleVouchers, activeTab, searchQuery])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="w-6 h-6 text-primary" />
            Browse Vouchers & Discounts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search vouchers by code or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                All Vouchers
              </TabsTrigger>
              {property && bookingDetails && (
                <TabsTrigger value="eligible" className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Eligible ({eligibleVouchers.length})
                </TabsTrigger>
              )}
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Trending
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto mt-4">
              <TabsContent value="all" className="mt-0">
                {filteredVouchers.length === 0 ? (
                  <VoucherEmptyState
                    icon={Ticket}
                    title="No vouchers found"
                    description={searchQuery ? 'Try adjusting your search query' : 'No active vouchers available at the moment'}
                  />
                ) : (
                  <div className="grid gap-3">
                    {filteredVouchers.map(voucher => (
                      <VoucherCard
                        key={voucher.id}
                        voucher={voucher}
                        onApply={onApplyVoucher}
                        showApplyButton={!!onApplyVoucher}
                        isApplied={voucher.code === appliedVoucherCode}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="eligible" className="mt-0">
                {filteredVouchers.length === 0 ? (
                  <VoucherEmptyState
                    icon={Gift}
                    title="No eligible vouchers"
                    description="No vouchers are currently applicable to this booking"
                  />
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium">
                        Found {filteredVouchers.length} voucher{filteredVouchers.length !== 1 ? 's' : ''} you can use for this booking!
                      </p>
                    </div>
                    <div className="grid gap-3">
                      {filteredVouchers.map(voucher => (
                        <VoucherCard
                          key={voucher.id}
                          voucher={voucher}
                          onApply={onApplyVoucher}
                          showApplyButton={!!onApplyVoucher}
                          isApplied={voucher.code === appliedVoucherCode}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending" className="mt-0">
                {filteredVouchers.length === 0 ? (
                  <VoucherEmptyState
                    icon={Ticket}
                    title="No trending vouchers"
                    description="Check back later for popular deals"
                  />
                ) : (
                  <div className="grid gap-3">
                    {filteredVouchers.map(voucher => (
                      <VoucherCard
                        key={voucher.id}
                        voucher={voucher}
                        onApply={onApplyVoucher}
                        showApplyButton={!!onApplyVoucher}
                        isApplied={voucher.code === appliedVoucherCode}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
