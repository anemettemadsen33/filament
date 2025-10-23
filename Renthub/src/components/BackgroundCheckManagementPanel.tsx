import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BackgroundCheckRequest } from '@/lib/types'
import { BackgroundCheckDetailModal } from './BackgroundCheckDetailModal'
import { 
  getBackgroundCheckStatusColor, 
  getResultsStatusColor 
} from '@/lib/backgroundCheckUtils'
import { 
  ShieldCheck, 
  MagnifyingGlass, 
  Clock,
  CheckCircle,
  Warning,
  X,
  Calendar,
  User,
  ArrowRight,
  Download
} from '@phosphor-icons/react'
import { format } from 'date-fns'

interface BackgroundCheckManagementPanelProps {
  checks: BackgroundCheckRequest[]
  onViewCheck: (check: BackgroundCheckRequest) => void
}

export function BackgroundCheckManagementPanel({
  checks,
  onViewCheck
}: BackgroundCheckManagementPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCheck, setSelectedCheck] = useState<BackgroundCheckRequest | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const filteredChecks = checks.filter(check =>
    check.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    check.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (check.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const pendingChecks = filteredChecks.filter(c => c.status === 'pending')
  const processingChecks = filteredChecks.filter(c => c.status === 'processing')
  const completedChecks = filteredChecks.filter(c => c.status === 'completed')
  const failedChecks = filteredChecks.filter(c => c.status === 'failed')

  const handleViewCheck = (check: BackgroundCheckRequest) => {
    setSelectedCheck(check)
    setShowDetailModal(true)
    onViewCheck(check)
  }

  const getStatusIcon = (status: BackgroundCheckRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'processing':
        return <Clock className="w-4 h-4 animate-pulse" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'failed':
        return <X className="w-4 h-4" />
      case 'expired':
        return <Calendar className="w-4 h-4" />
      default:
        return null
    }
  }

  const CheckCard = ({ check }: { check: BackgroundCheckRequest }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewCheck(check)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <h4 className="font-semibold truncate">{check.userName}</h4>
              <Badge 
                variant="secondary" 
                className={`${getBackgroundCheckStatusColor(check.status)} flex items-center gap-1`}
              >
                {getStatusIcon(check.status)}
                {check.status}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="truncate">{check.userEmail}</div>
              {check.propertyTitle && (
                <div className="truncate">Property: {check.propertyTitle}</div>
              )}
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(check.createdAt, 'MMM d, yyyy')}
                </div>
                {check.completedAt && (
                  <div className="flex items-center gap-1 text-accent">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </div>
                )}
              </div>
            </div>

            {check.results && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Result:</span>
                  <Badge 
                    variant="secondary"
                    className={getResultsStatusColor(check.results.overallStatus)}
                  >
                    {check.results.overallStatus.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">
                    Score: {check.results.riskScore}/100
                  </span>
                </div>
              </div>
            )}
          </div>

          <Button variant="ghost" size="sm">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative max-w-md">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or property..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              id="background-check-search"
              name="backgroundCheckSearch"
              aria-label="Search background checks"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                  <div className="text-2xl font-bold">{pendingChecks.length}</div>
                </div>
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Processing</div>
                  <div className="text-2xl font-bold">{processingChecks.length}</div>
                </div>
                <Clock className="w-8 h-8 text-warning animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                  <div className="text-2xl font-bold">{completedChecks.length}</div>
                </div>
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                  <div className="text-2xl font-bold">{failedChecks.length}</div>
                </div>
                <Warning className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All ({filteredChecks.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingChecks.length})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({processingChecks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedChecks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredChecks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShieldCheck className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Background Checks</h3>
                  <p className="text-sm text-muted-foreground">
                    Background check requests will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredChecks.map((check) => (
                <CheckCard key={check.id} check={check} />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingChecks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Pending Checks</h3>
                  <p className="text-sm text-muted-foreground">
                    Checks awaiting payment will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingChecks.map((check) => (
                <CheckCard key={check.id} check={check} />
              ))
            )}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            {processingChecks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Processing Checks</h3>
                  <p className="text-sm text-muted-foreground">
                    Checks currently being processed will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              processingChecks.map((check) => (
                <CheckCard key={check.id} check={check} />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedChecks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No Completed Checks</h3>
                  <p className="text-sm text-muted-foreground">
                    Completed background checks will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedChecks.map((check) => (
                <CheckCard key={check.id} check={check} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedCheck && (
        <BackgroundCheckDetailModal
          open={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedCheck(null)
          }}
          check={selectedCheck}
        />
      )}
    </>
  )
}
