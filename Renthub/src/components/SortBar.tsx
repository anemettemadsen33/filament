import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SortOption } from '@/lib/types'
import { SortAscending } from '@phosphor-icons/react'

interface SortBarProps {
  value: SortOption
  onChange: (value: SortOption) => void
  totalProperties: number
}

export function SortBar({ value, onChange, totalProperties }: SortBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50">
      <p className="text-sm font-semibold text-muted-foreground">
        {totalProperties} {totalProperties === 1 ? 'property' : 'properties'} found
      </p>
      
      <div className="flex items-center gap-2">
        <SortAscending size={20} weight="bold" className="text-muted-foreground" />
        <Select value={value} onValueChange={(val) => onChange(val as SortOption)}>
          <SelectTrigger className="w-[180px] h-10 bg-background/50 border-border/50" aria-label="Sort properties by">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="bedrooms">Most Bedrooms</SelectItem>
            <SelectItem value="area">Largest Area</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
