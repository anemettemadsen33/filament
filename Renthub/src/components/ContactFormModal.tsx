import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Property, User as UserType } from '@/lib/types'
import { EnvelopeSimple, User, Phone, PaperPlaneRight } from '@phosphor-icons/react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ContactFormModalProps {
  property: Property
  currentUser: UserType | null
  open: boolean
  onClose: () => void
  onStartConversation: (propertyId: string, initialMessage: string) => void
}

export function ContactFormModal({ property, currentUser, open, onClose, onStartConversation }: ContactFormModalProps) {
  const [formData, setFormData] = useState({
    name: currentUser?.login || '',
    email: currentUser?.email || '',
    phone: '',
    message: `Hi, I'm interested in ${property.title}. Please contact me with more details.`
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onStartConversation(property.id, formData.message)
    
    toast.success('Message sent successfully!', {
      description: 'Your conversation has been started. Check your messages.'
    })
    
    setFormData({
      name: currentUser?.login || '',
      email: currentUser?.email || '',
      phone: '',
      message: ''
    })
    
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Contact Property Owner</DialogTitle>
          <DialogDescription className="text-base">
            Send a message about <span className="font-semibold text-foreground">{property.title}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">Your Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="name"
                required
                placeholder="John Doe"
                className="pl-10 h-11 bg-background/50 border-border/50"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
            <div className="relative">
              <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="email"
                type="email"
                required
                placeholder="john@example.com"
                className="pl-10 h-11 bg-background/50 border-border/50"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="pl-10 h-11 bg-background/50 border-border/50"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold">Message</Label>
            <Textarea
              id="message"
              required
              placeholder="Tell the owner why you're interested..."
              className="min-h-[120px] bg-background/50 border-border/50 resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 h-12"
          >
            <PaperPlaneRight size={20} weight="bold" className="mr-2" />
            Send Message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
