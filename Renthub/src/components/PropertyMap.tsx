import { useEffect, useRef, useState } from 'react'
import { PropertyWithLocation } from '@/lib/types'
import { MapPin, House, Buildings, Warehouse, X } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PropertyMapProps {
  properties: PropertyWithLocation[]
  selectedPropertyId?: string | null
  onPropertyClick?: (property: PropertyWithLocation) => void
  className?: string
  height?: number
  showControls?: boolean
}

declare global {
  interface Window {
    google: any
    initGoogleMap: () => void
  }
}

const DEFAULT_CENTER = { lat: 44.4268, lng: 26.1025 }

export function PropertyMap({
  properties,
  selectedPropertyId,
  onPropertyClick,
  className,
  height = 600,
  showControls = true
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowRef = useRef<any>(null)
  const [hoveredProperty, setHoveredProperty] = useState<PropertyWithLocation | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const getPropertyIcon = (type: string): string => {
    const baseUrl = 'data:image/svg+xml;charset=UTF-8,'
    const icons: Record<string, string> = {
      house: encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%23E87040" viewBox="0 0 256 256"><path d="M240,208H224V136l2.34,2.34a8,8,0,0,0,11.32-11.32l-120-120a8,8,0,0,0-11.32,0l-120,120A8,8,0,0,0,0,136H16v72H8a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM32,120,128,24l96,96v88H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H32Zm112,88H112V160h32Z"/></svg>`),
      apartment: encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%234566E8" viewBox="0 0 256 256"><path d="M232,224H208V32h8a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16h8V224H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16ZM64,32H192V224H160V184a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v40H64Zm80,192H112V192h32ZM88,64a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,64Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H144A8,8,0,0,1,136,64ZM88,104a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,104Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H144A8,8,0,0,1,136,104ZM88,144a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,144Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H144A8,8,0,0,1,136,144Z"/></svg>`),
      condo: encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%238040E8" viewBox="0 0 256 256"><path d="M232,224H208V32h8a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16h8V224H24a8,8,0,0,0,0,16H232a8,8,0,0,0,0-16ZM64,32H192V224H160V184a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v40H64Zm80,192H112V192h32ZM88,64a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,64Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H144A8,8,0,0,1,136,64ZM88,104a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,104Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H144A8,8,0,0,1,136,104ZM88,144a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H96A8,8,0,0,1,88,144Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H144A8,8,0,0,1,136,144Z"/></svg>`),
      studio: encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%2340E8A0" viewBox="0 0 256 256"><path d="M240,192h-8V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V192H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM40,48H216V192H160V160a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v32H40Zm104,144H112V168h32Z"/></svg>`),
      default: encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="%234566E8" viewBox="0 0 256 256"><path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"/></svg>`)
    }
    return baseUrl + (icons[type] || icons.default)
  }

  const getPropertyColor = (property: PropertyWithLocation): string => {
    if (!property.available) return '#9ca3af'
    
    switch (property.type) {
      case 'house': return '#E87040'
      case 'apartment': return '#4566E8'
      case 'condo': return '#8040E8'
      case 'studio': return '#40E8A0'
      default: return '#4566E8'
    }
  }

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setIsMapLoaded(true)
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=marker`
      script.async = true
      script.defer = true
      script.onload = () => {
        setIsMapLoaded(true)
      }
      script.onerror = () => {
        console.error('Failed to load Google Maps')
      }
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [])

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.google) return

    if (!googleMapRef.current) {
      const center = properties.length > 0 
        ? { lat: properties[0].coordinates.lat, lng: properties[0].coordinates.lng }
        : DEFAULT_CENTER

      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 12,
        mapTypeControl: showControls,
        streetViewControl: showControls,
        fullscreenControl: showControls,
        zoomControl: showControls,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      infoWindowRef.current = new window.google.maps.InfoWindow()
    }

    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    properties.forEach((property) => {
      const marker = new window.google.maps.Marker({
        position: { lat: property.coordinates.lat, lng: property.coordinates.lng },
        map: googleMapRef.current,
        title: property.title,
        icon: {
          url: getPropertyIcon(property.type),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        }
      })

      marker.addListener('click', () => {
        if (onPropertyClick) {
          onPropertyClick(property)
        }

        const contentString = `
          <div style="padding: 8px; max-width: 280px;">
            <img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600;">${property.title}</h3>
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280;">${property.location}</p>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="padding: 2px 8px; background: #f3f4f6; border-radius: 4px; font-size: 11px; text-transform: capitalize;">${property.type}</span>
              <span style="font-size: 16px; font-weight: 700; color: ${getPropertyColor(property)};">€${property.price}<span style="font-size: 11px; font-weight: 400; color: #6b7280;">/${property.rentalTerm === 'short-term' ? 'night' : 'mo'}</span></span>
            </div>
            <div style="font-size: 11px; color: #6b7280; display: flex; gap: 8px;">
              <span>${property.bedrooms} bed</span>
              <span>•</span>
              <span>${property.bathrooms} bath</span>
              <span>•</span>
              <span>${property.area}m²</span>
            </div>
          </div>
        `

        infoWindowRef.current.setContent(contentString)
        infoWindowRef.current.open(googleMapRef.current, marker)
      })

      marker.addListener('mouseover', () => {
        setHoveredProperty(property)
      })

      marker.addListener('mouseout', () => {
        setHoveredProperty(null)
      })

      markersRef.current.push(marker)
    })

    if (properties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      properties.forEach(property => {
        bounds.extend({ lat: property.coordinates.lat, lng: property.coordinates.lng })
      })
      googleMapRef.current.fitBounds(bounds)
      
      const listener = window.google.maps.event.addListenerOnce(googleMapRef.current, 'bounds_changed', () => {
        const currentZoom = googleMapRef.current.getZoom()
        if (currentZoom > 16) {
          googleMapRef.current.setZoom(16)
        }
      })
    }
  }, [isMapLoaded, properties, selectedPropertyId, onPropertyClick, showControls])

  useEffect(() => {
    if (!googleMapRef.current || !selectedPropertyId || !window.google) return

    const selectedProperty = properties.find(p => p.id === selectedPropertyId)
    if (selectedProperty) {
      googleMapRef.current.panTo({
        lat: selectedProperty.coordinates.lat,
        lng: selectedProperty.coordinates.lng
      })
      googleMapRef.current.setZoom(15)
    }
  }, [selectedPropertyId, properties])

  return (
    <div className={cn('relative bg-muted/20 rounded-none lg:rounded-xl overflow-hidden border-0 lg:border', className)}>
      <div 
        ref={mapRef} 
        style={{ width: '100%', height: `${height}px`, minHeight: '500px' }}
        className="google-map-container"
      />

      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="p-6 text-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <MapPin size={24} className="text-primary" weight="fill" />
            </div>
            <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
          </Card>
        </div>
      )}

      <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
        <Badge variant="secondary" className="bg-card/98 backdrop-blur-md shadow-lg border pointer-events-auto">
          <MapPin size={14} className="mr-1.5" weight="fill" />
          <strong>{properties.length}</strong>
          <span className="ml-1">{properties.length === 1 ? 'property' : 'properties'}</span>
        </Badge>
      </div>

      {hoveredProperty && (
        <Card className="absolute bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-96 p-4 shadow-2xl bg-card/98 backdrop-blur-md border-2 animate-in slide-in-from-bottom-2 duration-200 pointer-events-auto">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-7 w-7 hover:bg-destructive/10"
            onClick={() => setHoveredProperty(null)}
            aria-label="Close property preview"
            title="Close property preview"
          >
            <X size={16} />
          </Button>
          
          <div className="flex gap-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 ring-2 ring-primary/20">
              <img
                src={hoveredProperty.images[0]}
                alt={hoveredProperty.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate mb-1">{hoveredProperty.title}</h3>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mb-2">
                <MapPin size={12} weight="fill" />
                {hoveredProperty.location}
              </p>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary" className="text-xs capitalize">
                  {hoveredProperty.type}
                </Badge>
                <span className="text-base font-bold text-primary">
                  €{hoveredProperty.price}
                  <span className="text-xs text-muted-foreground font-normal">
                    /{hoveredProperty.rentalTerm === 'short-term' ? 'night' : 'mo'}
                  </span>
                </span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-3">
                <span>{hoveredProperty.bedrooms} bed</span>
                <span>•</span>
                <span>{hoveredProperty.bathrooms} bath</span>
                <span>•</span>
                <span>{hoveredProperty.area}m²</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
