import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Bed, Bathtub, ArrowsOut, Heart, Scales, CheckCircle, Star, ShareNetwork, Key } from '@phosphor-icons/react'
import { Property } from '@/lib/types'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LandlordBadge } from './LandlordBadge'
import { VirtualTourBadge } from './VirtualTourBadge'
import { PriceDisplay } from './PriceDisplay'
import { shareProperty, copyToClipboard } from '@/lib/socialSharing'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { 
  FacebookLogo, 
  TwitterLogo, 
  WhatsappLogo, 
  LinkedinLogo, 
  TelegramLogo, 
  EnvelopeSimple, 
  Copy,
  Check 
} from '@phosphor-icons/react'

interface PropertyCardProps {
  property: Property
  onClick: () => void
  isFavorite: boolean
  onToggleFavorite: (propertyId: string) => void
  isInCompare?: boolean
  onToggleCompare?: (propertyId: string) => void
}

export function PropertyCard({ property, onClick, isFavorite, onToggleFavorite, isInCompare, onToggleCompare }: PropertyCardProps) {
  const [copied, setCopied] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(property.id)
    
    if (!isFavorite) {
      toast.success('Added to favorites', {
        description: property.title
      })
    } else {
      toast('Removed from favorites', {
        description: property.title
      })
    }
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleCompare) {
      onToggleCompare(property.id)
    }
  }

  const handleShare = (e: React.MouseEvent, platform: 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'telegram' | 'email') => {
    e.stopPropagation()
    try {
      shareProperty({ property, platform })
      toast.success(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`)
      setShareMenuOpen(false)
    } catch (error) {
      toast.error('Failed to share property')
      console.error('Share error:', error)
    }
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
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

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Card 
        className="overflow-hidden cursor-pointer group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/50 bg-card/80 backdrop-blur-sm"
        onClick={onClick}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          <motion.img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-bold shadow-xl backdrop-blur-sm border-0 px-3 py-1.5 text-base">
              <PriceDisplay amount={property.price} showDecimals={false} size="md" />/{property.rentalTerm === 'short-term' ? 'night' : 'mo'}
            </Badge>
            <Badge className={`font-semibold shadow-lg backdrop-blur-sm border-0 px-3 py-1 text-xs ${
              property.rentalTerm === 'short-term' 
                ? 'bg-blue-500/90 text-white' 
                : 'bg-purple-500/90 text-white'
            }`}>
              {property.rentalTerm === 'short-term' ? 'Short-term' : 'Long-term'}
            </Badge>
          </div>

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <motion.button
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart 
                size={20} 
                weight={isFavorite ? "fill" : "regular"}
                className={isFavorite ? "text-red-500" : "text-foreground/70"}
              />
            </motion.button>
            
            {onToggleCompare && (
              <motion.button
                onClick={handleCompareClick}
                aria-label={isInCompare ? "Remove from comparison" : "Add to comparison"}
                title={isInCompare ? "Remove from comparison" : "Add to comparison"}
                className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isInCompare 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-white/90 hover:bg-white text-foreground/70'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Scales 
                  size={20} 
                  weight={isInCompare ? "fill" : "regular"}
                />
              </motion.button>
            )}

            <DropdownMenu open={shareMenuOpen} onOpenChange={setShareMenuOpen}>
              <DropdownMenuTrigger asChild>
                <motion.button
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Share property"
                  title="Share property"
                  className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShareNetwork size={20} className="text-foreground/70" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={(e) => handleShare(e, 'facebook')}>
                  <FacebookLogo className="mr-2 h-4 w-4 text-[#1877F2]" weight="fill" />
                  Facebook
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={(e) => handleShare(e, 'twitter')}>
                  <TwitterLogo className="mr-2 h-4 w-4 text-[#1DA1F2]" weight="fill" />
                  Twitter / X
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={(e) => handleShare(e, 'whatsapp')}>
                  <WhatsappLogo className="mr-2 h-4 w-4 text-[#25D366]" weight="fill" />
                  WhatsApp
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={(e) => handleShare(e, 'linkedin')}>
                  <LinkedinLogo className="mr-2 h-4 w-4 text-[#0A66C2]" weight="fill" />
                  LinkedIn
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={(e) => handleShare(e, 'telegram')}>
                  <TelegramLogo className="mr-2 h-4 w-4 text-[#26A5E4]" weight="fill" />
                  Telegram
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={(e) => handleShare(e, 'email')}>
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
          </div>

          {property.virtualTours && property.virtualTours.length > 0 && (
            <div className="absolute bottom-4 left-4">
              <VirtualTourBadge tours={property.virtualTours} variant="compact" />
            </div>
          )}

          {property.lockbox?.enabled && (
            <div className="absolute bottom-4 right-4">
              <Badge className="bg-white/95 backdrop-blur-md text-foreground border-0 shadow-lg px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                <Key size={14} weight="bold" className="text-accent" />
                Self Check-In
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-bold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {property.title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm flex-1 min-w-0">
              <MapPin size={18} weight="fill" className="text-primary/70 flex-shrink-0" />
              <span className="line-clamp-1 font-medium">{property.location}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`, '_blank')
              }}
            >
              <MapPin size={14} weight="bold" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground/90 line-clamp-2 mb-5 leading-relaxed">
            {property.description}
          </p>
          
          <div className="flex items-center gap-5 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bed size={18} weight="fill" className="text-primary" />
              </div>
              <span className="text-sm font-semibold">{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bathtub size={18} weight="fill" className="text-primary" />
              </div>
              <span className="text-sm font-semibold">{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowsOut size={18} weight="bold" className="text-primary" />
              </div>
              <span className="text-sm font-semibold">{property.area} sqft</span>
            </div>
          </div>
          
          {property.landlord && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage src={property.landlord.avatar} alt={property.landlord.name} />
                  <AvatarFallback className="text-xs">{property.landlord.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium truncate">{property.landlord.name}</p>
                    {property.landlord.verification.verified && (
                      <CheckCircle size={14} weight="fill" className="text-blue-600 shrink-0" />
                    )}
                    {property.landlord.isSuperhost && (
                      <Star size={14} weight="fill" className="text-amber-500 shrink-0" />
                    )}
                  </div>
                  
                  {property.landlord.badges.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {property.landlord.badges.slice(0, 2).map((badge) => (
                        <LandlordBadge key={badge.id} badge={badge} size="sm" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
