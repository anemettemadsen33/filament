import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MaintenanceRequest, User, Property } from '@/lib/types'
import { Wrench, Clock, CheckCircle, XCircle, Calendar, ArrowRight, FunnelSimple, SortAscending } from '@phosphor-icons/react'
import { format } from 'date-fns'

interface MaintenanceManagementPanelProps {
  requests: MaintenanceRequest[]
  user: User
  properties: Property[]
  onViewRequest: (request: MaintenanceRequest) => void
  onCreateRequest?: () => void
}

const STATUS_COLORS = {
  submitted: 'bg-blue-500',
  acknowledged: 'bg-purple-500',
  in_progress: 'bg-yellow-500',
  scheduled: 'bg-orange-500',
  completed: 'bg-green-500',
  cancelled: 'bg-gray-500'
}

const STATUS_LABELS = {
  submitted: 'Submitted',
  acknowledged: 'Acknowledged',
  in_progress: 'In Progress',
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled'
}

const PRIORITY_COLORS = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
}

const STATUS_ICONS = {
  submitted: Clock,
  acknowledged: Clock,
  in_progress: Wrench,
  scheduled: Calendar,
  completed: CheckCircle,
  cancelled: XCircle
}

export function MaintenanceManagementPanel({
  requests,
  user,
  properties,
  onViewRequest,
  onCreateRequest
}: MaintenanceManagementPanelProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterProperty, setFilterProperty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status'>('date')

  const isLandlord = properties.some(p => {
    const landlordId = p.landlord?.id || `landlord-${p.id}`
    return landlordId === user.id
  })

  const tenantRequests = requests.filter(r => r.tenantId === user.id)
  const landlordRequests = requests.filter(r => r.landlordId === user.id)

  const filterRequests = (reqs: MaintenanceRequest[]) => {
    let filtered = reqs

    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus)
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(r => r.priority === filterPriority)
    }

    if (filterProperty !== 'all') {
      filtered = filtered.filter(r => r.propertyId === filterProperty)
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return b.createdAt - a.createdAt
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      } else {
        const statusOrder = { submitted: 0, acknowledged: 1, scheduled: 2, in_progress: 3, completed: 4, cancelled: 5 }
        return statusOrder[a.status] - statusOrder[b.status]
      }
    })

    return filtered
  }

  const activeRequests = requests.filter(r => 
    r.status !== 'completed' && r.status !== 'cancelled'
  )

  const urgentRequests = requests.filter(r => 
    r.priority === 'urgent' && r.status !== 'completed' && r.status !== 'cancelled'
  )

  const awaitingApproval = requests.filter(r =>
    r.status === 'completed' && !r.tenantApproval && r.tenantId === user.id
  )

  const RequestCard = ({ request }: { request: MaintenanceRequest }) => {
    const StatusIcon = STATUS_ICONS[request.status]
    const isOverdue = request.scheduledDate && request.scheduledDate < Date.now() && request.status !== 'completed'

    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewRequest(request)}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{request.title}</h3>
                <p className="text-sm text-muted-foreground">{request.propertyTitle}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Badge className={`${PRIORITY_COLORS[request.priority]} text-white text-xs`}>
                  {request.priority}
                </Badge>
                <Badge className={`${STATUS_COLORS[request.status]} text-white text-xs`}>
                  <StatusIcon size={12} weight="fill" className="mr-1" />
                  {STATUS_LABELS[request.status]}
                </Badge>
              </div>
            </div>

            <p className="text-sm line-clamp-2">{request.description}</p>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="capitalize">{request.category.replace('_', ' ')}</span>
                <span>•</span>
                <span>{request.location}</span>
              </div>
              <span>{format(request.createdAt, 'MMM d, yyyy')}</span>
            </div>

            {request.scheduledDate && (
              <div className={`flex items-center gap-2 text-sm ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                <Calendar size={16} />
                <span>
                  Scheduled: {format(request.scheduledDate, 'MMM d, h:mm a')}
                  {isOverdue && <span className="ml-2 font-medium">(Overdue)</span>}
                </span>
              </div>
            )}

            {request.updates.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {request.updates.length} update{request.updates.length !== 1 ? 's' : ''}
              </div>
            )}

            {request.tenantApproval && (
              <div className={`text-sm font-medium ${
                request.tenantApproval.approved ? 'text-green-600' : 'text-red-600'
              }`}>
                {request.tenantApproval.approved ? '✓ Approved' : '✗ Approval Declined'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Maintenance Requests</h2>
          <p className="text-muted-foreground mt-1">
            Manage and track maintenance issues
          </p>
        </div>
        {onCreateRequest && (
          <Button onClick={onCreateRequest}>
            <Wrench size={20} />
            New Request
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                <p className="text-3xl font-bold mt-1">{activeRequests.length}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Wrench size={24} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Urgent</p>
                <p className="text-3xl font-bold mt-1">{urgentRequests.length}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-full">
                <Clock size={24} className="text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Awaiting Approval</p>
                <p className="text-3xl font-bold mt-1">{awaitingApproval.length}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>All Requests</CardTitle>
              <CardDescription>View and manage all maintenance requests</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]" aria-label="Filter status">
                  <FunnelSimple size={16} className="mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[150px]" aria-label="Filter priority">
                  <FunnelSimple size={16} className="mr-2" />
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                <SelectTrigger className="w-[150px]" aria-label="Sort by">
                  <SortAscending size={16} className="mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={isLandlord ? 'landlord' : 'tenant'}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tenant">
                My Requests ({tenantRequests.length})
              </TabsTrigger>
              {isLandlord && (
                <TabsTrigger value="landlord">
                  Property Requests ({landlordRequests.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="tenant" className="space-y-4 mt-6">
              {filterRequests(tenantRequests).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Wrench size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No maintenance requests</h3>
                  <p className="text-muted-foreground mb-4">
                    {onCreateRequest ? "Create your first maintenance request" : "You haven't submitted any maintenance requests yet"}
                  </p>
                  {onCreateRequest && (
                    <Button onClick={onCreateRequest}>
                      <Wrench size={16} />
                      Create Request
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filterRequests(tenantRequests).map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>

            {isLandlord && (
              <TabsContent value="landlord" className="space-y-4 mt-6">
                {filterRequests(landlordRequests).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Wrench size={32} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No maintenance requests</h3>
                    <p className="text-muted-foreground">
                      No maintenance requests for your properties
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filterRequests(landlordRequests).map((request) => (
                      <RequestCard key={request.id} request={request} />
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
