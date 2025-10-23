import { ARObject, ARObjectType, ARRoom, ARSession, ARPlacedObject, ARMeasurement, ARAnalytics } from './types'

export const sampleARObjects: ARObject[] = [
  {
    id: 'sofa-modern-1',
    name: 'Modern Sofa',
    type: 'furniture',
    category: 'Seating',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    dimensions: { width: 220, height: 85, depth: 95 },
    color: 'Gray',
    style: 'Modern',
    price: 1299,
    brand: 'IKEA',
    description: 'Comfortable 3-seater sofa with clean lines'
  },
  {
    id: 'bed-queen-1',
    name: 'Queen Bed Frame',
    type: 'furniture',
    category: 'Bedroom',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400',
    dimensions: { width: 160, height: 120, depth: 210 },
    color: 'Wood',
    style: 'Scandinavian',
    price: 899,
    brand: 'West Elm',
    description: 'Elegant queen-size bed with wooden frame'
  },
  {
    id: 'table-dining-1',
    name: 'Dining Table',
    type: 'furniture',
    category: 'Dining',
    thumbnailUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400',
    dimensions: { width: 180, height: 75, depth: 90 },
    color: 'Oak',
    style: 'Contemporary',
    price: 749,
    brand: 'CB2',
    description: 'Modern dining table for 6-8 people'
  },
  {
    id: 'chair-office-1',
    name: 'Office Chair',
    type: 'furniture',
    category: 'Office',
    thumbnailUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400',
    dimensions: { width: 65, height: 120, depth: 65 },
    color: 'Black',
    style: 'Ergonomic',
    price: 399,
    brand: 'Herman Miller',
    description: 'Ergonomic office chair with lumbar support'
  },
  {
    id: 'lamp-floor-1',
    name: 'Floor Lamp',
    type: 'lighting',
    category: 'Lighting',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
    dimensions: { width: 40, height: 180, depth: 40 },
    color: 'Brass',
    style: 'Industrial',
    price: 199,
    brand: 'Target',
    description: 'Modern floor lamp with adjustable arm'
  },
  {
    id: 'plant-large-1',
    name: 'Monstera Plant',
    type: 'plant',
    category: 'Decor',
    thumbnailUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400',
    dimensions: { width: 60, height: 150, depth: 60 },
    color: 'Green',
    style: 'Natural',
    price: 89,
    description: 'Large potted Monstera plant'
  },
  {
    id: 'tv-55-1',
    name: '55" Smart TV',
    type: 'electronics',
    category: 'Entertainment',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
    dimensions: { width: 123, height: 71, depth: 6 },
    color: 'Black',
    style: 'Modern',
    price: 699,
    brand: 'Samsung',
    description: '55-inch 4K Smart TV'
  },
  {
    id: 'bookshelf-1',
    name: 'Bookshelf',
    type: 'furniture',
    category: 'Storage',
    thumbnailUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400',
    dimensions: { width: 80, height: 180, depth: 30 },
    color: 'White',
    style: 'Minimalist',
    price: 249,
    brand: 'IKEA',
    description: 'Modern 5-shelf bookshelf'
  },
  {
    id: 'rug-1',
    name: 'Area Rug',
    type: 'decoration',
    category: 'Decor',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600166898405-da9535204f16?w=400',
    dimensions: { width: 200, height: 1, depth: 300 },
    color: 'Beige',
    style: 'Bohemian',
    price: 299,
    description: 'Large area rug with geometric pattern'
  },
  {
    id: 'coffee-table-1',
    name: 'Coffee Table',
    type: 'furniture',
    category: 'Living Room',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400',
    dimensions: { width: 120, height: 45, depth: 60 },
    color: 'Walnut',
    style: 'Mid-Century',
    price: 449,
    brand: 'Article',
    description: 'Mid-century modern coffee table'
  },
  {
    id: 'armchair-1',
    name: 'Accent Chair',
    type: 'furniture',
    category: 'Seating',
    thumbnailUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400',
    dimensions: { width: 75, height: 90, depth: 85 },
    color: 'Velvet Blue',
    style: 'Contemporary',
    price: 599,
    description: 'Comfortable accent chair with velvet upholstery'
  },
  {
    id: 'desk-1',
    name: 'Writing Desk',
    type: 'furniture',
    category: 'Office',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=400',
    dimensions: { width: 140, height: 75, depth: 70 },
    color: 'Oak',
    style: 'Scandinavian',
    price: 549,
    brand: 'IKEA',
    description: 'Minimalist writing desk with drawers'
  }
]

export const sampleARRooms: ARRoom[] = [
  {
    id: 'room-living-1',
    propertyId: '',
    name: 'Living Room',
    type: 'living-room',
    dimensions: { width: 500, height: 280, depth: 450 },
    panoramaImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600',
    arEnabled: true,
    createdAt: Date.now()
  },
  {
    id: 'room-bedroom-1',
    propertyId: '',
    name: 'Master Bedroom',
    type: 'bedroom',
    dimensions: { width: 400, height: 280, depth: 400 },
    panoramaImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600',
    arEnabled: true,
    createdAt: Date.now()
  },
  {
    id: 'room-kitchen-1',
    propertyId: '',
    name: 'Kitchen',
    type: 'kitchen',
    dimensions: { width: 350, height: 280, depth: 400 },
    panoramaImage: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1600',
    arEnabled: true,
    createdAt: Date.now()
  }
]

export function generateARSession(
  propertyId: string,
  propertyTitle: string,
  userId?: string,
  userName?: string
): ARSession {
  return {
    id: `ar-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId,
    propertyTitle,
    userId,
    userName,
    placedObjects: [],
    screenshots: [],
    duration: 0,
    startedAt: Date.now(),
    shared: false
  }
}

export function createARPlacedObject(
  object: ARObject,
  position: { x: number; y: number; z: number },
  rotation: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 },
  scale: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 }
): ARPlacedObject {
  return {
    id: `placed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    objectId: object.id,
    object,
    position,
    rotation,
    scale,
    placedAt: Date.now()
  }
}

export function createARMeasurement(
  sessionId: string,
  type: ARMeasurement['type'],
  startPoint: { x: number; y: number; z: number },
  endPoint?: { x: number; y: number; z: number },
  unit: 'cm' | 'm' | 'ft' | 'in' = 'cm'
): ARMeasurement {
  let value = 0
  
  if (type === 'distance' && endPoint) {
    const dx = endPoint.x - startPoint.x
    const dy = endPoint.y - startPoint.y
    const dz = endPoint.z - startPoint.z
    value = Math.sqrt(dx * dx + dy * dy + dz * dz)
  }
  
  return {
    id: `measurement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sessionId,
    type,
    startPoint,
    endPoint,
    value,
    unit,
    timestamp: Date.now()
  }
}

export function getObjectsByCategory(category: string): ARObject[] {
  return sampleARObjects.filter(obj => obj.category === category)
}

export function getObjectsByType(type: ARObjectType): ARObject[] {
  return sampleARObjects.filter(obj => obj.type === type)
}

export function getObjectsByStyle(style: string): ARObject[] {
  return sampleARObjects.filter(obj => obj.style === style)
}

export function searchARObjects(query: string): ARObject[] {
  const lowerQuery = query.toLowerCase()
  return sampleARObjects.filter(obj => 
    obj.name.toLowerCase().includes(lowerQuery) ||
    obj.category.toLowerCase().includes(lowerQuery) ||
    obj.type.toLowerCase().includes(lowerQuery) ||
    obj.style?.toLowerCase().includes(lowerQuery) ||
    obj.description?.toLowerCase().includes(lowerQuery)
  )
}

export function calculateARAnalytics(sessions: ARSession[]): ARAnalytics {
  const totalSessions = sessions.length
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0)
  const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0
  
  const objectCounts = new Map<string, { name: string; count: number }>()
  let totalObjectsPlaced = 0
  
  sessions.forEach(session => {
    session.placedObjects.forEach(placed => {
      totalObjectsPlaced++
      const current = objectCounts.get(placed.objectId) || { name: placed.object.name, count: 0 }
      objectCounts.set(placed.objectId, { name: current.name, count: current.count + 1 })
    })
  })
  
  const mostPlacedObjects = Array.from(objectCounts.entries())
    .map(([objectId, data]) => ({
      objectId,
      objectName: data.name,
      count: data.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  
  const screenshots = sessions.reduce((sum, s) => sum + s.screenshots.length, 0)
  const sharedSessions = sessions.filter(s => s.shared).length
  
  return {
    propertyId: sessions[0]?.propertyId || '',
    totalSessions,
    totalDuration,
    averageSessionDuration,
    totalObjectsPlaced,
    mostPlacedObjects,
    popularRooms: [],
    conversionRate: 0,
    sessionsWithBooking: 0,
    screenshots,
    sharedSessions,
    deviceTypes: {
      mobile: Math.floor(totalSessions * 0.6),
      tablet: Math.floor(totalSessions * 0.3),
      desktop: Math.floor(totalSessions * 0.1)
    },
    lastUpdated: Date.now()
  }
}

export function detectARSupport(): { supported: boolean; reason?: string } {
  if (typeof window === 'undefined') {
    return { supported: false, reason: 'Server-side rendering' }
  }
  
  const hasWebXR = 'xr' in navigator
  const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  
  if (!hasWebXR && !hasGetUserMedia) {
    return { 
      supported: false, 
      reason: 'Your device does not support AR. Please use a modern mobile device with AR capabilities.' 
    }
  }
  
  return { supported: true }
}

export function generateShareLink(sessionId: string): string {
  return `${window.location.origin}/ar-tour/${sessionId}`
}

export function formatDimensions(dimensions: { width: number; height: number; depth: number }, unit: string = 'cm'): string {
  return `${dimensions.width}${unit} × ${dimensions.height}${unit} × ${dimensions.depth}${unit}`
}

export function convertUnit(value: number, from: 'cm' | 'm' | 'ft' | 'in', to: 'cm' | 'm' | 'ft' | 'in'): number {
  const toCm: Record<string, number> = {
    cm: 1,
    m: 100,
    ft: 30.48,
    in: 2.54
  }
  
  const valueInCm = value * toCm[from]
  return valueInCm / toCm[to]
}
