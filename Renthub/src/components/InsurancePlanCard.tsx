import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Shield, Star, Check, Sparkle, TrendUp } from '@phosphor-icons/react'
import { InsurancePlan, Property } from '@/lib/types'
import { formatCurrency, formatCoverageAmount } from '@/lib/insuranceUtils'

interface InsurancePlanCardProps {
  plan: InsurancePlan
  property?: Property
  isComparing?: boolean
  onToggleCompare?: () => void
  onSelect: () => void
}

export function InsurancePlanCard({
  plan,
  property,
  isComparing,
  onToggleCompare,
  onSelect
}: InsurancePlanCardProps) {
  const mainCoverageItems = [
    plan.coverage.propertyDamage && {
      label: 'Property Damage',
      value: formatCoverageAmount(plan.coverage.propertyDamage)
    },
    plan.coverage.liability && {
      label: 'Liability',
      value: formatCoverageAmount(plan.coverage.liability)
    },
    plan.coverage.personalProperty && {
      label: 'Personal Property',
      value: formatCoverageAmount(plan.coverage.personalProperty)
    },
    plan.coverage.lossOfRent && {
      label: 'Loss of Rent',
      value: formatCoverageAmount(plan.coverage.lossOfRent)
    }
  ].filter(Boolean)

  return (
    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
      plan.featured ? 'border-primary border-2' : ''
    }`}>
      {plan.featured && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
          Featured
        </div>
      )}
      
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-3xl">{plan.providerLogo}</div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground mb-1">{plan.providerName}</div>
              <h3 className="font-semibold text-lg leading-tight">{plan.name}</h3>
            </div>
          </div>
          
          {onToggleCompare && (
            <div className="flex items-center gap-2 ml-2">
              <Checkbox
                id={`compare-${plan.id}`}
                checked={isComparing}
                onCheckedChange={onToggleCompare}
              />
              <label
                htmlFor={`compare-${plan.id}`}
                className="text-xs text-muted-foreground cursor-pointer whitespace-nowrap"
              >
                Compare
              </label>
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{formatCurrency(plan.pricing.basePrice)}</span>
          <span className="text-muted-foreground text-sm">/{plan.pricing.billingCycle}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {plan.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {plan.popular && (
            <Badge variant="secondary" className="gap-1">
              <TrendUp className="w-3 h-3" weight="bold" />
              Popular
            </Badge>
          )}
          {plan.recommended && (
            <Badge variant="secondary" className="gap-1">
              <Sparkle className="w-3 h-3" weight="fill" />
              Recommended
            </Badge>
          )}
          <Badge variant="outline" className="gap-1">
            <Star className="w-3 h-3" weight="fill" />
            {plan.rating.toFixed(1)}
          </Badge>
        </div>

        <div className="space-y-2 border-t border-b py-3">
          <div className="text-xs font-medium text-muted-foreground mb-2">Coverage Highlights</div>
          {mainCoverageItems.slice(0, 3).map((item: any, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Key Features</div>
          <div className="space-y-1">
            {plan.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" weight="bold" />
                <span className="text-muted-foreground leading-tight">{feature}</span>
              </div>
            ))}
            {plan.features.length > 3 && (
              <div className="text-xs text-muted-foreground pl-6">
                +{plan.features.length - 3} more features
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={onSelect}
          className="w-full"
          variant={plan.featured ? 'default' : 'outline'}
        >
          Get Quote
        </Button>
      </div>
    </Card>
  )
}
