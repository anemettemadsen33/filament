import { useState } from 'react'
import { FilterState } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookmarkSimple, MagnifyingGlass, Trash, FloppyDisk, ShareNetwork, Bell, BellSlash, Pencil } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'

export type AlertFrequency = 'instant' | 'daily' | 'weekly' | 'never'

export interface SavedSearch {
  id: string
  name: string
  filters: FilterState
  createdAt: number
  alertEnabled?: boolean
  alertFrequency?: AlertFrequency
  lastAlertSent?: number
  matchCount?: number
}

interface SavedSearchesPanelProps {
  searches: SavedSearch[]
  currentFilters: FilterState
  onLoadSearch: (filters: FilterState) => void
  onSaveSearch: (search: Omit<SavedSearch, 'id' | 'createdAt'>) => void
  onDeleteSearch: (searchId: string) => void
  onUpdateSearch?: (searchId: string, updates: Partial<SavedSearch>) => void
}

export function SavedSearchesPanel({
  searches,
  currentFilters,
  onLoadSearch,
  onSaveSearch,
  onDeleteSearch,
  onUpdateSearch
}: SavedSearchesPanelProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null)
  const [searchName, setSearchName] = useState('')
  const [alertEnabled, setAlertEnabled] = useState(true)
  const [alertFrequency, setAlertFrequency] = useState<AlertFrequency>('instant')

  const handleSaveSearch = () => {
    if (!searchName.trim()) {
      toast.error('Please enter a name for your search')
      return
    }

    onSaveSearch({
      name: searchName.trim(),
      filters: currentFilters,
      alertEnabled,
      alertFrequency,
      matchCount: 0
    })

    setSearchName('')
    setAlertEnabled(true)
    setAlertFrequency('instant')
    setShowSaveDialog(false)
    toast.success(alertEnabled ? 'Search saved with alerts enabled!' : 'Search saved successfully!')
  }

  const handleEditSearch = () => {
    if (!editingSearch || !onUpdateSearch) return
    
    if (!searchName.trim()) {
      toast.error('Please enter a name for your search')
      return
    }

    onUpdateSearch(editingSearch.id, {
      name: searchName.trim(),
      alertEnabled,
      alertFrequency
    })

    setSearchName('')
    setAlertEnabled(true)
    setAlertFrequency('instant')
    setEditingSearch(null)
    setShowEditDialog(false)
    toast.success('Search updated successfully!')
  }

  const openEditDialog = (search: SavedSearch) => {
    setEditingSearch(search)
    setSearchName(search.name)
    setAlertEnabled(search.alertEnabled ?? true)
    setAlertFrequency(search.alertFrequency ?? 'instant')
    setShowEditDialog(true)
  }

  const toggleAlert = (searchId: string, currentValue: boolean) => {
    if (!onUpdateSearch) return
    
    onUpdateSearch(searchId, {
      alertEnabled: !currentValue
    })
    
    toast.success(!currentValue ? 'Alerts enabled for this search' : 'Alerts disabled for this search')
  }

  const handleShareSearch = (search: SavedSearch) => {
    const searchParams = new URLSearchParams({
      q: search.filters.searchQuery,
      type: search.filters.propertyType,
      term: search.filters.rentalTerm,
      minPrice: search.filters.minPrice.toString(),
      maxPrice: search.filters.maxPrice.toString(),
      bedrooms: search.filters.bedrooms
    })
    
    const shareUrl = `${window.location.origin}?${searchParams.toString()}`
    
    navigator.clipboard.writeText(shareUrl)
    toast.success('Search link copied to clipboard!')
  }

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

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookmarkSimple size={20} weight="fill" className="text-primary" />
              Saved Searches
            </CardTitle>
            <Button
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              className="h-8 text-xs bg-primary/10 hover:bg-primary/20 text-primary"
            >
              <FloppyDisk size={16} weight="bold" className="mr-1" />
              Save Current
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {searches.length === 0 ? (
            <div className="text-center py-8 px-4">
              <BookmarkSimple size={48} weight="light" className="mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No saved searches yet. Save your current filters to quickly access them later!
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {searches.map((search) => (
                  <Card
                    key={search.id}
                    className="group hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm line-clamp-1">
                              {search.name}
                            </h4>
                            {search.alertEnabled && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-[10px] gap-1">
                                <Bell size={10} weight="fill" />
                                {getAlertFrequencyLabel(search.alertFrequency || 'instant')}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {getFilterSummary(search.filters)}
                          </p>
                          {search.matchCount !== undefined && search.matchCount > 0 && (
                            <p className="text-xs text-primary mt-1">
                              {search.matchCount} new {search.matchCount === 1 ? 'match' : 'matches'}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {onUpdateSearch && (
                            <>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => toggleAlert(search.id, search.alertEnabled ?? false)}
                                aria-label={search.alertEnabled ? 'Disable alerts' : 'Enable alerts'}
                                title={search.alertEnabled ? 'Disable alerts' : 'Enable alerts'}
                              >
                                {search.alertEnabled ? (
                                  <Bell size={14} weight="fill" className="text-primary" />
                                ) : (
                                  <BellSlash size={14} />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => openEditDialog(search)}
                                aria-label="Edit search"
                                title="Edit search"
                              >
                                <Pencil size={14} />
                              </Button>
                            </>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleShareSearch(search)}
                            aria-label="Share search"
                            title="Share search"
                          >
                            <ShareNetwork size={14} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                            onClick={() => {
                              onDeleteSearch(search.id)
                              toast.success('Search deleted')
                            }}
                            aria-label="Delete search"
                            title="Delete search"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full h-7 text-xs"
                        onClick={() => {
                          onLoadSearch(search.filters)
                          if (onUpdateSearch && search.matchCount && search.matchCount > 0) {
                            onUpdateSearch(search.id, { matchCount: 0 })
                          }
                          toast.success(`Loaded "${search.name}"`)
                        }}
                      >
                        <MagnifyingGlass size={14} weight="bold" className="mr-1" />
                        Load Search
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Current Search</DialogTitle>
            <DialogDescription>
              Save your search criteria and get notified when new matching properties are listed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="search-name">Search Name</Label>
              <Input
                id="search-name"
                placeholder="e.g., Downtown Studios Under $2000"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveSearch()
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Current Filters</Label>
              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                {getFilterSummary(currentFilters)}
              </div>
            </div>
            <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-card/50">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="alert-enabled" className="text-sm font-medium flex items-center gap-2">
                    <Bell size={16} weight="fill" className="text-primary" />
                    Enable Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when new properties match this search
                  </p>
                </div>
                <Switch
                  id="alert-enabled"
                  checked={alertEnabled}
                  onCheckedChange={setAlertEnabled}
                />
              </div>
              {alertEnabled && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label htmlFor="alert-frequency" className="text-sm">
                    Alert Frequency
                  </Label>
                  <Select value={alertFrequency} onValueChange={(value) => setAlertFrequency(value as AlertFrequency)}>
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
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSearch}>
                <FloppyDisk size={16} weight="bold" className="mr-2" />
                Save Search
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Saved Search</DialogTitle>
            <DialogDescription>
              Update your search name and alert preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-search-name">Search Name</Label>
              <Input
                id="edit-search-name"
                placeholder="e.g., Downtown Studios Under $2000"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditSearch()
                }}
              />
            </div>
            {editingSearch && (
              <div className="space-y-2">
                <Label>Search Filters</Label>
                <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                  {getFilterSummary(editingSearch.filters)}
                </div>
              </div>
            )}
            <div className="space-y-4 p-4 rounded-lg border border-border/50 bg-card/50">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-alert-enabled" className="text-sm font-medium flex items-center gap-2">
                    <Bell size={16} weight="fill" className="text-primary" />
                    Enable Alerts
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when new properties match this search
                  </p>
                </div>
                <Switch
                  id="edit-alert-enabled"
                  checked={alertEnabled}
                  onCheckedChange={setAlertEnabled}
                />
              </div>
              {alertEnabled && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <Label htmlFor="edit-alert-frequency" className="text-sm">
                    Alert Frequency
                  </Label>
                  <Select value={alertFrequency} onValueChange={(value) => setAlertFrequency(value as AlertFrequency)}>
                    <SelectTrigger id="edit-alert-frequency" aria-label="Edit alert frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instant">Instant - Get notified immediately</SelectItem>
                      <SelectItem value="daily">Daily - Once per day digest</SelectItem>
                      <SelectItem value="weekly">Weekly - Weekly summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setShowEditDialog(false)
                setEditingSearch(null)
              }}>
                Cancel
              </Button>
              <Button onClick={handleEditSearch}>
                <FloppyDisk size={16} weight="bold" className="mr-2" />
                Update Search
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
