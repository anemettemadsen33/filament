import { motion } from 'framer-motion'
import { 
  ChatCircle, 
  CalendarCheck, 
  TrendDown, 
  House, 
  Star, 
  CheckCircle,
  Bell,
  ArrowRight
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Notification } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface NotificationSummaryProps {
  userId: string
  notifications: Notification[]
  onViewAll: () => void
  onNotificationClick: (notification: Notification) => void
}

const iconMap = {
  message: ChatCircle,
  booking: CalendarCheck,
  price_drop: TrendDown,
  new_property: House,
  review: Star,
  confirmation: CheckCircle,
  property_update: House,
}

const colorMap = {
  message: 'text-blue-500',
  booking: 'text-green-500',
  price_drop: 'text-orange-500',
  new_property: 'text-purple-500',
  review: 'text-yellow-500',
  confirmation: 'text-emerald-500',
  property_update: 'text-indigo-500',
}

export function NotificationSummary({
  userId,
  notifications,
  onViewAll,
  onNotificationClick
}: NotificationSummaryProps) {
  const userNotifications = notifications.filter(n => n.userId === userId)
  const recentNotifications = userNotifications
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5)
  const unreadCount = userNotifications.filter(n => !n.read).length

  if (userNotifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={24} weight="duotone" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your latest notifications will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="flex flex-col items-center justify-center py-8 px-4 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell size={32} weight="light" className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No recent activity
            </p>
          </motion.div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell size={24} weight="duotone" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentNotifications.map((notification, index) => {
          const Icon = iconMap[notification.type]
          const colorClass = colorMap[notification.type]
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onNotificationClick(notification)}
              className={cn(
                'flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer',
                !notification.read && 'bg-accent/20'
              )}
            >
              <div className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                colorClass,
                'bg-current/10'
              )}>
                <Icon className={colorClass} size={20} weight="bold" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className={cn(
                    'font-semibold text-sm leading-tight',
                    !notification.read && 'text-foreground'
                  )}>
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <Badge variant="secondary" className="h-5 px-2 text-xs">New</Badge>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                  {notification.message}
                </p>
                
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                </p>
              </div>
            </motion.div>
          )
        })}
        
        {userNotifications.length > 5 && (
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={onViewAll}
          >
            View All {userNotifications.length} Notifications
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
