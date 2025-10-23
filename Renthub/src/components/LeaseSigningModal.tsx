import { useState, useRef } from 'react'
import { LeaseAgreement } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PencilSimple, Warning } from '@phosphor-icons/react'
import { validateLeaseSignature } from '@/lib/leaseUtils'

interface LeaseSigningModalProps {
  lease: LeaseAgreement | null
  open: boolean
  onClose: () => void
  onSign: (signature: string) => void
  currentUserId: string
}

export function LeaseSigningModal({
  lease,
  open,
  onClose,
  onSign,
  currentUserId
}: LeaseSigningModalProps) {
  const [signature, setSignature] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [useCanvas, setUseCanvas] = useState(false)
  
  if (!lease) return null
  
  const validation = validateLeaseSignature(lease, currentUserId)
  
  const handleClearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }
  
  const handleMouseUp = () => {
    setIsDrawing(false)
  }
  
  const handleSign = () => {
    let finalSignature = signature
    
    if (useCanvas && canvasRef.current) {
      finalSignature = canvasRef.current.toDataURL()
    }
    
    if (!finalSignature.trim()) return
    
    onSign(finalSignature)
    setSignature('')
    setAgreed(false)
    handleClearCanvas()
  }
  
  const role = validation.role === 'landlord' ? 'Landlord' : 'Tenant'
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Sign Lease Agreement</DialogTitle>
        </DialogHeader>
        
        {!validation.canSign ? (
          <Alert variant="destructive">
            <Warning className="h-4 w-4" />
            <AlertDescription>{validation.reason}</AlertDescription>
          </Alert>
        ) : (
          <ScrollArea className="max-h-[calc(90vh-200px)]">
            <div className="space-y-6 pr-4">
              <Alert>
                <PencilSimple className="h-4 w-4" />
                <AlertDescription>
                  You are signing this lease agreement as the <strong>{role}</strong>.
                  Please review all terms carefully before signing.
                </AlertDescription>
              </Alert>
              
              <div>
                <h3 className="font-semibold mb-2">Lease Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Property:</span>
                    <span className="font-medium">{lease.propertyTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rent:</span>
                    <span className="font-medium">${lease.financials.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Security Deposit:</span>
                    <span className="font-medium">${lease.financials.securityDeposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">{new Date(lease.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">{new Date(lease.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label>Signature Method</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={!useCanvas ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUseCanvas(false)}
                  >
                    Type Name
                  </Button>
                  <Button
                    variant={useCanvas ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUseCanvas(true)}
                  >
                    Draw Signature
                  </Button>
                </div>
                
                {!useCanvas ? (
                  <div className="space-y-2">
                    <Label htmlFor="signature">Type your full name</Label>
                    <Input
                      id="signature"
                      placeholder="Enter your full legal name"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      className="font-serif text-2xl h-16"
                    />
                    {signature && (
                      <div className="p-4 border rounded-lg bg-muted">
                        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                        <p className="font-serif text-3xl">{signature}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Draw your signature below</Label>
                    <div className="border rounded-lg p-2 bg-white dark:bg-gray-900">
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={200}
                        className="w-full cursor-crosshair border border-dashed rounded"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearCanvas}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="agree"
                      className="text-sm font-normal leading-relaxed cursor-pointer"
                    >
                      I have read and agree to all terms and conditions of this lease agreement.
                      I understand that this is a legally binding contract and my electronic signature
                      has the same legal effect as a handwritten signature.
                    </Label>
                  </div>
                </div>
                
                <Alert>
                  <Warning className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    By signing this document, you acknowledge that you have reviewed all terms,
                    understand your rights and responsibilities, and agree to be bound by this
                    lease agreement. This signature will be timestamped and cannot be undone.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {validation.canSign && (
            <Button
              onClick={handleSign}
              disabled={!agreed || (!signature.trim() && !useCanvas)}
            >
              <PencilSimple className="mr-2" />
              Sign Agreement
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
