import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MagicWand, Sparkle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Property } from '@/lib/types'

interface AISearchModalProps {
  open: boolean
  onClose: () => void
  properties: Property[]
  onSearchResults: (results: Property[]) => void
}

export function AISearchModal({ open, onClose, properties, onSearchResults }: AISearchModalProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleAISearch = async () => {
    if (!query.trim()) {
      toast.error('Please describe what you\'re looking for')
      return
    }

    setIsSearching(true)
    
    try {
      const propertiesData = properties.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        price: p.price,
        location: p.location,
        type: p.type,
        rentalTerm: p.rentalTerm,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        amenities: p.amenities
      }))

      const prompt = window.spark.llmPrompt`You are a helpful real estate assistant. Based on the user's natural language query, analyze the available properties and return the IDs of properties that best match their requirements.

User Query: ${query}

Available Properties:
${JSON.stringify(propertiesData, null, 2)}

Return a JSON object with a single property called "matchingPropertyIds" that contains an array of property IDs that best match the user's requirements. Consider all aspects of the query including:
- Rental term preference (short-term for daily/weekly stays, long-term for monthly/yearly leases)
- Price range
- Location preferences
- Property type
- Size (bedrooms, area)
- Amenities
- Any other mentioned criteria

Order them by relevance (best matches first). If no properties match well, return an empty array.

Example format:
{
  "matchingPropertyIds": ["prop-id-1", "prop-id-2", "prop-id-3"]
}`

      const response = await window.spark.llm(prompt, 'gpt-4o', true)
      const result = JSON.parse(response)
      
      if (result.matchingPropertyIds && Array.isArray(result.matchingPropertyIds)) {
        const matchedProperties = result.matchingPropertyIds
          .map((id: string) => properties.find(p => p.id === id))
          .filter((p): p is Property => p !== undefined)
        
        if (matchedProperties.length > 0) {
          onSearchResults(matchedProperties)
          toast.success(`Found ${matchedProperties.length} matching ${matchedProperties.length === 1 ? 'property' : 'properties'}`)
          onClose()
          setQuery('')
        } else {
          toast.error('No properties match your criteria. Try adjusting your search.')
        }
      } else {
        toast.error('Unable to process search. Please try again.')
      }
    } catch (error) {
      console.error('AI Search error:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2">
            <MagicWand size={28} weight="fill" className="text-accent" />
            AI-Powered Search
          </DialogTitle>
          <p className="text-muted-foreground">Describe your perfect property in your own words</p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-start gap-3 mb-3">
              <Sparkle size={20} weight="fill" className="text-accent mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Try asking things like:</h4>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li>• "Short-term apartment near downtown for a week-long stay"</li>
                  <li>• "Long-term 2-bedroom apartment under $2000 per month"</li>
                  <li>• "Pet-friendly house for long-term rental with backyard"</li>
                  <li>• "Modern studio for short-term stay with gym access"</li>
                  <li>• "Family home for yearly rental with 3+ bedrooms"</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Your Search Query</label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., I'm looking for a bright 2-bedroom apartment with modern appliances, preferably under $1800/month, close to public transport..."
              className="min-h-32 resize-none"
              disabled={isSearching}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAISearch}
              disabled={isSearching || !query.trim()}
              className="flex-1 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 h-12"
            >
              {isSearching ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mr-2"
                  >
                    <Sparkle size={20} weight="fill" />
                  </motion.div>
                  Searching...
                </>
              ) : (
                <>
                  <MagicWand size={20} weight="fill" className="mr-2" />
                  Search with AI
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSearching}
              className="px-8"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
