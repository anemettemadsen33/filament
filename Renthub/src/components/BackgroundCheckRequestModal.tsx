import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BackgroundCheckRequest, User } from '@/lib/types'
import { calculateBackgroundCheckCost, BACKGROUND_CHECK_TEMPLATES } from '@/lib/backgroundCheckUtils'
import { ShieldCheck, CurrencyDollar, Clock, CheckCircle, IdentificationCard, CreditCard, Briefcase, House, Gavel, User as UserIcon } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface BackgroundCheckRequestModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (request: Omit<BackgroundCheckRequest, 'id' | 'createdAt' | 'updatedAt'>) => void
  currentUser: User | null
  propertyId?: string
  propertyTitle?: string
  requestedBy: string
  requestedByName: string
}

export function BackgroundCheckRequestModal({
  open,
  onClose,
  onSubmit,
  currentUser,
  propertyId,
  propertyTitle,
  requestedBy,
  requestedByName
}: BackgroundCheckRequestModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard')
  const [step, setStep] = useState(1)
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: currentUser?.login || '',
    dateOfBirth: '',
    governmentId: '',
    idType: 'passport' as const,
    currentAddress: ''
  })
  
  const [employmentInfo, setEmploymentInfo] = useState({
    employed: true,
    employer: '',
    position: '',
    monthlyIncome: '',
    employmentStartDate: ''
  })
  
  const [requestedChecks, setRequestedChecks] = useState({
    criminalRecord: true,
    creditScore: true,
    employmentVerification: true,
    rentalHistory: true,
    evictionRecords: true,
    identityVerification: true
  })
  
  const [consentProvided, setConsentProvided] = useState(false)

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = BACKGROUND_CHECK_TEMPLATES.find(t => t.id === templateId)
    if (template) {
      setRequestedChecks({
        criminalRecord: template.checkTypes.includes('criminalRecord'),
        creditScore: template.checkTypes.includes('creditScore'),
        employmentVerification: template.checkTypes.includes('employmentVerification'),
        rentalHistory: template.checkTypes.includes('rentalHistory'),
        evictionRecords: template.checkTypes.includes('evictionRecords'),
        identityVerification: template.checkTypes.includes('identityVerification')
      })
    }
  }

  const handleSubmit = () => {
    if (!currentUser) {
      toast.error('Please sign in to request a background check')
      return
    }

    if (!personalInfo.fullName || !personalInfo.dateOfBirth || !personalInfo.governmentId || !personalInfo.currentAddress) {
      toast.error('Please fill in all required personal information')
      return
    }

    if (employmentInfo.employed && (!employmentInfo.employer || !employmentInfo.monthlyIncome)) {
      toast.error('Please provide employment details')
      return
    }

    if (!consentProvided) {
      toast.error('You must provide consent to proceed')
      return
    }

    const dob = new Date(personalInfo.dateOfBirth).getTime()
    const empStartDate = employmentInfo.employmentStartDate ? new Date(employmentInfo.employmentStartDate).getTime() : undefined

    const request: Omit<BackgroundCheckRequest, 'id' | 'createdAt' | 'updatedAt'> = {
      userId: currentUser.id,
      userName: currentUser.login,
      userEmail: currentUser.email,
      requestedBy,
      requestedByName,
      propertyId,
      propertyTitle,
      personalInfo: {
        ...personalInfo,
        dateOfBirth: dob
      },
      employmentInfo: {
        ...employmentInfo,
        monthlyIncome: employmentInfo.monthlyIncome ? parseFloat(employmentInfo.monthlyIncome) : undefined,
        employmentStartDate: empStartDate
      },
      consentProvided: true,
      consentProvidedAt: Date.now(),
      status: 'pending',
      requestedChecks,
      cost: calculateBackgroundCheckCost(requestedChecks),
      paymentStatus: 'unpaid',
      expiresAt: Date.now() + (90 * 24 * 60 * 60 * 1000)
    }

    onSubmit(request)
    handleClose()
  }

  const handleClose = () => {
    setStep(1)
    setSelectedTemplate('standard')
    setPersonalInfo({
      fullName: currentUser?.login || '',
      dateOfBirth: '',
      governmentId: '',
      idType: 'passport',
      currentAddress: ''
    })
    setEmploymentInfo({
      employed: true,
      employer: '',
      position: '',
      monthlyIncome: '',
      employmentStartDate: ''
    })
    setConsentProvided(false)
    onClose()
  }

  const estimatedCost = calculateBackgroundCheckCost(requestedChecks)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Background Check Request
          </DialogTitle>
          <DialogDescription>
            Complete the background check to verify your tenant profile
            {propertyTitle && ` for ${propertyTitle}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Select Screening Package
                </h3>
                <div className="grid gap-3">
                  {BACKGROUND_CHECK_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedTemplate === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{template.name}</h4>
                            {template.recommended && (
                              <Badge variant="default" className="text-xs">Recommended</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {template.checkTypes.map((check) => (
                              <Badge key={check} variant="secondary" className="text-xs">
                                {check.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${template.estimatedCost}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {template.estimatedTime} days
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Customize Checks</h3>
                <div className="grid gap-3">
                  <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                    <Checkbox
                      checked={requestedChecks.criminalRecord}
                      onCheckedChange={(checked) =>
                        setRequestedChecks({ ...requestedChecks, criminalRecord: !!checked })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium">
                        <Gavel className="w-4 h-4" />
                        Criminal Record Check
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Search local and national criminal databases
                      </p>
                    </div>
                    <span className="text-sm font-medium">$15</span>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                    <Checkbox
                      checked={requestedChecks.creditScore}
                      onCheckedChange={(checked) =>
                        setRequestedChecks({ ...requestedChecks, creditScore: !!checked })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium">
                        <CreditCard className="w-4 h-4" />
                        Credit Score Check
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Verify credit history and financial responsibility
                      </p>
                    </div>
                    <span className="text-sm font-medium">$20</span>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                    <Checkbox
                      checked={requestedChecks.employmentVerification}
                      onCheckedChange={(checked) =>
                        setRequestedChecks({ ...requestedChecks, employmentVerification: !!checked })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium">
                        <Briefcase className="w-4 h-4" />
                        Employment Verification
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Confirm current employment and income
                      </p>
                    </div>
                    <span className="text-sm font-medium">$10</span>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                    <Checkbox
                      checked={requestedChecks.rentalHistory}
                      onCheckedChange={(checked) =>
                        setRequestedChecks({ ...requestedChecks, rentalHistory: !!checked })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium">
                        <House className="w-4 h-4" />
                        Rental History
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Verify past rental experiences and references
                      </p>
                    </div>
                    <span className="text-sm font-medium">$10</span>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                    <Checkbox
                      checked={requestedChecks.evictionRecords}
                      onCheckedChange={(checked) =>
                        setRequestedChecks({ ...requestedChecks, evictionRecords: !!checked })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium">
                        <Gavel className="w-4 h-4" />
                        Eviction Records
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Check for past eviction filings
                      </p>
                    </div>
                    <span className="text-sm font-medium">$5</span>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                    <Checkbox
                      checked={requestedChecks.identityVerification}
                      onCheckedChange={(checked) =>
                        setRequestedChecks({ ...requestedChecks, identityVerification: !!checked })
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-medium">
                        <IdentificationCard className="w-4 h-4" />
                        Identity Verification
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Verify identity documents and personal information
                      </p>
                    </div>
                    <span className="text-sm font-medium">$10</span>
                  </label>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="font-semibold">Total Cost</div>
                  <div className="text-sm text-muted-foreground">One-time fee</div>
                </div>
                <div className="text-2xl font-bold flex items-center gap-1">
                  <CurrencyDollar className="w-5 h-5" />
                  {estimatedCost.toFixed(2)}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Personal Information
                </h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Legal Name *</Label>
                    <Input
                      id="fullName"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="idType">ID Type *</Label>
                      <Select
                        value={personalInfo.idType}
                        onValueChange={(value: any) => setPersonalInfo({ ...personalInfo, idType: value })}
                      >
                        <SelectTrigger id="idType" aria-label="ID type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers-license">Driver's License</SelectItem>
                          <SelectItem value="national-id">National ID</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="governmentId">Government ID Number *</Label>
                    <Input
                      id="governmentId"
                      value={personalInfo.governmentId}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, governmentId: e.target.value })}
                      placeholder="Enter your ID number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentAddress">Current Address *</Label>
                    <Textarea
                      id="currentAddress"
                      value={personalInfo.currentAddress}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, currentAddress: e.target.value })}
                      placeholder="Street, City, State, ZIP"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Employment Information
                </h3>
                <div className="grid gap-4">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      checked={employmentInfo.employed}
                      onCheckedChange={(checked) =>
                        setEmploymentInfo({ ...employmentInfo, employed: !!checked })
                      }
                    />
                    <span className="text-sm">I am currently employed</span>
                  </label>

                  {employmentInfo.employed && (
                    <>
                      <div>
                        <Label htmlFor="employer">Employer Name *</Label>
                        <Input
                          id="employer"
                          value={employmentInfo.employer}
                          onChange={(e) => setEmploymentInfo({ ...employmentInfo, employer: e.target.value })}
                          placeholder="Company Name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="position">Position *</Label>
                          <Input
                            id="position"
                            value={employmentInfo.position}
                            onChange={(e) => setEmploymentInfo({ ...employmentInfo, position: e.target.value })}
                            placeholder="Job Title"
                          />
                        </div>

                        <div>
                          <Label htmlFor="monthlyIncome">Monthly Income ($) *</Label>
                          <Input
                            id="monthlyIncome"
                            type="number"
                            value={employmentInfo.monthlyIncome}
                            onChange={(e) => setEmploymentInfo({ ...employmentInfo, monthlyIncome: e.target.value })}
                            placeholder="5000"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="employmentStartDate">Employment Start Date</Label>
                        <Input
                          id="employmentStartDate"
                          type="date"
                          value={employmentInfo.employmentStartDate}
                          onChange={(e) => setEmploymentInfo({ ...employmentInfo, employmentStartDate: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold">Consent & Authorization</h3>
                
                <div className="p-4 border rounded-lg bg-muted/50 max-h-64 overflow-y-auto text-sm space-y-2">
                  <p className="font-medium">Background Check Authorization</p>
                  <p>
                    I hereby authorize {requestedByName} to obtain a consumer report and/or investigative consumer report on me from a consumer reporting agency.
                  </p>
                  <p>
                    I understand that this report may include information about my character, general reputation, personal characteristics, and mode of living, as well as:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Criminal history records</li>
                    <li>Credit history and score</li>
                    <li>Employment verification and income</li>
                    <li>Rental history and eviction records</li>
                    <li>Identity verification</li>
                  </ul>
                  <p>
                    I understand that the information contained in my consumer report may be obtained from public records and private sources. I hereby authorize any person, business, or agency to furnish such information to the consumer reporting agency.
                  </p>
                  <p>
                    I understand that I have the right to request disclosure of the nature and scope of the investigation and to receive a copy of the report if adverse action is taken based on the report.
                  </p>
                  <p className="font-medium mt-4">Data Privacy</p>
                  <p>
                    Your personal information will be processed in accordance with applicable data protection laws. The information will be used solely for tenant screening purposes and will be stored securely for 90 days.
                  </p>
                </div>

                <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <Checkbox
                    checked={consentProvided}
                    onCheckedChange={(checked) => setConsentProvided(!!checked)}
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">I consent to this background check</p>
                    <p className="text-muted-foreground mt-1">
                      I have read and agree to the terms of the background check authorization and understand my rights under the Fair Credit Reporting Act (FCRA).
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}

          <div className="flex justify-between pt-4 border-t">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep(step + 1)}>
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!consentProvided}>
                  Submit Request
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 w-2 rounded-full ${
                  s === step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
