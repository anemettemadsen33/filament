import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MagnifyingGlass, Funnel, X, Sliders, Calendar, House, ShieldCheck, Star } from '@phosphor-icons/react'
import { FilterState } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

interface SearchFilterBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
}

export function SearchFilterBar({ filters, onFiltersChange, onReset }: SearchFilterBarProps) {
  const isMobile = useIsMobile()
  const activeFiltersCount = [
    filters.propertyType !== 'all',
    filters.rentalTerm !== 'all',
    filters.minPrice > 0,
    filters.maxPrice < 10000,
    filters.bedrooms !== 'all',
    filters.verifiedOnly,
    filters.superhostOnly
  ].filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Calendar size={16} weight="bold" className="text-primary" />
          Rental Term
        </Label>
        <Select
          value={filters.rentalTerm}
          onValueChange={(value) => onFiltersChange({ ...filters, rentalTerm: value })}
        >
          <SelectTrigger 
            className="h-11 bg-background/50 border-border/50 hover:border-primary/50 transition-colors"
            aria-label="Select rental term"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Terms</SelectItem>
            <SelectItem value="short-term">Short-term (Daily/Weekly)</SelectItem>
            <SelectItem value="long-term">Long-term (Monthly/Yearly)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <House size={16} weight="bold" className="text-primary" />
          Property Type
        </Label>
        <Select
          value={filters.propertyType}
          onValueChange={(value) => onFiltersChange({ ...filters, propertyType: value })}
        >
          <SelectTrigger 
            className="h-11 bg-background/50 border-border/50 hover:border-primary/50 transition-colors"
            aria-label="Select property type"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-foreground">Bedrooms</Label>
        <Select
          value={filters.bedrooms}
          onValueChange={(value) => onFiltersChange({ ...filters, bedrooms: value })}
        >
          <SelectTrigger 
            className="h-11 bg-background/50 border-border/50 hover:border-primary/50 transition-colors"
            aria-label="Select number of bedrooms"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="1">1+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground" htmlFor="min-price">Min Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              placeholder="0"
              className="pl-7 h-11 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
              value={filters.minPrice || ''}
              onChange={(e) => onFiltersChange({ ...filters, minPrice: parseInt(e.target.value) || 0 })}
              id="min-price"
              name="minPrice"
            />
          </div>
        </div>
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground" htmlFor="max-price">Max Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              placeholder="10000"
              className="pl-7 h-11 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
              value={filters.maxPrice === 10000 ? '' : filters.maxPrice}
              onChange={(e) => onFiltersChange({ ...filters, maxPrice: parseInt(e.target.value) || 10000 })}
              id="max-price"
              name="maxPrice"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck size={16} weight="bold" className="text-primary" />
          Host Verification
        </Label>
        
        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/30 bg-secondary/30 hover:bg-secondary/50 transition-colors">
          <Checkbox
            id="verified"
            checked={filters.verifiedOnly || false}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, verifiedOnly: checked as boolean })}
          />
          <label
            htmlFor="verified"
            className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <ShieldCheck size={16} weight="fill" className="text-blue-600" />
            <span>Verified Landlords Only</span>
          </label>
        </div>
        
        <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/30 bg-secondary/30 hover:bg-secondary/50 transition-colors">
          <Checkbox
            id="superhost"
            checked={filters.superhostOnly || false}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, superhostOnly: checked as boolean })}
          />
          <label
            htmlFor="superhost"
            className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Star size={16} weight="fill" className="text-amber-500" />
            <span>Superhosts Only</span>
          </label>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          size="lg"
          onClick={onReset}
          className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-semibold"
        >
          <X size={18} weight="bold" className="mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-5">
      <div className="relative group">
        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} weight="bold" />
        <Input
          placeholder="Search by location, title..."
          className="pl-12 h-14 text-base bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 focus:border-primary shadow-sm hover:shadow-md transition-all duration-300"
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          id="property-search"
          name="search"
          aria-label="Search properties by location or title"
        />
      </div>

      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="w-full relative h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
              <Sliders size={20} weight="bold" className="mr-2" />
              <span className="font-semibold">Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="ml-auto bg-accent text-accent-foreground font-bold">{activeFiltersCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto rounded-t-2xl">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold">Filter Properties</SheetTitle>
            </SheetHeader>
            <div className="mt-6 pb-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Card className="p-6 border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Funnel size={20} weight="bold" className="text-primary" />
            </div>
            <h3 className="font-bold text-lg">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-auto font-bold bg-accent/10 text-accent border-0">{activeFiltersCount} active</Badge>
            )}
          </div>
          <FilterContent />
        </Card>
      )}
    </div>
  )
}
