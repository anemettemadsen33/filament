import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Property, User as UserType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { toast } from 'sonner'
import { EnvelopeSimple, User, Phone, PaperPlaneRight, ArrowLeft, MapPin, ChatCircleDots, CheckCircle } from '@phosphor-icons/react'

interface ContactPageProps {
  properties: Property[]
  currentUser: UserType | null
  onStartConversation: (propertyId: string, initialMessage: string) => void
}

export function ContactPage({ properties, currentUser, onStartConversation }: ContactPageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [formData, setFormData] = useState({
    name: currentUser?.login || '',
    email: currentUser?.email || '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    if (id) {
      const foundProperty = properties.find(p => p.id === id)
      if (foundProperty) {
        setProperty(foundProperty)
        setFormData(prev => ({
          ...prev,
          message: `Hi, I'm interested in ${foundProperty.title}. Please contact me with more details.`
        }))
      } else {
        toast.error('Property not found')
        navigate('/')
      }
    }
  }, [id, properties, navigate])

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.login,
        email: currentUser.email
      }))
    }
  }, [currentUser])

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const landlordName = property.landlord?.name || property.ownerName || 'Property Owner'
  const landlordAvatar = property.landlord?.avatar
  const landlordEmail = property.landlord?.email || property.ownerEmail

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    onStartConversation(property.id, formData.message)

    toast.success('Message sent successfully!', {
      description: 'Your conversation has been started. Check your messages.'
    })

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Contact Property Owner</CardTitle>
                <CardDescription>Send a message and start a conversation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-base font-semibold">
                      <User />
                      Your Information
                    </Label>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name" className="text-sm text-muted-foreground">Full Name *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="pl-10"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm text-muted-foreground">Email *</Label>
                        <div className="relative">
                          <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-10"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone (optional)</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="pl-10"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label htmlFor="message" className="flex items-center gap-2 text-base font-semibold">
                      <ChatCircleDots />
                      Your Message *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="resize-none"
                      placeholder="Tell the property owner why you're interested and any questions you have..."
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Be specific about your needs and timeline to get a faster response
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold gap-2"
                    size="lg"
                    disabled={!formData.name || !formData.email || !formData.message}
                  >
                    <PaperPlaneRight />
                    Send Message
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Your message will be sent to the property owner and a conversation will be started
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={property.images[0]}
                    alt={property.title}
                    width={600}
                    height={300}
                    priority={true}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      ${property.price}/{property.rentalTerm === 'short-term' ? 'night' : 'month'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={16} />
                    <span className="text-sm">{property.location}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Property Owner</h4>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={landlordAvatar} />
                      <AvatarFallback>
                        {landlordName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{landlordName}</p>
                      {landlordEmail && (
                        <p className="text-sm text-muted-foreground">{landlordEmail}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold mb-3">Property Features</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{property.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bedrooms</p>
                      <p className="font-medium">{property.bedrooms}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bathrooms</p>
                      <p className="font-medium">{property.bathrooms}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Area</p>
                      <p className="font-medium">{property.area} sq ft</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-accent/20 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-sm">Fast response time</p>
                      <p className="text-xs text-muted-foreground">Property owners typically respond within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-sm">AI-assisted chat</p>
                      <p className="text-xs text-muted-foreground">Get instant answers to common questions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="font-medium text-sm">Secure messaging</p>
                      <p className="text-xs text-muted-foreground">All conversations are private and encrypted</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
