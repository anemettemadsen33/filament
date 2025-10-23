import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { PropertyTour } from '@/lib/types'
import { CreditCard, Bank, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TourPaymentModalProps {
  open: boolean
  onClose: () => void
  tour: PropertyTour
  onPayment: (paymentType: 'deposit' | 'full', paymentDetails: any) => void
}

export function TourPaymentModal({
  open,
  onClose,
  tour,
  onPayment
}: TourPaymentModalProps) {
  const [paymentType, setPaymentType] = useState<'deposit' | 'full'>('deposit')
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card'>('bank')
  const [accountName, setAccountName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [iban, setIban] = useState('')
  const [transactionId, setTransactionId] = useState('')

  const paymentAmount = paymentType === 'deposit' 
    ? tour.depositAmount 
    : tour.fullPaymentAmount

  const handleSubmit = () => {
    if (!accountName || !accountNumber || !bankName) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!transactionId) {
      toast.error('Please provide a transaction ID')
      return
    }

    const paymentDetails = {
      paymentType,
      paymentMethod,
      accountName,
      accountNumber,
      bankName,
      iban,
      transactionId,
      amount: paymentAmount,
      paymentDate: Date.now()
    }

    onPayment(paymentType, paymentDetails)
    toast.success('Payment submitted successfully!')
    resetForm()
  }

  const resetForm = () => {
    setAccountName('')
    setAccountNumber('')
    setBankName('')
    setIban('')
    setTransactionId('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tour Payment</DialogTitle>
          <DialogDescription>
            {tour.propertyTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h3 className="font-semibold mb-2">Payment Required</h3>
            <p className="text-sm text-muted-foreground">
              To confirm your tour, please complete the payment using the landlord's bank details below.
              After making the payment, enter your transaction details to verify.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Payment Amount</Label>
            <RadioGroup value={paymentType} onValueChange={(value: any) => setPaymentType(value)}>
              <div className="flex flex-col gap-3">
                {tour.depositAmount && (
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="deposit" id="deposit" />
                    <Label htmlFor="deposit" className="cursor-pointer flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Security Deposit</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Refundable deposit - will be returned after tour
                          </p>
                        </div>
                        <span className="font-bold text-xl">${tour.depositAmount}</span>
                      </div>
                    </Label>
                  </div>
                )}
                {tour.fullPaymentAmount && (
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="cursor-pointer flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Full Payment</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Complete payment - secures the property
                          </p>
                        </div>
                        <span className="font-bold text-xl">${tour.fullPaymentAmount}</span>
                      </div>
                    </Label>
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>

          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Bank className="w-5 h-5 text-primary" />
              Landlord's Bank Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Account Name:</span>
                <span className="font-medium">{tour.landlordName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Bank Name:</span>
                <span className="font-medium">International Bank</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">Account Number:</span>
                <span className="font-mono font-medium">1234567890</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="text-muted-foreground">IBAN:</span>
                <span className="font-mono font-medium">RO49AAAA1B31007593840000</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Confirm Your Payment
            </h4>
            <p className="text-sm text-muted-foreground">
              After making the payment, please enter your transaction details below to verify your payment.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Your Account Name *</Label>
                <Input
                  id="account-name"
                  placeholder="John Doe"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-number">Your Account Number *</Label>
                <Input
                  id="account-number"
                  placeholder="1234567890"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank-name">Your Bank Name *</Label>
                <Input
                  id="bank-name"
                  placeholder="Your Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="iban">Your IBAN (Optional)</Label>
                <Input
                  id="iban"
                  placeholder="RO49AAAA1B31007593840000"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transaction-id">Transaction ID / Reference Number *</Label>
                <Input
                  id="transaction-id"
                  placeholder="TXN123456789"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the transaction ID from your bank confirmation
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Amount to Pay:</span>
              <span className="font-bold text-2xl text-primary">${paymentAmount}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!accountName || !accountNumber || !bankName || !transactionId}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Confirm Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
