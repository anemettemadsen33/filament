import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Property, Booking, Review, FilterState, SortOption, User, Conversation, Voucher, RoommateProfile, RoommateMatch, PropertyTour, TourAvailability, BackgroundCheckRequest, InsurancePolicy, InsuranceQuote, InsuranceClaim, SmartDevice, SmartDeviceActivity, ARSession, ChatMessage } from '@/lib/types'
import { Layout } from '@/components/Layout'
// Lazy load pages pentru performanță
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const ExplorePage = lazy(() => import('@/pages/ExplorePage').then(m => ({ default: m.ExplorePage })))
const MapViewPage = lazy(() => import('@/pages/MapViewPage').then(m => ({ default: m.MapViewPage })))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })))
const PropertyDetailsPage = lazy(() => import('@/pages/PropertyDetailsPage').then(m => ({ default: m.PropertyDetailsPage })))
const RoommatePage = lazy(() => import('@/pages/RoommatePage').then(m => ({ default: m.RoommatePage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const MessagesPage = lazy(() => import('@/pages/MessagesPage').then(m => ({ default: m.MessagesPage })))
const PhotoEnhancementDemo = lazy(() => import('@/pages/PhotoEnhancementDemo').then(m => ({ default: m.PhotoEnhancementDemo })))
const LanguagePage = lazy(() => import('@/pages/LanguagePage').then(m => ({ default: m.LanguagePage })))
const TestPage = lazy(() => import('@/pages/TestPage').then(m => ({ default: m.TestPage })))
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })))
const SafetyTipsPage = lazy(() => import('@/pages/SafetyTipsPage').then(m => ({ default: m.SafetyTipsPage })))
const FAQPage = lazy(() => import('@/pages/FAQPage').then(m => ({ default: m.FAQPage })))
const SupportPage = lazy(() => import('@/pages/SupportPage').then(m => ({ default: m.SupportPage })))
const BookingPage = lazy(() => import('@/pages/BookingPage').then(m => ({ default: m.BookingPage })))
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })))
const FilterPresetsPage = lazy(() => import('@/pages/FilterPresetsPage').then(m => ({ default: m.FilterPresetsPage })))
// Lazy load modals
const AddPropertyModal = lazy(() => import('@/components/AddPropertyModal').then(m => ({ default: m.AddPropertyModal })))
const UserProfileModal = lazy(() => import('@/components/UserProfileModal').then(m => ({ default: m.UserProfileModal })))
const PropertyDetailModal = lazy(() => import('@/components/PropertyDetailModal').then(m => ({ default: m.PropertyDetailModal })))
const PropertyImportModal = lazy(() => import('@/components/PropertyImportModal').then(m => ({ default: m.PropertyImportModal })))
import { toast } from 'sonner'
import { I18nProvider } from '@/lib/i18n/context'
import { CurrencyProvider } from '@/lib/currencyContext'
import { QueryProvider } from '@/lib/QueryProvider'
import { AuthProvider } from '@/lib/authContext'
import { SavedSearch } from '@/components/SavedSearchesPanel'
import {
  sendNewBookingEmail,
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendNewMessageEmail,
  sendNewReviewEmail
} from '@/lib/emailService'
import {
  sendNewBookingSMS,
  sendBookingConfirmationSMS,
  sendUrgentMaintenanceSMS,
  scheduleCheckInCheckOutReminders
} from '@/lib/smsService'
import { simulateDeviceControl, createActivity, generateSampleDevices } from '@/lib/smartHomeUtils'
import { generateCheckInAccessCode, getAccessCodeExpiryTime } from '@/lib/checkInUtils'
import { LockboxInfo } from '@/lib/types'

function AppContent() {
  const navigate = useNavigate()
  const [properties, setProperties] = useLocalStorage<Property[]>('properties', [])
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', [])
  const [bookings, setBookings] = useLocalStorage<Booking[]>('bookings', [])
  const [reviews, setReviews] = useLocalStorage<Review[]>('reviews', [])
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null)
  const [compareList, setCompareList] = useLocalStorage<string[]>('compareList', [])
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>('recentlyViewed', [])
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('savedSearches', [])
  const [conversations, setConversations] = useLocalStorage<Conversation[]>('conversations', [])
  const [vouchers, setVouchers] = useLocalStorage<Voucher[]>('vouchers', [])
  const [analytics, setAnalytics] = useLocalStorage<Record<string, any>>('analytics', {})
  const [roommateProfiles, setRoommateProfiles] = useLocalStorage<RoommateProfile[]>('roommateProfiles', [])
  const [roommateMatches, setRoommateMatches] = useLocalStorage<RoommateMatch[]>('roommateMatches', [])
  const [propertyTours, setPropertyTours] = useLocalStorage<PropertyTour[]>('propertyTours', [])
  const [tourAvailability, setTourAvailability] = useLocalStorage<Record<string, TourAvailability>>('tourAvailability', {})
  const [backgroundChecks, setBackgroundChecks] = useLocalStorage<BackgroundCheckRequest[]>('backgroundChecks', [])
  const [insurancePolicies, setInsurancePolicies] = useLocalStorage<InsurancePolicy[]>('insurancePolicies', [])
  const [insuranceQuotes, setInsuranceQuotes] = useLocalStorage<InsuranceQuote[]>('insuranceQuotes', [])
  const [insuranceClaims, setInsuranceClaims] = useLocalStorage<InsuranceClaim[]>('insuranceClaims', [])
  const [smartDevices, setSmartDevices] = useLocalStorage<SmartDevice[]>('smartDevices', [])
  const [deviceActivities, setDeviceActivities] = useLocalStorage<SmartDeviceActivity[]>('deviceActivities', [])
  const [arSessions, setArSessions] = useLocalStorage<ARSession[]>('arSessions', [])
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('messages', [])
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    propertyType: 'all',
    rentalTerm: 'all',
    minPrice: 0,
    maxPrice: 10000,
    bedrooms: 'all',
    verifiedOnly: false,
    superhostOnly: false
  })
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [aiSearchResults, setAiSearchResults] = useState<Property[] | null>(null)
  
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showPropertyDetail, setShowPropertyDetail] = useState(false)

  // Lazy load seed data doar dacă nu avem properties
  useEffect(() => {
    if (!properties || properties.length === 0) {
      import('@/lib/seedData').then(module => {
        setProperties(module.sampleProperties)
      })
    }
  }, [])

  const onPropertySelect = (propertyId: string) => {
    const property = properties?.find(p => p.id === propertyId)
    if (property) {
      handlePropertyClick(property)
      handleViewProperty(property)
    }
  }

  useEffect(() => {
    if (currentUser && !currentUser.preferences) {
      setCurrentUser((prev) => prev ? {
        ...prev,
        preferences: {
          rentalTerm: 'all',
          priceRange: { min: 0, max: 10000 },
          propertyType: 'all',
          bedrooms: 'all'
        }
      } : null)
    }
  }, [currentUser, setCurrentUser])

  useEffect(() => {
    if (currentUser?.preferences) {
      setFilters((prev) => ({
        ...prev,
        rentalTerm: currentUser.preferences?.rentalTerm || 'all',
        propertyType: currentUser.preferences?.propertyType || 'all',
        minPrice: currentUser.preferences?.priceRange?.min || 0,
        maxPrice: currentUser.preferences?.priceRange?.max || 10000,
        bedrooms: currentUser.preferences?.bedrooms || 'all'
      }))
    }
  }, [currentUser?.preferences])

  useEffect(() => {
    if (properties && properties.length > 0 && (!smartDevices || smartDevices.length === 0)) {
      const sampleDevices = properties.slice(0, 2).flatMap(property => 
        generateSampleDevices(property.id)
      )
      if (sampleDevices.length > 0) {
        setSmartDevices(() => sampleDevices)
      }
    }
  }, [properties, smartDevices, setSmartDevices])

  const handleSignIn = async () => {
    try {
      // Mock user data (Spark removed)
      const newUser: User = {
        id: `user-${Date.now()}`,
        login: 'Demo User',
        email: 'demo@renthub.com',
        avatarUrl: '',
        isOwner: false,
        createdAt: Date.now(),
        preferences: currentUser?.preferences
      }
      setCurrentUser(() => newUser)
      toast.success(`Welcome back, ${newUser.login}!`)
    } catch (error) {
      console.error('Sign in failed:', error)
      toast.error('Failed to sign in. Please try again.')
    }
  }

  const handleSignOut = () => {
    setCurrentUser(() => null)
    toast.success('Signed out successfully')
  }

  const handleToggleFavorite = (id: string) => {
    setFavorites((current) => {
      const isFavorite = (current || []).includes(id)
      if (isFavorite) {
        return (current || []).filter(fav => fav !== id)
      } else {
        return [...(current || []), id]
      }
    })
  }

  const handleToggleCompare = (id: string) => {
    setCompareList((current) => {
      const inList = (current || []).includes(id)
      if (inList) {
        return (current || []).filter(item => item !== id)
      } else {
        if ((current || []).length >= 3) {
          toast.error('You can compare up to 3 properties at a time')
          return current || []
        }
        return [...(current || []), id]
      }
    })
  }

  const handleRemoveFromCompare = (id: string) => {
    setCompareList((current) => (current || []).filter(item => item !== id))
  }

  const handleAddProperty = (property: Property) => {
    setProperties((current) => [property, ...(current || [])])
    setShowAddPropertyModal(false)
    toast.success('Property added successfully!')
  }

  const handleImportProperties = (importedProperties: Property[]) => {
    setProperties((current) => [...importedProperties, ...(current || [])])
    setShowImportModal(false)
    toast.success(`Successfully imported ${importedProperties.length} properties!`)
  }

  const handleAddBooking = (booking: Booking) => {
    setBookings((current) => [booking, ...(current || [])])
    
    const property = properties?.find(p => p.id === booking.propertyId)
    if (property && currentUser) {
      sendBookingConfirmationEmail(booking, property, currentUser)
      sendBookingConfirmationSMS(booking, property, currentUser)
      
      scheduleCheckInCheckOutReminders(booking, property, currentUser)
      
      if (property.landlord && property.landlord.id !== currentUser.id) {
        const landlordUser: User = {
          id: property.landlord.id,
          login: property.landlord.name,
          email: property.landlord.email || '',
          phone: property.landlord.phone || '',
          avatarUrl: property.landlord.avatar || '',
          isOwner: false,
          createdAt: Date.now()
        }
        sendNewBookingEmail(booking, property, landlordUser)
        sendNewBookingSMS(booking, property, landlordUser)
      }
    }
  }

  const handleAddReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    }
    setReviews((current) => [newReview, ...(current || [])])
    toast.success('Review submitted successfully!')
    
    const property = properties?.find(p => p.id === review.propertyId)
    if (property && property.landlord) {
      const landlordUser: User = {
        id: property.landlord.id,
        login: property.landlord.name,
        email: property.landlord.email || '',
        avatarUrl: property.landlord.avatar || '',
        isOwner: false,
        createdAt: Date.now()
      }
      sendNewReviewEmail(newReview, property, landlordUser)
    }
  }

  const handleVoteReview = (reviewId: string, voteType: 'up' | 'down') => {
    if (!currentUser) {
      toast.error('Please sign in to vote')
      return
    }

    setReviews((current) => 
      (current || []).map(review => {
        if (review.id !== reviewId) return review
        
        const votedBy = review.votedBy || []
        const hasVoted = votedBy.includes(currentUser.id)
        
        if (hasVoted) {
          toast.info('You have already voted on this review')
          return review
        }

        const helpfulVotes = review.helpfulVotes || { up: 0, down: 0 }
        
        return {
          ...review,
          helpfulVotes: {
            ...helpfulVotes,
            [voteType]: helpfulVotes[voteType] + 1
          },
          votedBy: [...votedBy, currentUser.id]
        }
      })
    )
    toast.success('Vote recorded')
  }

  const handleRespondToReview = (reviewId: string, response: string) => {
    if (!currentUser) {
      toast.error('Please sign in to respond')
      return
    }

    setReviews((current) =>
      (current || []).map(review => {
        if (review.id !== reviewId) return review
        
        return {
          ...review,
          landlordResponse: {
            message: response,
            createdAt: Date.now(),
            responderId: currentUser.id
          }
        }
      })
    )
    toast.success('Response posted successfully')
  }

  const handleUpdateUserPreferences = (preferences: User['preferences']) => {
    if (!currentUser) return
    setCurrentUser(() => ({ ...currentUser, preferences }))
    toast.success('Preferences updated successfully')
  }

  const handlePropertyClick = (property: Property) => {
    if (!recentlyViewed?.includes(property.id)) {
      setRecentlyViewed((current) => [property.id, ...(current || [])].slice(0, 10))
    }
    
    setAnalytics((current) => ({
      ...(current || {}),
      [property.id]: {
        ...(current?.[property.id] || {}),
        views: ((current?.[property.id]?.views || 0) + 1),
        lastViewed: Date.now()
      }
    }))
  }

  const handleClearRecentlyViewed = () => {
    setRecentlyViewed(() => [])
    toast.success('Recently viewed cleared')
  }

  const handleSaveSearch = (search: Omit<SavedSearch, 'id' | 'createdAt'>) => {
    const newSearch: SavedSearch = {
      ...search,
      id: `search-${Date.now()}`,
      createdAt: Date.now()
    }
    setSavedSearches((current) => [newSearch, ...(current || [])])
    toast.success('Search saved successfully')
  }

  const handleUpdateSearch = (searchId: string, updates: Partial<SavedSearch>) => {
    setSavedSearches((current) =>
      (current || []).map(s => s.id === searchId ? { ...s, ...updates } : s)
    )
  }

  const handleDeleteSearch = (id: string) => {
    setSavedSearches((current) => (current || []).filter(s => s.id !== id))
    toast.success('Saved search deleted')
  }

  const handleLoadSearch = (searchFilters: FilterState) => {
    setFilters(searchFilters)
    toast.success('Search filters applied')
  }

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      propertyType: 'all',
      rentalTerm: 'all',
      minPrice: 0,
      maxPrice: 10000,
      bedrooms: 'all',
      verifiedOnly: false,
      superhostOnly: false
    })
    setAiSearchResults(null)
  }

  const handleAISearchResults = (results: Property[]) => {
    setAiSearchResults(results)
  }

  const handleClearAISearch = () => {
    setAiSearchResults(null)
  }

  const handleCreateRoommateProfile = (profileData: Omit<RoommateProfile, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt' | 'lastActive'>) => {
    if (!currentUser) {
      toast.error('Please sign in to create a profile')
      return
    }

    const newProfile: RoommateProfile = {
      ...profileData,
      id: `roommate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      userName: currentUser.login,
      userAvatar: currentUser.avatarUrl,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastActive: Date.now()
    }

    setRoommateProfiles((current) => [newProfile, ...(current || [])])
    toast.success('Roommate profile created successfully!')
  }

  const handleUpdateRoommateProfile = (profileData: Omit<RoommateProfile, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt' | 'lastActive'>) => {
    if (!currentUser) {
      toast.error('Please sign in to update your profile')
      return
    }

    setRoommateProfiles((current) => 
      (current || []).map(profile => 
        profile.userId === currentUser.id
          ? {
              ...profile,
              ...profileData,
              updatedAt: Date.now(),
              lastActive: Date.now()
            }
          : profile
      )
    )
    toast.success('Profile updated successfully!')
  }

  const handleLikeRoommateProfile = (profileId: string) => {
    if (!currentUser) {
      toast.error('Please sign in to like profiles')
      return
    }

    const myProfile = roommateProfiles?.find(p => p.userId === currentUser.id)
    if (!myProfile) {
      toast.error('Create a profile first to like others')
      return
    }

    const existingMatch = roommateMatches?.find(
      m => m.profileId === myProfile.id && m.matchedProfileId === profileId
    )

    if (existingMatch) {
      toast.info('You already interacted with this profile')
      return
    }

    const likedProfile = roommateProfiles?.find(p => p.id === profileId)
    if (!likedProfile) return

    const reverseMatch = roommateMatches?.find(
      m => m.profileId === profileId && m.matchedProfileId === myProfile.id && m.status === 'liked'
    )

    const newMatch: RoommateMatch = {
      id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      profileId: myProfile.id,
      matchedProfileId: profileId,
      status: reverseMatch ? 'mutual' : 'liked',
      createdAt: Date.now(),
      likedByUser: true,
      matchScore: Math.floor(Math.random() * 30) + 70
    }

    setRoommateMatches((current) => {
      const updated = [newMatch, ...(current || [])]
      if (reverseMatch) {
        return updated.map(m => 
          m.id === reverseMatch.id ? { ...m, status: 'mutual' as const } : m
        )
      }
      return updated
    })

    if (reverseMatch) {
      toast.success("It's a match! 🎉")
    }
  }

  const handlePassRoommateProfile = (profileId: string) => {
    if (!currentUser) return

    const myProfile = roommateProfiles?.find(p => p.userId === currentUser.id)
    if (!myProfile) return

    const newMatch: RoommateMatch = {
      id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      profileId: myProfile.id,
      matchedProfileId: profileId,
      status: 'declined',
      createdAt: Date.now(),
      likedByUser: false
    }

    setRoommateMatches((current) => [newMatch, ...(current || [])])
  }

  const handleStartRoommateConversation = (matchId: string) => {
    const match = roommateMatches?.find(m => m.id === matchId)
    if (!match || !currentUser) return

    const matchedProfile = roommateProfiles?.find(p => p.id === match.matchedProfileId)
    if (!matchedProfile) return

    const existingConversation = conversations?.find(c => 
      c.participants.some(p => p.userId === matchedProfile.userId)
    )

    if (existingConversation) {
      toast.info('Conversation already exists')
      return
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      propertyId: 'roommate-matching',
      propertyTitle: `Chat with ${matchedProfile.userName}`,
      participants: [
        {
          userId: currentUser.id,
          userName: currentUser.login,
          userAvatar: currentUser.avatarUrl,
          userEmail: currentUser.email,
          isOwner: false
        },
        {
          userId: matchedProfile.userId,
          userName: matchedProfile.userName,
          userAvatar: matchedProfile.userAvatar,
          userEmail: '',
          isOwner: false
        }
      ],
      lastMessage: '',
      unreadCount: 0,
      createdAt: Date.now()
    }

    setConversations((current) => [newConversation, ...(current || [])])
    toast.success('Conversation started!')
  }

  const handleStartConversation = (propertyId: string, initialMessage: string) => {
    if (!currentUser) {
      toast.error('Please sign in to send messages')
      return
    }

    const property = properties?.find(p => p.id === propertyId)
    if (!property) return

    const existingConversation = conversations?.find(c => c.propertyId === propertyId)

    if (existingConversation) {
      toast.info('Conversation already exists')
      return
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      propertyId: propertyId,
      propertyTitle: property.title,
      participants: [
        {
          userId: currentUser.id,
          userName: currentUser.login,
          userAvatar: currentUser.avatarUrl,
          userEmail: currentUser.email,
          isOwner: false
        },
        {
          userId: property.landlord?.id || 'owner',
          userName: property.landlord?.name || property.ownerName || 'Property Owner',
          userAvatar: property.landlord?.avatar || '',
          userEmail: property.landlord?.email || property.ownerEmail || '',
          isOwner: true
        }
      ],
      lastMessage: initialMessage,
      unreadCount: 0,
      createdAt: Date.now()
    }

    setConversations((current) => [newConversation, ...(current || [])])
    toast.success('Message sent successfully!')
    
    if (property.landlord?.email) {
      const recipientEmail = property.landlord.email
      const recipientUserId = property.landlord.id
      const recipientName = property.landlord.name
      
      sendNewMessageEmail(
        newConversation,
        currentUser.login,
        initialMessage,
        recipientEmail,
        recipientUserId,
        recipientName
      )
    }
  }

  const handleApplyVoucher = (voucherId: string, userId: string) => {
    setVouchers((current) =>
      (current || []).map(v =>
        v.id === voucherId
          ? {
              ...v,
              currentUses: (v.currentUses || 0) + 1,
              usedBy: [...(v.usedBy || []), userId]
            }
          : v
      )
    )
  }

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property)
    setShowPropertyDetail(true)
  }

  const handleDeleteProperty = (id: string) => {
    setProperties((current) => (current || []).filter(p => p.id !== id))
    toast.success('Property deleted successfully')
  }

  const handleTogglePropertyAvailability = (id: string) => {
    setProperties((current) =>
      (current || []).map(p =>
        p.id === id ? { ...p, available: !p.available } : p
      )
    )
    toast.success('Property availability updated')
  }

  const handleCancelBooking = (id: string) => {
    const booking = bookings?.find(b => b.id === id)
    setBookings((current) =>
      (current || []).map(b =>
        b.id === id ? { ...b, status: 'cancelled' as const } : b
      )
    )
    toast.success('Booking cancelled successfully')
    
    if (booking && currentUser) {
      const property = properties?.find(p => p.id === booking.propertyId)
      if (property) {
        sendBookingCancellationEmail(booking, property, currentUser)
      }
    }
  }

  const handleDeleteReview = (id: string) => {
    setReviews((current) => (current || []).filter(r => r.id !== id))
    toast.success('Review deleted successfully')
  }

  const handleUpdatePropertyAvailability = (propertyId: string, blockedDates: number[]) => {
    setProperties((current) =>
      (current || []).map(p =>
        p.id === propertyId ? { ...p, blockedDates } : p
      )
    )
    toast.success('Availability calendar updated')
  }

  const handleRequestTour = (tour: Omit<PropertyTour, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) {
      toast.error('Please sign in to request a tour')
      return
    }

    const newTour: PropertyTour = {
      ...tour,
      id: `tour-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setPropertyTours((current) => [newTour, ...(current || [])])
    toast.success('Tour request submitted!')
  }

  const handleConfirmTour = (tourId: string, confirmedDate: number) => {
    setPropertyTours((current) =>
      (current || []).map(t =>
        t.id === tourId
          ? {
              ...t,
              status: 'confirmed' as const,
              confirmedDate,
              confirmedAt: Date.now(),
              updatedAt: Date.now()
            }
          : t
      )
    )
    toast.success('Tour confirmed!')
  }

  const handleRejectTour = (tourId: string, reason: string) => {
    setPropertyTours((current) =>
      (current || []).map(t =>
        t.id === tourId
          ? {
              ...t,
              status: 'rejected' as const,
              rejectionReason: reason,
              updatedAt: Date.now()
            }
          : t
      )
    )
    toast.success('Tour rejected')
  }

  const handleCancelTour = (tourId: string, reason: string) => {
    setPropertyTours((current) =>
      (current || []).map(t =>
        t.id === tourId
          ? {
              ...t,
              status: 'cancelled' as const,
              cancellationReason: reason,
              cancelledAt: Date.now(),
              updatedAt: Date.now()
            }
          : t
      )
    )
    toast.success('Tour cancelled')
  }

  const handleCompleteTour = (tourId: string) => {
    setPropertyTours((current) =>
      (current || []).map(t =>
        t.id === tourId
          ? {
              ...t,
              status: 'completed' as const,
              completedAt: Date.now(),
              updatedAt: Date.now()
            }
          : t
      )
    )
    toast.success('Tour marked as completed')
  }

  const handlePayForTour = (tourId: string, paymentType: 'deposit' | 'full', paymentDetails: any) => {
    const tour = propertyTours?.find(t => t.id === tourId)
    if (!tour) return

    const paymentAmount = paymentType === 'deposit' ? tour.depositAmount : tour.fullPaymentAmount

    setPropertyTours((current) =>
      (current || []).map(t =>
        t.id === tourId
          ? {
              ...t,
              status: 'pending' as const,
              paymentStatus: paymentType === 'deposit' ? 'deposit_paid' as const : 'full_payment' as const,
              paidAmount: paymentAmount,
              paymentDate: paymentDetails.paymentDate,
              paymentMethod: paymentDetails.paymentMethod,
              transactionId: paymentDetails.transactionId,
              updatedAt: Date.now()
            }
          : t
      )
    )
    toast.success('Payment submitted successfully!')
  }

  const handleSaveTourAvailability = (availability: TourAvailability) => {
    setTourAvailability((current) => ({
      ...(current || {}),
      [availability.propertyId]: availability
    }))
    toast.success('Tour availability settings saved!')
  }

  const handleRequestBackgroundCheck = async (request: Omit<BackgroundCheckRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCheck: BackgroundCheckRequest = {
      ...request,
      id: `bg-check-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    setBackgroundChecks((current) => [newCheck, ...(current || [])])
    toast.success('Background check request submitted!')
    
    setTimeout(async () => {
      setBackgroundChecks((current) =>
        (current || []).map(c =>
          c.id === newCheck.id ? { ...c, status: 'processing' as const, updatedAt: Date.now() } : c
        )
      )
      
      const { simulateBackgroundCheck } = await import('@/lib/backgroundCheckUtils')
      const results = await simulateBackgroundCheck(newCheck)
      
      setBackgroundChecks((current) =>
        (current || []).map(c =>
          c.id === newCheck.id
            ? {
                ...c,
                status: 'completed' as const,
                results,
                completedAt: Date.now(),
                updatedAt: Date.now()
              }
            : c
        )
      )
      
      toast.success('Background check completed!')
    }, 5000)
  }

  const handleAcceptInsuranceQuote = (quote: InsuranceQuote) => {
    setInsuranceQuotes((current) => [quote, ...(current || [])])
  }

  const handleViewInsurancePolicy = (policy: InsurancePolicy) => {
    toast.info('Policy details coming soon')
  }

  const handleViewInsuranceClaim = (claim: InsuranceClaim) => {
    toast.info('Claim details coming soon')
  }

  const handleFileInsuranceClaim = () => {
    toast.info('Claims filing coming soon')
  }

  const handleUpdateSmartDevice = (device: SmartDevice) => {
    setSmartDevices((current) =>
      (current || []).map(d => d.id === device.id ? device : d)
    )
  }

  const handleAddSmartDevice = (deviceData: Omit<SmartDevice, 'id' | 'lastUpdated' | 'installedAt'>) => {
    const newDevice: SmartDevice = {
      ...deviceData,
      id: `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: Date.now(),
      installedAt: Date.now()
    }
    setSmartDevices((current) => [newDevice, ...(current || [])])
    toast.success('Smart device added successfully!')
  }

  const handleRemoveSmartDevice = (deviceId: string) => {
    setSmartDevices((current) => (current || []).filter(d => d.id !== deviceId))
    toast.success('Smart device removed')
  }

  const handleSmartDeviceAction = async (deviceId: string, action: string, value?: any) => {
    const device = smartDevices?.find(d => d.id === deviceId)
    if (!device) return

    try {
      const previousState = { ...device.state }
      const updatedDevice = await simulateDeviceControl(device, action, value)
      
      setSmartDevices((current) =>
        (current || []).map(d => d.id === deviceId ? updatedDevice : d)
      )

      const activity = createActivity(
        updatedDevice,
        action,
        previousState,
        updatedDevice.state,
        currentUser?.id,
        currentUser?.login
      )
      
      setDeviceActivities((current) => [activity, ...(current || [])].slice(0, 100))
      
      toast.success(`Device ${action} successful`)
    } catch (error) {
      toast.error('Failed to control device')
    }
  }

  const handleSaveARSession = (session: ARSession) => {
    setArSessions((current) => [session, ...(current || [])])
    toast.success('AR session saved successfully')
  }

  const handleDeleteARSession = (sessionId: string) => {
    setArSessions((current) => (current || []).filter(s => s.id !== sessionId))
    toast.success('AR session deleted')
  }

  const handleGenerateAccessCode = (bookingId: string) => {
    const booking = bookings?.find(b => b.id === bookingId)
    if (!booking) return

    const property = properties?.find(p => p.id === booking.propertyId)
    if (!property || !property.lockbox?.enabled) {
      toast.error('Self check-in not available for this property')
      return
    }

    try {
      const accessCode = generateCheckInAccessCode(booking, property)
      const expiresAt = getAccessCodeExpiryTime(booking, property)

      setBookings((current) =>
        (current || []).map(b =>
          b.id === bookingId
            ? {
                ...b,
                checkInInfo: {
                  ...b.checkInInfo,
                  accessCode,
                  accessCodeGeneratedAt: Date.now(),
                  checkInMethod: 'self'
                }
              }
            : b
        )
      )

      toast.success('Access code generated successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate access code')
    }
  }

  const handleCompleteCheckIn = (bookingId: string) => {
    setBookings((current) =>
      (current || []).map(b =>
        b.id === bookingId
          ? {
              ...b,
              checkInInfo: {
                ...b.checkInInfo,
                checkInCompletedAt: Date.now()
              }
            }
          : b
      )
    )
  }

  const handleSaveLockboxSettings = (propertyId: string, lockboxInfo: LockboxInfo) => {
    setProperties((current) =>
      (current || []).map(p =>
        p.id === propertyId ? { ...p, lockbox: lockboxInfo } : p
      )
    )
    toast.success('Lockbox settings saved successfully!')
  }

  const handleSendMessage = (conversationId: string, message: string, aiMessage?: ChatMessage) => {
    if (!currentUser) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.login,
      senderAvatar: currentUser.avatarUrl,
      message,
      timestamp: Date.now(),
      read: false
    }

    setMessages((current) => [newMessage, ...(current || [])])

    if (aiMessage) {
      setMessages((current) => [aiMessage, ...(current || [])])
    }

    setConversations((current) =>
      (current || []).map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: message, lastMessageTime: Date.now() }
          : c
      )
    )
  }

  const handleMarkAsRead = (conversationId: string) => {
    setConversations((current) =>
      (current || []).map(c =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    )
  }

  const handleRequestAgent = (conversationId: string) => {
    setConversations((current) =>
      (current || []).map(c =>
        c.id === conversationId ? { ...c, agentRequested: true } : c
      )
    )
    toast.success('Agent requested - a human representative will join shortly')
  }

  return (
    <>
      <Layout
        currentUser={currentUser || null}
        favorites={favorites || []}
        properties={properties || []}
        conversations={conversations || []}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenDashboard={() => navigate('/dashboard')}
        onOpenAddProperty={() => setShowAddPropertyModal(true)}
        onOpenImportProperties={() => setShowImportModal(true)}
        onOpenMessages={() => {}}
        onPropertySelect={onPropertySelect}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  properties={aiSearchResults || properties || []}
                  favorites={favorites || []}
                  filters={filters}
                  sortBy={sortBy}
                  showFavoritesOnly={showFavoritesOnly}
                  compareList={compareList || []}
                  recentlyViewed={recentlyViewed || []}
                  savedSearches={savedSearches || []}
                  analytics={analytics || {}}
                  user={currentUser}
                  onFiltersChange={setFilters}
                  onSortChange={setSortBy}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  onRemoveFromCompare={handleRemoveFromCompare}
                  onSetShowFavoritesOnly={setShowFavoritesOnly}
                  onClearRecentlyViewed={handleClearRecentlyViewed}
                  onSaveSearch={handleSaveSearch}
                  onUpdateSearch={handleUpdateSearch}
                  onDeleteSearch={handleDeleteSearch}
                  onLoadSearch={handleLoadSearch}
                  onResetFilters={handleResetFilters}
                  onPropertyClick={handlePropertyClick}
                  onAISearchResults={handleAISearchResults}
                  onClearAISearch={handleClearAISearch}
                />
              }
            />
            <Route
              path="/explore"
              element={
                <ExplorePage
                  properties={properties || []}
                  favorites={favorites || []}
                  compareList={compareList || []}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  onPropertyClick={handlePropertyClick}
                />
              }
            />
            <Route
              path="/map"
              element={
                <MapViewPage
                  properties={properties || []}
                  favorites={favorites || []}
                  filters={filters}
                  compareList={compareList || []}
                  onFiltersChange={setFilters}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  onPropertyClick={handlePropertyClick}
                />
              }
            />
            <Route
              path="/favorites"
              element={
                <FavoritesPage
                  properties={properties || []}
                  favorites={favorites || []}
                  compareList={compareList || []}
                  sortBy={sortBy}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  onSortChange={setSortBy}
                  onPropertyClick={handlePropertyClick}
                />
              }
            />
            {currentUser && (
              <Route
                path="/dashboard"
                element={
                  <DashboardPage
                    user={currentUser}
                    properties={properties || []}
                    bookings={bookings || []}
                    reviews={reviews || []}
                    analytics={analytics || {}}
                    favorites={favorites || []}
                    vouchers={vouchers || []}
                    backgroundChecks={backgroundChecks || []}
                    insurancePolicies={insurancePolicies || []}
                    insuranceQuotes={insuranceQuotes || []}
                    insuranceClaims={insuranceClaims || []}
                    smartDevices={smartDevices || []}
                    deviceActivities={deviceActivities || []}
                    arSessions={arSessions || []}
                    onViewProperty={handleViewProperty}
                    onDeleteProperty={handleDeleteProperty}
                    onTogglePropertyAvailability={handleTogglePropertyAvailability}
                    onCancelBooking={handleCancelBooking}
                    onDeleteReview={handleDeleteReview}
                    onUpdatePropertyAvailability={handleUpdatePropertyAvailability}
                    onRequestBackgroundCheck={handleRequestBackgroundCheck}
                    onAcceptInsuranceQuote={handleAcceptInsuranceQuote}
                    onViewInsurancePolicy={handleViewInsurancePolicy}
                    onViewInsuranceClaim={handleViewInsuranceClaim}
                    onFileInsuranceClaim={handleFileInsuranceClaim}
                    onUpdateSmartDevice={handleUpdateSmartDevice}
                    onAddSmartDevice={handleAddSmartDevice}
                    onRemoveSmartDevice={handleRemoveSmartDevice}
                    onSmartDeviceAction={handleSmartDeviceAction}
                    onDeleteARSession={handleDeleteARSession}
                    onGenerateAccessCode={handleGenerateAccessCode}
                    onCompleteCheckIn={handleCompleteCheckIn}
                    onSaveLockboxSettings={handleSaveLockboxSettings}
                  />
                }
              />
            )}
            <Route
              path="/photo-enhancement"
              element={<PhotoEnhancementDemo />}
            />
            <Route
              path="/property/:id"
              element={
                <PropertyDetailsPage
                  properties={properties || []}
                  favorites={favorites || []}
                  reviews={reviews || []}
                  analytics={analytics || {}}
                  compareList={compareList || []}
                  currentUser={currentUser || null}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  onAddReview={handleAddReview}
                  onVoteReview={handleVoteReview}
                  onRespondToReview={handleRespondToReview}
                  onContactRequest={() => {}}
                  onBookProperty={handleAddBooking}
                  onTrackView={(propertyId: string) => {
                    const property = properties?.find(p => p.id === propertyId)
                    if (property) handlePropertyClick(property)
                  }}
                  onSaveARSession={handleSaveARSession}
                />
              }
            />
            <Route
              path="/roommates"
              element={
                <RoommatePage
                  profiles={roommateProfiles || []}
                  currentUser={currentUser || null}
                  myProfile={roommateProfiles?.find(p => p.userId === currentUser?.id)}
                  matches={roommateMatches || []}
                  onCreateProfile={handleCreateRoommateProfile}
                  onUpdateProfile={handleUpdateRoommateProfile}
                  onLikeProfile={handleLikeRoommateProfile}
                  onPassProfile={handlePassRoommateProfile}
                  onStartConversation={handleStartRoommateConversation}
                />
              }
            />
            <Route
              path="/booking/:id"
              element={
                <BookingPage
                  properties={properties || []}
                  currentUser={currentUser || null}
                  vouchers={vouchers || []}
                  onBook={handleAddBooking}
                  onApplyVoucher={handleApplyVoucher}
                />
              }
            />
            <Route
              path="/contact/:id"
              element={
                <ContactPage
                  properties={properties || []}
                  currentUser={currentUser || null}
                  onStartConversation={handleStartConversation}
                />
              }
            />
            {currentUser && (
              <Route
                path="/messages"
                element={
                  <MessagesPage
                    currentUser={currentUser}
                    conversations={conversations || []}
                    messages={messages || []}
                    onSendMessage={handleSendMessage}
                    onMarkAsRead={handleMarkAsRead}
                    onRequestAgent={handleRequestAgent}
                  />
                }
              />
            )}
            <Route 
              path="/filter-presets" 
              element={<FilterPresetsPage onApplyPreset={(filters) => {
                setFilters(filters)
              }} />} 
            />
            <Route path="/language" element={<LanguagePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/safety-tips" element={<SafetyTipsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>

      <Suspense fallback={null}>
        <AddPropertyModal
          open={showAddPropertyModal}
          onClose={() => setShowAddPropertyModal(false)}
          onAdd={handleAddProperty}
        />

        <PropertyImportModal
          open={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportProperties}
        />

        {currentUser && (
          <UserProfileModal
            open={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            user={currentUser}
            onUpdatePreferences={handleUpdateUserPreferences}
          />
        )}

        {selectedProperty && (
          <PropertyDetailModal
            property={selectedProperty}
            open={showPropertyDetail}
            onClose={() => {
              setShowPropertyDetail(false)
              setSelectedProperty(null)
            }}
            isFavorite={favorites?.includes(selectedProperty.id) || false}
            reviews={reviews?.filter(r => r.propertyId === selectedProperty.id) || []}
            analytics={analytics?.[selectedProperty.id]}
            allProperties={properties || []}
            currentUser={currentUser || null}
            onToggleFavorite={handleToggleFavorite}
            onAddReview={handleAddReview}
            onVoteReview={handleVoteReview}
            onRespondToReview={handleRespondToReview}
            onContactRequest={() => {}}
            onBookProperty={handleAddBooking}
            onStartConversation={handleStartConversation}
            onSaveARSession={handleSaveARSession}
          />
        )}
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <I18nProvider>
            <CurrencyProvider>
              <AppContent />
            </CurrencyProvider>
          </I18nProvider>
        </Router>
      </AuthProvider>
    </QueryProvider>
  )
}

