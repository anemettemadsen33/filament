/**
 * Authentication Context for RentHub
 * Manages user authentication state with Laravel Sanctum
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient, { ApiResponse } from './apiClient'
import { queryKeys } from './queryClient'
import config from './config'

// User type definition
export interface User {
  id: number
  name: string
  email: string
  email_verified_at?: string
  avatar?: string
  phone?: string
  role: 'tenant' | 'landlord' | 'admin'
  preferences?: {
    language: string
    currency: string
    notifications: boolean
    theme: 'light' | 'dark' | 'system'
  }
  profile?: {
    bio?: string
    location?: string
    verified: boolean
    rating?: number
    reviews_count?: number
  }
  created_at: string
  updated_at: string
}

// Login credentials
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

// Registration data
export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role?: 'tenant' | 'landlord'
  phone?: string
}

// Auth context type
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isError: boolean
  error: any
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refetchUser: () => void
  updateUser: (data: Partial<User>) => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const queryClient = useQueryClient()

  // Query for current user
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      try {
        const response = await apiClient.getUser()
        return response.data as User
      } catch (error) {
        // If user is not authenticated, return null
        if (error && typeof error === 'object' && 'status' in error) {
          if ((error as any).status === 401) {
            return null
          }
        }
        throw error
      }
    },
    enabled: !!apiClient.getToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.login(credentials)
      return response.data as { user: User; token: string }
    },
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user)
      // Trigger user refetch to ensure fresh data
      refetchUser()
    },
    onError: (error) => {
      console.error('Login failed:', error)
      // Clear any existing auth data
      apiClient.clearToken()
      queryClient.removeQueries({ queryKey: queryKeys.auth.user() })
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.register(data)
      return response.data as { user: User; token?: string }
    },
    onSuccess: (data) => {
      // If token is provided, set it
      if (data.token) {
        queryClient.setQueryData(queryKeys.auth.user(), data.user)
        refetchUser()
      }
    },
    onError: (error) => {
      console.error('Registration failed:', error)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.logout()
    },
    onSuccess: () => {
      // Clear all auth-related data
      queryClient.removeQueries({ queryKey: queryKeys.auth.user() })
      queryClient.removeQueries({ queryKey: queryKeys.favorites.all() })
      queryClient.removeQueries({ queryKey: queryKeys.bookings.all() })
      queryClient.removeQueries({ queryKey: queryKeys.notifications.all() })
      // Optionally clear entire cache
      // queryClient.clear()
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Still clear local data even if API call fails
      apiClient.clearToken()
      queryClient.removeQueries({ queryKey: queryKeys.auth.user() })
    },
  })

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiClient.put('/api/v1/auth/profile', data)
      return response.data as User
    },
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.setQueryData(queryKeys.auth.user(), updatedUser)
    },
    onError: (error) => {
      console.error('User update failed:', error)
    },
  })

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = apiClient.getToken()
      
      if (token) {
        // If we have a token, try to fetch user data
        try {
          await refetchUser()
        } catch (error) {
          // If token is invalid, clear it
          console.warn('Invalid token detected, clearing auth state')
          apiClient.clearToken()
        }
      }
      
      setIsInitialized(true)
    }

    initializeAuth()
  }, [refetchUser])

  // Listen for auth events
  useEffect(() => {
    const handleAuthLogout = () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.user() })
    }

    window.addEventListener('auth:logout', handleAuthLogout)
    
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout)
    }
  }, [queryClient])

  // Auth context value
  const contextValue: AuthContextType = {
    user: user || null,
    isAuthenticated: !!user && !!apiClient.getToken(),
    isLoading: !isInitialized || isUserLoading || loginMutation.isPending || registerMutation.isPending,
    isError: isUserError && !!apiClient.getToken(),
    error: userError,
    login: async (credentials: LoginCredentials) => {
      await loginMutation.mutateAsync(credentials)
    },
    register: async (data: RegisterData) => {
      await registerMutation.mutateAsync(data)
    },
    logout: async () => {
      await logoutMutation.mutateAsync()
    },
    refetchUser: () => {
      refetchUser()
    },
    updateUser: async (data: Partial<User>) => {
      await updateUserMutation.mutateAsync(data)
    },
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// Hook for protected routes
export function useRequireAuth(): User {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    throw new Promise(() => {}) // Suspend component while loading
  }
  
  if (!isAuthenticated || !user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export default AuthContext