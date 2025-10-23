import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, Check, X, FileText, CreditCard, Info } from '@phosphor-icons/react'
import { InsurancePlan, InsuranceQuote, Property } from '@/lib/types'
import { calculateInsuranceQuote, formatCurrency, formatCoverageAmount } from '@/lib/insuranceUtils'
import { toast } from 'sonner'

interface InsuranceQuoteModalProps {
  open: boolean
  onClose: () => void
  plan: InsurancePlan
  property?: Property
  onAcceptQuote: (quote: InsuranceQuote) => void
}

export function InsuranceQuoteModal({
  open,
  onClose,
  plan,
  property,
  onAcceptQuote
}: InsuranceQuoteModalProps) {
  const [selectedDeductible, setSelectedDeductible] = useState(plan.deductible)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'annual'>('monthly')

  const quote = calculateInsuranceQuote(plan, property, undefined, selectedDeductible)

  const handleAccept = () => {
    const acceptedQuote = {
      ...quote,
      status: 'accepted' as const,
      acceptedAt: Date.now()
    }
    onAcceptQuote(acceptedQuote)
    toast.success('Insurance quote accepted! We\'ll contact you shortly.')
    onClose()
  }

  const savingsAmount = billingCycle === 'annual' 
    ? quote.quotedPremium.monthly * 12 - quote.quotedPremium.annual
    : billingCycle === 'quarterly'
    ? quote.quotedPremium.monthly * 3 - quote.quotedPremium.quarterly
    : 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" weight="fill" />
            Insurance Quote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg p-6 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{plan.providerLogo}</div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">{plan.providerName}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="flex gap-2 mt-3">
                  {plan.featured && <Badge>Featured</Badge>}
                  {plan.popular && <Badge variant="secondary">Popular</Badge>}
                  {plan.recommended && <Badge variant="secondary">Recommended</Badge>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Deductible Amount</label>
                <Select
                  value={selectedDeductible.toString()}
                  onValueChange={(v) => setSelectedDeductible(parseInt(v))}
                >
                  <SelectTrigger aria-label="Deductible amount">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {plan.deductibleOptions?.map(amount => (
                      <SelectItem key={amount} value={amount.toString()}>
                        {formatCurrency(amount)}
                      </SelectItem>
                    )) || (
                      <SelectItem value={plan.deductible.toString()}>
                        {formatCurrency(plan.deductible)}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Amount you pay out-of-pocket before coverage kicks in
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Billing Cycle</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                    onClick={() => setBillingCycle('monthly')}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="text-xs">Monthly</span>
                    <span className="font-bold">{formatCurrency(quote.quotedPremium.monthly)}</span>
                  </Button>
                  <Button
                    variant={billingCycle === 'quarterly' ? 'default' : 'outline'}
                    onClick={() => setBillingCycle('quarterly')}
                    className="flex flex-col h-auto py-3 relative"
                  >
                    <span className="text-xs">Quarterly</span>
                    <span className="font-bold">{formatCurrency(quote.quotedPremium.quarterly)}</span>
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px] px-1">
                      Save 2%
                    </Badge>
                  </Button>
                  <Button
                    variant={billingCycle === 'annual' ? 'default' : 'outline'}
                    onClick={() => setBillingCycle('annual')}
                    className="flex flex-col h-auto py-3 relative"
                  >
                    <span className="text-xs">Annual</span>
                    <span className="font-bold">{formatCurrency(quote.quotedPremium.annual)}</span>
                    <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px] px-1">
                      Save 10%
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
              <h4 className="font-semibold">Your Quote Summary</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Premium</span>
                  <span className="font-medium">{formatCurrency(quote.quotedPremium[billingCycle])}</span>
                </div>
                
                {quote.discountsApplied.length > 0 && (
                  <>
                    {quote.discountsApplied.map((discount, index) => (
                      <div key={index} className="flex justify-between text-primary">
                        <span>{discount.name}</span>
                        <span>-{formatCurrency(discount.amount)}</span>
                      </div>
                    ))}
                  </>
                )}

                {savingsAmount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Payment Plan Savings</span>
                    <span>-{formatCurrency(savingsAmount)}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-semibold">Total {billingCycle === 'monthly' ? 'Monthly' : billingCycle === 'quarterly' ? 'Quarterly' : 'Annual'} Premium</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(quote.quotedPremium[billingCycle])}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Annual cost: {formatCurrency(quote.totalAnnualCost)}
                </div>
              </div>

              {savingsAmount > 0 && (
                <div className="bg-primary/10 text-primary rounded-lg p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" weight="fill" />
                    <div>
                      You save {formatCurrency(savingsAmount)} per year with {billingCycle} billing!
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Tabs defaultValue="coverage" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="coverage">Coverage Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
            </TabsList>

            <TabsContent value="coverage" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {plan.coverage.propertyDamage && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Shield className="w-5 h-5 text-primary mt-0.5" weight="fill" />
                    <div>
                      <div className="font-medium">Property Damage</div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCoverageAmount(plan.coverage.propertyDamage)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Coverage for physical damage to the property
                      </div>
                    </div>
                  </div>
                )}

                {plan.coverage.liability && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Shield className="w-5 h-5 text-primary mt-0.5" weight="fill" />
                    <div>
                      <div className="font-medium">Liability Coverage</div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCoverageAmount(plan.coverage.liability)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Protection against legal claims and lawsuits
                      </div>
                    </div>
                  </div>
                )}

                {plan.coverage.personalProperty && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Shield className="w-5 h-5 text-primary mt-0.5" weight="fill" />
                    <div>
                      <div className="font-medium">Personal Property</div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCoverageAmount(plan.coverage.personalProperty)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Coverage for your belongings and possessions
                      </div>
                    </div>
                  </div>
                )}

                {plan.coverage.lossOfRent && (
                  <div className="flex items-start gap-3 p-4 border rounded-lg">
                    <Shield className="w-5 h-5 text-primary mt-0.5" weight="fill" />
                    <div>
                      <div className="font-medium">Loss of Rent</div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCoverageAmount(plan.coverage.lossOfRent)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Covers lost rental income during repairs
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Protected Against</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {plan.coverage.fire && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" weight="bold" />
                      <span className="text-sm">Fire Damage</span>
                    </div>
                  )}
                  {plan.coverage.water && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" weight="bold" />
                      <span className="text-sm">Water Damage</span>
                    </div>
                  )}
                  {plan.coverage.theft && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" weight="bold" />
                      <span className="text-sm">Theft</span>
                    </div>
                  )}
                  {plan.coverage.vandalism && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" weight="bold" />
                      <span className="text-sm">Vandalism</span>
                    </div>
                  )}
                  {plan.coverage.naturalDisasters && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" weight="bold" />
                      <span className="text-sm">Natural Disasters</span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" weight="bold" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="exclusions" className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    The following items are not covered under this insurance plan. Please review carefully.
                  </div>
                </div>
              </div>
              {plan.exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{exclusion}</span>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAccept} className="flex-1">
              <CreditCard className="w-4 h-4 mr-2" />
              Accept Quote & Continue
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            Quote valid until {new Date(quote.validUntil).toLocaleDateString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
