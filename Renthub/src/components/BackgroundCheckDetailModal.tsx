import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { BackgroundCheckRequest } from '@/lib/types'
import { 
  getBackgroundCheckStatusColor, 
  getResultsStatusColor, 
  getRiskScoreColor,
  getCreditRatingColor 
} from '@/lib/backgroundCheckUtils'
import { 
  ShieldCheck, 
  CheckCircle, 
  WarningCircle, 
  XCircle,
  User,
  Briefcase,
  CreditCard,
  House,
  Gavel,
  IdentificationCard,
  Clock,
  CalendarBlank,
  TrendUp,
  TrendDown
} from '@phosphor-icons/react'
import { format } from 'date-fns'

interface BackgroundCheckDetailModalProps {
  open: boolean
  onClose: () => void
  check: BackgroundCheckRequest
}

export function BackgroundCheckDetailModal({
  open,
  onClose,
  check
}: BackgroundCheckDetailModalProps) {
  const results = check.results

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Background Check Details
          </DialogTitle>
          <DialogDescription>
            Request ID: {check.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Applicant</div>
              <div className="font-medium">{check.userName}</div>
              <div className="text-sm text-muted-foreground">{check.userEmail}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant="secondary" className={getBackgroundCheckStatusColor(check.status)}>
                {check.status.toUpperCase().replace('_', ' ')}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Requested</div>
              <div className="font-medium">
                {format(check.createdAt, 'MMM d, yyyy')}
              </div>
            </div>
            {check.completedAt && (
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="font-medium">
                  {format(check.completedAt, 'MMM d, yyyy')}
                </div>
              </div>
            )}
          </div>

          {check.propertyTitle && (
            <div>
              <div className="text-sm text-muted-foreground">Property</div>
              <div className="font-medium">{check.propertyTitle}</div>
            </div>
          )}

          <Separator />

          {results && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Screening Results</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-sm text-muted-foreground mb-1">Overall Status</div>
                    <div className={`text-xl font-bold ${getResultsStatusColor(results.overallStatus)}`}>
                      {results.overallStatus.replace('-', ' ').toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-sm text-muted-foreground mb-1">Risk Score</div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-2xl font-bold ${getRiskScoreColor(results.riskScore)}`}>
                        {results.riskScore}
                      </span>
                      <span className="text-sm text-muted-foreground">/ 100</span>
                    </div>
                    <Progress value={results.riskScore} className="mt-2" />
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="text-sm text-muted-foreground mb-1">Completed</div>
                    <div className="text-xl font-bold">
                      {format(results.completedAt, 'MMM d')}
                    </div>
                  </div>
                </div>

                {(results.recommendations.length > 0 || results.warnings.length > 0 || results.redFlags.length > 0) && (
                  <div className="space-y-3">
                    {results.recommendations.length > 0 && (
                      <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <div className="flex items-center gap-2 font-medium text-accent mb-2">
                          <CheckCircle className="w-4 h-4" />
                          Positive Factors
                        </div>
                        <ul className="space-y-1 text-sm">
                          {results.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-accent mt-0.5">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {results.warnings.length > 0 && (
                      <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                        <div className="flex items-center gap-2 font-medium text-warning mb-2">
                          <WarningCircle className="w-4 h-4" />
                          Areas of Concern
                        </div>
                        <ul className="space-y-1 text-sm">
                          {results.warnings.map((warning, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-warning mt-0.5">•</span>
                              <span>{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {results.redFlags.length > 0 && (
                      <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="flex items-center gap-2 font-medium text-destructive mb-2">
                          <XCircle className="w-4 h-4" />
                          Red Flags
                        </div>
                        <ul className="space-y-1 text-sm">
                          {results.redFlags.map((flag, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-destructive mt-0.5">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Detailed Results</h3>

                {results.identityVerification && (
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <IdentificationCard className="w-5 h-5 text-primary" />
                      Identity Verification
                      <Badge variant={results.identityVerification.verified ? 'default' : 'secondary'}>
                        {results.identityVerification.verified ? 'Verified' : 'Needs Review'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Match Score</span>
                        <span className="font-medium">{results.identityVerification.matchScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Document Type</span>
                        <span className="font-medium capitalize">
                          {results.identityVerification.documentType.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-muted-foreground pt-2">
                        {results.identityVerification.details}
                      </p>
                    </div>
                  </div>
                )}

                {results.criminalRecord && (
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <Gavel className="w-5 h-5 text-primary" />
                      Criminal Record Check
                      <Badge variant={results.criminalRecord.status === 'clear' ? 'default' : 'secondary'}>
                        {results.criminalRecord.status.toUpperCase().replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{results.criminalRecord.details}</p>
                      {results.criminalRecord.recordsFound && results.criminalRecord.recordsFound.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {results.criminalRecord.recordsFound.map((record, idx) => (
                            <div key={idx} className="p-2 bg-muted rounded">
                              <div className="font-medium">{record.type}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(record.date, 'MMM yyyy')} • {record.jurisdiction}
                              </div>
                              <div className="text-xs mt-1">{record.disposition}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {results.creditScore && (
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Credit Score
                      <Badge 
                        variant="secondary"
                        className={getCreditRatingColor(results.creditScore.rating)}
                      >
                        {results.creditScore.rating.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{results.creditScore.score}</span>
                        <span className="text-sm text-muted-foreground">/ 850</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Outstanding Debts</div>
                          <div className="font-medium">
                            ${results.creditScore.outstandingDebts?.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Late Payments</div>
                          <div className="font-medium">{results.creditScore.latePayments}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Collections</div>
                          <div className="font-medium">{results.creditScore.collections}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Bankruptcies</div>
                          <div className="font-medium">{results.creditScore.bankruptcies}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground pt-2">
                        {results.creditScore.details}
                      </p>
                    </div>
                  </div>
                )}

                {results.employmentVerification && (
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <Briefcase className="w-5 h-5 text-primary" />
                      Employment Verification
                      <Badge variant={results.employmentVerification.verified ? 'default' : 'secondary'}>
                        {results.employmentVerification.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-muted-foreground">Employer</div>
                          <div className="font-medium">{results.employmentVerification.employer}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Position</div>
                          <div className="font-medium">{results.employmentVerification.position}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Monthly Income</div>
                          <div className="font-medium">
                            ${results.employmentVerification.monthlyIncome.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Employment Length</div>
                          <div className="font-medium">
                            {results.employmentVerification.employmentLength} months
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground pt-2">
                        {results.employmentVerification.details}
                      </p>
                    </div>
                  </div>
                )}

                {results.rentalHistory && (
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <House className="w-5 h-5 text-primary" />
                      Rental History
                      <Badge variant="secondary">
                        {results.rentalHistory.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-3 text-sm">
                      {results.rentalHistory.previousLandlords.map((landlord, idx) => (
                        <div key={idx} className="p-3 bg-muted rounded">
                          <div className="font-medium">{landlord.property}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(landlord.from, 'MMM yyyy')} - {format(landlord.to, 'MMM yyyy')}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-muted-foreground">Landlord</span>
                            <span>{landlord.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Payment History</span>
                            <Badge variant="secondary">
                              {landlord.paymentHistory.toUpperCase()}
                            </Badge>
                          </div>
                          {landlord.comments && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              "{landlord.comments}"
                            </p>
                          )}
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <div className="text-muted-foreground">Late Payments</div>
                          <div className="font-medium">{results.rentalHistory.latePayments}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Evictions</div>
                          <div className="font-medium">{results.rentalHistory.evictions}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {results.evictionRecords && (
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 font-medium mb-3">
                      <Gavel className="w-5 h-5 text-primary" />
                      Eviction Records
                      <Badge variant={results.evictionRecords.found ? 'destructive' : 'default'}>
                        {results.evictionRecords.found ? `${results.evictionRecords.count} Found` : 'None Found'}
                      </Badge>
                    </div>
                    {results.evictionRecords.records && results.evictionRecords.records.length > 0 ? (
                      <div className="space-y-2 text-sm">
                        {results.evictionRecords.records.map((record, idx) => (
                          <div key={idx} className="p-2 bg-muted rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{record.location}</div>
                                <div className="text-xs text-muted-foreground">
                                  {format(record.date, 'MMM yyyy')}
                                </div>
                              </div>
                              <Badge variant="secondary">{record.status}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              {record.details}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No eviction records found in our database
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {!results && check.status === 'processing' && (
            <div className="text-center py-8 space-y-4">
              <Clock className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
              <div>
                <h3 className="font-semibold mb-1">Processing Background Check</h3>
                <p className="text-sm text-muted-foreground">
                  This typically takes 2-5 business days. We'll notify you when results are ready.
                </p>
              </div>
            </div>
          )}

          {!results && check.status === 'pending' && (
            <div className="text-center py-8 space-y-4">
              <CalendarBlank className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-semibold mb-1">Awaiting Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Background check will begin processing once payment is received.
                </p>
                <div className="mt-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    ${check.cost.toFixed(2)}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
