import { FilterState } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { House, Buildings, Warehouse, Calendar, CurrencyDollar, Bed } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface MapFilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  propertyCount: number
}

export function MapFilterPanel({ filters, onFiltersChange, propertyCount }: MapFilterPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <House size={16} className="text-primary" />
          Property Type
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { value: 'all', label: 'All', icon: Buildings },
            { value: 'apartment', label: 'Apartment', icon: Buildings },
            { value: 'house', label: 'House', icon: House },
            { value: 'studio', label: 'Studio', icon: Warehouse }
          ].map(({ value, label, icon: Icon }) => (
            <Button
              key={value}
              variant={filters.propertyType === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, propertyType: value })}
              className="gap-2"
            >
              <Icon size={16} />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Calendar size={16} className="text-primary" />
          Rental Term
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'short-term', label: 'Short-term' },
            { value: 'long-term', label: 'Long-term' }
          ].map(({ value, label }) => (
            <Button
              key={value}
              variant={filters.rentalTerm === value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, rentalTerm: value })}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <CurrencyDollar size={16} className="text-primary" />
          Price Range
        </Label>
        <div className="px-2">
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => 
              onFiltersChange({ ...filters, minPrice: min, maxPrice: max })
            }
            className="mb-2"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">€{filters.minPrice}</span>
            <span className="text-muted-foreground">€{filters.maxPrice}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Bed size={16} className="text-primary" />
          Bedrooms
        </Label>
        <Select
          value={filters.bedrooms}
          onValueChange={(value) => onFiltersChange({ ...filters, bedrooms: value })}
        >
          <SelectTrigger aria-label="Bedrooms">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="1">1+ Bedrooms</SelectItem>
            <SelectItem value="2">2+ Bedrooms</SelectItem>
            <SelectItem value="3">3+ Bedrooms</SelectItem>
            <SelectItem value="4">4+ Bedrooms</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="p-3 bg-primary/5 border-primary/20">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{propertyCount}</p>
          <p className="text-xs text-muted-foreground">Properties Found</p>
        </div>
      </Card>
    </motion.div>
  )
}
