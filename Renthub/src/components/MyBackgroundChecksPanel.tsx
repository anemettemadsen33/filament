import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BackgroundCheckRequest, User } from '@/lib/types'
import { BackgroundCheckRequestModal } from './BackgroundCheckRequestModal'
import { BackgroundCheckDetailModal } from './BackgroundCheckDetailModal'
import { 
  getBackgroundCheckStatusColor, 
  getResultsStatusColor 
} from '@/lib/backgroundCheckUtils'
import { 
  ShieldCheck, 
  Clock,
  CheckCircle,
  Warning,
  Plus,
  Calendar,
  CurrencyDollar,
  ArrowRight,
  FileText
} from '@phosphor-icons/react'
import { format } from 'date-fns'

interface MyBackgroundChecksPanelProps {
  checks: BackgroundCheckRequest[]
  currentUser: User | null
  onSubmitRequest: (request: Omit<BackgroundCheckRequest, 'id' | 'createdAt' | 'updatedAt'>) => void
}

export function MyBackgroundChecksPanel({
  checks,
  currentUser,
  onSubmitRequest
}: MyBackgroundChecksPanelProps) {
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedCheck, setSelectedCheck] = useState<BackgroundCheckRequest | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleViewCheck = (check: BackgroundCheckRequest) => {
    setSelectedCheck(check)
    setShowDetailModal(true)
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
        return <Warning className="w-4 h-4" />
      case 'expired':
        return <Calendar className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusMessage = (status: BackgroundCheckRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'Awaiting payment to begin processing'
      case 'processing':
        return 'Being processed - typically takes 2-5 business days'
      case 'completed':
        return 'Results available'
      case 'failed':
        return 'Check failed - please contact support'
      case 'expired':
        return 'Results expired after 90 days'
      default:
        return ''
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Background Checks</h2>
            <p className="text-muted-foreground">
              Manage your tenant screening reports
            </p>
          </div>
          <Button onClick={() => setShowRequestModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Request New Check
          </Button>
        </div>

        {checks.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShieldCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Background Checks Yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Background checks help landlords verify your rental history, credit score, and more. 
                Many properties require a completed background check before approval.
              </p>
              <Button onClick={() => setShowRequestModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Request Background Check
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {checks.map((check) => (
              <Card 
                key={check.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewCheck(check)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {check.propertyTitle || 'General Background Check'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Requested by {check.requestedByName}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`${getBackgroundCheckStatusColor(check.status)} flex items-center gap-1`}
                        >
                          {getStatusIcon(check.status)}
                          {check.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-muted-foreground">Requested</div>
                            <div className="font-medium">
                              {format(check.createdAt, 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>

                        {check.completedAt && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <div>
                              <div className="text-muted-foreground">Completed</div>
                              <div className="font-medium">
                                {format(check.completedAt, 'MMM d, yyyy')}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                          <CurrencyDollar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="text-muted-foreground">Cost</div>
                            <div className="font-medium">${check.cost.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                        {getStatusIcon(check.status)}
                        <span>{getStatusMessage(check.status)}</span>
                      </div>

                      {check.results && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Overall Result:</span>
                              <Badge 
                                variant="secondary"
                                className={getResultsStatusColor(check.results.overallStatus)}
                              >
                                {check.results.overallStatus.replace('-', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Risk Score:</span>
                              <span className="font-semibold">
                                {check.results.riskScore}/100
                              </span>
                            </div>
                          </div>

                          {check.results.recommendations.length > 0 && (
                            <div className="mt-3 flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium text-accent">
                                  {check.results.recommendations.length} positive factor{check.results.recommendations.length !== 1 ? 's' : ''}
                                </span>
                                <span className="text-muted-foreground"> found in your report</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {check.expiresAt && check.status === 'completed' && (
                        <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires on {format(check.expiresAt, 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>

                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Why Background Checks Matter</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Speeds up rental application process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Builds trust with potential landlords</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Valid for 90 days - reuse for multiple applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>Secure and confidential verification process</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {currentUser && (
        <BackgroundCheckRequestModal
          open={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          onSubmit={onSubmitRequest}
          currentUser={currentUser}
          requestedBy={currentUser.id}
          requestedByName="Self-Requested"
        />
      )}

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
