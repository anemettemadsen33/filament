import { Notification } from '@/lib/types'

export async function createNotification(
  userId: string,
  type: Notification['type'],
  title: string,
  message: string,
  options?: {
    propertyId?: string
    conversationId?: string
    bookingId?: string
    actionUrl?: string
    metadata?: Record<string, unknown>
  }
): Promise<Notification> {
  const notification: Notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    type,
    title,
    message,
    read: false,
    createdAt: Date.now(),
    ...options,
  }

  return notification
}

export function addNotification(
  currentNotifications: Notification[],
  newNotification: Notification
): Notification[] {
  return [newNotification, ...(currentNotifications || [])]
}

export async function addNotificationToKV(
  notification: Notification
): Promise<void> {
  const currentNotifications = await window.spark.kv.get<Notification[]>('notifications') || []
  await window.spark.kv.set('notifications', addNotification(currentNotifications, notification))
}
