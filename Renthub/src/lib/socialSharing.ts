import { Property } from './types'

export type SocialPlatform = 'facebook' | 'twitter' | 'whatsapp' | 'linkedin' | 'telegram' | 'email'

export interface ShareOptions {
  property: Property
  platform: SocialPlatform
  customMessage?: string
}

export function generateShareUrl(property: Property): string {
  const baseUrl = window.location.origin
  return `${baseUrl}/property/${property.id}`
}

export function generateShareText(property: Property, customMessage?: string): string {
  if (customMessage) return customMessage
  
  const priceUnit = property.rentalTerm === 'short-term' ? '/night' : '/month'
  return `Check out this ${property.type}: ${property.title} - $${property.price}${priceUnit} in ${property.location}!`
}

export function shareOnFacebook(options: ShareOptions): void {
  const url = generateShareUrl(options.property)
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  
  window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes')
}

export function shareOnTwitter(options: ShareOptions): void {
  const url = generateShareUrl(options.property)
  const text = generateShareText(options.property, options.customMessage)
  
  const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  
  window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes')
}

export function shareOnWhatsApp(options: ShareOptions): void {
  const url = generateShareUrl(options.property)
  const text = generateShareText(options.property, options.customMessage)
  const message = `${text}\n${url}`
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const shareUrl = isMobile 
    ? `whatsapp://send?text=${encodeURIComponent(message)}`
    : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`
  
  window.open(shareUrl, '_blank')
}

export function shareOnLinkedIn(options: ShareOptions): void {
  const url = generateShareUrl(options.property)
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  
  window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes')
}

export function shareOnTelegram(options: ShareOptions): void {
  const url = generateShareUrl(options.property)
  const text = generateShareText(options.property, options.customMessage)
  
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
  
  window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes')
}

export function shareViaEmail(options: ShareOptions): void {
  const url = generateShareUrl(options.property)
  const subject = `Check out this property: ${options.property.title}`
  const body = `${generateShareText(options.property, options.customMessage)}\n\n${url}`
  
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function copyToClipboard(property: Property): Promise<void> {
  const url = generateShareUrl(property)
  return navigator.clipboard.writeText(url)
}

export function shareProperty(options: ShareOptions): void {
  switch (options.platform) {
    case 'facebook':
      shareOnFacebook(options)
      break
    case 'twitter':
      shareOnTwitter(options)
      break
    case 'whatsapp':
      shareOnWhatsApp(options)
      break
    case 'linkedin':
      shareOnLinkedIn(options)
      break
    case 'telegram':
      shareOnTelegram(options)
      break
    case 'email':
      shareViaEmail(options)
      break
  }
}

export function canUseNativeShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

export async function shareViaWebAPI(property: Property): Promise<void> {
  if (!canUseNativeShare()) {
    throw new Error('Web Share API is not supported')
  }
  
  const url = generateShareUrl(property)
  const text = generateShareText(property)
  
  await navigator.share({
    title: property.title,
    text: text,
    url: url
  })
}
