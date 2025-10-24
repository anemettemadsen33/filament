import { ImgHTMLAttributes, useState } from 'react'

/**
 * OptimizedImage Component
 * 
 * A performance-optimized image component that implements:
 * - Lazy loading for offscreen images
 * - Modern image format support (WebP, AVIF) with fallback
 * - Progressive loading with blur effect
 * - Explicit width/height to prevent layout shifts
 * 
 * @example
 * <OptimizedImage 
 *   src="/images/hero.jpg" 
 *   alt="Hero image"
 *   width={1920}
 *   height={1080}
 *   priority={true} // For above-the-fold images
 * />
 */

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean // For LCP images (above the fold)
  className?: string
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  
  // Generate WebP and AVIF sources if the original is JPG/PNG
  const isOptimizable = /\.(jpg|jpeg|png)$/i.test(src)
  const webpSrc = isOptimizable ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp') : null
  const avifSrc = isOptimizable ? src.replace(/\.(jpg|jpeg|png)$/i, '.avif') : null
  
  const handleLoad = () => {
    setIsLoading(false)
  }
  
  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
  }
  
  // Base image classes for progressive loading
  const imageClasses = `
    ${className}
    ${isLoading && !hasError ? 'blur-sm' : 'blur-0'}
    transition-all duration-300
  `.trim()
  
  // If modern formats are available, use <picture> for better format selection
  if (isOptimizable && (avifSrc || webpSrc)) {
    return (
      <picture>
        {/* AVIF - best compression, modern browsers */}
        {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
        
        {/* WebP - good compression, wide support */}
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        
        {/* Original format as fallback */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={imageClasses}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </picture>
    )
  }
  
  // For non-optimizable images (SVG, GIF, etc.), render standard img tag
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={imageClasses}
      onLoad={handleLoad}
      onError={handleError}
      {...props}
    />
  )
}

export default OptimizedImage
