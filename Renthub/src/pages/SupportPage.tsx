import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  EnvelopeSimple,
  User,
  ChatCircle,
  PaperPlaneRight,
  CheckCircle,
  Phone,
  MapPin,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
    priority: 'normal'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subject || !formData.category || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    
    toast.success('Message sent successfully!', {
      description: 'Our support team will get back to you within 24 hours.'
    })

    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: '',
      priority: 'normal'
    })

    setTimeout(() => {
      setIsSubmitted(false)
    }, 5000)
  }

  const contactInfo = [
    {
      icon: EnvelopeSimple,
      title: 'Email',
      value: 'support@renthub.com',
      color: 'oklch(0.50 0.20 250)'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+40 (21) 123-4567',
      color: 'oklch(0.65 0.18 35)'
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Calea Victoriei 123, Sector 1, București, România',
      color: 'oklch(0.60 0.15 280)'
    },
    {
      icon: Clock,
      title: 'Support Hours',
      value: 'Lun-Vin: 9:00 - 18:00 EET',
      color: 'oklch(0.55 0.15 160)'
    }
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4" variant="secondary">
            <ChatCircle size={16} className="mr-1" weight="fill" />
            Support Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Contact Support
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or need help? We're here to assist you 24/7
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${info.color}15` }}
                  >
                    <Icon size={28} weight="bold" style={{ color: info.color }} />
                  </div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">{info.title}</h3>
                  <p className="font-medium">{info.value}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className="relative w-full h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.3563447712544!2d26.095806315568373!3d44.43904897910216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff4770adb5b7%3A0x58147f39579fe6fa!2sCalea%20Victoriei%2C%20Bucure%C8%99ti%2C%20Romania!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RentHub Office Location"
              />
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-3"
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              
              {isSubmitted && (
                <Alert className="mb-6 border-l-4 border-l-primary bg-primary/5">
                  <CheckCircle size={20} weight="bold" className="text-primary" />
                  <AlertDescription className="ml-2">
                    <strong className="font-semibold">Thank you!</strong> Your message has been received. 
                    We'll respond within 24 hours.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User 
                        size={18} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                      />
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
                    <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <EnvelopeSimple 
                        size={18} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                      />
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger id="category" aria-label="Category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="account">Account Help</SelectItem>
                        <SelectItem value="property">Property Listing</SelectItem>
                        <SelectItem value="booking">Booking Support</SelectItem>
                        <SelectItem value="report">Report Issue</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-sm font-medium mb-2 block">
                      Priority
                    </Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                      <SelectTrigger id="priority" aria-label="Priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General Inquiry</SelectItem>
                        <SelectItem value="normal">Normal - Standard Support</SelectItem>
                        <SelectItem value="high">High - Urgent Issue</SelectItem>
                        <SelectItem value="critical">Critical - Service Down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium mb-2 block">
                    Subject <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium mb-2 block">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={8}
                    className="resize-none"
                    placeholder="Please provide as much detail as possible about your question or issue..."
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Include relevant details like property IDs, booking numbers, or error messages if applicable
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperPlaneRight size={20} className="mr-2" weight="bold" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
              <CheckCircle size={32} weight="fill" className="text-accent mb-3" />
              <h3 className="font-semibold text-lg mb-3">Garanția Rambursării</h3>
              <p className="text-sm text-muted-foreground mb-3">
                La RentHub, siguranța și satisfacția dumneavoastră sunt pe primul loc. De aceea, oferim o <span className="font-semibold text-foreground">Garanție de Rambursare</span> pentru toate plățile efectuate prin platforma noastră.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Politica de 14 zile:</span> Dacă după plata depozitului sau a depozitului + chiria descoperți că proprietatea nu corespunde descrierii sau așteptărilor dumneavoastră, vă rambursăm integral suma în primele 14 zile.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Verificare înainte de mutare:</span> Aveți dreptul la o inspecție completă a proprietății. Dacă identificați probleme majore care nu au fost dezvăluite, sunteți eligibil pentru rambursare completă.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Protecție împotriva fraudei:</span> Toate plățile sunt securizate și garantate. În cazul unei situații suspicioase, banii dumneavoastră sunt protejați 100%.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle size={16} weight="fill" className="text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Proces rapid de rambursare:</span> Solicitările de rambursare sunt procesate în maximum 5-7 zile lucrătoare, după verificarea documentației.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground italic">
                  *Termeni și condiții complete sunt disponibile în secțiunea FAQ. Rambursarea este supusă verificării și aprobării conform politicii noastre de protecție a clienților.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Help</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium mb-1">Before contacting support:</p>
                  <ul className="space-y-1 text-muted-foreground ml-4">
                    <li>• Check our <a href="/faq" className="text-primary hover:underline">FAQ page</a> for common questions</li>
                    <li>• Review our <a href="/how-it-works" className="text-primary hover:underline">How it Works</a> guide</li>
                    <li>• Read <a href="/safety-tips" className="text-primary hover:underline">Safety Tips</a> for security concerns</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Response Times</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Low Priority</span>
                  <Badge variant="secondary">2-3 days</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">Normal Priority</span>
                  <Badge variant="secondary">24-48 hours</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground">High Priority</span>
                  <Badge className="bg-warning text-warning-foreground">12-24 hours</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Critical</span>
                  <Badge variant="destructive">2-4 hours</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-accent/10">
              <CheckCircle size={32} weight="fill" className="text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Customer Satisfaction</h3>
              <p className="text-sm text-muted-foreground">
                Our support team maintains a 98% satisfaction rating with an average response time of under 6 hours.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
