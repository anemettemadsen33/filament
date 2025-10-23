import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { CheckCircle, ShieldCheck, Warning } from '@phosphor-icons/react'
import { LandlordVerification } from '@/lib/types'
import { getVerificationProgress } from '@/lib/badgeUtils'

interface VerificationBadgeProps {
  verification: LandlordVerification
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  showText?: boolean
}

export function VerificationBadge({ 
  verification, 
  size = 'md', 
  showIcon = true,
  showText = true 
}: VerificationBadgeProps) {
  const progress = getVerificationProgress(verification)
  
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20
  
  if (!verification.verified) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1 text-muted-foreground border-muted">
              {showIcon && <Warning size={iconSize} weight="fill" />}
              {showText && <span>Unverified</span>}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">Verification Incomplete</p>
              <p className="text-xs text-muted-foreground">
                This landlord has not completed identity verification
              </p>
              {progress.missing.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium">Missing:</p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside">
                    {progress.missing.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-200">
            {showIcon && <CheckCircle size={iconSize} weight="fill" />}
            {showText && <span>Verified</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} weight="fill" className="text-blue-600" />
              <p className="font-semibold">Verified Landlord</p>
            </div>
            <p className="text-xs text-muted-foreground">
              This landlord has completed identity verification and provided proof of ownership
            </p>
            {verification.verifiedAt && (
              <p className="text-xs text-muted-foreground">
                Verified on {new Date(verification.verifiedAt).toLocaleDateString()}
              </p>
            )}
            <div className="mt-2 space-y-1">
              <p className="text-xs font-medium">Verified Items:</p>
              <div className="flex flex-wrap gap-1">
                {verification.email && (
                  <Badge variant="secondary" className="text-xs">Email</Badge>
                )}
                {verification.phone && (
                  <Badge variant="secondary" className="text-xs">Phone</Badge>
                )}
                {verification.identity && (
                  <Badge variant="secondary" className="text-xs">Identity</Badge>
                )}
                {verification.proofOfOwnership && (
                  <Badge variant="secondary" className="text-xs">Ownership</Badge>
                )}
                {verification.backgroundCheck && (
                  <Badge variant="secondary" className="text-xs">Background</Badge>
                )}
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
