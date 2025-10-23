import { FilterState } from './types'
import { 
  Buildings, 
  House, 
  Student, 
  UsersThree, 
  Heart, 
  Briefcase, 
  PawPrint, 
  Mountains, 
  Crown,
  CurrencyDollar,
  Bed,
  MapPin
} from '@phosphor-icons/react'

export interface FilterPreset {
  id: string
  name: string
  description: string
  icon: any
  category: 'popular' | 'lifestyle' | 'budget' | 'type'
  filters: FilterState
  color: string
}

export const popularFilterPresets: FilterPreset[] = [
  {
    id: 'student-housing',
    name: 'Student Housing',
    description: 'Affordable studios and shared apartments near universities',
    icon: Student,
    category: 'lifestyle',
    color: 'text-blue-600',
    filters: {
      searchQuery: '',
      propertyType: 'studio',
      rentalTerm: 'long-term',
      minPrice: 0,
      maxPrice: 800,
      bedrooms: '1',
      verifiedOnly: true,
      superhostOnly: false
    }
  },
  {
    id: 'family-homes',
    name: 'Family Homes',
    description: 'Spacious houses perfect for families with children',
    icon: House,
    category: 'lifestyle',
    color: 'text-green-600',
    filters: {
      searchQuery: '',
      propertyType: 'house',
      rentalTerm: 'long-term',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: '3',
      verifiedOnly: false,
      superhostOnly: false
    }
  },
  {
    id: 'luxury-apartments',
    name: 'Luxury Apartments',
    description: 'Premium apartments with top-tier amenities',
    icon: Crown,
    category: 'type',
    color: 'text-amber-600',
    filters: {
      searchQuery: '',
      propertyType: 'apartment',
      rentalTerm: 'all',
      minPrice: 2000,
      maxPrice: 10000,
      bedrooms: 'all',
      verifiedOnly: true,
      superhostOnly: true
    }
  },
  {
    id: 'budget-friendly',
    name: 'Budget Friendly',
    description: 'Affordable options under €600/month',
    icon: CurrencyDollar,
    category: 'budget',
    color: 'text-emerald-600',
    filters: {
      searchQuery: '',
      propertyType: 'all',
      rentalTerm: 'all',
      minPrice: 0,
      maxPrice: 600,
      bedrooms: 'all',
      verifiedOnly: false,
      superhostOnly: false
    }
  },
  {
    id: 'pet-friendly',
    name: 'Pet Friendly',
    description: 'Properties that welcome your furry friends',
    icon: PawPrint,
    category: 'lifestyle',
    color: 'text-orange-600',
    filters: {
      searchQuery: 'pet',
      propertyType: 'all',
      rentalTerm: 'all',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 'all',
      verifiedOnly: false,
      superhostOnly: false
    }
  },
  {
    id: 'short-term-stays',
    name: 'Short-Term Stays',
    description: 'Flexible rentals for temporary accommodation',
    icon: Briefcase,
    category: 'popular',
    color: 'text-purple-600',
    filters: {
      searchQuery: '',
      propertyType: 'all',
      rentalTerm: 'short-term',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 'all',
      verifiedOnly: true,
      superhostOnly: false
    }
  },
  {
    id: 'shared-living',
    name: 'Shared Living',
    description: 'Rooms in shared apartments for co-living',
    icon: UsersThree,
    category: 'lifestyle',
    color: 'text-pink-600',
    filters: {
      searchQuery: 'shared room',
      propertyType: 'apartment',
      rentalTerm: 'long-term',
      minPrice: 0,
      maxPrice: 500,
      bedrooms: '1',
      verifiedOnly: false,
      superhostOnly: false
    }
  },
  {
    id: 'city-center',
    name: 'City Center',
    description: 'Properties in the heart of the city',
    icon: Buildings,
    category: 'popular',
    color: 'text-indigo-600',
    filters: {
      searchQuery: 'center downtown',
      propertyType: 'apartment',
      rentalTerm: 'all',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 'all',
      verifiedOnly: false,
      superhostOnly: false
    }
  },
  {
    id: 'countryside-retreat',
    name: 'Countryside Retreat',
    description: 'Peaceful homes away from the city hustle',
    icon: Mountains,
    category: 'lifestyle',
    color: 'text-teal-600',
    filters: {
      searchQuery: 'countryside rural',
      propertyType: 'house',
      rentalTerm: 'all',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 'all',
      verifiedOnly: false,
      superhostOnly: false
    }
  },
  {
    id: 'superhosts-only',
    name: 'Superhosts Only',
    description: 'Properties from top-rated verified landlords',
    icon: Heart,
    category: 'popular',
    color: 'text-rose-600',
    filters: {
      searchQuery: '',
      propertyType: 'all',
      rentalTerm: 'all',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 'all',
      verifiedOnly: true,
      superhostOnly: true
    }
  },
  {
    id: 'one-bedroom',
    name: 'One Bedroom',
    description: 'Perfect for singles or couples',
    icon: Bed,
    category: 'type',
    color: 'text-cyan-600',
    filters: {
      searchQuery: '',
      propertyType: 'apartment',
      rentalTerm: 'all',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: '1',
      verifiedOnly: false,
      superhostOnly: false
    }
  },
  {
    id: 'studios',
    name: 'Studios',
    description: 'Compact and efficient studio apartments',
    icon: MapPin,
    category: 'type',
    color: 'text-violet-600',
    filters: {
      searchQuery: '',
      propertyType: 'studio',
      rentalTerm: 'all',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 'all',
      verifiedOnly: false,
      superhostOnly: false
    }
  }
]

export const getPresetsByCategory = (category: FilterPreset['category']) => {
  return popularFilterPresets.filter(preset => preset.category === category)
}

export const getPresetById = (id: string) => {
  return popularFilterPresets.find(preset => preset.id === id)
}
