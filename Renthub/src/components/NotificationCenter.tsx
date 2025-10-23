import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, CheckCircle, Trash, Funnel } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Notification } from '@/lib/types'
import { NotificationItem } from './NotificationItem'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface NotificationCenterProps {
  userId: string | null
  onNotificationClick?: (notification: Notification) => void
}

type NotificationFilter = 'all' | 'unread' | Notification['type']

export function NotificationCenter({ userId, onNotificationClick }: NotificationCenterProps) {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', [])
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<NotificationFilter>('all')

  const userNotifications = notifications?.filter(n => n.userId === userId) || []
  const unreadCount = userNotifications.filter(n => !n.read).length

  const filteredNotifications = userNotifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const getNotificationCountByType = (type: Notification['type']) => {
    return userNotifications.filter(n => n.type === type && !n.read).length
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((current) =>
      (current || []).map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((current) =>
      (current || []).map(n =>
        n.userId === userId ? { ...n, read: true } : n
      )
    )
    toast.success('All notifications marked as read')
  }

  const handleDelete = (notificationId: string) => {
    setNotifications((current) =>
      (current || []).filter(n => n.id !== notificationId)
    )
    toast.success('Notification deleted')
  }

  const handleDeleteAll = () => {
    setNotifications((current) =>
      (current || []).filter(n => n.userId !== userId)
    )
    toast.success('All notifications cleared')
  }

  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id)
    if (onNotificationClick) {
      onNotificationClick(notification)
    }
    setOpen(false)
  }

  if (!userId) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          title={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell size={20} weight={unreadCount > 0 ? 'fill' : 'regular'} />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge 
                  variant="destructive" 
                  className="h-5 min-w-5 rounded-full px-1 text-xs flex items-center justify-center"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-[480px] flex flex-col gap-0 p-0">
        <SheetHeader className="border-b p-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {userNotifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex-1"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAll}
                className="flex-1"
              >
                <Trash size={16} className="mr-2" />
                Clear all
              </Button>
            </div>
          )}
        </SheetHeader>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as NotificationFilter)} className="flex-1 flex flex-col">
          <div className="px-6 pt-4 pb-2 border-b">
            <TabsList className="w-full grid grid-cols-4 h-9">
              <TabsTrigger value="all" className="text-xs">
                All
                {userNotifications.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {userNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="message" className="text-xs">
                Messages
                {getNotificationCountByType('message') > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {getNotificationCountByType('message')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="booking" className="text-xs">
                Bookings
                {getNotificationCountByType('booking') > 0 && (
                  <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                    {getNotificationCountByType('booking')}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <TabsContent value={filter} className="m-0">
              <div className="divide-y">
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-12 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                        <Bell size={32} weight="light" className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground font-medium">
                        {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {filter === 'all' 
                          ? "We'll notify you when something important happens"
                          : `You don't have any ${filter} notifications at the moment`
                        }
                      </p>
                    </motion.div>
                  ) : (
                    filteredNotifications
                      .sort((a, b) => b.createdAt - a.createdAt)
                      .map((notification, index) => (
                        <NotificationItem
                          key={notification.id}
                          notification={notification}
                          index={index}
                          onClick={() => handleNotificationClick(notification)}
                          onDelete={() => handleDelete(notification.id)}
                          onMarkAsRead={() => handleMarkAsRead(notification.id)}
                        />
                      ))
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
