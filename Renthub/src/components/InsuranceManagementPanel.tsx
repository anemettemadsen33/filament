import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Shield, Plus, FileText, CheckCircle, Clock, Warning, CreditCard } from '@phosphor-icons/react'
import { InsurancePolicy, InsuranceClaim, InsuranceQuote } from '@/lib/types'
import { formatCurrency, formatCoverageAmount } from '@/lib/insuranceUtils'

interface InsuranceManagementPanelProps {
  policies: InsurancePolicy[]
  quotes: InsuranceQuote[]
  claims: InsuranceClaim[]
  userType: 'landlord' | 'tenant'
  onBrowseInsurance: () => void
  onViewPolicy: (policy: InsurancePolicy) => void
  onViewClaim: (claim: InsuranceClaim) => void
  onFileClaim: () => void
}

export function InsuranceManagementPanel({
  policies,
  quotes,
  claims,
  userType,
  onBrowseInsurance,
  onViewPolicy,
  onViewClaim,
  onFileClaim
}: InsuranceManagementPanelProps) {
  const activePolicies = policies.filter(p => p.status === 'active')
  const pendingQuotes = quotes.filter(q => q.status === 'provided' || q.status === 'pending')
  const activeClaims = claims.filter(c => !['closed', 'denied'].includes(c.status))

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'expired':
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getClaimStatusColor = (status: InsuranceClaim['status']) => {
    switch (status) {
      case 'approved':
      case 'partially-approved':
        return 'default'
      case 'under-review':
      case 'investigating':
        return 'secondary'
      case 'denied':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Insurance Management</h2>
          <p className="text-muted-foreground">
            Manage your insurance policies, quotes, and claims
          </p>
        </div>
        <Button onClick={onBrowseInsurance}>
          <Plus className="w-4 h-4 mr-2" />
          Browse Insurance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-5 h-5 text-primary" weight="fill" />
            </div>
            <Badge>{activePolicies.length}</Badge>
          </div>
          <div className="text-2xl font-bold">{activePolicies.length}</div>
          <div className="text-sm text-muted-foreground">Active Policies</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Clock className="w-5 h-5 text-secondary-foreground" weight="bold" />
            </div>
            <Badge variant="secondary">{pendingQuotes.length}</Badge>
          </div>
          <div className="text-2xl font-bold">{pendingQuotes.length}</div>
          <div className="text-sm text-muted-foreground">Pending Quotes</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-warning/10 rounded-lg">
              <FileText className="w-5 h-5 text-warning-foreground" weight="bold" />
            </div>
            <Badge variant="outline">{activeClaims.length}</Badge>
          </div>
          <div className="text-2xl font-bold">{activeClaims.length}</div>
          <div className="text-sm text-muted-foreground">Active Claims</div>
        </Card>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">
            Policies ({activePolicies.length})
          </TabsTrigger>
          <TabsTrigger value="quotes">
            Quotes ({pendingQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="claims">
            Claims ({claims.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          {activePolicies.length > 0 ? (
            <div className="space-y-4">
              {activePolicies.map(policy => (
                <Card key={policy.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Shield className="w-6 h-6 text-primary" weight="fill" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{policy.planName}</h3>
                          <Badge variant={getStatusColor(policy.status)}>
                            {policy.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {policy.providerName} • Policy #{policy.policyNumber}
                        </div>
                        {policy.propertyTitle && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Property: {policy.propertyTitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onViewPolicy(policy)}>
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {policy.coverageDetails.propertyDamage && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Property Damage</div>
                        <div className="font-semibold">
                          {formatCoverageAmount(policy.coverageDetails.propertyDamage)}
                        </div>
                      </div>
                    )}
                    {policy.coverageDetails.liability && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Liability</div>
                        <div className="font-semibold">
                          {formatCoverageAmount(policy.coverageDetails.liability)}
                        </div>
                      </div>
                    )}
                    {policy.coverageDetails.personalProperty && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Personal Property</div>
                        <div className="font-semibold">
                          {formatCoverageAmount(policy.coverageDetails.personalProperty)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Deductible</div>
                      <div className="font-semibold">{formatCurrency(policy.deductible)}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Premium</div>
                        <div className="font-semibold">
                          {formatCurrency(policy.pricing.premium)}/{policy.pricing.billingCycle}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Next Payment</div>
                        <div className="font-semibold">
                          {new Date(policy.pricing.nextPaymentDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Expires</div>
                        <div className="font-semibold">
                          {new Date(policy.expirationDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" onClick={onFileClaim}>
                      <FileText className="w-4 h-4 mr-2" />
                      File Claim
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Policies</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any active insurance policies yet.
              </p>
              <Button onClick={onBrowseInsurance}>
                Browse Insurance Plans
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4">
          {pendingQuotes.length > 0 ? (
            <div className="space-y-4">
              {pendingQuotes.map(quote => (
                <Card key={quote.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{quote.planName}</h3>
                        <Badge variant="secondary">{quote.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {quote.providerName}
                      </div>
                      {quote.propertyDetails && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Property: {quote.propertyDetails.address}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(quote.quotedPremium.monthly)}/mo
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Annual: {formatCurrency(quote.totalAnnualCost)}
                      </div>
                    </div>
                  </div>

                  {quote.discountsApplied.length > 0 && (
                    <div className="bg-primary/5 rounded-lg p-3 mb-4">
                      <div className="text-xs font-medium mb-2">Discounts Applied</div>
                      <div className="space-y-1">
                        {quote.discountsApplied.map((discount, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{discount.name}</span>
                            <span className="text-primary font-medium">
                              -{formatCurrency(discount.amount)} ({discount.percentage}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Valid until {new Date(quote.validUntil).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Decline
                      </Button>
                      <Button size="sm">
                        Accept Quote
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pending Quotes</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any pending insurance quotes.
              </p>
              <Button onClick={onBrowseInsurance}>
                Get a Quote
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="claims" className="space-y-4">
          {claims.length > 0 ? (
            <div className="space-y-4">
              {claims.map(claim => (
                <Card key={claim.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-warning/10 rounded-lg">
                        <FileText className="w-6 h-6 text-warning-foreground" weight="bold" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">Claim #{claim.claimNumber}</h3>
                          <Badge variant={getClaimStatusColor(claim.status)}>
                            {claim.status.replace(/-/g, ' ')}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {claim.claimType.replace(/-/g, ' ')} • Filed {new Date(claim.reportedDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm mt-2 line-clamp-2">
                          {claim.description}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onViewClaim(claim)}>
                      View Details
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Claimed Amount</div>
                      <div className="font-semibold">{formatCurrency(claim.claimedAmount)}</div>
                    </div>
                    {claim.approvedAmount && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Approved Amount</div>
                        <div className="font-semibold text-primary">
                          {formatCurrency(claim.approvedAmount)}
                        </div>
                      </div>
                    )}
                    {claim.paidAmount && (
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Paid Amount</div>
                        <div className="font-semibold text-primary">
                          {formatCurrency(claim.paidAmount)}
                        </div>
                      </div>
                    )}
                  </div>

                  {claim.timeline && claim.timeline.length > 0 && (
                    <div className="pt-4 border-t">
                      <div className="text-xs font-medium mb-2">Recent Update</div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          {new Date(claim.timeline[claim.timeline.length - 1].timestamp).toLocaleDateString()}:
                        </span>{' '}
                        {claim.timeline[claim.timeline.length - 1].action}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Claims Filed</h3>
              <p className="text-muted-foreground mb-4">
                You haven't filed any insurance claims yet.
              </p>
              {activePolicies.length > 0 && (
                <Button onClick={onFileClaim}>
                  File a Claim
                </Button>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
