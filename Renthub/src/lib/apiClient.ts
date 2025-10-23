/**
 * API Client for RentHub - Laravel Backend Communication
 * Handles HTTP requests with Sanctum authentication
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import config from './config'

interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  errors?: Record<string, string[]>
  meta?: {
    current_page?: number
    last_page?: number
    per_page?: number
    total?: number
  }
}

interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

class ApiClient {
  private axiosInstance: AxiosInstance
  private token: string | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    this.setupInterceptors()
    this.loadStoredToken()
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle errors and token refresh
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          // Clear stored token
          this.clearToken()
          
          // Redirect to login or emit event
          window.dispatchEvent(new CustomEvent('auth:logout'))
          
          return Promise.reject(error)
        }

        // Handle 419 CSRF Token Mismatch
        if (error.response?.status === 419) {
          try {
            await this.getCsrfCookie()
            return this.axiosInstance(originalRequest)
          } catch (csrfError) {
            return Promise.reject(error)
          }
        }

        // Handle network errors
        if (!error.response) {
          const networkError: ApiError = {
            message: 'Network error. Please check your connection.',
            status: 0
          }
          return Promise.reject(networkError)
        }

        // Transform error response
        const apiError: ApiError = {
          message: error.response.data?.message || 'An error occurred',
          errors: error.response.data?.errors,
          status: error.response.status
        }

        return Promise.reject(apiError)
      }
    )
  }

  private loadStoredToken() {
    try {
      const storedToken = localStorage.getItem('auth_token')
      if (storedToken) {
        this.token = storedToken
      }
    } catch (error) {
      console.warn('Failed to load stored token:', error)
    }
  }

  public setToken(token: string) {
    this.token = token
    try {
      localStorage.setItem('auth_token', token)
    } catch (error) {
      console.warn('Failed to store token:', error)
    }
  }

  public clearToken() {
    this.token = null
    try {
      localStorage.removeItem('auth_token')
    } catch (error) {
      console.warn('Failed to clear stored token:', error)
    }
  }

  public getToken(): string | null {
    return this.token
  }

  // CSRF Protection for Sanctum
  public async getCsrfCookie(): Promise<void> {
    await this.axiosInstance.get(config.CSRF_COOKIE_URL)
  }

  // Generic HTTP Methods
  public async get<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get(url, config)
    return response.data
  }

  public async post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, data, config)
    return response.data
  }

  public async put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put(url, data, config)
    return response.data
  }

  public async patch<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch(url, data, config)
    return response.data
  }

  public async delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete(url, config)
    return response.data
  }

  // File upload with progress
  public async upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
    return response.data
  }

  // Authentication Methods
  public async login(credentials: { email: string; password: string; remember?: boolean }) {
    // Get CSRF cookie first
    await this.getCsrfCookie()
    
    const response = await this.post(config.LOGIN_URL, credentials)
    
    if (response.data?.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  public async register(userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) {
    await this.getCsrfCookie()
    return this.post(config.REGISTER_URL, userData)
  }

  public async logout() {
    try {
      await this.post(config.LOGOUT_URL)
    } finally {
      this.clearToken()
    }
  }

  public async getUser() {
    return this.get(config.USER_URL)
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/api/health')
      return true
    } catch {
      return false
    }
  }
}

// Create singleton instance
const apiClient = new ApiClient()

export default apiClient
export type { ApiResponse, ApiError }