import { Property, Landlord, Voucher } from './types'
import { calculateBadges } from './badgeUtils'

const createLandlord = (
  id: string,
  name: string,
  email: string,
  phone: string,
  avatar: string,
  stats: {
    totalProperties: number
    activeListings: number
    totalBookings: number
    responseTime: number
    responseRate: number
    averageRating: number
    reviewCount: number
    yearsOnPlatform: number
    completionRate: number
  },
  verification: {
    verified: boolean
    identity: boolean
    email: boolean
    phone: boolean
    backgroundCheck?: boolean
    proofOfOwnership?: boolean
  },
  propertyAmenities: string[][]
): Landlord => {
  const verificationData = {
    ...verification,
    verifiedAt: verification.verified ? Date.now() - 86400000 * 30 : undefined
  }
  
  const badges = calculateBadges(stats, verificationData, propertyAmenities)
  const isSuperhost = badges.some(b => b.type === 'superhost')
  
  return {
    id,
    name,
    email,
    phone,
    avatar,
    joinedAt: Date.now() - 86400000 * 365 * stats.yearsOnPlatform,
    verification: verificationData,
    stats,
    badges,
    isSuperhost
  }
}

export const sampleProperties: Property[] = [
  {
    id: 'prop-1',
    title: 'Modern Downtown Apartment',
    description: 'Stunning 2-bedroom apartment in the heart of downtown. Features floor-to-ceiling windows with breathtaking city views, hardwood floors throughout, and a fully equipped modern kitchen with stainless steel appliances. Building amenities include 24/7 concierge, fitness center, and rooftop terrace.',
    price: 1800,
    location: 'Bulevardul Unirii 45, București, Romania',
    type: 'apartment',
    rentalTerm: 'long-term',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Parking', 'Gym', 'Elevator', 'Balcony'],
    available: true,
    createdAt: Date.now() - 86400000 * 5,
    lockbox: {
      enabled: true,
      type: 'smart_lock',
      instructions: '1. Enter the provided code on the smart lock keypad\n2. Press # to confirm\n3. The door will unlock automatically\n4. Please ensure the door locks behind you when entering',
      location: 'Main entrance, building lobby',
      wifiName: 'ModernApt_5G',
      wifiPassword: 'Welcome2024!',
      parkingInstructions: 'Underground parking available. Use entrance B, spots 45-50 are for guests.',
      emergencyContact: '+40 721 234 567'
    },
    virtualTours: [
      {
        id: 'tour-1-1',
        type: '360',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
        title: 'Living Room 360° View',
        description: 'Explore the spacious living room with panoramic city views',
        roomName: 'Living Room',
        createdAt: Date.now() - 86400000 * 4
      },
      {
        id: 'tour-1-2',
        type: '360',
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
        title: 'Kitchen 360° View',
        description: 'Modern kitchen with high-end appliances',
        roomName: 'Kitchen',
        createdAt: Date.now() - 86400000 * 4
      }
    ],
    landlord: createLandlord(
      'landlord-1',
      'Maria Popescu',
      'maria.popescu@example.com',
      '+40 721 234 567',
      'https://i.pravatar.cc/150?img=5',
      {
        totalProperties: 3,
        activeListings: 3,
        totalBookings: 45,
        responseTime: 30,
        responseRate: 98,
        averageRating: 4.9,
        reviewCount: 42,
        yearsOnPlatform: 3,
        completionRate: 99
      },
      {
        verified: true,
        identity: true,
        email: true,
        phone: true,
        backgroundCheck: true,
        proofOfOwnership: true
      },
      [['WiFi', 'Air Conditioning', 'Parking', 'Gym', 'Elevator', 'Balcony']]
    )
  },
  {
    id: 'prop-2',
    title: 'Cozy Studio for Short Stays',
    description: 'Perfect for business travelers or weekend getaways. This fully furnished studio offers everything you need for a comfortable short-term stay. Located near public transport, restaurants, and shopping centers. Includes high-speed WiFi, smart TV, and a kitchenette.',
    price: 60,
    location: 'Strada Pipera 42, București, Romania',
    type: 'studio',
    rentalTerm: 'short-term',
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80'
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'TV', 'Workspace'],
    available: true,
    createdAt: Date.now() - 86400000 * 3,
    lockbox: {
      enabled: true,
      type: 'key_lockbox',
      instructions: 'The key lockbox is located to the right of the main entrance. Enter the code to open the lockbox and retrieve the key. Please return the key to the lockbox when you check out.',
      location: 'Right side of main entrance door',
      wifiName: 'CozyStudio_WiFi',
      wifiPassword: 'Guest2024',
      parkingInstructions: 'Street parking available. Use the blue zone parking spots on Strada Pipera.',
      emergencyContact: '+40 731 345 678'
    },
    landlord: createLandlord(
      'landlord-2',
      'Ion Marinescu',
      'ion.marinescu@example.com',
      '+40 731 345 678',
      'https://i.pravatar.cc/150?img=12',
      {
        totalProperties: 5,
        activeListings: 4,
        totalBookings: 120,
        responseTime: 45,
        responseRate: 92,
        averageRating: 4.6,
        reviewCount: 89,
        yearsOnPlatform: 2,
        completionRate: 96
      },
      {
        verified: true,
        identity: true,
        email: true,
        phone: true,
        backgroundCheck: false,
        proofOfOwnership: true
      },
      [['WiFi', 'Air Conditioning', 'Kitchen', 'TV', 'Workspace']]
    )
  },
  {
    id: 'prop-3',
    title: 'Luxury Villa with Pool',
    description: 'Spectacular 4-bedroom villa in an exclusive residential area. Features include a private swimming pool, landscaped garden, outdoor BBQ area, and spacious terrace. Perfect for families seeking comfort and privacy. Garage for 2 cars included.',
    price: 3500,
    location: 'Strada București-Ploiești 15, Băneasa, București, Romania',
    type: 'house',
    rentalTerm: 'long-term',
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
    ],
    amenities: ['Pool', 'Garden', 'Parking', 'WiFi', 'Air Conditioning', 'Security System', 'BBQ'],
    available: true,
    createdAt: Date.now() - 86400000 * 10,
    virtualTours: [
      {
        id: 'tour-3-1',
        type: '360',
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
        title: 'Main Living Area',
        description: 'Spacious living room with high ceilings and natural light',
        roomName: 'Living Room',
        createdAt: Date.now() - 86400000 * 9
      },
      {
        id: 'tour-3-2',
        type: '360',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
        title: 'Master Bedroom',
        description: 'Luxurious master bedroom with ensuite bathroom',
        roomName: 'Master Bedroom',
        createdAt: Date.now() - 86400000 * 9
      },
      {
        id: 'tour-3-3',
        type: '360',
        url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1600&q=80',
        thumbnail: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&q=80',
        title: 'Pool & Garden View',
        description: 'Beautiful outdoor area with pool and landscaping',
        roomName: 'Outdoor',
        createdAt: Date.now() - 86400000 * 9
      }
    ],
    landlord: createLandlord(
      'landlord-3',
      'Alexandru Stanescu',
      'alex.stanescu@example.com',
      '+40 741 456 789',
      'https://i.pravatar.cc/150?img=33',
      {
        totalProperties: 2,
        activeListings: 2,
        totalBookings: 28,
        responseTime: 120,
        responseRate: 85,
        averageRating: 4.7,
        reviewCount: 24,
        yearsOnPlatform: 2,
        completionRate: 94
      },
      {
        verified: true,
        identity: true,
        email: true,
        phone: true,
        backgroundCheck: true,
        proofOfOwnership: true
      },
      [['Pool', 'Garden', 'Parking', 'WiFi', 'Air Conditioning', 'Security System', 'BBQ']]
    )
  },
  {
    id: 'prop-4',
    title: 'Charming Old Town Condo',
    description: 'Beautiful 3-bedroom condo in a historic building with modern renovations. High ceilings, original architectural details, and updated amenities. Walking distance to museums, cafes, and cultural landmarks. Ideal for those who appreciate character and location.',
    price: 2200,
    location: 'Strada Lipscani 9, Centrul Vechi, București, Romania',
    type: 'condo',
    rentalTerm: 'long-term',
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    images: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
    ],
    amenities: ['WiFi', 'Heating', 'Fireplace', 'Balcony', 'Storage'],
    available: true,
    createdAt: Date.now() - 86400000 * 7,
    landlord: createLandlord(
      'landlord-4',
      'Elena Ionescu',
      'elena.ionescu@example.com',
      '+40 751 567 890',
      'https://i.pravatar.cc/150?img=9',
      {
        totalProperties: 4,
        activeListings: 3,
        totalBookings: 65,
        responseTime: 35,
        responseRate: 96,
        averageRating: 4.8,
        reviewCount: 58,
        yearsOnPlatform: 3,
        completionRate: 97
      },
      {
        verified: true,
        identity: true,
        email: true,
        phone: true,
        backgroundCheck: true,
        proofOfOwnership: true
      },
      [['WiFi', 'Heating', 'Fireplace', 'Balcony', 'Storage']]
    )
  },
  {
    id: 'prop-5',
    title: 'Beach House Weekend Rental',
    description: 'Escape to this beautiful beach house available for short-term stays. Located just steps from the beach with stunning sea views. Features 3 bedrooms, open-plan living, and a large deck perfect for entertaining. Ideal for family vacations or romantic getaways.',
    price: 150,
    location: 'Bulevardul Mamaia 255, Constanța, Romania',
    type: 'house',
    rentalTerm: 'short-term',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
      'https://images.unsplash.com/photo-1520608421741-68228b76b6df?w=800&q=80'
    ],
    amenities: ['Beach Access', 'WiFi', 'Air Conditioning', 'Deck', 'BBQ', 'Parking'],
    available: true,
    createdAt: Date.now() - 86400000 * 2,
    landlord: createLandlord(
      'landlord-5',
      'Mihai Dumitrescu',
      'mihai.dumitrescu@example.com',
      '+40 761 678 901',
      'https://i.pravatar.cc/150?img=15',
      {
        totalProperties: 3,
        activeListings: 3,
        totalBookings: 95,
        responseTime: 25,
        responseRate: 94,
        averageRating: 4.5,
        reviewCount: 78,
        yearsOnPlatform: 2,
        completionRate: 92
      },
      {
        verified: true,
        identity: true,
        email: true,
        phone: false,
        backgroundCheck: true,
        proofOfOwnership: true
      },
      [['Beach Access', 'WiFi', 'Air Conditioning', 'Deck', 'BBQ', 'Parking']]
    )
  },
  {
    id: 'prop-6',
    title: 'Spacious Family Apartment',
    description: 'Large 3-bedroom apartment perfect for families. Located in a quiet residential neighborhood with excellent schools nearby. Features a large living room, modern kitchen with dining area, and two balconies. Building has playground and green spaces.',
    price: 1400,
    location: 'Bulevardul Barbu Văcărescu 164, Floreasca, București, Romania',
    type: 'apartment',
    rentalTerm: 'long-term',
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80'
    ],
    amenities: ['Playground', 'Parking', 'WiFi', 'Balcony', 'Storage', 'Elevator', 'Family-Friendly'],
    available: true,
    createdAt: Date.now() - 86400000 * 12,
    landlord: createLandlord(
      'landlord-6',
      'Georgiana Popa',
      'georgiana.popa@example.com',
      '+40 771 789 012',
      'https://i.pravatar.cc/150?img=20',
      {
        totalProperties: 6,
        activeListings: 5,
        totalBookings: 52,
        responseTime: 55,
        responseRate: 88,
        averageRating: 4.6,
        reviewCount: 45,
        yearsOnPlatform: 4,
        completionRate: 95
      },
      {
        verified: true,
        identity: true,
        email: true,
        phone: true,
        backgroundCheck: false,
        proofOfOwnership: true
      },
      [['Playground', 'Parking', 'WiFi', 'Balcony', 'Storage', 'Elevator', 'Family-Friendly']]
    )
  },
  {
    id: 'prop-7',
    title: 'City Center Business Studio',
    description: 'Modern studio apartment ideal for business professionals. Located in the financial district with easy access to offices, restaurants, and public transport. Fully furnished with a workspace, high-speed internet, and all utilities included.',
    price: 45,
    location: 'Calea Victoriei 155, București, Romania',
    type: 'studio',
    rentalTerm: 'short-term',
    bedrooms: 1,
    bathrooms: 1,
    area: 30,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80'
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Workspace', 'Kitchen', 'Gym'],
    available: true,
    createdAt: Date.now() - 86400000 * 1,
    landlord: createLandlord(
      'landlord-2',
      'Ion Marinescu',
      'ion.marinescu@example.com',
      '+40 731 345 678',
      'https://i.pravatar.cc/150?img=12',
      {
        totalProperties: 5,
        activeListings: 4,
        totalBookings: 120,
        responseTime: 45,
        responseRate: 92,
        averageRating: 4.6,
        reviewCount: 89,
        yearsOnPlatform: 2,
        completionRate: 96
      },
      {
        verified: true,
        identity: true,
        email: true,
        phone: true,
        backgroundCheck: false,
        proofOfOwnership: true
      },
      [['WiFi', 'Air Conditioning', 'Kitchen', 'TV', 'Workspace']]
    )
  },
  {
    id: 'prop-8',
    title: 'Mountain Cabin Retreat',
    description: 'Cozy mountain cabin perfect for weekend escapes. Surrounded by nature with hiking trails nearby. Features a fireplace, wooden interiors, and a terrace with mountain views. Available for short-term rentals year-round.',
    price: 80,
    location: 'Bulevardul Carol I 2, Sinaia, Prahova, Romania',
    type: 'house',
    rentalTerm: 'short-term',
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    images: [
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80',
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80',
      'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80'
    ],
    amenities: ['Fireplace', 'WiFi', 'Heating', 'Terrace', 'Parking', 'Mountain View'],
    available: true,
    createdAt: Date.now() - 86400000 * 4,
    landlord: createLandlord(
      'landlord-8',
      'Andrei Vasilescu',
      'andrei.vasilescu@example.com',
      '+40 791 901 234',
      'https://i.pravatar.cc/150?img=14',
      {
        totalProperties: 1,
        activeListings: 1,
        totalBookings: 18,
        responseTime: 90,
        responseRate: 80,
        averageRating: 4.3,
        reviewCount: 15,
        yearsOnPlatform: 1,
        completionRate: 89
      },
      {
        verified: false,
        identity: false,
        email: true,
        phone: true,
        backgroundCheck: false,
        proofOfOwnership: false
      },
      [['Fireplace', 'WiFi', 'Heating', 'Terrace', 'Parking', 'Mountain View']]
    )
  },
  {
    id: 'prop-9',
    title: 'Penthouse with Panoramic Views',
    description: 'Exclusive penthouse on the top floor with 360-degree city views. Features 3 bedrooms, 3 bathrooms, a private terrace, and premium finishes throughout. Building offers concierge service, underground parking, and state-of-the-art security.',
    price: 4200,
    location: 'Strada Kiseleff 10, Primăverii, București, Romania',
    type: 'apartment',
    rentalTerm: 'long-term',
    bedrooms: 3,
    bathrooms: 3,
    area: 180,
    images: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80',
      'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=800&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80'
    ],
    amenities: ['Terrace', 'City View', 'Parking', 'WiFi', 'Air Conditioning', 'Security', 'Concierge', 'Gym'],
    available: true,
    createdAt: Date.now() - 86400000 * 15,
    landlord: createLandlord(
      'landlord-9',
      'Diana Cristescu',
      'diana.cristescu@example.com',
      '+40 701 012 345',
      'https://i.pravatar.cc/150?img=24',
      {
        totalProperties: 1,
        activeListings: 1,
        totalBookings: 8,
        responseTime: 180,
        responseRate: 75,
        averageRating: 4.2,
        reviewCount: 7,
        yearsOnPlatform: 1,
        completionRate: 87
      },
      {
        verified: false,
        identity: true,
        email: true,
        phone: false,
        backgroundCheck: false,
        proofOfOwnership: true
      },
      [['Terrace', 'City View', 'Parking', 'WiFi', 'Air Conditioning', 'Security', 'Concierge', 'Gym']]
    )
  },
  {
    id: 'prop-10',
    title: 'Student-Friendly Studio',
    description: 'Affordable studio apartment near university campus and public transport. Perfect for students or young professionals. Includes basic furniture, kitchenette, and shared laundry facilities. Quiet building with study-friendly environment.',
    price: 850,
    location: 'Splaiul Independenței 313, București, Romania',
    type: 'studio',
    rentalTerm: 'long-term',
    bedrooms: 1,
    bathrooms: 1,
    area: 28,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'
    ],
    amenities: ['WiFi', 'Heating', 'Shared Laundry', 'Bike Storage'],
    available: true,
    createdAt: Date.now() - 86400000 * 6,
    landlord: createLandlord(
      'landlord-10',
      'Stefan Matei',
      'stefan.matei@example.com',
      '+40 711 123 456',
      'https://i.pravatar.cc/150?img=11',
      {
        totalProperties: 8,
        activeListings: 6,
        totalBookings: 142,
        responseTime: 40,
        responseRate: 93,
        averageRating: 4.4,
        reviewCount: 125,
        yearsOnPlatform: 5,
        completionRate: 96
      },
      {
        verified: true,
        identity: true,
        email: true,
        phone: true,
        backgroundCheck: true,
        proofOfOwnership: true
      },
      [['WiFi', 'Heating', 'Shared Laundry', 'Bike Storage']]
    )
  }
]

export const sampleVouchers: Voucher[] = [
  {
    id: 'voucher-1',
    code: 'WELCOME2024',
    type: 'percentage',
    value: 15,
    description: 'Welcome discount for new users - Get 15% off your first booking',
    category: 'first-booking',
    landlordId: 'landlord-1',
    validFrom: Date.now() - 7 * 24 * 60 * 60 * 1000,
    validUntil: Date.now() + 60 * 24 * 60 * 60 * 1000,
    maxUses: 500,
    currentUses: 47,
    maxUsesPerUser: 1,
    minBookingValue: 500,
    active: true,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    createdBy: 'landlord-1',
    isPublic: true,
    autoApply: false,
    stackable: false,
    priority: 10
  },
  {
    id: 'voucher-2',
    code: 'LONGSTAY20',
    type: 'percentage',
    value: 20,
    description: 'Book for 6+ months and save 20% on your total rental cost',
    category: 'long-stay',
    validFrom: Date.now() - 14 * 24 * 60 * 60 * 1000,
    validUntil: Date.now() + 90 * 24 * 60 * 60 * 1000,
    maxUses: 100,
    currentUses: 23,
    minBookingMonths: 6,
    rentalTermRestriction: 'long-term',
    active: true,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    createdBy: 'landlord-2',
    isPublic: true,
    autoApply: true,
    stackable: false,
    priority: 8
  },
  {
    id: 'voucher-3',
    code: 'EARLYBIRD10',
    type: 'percentage',
    value: 10,
    description: 'Book 30+ days in advance and get 10% off your stay',
    category: 'early-bird',
    validFrom: Date.now(),
    validUntil: Date.now() + 120 * 24 * 60 * 60 * 1000,
    maxUses: 200,
    currentUses: 89,
    minBookingDays: 3,
    rentalTermRestriction: 'short-term',
    active: true,
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    createdBy: 'landlord-3',
    isPublic: true,
    autoApply: false,
    stackable: false,
    priority: 5
  },
  {
    id: 'voucher-4',
    code: 'SUMMER50',
    type: 'fixed',
    value: 50,
    description: 'Summer special - Save $50 on any booking over $1000',
    category: 'seasonal',
    validFrom: Date.now() - 5 * 24 * 60 * 60 * 1000,
    validUntil: Date.now() + 45 * 24 * 60 * 60 * 1000,
    maxUses: 300,
    currentUses: 156,
    minBookingValue: 1000,
    active: true,
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    createdBy: 'landlord-4',
    isPublic: true,
    autoApply: false,
    stackable: true,
    priority: 6
  },
  {
    id: 'voucher-5',
    code: 'REFERPAL25',
    type: 'fixed',
    value: 25,
    description: 'Refer a friend and you both get $25 off your next booking',
    category: 'referral',
    validFrom: Date.now() - 10 * 24 * 60 * 60 * 1000,
    validUntil: Date.now() + 180 * 24 * 60 * 60 * 1000,
    maxUses: 1000,
    currentUses: 234,
    maxUsesPerUser: 5,
    minBookingValue: 300,
    active: true,
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
    createdBy: 'landlord-1',
    isPublic: true,
    autoApply: false,
    stackable: true,
    priority: 4
  },
  {
    id: 'voucher-6',
    code: 'LUXURY100',
    type: 'fixed',
    value: 100,
    description: 'Premium property discount - $100 off luxury rentals',
    category: 'custom',
    propertyId: 'property-7',
    validFrom: Date.now() - 3 * 24 * 60 * 60 * 1000,
    validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000,
    maxUses: 50,
    currentUses: 12,
    minBookingValue: 2000,
    propertyTypeRestriction: ['condo', 'house'],
    active: true,
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    createdBy: 'landlord-5',
    isPublic: true,
    autoApply: false,
    stackable: false,
    priority: 9
  },
  {
    id: 'voucher-7',
    code: 'LOYALTY15',
    type: 'percentage',
    value: 15,
    description: 'Thank you for being a loyal customer - 15% off your next stay',
    category: 'loyalty',
    validFrom: Date.now() - 2 * 24 * 60 * 60 * 1000,
    validUntil: Date.now() + 90 * 24 * 60 * 60 * 1000,
    maxUses: 150,
    currentUses: 67,
    maxUsesPerUser: 1,
    minBookingDays: 5,
    active: true,
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    createdBy: 'landlord-6',
    isPublic: false,
    autoApply: false,
    stackable: false,
    priority: 7
  },
  {
    id: 'voucher-8',
    code: 'WEEKEND25',
    type: 'percentage',
    value: 25,
    description: 'Weekend getaway special - 25% off 2-3 night stays',
    category: 'seasonal',
    validFrom: Date.now(),
    validUntil: Date.now() + 21 * 24 * 60 * 60 * 1000,
    maxUses: 80,
    currentUses: 45,
    minBookingDays: 2,
    rentalTermRestriction: 'short-term',
    active: true,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    createdBy: 'landlord-7',
    isPublic: true,
    autoApply: false,
    stackable: false,
    priority: 6
  }
]
