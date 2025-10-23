import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Star, Check, Info, TrendUp, Trophy, Clock } from '@phosphor-icons/react'
import { InsurancePlan, InsuranceProvider, Property } from '@/lib/types'
import { insurancePlans, insuranceProviders, filterInsurancePlans, formatCurrency, formatCoverageAmount } from '@/lib/insuranceUtils'
import { InsurancePlanCard } from './InsurancePlanCard'
import { InsuranceComparisonView } from './InsuranceComparisonView'

interface InsuranceBrowserModalProps {
  open: boolean
  onClose: () => void
  userType?: 'landlord' | 'tenant'
  property?: Property
  onSelectPlan: (plan: InsurancePlan) => void
}

export function InsuranceBrowserModal({
  open,
  onClose,
  userType = 'tenant',
  property,
  onSelectPlan
}: InsuranceBrowserModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [maxBudget, setMaxBudget] = useState<string>('')
  const [compareList, setCompareList] = useState<string[]>([])
  const [view, setView] = useState<'browse' | 'compare'>('browse')

  const filteredPlans = filterInsurancePlans(insurancePlans, {
    userType: selectedCategory === 'all' ? undefined : (selectedCategory as any),
    maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
    providerId: selectedProvider === 'all' ? undefined : selectedProvider
  })

  const displayedPlans = filteredPlans.filter(plan => 
    plan.targetAudience.includes(userType) || plan.targetAudience.includes('both')
  )

  const featuredPlans = displayedPlans.filter(p => p.featured)
  const popularPlans = displayedPlans.filter(p => p.popular && !p.featured)
  const otherPlans = displayedPlans.filter(p => !p.popular && !p.featured)

  const handleToggleCompare = (planId: string) => {
    setCompareList(prev => {
      if (prev.includes(planId)) {
        return prev.filter(id => id !== planId)
      }
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, planId]
    })
  }

  const plansToCompare = insurancePlans.filter(p => compareList.includes(p.id))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" weight="fill" />
            Insurance Options
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-6 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="w-6 h-6 text-primary" weight="fill" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  {userType === 'tenant' ? 'Protect Your Belongings' : 'Protect Your Investment'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userType === 'tenant' 
                    ? 'Get comprehensive coverage for your personal property, liability protection, and peace of mind for as low as $15/month.'
                    : 'Safeguard your rental property with coverage for damage, liability, loss of rent, and more.'}
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" weight="bold" />
                    <span>24/7 Claims Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" weight="bold" />
                    <span>Fast Approval</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" weight="bold" />
                    <span>Flexible Coverage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="browse">Browse Plans</TabsTrigger>
                <TabsTrigger value="compare" disabled={compareList.length < 2}>
                  Compare ({compareList.length})
                </TabsTrigger>
              </TabsList>
              
              {view === 'browse' && compareList.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setView('compare')}
                  disabled={compareList.length < 2}
                >
                  Compare {compareList.length} Plan{compareList.length !== 1 ? 's' : ''}
                </Button>
              )}
            </div>

            <TabsContent value="browse" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger aria-label="Insurance category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="tenant">Tenant Insurance</SelectItem>
                      <SelectItem value="landlord">Landlord Insurance</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      <SelectItem value="liability">Liability Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Provider</label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger aria-label="Provider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Providers</SelectItem>
                      {insuranceProviders.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.logo} {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Max Monthly Budget</label>
                  <Input
                    type="number"
                    placeholder="No limit"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                  />
                </div>
              </div>

              {featuredPlans.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" weight="fill" />
                    <h3 className="font-semibold">Featured Plans</h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {featuredPlans.map(plan => (
                      <InsurancePlanCard
                        key={plan.id}
                        plan={plan}
                        property={property}
                        isComparing={compareList.includes(plan.id)}
                        onToggleCompare={() => handleToggleCompare(plan.id)}
                        onSelect={() => onSelectPlan(plan)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {popularPlans.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendUp className="w-5 h-5 text-primary" weight="bold" />
                    <h3 className="font-semibold">Popular Plans</h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {popularPlans.map(plan => (
                      <InsurancePlanCard
                        key={plan.id}
                        plan={plan}
                        property={property}
                        isComparing={compareList.includes(plan.id)}
                        onToggleCompare={() => handleToggleCompare(plan.id)}
                        onSelect={() => onSelectPlan(plan)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {otherPlans.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">More Options</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {otherPlans.map(plan => (
                      <InsurancePlanCard
                        key={plan.id}
                        plan={plan}
                        property={property}
                        isComparing={compareList.includes(plan.id)}
                        onToggleCompare={() => handleToggleCompare(plan.id)}
                        onSelect={() => onSelectPlan(plan)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {displayedPlans.length === 0 && (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No plans match your criteria</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory('all')
                      setSelectedProvider('all')
                      setMaxBudget('')
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="compare">
              {plansToCompare.length >= 2 ? (
                <InsuranceComparisonView
                  plans={plansToCompare}
                  property={property}
                  onRemovePlan={(planId) => handleToggleCompare(planId)}
                  onSelectPlan={onSelectPlan}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Select at least 2 plans to compare</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
