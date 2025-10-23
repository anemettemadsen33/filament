import { LeaseAgreement } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Warning, 
  Eye,
  Download,
  ArrowClockwise
} from '@phosphor-icons/react'
import { 
  isLeaseActive, 
  isLeaseExpiringSoon, 
  getDaysUntilExpiry,
  getLeaseDuration 
} from '@/lib/leaseUtils'

interface LeaseManagementPanelProps {
  leases: LeaseAgreement[]
  userId: string
  userRole: 'landlord' | 'tenant' | 'both'
  onViewLease: (lease: LeaseAgreement) => void
  onSignLease: (leaseId: string) => void
  onDownloadLease: (leaseId: string) => void
  onRenewLease?: (leaseId: string) => void
}

export function LeaseManagementPanel({
  leases,
  userId,
  userRole,
  onViewLease,
  onSignLease,
  onDownloadLease,
  onRenewLease
}: LeaseManagementPanelProps) {
  const landlordLeases = leases.filter(l => l.landlordId === userId)
  const tenantLeases = leases.filter(l => l.tenantId === userId)
  
  const activeLeases = leases.filter(l => isLeaseActive(l))
  const pendingLeases = leases.filter(l => 
    l.status === 'pending_landlord' || l.status === 'pending_tenant' || l.status === 'draft'
  )
  const expiringLeases = leases.filter(l => isLeaseExpiringSoon(l, 30))
  
  const getStatusBadge = (status: LeaseAgreement['status']) => {
    const variants: Record<LeaseAgreement['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      'draft': { variant: 'outline', label: 'Draft' },
      'pending_landlord': { variant: 'secondary', label: 'Pending Landlord' },
      'pending_tenant': { variant: 'secondary', label: 'Pending Tenant' },
      'active': { variant: 'default', label: 'Active' },
      'expired': { variant: 'outline', label: 'Expired' },
      'terminated': { variant: 'destructive', label: 'Terminated' },
      'renewed': { variant: 'outline', label: 'Renewed' }
    }
    
    const config = variants[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }
  
  const renderLeaseCard = (lease: LeaseAgreement) => {
    const needsSignature = 
      (lease.landlordId === userId && !lease.signatures.landlord) ||
      (lease.tenantId === userId && !lease.signatures.tenant)
    
    const isExpiring = isLeaseExpiringSoon(lease, 30)
    const daysUntilExpiry = isLeaseActive(lease) ? getDaysUntilExpiry(lease) : null
    const canRenew = isExpiring && onRenewLease && !lease.renewalStatus?.offered
    
    return (
      <Card key={lease.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg mb-1 truncate">
                {lease.propertyTitle}
              </CardTitle>
              <p className="text-sm text-muted-foreground truncate">
                {lease.propertyAddress}
              </p>
            </div>
            {getStatusBadge(lease.status)}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Duration</p>
              <p className="font-medium">{getLeaseDuration(lease)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Monthly Rent</p>
              <p className="font-medium">${lease.financials.monthlyRent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Start Date</p>
              <p className="font-medium">{new Date(lease.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">End Date</p>
              <p className="font-medium">{new Date(lease.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          {isExpiring && daysUntilExpiry !== null && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <Warning className="text-amber-600 shrink-0" weight="fill" />
              <p className="text-sm text-amber-900 dark:text-amber-100">
                Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
              </p>
            </div>
          )}
          
          {needsSignature && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <Clock className="text-blue-600 shrink-0" weight="fill" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Awaiting your signature
              </p>
            </div>
          )}
          
          {lease.signatures.landlord && lease.signatures.tenant && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <CheckCircle className="text-green-600 shrink-0" weight="fill" />
              <p className="text-sm text-green-900 dark:text-green-100">
                Fully signed and active
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewLease(lease)}
              className="flex-1"
            >
              <Eye className="mr-2" />
              View Details
            </Button>
            
            {needsSignature && (
              <Button
                size="sm"
                onClick={() => onSignLease(lease.id)}
                className="flex-1"
              >
                <FileText className="mr-2" />
                Sign Lease
              </Button>
            )}
            
            {lease.signatures.landlord && lease.signatures.tenant && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownloadLease(lease.id)}
              >
                <Download />
              </Button>
            )}
            
            {canRenew && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onRenewLease(lease.id)}
                className="flex-1"
              >
                <ArrowClockwise className="mr-2" />
                Renew
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (leases.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="mx-auto mb-4 text-muted-foreground" size={48} weight="light" />
            <h3 className="text-lg font-semibold mb-2">No Lease Agreements</h3>
            <p className="text-muted-foreground">
              You don't have any lease agreements yet.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {(activeLeases.length > 0 || expiringLeases.length > 0) && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Leases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeLeases.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Signatures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendingLeases.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-amber-600">{expiringLeases.length}</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {userRole === 'both' ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Leases</TabsTrigger>
            <TabsTrigger value="landlord">As Landlord</TabsTrigger>
            <TabsTrigger value="tenant">As Tenant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 mt-6">
            {leases.map(renderLeaseCard)}
          </TabsContent>
          
          <TabsContent value="landlord" className="space-y-4 mt-6">
            {landlordLeases.length > 0 ? (
              landlordLeases.map(renderLeaseCard)
            ) : (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">
                    No leases as landlord
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="tenant" className="space-y-4 mt-6">
            {tenantLeases.length > 0 ? (
              tenantLeases.map(renderLeaseCard)
            ) : (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">
                    No leases as tenant
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4">
          {leases.map(renderLeaseCard)}
        </div>
      )}
    </div>
  )
}
