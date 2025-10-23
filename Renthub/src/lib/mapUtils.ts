import { Property, PropertyWithLocation, PropertyCoordinates, PropertyCluster, MapBounds } from './types'

const BUCHAREST_COORDS: PropertyCoordinates = { lat: 44.4268, lng: 26.1025 }

const LOCATION_COORDINATES: Record<string, PropertyCoordinates> = {
  'Downtown, Bucharest': { lat: 44.4355, lng: 26.1025 },
  'Pipera, Bucharest': { lat: 44.4797, lng: 26.1258 },
  'Baneasa, Bucharest': { lat: 44.5048, lng: 26.0774 },
  'Old Town, Bucharest': { lat: 44.4304, lng: 26.1028 },
  'Constanta Seaside': { lat: 44.1767, lng: 28.6341 },
  'Floreasca, Bucharest': { lat: 44.4662, lng: 26.1021 },
  'Business District, Bucharest': { lat: 44.4435, lng: 26.0969 },
  'Sinaia, Prahova': { lat: 45.3500, lng: 25.5500 },
  'University Area, Bucharest': { lat: 44.4357, lng: 26.0988 },
  'Aviatorilor, Bucharest': { lat: 44.4775, lng: 26.0858 },
  'Herastrau, Bucharest': { lat: 44.4694, lng: 26.0867 },
  'Titan, Bucharest': { lat: 44.4245, lng: 26.1645 },
  'Vitan, Bucharest': { lat: 44.3997, lng: 26.1341 }
}

export function addCoordinatesToProperty(property: Property): PropertyWithLocation {
  const coords = LOCATION_COORDINATES[property.location]
  
  if (coords) {
    const jitter = 0.003
    return {
      ...property,
      coordinates: {
        lat: coords.lat + (Math.random() - 0.5) * jitter,
        lng: coords.lng + (Math.random() - 0.5) * jitter
      }
    }
  }
  
  return {
    ...property,
    coordinates: {
      lat: BUCHAREST_COORDS.lat + (Math.random() - 0.5) * 0.1,
      lng: BUCHAREST_COORDS.lng + (Math.random() - 0.5) * 0.1
    }
  }
}

export function addCoordinatesToProperties(properties: Property[]): PropertyWithLocation[] {
  return properties.map(addCoordinatesToProperty)
}

export function calculateDistance(coord1: PropertyCoordinates, coord2: PropertyCoordinates): number {
  const R = 6371
  const dLat = toRad(coord2.lat - coord1.lat)
  const dLng = toRad(coord2.lng - coord1.lng)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function clusterProperties(
  properties: PropertyWithLocation[],
  zoom: number
): PropertyCluster[] {
  const clusterRadius = getClusterRadius(zoom)
  const clusters: PropertyCluster[] = []
  const processed = new Set<string>()
  
  properties.forEach(property => {
    if (processed.has(property.id)) return
    
    const cluster: PropertyCluster = {
      id: `cluster-${property.id}`,
      coordinates: property.coordinates,
      properties: [property],
      count: 1
    }
    
    processed.add(property.id)
    
    properties.forEach(otherProperty => {
      if (
        !processed.has(otherProperty.id) &&
        calculateDistance(property.coordinates, otherProperty.coordinates) < clusterRadius
      ) {
        cluster.properties.push(otherProperty)
        cluster.count++
        processed.add(otherProperty.id)
        
        cluster.coordinates = {
          lat: (cluster.coordinates.lat * (cluster.count - 1) + otherProperty.coordinates.lat) / cluster.count,
          lng: (cluster.coordinates.lng * (cluster.count - 1) + otherProperty.coordinates.lng) / cluster.count
        }
      }
    })
    
    clusters.push(cluster)
  })
  
  return clusters
}

function getClusterRadius(zoom: number): number {
  if (zoom >= 14) return 0.1
  if (zoom >= 12) return 0.5
  if (zoom >= 10) return 1
  return 3
}

export function getMapBounds(properties: PropertyWithLocation[]): MapBounds {
  if (properties.length === 0) {
    return {
      north: BUCHAREST_COORDS.lat + 0.1,
      south: BUCHAREST_COORDS.lat - 0.1,
      east: BUCHAREST_COORDS.lng + 0.1,
      west: BUCHAREST_COORDS.lng - 0.1
    }
  }
  
  const lats = properties.map(p => p.coordinates.lat)
  const lngs = properties.map(p => p.coordinates.lng)
  
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  }
}

export function isPropertyInBounds(property: PropertyWithLocation, bounds: MapBounds): boolean {
  return (
    property.coordinates.lat >= bounds.south &&
    property.coordinates.lat <= bounds.north &&
    property.coordinates.lng >= bounds.west &&
    property.coordinates.lng <= bounds.east
  )
}

export function getMapCenter(properties: PropertyWithLocation[]): PropertyCoordinates {
  if (properties.length === 0) {
    return BUCHAREST_COORDS
  }
  
  const avgLat = properties.reduce((sum, p) => sum + p.coordinates.lat, 0) / properties.length
  const avgLng = properties.reduce((sum, p) => sum + p.coordinates.lng, 0) / properties.length
  
  return { lat: avgLat, lng: avgLng }
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`
  }
  return `${km.toFixed(1)}km`
}
