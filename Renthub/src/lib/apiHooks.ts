/**
 * API Hooks for RentHub
 * Custom hooks using TanStack Query for API operations
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient, { ApiResponse } from './apiClient'
import { queryKeys } from './queryClient'
import { Property, Booking, Review, Notification } from './types'

// ============================================================================
// PROPERTIES API HOOKS
// ============================================================================

export interface PropertyFilters {
  type?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  location?: string
  amenities?: string[]
  available?: boolean
  page?: number
  limit?: number
  sortBy?: 'price' | 'date' | 'popularity' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

// Get paginated properties with filters
export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: queryKeys.properties.list(filters),
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/properties', { params: filters })
      return response.data as {
        data: Property[]
        meta: {
          current_page: number
          last_page: number
          per_page: number
          total: number
        }
      }
    },
    placeholderData: (previousData) => previousData,
  })
}

// Get single property by ID
export function useProperty(id: string | number) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/properties/${id}`)
      return response.data as Property
    },
    enabled: !!id,
  })
}

// Search properties
export function usePropertySearch(query: string) {
  return useQuery({
    queryKey: queryKeys.properties.search(query),
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/properties/search', {
        params: { q: query }
      })
      return response.data as Property[]
    },
    enabled: !!query && query.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  })
}

// Get recommended properties
export function useRecommendedProperties(userId?: string) {
  return useQuery({
    queryKey: queryKeys.properties.recommended(userId),
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/properties/recommended')
      return response.data as Property[]
    },
    enabled: !!userId,
  })
}

// Get similar properties
export function useSimilarProperties(propertyId: string | number) {
  return useQuery({
    queryKey: queryKeys.properties.similar(propertyId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/properties/${propertyId}/similar`)
      return response.data as Property[]
    },
    enabled: !!propertyId,
  })
}

// Create property mutation
export function useCreateProperty() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (propertyData: Partial<Property>) => {
      const response = await apiClient.post('/api/v1/properties', propertyData)
      return response.data as Property
    },
    onSuccess: () => {
      // Invalidate properties list
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() })
    },
  })
}

// Update property mutation
export function useUpdateProperty() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Partial<Property> }) => {
      const response = await apiClient.put(`/api/v1/properties/${id}`, data)
      return response.data as Property
    },
    onSuccess: (property) => {
      // Update specific property in cache
      queryClient.setQueryData(queryKeys.properties.detail(property.id), property)
      // Invalidate properties list
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() })
    },
  })
}

// Delete property mutation
export function useDeleteProperty() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string | number) => {
      await apiClient.delete(`/api/v1/properties/${id}`)
      return id
    },
    onSuccess: (id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.properties.detail(id) })
      // Invalidate properties list
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() })
    },
  })
}

// ============================================================================
// BOOKINGS API HOOKS
// ============================================================================

// Get user bookings
export function useBookings(userId?: string) {
  return useQuery({
    queryKey: queryKeys.bookings.list(userId),
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/bookings')
      return response.data as Booking[]
    },
    enabled: !!userId,
  })
}

// Get single booking
export function useBooking(id: string | number) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/bookings/${id}`)
      return response.data as Booking
    },
    enabled: !!id,
  })
}

// Create booking mutation
export function useCreateBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (bookingData: {
      property_id: number
      start_date: string
      end_date: string
      guests: number
      message?: string
    }) => {
      const response = await apiClient.post('/api/v1/bookings', bookingData)
      return response.data as Booking
    },
    onSuccess: () => {
      // Invalidate bookings list
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() })
    },
  })
}

// Cancel booking mutation
export function useCancelBooking() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await apiClient.patch(`/api/v1/bookings/${id}/cancel`)
      return response.data as Booking
    },
    onSuccess: (booking) => {
      // Update booking in cache
      queryClient.setQueryData(queryKeys.bookings.detail(booking.id), booking)
      // Invalidate bookings list
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.lists() })
    },
  })
}

// ============================================================================
// FAVORITES API HOOKS
// ============================================================================

// Get user favorites
export function useFavorites(userId?: string) {
  return useQuery({
    queryKey: queryKeys.favorites.user(userId),
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/favorites')
      return response.data as Property[]
    },
    enabled: !!userId,
  })
}

// Toggle favorite mutation
export function useToggleFavorite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (propertyId: string | number) => {
      const response = await apiClient.post(`/api/v1/favorites/toggle`, {
        property_id: propertyId
      })
      return response.data as { isFavorite: boolean }
    },
    onSuccess: () => {
      // Invalidate favorites
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all() })
    },
  })
}

// ============================================================================
// REVIEWS API HOOKS
// ============================================================================

// Get property reviews
export function usePropertyReviews(propertyId: string | number) {
  return useQuery({
    queryKey: queryKeys.reviews.property(propertyId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/properties/${propertyId}/reviews`)
      return response.data as Review[]
    },
    enabled: !!propertyId,
  })
}

// Create review mutation
export function useCreateReview() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (reviewData: {
      property_id: number
      booking_id: number
      rating: number
      comment: string
      ratings?: {
        cleanliness: number
        location: number
        communication: number
        value: number
        accuracy: number
      }
    }) => {
      const response = await apiClient.post('/api/v1/reviews', reviewData)
      return response.data as Review
    },
    onSuccess: (review) => {
      // Invalidate property reviews
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.reviews.property(review.propertyId) 
      })
    },
  })
}

// ============================================================================
// NOTIFICATIONS API HOOKS
// ============================================================================

// Get user notifications
export function useNotifications(userId?: string) {
  return useQuery({
    queryKey: queryKeys.notifications.user(userId),
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/notifications')
      return response.data as Notification[]
    },
    enabled: !!userId,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

// Get unread notifications count
export function useUnreadNotificationsCount(userId?: string) {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(userId),
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/notifications/unread-count')
      return response.data as { count: number }
    },
    enabled: !!userId,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

// Mark notification as read
export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (notificationId: string | number) => {
      await apiClient.patch(`/api/v1/notifications/${notificationId}/read`)
    },
    onSuccess: () => {
      // Invalidate notifications
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() })
    },
  })
}

// Mark all notifications as read
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/api/v1/notifications/mark-all-read')
    },
    onSuccess: () => {
      // Invalidate notifications
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() })
    },
  })
}

// ============================================================================
// UPLOAD API HOOKS
// ============================================================================

// Upload files mutation
export function useUploadFiles() {
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`files[${index}]`, file)
      })
      
      const response = await apiClient.upload('/api/v1/uploads', formData)
      return response.data as { urls: string[] }
    },
  })
}

// ============================================================================
// ANALYTICS API HOOKS
// ============================================================================

// Get property analytics
export function usePropertyAnalytics(propertyId: string | number) {
  return useQuery({
    queryKey: queryKeys.analytics.property(propertyId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/analytics/property/${propertyId}`)
      return response.data as {
        views: number
        favorites: number
        bookings: number
        revenue: number
        viewsHistory: Array<{ date: string; views: number }>
        bookingsHistory: Array<{ date: string; bookings: number }>
      }
    },
    enabled: !!propertyId,
  })
}

export default {
  // Properties
  useProperties,
  useProperty,
  usePropertySearch,
  useRecommendedProperties,
  useSimilarProperties,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
  
  // Bookings
  useBookings,
  useBooking,
  useCreateBooking,
  useCancelBooking,
  
  // Favorites
  useFavorites,
  useToggleFavorite,
  
  // Reviews
  usePropertyReviews,
  useCreateReview,
  
  // Notifications
  useNotifications,
  useUnreadNotificationsCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  
  // Upload
  useUploadFiles,
  
  // Analytics
  usePropertyAnalytics,
}