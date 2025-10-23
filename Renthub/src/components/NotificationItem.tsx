import { motion } from 'framer-motion'
import { 
  ChatCircle, 
  CalendarCheck, 
  TrendDown, 
  House, 
  Star, 
  CheckCircle,
  Trash,
  Circle,
  IconContext
} from '@phosphor-icons/react'
import { Notification } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: Notification
  index: number
  onClick: () => void
  onDelete: () => void
  onMarkAsRead: () => void
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

export function NotificationItem({
  notification,
  index,
  onClick,
  onDelete,
  onMarkAsRead,
}: NotificationItemProps) {
  const Icon = iconMap[notification.type]
  const colorClass = colorMap[notification.type]

  return (
    <IconContext.Provider value={{ size: 20, weight: 'bold' }}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          'group relative p-4 hover:bg-accent/50 transition-colors cursor-pointer',
          !notification.read && 'bg-accent/20'
        )}
      >
        <div className="flex gap-3" onClick={onClick}>
          <div className={cn('flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center', colorClass, 'bg-current/10')}>
            <Icon className={colorClass} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className={cn(
                'font-semibold text-sm leading-tight',
                !notification.read && 'text-foreground'
              )}>
                {notification.title}
              </h4>
              {!notification.read && (
                <Circle weight="fill" size={8} className="text-primary flex-shrink-0 mt-1" />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {notification.message}
            </p>

            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation()
                onMarkAsRead()
              }}
              aria-label="Mark as read"
              title="Mark as read"
            >
              <CheckCircle size={16} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            aria-label="Delete notification"
            title="Delete notification"
          >
            <Trash size={16} />
          </Button>
        </div>
      </motion.div>
    </IconContext.Provider>
  )
}
