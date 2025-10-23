import { useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LanguageSettings } from '@/components/LanguageSettings'
import { User as UserIcon, Check, FloppyDisk, Globe } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useTranslation } from '@/lib/i18n/context'

interface UserProfileModalProps {
  open: boolean
  onClose: () => void
  user: User
  onUpdatePreferences: (preferences: User['preferences']) => void
}

export function UserProfileModal({ open, onClose, user, onUpdatePreferences }: UserProfileModalProps) {
  const { t } = useTranslation()
  const [rentalTerm, setRentalTerm] = useState<'short-term' | 'long-term' | 'all'>(
    user.preferences?.rentalTerm || 'all'
  )
  const [propertyType, setPropertyType] = useState(user.preferences?.propertyType || 'all')
  const [bedrooms, setBedrooms] = useState(user.preferences?.bedrooms || 'all')
  const [priceRange, setPriceRange] = useState<[number, number]>([
    user.preferences?.priceRange?.min || 0,
    user.preferences?.priceRange?.max || 10000
  ])

  useEffect(() => {
    if (user.preferences) {
      setRentalTerm(user.preferences.rentalTerm || 'all')
      setPropertyType(user.preferences.propertyType || 'all')
      setBedrooms(user.preferences.bedrooms || 'all')
      setPriceRange([
        user.preferences.priceRange?.min || 0,
        user.preferences.priceRange?.max || 10000
      ])
    }
  }, [user.preferences])

  const handleSave = () => {
    const preferences = {
      rentalTerm,
      propertyType,
      bedrooms,
      priceRange: { min: priceRange[0], max: priceRange[1] }
    }
    
    onUpdatePreferences(preferences)
    toast.success('Preferences saved successfully!')
    onClose()
  }

  const initials = user.login.slice(0, 2).toUpperCase()

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t.nav.profile} & {t.preferences.preferences}
          </DialogTitle>
          <DialogDescription>
            Customize your search preferences and language settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <motion.div 
            className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="w-20 h-20 border-4 border-primary/20 shadow-lg">
              <AvatarImage src={user.avatarUrl} alt={user.login} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{user.login}</h3>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              {user.isOwner && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30">
                    <span className="text-xs font-semibold text-accent">Property Owner</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search" className="gap-2">
                <UserIcon size={16} />
                {t.preferences.searchPreferences}
              </TabsTrigger>
              <TabsTrigger value="language" className="gap-2">
                <Globe size={16} />
                {t.preferences.language}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6 mt-6">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label htmlFor="rental-term-pref" className="text-sm font-semibold text-foreground">
                  {t.property.rentalTerm}
                </Label>
                <Select value={rentalTerm} onValueChange={(value: any) => setRentalTerm(value)}>
                  <SelectTrigger 
                    id="rental-term-pref" 
                    className="h-12 border-input hover:border-primary/50 transition-colors bg-background"
                    aria-label="Preferred rental term"
                  >
                    <SelectValue placeholder="Select rental term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.common.all}</SelectItem>
                    <SelectItem value="short-term">{t.property.shortTerm}</SelectItem>
                    <SelectItem value="long-term">{t.property.longTerm}</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Your default filter when browsing properties
                </p>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label htmlFor="property-type-pref" className="text-sm font-semibold text-foreground">
                  {t.property.propertyType}
                </Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger 
                    id="property-type-pref" 
                    className="h-12 border-input hover:border-primary/50 transition-colors bg-background"
                    aria-label="Preferred property type"
                  >
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.property.allTypes}</SelectItem>
                    <SelectItem value="apartment">{t.property.apartment}</SelectItem>
                    <SelectItem value="house">{t.property.house}</SelectItem>
                    <SelectItem value="studio">{t.property.studio}</SelectItem>
                    <SelectItem value="condo">{t.property.condo}</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Label htmlFor="bedrooms-pref" className="text-sm font-semibold text-foreground">
                  {t.property.bedrooms}
                </Label>
                <Select value={bedrooms} onValueChange={setBedrooms}>
                  <SelectTrigger 
                    id="bedrooms-pref" 
                    className="h-12 border-input hover:border-primary/50 transition-colors bg-background"
                    aria-label="Preferred bedrooms"
                  >
                    <SelectValue placeholder="Select bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.filter.anyBedrooms}</SelectItem>
                    <SelectItem value="1">1+ {t.filter.bedroom}</SelectItem>
                    <SelectItem value="2">2+ {t.property.bedrooms}</SelectItem>
                    <SelectItem value="3">3+ {t.property.bedrooms}</SelectItem>
                    <SelectItem value="4">4+ {t.property.bedrooms}</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-foreground">{t.property.priceRange}</Label>
                  <span className="text-sm font-bold text-primary">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={0}
                  max={10000}
                  step={100}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$0</span>
                  <span>$10,000</span>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="language" className="mt-6">
              <LanguageSettings />
            </TabsContent>
          </Tabs>

          <motion.div 
            className="flex gap-3 pt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
            >
              <FloppyDisk size={20} weight="bold" className="mr-2" />
              {t.common.save} {t.preferences.preferences}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="h-12 px-8 border-border/50 hover:border-primary/50"
            >
              {t.common.cancel}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
