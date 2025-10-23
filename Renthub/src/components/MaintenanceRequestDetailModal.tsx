import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MaintenanceRequest, User } from '@/lib/types'
import { Clock, CheckCircle, XCircle, Calendar, MapPin, User as UserIcon, Phone, Envelope, Image as ImageIcon, ChatCircle, Plus, ArrowRight } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MaintenanceRequestDetailModalProps {
  request: MaintenanceRequest | null
  open: boolean
  onClose: () => void
  currentUser: User | null
  onUpdateStatus: (requestId: string, status: MaintenanceRequest['status'], notes?: string) => void
  onAddUpdate: (requestId: string, message: string, photos?: string[]) => void
  onSchedule: (requestId: string, scheduledDate: number) => void
  onComplete: (requestId: string, completionNotes: string, photos?: string[]) => void
  onApprove: (requestId: string, approved: boolean, feedback?: string, rating?: number) => void
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

export function MaintenanceRequestDetailModal({
  request,
  open,
  onClose,
  currentUser,
  onUpdateStatus,
  onAddUpdate,
  onSchedule,
  onComplete,
  onApprove
}: MaintenanceRequestDetailModalProps) {
  const [updateMessage, setUpdateMessage] = useState('')
  const [newStatus, setNewStatus] = useState<MaintenanceRequest['status']>('submitted')
  const [scheduledDate, setScheduledDate] = useState('')
  const [completionNotes, setCompletionNotes] = useState('')
  const [approvalFeedback, setApprovalFeedback] = useState('')
  const [approvalRating, setApprovalRating] = useState(5)

  if (!request) return null

  const isLandlord = currentUser?.id === request.landlordId
  const isTenant = currentUser?.id === request.tenantId

  const handleAddUpdate = () => {
    if (!updateMessage.trim()) {
      toast.error('Please enter an update message')
      return
    }

    onAddUpdate(request.id, updateMessage.trim())
    setUpdateMessage('')
    toast.success('Update added')
  }

  const handleUpdateStatus = () => {
    onUpdateStatus(request.id, newStatus)
    toast.success('Status updated')
  }

  const handleSchedule = () => {
    if (!scheduledDate) {
      toast.error('Please select a date')
      return
    }

    const timestamp = new Date(scheduledDate).getTime()
    onSchedule(request.id, timestamp)
    toast.success('Maintenance scheduled')
  }

  const handleComplete = () => {
    if (!completionNotes.trim()) {
      toast.error('Please add completion notes')
      return
    }

    onComplete(request.id, completionNotes.trim())
    setCompletionNotes('')
    toast.success('Request marked as completed')
  }

  const handleApprove = (approved: boolean) => {
    onApprove(request.id, approved, approvalFeedback.trim() || undefined, approvalRating)
    setApprovalFeedback('')
    toast.success(approved ? 'Work approved' : 'Approval declined')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{request.title}</DialogTitle>
              <DialogDescription className="mt-1">
                Request #{request.id.split('-')[1]} • {format(request.createdAt, 'MMM d, yyyy')}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={`${PRIORITY_COLORS[request.priority]} text-white`}>
                {request.priority.toUpperCase()}
              </Badge>
              <Badge className={`${STATUS_COLORS[request.status]} text-white`}>
                {STATUS_LABELS[request.status]}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-12rem)]">
          <div className="space-y-6 pr-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Property</div>
                <div className="font-medium">{request.propertyTitle}</div>
                {request.propertyAddress && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin size={14} />
                    {request.propertyAddress}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Location in Property</div>
                <div className="font-medium">{request.location}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Category</div>
                <div className="font-medium capitalize">{request.category.replace('_', ' ')}</div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Priority</div>
                <div className="font-medium capitalize">{request.priority}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Description</div>
              <div className="text-sm leading-relaxed">{request.description}</div>
            </div>

            {request.photos && request.photos.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ImageIcon size={16} />
                  Photos ({request.photos.length})
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {request.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-3">
              <div className="text-sm font-medium">Contact Information</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Tenant</div>
                  <div className="flex items-center gap-2">
                    <UserIcon size={16} />
                    <span className="text-sm">{request.tenantName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Envelope size={16} />
                    <span className="text-sm">{request.tenantEmail}</span>
                  </div>
                  {request.tenantPhone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span className="text-sm">{request.tenantPhone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Landlord</div>
                  <div className="flex items-center gap-2">
                    <UserIcon size={16} />
                    <span className="text-sm">{request.landlordName}</span>
                  </div>
                </div>
              </div>
            </div>

            {(request.preferredAccessTime || request.accessInstructions || request.permissionToEnter) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="text-sm font-medium">Access Information</div>
                  {request.preferredAccessTime && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">Preferred Access Time</div>
                      <div className="text-sm flex items-center gap-2">
                        <Clock size={16} />
                        {request.preferredAccessTime}
                      </div>
                    </div>
                  )}
                  {request.accessInstructions && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">Access Instructions</div>
                      <div className="text-sm">{request.accessInstructions}</div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground">Permission to Enter</div>
                    <div className="text-sm">
                      {request.permissionToEnter ? (
                        <span className="text-green-600">✓ Granted</span>
                      ) : (
                        <span className="text-red-600">✗ Not granted</span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {request.scheduledDate && (
              <>
                <Separator />
                <div className="space-y-1">
                  <div className="text-sm font-medium text-muted-foreground">Scheduled Date</div>
                  <div className="text-sm font-medium flex items-center gap-2">
                    <Calendar size={16} />
                    {format(request.scheduledDate, 'EEEE, MMMM d, yyyy')}
                  </div>
                </div>
              </>
            )}

            {request.updates.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="text-sm font-medium flex items-center gap-2">
                    <ChatCircle size={16} />
                    Updates ({request.updates.length})
                  </div>
                  <div className="space-y-3">
                    {request.updates.map((update) => (
                      <div key={update.id} className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{update.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(update.timestamp, 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <div className="text-sm">{update.message}</div>
                        {update.status && (
                          <Badge variant="outline" className="text-xs">
                            Status: {STATUS_LABELS[update.status]}
                          </Badge>
                        )}
                        {update.photos && update.photos.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {update.photos.map((photo, idx) => (
                              <img
                                key={idx}
                                src={photo}
                                alt={`Update photo ${idx + 1}`}
                                className="w-full h-20 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {request.status === 'completed' && request.completionNotes && (
              <>
                <Separator />
                <div className="space-y-2 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle size={16} weight="fill" />
                    Completion Notes
                  </div>
                  <div className="text-sm">{request.completionNotes}</div>
                  {request.completionPhotos && request.completionPhotos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {request.completionPhotos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt={`Completion photo ${idx + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                  {request.completedAt && (
                    <div className="text-xs text-muted-foreground">
                      Completed on {format(request.completedAt, 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              </>
            )}

            {isLandlord && request.status !== 'completed' && request.status !== 'cancelled' && (
              <>
                <Separator />
                <div className="space-y-4 bg-secondary/30 p-4 rounded-lg">
                  <div className="text-sm font-medium">Landlord Actions</div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Update Status</Label>
                      <div className="flex gap-2">
                        <Select value={newStatus} onValueChange={(value) => setNewStatus(value as MaintenanceRequest['status'])}>
                          <SelectTrigger className="flex-1" aria-label="Update status">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acknowledged">Acknowledged</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button onClick={handleUpdateStatus} size="sm">
                          Update
                        </Button>
                      </div>
                    </div>

                    {(newStatus === 'scheduled' || request.status === 'scheduled') && (
                      <div className="space-y-2">
                        <Label>Schedule Date</Label>
                        <div className="flex gap-2">
                          <Input
                            type="datetime-local"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                          />
                          <Button onClick={handleSchedule} size="sm">
                            <Calendar size={16} />
                            Set
                          </Button>
                        </div>
                      </div>
                    )}

                    {newStatus === 'completed' && (
                      <div className="space-y-2">
                        <Label>Completion Notes *</Label>
                        <Textarea
                          placeholder="Describe the work that was completed..."
                          value={completionNotes}
                          onChange={(e) => setCompletionNotes(e.target.value)}
                          rows={3}
                        />
                        <Button onClick={handleComplete} className="w-full">
                          <CheckCircle size={16} />
                          Mark as Completed
                        </Button>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Add Update</Label>
                      <Textarea
                        placeholder="Share an update with the tenant..."
                        value={updateMessage}
                        onChange={(e) => setUpdateMessage(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={handleAddUpdate} variant="outline" className="w-full">
                        <Plus size={16} />
                        Add Update
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isTenant && request.status === 'completed' && !request.tenantApproval && (
              <>
                <Separator />
                <div className="space-y-4 bg-secondary/30 p-4 rounded-lg">
                  <div className="text-sm font-medium">Tenant Approval</div>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <Select value={String(approvalRating)} onValueChange={(value) => setApprovalRating(Number(value))}>
                        <SelectTrigger aria-label="Rating">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                          <SelectItem value="2">⭐⭐ Poor</SelectItem>
                          <SelectItem value="1">⭐ Very Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Feedback (Optional)</Label>
                      <Textarea
                        placeholder="Any additional feedback about the work completed..."
                        value={approvalFeedback}
                        onChange={(e) => setApprovalFeedback(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => handleApprove(true)} className="flex-1">
                        <CheckCircle size={16} />
                        Approve
                      </Button>
                      <Button onClick={() => handleApprove(false)} variant="outline" className="flex-1">
                        <XCircle size={16} />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {request.tenantApproval && (
              <>
                <Separator />
                <div className={`space-y-2 p-4 rounded-lg border ${
                  request.tenantApproval.approved
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
                }`}>
                  <div className={`text-sm font-medium flex items-center gap-2 ${
                    request.tenantApproval.approved
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-red-700 dark:text-red-400'
                  }`}>
                    {request.tenantApproval.approved ? (
                      <>
                        <CheckCircle size={16} weight="fill" />
                        Work Approved
                      </>
                    ) : (
                      <>
                        <XCircle size={16} weight="fill" />
                        Approval Declined
                      </>
                    )}
                  </div>
                  {request.tenantApproval.rating && (
                    <div className="text-sm">
                      Rating: {'⭐'.repeat(request.tenantApproval.rating)}
                    </div>
                  )}
                  {request.tenantApproval.feedback && (
                    <div className="text-sm">{request.tenantApproval.feedback}</div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {format(request.tenantApproval.approvedAt, 'MMM d, yyyy')}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
