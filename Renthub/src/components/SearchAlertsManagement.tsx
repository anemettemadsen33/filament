import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SavedSearch, AlertFrequency } from '@/components/SavedSearchesPanel'
import { Bell, BellSlash, Trash, MagnifyingGlass, Pencil } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FilterState } from '@/lib/types'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface SearchAlertsManagementProps {
  searches: SavedSearch[]
  onUpdateSearch: (searchId: string, updates: Partial<SavedSearch>) => void
  onDeleteSearch: (searchId: string) => void
  onLoadSearch?: (filters: FilterState) => void
}

export function SearchAlertsManagement({
  searches,
  onUpdateSearch,
  onDeleteSearch,
  onLoadSearch
}: SearchAlertsManagementProps) {
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null)
  const [editAlertFrequency, setEditAlertFrequency] = useState<AlertFrequency>('instant')

  const getFilterSummary = (filters: FilterState) => {
    const parts: string[] = []
    
    if (filters.searchQuery) parts.push(`"${filters.searchQuery}"`)
    if (filters.propertyType !== 'all') parts.push(filters.propertyType)
    if (filters.rentalTerm !== 'all') {
      const termLabel = filters.rentalTerm === 'short-term' ? 'Short-term' : 'Long-term'
      parts.push(termLabel)
    }
    if (filters.minPrice > 0 || filters.maxPrice < 10000) {
      parts.push(`$${filters.minPrice}-$${filters.maxPrice}`)
    }
    if (filters.bedrooms !== 'all') parts.push(`${filters.bedrooms}+ beds`)
    
    return parts.join(' • ') || 'All properties'
  }

  const getAlertFrequencyLabel = (frequency: AlertFrequency) => {
    const labels: Record<AlertFrequency, string> = {
      instant: 'Instant',
      daily: 'Daily',
      weekly: 'Weekly',
      never: 'Never'
    }
    return labels[frequency]
  }

  const toggleAlert = (searchId: string, currentEnabled: boolean) => {
    onUpdateSearch(searchId, { alertEnabled: !currentEnabled })
    toast.success(!currentEnabled ? 'Alerts enabled' : 'Alerts disabled')
  }

  const updateFrequency = (searchId: string, frequency: AlertFrequency) => {
    onUpdateSearch(searchId, { alertFrequency: frequency })
    toast.success('Alert frequency updated')
  }

  const openEditDialog = (search: SavedSearch) => {
    setEditingSearch(search)
    setEditAlertFrequency(search.alertFrequency || 'instant')
  }

  const handleUpdateFrequency = () => {
    if (!editingSearch) return
    
    onUpdateSearch(editingSearch.id, { alertFrequency: editAlertFrequency })
    setEditingSearch(null)
    toast.success('Alert settings updated')
  }

  const activeAlerts = searches.filter(s => s.alertEnabled)
  const inactiveAlerts = searches.filter(s => !s.alertEnabled)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={24} weight="fill" className="text-primary" />
            Search Alerts
          </CardTitle>
          <CardDescription>
            Manage your saved searches and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {searches.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={64} weight="light" className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No saved searches yet</p>
              <p className="text-sm text-muted-foreground">
                Save a search from the home page to get alerts when matching properties are listed
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeAlerts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">Active Alerts ({activeAlerts.length})</h3>
                  </div>
                  <ScrollArea className="max-h-[400px] pr-4">
                    <div className="space-y-3">
                      {activeAlerts.map((search) => (
                        <Card key={search.id} className="border-primary/20">
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{search.name}</h4>
                                  <Badge variant="secondary" className="text-xs">
                                    <Bell size={12} weight="fill" className="mr-1" />
                                    {getAlertFrequencyLabel(search.alertFrequency || 'instant')}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {getFilterSummary(search.filters)}
                                </p>
                                {search.matchCount !== undefined && search.matchCount > 0 && (
                                  <Badge variant="default" className="text-xs">
                                    {search.matchCount} new {search.matchCount === 1 ? 'match' : 'matches'}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => openEditDialog(search)}
                                  aria-label="Edit alert"
                                  title="Edit alert"
                                >
                                  <Pencil size={16} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => toggleAlert(search.id, search.alertEnabled ?? true)}
                                  aria-label="Disable alert"
                                  title="Disable alert"
                                >
                                  <BellSlash size={16} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 hover:text-destructive"
                                  onClick={() => {
                                    onDeleteSearch(search.id)
                                    toast.success('Search deleted')
                                  }}
                                  aria-label="Delete alert"
                                  title="Delete alert"
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </div>
                            {onLoadSearch && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  onLoadSearch(search.filters)
                                  if (search.matchCount && search.matchCount > 0) {
                                    onUpdateSearch(search.id, { matchCount: 0 })
                                  }
                                  toast.success(`Loaded "${search.name}"`)
                                }}
                              >
                                <MagnifyingGlass size={16} weight="bold" className="mr-2" />
                                View Matches
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {inactiveAlerts.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-muted-foreground">Inactive Alerts ({inactiveAlerts.length})</h3>
                  </div>
                  <ScrollArea className="max-h-[300px] pr-4">
                    <div className="space-y-3">
                      {inactiveAlerts.map((search) => (
                        <Card key={search.id} className="opacity-60">
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold mb-1">{search.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {getFilterSummary(search.filters)}
                                </p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => toggleAlert(search.id, search.alertEnabled ?? false)}
                                  aria-label="Enable alert"
                                  title="Enable alert"
                                >
                                  <Bell size={16} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 hover:text-destructive"
                                  onClick={() => {
                                    onDeleteSearch(search.id)
                                    toast.success('Search deleted')
                                  }}
                                  aria-label="Delete alert"
                                  title="Delete alert"
                                >
                                  <Trash size={16} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingSearch} onOpenChange={(open) => !open && setEditingSearch(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Alert Settings</DialogTitle>
            <DialogDescription>
              Update notification preferences for this saved search
            </DialogDescription>
          </DialogHeader>
          {editingSearch && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Search Name</Label>
                <p className="text-sm font-semibold">{editingSearch.name}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Filters</Label>
                <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  {getFilterSummary(editingSearch.filters)}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alert-frequency" className="text-sm font-medium">
                  Alert Frequency
                </Label>
                <Select 
                  value={editAlertFrequency} 
                  onValueChange={(value) => setEditAlertFrequency(value as AlertFrequency)}
                >
                  <SelectTrigger id="alert-frequency" aria-label="Alert frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant - Get notified immediately</SelectItem>
                    <SelectItem value="daily">Daily - Once per day digest</SelectItem>
                    <SelectItem value="weekly">Weekly - Weekly summary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setEditingSearch(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateFrequency}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
