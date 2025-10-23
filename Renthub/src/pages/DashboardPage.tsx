import { useMemo, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Property, Booking, Review, PropertyAnalytics, User, Notification, Voucher, VoucherUsage, LeaseAgreement, MaintenanceRequest, FilterState, BackgroundCheckRequest, InsurancePolicy, InsuranceQuote, InsuranceClaim, SmartDevice, SmartDeviceActivity } from '@/lib/types'
import { SavedSearch } from '@/components/SavedSearchesPanel'
import { MyPropertiesPanel } from '@/components/MyPropertiesPanel'
import { MyBookingsPanel } from '@/components/MyBookingsPanel'
import { MyReviewsPanel } from '@/components/MyReviewsPanel'
import { PropertyAnalyticsPanel } from '@/components/PropertyAnalyticsPanel'
import { PriceAlertsPanel } from '@/components/PriceAlertsPanel'
import { SearchAlertsManagement } from '@/components/SearchAlertsManagement'
import { VoucherManagementPanel } from '@/components/VoucherManagementPanel'
import { LeaseManagementPanel } from '@/components/LeaseManagementPanel'
import { LeaseDetailModal } from '@/components/LeaseDetailModal'
import { LeaseSigningModal } from '@/components/LeaseSigningModal'
import { MaintenanceManagementPanel } from '@/components/MaintenanceManagementPanel'
import { NotificationSummary } from '@/components/NotificationSummary'
import { AvailabilityCalendar } from '@/components/AvailabilityCalendar'
import { PriceAlert } from '@/components/PriceAlertModal'
import { PropertyManagementDashboard } from '@/components/PropertyManagementDashboard'
import { AdvancedAnalyticsDashboard } from '@/components/AdvancedAnalyticsDashboard'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Buildings, Calendar, Star, ChartBar, Bell, CalendarBlank, Ticket, FileText, Wrench, ChartLineUp, CalendarCheck, ShieldCheck, Shield, House } from '@phosphor-icons/react'
import { CalendarSyncPanel } from '@/components/CalendarSyncPanel'
import { BackgroundCheckManagementPanel } from '@/components/BackgroundCheckManagementPanel'
import { MyBackgroundChecksPanel } from '@/components/MyBackgroundChecksPanel'
import { InsuranceBrowserModal } from '@/components/InsuranceBrowserModal'
import { InsuranceQuoteModal } from '@/components/InsuranceQuoteModal'
import { InsuranceManagementPanel } from '@/components/InsuranceManagementPanel'
import { SmartHomeManagementPanel } from '@/components/SmartHomeManagementPanel'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

interface DashboardPageProps {
  user: User
  properties: Property[]
  bookings: Booking[]
  reviews: Review[]
  analytics: Record<string, PropertyAnalytics>
  favorites: string[]
  vouchers?: Voucher[]
  voucherUsages?: VoucherUsage[]
  leases?: LeaseAgreement[]
  maintenanceRequests?: MaintenanceRequest[]
  backgroundChecks?: BackgroundCheckRequest[]
  insurancePolicies?: InsurancePolicy[]
  insuranceQuotes?: InsuranceQuote[]
  insuranceClaims?: InsuranceClaim[]
  smartDevices?: SmartDevice[]
  deviceActivities?: SmartDeviceActivity[]
  onViewProperty: (property: Property) => void
  onDeleteProperty: (id: string) => void
  onTogglePropertyAvailability: (id: string) => void
  onCancelBooking: (id: string) => void
  onDeleteReview: (id: string) => void
  onUpdatePropertyAvailability?: (propertyId: string, blockedDates: number[]) => void
  onCreateVoucher?: (voucher: Omit<Voucher, 'id' | 'createdAt' | 'currentUses' | 'usedBy'>) => void
  onToggleVoucherActive?: (voucherId: string, active: boolean) => void
  onDeleteVoucher?: (voucherId: string) => void
  onSignLease?: (leaseId: string, signature: string) => void
  onDownloadLease?: (leaseId: string) => void
  onViewMaintenanceRequest?: (request: MaintenanceRequest) => void
  onCreateMaintenanceRequest?: () => void
  onRequestBackgroundCheck?: (request: Omit<BackgroundCheckRequest, 'id' | 'createdAt' | 'updatedAt'>) => void
  onAcceptInsuranceQuote?: (quote: InsuranceQuote) => void
  onViewInsurancePolicy?: (policy: InsurancePolicy) => void
  onViewInsuranceClaim?: (claim: InsuranceClaim) => void
  onFileInsuranceClaim?: () => void
  onUpdateSmartDevice?: (device: SmartDevice) => void
  onAddSmartDevice?: (device: Omit<SmartDevice, 'id' | 'lastUpdated' | 'installedAt'>) => void
  onRemoveSmartDevice?: (deviceId: string) => void
  onSmartDeviceAction?: (deviceId: string, action: string, value?: any) => void
  onGenerateAccessCode?: (bookingId: string) => void
  onCompleteCheckIn?: (bookingId: string) => void
  onSaveLockboxSettings?: (propertyId: string, lockboxInfo: any) => void
}

export function DashboardPage({
  user,
  properties,
  bookings,
  reviews,
  analytics,
  favorites,
  vouchers = [],
  voucherUsages = [],
  leases = [],
  maintenanceRequests = [],
  backgroundChecks = [],
  insurancePolicies = [],
  insuranceQuotes = [],
  insuranceClaims = [],
  smartDevices = [],
  deviceActivities = [],
  onViewProperty,
  onDeleteProperty,
  onTogglePropertyAvailability,
  onCancelBooking,
  onDeleteReview,
  onUpdatePropertyAvailability,
  onCreateVoucher,
  onToggleVoucherActive,
  onDeleteVoucher,
  onSignLease,
  onDownloadLease,
  onViewMaintenanceRequest,
  onCreateMaintenanceRequest,
  onRequestBackgroundCheck,
  onAcceptInsuranceQuote,
  onViewInsurancePolicy,
  onViewInsuranceClaim,
  onFileInsuranceClaim,
  onUpdateSmartDevice,
  onAddSmartDevice,
  onRemoveSmartDevice,
  onSmartDeviceAction,
  onGenerateAccessCode,
  onCompleteCheckIn,
  onSaveLockboxSettings
}: DashboardPageProps) {
  const navigate = useNavigate()
  const [priceAlerts, setPriceAlerts] = useLocalStorage<PriceAlert[]>('price-alerts', [])
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('saved-searches', [])
  const [notifications] = useLocalStorage<Notification[]>('notifications', [])
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedLease, setSelectedLease] = useState<LeaseAgreement | null>(null)
  const [showLeaseDetail, setShowLeaseDetail] = useState(false)
  const [showLeaseSigning, setShowLeaseSigning] = useState(false)
  const [showInsuranceBrowser, setShowInsuranceBrowser] = useState(false)
  const [selectedInsurancePlan, setSelectedInsurancePlan] = useState<any>(null)
  const [showInsuranceQuote, setShowInsuranceQuote] = useState(false)

  const myProperties = useMemo(() => {
    return properties.filter(p => p.landlord?.id === user.id)
  }, [properties, user.id])

  const myBookings = useMemo(() => {
    return bookings.filter(b => b.userId === user.id)
  }, [bookings, user.id])

  const myReviews = useMemo(() => {
    return reviews.filter(r => r.userId === user.id)
  }, [reviews, user.id])

  const myPropertyAnalytics = useMemo(() => {
    const result: Record<string, PropertyAnalytics> = {}
    myProperties.forEach(p => {
      if (analytics[p.id]) {
        result[p.id] = analytics[p.id]
      }
    })
    return result
  }, [myProperties, analytics])

  const handleDeleteAlert = (alertId: string) => {
    setPriceAlerts((current) => (current || []).filter(a => a.id !== alertId))
    toast.success('Price alert deleted')
  }

  const handleToggleAlert = (alertId: string) => {
    setPriceAlerts((current) =>
      (current || []).map(a =>
        a.id === alertId ? { ...a, active: !a.active } : a
      )
    )
    toast.success('Price alert updated')
  }

  const handleUpdateSearch = (searchId: string, updates: Partial<SavedSearch>) => {
    setSavedSearches((current) =>
      (current || []).map(s =>
        s.id === searchId ? { ...s, ...updates } : s
      )
    )
  }

  const handleDeleteSearch = (searchId: string) => {
    setSavedSearches((current) => (current || []).filter(s => s.id !== searchId))
  }

  const handleLoadSearch = (filters: FilterState) => {
    navigate('/', { state: { filters } })
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.propertyId) {
      const property = properties.find(p => p.id === notification.propertyId)
      if (property) {
        onViewProperty(property)
      }
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, <span className="font-semibold text-foreground">{user.login}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Buildings size={24} className="text-primary" />
              <Badge variant="secondary">{myProperties.length}</Badge>
            </div>
            <h3 className="text-2xl font-bold">{myProperties.length}</h3>
            <p className="text-sm text-muted-foreground">My Properties</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar size={24} className="text-accent" />
              <Badge variant="secondary">{myBookings.length}</Badge>
            </div>
            <h3 className="text-2xl font-bold">{myBookings.length}</h3>
            <p className="text-sm text-muted-foreground">My Bookings</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Star size={24} className="text-yellow-500" weight="fill" />
              <Badge variant="secondary">{myReviews.length}</Badge>
            </div>
            <h3 className="text-2xl font-bold">{myReviews.length}</h3>
            <p className="text-sm text-muted-foreground">My Reviews</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <ChartBar size={24} className="text-blue-500" weight="fill" />
              <Badge variant="secondary">
                {Object.values(myPropertyAnalytics).reduce((sum, a) => sum + (a.views || 0), 0)}
              </Badge>
            </div>
            <h3 className="text-2xl font-bold">
              {Object.values(myPropertyAnalytics).reduce((sum, a) => sum + (a.views || 0), 0)}
            </h3>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <NotificationSummary
              userId={user.id}
              notifications={notifications || []}
              onViewAll={() => setShowNotifications(true)}
              onNotificationClick={handleNotificationClick}
            />
          </div>
          <div>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold">
                    {(priceAlerts || []).filter(a => a.active).length + (savedSearches || []).filter(s => s.alertEnabled).length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Unread Notifications</p>
                  <p className="text-3xl font-bold">
                    {(notifications || []).filter(n => n.userId === user.id && !n.read).length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="w-full overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="inline-flex w-auto min-w-full sm:min-w-0 h-auto flex-wrap sm:flex-nowrap gap-1 p-1">
              <TabsTrigger value="overview" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <ChartLineUp size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="properties" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <Buildings size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Properties</span>
              </TabsTrigger>
              <TabsTrigger value="smart-home" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <House size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Smart Home</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <Calendar size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="calendar-sync" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <CalendarCheck size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Sync</span>
              </TabsTrigger>
              <TabsTrigger value="leases" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <FileText size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Leases</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <Wrench size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Maintenance</span>
              </TabsTrigger>
              <TabsTrigger value="background-checks" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <ShieldCheck size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Screening</span>
              </TabsTrigger>
              <TabsTrigger value="insurance" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <Shield size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" weight="fill" />
                <span>Insurance</span>
              </TabsTrigger>
              <TabsTrigger value="availability" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <CalendarBlank size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="vouchers" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <Ticket size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Vouchers</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <Star size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <ChartBar size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="text-[0.7rem] sm:text-xs lg:text-sm whitespace-nowrap px-2 sm:px-3 h-8 sm:h-9">
                <Bell size={14} className="mr-1 sm:mr-1.5 flex-shrink-0" />
                <span>Alerts</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <PropertyManagementDashboard
              properties={myProperties}
              bookings={bookings}
              reviews={reviews}
              analytics={analytics}
              maintenanceRequests={maintenanceRequests}
              leases={leases}
              user={user}
              onViewProperty={onViewProperty}
              onViewMaintenanceRequest={onViewMaintenanceRequest}
            />
          </TabsContent>

          <TabsContent value="properties">
            <MyPropertiesPanel
              properties={myProperties}
              analytics={analytics}
              bookings={bookings}
              currentUserId={user.id}
              onViewProperty={onViewProperty}
              onDeleteProperty={onDeleteProperty}
              onToggleAvailability={onTogglePropertyAvailability}
            />
          </TabsContent>

          <TabsContent value="smart-home">
            {onUpdateSmartDevice && onAddSmartDevice && onRemoveSmartDevice && onSmartDeviceAction ? (
              <SmartHomeManagementPanel
                properties={myProperties}
                devices={smartDevices}
                activities={deviceActivities}
                currentUser={user}
                onUpdateDevice={onUpdateSmartDevice}
                onAddDevice={onAddSmartDevice}
                onRemoveDevice={onRemoveSmartDevice}
                onDeviceAction={onSmartDeviceAction}
              />
            ) : (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <House className="w-12 h-12 mx-auto mb-4" />
                  <p>Smart Home management is not available</p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            <MyBookingsPanel
              bookings={myBookings}
              properties={properties}
              onViewProperty={onViewProperty}
              onCancelBooking={onCancelBooking}
              onGenerateAccessCode={onGenerateAccessCode}
              onCompleteCheckIn={onCompleteCheckIn}
            />
          </TabsContent>

          <TabsContent value="calendar-sync">
            <CalendarSyncPanel
              bookings={myBookings}
              properties={properties}
              userId={user.id}
            />
          </TabsContent>

          <TabsContent value="leases">
            <LeaseManagementPanel
              leases={leases.filter(l => l.landlordId === user.id || l.tenantId === user.id)}
              userId={user.id}
              userRole={
                leases.some(l => l.landlordId === user.id) && leases.some(l => l.tenantId === user.id)
                  ? 'both'
                  : leases.some(l => l.landlordId === user.id)
                  ? 'landlord'
                  : 'tenant'
              }
              onViewLease={(lease) => {
                setSelectedLease(lease)
                setShowLeaseDetail(true)
              }}
              onSignLease={(leaseId) => {
                const lease = leases.find(l => l.id === leaseId)
                if (lease) {
                  setSelectedLease(lease)
                  setShowLeaseSigning(true)
                }
              }}
              onDownloadLease={(leaseId) => {
                if (onDownloadLease) {
                  onDownloadLease(leaseId)
                }
              }}
            />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceManagementPanel
              requests={maintenanceRequests}
              user={user}
              properties={properties}
              onViewRequest={onViewMaintenanceRequest || (() => {})}
              onCreateRequest={onCreateMaintenanceRequest}
            />
          </TabsContent>

          <TabsContent value="background-checks">
            {myProperties.length > 0 ? (
              <BackgroundCheckManagementPanel
                checks={backgroundChecks.filter(c => 
                  myProperties.some(p => p.landlord?.id === user.id)
                )}
                onViewCheck={() => {}}
              />
            ) : (
              <MyBackgroundChecksPanel
                checks={backgroundChecks.filter(c => c.userId === user.id)}
                currentUser={user}
                onSubmitRequest={(request) => {
                  if (onRequestBackgroundCheck) {
                    onRequestBackgroundCheck(request)
                  }
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="insurance">
            <InsuranceManagementPanel
              policies={insurancePolicies}
              quotes={insuranceQuotes}
              claims={insuranceClaims}
              userType={myProperties.length > 0 ? 'landlord' : 'tenant'}
              onBrowseInsurance={() => setShowInsuranceBrowser(true)}
              onViewPolicy={onViewInsurancePolicy || (() => {})}
              onViewClaim={onViewInsuranceClaim || (() => {})}
              onFileClaim={onFileInsuranceClaim || (() => {})}
            />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilityCalendar
              properties={myProperties}
              bookings={bookings.filter(b => 
                myProperties.some(p => p.id === b.propertyId)
              )}
              onUpdateAvailability={(propertyId, blockedDates) => {
                if (onUpdatePropertyAvailability) {
                  onUpdatePropertyAvailability(propertyId, blockedDates)
                }
              }}
            />
          </TabsContent>

          <TabsContent value="vouchers">
            {onCreateVoucher && onToggleVoucherActive && onDeleteVoucher ? (
              <VoucherManagementPanel
                user={user}
                vouchers={vouchers}
                voucherUsages={voucherUsages}
                onCreateVoucher={onCreateVoucher}
                onToggleActive={onToggleVoucherActive}
                onDeleteVoucher={onDeleteVoucher}
              />
            ) : (
              <Card className="p-12">
                <div className="text-center text-muted-foreground">
                  <Ticket className="w-12 h-12 mx-auto mb-4" />
                  <p>Voucher management is not available</p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <MyReviewsPanel
              reviews={myReviews}
              properties={properties}
              currentUserName={user.login}
              onViewProperty={onViewProperty}
              onDeleteReview={onDeleteReview}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalyticsDashboard
              properties={myProperties}
              bookings={bookings.filter(b => 
                myProperties.some(p => p.id === b.propertyId)
              )}
              reviews={reviews.filter(r =>
                myProperties.some(p => p.id === r.propertyId)
              )}
              analytics={analytics}
            />
          </TabsContent>

          <TabsContent value="alerts">
            <div className="space-y-6">
              <SearchAlertsManagement
                searches={savedSearches || []}
                onUpdateSearch={handleUpdateSearch}
                onDeleteSearch={handleDeleteSearch}
                onLoadSearch={handleLoadSearch}
              />
              <PriceAlertsPanel
                alerts={priceAlerts || []}
                properties={properties}
                onDeleteAlert={handleDeleteAlert}
                onToggleAlert={handleToggleAlert}
                onViewProperty={(propertyId) => {
                  const property = properties.find(p => p.id === propertyId)
                  if (property) onViewProperty(property)
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <LeaseDetailModal
          lease={selectedLease}
          open={showLeaseDetail}
          onClose={() => {
            setShowLeaseDetail(false)
            setSelectedLease(null)
          }}
          currentUserId={user.id}
          onSign={() => {
            setShowLeaseDetail(false)
            setShowLeaseSigning(true)
          }}
          onDownload={() => {
            if (selectedLease && onDownloadLease) {
              onDownloadLease(selectedLease.id)
            }
          }}
        />

        <LeaseSigningModal
          lease={selectedLease}
          open={showLeaseSigning}
          onClose={() => {
            setShowLeaseSigning(false)
            setSelectedLease(null)
          }}
          onSign={(signature) => {
            if (selectedLease && onSignLease) {
              onSignLease(selectedLease.id, signature)
              setShowLeaseSigning(false)
              setSelectedLease(null)
            }
          }}
          currentUserId={user.id}
        />

        <InsuranceBrowserModal
          open={showInsuranceBrowser}
          onClose={() => setShowInsuranceBrowser(false)}
          userType={myProperties.length > 0 ? 'landlord' : 'tenant'}
          onSelectPlan={(plan) => {
            setSelectedInsurancePlan(plan)
            setShowInsuranceBrowser(false)
            setShowInsuranceQuote(true)
          }}
        />

        {selectedInsurancePlan && (
          <InsuranceQuoteModal
            open={showInsuranceQuote}
            onClose={() => {
              setShowInsuranceQuote(false)
              setSelectedInsurancePlan(null)
            }}
            plan={selectedInsurancePlan}
            onAcceptQuote={(quote) => {
              if (onAcceptInsuranceQuote) {
                onAcceptInsuranceQuote(quote)
              }
              setShowInsuranceQuote(false)
              setSelectedInsurancePlan(null)
            }}
          />
        )}
      </motion.div>
    </div>
  )
}
