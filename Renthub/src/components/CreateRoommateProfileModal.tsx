import { useState, useEffect } from 'react'
import { RoommateProfile } from '@/lib/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { X } from '@phosphor-icons/react'

interface CreateRoommateProfileModalProps {
  open: boolean
  onClose: () => void
  onSave: (profile: Omit<RoommateProfile, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt' | 'lastActive'>) => void
  existingProfile?: RoommateProfile
  userName: string
  userAvatar?: string
}

const commonInterests = [
  'Reading', 'Cooking', 'Fitness', 'Gaming', 'Movies', 'Music',
  'Sports', 'Travel', 'Art', 'Photography', 'Hiking', 'Yoga',
  'Dancing', 'Gardening', 'Technology', 'Fashion', 'Pets', 'DIY'
]

const commonLanguages = [
  'English', 'Spanish', 'Mandarin', 'French', 'German', 'Italian',
  'Portuguese', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi'
]

const sharingOptions = [
  'Kitchen', 'Living Room', 'Bathroom', 'Cleaning Duties',
  'Groceries', 'Utilities', 'Netflix/Streaming', 'WiFi'
]

export function CreateRoommateProfileModal({
  open,
  onClose,
  onSave,
  existingProfile,
  userName,
  userAvatar
}: CreateRoommateProfileModalProps) {
  const [age, setAge] = useState<number>(existingProfile?.age || 25)
  const [gender, setGender] = useState<string>(existingProfile?.gender || 'prefer-not-to-say')
  const [occupation, setOccupation] = useState(existingProfile?.occupation || '')
  const [bio, setBio] = useState(existingProfile?.bio || '')
  const [location, setLocation] = useState(existingProfile?.location || '')
  const [moveInDate, setMoveInDate] = useState<string>(
    existingProfile?.moveInDate 
      ? new Date(existingProfile.moveInDate).toISOString().split('T')[0] 
      : ''
  )
  const [budgetMin, setBudgetMin] = useState(existingProfile?.budgetMin || 500)
  const [budgetMax, setBudgetMax] = useState(existingProfile?.budgetMax || 1500)
  
  const [propertyTypes, setPropertyTypes] = useState<string[]>(existingProfile?.preferences.propertyType || ['apartment'])
  const [bedrooms, setBedrooms] = useState<number[]>(existingProfile?.preferences.bedrooms || [1, 2])
  const [pets, setPets] = useState(existingProfile?.preferences.pets || false)
  const [smoking, setSmoking] = useState(existingProfile?.preferences.smoking || false)
  const [cleanliness, setCleanliness] = useState<number>(existingProfile?.preferences.cleanliness || 3)
  const [socialLevel, setSocialLevel] = useState<number>(existingProfile?.preferences.socialLevel || 3)
  const [sleepSchedule, setSleepSchedule] = useState<string>(existingProfile?.preferences.sleepSchedule || 'flexible')
  const [workFromHome, setWorkFromHome] = useState(existingProfile?.preferences.workFromHome || false)
  const [guestsFrequency, setGuestsFrequency] = useState<string>(existingProfile?.preferences.guestsFrequency || 'occasionally')
  const [sharingPreferences, setSharingPreferences] = useState<string[]>(existingProfile?.preferences.sharingPreferences || [])
  
  const [interests, setInterests] = useState<string[]>(existingProfile?.lifestyle.interests || [])
  const [customInterest, setCustomInterest] = useState('')
  const [languages, setLanguages] = useState<string[]>(existingProfile?.lifestyle.languages || ['English'])
  const [customLanguage, setCustomLanguage] = useState('')
  
  const [roommateCount, setRoommateCount] = useState(existingProfile?.lookingFor.roommateCount || 1)
  const [genderPreference, setGenderPreference] = useState<string>(existingProfile?.lookingFor.genderPreference || 'any')
  const [ageRangeMin, setAgeRangeMin] = useState(existingProfile?.lookingFor.ageRangeMin || 18)
  const [ageRangeMax, setAgeRangeMax] = useState(existingProfile?.lookingFor.ageRangeMax || 65)

  const togglePropertyType = (type: string) => {
    setPropertyTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const toggleBedroom = (bed: number) => {
    setBedrooms(prev => 
      prev.includes(bed) 
        ? prev.filter(b => b !== bed)
        : [...prev, bed].sort((a, b) => a - b)
    )
  }

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const addCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests(prev => [...prev, customInterest.trim()])
      setCustomInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    setInterests(prev => prev.filter(i => i !== interest))
  }

  const toggleLanguage = (language: string) => {
    setLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    )
  }

  const addCustomLanguage = () => {
    if (customLanguage.trim() && !languages.includes(customLanguage.trim())) {
      setLanguages(prev => [...prev, customLanguage.trim()])
      setCustomLanguage('')
    }
  }

  const removeLanguage = (language: string) => {
    setLanguages(prev => prev.filter(l => l !== language))
  }

  const toggleSharing = (option: string) => {
    setSharingPreferences(prev => 
      prev.includes(option) 
        ? prev.filter(s => s !== option)
        : [...prev, option]
    )
  }

  const handleSubmit = () => {
    if (!bio.trim() || !location.trim()) {
      return
    }

    const profile: Omit<RoommateProfile, 'id' | 'userId' | 'userName' | 'userAvatar' | 'createdAt' | 'lastActive'> = {
      age,
      gender: gender as any,
      occupation: occupation.trim() || undefined,
      bio: bio.trim(),
      location: location.trim(),
      moveInDate: moveInDate ? new Date(moveInDate).getTime() : undefined,
      budgetMin,
      budgetMax,
      preferences: {
        propertyType: propertyTypes as any,
        bedrooms,
        pets,
        smoking,
        cleanliness: cleanliness as any,
        socialLevel: socialLevel as any,
        sleepSchedule: sleepSchedule as any,
        workFromHome,
        guestsFrequency: guestsFrequency as any,
        sharingPreferences
      },
      lifestyle: {
        interests,
        languages
      },
      lookingFor: {
        roommateCount,
        genderPreference: genderPreference === 'any' ? undefined : genderPreference as any,
        ageRangeMin,
        ageRangeMax
      },
      verification: existingProfile?.verification || {
        email: false,
        phone: false,
        identity: false
      },
      active: true,
      updatedAt: Date.now(),
      views: existingProfile?.views || 0,
      matches: existingProfile?.matches || 0
    }

    onSave(profile)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {existingProfile ? 'Edit Roommate Profile' : 'Create Roommate Profile'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              <TabsTrigger value="looking-for">Looking For</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender" aria-label="Gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="occupation">Occupation (Optional)</Label>
                <Input
                  id="occupation"
                  placeholder="e.g., Software Engineer, Student, Teacher"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="moveInDate">Desired Move-in Date (Optional)</Label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bio">About Me *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell potential roommates about yourself, your lifestyle, and what you're looking for..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {bio.length}/500 characters
                </p>
              </div>

              <div>
                <Label>Budget Range (Monthly)</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="budgetMin" className="text-xs text-muted-foreground">Minimum</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      min="0"
                      step="50"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budgetMax" className="text-xs text-muted-foreground">Maximum</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      min="0"
                      step="50"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  ${budgetMin} - ${budgetMax}/month
                </p>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6 mt-4">
              <div>
                <Label>Property Type</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['apartment', 'house', 'studio', 'condo'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={propertyTypes.includes(type)}
                        onCheckedChange={() => togglePropertyType(type)}
                      />
                      <Label htmlFor={`type-${type}`} className="capitalize cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Number of Bedrooms</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[1, 2, 3, 4].map((bed) => (
                    <div key={bed} className="flex items-center space-x-2">
                      <Checkbox
                        id={`bed-${bed}`}
                        checked={bedrooms.includes(bed)}
                        onCheckedChange={() => toggleBedroom(bed)}
                      />
                      <Label htmlFor={`bed-${bed}`} className="cursor-pointer">
                        {bed}BR
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pets"
                    checked={!!pets}
                    onCheckedChange={(checked) => setPets(checked as boolean)}
                  />
                  <Label htmlFor="pets" className="cursor-pointer">
                    I have pets or am pet-friendly
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="smoking"
                    checked={!!smoking}
                    onCheckedChange={(checked) => setSmoking(checked as boolean)}
                  />
                  <Label htmlFor="smoking" className="cursor-pointer">
                    I smoke
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="workFromHome"
                    checked={workFromHome}
                    onCheckedChange={(checked) => setWorkFromHome(checked as boolean)}
                  />
                  <Label htmlFor="workFromHome" className="cursor-pointer">
                    I work from home
                  </Label>
                </div>
              </div>

              <div>
                <Label>Cleanliness Level: {cleanliness}/5</Label>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground">Relaxed</span>
                  <Slider
                    value={[cleanliness]}
                    onValueChange={(value) => setCleanliness(value[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground">Very Clean</span>
                </div>
              </div>

              <div>
                <Label>Social Level: {socialLevel}/5</Label>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground">Quiet</span>
                  <Slider
                    value={[socialLevel]}
                    onValueChange={(value) => setSocialLevel(value[0])}
                    min={1}
                    max={5}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground">Very Social</span>
                </div>
              </div>

              <div>
                <Label htmlFor="sleepSchedule">Sleep Schedule</Label>
                <Select value={sleepSchedule} onValueChange={setSleepSchedule}>
                  <SelectTrigger id="sleepSchedule" aria-label="Sleep schedule">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="early-bird">Early Bird (Sleep early, wake early)</SelectItem>
                    <SelectItem value="night-owl">Night Owl (Sleep late, wake late)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="guestsFrequency">How often do you have guests?</Label>
                <Select value={guestsFrequency} onValueChange={setGuestsFrequency}>
                  <SelectTrigger id="guestsFrequency" aria-label="Guests frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                    <SelectItem value="frequently">Frequently</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Willing to Share</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {sharingOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`share-${option}`}
                        checked={sharingPreferences.includes(option)}
                        onCheckedChange={() => toggleSharing(option)}
                      />
                      <Label htmlFor={`share-${option}`} className="cursor-pointer text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="lifestyle" className="space-y-6 mt-4">
              <div>
                <Label>Interests & Hobbies</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {commonInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={interests.includes(interest) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Input
                    placeholder="Add custom interest..."
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomInterest()}
                  />
                  <Button type="button" onClick={addCustomInterest}>Add</Button>
                </div>

                {interests.filter(i => !commonInterests.includes(i)).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Label className="text-xs text-muted-foreground w-full">Custom Interests:</Label>
                    {interests.filter(i => !commonInterests.includes(i)).map((interest) => (
                      <Badge key={interest} variant="secondary" className="gap-1">
                        {interest}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeInterest(interest)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  {commonLanguages.map((language) => (
                    <Badge
                      key={language}
                      variant={languages.includes(language) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleLanguage(language)}
                    >
                      {language}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Input
                    placeholder="Add custom language..."
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomLanguage()}
                  />
                  <Button type="button" onClick={addCustomLanguage}>Add</Button>
                </div>

                {languages.filter(l => !commonLanguages.includes(l)).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Label className="text-xs text-muted-foreground w-full">Custom Languages:</Label>
                    {languages.filter(l => !commonLanguages.includes(l)).map((language) => (
                      <Badge key={language} variant="secondary" className="gap-1">
                        {language}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeLanguage(language)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="looking-for" className="space-y-6 mt-4">
              <div>
                <Label htmlFor="roommateCount">Number of Roommates</Label>
                <Select value={roommateCount.toString()} onValueChange={(v) => setRoommateCount(Number(v))}>
                  <SelectTrigger id="roommateCount" aria-label="Number of roommates">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 roommate</SelectItem>
                    <SelectItem value="2">2 roommates</SelectItem>
                    <SelectItem value="3">3 roommates</SelectItem>
                    <SelectItem value="4">4+ roommates</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="genderPreference">Gender Preference</Label>
                <Select value={genderPreference} onValueChange={setGenderPreference}>
                  <SelectTrigger id="genderPreference" aria-label="Gender preference">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">No preference</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Preferred Age Range</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="ageRangeMin" className="text-xs text-muted-foreground">Minimum</Label>
                    <Input
                      id="ageRangeMin"
                      type="number"
                      min="18"
                      max="100"
                      value={ageRangeMin}
                      onChange={(e) => setAgeRangeMin(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ageRangeMax" className="text-xs text-muted-foreground">Maximum</Label>
                    <Input
                      id="ageRangeMax"
                      type="number"
                      min="18"
                      max="100"
                      value={ageRangeMax}
                      onChange={(e) => setAgeRangeMax(Number(e.target.value))}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Looking for roommates aged {ageRangeMin}-{ageRangeMax}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!bio.trim() || !location.trim()}>
            {existingProfile ? 'Save Changes' : 'Create Profile'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
