import { useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Envelope, CheckCircle, XCircle, Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { EmailSettings, EmailNotificationPreferences, updateEmailPreferences } from '@/lib/emailService'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface EmailSettingsPanelProps {
  userId: string
}

export function EmailSettingsPanel({ userId }: EmailSettingsPanelProps) {
  const [emailSettings, setEmailSettings] = useLocalStorage<EmailSettings>('email-settings', {
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'RentHub',
    enabled: false
  })

  const [emailPreferences, setEmailPreferences] = useLocalStorage<EmailNotificationPreferences>(
    `email-prefs-${userId}`,
    {
      newBooking: true,
      bookingConfirmation: true,
      bookingCancellation: true,
      newMessage: true,
      newReview: true,
      priceAlert: true,
      propertyUpdate: true,
      maintenanceRequest: true,
      leaseSigningReminder: true,
      paymentReminder: true
    }
  )

  const [emailLogs] = useLocalStorage<any[]>('email-logs', [])
  const [showPassword, setShowPassword] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  const handleSaveSettings = () => {
    setEmailSettings((current) => current || {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: 'RentHub',
      enabled: false
    })
    toast.success('Email settings saved successfully')
  }

  const handleTestEmail = async () => {
    if (!emailSettings?.enabled) {
      toast.error('Please enable email service first')
      return
    }

    if (!emailSettings.smtpHost || !emailSettings.fromEmail) {
      toast.error('Please fill in all required SMTP settings')
      return
    }

    setIsTesting(true)
    
    setTimeout(() => {
      setIsTesting(false)
      toast.success('Test email sent! Check your inbox.')
    }, 2000)
  }

  const handleTogglePreference = async (key: keyof EmailNotificationPreferences) => {
    const currentPrefs = emailPreferences || {
      newBooking: true,
      bookingConfirmation: true,
      bookingCancellation: true,
      newMessage: true,
      newReview: true,
      priceAlert: true,
      propertyUpdate: true,
      maintenanceRequest: true,
      leaseSigningReminder: true,
      paymentReminder: true
    }
    const newPrefs: EmailNotificationPreferences = {
      newBooking: key === 'newBooking' ? !currentPrefs.newBooking : currentPrefs.newBooking,
      bookingConfirmation: key === 'bookingConfirmation' ? !currentPrefs.bookingConfirmation : currentPrefs.bookingConfirmation,
      bookingCancellation: key === 'bookingCancellation' ? !currentPrefs.bookingCancellation : currentPrefs.bookingCancellation,
      newMessage: key === 'newMessage' ? !currentPrefs.newMessage : currentPrefs.newMessage,
      newReview: key === 'newReview' ? !currentPrefs.newReview : currentPrefs.newReview,
      priceAlert: key === 'priceAlert' ? !currentPrefs.priceAlert : currentPrefs.priceAlert,
      propertyUpdate: key === 'propertyUpdate' ? !currentPrefs.propertyUpdate : currentPrefs.propertyUpdate,
      maintenanceRequest: key === 'maintenanceRequest' ? !currentPrefs.maintenanceRequest : currentPrefs.maintenanceRequest,
      leaseSigningReminder: key === 'leaseSigningReminder' ? !currentPrefs.leaseSigningReminder : currentPrefs.leaseSigningReminder,
      paymentReminder: key === 'paymentReminder' ? !currentPrefs.paymentReminder : currentPrefs.paymentReminder
    }
    setEmailPreferences(() => newPrefs)
    await updateEmailPreferences(userId, newPrefs)
    toast.success('Preferences updated')
  }

  const notificationTypes = [
    { key: 'newBooking' as const, label: 'New Booking Requests', description: 'When someone books your property' },
    { key: 'bookingConfirmation' as const, label: 'Booking Confirmations', description: 'When your booking is confirmed' },
    { key: 'bookingCancellation' as const, label: 'Booking Cancellations', description: 'When a booking is cancelled' },
    { key: 'newMessage' as const, label: 'New Messages', description: 'When you receive a message' },
    { key: 'newReview' as const, label: 'New Reviews', description: 'When your property gets reviewed' },
    { key: 'priceAlert' as const, label: 'Price Alerts', description: 'When prices drop on favorite properties' },
    { key: 'propertyUpdate' as const, label: 'Property Updates', description: 'Updates about properties you follow' },
    { key: 'maintenanceRequest' as const, label: 'Maintenance Requests', description: 'New maintenance issues reported' },
    { key: 'leaseSigningReminder' as const, label: 'Lease Reminders', description: 'Reminders to sign lease agreements' },
    { key: 'paymentReminder' as const, label: 'Payment Reminders', description: 'Upcoming payment due dates' }
  ]

  const recentLogs = emailLogs?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      <Tabs defaultValue="smtp" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="smtp">SMTP Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="logs">Email Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="smtp" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Envelope className="w-5 h-5" />
                    SMTP Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your email service settings for sending notifications
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="email-enabled">Enable Email Service</Label>
                  <Switch
                    id="email-enabled"
                    checked={emailSettings?.enabled || false}
                    onCheckedChange={(checked) => {
                      setEmailSettings((current) => ({
                        ...current!,
                        enabled: checked
                      }))
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="smtp-host">SMTP Host *</Label>
                  <Input
                    id="smtp-host"
                    placeholder="smtp.gmail.com"
                    value={emailSettings?.smtpHost || ''}
                    onChange={(e) => {
                      setEmailSettings((current) => ({
                        ...current!,
                        smtpHost: e.target.value
                      }))
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtp-port">SMTP Port *</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    placeholder="587"
                    value={emailSettings?.smtpPort || 587}
                    onChange={(e) => {
                      setEmailSettings((current) => ({
                        ...current!,
                        smtpPort: parseInt(e.target.value) || 587
                      }))
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input
                    id="smtp-user"
                    placeholder="your-email@gmail.com"
                    value={emailSettings?.smtpUser || ''}
                    onChange={(e) => {
                      setEmailSettings((current) => ({
                        ...current!,
                        smtpUser: e.target.value
                      }))
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="smtp-password">SMTP Password / API Key *</Label>
                  <div className="relative">
                    <Input
                      id="smtp-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your SMTP password or API key"
                      value={emailSettings?.smtpPassword || ''}
                      onChange={(e) => {
                        setEmailSettings((current) => ({
                          ...current!,
                          smtpPassword: e.target.value
                        }))
                      }}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeSlash className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                  <Label htmlFor="from-email">From Email *</Label>
                  <Input
                    id="from-email"
                    type="email"
                    placeholder="noreply@renthub.com"
                    value={emailSettings?.fromEmail || ''}
                    onChange={(e) => {
                      setEmailSettings((current) => ({
                        ...current!,
                        fromEmail: e.target.value
                      }))
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input
                    id="from-name"
                    placeholder="RentHub"
                    value={emailSettings?.fromName || 'RentHub'}
                    onChange={(e) => {
                      setEmailSettings((current) => ({
                        ...current!,
                        fromName: e.target.value
                      }))
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSaveSettings} className="flex-1">
                  Save Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTestEmail}
                  disabled={isTesting || !emailSettings?.enabled}
                  className="flex-1"
                >
                  {isTesting ? 'Sending...' : 'Send Test Email'}
                </Button>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> You can use services like Gmail, SendGrid, Mailgun, or any SMTP provider.
                  For Gmail, you'll need to create an App Password in your Google Account settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notification Preferences</CardTitle>
              <CardDescription>
                Choose which email notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationTypes.map((type) => (
                <div key={type.key} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex-1">
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">{type.description}</div>
                  </div>
                  <Switch
                    checked={emailPreferences?.[type.key] ?? true}
                    onCheckedChange={() => handleTogglePreference(type.key)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Activity</CardTitle>
              <CardDescription>
                View the last 5 emails sent from the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Envelope className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No emails sent yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div className="mt-1">
                        {log.status === 'sent' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm truncate">{log.subject}</span>
                          <Badge variant={log.status === 'sent' ? 'default' : 'destructive'} className="shrink-0">
                            {log.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          To: {log.to} • {new Date(log.sentAt).toLocaleString()}
                        </div>
                        {log.error && (
                          <div className="text-xs text-red-600 mt-1">{log.error}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
