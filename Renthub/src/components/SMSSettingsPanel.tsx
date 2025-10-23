import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { DeviceMobileCamera, CheckCircle, XCircle } from '@phosphor-icons/react'
import { SMSSettings, SMSNotificationPreferences } from '@/lib/smsService'

interface SMSSettingsPanelProps {
  userId: string
  onSettingsUpdate?: () => void
}

export function SMSSettingsPanel({ userId, onSettingsUpdate }: SMSSettingsPanelProps) {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SMSSettings>({
    apiKey: '',
    apiSecret: '',
    senderId: '',
    enabled: false
  })
  const [preferences, setPreferences] = useState<SMSNotificationPreferences>({
    urgentBooking: true,
    bookingConfirmation: true,
    urgentMaintenance: true,
    checkInReminder: true,
    checkOutReminder: true,
    paymentDue: true
  })
  const [logs, setLogs] = useState<any[]>([])
  const [showLogs, setShowLogs] = useState(false)

  useEffect(() => {
    loadSettings()
    loadPreferences()
    loadLogs()
  }, [userId])

  const loadSettings = async () => {
    try {
      const saved = await window.spark.kv.get<SMSSettings>('sms-settings')
      if (saved) {
        setSettings(saved)
      }
    } catch (error) {
      console.error('Failed to load SMS settings:', error)
    }
  }

  const loadPreferences = async () => {
    try {
      const saved = await window.spark.kv.get<SMSNotificationPreferences>(`sms-prefs-${userId}`)
      if (saved) {
        setPreferences(saved)
      }
    } catch (error) {
      console.error('Failed to load SMS preferences:', error)
    }
  }

  const loadLogs = async () => {
    try {
      const saved = await window.spark.kv.get<any[]>('sms-logs')
      if (saved) {
        setLogs(saved.slice(0, 10))
      }
    } catch (error) {
      console.error('Failed to load SMS logs:', error)
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      await window.spark.kv.set('sms-settings', settings)
      toast.success('SMS settings saved successfully!')
      onSettingsUpdate?.()
    } catch (error) {
      console.error('Failed to save SMS settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    setLoading(true)
    try {
      await window.spark.kv.set(`sms-prefs-${userId}`, preferences)
      toast.success('SMS preferences saved successfully!')
      onSettingsUpdate?.()
    } catch (error) {
      console.error('Failed to save SMS preferences:', error)
      toast.error('Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  const handleTestSMS = async () => {
    if (!settings.enabled) {
      toast.error('Please enable SMS service first')
      return
    }

    setLoading(true)
    try {
      toast.info('Test SMS feature coming soon. In production, this would send a test message.')
      await loadLogs()
    } catch (error) {
      console.error('Failed to send test SMS:', error)
      toast.error('Failed to send test SMS')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DeviceMobileCamera className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>SMS Configuration</CardTitle>
                <CardDescription>
                  Configure SMS provider settings (Twilio, Nexmo, etc.)
                </CardDescription>
              </div>
            </div>
            <Badge variant={settings.enabled ? 'default' : 'secondary'}>
              {settings.enabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Enable SMS Service</Label>
                <p className="text-sm text-muted-foreground">
                  Activate SMS notifications for urgent events
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sms-api-key">API Key</Label>
                <Input
                  id="sms-api-key"
                  type="password"
                  placeholder="Enter your SMS provider API key"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Your Twilio Account SID or provider API key
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sms-api-secret">API Secret</Label>
                <Input
                  id="sms-api-secret"
                  type="password"
                  placeholder="Enter your API secret"
                  value={settings.apiSecret}
                  onChange={(e) => setSettings({ ...settings, apiSecret: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  Your Auth Token or API secret key
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sms-sender-id">Sender ID / Phone Number</Label>
              <Input
                id="sms-sender-id"
                type="text"
                placeholder="+1234567890 or RentHub"
                value={settings.senderId}
                onChange={(e) => setSettings({ ...settings, senderId: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Your verified phone number or approved sender ID
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSaveSettings} disabled={loading}>
              Save SMS Settings
            </Button>
            <Button variant="outline" onClick={handleTestSMS} disabled={loading || !settings.enabled}>
              Send Test SMS
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notification Preferences</CardTitle>
          <CardDescription>
            Choose which events trigger SMS notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">🚨 Urgent Bookings</Label>
                <p className="text-xs text-muted-foreground">
                  Check-ins within 24 hours
                </p>
              </div>
              <Switch
                checked={preferences.urgentBooking}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, urgentBooking: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">✅ Booking Confirmations</Label>
                <p className="text-xs text-muted-foreground">
                  New booking confirmations for guests
                </p>
              </div>
              <Switch
                checked={preferences.bookingConfirmation}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, bookingConfirmation: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">🔧 Urgent Maintenance</Label>
                <p className="text-xs text-muted-foreground">
                  High-priority maintenance requests
                </p>
              </div>
              <Switch
                checked={preferences.urgentMaintenance}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, urgentMaintenance: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">📍 Check-in Reminders</Label>
                <p className="text-xs text-muted-foreground">
                  24 hours before check-in
                </p>
              </div>
              <Switch
                checked={preferences.checkInReminder}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, checkInReminder: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">📦 Check-out Reminders</Label>
                <p className="text-xs text-muted-foreground">
                  24 hours before check-out
                </p>
              </div>
              <Switch
                checked={preferences.checkOutReminder}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, checkOutReminder: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">💳 Payment Reminders</Label>
                <p className="text-xs text-muted-foreground">
                  3 days before payment due
                </p>
              </div>
              <Switch
                checked={preferences.paymentDue}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, paymentDue: checked })
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleSavePreferences} disabled={loading}>
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SMS Activity Log</CardTitle>
              <CardDescription>Recent SMS notifications sent</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowLogs(!showLogs)
                if (!showLogs) loadLogs()
              }}
            >
              {showLogs ? 'Hide' : 'Show'} Logs
            </Button>
          </div>
        </CardHeader>
        {showLogs && (
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <DeviceMobileCamera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No SMS messages sent yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className="mt-0.5">
                      {log.status === 'sent' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {log.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(log.sentAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        To: {log.to}
                      </p>
                      <p className="text-sm line-clamp-2">{log.message}</p>
                      {log.error && (
                        <p className="text-xs text-destructive mt-1">{log.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-blue-900 dark:text-blue-100">
            SMS Provider Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
          <div>
            <h4 className="font-semibold mb-2">Twilio Setup:</h4>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Sign up at twilio.com</li>
              <li>Get your Account SID (API Key)</li>
              <li>Get your Auth Token (API Secret)</li>
              <li>Purchase a phone number (Sender ID)</li>
              <li>Enter credentials above and enable the service</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Other Providers:</h4>
            <p>
              You can also use Nexmo (Vonage), AWS SNS, or any SMS gateway that provides
              a REST API. Update the API endpoint in the SMS service code accordingly.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Important Notes:</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>SMS notifications are only sent for urgent events</li>
              <li>Ensure proper phone number format (+country code)</li>
              <li>Monitor SMS usage to control costs</li>
              <li>Comply with local SMS marketing regulations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
