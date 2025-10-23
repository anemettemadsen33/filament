import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Check, Star } from '@phosphor-icons/react'
import { InsurancePlan, Property } from '@/lib/types'
import { formatCurrency, formatCoverageAmount } from '@/lib/insuranceUtils'

interface InsuranceComparisonViewProps {
  plans: InsurancePlan[]
  property?: Property
  onRemovePlan: (planId: string) => void
  onSelectPlan: (plan: InsurancePlan) => void
}

export function InsuranceComparisonView({
  plans,
  property,
  onRemovePlan,
  onSelectPlan
}: InsuranceComparisonViewProps) {
  const coverageFields = [
    { key: 'propertyDamage', label: 'Property Damage' },
    { key: 'liability', label: 'Liability Coverage' },
    { key: 'personalProperty', label: 'Personal Property' },
    { key: 'lossOfRent', label: 'Loss of Rent' },
    { key: 'additionalLiving', label: 'Additional Living' },
    { key: 'medicalPayments', label: 'Medical Payments' },
    { key: 'legalFees', label: 'Legal Fees' }
  ]

  const booleanFields = [
    { key: 'fire', label: 'Fire Protection' },
    { key: 'water', label: 'Water Damage' },
    { key: 'theft', label: 'Theft Coverage' },
    { key: 'vandalism', label: 'Vandalism' },
    { key: 'naturalDisasters', label: 'Natural Disasters' }
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${plans.length}, minmax(0, 1fr))` }}>
        {plans.map(plan => (
          <div key={plan.id} className="border rounded-lg p-4 space-y-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => onRemovePlan(plan.id)}
              aria-label="Remove plan"
              title="Remove plan"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="pr-8">
              <div className="text-2xl mb-2">{plan.providerLogo}</div>
              <div className="text-xs text-muted-foreground">{plan.providerName}</div>
              <h3 className="font-semibold text-base mb-2">{plan.name}</h3>
              
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{formatCurrency(plan.pricing.basePrice)}</span>
                  <span className="text-xs text-muted-foreground">/{plan.pricing.billingCycle}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {plan.featured && (
                    <Badge variant="default" className="text-xs">Featured</Badge>
                  )}
                  {plan.popular && (
                    <Badge variant="secondary" className="text-xs">Popular</Badge>
                  )}
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Star className="w-3 h-3" weight="fill" />
                    {plan.rating}
                  </Badge>
                </div>
              </div>
            </div>

            <Button onClick={() => onSelectPlan(plan)} className="w-full" size="sm">
              Get Quote
            </Button>
          </div>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted px-4 py-3">
          <h4 className="font-semibold">Coverage Comparison</h4>
        </div>
        
        <div className="divide-y">
          {coverageFields.map(field => {
            const hasAny = plans.some(plan => (plan.coverage as any)[field.key])
            if (!hasAny) return null

            return (
              <div
                key={field.key}
                className="grid gap-4 px-4 py-3"
                style={{ gridTemplateColumns: `200px repeat(${plans.length}, minmax(0, 1fr))` }}
              >
                <div className="font-medium text-sm">{field.label}</div>
                {plans.map(plan => {
                  const value = (plan.coverage as any)[field.key]
                  return (
                    <div key={plan.id} className="text-sm text-center">
                      {value ? (
                        <span className="font-semibold">{formatCoverageAmount(value)}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="bg-muted px-4 py-3 mt-4">
          <h4 className="font-semibold">Protection Features</h4>
        </div>

        <div className="divide-y">
          {booleanFields.map(field => {
            const hasAny = plans.some(plan => (plan.coverage as any)[field.key])
            if (!hasAny) return null

            return (
              <div
                key={field.key}
                className="grid gap-4 px-4 py-3"
                style={{ gridTemplateColumns: `200px repeat(${plans.length}, minmax(0, 1fr))` }}
              >
                <div className="font-medium text-sm">{field.label}</div>
                {plans.map(plan => {
                  const value = (plan.coverage as any)[field.key]
                  return (
                    <div key={plan.id} className="flex justify-center">
                      {value ? (
                        <Check className="w-5 h-5 text-primary" weight="bold" />
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="bg-muted px-4 py-3 mt-4">
          <h4 className="font-semibold">Plan Details</h4>
        </div>

        <div className="divide-y">
          <div
            className="grid gap-4 px-4 py-3"
            style={{ gridTemplateColumns: `200px repeat(${plans.length}, minmax(0, 1fr))` }}
          >
            <div className="font-medium text-sm">Deductible</div>
            {plans.map(plan => (
              <div key={plan.id} className="text-sm text-center font-semibold">
                {formatCurrency(plan.deductible)}
              </div>
            ))}
          </div>

          <div
            className="grid gap-4 px-4 py-3"
            style={{ gridTemplateColumns: `200px repeat(${plans.length}, minmax(0, 1fr))` }}
          >
            <div className="font-medium text-sm">Claims Processing</div>
            {plans.map(plan => (
              <div key={plan.id} className="text-sm text-center">
                {plan.claimsProcess.averageProcessingTime} days
              </div>
            ))}
          </div>

          <div
            className="grid gap-4 px-4 py-3"
            style={{ gridTemplateColumns: `200px repeat(${plans.length}, minmax(0, 1fr))` }}
          >
            <div className="font-medium text-sm">24/7 Support</div>
            {plans.map(plan => (
              <div key={plan.id} className="flex justify-center">
                {plan.claimsProcess.phoneSupport247 ? (
                  <Check className="w-5 h-5 text-primary" weight="bold" />
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </div>
            ))}
          </div>

          <div
            className="grid gap-4 px-4 py-3"
            style={{ gridTemplateColumns: `200px repeat(${plans.length}, minmax(0, 1fr))` }}
          >
            <div className="font-medium text-sm">Online Claims</div>
            {plans.map(plan => (
              <div key={plan.id} className="flex justify-center">
                {plan.claimsProcess.onlineClaimSubmission ? (
                  <Check className="w-5 h-5 text-primary" weight="bold" />
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </div>
            ))}
          </div>

          <div
            className="grid gap-4 px-4 py-3"
            style={{ gridTemplateColumns: `200px repeat(${plans.length}, minmax(0, 1fr))` }}
          >
            <div className="font-medium text-sm">Customer Rating</div>
            {plans.map(plan => (
              <div key={plan.id} className="text-sm text-center font-semibold">
                {plan.rating.toFixed(1)}/5.0
              </div>
            ))}
          </div>

          <div
            className="grid gap-4 px-4 py-3"
            style={{ gridTemplateColumns: `200px repeat(${plans.length}, minmax(0, 1fr))` }}
          >
            <div className="font-medium text-sm">Reviews</div>
            {plans.map(plan => (
              <div key={plan.id} className="text-sm text-center text-muted-foreground">
                {plan.reviewCount.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
