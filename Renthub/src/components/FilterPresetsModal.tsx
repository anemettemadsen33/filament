import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FilterPresetsPanel } from './FilterPresetsPanel'
import { FilterState } from '@/lib/types'

interface FilterPresetsModalProps {
  open: boolean
  onClose: () => void
  currentFilters: FilterState
  onApplyPreset: (filters: FilterState) => void
}

export function FilterPresetsModal({ open, onClose, currentFilters, onApplyPreset }: FilterPresetsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Filter Presets</DialogTitle>
          <DialogDescription>
            Choose from pre-configured search templates to quickly find what you're looking for
          </DialogDescription>
        </DialogHeader>
        <FilterPresetsPanel
          currentFilters={currentFilters}
          onApplyPreset={onApplyPreset}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
