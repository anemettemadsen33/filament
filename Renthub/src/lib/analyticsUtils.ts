import { Booking, Property, Review } from './types'
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, startOfDay, endOfDay } from 'date-fns'

export interface RevenueDataPoint {
  month: string
  revenue: number
  bookings: number
  averageBookingValue: number
}

export interface OccupancyDataPoint {
  month: string
  occupancyRate: number
  totalDays: number
  bookedDays: number
  availableDays: number
}

export interface PropertyPerformance {
  propertyId: string
  propertyTitle: string
  totalRevenue: number
  totalBookings: number
  averageRating: number
  occupancyRate: number
  views: number
}

export interface AnalyticsSummary {
  totalRevenue: number
  totalBookings: number
  averageBookingValue: number
  occupancyRate: number
  totalViews: number
  averageRating: number
  revenueGrowth: number
  bookingGrowth: number
}

export function calculateRevenueOverTime(
  bookings: Booking[],
  startDate: Date,
  endDate: Date
): RevenueDataPoint[] {
  const months = eachMonthOfInterval({ start: startDate, end: endDate })
  
  return months.map(month => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    
    const monthBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= monthStart && bookingDate <= monthEnd && booking.status !== 'cancelled'
    })
    
    const revenue = monthBookings.reduce((sum, booking) => sum + booking.totalPrice, 0)
    const averageBookingValue = monthBookings.length > 0 ? revenue / monthBookings.length : 0
    
    return {
      month: format(month, 'MMM yyyy'),
      revenue,
      bookings: monthBookings.length,
      averageBookingValue
    }
  })
}

export function calculateOccupancyTrends(
  properties: Property[],
  bookings: Booking[],
  startDate: Date,
  endDate: Date
): OccupancyDataPoint[] {
  const months = eachMonthOfInterval({ start: startDate, end: endDate })
  
  return months.map(month => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    const daysInMonth = monthEnd.getDate()
    
    const totalDays = properties.length * daysInMonth
    
    let bookedDays = 0
    bookings.forEach(booking => {
      if (booking.status === 'cancelled') return
      
      const checkIn = booking.checkIn ? new Date(booking.checkIn) : null
      const checkOut = booking.checkOut ? new Date(booking.checkOut) : null
      
      if (!checkIn || !checkOut) return
      
      if (checkIn <= monthEnd && checkOut >= monthStart) {
        const effectiveStart = checkIn > monthStart ? checkIn : monthStart
        const effectiveEnd = checkOut < monthEnd ? checkOut : monthEnd
        
        const days = Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24))
        bookedDays += Math.max(0, days)
      }
    })
    
    const availableDays = totalDays
    const occupancyRate = totalDays > 0 ? (bookedDays / totalDays) * 100 : 0
    
    return {
      month: format(month, 'MMM yyyy'),
      occupancyRate: Math.min(100, occupancyRate),
      totalDays,
      bookedDays,
      availableDays
    }
  })
}

export function calculatePropertyPerformance(
  properties: Property[],
  bookings: Booking[],
  reviews: Review[],
  analytics: Record<string, any>
): PropertyPerformance[] {
  return properties.map(property => {
    const propertyBookings = bookings.filter(
      b => b.propertyId === property.id && b.status !== 'cancelled'
    )
    const totalRevenue = propertyBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    
    const propertyReviews = reviews.filter(r => r.propertyId === property.id)
    const averageRating = propertyReviews.length > 0
      ? propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length
      : 0
    
    const propertyAnalytics = analytics[property.id] || {}
    const views = propertyAnalytics.views || 0
    
    const now = Date.now()
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
    const recentBookings = propertyBookings.filter(b => b.checkIn && b.checkIn >= thirtyDaysAgo)
    
    const totalDaysInPeriod = 30
    let bookedDays = 0
    recentBookings.forEach(booking => {
      if (booking.checkIn && booking.checkOut) {
        const days = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24))
        bookedDays += days
      }
    })
    
    const occupancyRate = (bookedDays / totalDaysInPeriod) * 100
    
    return {
      propertyId: property.id,
      propertyTitle: property.title,
      totalRevenue,
      totalBookings: propertyBookings.length,
      averageRating,
      occupancyRate: Math.min(100, occupancyRate),
      views
    }
  })
}

export function calculateAnalyticsSummary(
  bookings: Booking[],
  properties: Property[],
  reviews: Review[],
  analytics: Record<string, any>
): AnalyticsSummary {
  const confirmedBookings = bookings.filter(b => b.status !== 'cancelled')
  
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const totalBookings = confirmedBookings.length
  const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
  
  const totalViews = Object.values(analytics).reduce((sum: number, a: any) => sum + (a.views || 0), 0)
  
  const allReviews = reviews.filter(r => properties.some(p => p.id === r.propertyId))
  const averageRating = allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 0
  
  const now = Date.now()
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000)
  
  const currentPeriodBookings = confirmedBookings.filter(b => b.createdAt >= thirtyDaysAgo)
  const previousPeriodBookings = confirmedBookings.filter(
    b => b.createdAt >= sixtyDaysAgo && b.createdAt < thirtyDaysAgo
  )
  
  const currentRevenue = currentPeriodBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const previousRevenue = previousPeriodBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  
  const revenueGrowth = previousRevenue > 0
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
    : currentRevenue > 0 ? 100 : 0
  
  const bookingGrowth = previousPeriodBookings.length > 0
    ? ((currentPeriodBookings.length - previousPeriodBookings.length) / previousPeriodBookings.length) * 100
    : currentPeriodBookings.length > 0 ? 100 : 0
  
  const totalDaysInPeriod = 30 * properties.length
  let totalBookedDays = 0
  
  currentPeriodBookings.forEach(booking => {
    if (booking.checkIn && booking.checkOut) {
      const days = Math.ceil((booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24))
      totalBookedDays += days
    }
  })
  
  const occupancyRate = totalDaysInPeriod > 0 ? (totalBookedDays / totalDaysInPeriod) * 100 : 0
  
  return {
    totalRevenue,
    totalBookings,
    averageBookingValue,
    occupancyRate: Math.min(100, occupancyRate),
    totalViews,
    averageRating,
    revenueGrowth,
    bookingGrowth
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}
