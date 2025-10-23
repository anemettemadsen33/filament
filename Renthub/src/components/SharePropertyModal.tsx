import { useState } from 'react'
import { Property } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  FacebookLogo,
  TwitterLogo,
  WhatsappLogo,
  LinkedinLogo,
  TelegramLogo,
  EnvelopeSimple,
  Copy,
  Check,
  ShareNetwork
} from '@phosphor-icons/react'
import {
  shareProperty,
  copyToClipboard,
  generateShareUrl,
  generateShareText,
  canUseNativeShare,
  shareViaWebAPI
} from '@/lib/socialSharing'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

interface SharePropertyModalProps {
  property: Property
  open: boolean
  onClose: () => void
}

export function SharePropertyModal({ property, open, onClose }: SharePropertyModalProps) {
  const [customMessage, setCustomMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const shareUrl = generateShareUrl(property)
  const defaultText = generateShareText(property)

  const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'telegram' | 'email') => {
    try {
      shareProperty({ 
        property, 
        platform,
        customMessage: customMessage || undefined
      })
      toast.success(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`)
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
      onClose()
    } catch (error) {
      console.error('Native share error:', error)
      toast.error('Failed to share')
    }
  }

  const socialPlatforms = [
    {
      name: 'Facebook',
      icon: FacebookLogo,
      color: 'text-[#1877F2]',
      bgColor: 'hover:bg-[#1877F2]/10',
      action: () => handleShare('facebook')
    },
    {
      name: 'Twitter',
      icon: TwitterLogo,
      color: 'text-[#1DA1F2]',
      bgColor: 'hover:bg-[#1DA1F2]/10',
      action: () => handleShare('twitter')
    },
    {
      name: 'WhatsApp',
      icon: WhatsappLogo,
      color: 'text-[#25D366]',
      bgColor: 'hover:bg-[#25D366]/10',
      action: () => handleShare('whatsapp')
    },
    {
      name: 'LinkedIn',
      icon: LinkedinLogo,
      color: 'text-[#0A66C2]',
      bgColor: 'hover:bg-[#0A66C2]/10',
      action: () => handleShare('linkedin')
    },
    {
      name: 'Telegram',
      icon: TelegramLogo,
      color: 'text-[#26A5E4]',
      bgColor: 'hover:bg-[#26A5E4]/10',
      action: () => handleShare('telegram')
    },
    {
      name: 'Email',
      icon: EnvelopeSimple,
      color: 'text-muted-foreground',
      bgColor: 'hover:bg-muted',
      action: () => handleShare('email')
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShareNetwork className="h-5 w-5" />
            Share Property
          </DialogTitle>
          <DialogDescription>
            Share this property with your friends and social networks
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {property.images && property.images[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{property.title}</h3>
                  <p className="text-sm text-muted-foreground">{property.location}</p>
                  <p className="text-lg font-bold text-primary mt-1">
                    ${property.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      {property.rentalTerm === 'short-term' ? '/night' : '/month'}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="share-link">Share Link</Label>
            <div className="flex gap-2">
              <Input
                id="share-link"
                value={shareUrl}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
                aria-label={copied ? "Link copied" : "Copy share link"}
                title={copied ? "Link copied" : "Copy share link"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Textarea
              id="custom-message"
              placeholder={defaultText}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Personalize your share message (works for Twitter, WhatsApp, Telegram, and Email)
            </p>
          </div>

          <div className="space-y-3">
            <Label>Share on Social Media</Label>
            <div className="grid grid-cols-3 gap-3">
              {socialPlatforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <Button
                    key={platform.name}
                    variant="outline"
                    className={`h-auto py-4 flex flex-col gap-2 ${platform.bgColor} transition-colors`}
                    onClick={platform.action}
                  >
                    <Icon className={`h-6 w-6 ${platform.color}`} weight="fill" />
                    <span className="text-xs">{platform.name}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {canUseNativeShare() && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleNativeShare}
            >
              <ShareNetwork className="mr-2 h-4 w-4" />
              Share via System
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
