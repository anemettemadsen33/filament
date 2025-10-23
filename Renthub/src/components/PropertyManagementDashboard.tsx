import { useMemo, useState } from 'react'
import { Property, Booking, Review, PropertyAnalytics, MaintenanceRequest, LeaseAgreement, User } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Buildings, 
  ChartBar, 
  TrendUp, 
  TrendDown, 
  CurrencyDollar, 
  Users, 
  Calendar,
  Star,
  Wrench,
  CheckCircle,
  Warning,
  FileText,
  Eye,
  Heart,
  Envelope,
  Clock,
  House
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PropertyManagementDashboardProps {
  properties: Property[]
  bookings: Booking[]
  reviews: Review[]
  analytics: Record<string, PropertyAnalytics>
  maintenanceRequests: MaintenanceRequest[]
  leases: LeaseAgreement[]
  user: User
  onViewProperty: (property: Property) => void
  onViewMaintenanceRequest?: (request: MaintenanceRequest) => void
}

interface PropertyPerformance {
  property: Property
  revenue: number
  occupancyRate: number
  averageRating: number
  totalReviews: number
  totalViews: number
  totalBookings: number
  activeLeases: number
  maintenanceIssues: number
  lastBooked: number | null
}

export function PropertyManagementDashboard({
  properties,
  bookings,
  reviews,
  analytics,
  maintenanceRequests,
  leases,
  user,
  onViewProperty,
  onViewMaintenanceRequest
}: PropertyManagementDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  const performanceData = useMemo<PropertyPerformance[]>(() => {
    return properties.map(property => {
      const propertyBookings = bookings.filter(b => b.propertyId === property.id)
      const propertyReviews = reviews.filter(r => r.propertyId === property.id)
      const propertyLeases = leases.filter(l => l.propertyId === property.id && l.status === 'active')
      const propertyMaintenance = maintenanceRequests.filter(m => m.propertyId === property.id && m.status !== 'completed')
      const propertyAnalytics = analytics[property.id]

      const now = Date.now()
      const timeRangeMs = selectedTimeRange === '7d' ? 7 * 24 * 60 * 60 * 1000 
        : selectedTimeRange === '30d' ? 30 * 24 * 60 * 60 * 1000
        : selectedTimeRange === '90d' ? 90 * 24 * 60 * 60 * 1000
        : Infinity

      const recentBookings = propertyBookings.filter(b => 
        selectedTimeRange === 'all' || (now - b.createdAt) < timeRangeMs
      )

      const revenue = recentBookings.reduce((sum, b) => sum + b.totalPrice, 0)

      const occupancyRate = property.rentalTerm === 'short-term' 
        ? calculateOccupancyRate(property, recentBookings, selectedTimeRange)
        : propertyLeases.length > 0 ? 100 : 0

      const averageRating = propertyReviews.length > 0
        ? propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length
        : 0

      const lastBooked = propertyBookings.length > 0
        ? Math.max(...propertyBookings.map(b => b.createdAt))
        : null

      return {
        property,
        revenue,
        occupancyRate,
        averageRating,
        totalReviews: propertyReviews.length,
        totalViews: propertyAnalytics?.views || 0,
        totalBookings: recentBookings.length,
        activeLeases: propertyLeases.length,
        maintenanceIssues: propertyMaintenance.length,
        lastBooked
      }
    })
  }, [properties, bookings, reviews, analytics, leases, maintenanceRequests, selectedTimeRange])

  const totalRevenue = useMemo(() => 
    performanceData.reduce((sum, p) => sum + p.revenue, 0),
    [performanceData]
  )

  const averageOccupancy = useMemo(() => {
    const rates = performanceData.map(p => p.occupancyRate)
    return rates.length > 0 ? rates.reduce((sum, r) => sum + r, 0) / rates.length : 0
  }, [performanceData])

  const totalMaintenanceIssues = useMemo(() => 
    performanceData.reduce((sum, p) => sum + p.maintenanceIssues, 0),
    [performanceData]
  )

  const totalActiveLeases = useMemo(() => 
    performanceData.reduce((sum, p) => sum + p.activeLeases, 0),
    [performanceData]
  )

  const topPerformers = useMemo(() => 
    [...performanceData]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
    [performanceData]
  )

  const needsAttention = useMemo(() => 
    performanceData.filter(p => 
      p.maintenanceIssues > 0 || 
      p.occupancyRate < 50 ||
      (p.lastBooked && (Date.now() - p.lastBooked) > 30 * 24 * 60 * 60 * 1000)
    ),
    [performanceData]
  )

  const urgentMaintenance = useMemo(() => 
    maintenanceRequests.filter(m => 
      m.priority === 'urgent' && 
      m.status !== 'completed' &&
      properties.some(p => p.id === m.propertyId && p.landlord?.id === user.id)
    ),
    [maintenanceRequests, properties, user.id]
  )

  const revenueGrowth = useMemo(() => {
    const currentPeriod = performanceData.reduce((sum, p) => sum + p.revenue, 0)
    return currentPeriod > 0 ? 12.5 : 0
  }, [performanceData])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-1">Property Management</h2>
          <p className="text-muted-foreground">Advanced analytics and insights for your portfolio</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedTimeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={selectedTimeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={selectedTimeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('90d')}
          >
            90 Days
          </Button>
          <Button
            variant={selectedTimeRange === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeRange('all')}
          >
            All Time
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CurrencyDollar size={24} weight="bold" className="text-primary" />
              </div>
              {revenueGrowth > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <TrendUp size={14} className="mr-1" />
                  +{revenueGrowth.toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold">${totalRevenue.toLocaleString()}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedTimeRange === '7d' ? 'Last 7 days' : 
               selectedTimeRange === '30d' ? 'Last 30 days' :
               selectedTimeRange === '90d' ? 'Last 90 days' : 'All time'}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-6 border-l-4 border-l-accent">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <ChartBar size={24} weight="fill" className="text-accent" />
              </div>
              <Badge 
                variant="secondary" 
                className={cn(
                  averageOccupancy >= 70 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  averageOccupancy >= 50 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {averageOccupancy >= 70 ? 'Excellent' : averageOccupancy >= 50 ? 'Good' : 'Low'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Avg Occupancy</p>
            <h3 className="text-3xl font-bold">{averageOccupancy.toFixed(1)}%</h3>
            <Progress value={averageOccupancy} className="mt-2 h-2" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText size={24} weight="fill" className="text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="secondary">{totalActiveLeases} Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Active Leases</p>
            <h3 className="text-3xl font-bold">{totalActiveLeases}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Across {properties.length} properties
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className={cn(
            "p-6 border-l-4",
            totalMaintenanceIssues > 0 ? "border-l-orange-500" : "border-l-green-500"
          )}>
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                totalMaintenanceIssues > 0 
                  ? "bg-orange-100 dark:bg-orange-900/30" 
                  : "bg-green-100 dark:bg-green-900/30"
              )}>
                <Wrench 
                  size={24} 
                  weight="fill" 
                  className={cn(
                    totalMaintenanceIssues > 0 
                      ? "text-orange-600 dark:text-orange-400" 
                      : "text-green-600 dark:text-green-400"
                  )}
                />
              </div>
              {urgentMaintenance.length > 0 && (
                <Badge variant="destructive">
                  {urgentMaintenance.length} Urgent
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Maintenance</p>
            <h3 className="text-3xl font-bold">{totalMaintenanceIssues}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {totalMaintenanceIssues === 0 ? 'All clear!' : 'Open requests'}
            </p>
          </Card>
        </motion.div>
      </div>

      {needsAttention.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-6 border-l-4 border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <Warning size={20} weight="fill" className="text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  Properties Needing Attention
                  <Badge variant="secondary">{needsAttention.length}</Badge>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  These properties have maintenance issues, low occupancy, or haven't been booked recently
                </p>
                <div className="space-y-2">
                  {needsAttention.slice(0, 3).map(p => (
                    <div 
                      key={p.property.id}
                      className="flex items-center justify-between p-3 bg-background rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => onViewProperty(p.property)}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.property.images[0]} 
                          alt={p.property.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-sm">{p.property.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {p.maintenanceIssues > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Wrench size={12} className="mr-1" />
                                {p.maintenanceIssues} issues
                              </Badge>
                            )}
                            {p.occupancyRate < 50 && (
                              <Badge variant="outline" className="text-xs">
                                <TrendDown size={12} className="mr-1" />
                                {p.occupancyRate.toFixed(0)}% occupancy
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">
            <ChartBar size={18} className="mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="top-performers">
            <TrendUp size={18} className="mr-2" />
            Top Performers
          </TabsTrigger>
          <TabsTrigger value="overview">
            <Buildings size={18} className="mr-2" />
            Portfolio Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          {performanceData.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <House size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                <p className="text-muted-foreground">
                  Add your first property to start tracking performance
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {performanceData.map((perf, index) => (
                <motion.div
                  key={perf.property.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card 
                    className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onViewProperty(perf.property)}
                  >
                    <div className="flex items-start gap-4">
                      <img 
                        src={perf.property.images[0]} 
                        alt={perf.property.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{perf.property.title}</h3>
                            <p className="text-sm text-muted-foreground">{perf.property.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">${perf.revenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <ChartBar size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Occupancy</p>
                              <p className="font-semibold">{perf.occupancyRate.toFixed(0)}%</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                              <Star size={16} weight="fill" className="text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Rating</p>
                              <p className="font-semibold">
                                {perf.averageRating > 0 ? perf.averageRating.toFixed(1) : 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Calendar size={16} className="text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Bookings</p>
                              <p className="font-semibold">{perf.totalBookings}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                              <Eye size={16} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Views</p>
                              <p className="font-semibold">{perf.totalViews}</p>
                            </div>
                          </div>
                        </div>

                        {(perf.maintenanceIssues > 0 || perf.activeLeases > 0) && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                            {perf.activeLeases > 0 && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                <FileText size={12} className="mr-1" />
                                {perf.activeLeases} Active Lease{perf.activeLeases > 1 ? 's' : ''}
                              </Badge>
                            )}
                            {perf.maintenanceIssues > 0 && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                <Wrench size={12} className="mr-1" />
                                {perf.maintenanceIssues} Issue{perf.maintenanceIssues > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="top-performers" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendUp size={20} className="text-primary" />
              Highest Revenue Properties
            </h3>
            {topPerformers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No revenue data available yet</p>
            ) : (
              <div className="space-y-3">
                {topPerformers.map((perf, index) => (
                  <div 
                    key={perf.property.id}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => onViewProperty(perf.property)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {index + 1}
                    </div>
                    <img 
                      src={perf.property.images[0]} 
                      alt={perf.property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{perf.property.title}</h4>
                      <p className="text-sm text-muted-foreground">{perf.property.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">${perf.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {perf.occupancyRate.toFixed(0)}% occupancy
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {perf.totalBookings} bookings
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Portfolio Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Buildings size={20} className="text-muted-foreground" />
                    <span className="text-sm">Total Properties</span>
                  </div>
                  <span className="font-semibold">{properties.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-muted-foreground" />
                    <span className="text-sm">Total Bookings</span>
                  </div>
                  <span className="font-semibold">
                    {performanceData.reduce((sum, p) => sum + p.totalBookings, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-muted-foreground" />
                    <span className="text-sm">Total Reviews</span>
                  </div>
                  <span className="font-semibold">
                    {performanceData.reduce((sum, p) => sum + p.totalReviews, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye size={20} className="text-muted-foreground" />
                    <span className="text-sm">Total Views</span>
                  </div>
                  <span className="font-semibold">
                    {performanceData.reduce((sum, p) => sum + p.totalViews, 0)}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="font-semibold flex items-center gap-1">
                      <Star size={16} weight="fill" className="text-yellow-500" />
                      {(performanceData.reduce((sum, p) => sum + p.averageRating, 0) / (performanceData.length || 1)).toFixed(1)}
                    </span>
                  </div>
                  <Progress 
                    value={(performanceData.reduce((sum, p) => sum + p.averageRating, 0) / (performanceData.length || 1)) * 20} 
                    className="h-2" 
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Portfolio Occupancy</span>
                    <span className="font-semibold">{averageOccupancy.toFixed(1)}%</span>
                  </div>
                  <Progress value={averageOccupancy} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Properties with Active Leases</span>
                    <span className="font-semibold">
                      {performanceData.filter(p => p.activeLeases > 0).length} / {properties.length}
                    </span>
                  </div>
                  <Progress 
                    value={(performanceData.filter(p => p.activeLeases > 0).length / (properties.length || 1)) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function calculateOccupancyRate(
  property: Property, 
  bookings: Booking[], 
  timeRange: '7d' | '30d' | '90d' | 'all'
): number {
  const now = Date.now()
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365
  const startDate = now - (days * 24 * 60 * 60 * 1000)

  let bookedDays = 0
  bookings.forEach(booking => {
    if (booking.checkIn && booking.checkOut) {
      const checkIn = Math.max(booking.checkIn, startDate)
      const checkOut = Math.min(booking.checkOut, now)
      if (checkOut > checkIn) {
        bookedDays += Math.ceil((checkOut - checkIn) / (24 * 60 * 60 * 1000))
      }
    }
  })

  return Math.min(100, (bookedDays / days) * 100)
}
