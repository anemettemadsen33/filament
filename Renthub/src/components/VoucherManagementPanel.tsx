import { useState } from 'react'
import { Voucher, User, VoucherUsage } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Ticket, TrendUp, Users, ChartBar } from '@phosphor-icons/react'
import { VoucherCard } from './VoucherCard'
import { CreateVoucherModal } from './CreateVoucherModal'
import { formatVoucherValue } from '@/lib/voucherUtils'

interface VoucherManagementPanelProps {
  user: User
  vouchers: Voucher[]
  voucherUsages: VoucherUsage[]
  onCreateVoucher: (voucher: Omit<Voucher, 'id' | 'createdAt' | 'currentUses' | 'usedBy'>) => void
  onToggleActive: (voucherId: string, active: boolean) => void
  onDeleteVoucher: (voucherId: string) => void
}

export function VoucherManagementPanel({
  user,
  vouchers,
  voucherUsages,
  onCreateVoucher,
  onToggleActive,
  onDeleteVoucher
}: VoucherManagementPanelProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'active' | 'expired' | 'analytics'>('active')

  const myVouchers = vouchers.filter(v => v.createdBy === user.id)
  const activeVouchers = myVouchers.filter(v => v.active && v.validUntil > Date.now())
  const expiredVouchers = myVouchers.filter(v => !v.active || v.validUntil <= Date.now())
  
  const totalDiscountsGiven = voucherUsages
    .filter(u => myVouchers.some(v => v.id === u.voucherId))
    .reduce((sum, u) => sum + u.discountAmount, 0)
  
  const totalUsages = voucherUsages
    .filter(u => myVouchers.some(v => v.id === u.voucherId))
    .length

  const stats = [
    {
      label: 'Active Vouchers',
      value: activeVouchers.length,
      icon: Ticket,
      color: 'text-primary'
    },
    {
      label: 'Total Redemptions',
      value: totalUsages,
      icon: Users,
      color: 'text-green-600'
    },
    {
      label: 'Discounts Given',
      value: `$${totalDiscountsGiven.toFixed(0)}`,
      icon: TrendUp,
      color: 'text-amber-600'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Voucher Management</h2>
          <p className="text-muted-foreground">Create and manage discount vouchers for your properties</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Voucher
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeVouchers.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredVouchers.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3 mt-4">
          {activeVouchers.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active vouchers</h3>
                <p className="text-muted-foreground mb-4">Create your first voucher to start offering discounts</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Voucher
                </Button>
              </div>
            </Card>
          ) : (
            activeVouchers.map(voucher => (
              <Card key={voucher.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <VoucherCard voucher={voucher} showApplyButton={false} compact />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={voucher.active}
                        onCheckedChange={(checked) => onToggleActive(voucher.id, checked)}
                      />
                      <span className="text-sm text-muted-foreground">Active</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteVoucher(voucher.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-3 mt-4">
          {expiredVouchers.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No expired vouchers</h3>
                <p className="text-muted-foreground">Vouchers that expire or are deactivated will appear here</p>
              </div>
            </Card>
          ) : (
            expiredVouchers.map(voucher => (
              <Card key={voucher.id} className="p-4 opacity-60">
                <VoucherCard voucher={voucher} showApplyButton={false} compact />
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ChartBar className="w-5 h-5" />
                  Voucher Performance
                </h3>
                {myVouchers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No voucher data available yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {myVouchers
                      .sort((a, b) => b.currentUses - a.currentUses)
                      .slice(0, 5)
                      .map(voucher => {
                        const usages = voucherUsages.filter(u => u.voucherId === voucher.id)
                        const totalDiscount = usages.reduce((sum, u) => sum + u.discountAmount, 0)
                        
                        return (
                          <div key={voucher.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <code className="text-sm font-mono font-semibold">{voucher.code}</code>
                                <Badge className="ml-2 text-xs">{formatVoucherValue(voucher)}</Badge>
                              </div>
                              <div className="text-right text-sm">
                                <div className="font-semibold">{voucher.currentUses} uses</div>
                                <div className="text-muted-foreground">${totalDiscount.toFixed(0)} saved</div>
                              </div>
                            </div>
                            <div className="bg-muted rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all"
                                style={{ width: `${(voucher.currentUses / voucher.maxUses) * 100}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateVoucherModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={onCreateVoucher}
        userId={user.id}
      />
    </div>
  )
}
