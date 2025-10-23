import { LeaseAgreement } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock,
  User,
  MapPin,
  CurrencyDollar,
  Calendar,
  PawPrint,
  Prohibit,
  Users,
  LightbulbFilament,
  CarSimple
} from '@phosphor-icons/react'
import { getLeaseDuration, isLeaseFullySigned } from '@/lib/leaseUtils'

interface LeaseDetailModalProps {
  lease: LeaseAgreement | null
  open: boolean
  onClose: () => void
  currentUserId: string
  onSign?: () => void
  onDownload?: () => void
}

export function LeaseDetailModal({
  lease,
  open,
  onClose,
  currentUserId,
  onSign,
  onDownload
}: LeaseDetailModalProps) {
  if (!lease) return null
  
  const isLandlord = lease.landlordId === currentUserId
  const isTenant = lease.tenantId === currentUserId
  const canSign = 
    (isLandlord && !lease.signatures.landlord) || 
    (isTenant && !lease.signatures.tenant)
  const fullySigned = isLeaseFullySigned(lease)
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl mb-2">Lease Agreement</DialogTitle>
              <p className="text-sm text-muted-foreground">{lease.propertyTitle}</p>
            </div>
            <div className="flex gap-2">
              {fullySigned && onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="mr-2" />
                  Download
                </Button>
              )}
              {canSign && onSign && (
                <Button size="sm" onClick={onSign}>
                  <FileText className="mr-2" />
                  Sign Lease
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="space-y-6 pr-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User />
                  <span>Landlord</span>
                </div>
                <div>
                  <p className="font-semibold">{lease.landlordName}</p>
                  <p className="text-sm text-muted-foreground">{lease.landlordEmail}</p>
                  {lease.landlordPhone && (
                    <p className="text-sm text-muted-foreground">{lease.landlordPhone}</p>
                  )}
                </div>
                {lease.signatures.landlord && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle weight="fill" />
                    <span>Signed {new Date(lease.signatures.landlord.signedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User />
                  <span>Tenant</span>
                </div>
                <div>
                  <p className="font-semibold">{lease.tenantName}</p>
                  <p className="text-sm text-muted-foreground">{lease.tenantEmail}</p>
                  <p className="text-sm text-muted-foreground">{lease.tenantPhone}</p>
                </div>
                {lease.signatures.tenant && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle weight="fill" />
                    <span>Signed {new Date(lease.signatures.tenant.signedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                <MapPin />
                <span>Property</span>
              </div>
              <div className="ml-6">
                <p className="font-semibold">{lease.propertyTitle}</p>
                <p className="text-sm text-muted-foreground">{lease.propertyAddress}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                <Calendar />
                <span>Lease Term</span>
              </div>
              <div className="ml-6 grid gap-3 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="font-medium">{getLeaseDuration(lease)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                  <p className="font-medium">{new Date(lease.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">End Date</p>
                  <p className="font-medium">{new Date(lease.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                <CurrencyDollar />
                <span>Financial Terms</span>
              </div>
              <div className="ml-6 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Rent</p>
                    <p className="text-lg font-bold">
                      ${lease.financials.monthlyRent.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Security Deposit</p>
                    <p className="text-lg font-bold">
                      ${lease.financials.securityDeposit.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>First Month Rent</span>
                    <span className="font-medium">
                      ${lease.financials.firstMonthRent.toLocaleString()}
                    </span>
                  </div>
                  {lease.financials.lastMonthRent && (
                    <div className="flex justify-between text-sm">
                      <span>Last Month Rent</span>
                      <span className="font-medium">
                        ${lease.financials.lastMonthRent.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Security Deposit</span>
                    <span className="font-medium">
                      ${lease.financials.securityDeposit.toLocaleString()}
                    </span>
                  </div>
                  {lease.financials.petDeposit && (
                    <div className="flex justify-between text-sm">
                      <span>Pet Deposit</span>
                      <span className="font-medium">
                        ${lease.financials.petDeposit.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total Upfront</span>
                    <span>${lease.financials.totalUpfront.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Payment Due</p>
                    <p className="font-medium">Day {lease.financials.paymentDueDay} of each month</p>
                  </div>
                  {lease.financials.lateFee && (
                    <div>
                      <p className="text-muted-foreground mb-1">Late Fee</p>
                      <p className="font-medium">${lease.financials.lateFee}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <Separator />
            
            <Tabs defaultValue="terms" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="terms">Property Terms</TabsTrigger>
                <TabsTrigger value="responsibilities">Responsibilities</TabsTrigger>
                <TabsTrigger value="clauses">Legal Clauses</TabsTrigger>
              </TabsList>
              
              <TabsContent value="terms" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <PawPrint className={lease.terms.petsAllowed ? 'text-green-600' : 'text-muted-foreground'} />
                    <div>
                      <p className="font-medium">Pets</p>
                      <p className="text-sm text-muted-foreground">
                        {lease.terms.petsAllowed ? 'Allowed' : 'Not Allowed'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Prohibit className={lease.terms.smokingAllowed ? 'text-green-600' : 'text-muted-foreground'} />
                    <div>
                      <p className="font-medium">Smoking</p>
                      <p className="text-sm text-muted-foreground">
                        {lease.terms.smokingAllowed ? 'Allowed' : 'Not Allowed'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className={lease.terms.sublettingAllowed ? 'text-green-600' : 'text-muted-foreground'} />
                    <div>
                      <p className="font-medium">Subletting</p>
                      <p className="text-sm text-muted-foreground">
                        {lease.terms.sublettingAllowed ? 'Allowed' : 'Not Allowed'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users />
                    <div>
                      <p className="font-medium">Max Occupants</p>
                      <p className="text-sm text-muted-foreground">
                        {lease.terms.maxOccupants} people
                      </p>
                    </div>
                  </div>
                  
                  {lease.terms.parkingSpaces && lease.terms.parkingSpaces > 0 && (
                    <div className="flex items-center gap-3">
                      <CarSimple />
                      <div>
                        <p className="font-medium">Parking</p>
                        <p className="text-sm text-muted-foreground">
                          {lease.terms.parkingSpaces} space{lease.terms.parkingSpaces > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <FileText />
                    <div>
                      <p className="font-medium">Furnished</p>
                      <p className="text-sm text-muted-foreground">
                        {lease.terms.furnished ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                    <LightbulbFilament />
                    <span>Utilities</span>
                  </div>
                  <div className="ml-6 space-y-2">
                    {lease.terms.utilities.map((utility, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{utility.name}</span>
                        <Badge variant={utility.includedInRent ? 'default' : 'outline'}>
                          {utility.includedInRent ? 'Included' : 'Tenant Pays'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="responsibilities" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-3">Landlord Responsibilities</h4>
                  <ul className="space-y-2">
                    {lease.responsibilities.landlord.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 shrink-0 text-primary" size={16} />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-3">Tenant Responsibilities</h4>
                  <ul className="space-y-2">
                    {lease.responsibilities.tenant.map((resp, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="mt-0.5 shrink-0 text-primary" size={16} />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="clauses" className="space-y-4 mt-4">
                {lease.specialClauses.length > 0 && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-3">Special Clauses</h4>
                      <ul className="space-y-2">
                        {lease.specialClauses.map((clause, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="font-medium shrink-0">{index + 1}.</span>
                            <span>{clause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                  </>
                )}
                
                <div>
                  <h4 className="font-semibold mb-3">General Terms</h4>
                  <div className="text-sm text-muted-foreground space-y-3">
                    <p>
                      This lease agreement is governed by the laws of {lease.metadata?.jurisdiction || 'the local jurisdiction'}.
                      Both parties agree to comply with all terms and conditions set forth in this agreement.
                    </p>
                    <p>
                      Any disputes arising from this agreement shall be resolved through mediation or
                      arbitration as required by local law.
                    </p>
                    <p>
                      This agreement may be amended only through written consent of both parties.
                      All notices must be provided in writing to the addresses listed above.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {!fullySigned && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 text-blue-600 shrink-0" weight="fill" />
                  <div className="space-y-1">
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Signatures Required
                    </p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      {!lease.signatures.landlord && !lease.signatures.tenant && (
                        'Both landlord and tenant must sign this lease for it to become active.'
                      )}
                      {lease.signatures.landlord && !lease.signatures.tenant && (
                        'Waiting for tenant signature to activate this lease.'
                      )}
                      {!lease.signatures.landlord && lease.signatures.tenant && (
                        'Waiting for landlord signature to activate this lease.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
