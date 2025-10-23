import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Property } from '@/lib/types'
import { toast } from 'sonner'
import { Sparkle, MagicWand } from '@phosphor-icons/react'
import { PhotoEnhancementModal } from './PhotoEnhancementModal'

interface AddPropertyModalProps {
  open: boolean
  onClose: () => void
  onAdd: (property: Property) => void
}

export function AddPropertyModal({ open, onClose, onAdd }: AddPropertyModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'apartment' as Property['type'],
    rentalTerm: 'long-term' as Property['rentalTerm'],
    bedrooms: '',
    bathrooms: '',
    area: '',
    imageUrl: '',
    amenities: ''
  })
  const [showEnhancement, setShowEnhancement] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.price || !formData.location) {
      toast.error('Please fill in all required fields')
      return
    }

    const newProperty: Property = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      location: formData.location,
      type: formData.type,
      rentalTerm: formData.rentalTerm,
      bedrooms: parseInt(formData.bedrooms) || 1,
      bathrooms: parseFloat(formData.bathrooms) || 1,
      area: parseInt(formData.area) || 500,
      images: formData.imageUrl ? [formData.imageUrl] : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
      amenities: formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [],
      available: true,
      createdAt: Date.now(),
      blockedDates: []
    }

    onAdd(newProperty)
    toast.success('Property listed successfully! 🎉', {
      description: 'Your property is now visible to potential renters.'
    })
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      type: 'apartment',
      rentalTerm: 'long-term',
      bedrooms: '',
      bathrooms: '',
      area: '',
      imageUrl: '',
      amenities: ''
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <Sparkle size={24} weight="fill" className="text-accent" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              List Your Property
            </span>
          </DialogTitle>
          <p className="text-muted-foreground text-base">Fill in the details to list your property</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          <div className="space-y-2.5">
            <Label htmlFor="title" className="text-sm font-semibold">Property Title *</Label>
            <Input
              id="title"
              placeholder="Beautiful 2BR apartment in downtown"
              className="h-12 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your property in detail..."
              className="min-h-[120px] bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2.5">
              <Label htmlFor="price" className="text-sm font-semibold">
                {formData.rentalTerm === 'short-term' ? 'Nightly Rate ($) *' : 'Monthly Rent ($) *'}
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                <Input
                  id="price"
                  type="number"
                  placeholder="2500"
                  className="pl-8 h-12 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="type" className="text-sm font-semibold">Property Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: Property['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type" className="h-12 bg-background/50 border-border/50 hover:border-primary/50 transition-colors" aria-label="Property type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="rentalTerm" className="text-sm font-semibold">Rental Term *</Label>
            <Select
              value={formData.rentalTerm}
              onValueChange={(value: Property['rentalTerm']) => setFormData({ ...formData, rentalTerm: value })}
            >
              <SelectTrigger id="rentalTerm" className="h-12 bg-background/50 border-border/50 hover:border-primary/50 transition-colors" aria-label="Rental term">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short-term">Short-term (Daily/Weekly)</SelectItem>
                <SelectItem value="long-term">Long-term (Monthly/Yearly)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.rentalTerm === 'short-term' 
                ? 'For vacation rentals and temporary stays' 
                : 'For extended leases and permanent residents'}
            </p>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="location" className="text-sm font-semibold">Location *</Label>
            <Input
              id="location"
              placeholder="New York, NY"
              className="h-12 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2.5">
              <Label htmlFor="bedrooms" className="text-sm font-semibold">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="2"
                className="h-12 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="bathrooms" className="text-sm font-semibold">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                step="0.5"
                placeholder="1.5"
                className="h-12 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="area" className="text-sm font-semibold">Area (sqft)</Label>
              <Input
                id="area"
                type="number"
                placeholder="850"
                className="h-12 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="imageUrl" className="text-sm font-semibold">Image URL</Label>
            <div className="flex gap-2">
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                className="h-12 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
              {formData.imageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 gap-2 border-primary/50 hover:border-primary hover:bg-primary/5"
                  onClick={() => setShowEnhancement(true)}
                >
                  <MagicWand weight="fill" />
                  Enhance
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Optional: Provide a link to a property image</p>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="amenities" className="text-sm font-semibold">Amenities</Label>
            <Input
              id="amenities"
              placeholder="Parking, WiFi, Air Conditioning, Gym"
              className="h-12 bg-background/50 border-border/50 hover:border-primary/50 focus:border-primary transition-colors"
              value={formData.amenities}
              onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Separate multiple amenities with commas</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1 h-12 font-semibold border-border/50 hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
            >
              List Property
            </Button>
          </div>
        </form>
      </DialogContent>

      {formData.imageUrl && (
        <PhotoEnhancementModal
          open={showEnhancement}
          onClose={() => setShowEnhancement(false)}
          imageUrl={formData.imageUrl}
          onEnhanced={(enhancedUrl) => {
            setFormData({ ...formData, imageUrl: enhancedUrl })
          }}
        />
      )}
    </Dialog>
  )
}
