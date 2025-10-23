import { useState } from 'react'
import { Property } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  ShareNetwork,
  FacebookLogo,
  TwitterLogo,
  WhatsappLogo,
  LinkedinLogo,
  TelegramLogo,
  EnvelopeSimple,
  Copy,
  Check
} from '@phosphor-icons/react'
import {
  shareProperty,
  copyToClipboard,
  canUseNativeShare,
  shareViaWebAPI
} from '@/lib/socialSharing'
import { toast } from 'sonner'

interface SharePropertyButtonProps {
  property: Property
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showLabel?: boolean
  className?: string
}

export function SharePropertyButton({
  property,
  variant = 'outline',
  size = 'default',
  showLabel = true,
  className = ''
}: SharePropertyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'telegram' | 'email') => {
    try {
      shareProperty({ property, platform })
      toast.success(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`)
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to share property')
      console.error('Share error:', error)
    }
  }

  const handleCopy = async () => {
    try {
      await copyToClipboard(property)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
      console.error('Copy error:', error)
    }
  }

  const handleNativeShare = async () => {
    try {
      await shareViaWebAPI(property)
      setIsOpen(false)
    } catch (error) {
      console.error('Native share error:', error)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <ShareNetwork className="h-5 w-5" />
          {showLabel && size !== 'icon' && <span className="ml-2">Share</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canUseNativeShare() && (
          <>
            <DropdownMenuItem onClick={handleNativeShare}>
              <ShareNetwork className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <FacebookLogo className="mr-2 h-4 w-4 text-[#1877F2]" weight="fill" />
          Facebook
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <TwitterLogo className="mr-2 h-4 w-4 text-[#1DA1F2]" weight="fill" />
          Twitter / X
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          <WhatsappLogo className="mr-2 h-4 w-4 text-[#25D366]" weight="fill" />
          WhatsApp
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('linkedin')}>
          <LinkedinLogo className="mr-2 h-4 w-4 text-[#0A66C2]" weight="fill" />
          LinkedIn
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('telegram')}>
          <TelegramLogo className="mr-2 h-4 w-4 text-[#26A5E4]" weight="fill" />
          Telegram
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleShare('email')}>
          <EnvelopeSimple className="mr-2 h-4 w-4" />
          Email
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
