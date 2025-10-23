import { Property, PropertyAnalytics } from '@/lib/types'
import { Eye, Heart, EnvelopeSimple, TrendUp, Buildings } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PropertyAnalyticsPanelProps {
  properties: Property[]
  analytics: Record<string, PropertyAnalytics>
  onViewProperty: (property: Property) => void
}

export function PropertyAnalyticsPanel({ properties, analytics, onViewProperty }: PropertyAnalyticsPanelProps) {
  const totalStats = {
    views: Object.values(analytics).reduce((sum, a) => sum + (a.views || 0), 0),
    favorites: Object.values(analytics).reduce((sum, a) => sum + (a.favorites || 0), 0),
    contactRequests: Object.values(analytics).reduce((sum, a) => sum + (a.contactRequests || 0), 0)
  }

  const stats = [
    {
      icon: Eye,
      label: 'Total Views',
      value: totalStats.views,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Heart,
      label: 'Total Favorites',
      value: totalStats.favorites,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      icon: EnvelopeSimple,
      label: 'Total Contacts',
      value: totalStats.contactRequests,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ]

  const totalEngagement = totalStats.views + totalStats.favorites + totalStats.contactRequests

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
        <h3 className="font-bold text-xl">Property Analytics</h3>
        <TrendUp size={20} weight="bold" className="text-accent" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-4 rounded-xl bg-card border border-border/30 shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
              <stat.icon size={24} weight="bold" className={stat.color} />
            </div>
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Engagement</p>
            <p className="text-2xl font-bold">{totalEngagement}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <TrendUp size={28} weight="bold" className="text-white" />
          </div>
        </div>
      </div>

      {properties.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-lg mb-3">Property Performance</h4>
          {properties.map((property) => {
            const propertyAnalytics = analytics[property.id] || {
              propertyId: property.id,
              views: 0,
              favorites: 0,
              contactRequests: 0
            }

            return (
              <Card key={property.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Buildings size={18} className="text-primary" />
                      <h5 className="font-semibold">{property.title}</h5>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye size={14} className="text-blue-500" />
                        {propertyAnalytics.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} className="text-red-500" />
                        {propertyAnalytics.favorites} favorites
                      </span>
                      <span className="flex items-center gap-1">
                        <EnvelopeSimple size={14} className="text-green-500" />
                        {propertyAnalytics.contactRequests} contacts
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProperty(property)}
                  >
                    View
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
