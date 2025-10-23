/**
 * Environment variables configuration for RentHub
 * Centralized configuration for all environment-dependent settings
 */

interface Config {
  // API Configuration
  API_BASE_URL: string
  API_VERSION: string
  
  // Sanctum Configuration
  SANCTUM_STATEFUL_DOMAINS: string[]
  SESSION_DRIVER: string
  
  // Application Settings
  APP_NAME: string
  APP_ENV: string
  APP_DEBUG: boolean
  
  // URLs
  FRONTEND_URL: string
  BACKEND_URL: string
  
  // API Endpoints
  LOGIN_URL: string
  LOGOUT_URL: string
  REGISTER_URL: string
  USER_URL: string
  CSRF_COOKIE_URL: string
  
  // External Services
  GOOGLE_MAPS_API_KEY?: string
  PUSHER_APP_KEY?: string
  PUSHER_HOST?: string
  PUSHER_PORT?: number
  PUSHER_SCHEME?: string
  PUSHER_APP_CLUSTER?: string
  
  // Storage
  STORAGE_DRIVER: string
  AWS_BUCKET?: string
  AWS_REGION?: string
  
  // Email
  MAIL_FROM_ADDRESS: string
  MAIL_FROM_NAME: string
  
  // Social Login
  GOOGLE_CLIENT_ID?: string
  FACEBOOK_APP_ID?: string
  
  // Feature Flags
  ENABLE_CHAT: boolean
  ENABLE_NOTIFICATIONS: boolean
  ENABLE_ANALYTICS: boolean
  ENABLE_AR_TOURS: boolean
  ENABLE_SMART_HOME: boolean
}

const config: Config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  API_VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  
  // Sanctum Configuration
  SANCTUM_STATEFUL_DOMAINS: import.meta.env.VITE_SANCTUM_STATEFUL_DOMAINS?.split(',') || ['localhost:5173'],
  SESSION_DRIVER: import.meta.env.VITE_SESSION_DRIVER || 'cookie',
  
  // Application Settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'RentHub',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'local',
  APP_DEBUG: import.meta.env.VITE_APP_DEBUG === 'true',
  
  // URLs
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  
  // API Endpoints
  LOGIN_URL: import.meta.env.VITE_LOGIN_URL || '/api/v1/auth/login',
  LOGOUT_URL: import.meta.env.VITE_LOGOUT_URL || '/api/v1/auth/logout',
  REGISTER_URL: import.meta.env.VITE_REGISTER_URL || '/api/v1/auth/register',
  USER_URL: import.meta.env.VITE_USER_URL || '/api/v1/auth/user',
  CSRF_COOKIE_URL: import.meta.env.VITE_CSRF_COOKIE_URL || '/sanctum/csrf-cookie',
  
  // External Services
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  PUSHER_APP_KEY: import.meta.env.VITE_PUSHER_APP_KEY,
  PUSHER_HOST: import.meta.env.VITE_PUSHER_HOST,
  PUSHER_PORT: import.meta.env.VITE_PUSHER_PORT ? parseInt(import.meta.env.VITE_PUSHER_PORT) : undefined,
  PUSHER_SCHEME: import.meta.env.VITE_PUSHER_SCHEME,
  PUSHER_APP_CLUSTER: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  
  // Storage
  STORAGE_DRIVER: import.meta.env.VITE_STORAGE_DRIVER || 'local',
  AWS_BUCKET: import.meta.env.VITE_AWS_BUCKET,
  AWS_REGION: import.meta.env.VITE_AWS_REGION,
  
  // Email
  MAIL_FROM_ADDRESS: import.meta.env.VITE_MAIL_FROM_ADDRESS || 'noreply@renthub.com',
  MAIL_FROM_NAME: import.meta.env.VITE_MAIL_FROM_NAME || 'RentHub',
  
  // Social Login
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID,
  
  // Feature Flags
  ENABLE_CHAT: import.meta.env.VITE_ENABLE_CHAT === 'true',
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_AR_TOURS: import.meta.env.VITE_ENABLE_AR_TOURS === 'true',
  ENABLE_SMART_HOME: import.meta.env.VITE_ENABLE_SMART_HOME === 'true',
}

// Validate required environment variables
const requiredEnvVars = [
  'VITE_API_BASE_URL',
  'VITE_BACKEND_URL',
  'VITE_FRONTEND_URL'
]

if (config.APP_ENV === 'production') {
  requiredEnvVars.forEach(envVar => {
    if (!import.meta.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`)
    }
  })
}

export default config
export type { Config }