import { useMemo, useState } from 'react'
import { Booking, Property, Review } from '@/lib/types'
import {
  calculateRevenueOverTime,
  calculateOccupancyTrends,
  calculatePropertyPerformance,
  calculateAnalyticsSummary,
  formatCurrency,
  formatPercentage,
  formatNumber
} from '@/lib/analyticsUtils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { subMonths } from 'date-fns'
import { TrendUp, TrendDown, CurrencyDollar, CalendarCheck, Eye, Star, ChartBar, ChartLine } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AdvancedAnalyticsDashboardProps {
  properties: Property[]
  bookings: Booking[]
  reviews: Review[]
  analytics: Record<string, any>
}

const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  success: 'hsl(var(--accent))',
  warning: 'hsl(var(--warning))',
  muted: 'hsl(var(--muted))'
}

const CHART_COLORS = [
  'oklch(0.45 0.15 250)',
  'oklch(0.65 0.15 145)',
  'oklch(0.70 0.15 35)',
  'oklch(0.60 0.20 25)',
  'oklch(0.55 0.18 250)',
  'oklch(0.60 0.18 145)'
]

export function AdvancedAnalyticsDashboard({
  properties,
  bookings,
  reviews,
  analytics
}: AdvancedAnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'3' | '6' | '12'>('6')

  const { startDate, endDate } = useMemo(() => {
    const end = new Date()
    const start = subMonths(end, parseInt(timeRange))
    return { startDate: start, endDate: end }
  }, [timeRange])

  const revenueData = useMemo(() => {
    return calculateRevenueOverTime(bookings, startDate, endDate)
  }, [bookings, startDate, endDate])

  const occupancyData = useMemo(() => {
    return calculateOccupancyTrends(properties, bookings, startDate, endDate)
  }, [properties, bookings, startDate, endDate])

  const propertyPerformance = useMemo(() => {
    return calculatePropertyPerformance(properties, bookings, reviews, analytics)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)
  }, [properties, bookings, reviews, analytics])

  const summary = useMemo(() => {
    return calculateAnalyticsSummary(bookings, properties, reviews, analytics)
  }, [bookings, properties, reviews, analytics])

  const revenueVsBookingsData = useMemo(() => {
    return revenueData.map(item => ({
      month: item.month,
      revenue: item.revenue,
      bookings: item.bookings * 100
    }))
  }, [revenueData])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              <span className="font-medium">
                {entry.name.toLowerCase().includes('revenue') || entry.name.toLowerCase().includes('price')
                  ? formatCurrency(entry.value)
                  : entry.name.toLowerCase().includes('rate') || entry.name.toLowerCase().includes('occupancy')
                  ? formatPercentage(entry.value)
                  : entry.name.toLowerCase().includes('bookings') && entry.dataKey === 'bookings'
                  ? Math.round(entry.value / 100)
                  : formatNumber(entry.value)}
              </span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Advanced Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive insights into your property performance
          </p>
        </div>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-40" aria-label="Time range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Last 3 Months</SelectItem>
            <SelectItem value="6">Last 6 Months</SelectItem>
            <SelectItem value="12">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</div>
              <div className="flex items-center gap-1 mt-1">
                {summary.revenueGrowth >= 0 ? (
                  <>
                    <TrendUp className="h-3 w-3 text-accent" weight="bold" />
                    <p className="text-xs text-accent font-medium">
                      +{formatPercentage(summary.revenueGrowth)}
                    </p>
                  </>
                ) : (
                  <>
                    <TrendDown className="h-3 w-3 text-destructive" weight="bold" />
                    <p className="text-xs text-destructive font-medium">
                      {formatPercentage(summary.revenueGrowth)}
                    </p>
                  </>
                )}
                <p className="text-xs text-muted-foreground ml-1">vs last period</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.totalBookings)}</div>
              <div className="flex items-center gap-1 mt-1">
                {summary.bookingGrowth >= 0 ? (
                  <>
                    <TrendUp className="h-3 w-3 text-accent" weight="bold" />
                    <p className="text-xs text-accent font-medium">
                      +{formatPercentage(summary.bookingGrowth)}
                    </p>
                  </>
                ) : (
                  <>
                    <TrendDown className="h-3 w-3 text-destructive" weight="bold" />
                    <p className="text-xs text-destructive font-medium">
                      {formatPercentage(summary.bookingGrowth)}
                    </p>
                  </>
                )}
                <p className="text-xs text-muted-foreground ml-1">vs last period</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <ChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercentage(summary.occupancyRate)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last 30 days average
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Booking Value</CardTitle>
              <CurrencyDollar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(summary.averageBookingValue)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per booking
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Track your revenue trends and booking patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Bookings</CardTitle>
              <CardDescription>
                Compare revenue generation with booking volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueVsBookingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => Math.round(value / 100).toString()}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS[0], r: 4 }}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="bookings"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS[1], r: 4 }}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Trends</CardTitle>
              <CardDescription>
                Monitor your property occupancy rates over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="occupancyRate"
                    fill={CHART_COLORS[1]}
                    radius={[8, 8, 0, 0]}
                    name="Occupancy Rate"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(
                    occupancyData.reduce((sum, item) => sum + item.totalDays, 0)
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Available for booking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Booked Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {formatNumber(
                    occupancyData.reduce((sum, item) => sum + item.bookedDays, 0)
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Successfully booked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Available Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">
                  {formatNumber(
                    occupancyData.reduce(
                      (sum, item) => sum + (item.totalDays - item.bookedDays),
                      0
                    )
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Still available</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Properties</CardTitle>
              <CardDescription>
                Properties ranked by total revenue generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={propertyPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="propertyTitle"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    width={150}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="totalRevenue"
                    fill={CHART_COLORS[0]}
                    radius={[0, 8, 8, 0]}
                    name="Total Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {propertyPerformance.map((property, index) => (
              <motion.div
                key={property.propertyId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground">
                            {property.propertyTitle}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          {formatCurrency(property.totalRevenue)}
                        </div>
                        <div className="text-xs text-muted-foreground">Total Revenue</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Bookings</div>
                        <div className="text-lg font-semibold">{property.totalBookings}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Rating</div>
                        <div className="text-lg font-semibold flex items-center gap-1">
                          <Star weight="fill" className="h-4 w-4 text-accent" />
                          {property.averageRating.toFixed(1)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Occupancy</div>
                        <div className="text-lg font-semibold">
                          {formatPercentage(property.occupancyRate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Views</div>
                        <div className="text-lg font-semibold">{formatNumber(property.views)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
