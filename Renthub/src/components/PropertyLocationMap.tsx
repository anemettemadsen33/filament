import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { MapPin, NavigationArrow } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface PropertyLocationMapProps {
  location: string
  title: string
}

export function PropertyLocationMap({ location, title }: PropertyLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mapRef.current) return

    const loadGoogleMaps = () => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      
      if (existingScript) {
        initializeMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      script.onerror = () => {
        setMapError(true)
        setIsLoading(false)
      }
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      if (!window.google || !mapRef.current) {
        setMapError(true)
        setIsLoading(false)
        return
      }

      const geocoder = new window.google.maps.Geocoder()
      
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK' && results && results[0] && mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: results[0].geometry.location,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: true,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
              }
            ]
          })

          new window.google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
            title: title,
            animation: window.google.maps.Animation.DROP,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#4F46E5',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 3,
            }
          })

          setIsLoading(false)
        } else {
          setMapError(true)
          setIsLoading(false)
        }
      })
    }

    loadGoogleMaps()
  }, [location, title])

  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`,
      '_blank'
    )
  }

  const handleOpenInMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
      '_blank'
    )
  }

  if (mapError) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <MapPin size={24} className="text-primary" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <p className="text-muted-foreground mb-4">{location}</p>
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleOpenInMaps}
              >
                <MapPin size={16} className="mr-2" />
                View on Google Maps
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGetDirections}
              >
                <NavigationArrow size={16} className="mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <MapPin size={20} className="text-primary" weight="fill" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Location</h3>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetDirections}
              className="bg-background/80 backdrop-blur-sm"
            >
              <NavigationArrow size={16} className="mr-2" />
              Directions
            </Button>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
        <div 
          ref={mapRef} 
          className="w-full h-[400px] bg-muted"
        />
      </div>
      
      <div className="p-4 bg-muted/30 border-t">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            📍 Exact location will be shared after booking confirmation
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenInMaps}
            className="text-xs"
          >
            Open in Google Maps →
          </Button>
        </div>
      </div>
    </Card>
  )
}

declare global {
  interface Window {
    google: any
  }
}
