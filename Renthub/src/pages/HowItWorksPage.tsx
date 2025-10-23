import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MagnifyingGlass, 
  Heart, 
  CalendarCheck, 
  ChatCircle, 
  Star, 
  ShieldCheck,
  UserCircle,
  CreditCard,
  CheckCircle,
  House
} from '@phosphor-icons/react'
import { useTranslation } from '@/lib/i18n/context'

export function HowItWorksPage() {
  const { t } = useTranslation()

  const steps = [
    {
      number: 1,
      icon: UserCircle,
      title: 'Create Your Account',
      description: 'Sign up with your GitHub account in seconds. Set your preferences and start your rental journey.',
      color: 'oklch(0.50 0.20 250)'
    },
    {
      number: 2,
      icon: MagnifyingGlass,
      title: 'Search & Explore',
      description: 'Use our advanced filters, AI-powered search, or map view to find properties that match your needs.',
      color: 'oklch(0.65 0.18 35)'
    },
    {
      number: 3,
      icon: Heart,
      title: 'Save Favorites',
      description: 'Create a wishlist of properties you love. Compare them side-by-side to make the best decision.',
      color: 'oklch(0.60 0.20 0)'
    },
    {
      number: 4,
      icon: ChatCircle,
      title: 'Contact Landlords',
      description: 'Send direct messages to property owners. Ask questions and schedule viewings easily.',
      color: 'oklch(0.55 0.15 160)'
    },
    {
      number: 5,
      icon: CalendarCheck,
      title: 'Book Your Property',
      description: 'Reserve properties with our secure booking system. Choose flexible payment options for long-term rentals.',
      color: 'oklch(0.60 0.15 280)'
    },
    {
      number: 6,
      icon: Star,
      title: 'Leave Reviews',
      description: 'Share your experience with the community. Rate properties and help others make informed decisions.',
      color: 'oklch(0.70 0.15 35)'
    }
  ]

  const forLandlords = [
    {
      icon: House,
      title: 'List Your Property',
      description: 'Create beautiful listings with photos, detailed descriptions, and pricing.'
    },
    {
      icon: ShieldCheck,
      title: 'Get Verified',
      description: 'Build trust with our verification system and superhost badges.'
    },
    {
      icon: CreditCard,
      title: 'Receive Bookings',
      description: 'Accept reservations with our secure payment system and manage bookings easily.'
    },
    {
      icon: ChatCircle,
      title: 'Communicate',
      description: 'Chat directly with potential tenants and answer their questions quickly.'
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
            <CheckCircle size={16} className="mr-1" weight="fill" />
            Getting Started
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            How RentHub Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your complete guide to finding the perfect rental or listing your property on RentHub
          </p>
        </motion.div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">For Renters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: step.color }}>
                    <div className="flex items-start gap-4 mb-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${step.color}15` }}
                      >
                        <Icon size={24} weight="bold" style={{ color: step.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            Step {step.number}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">For Landlords</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {forLandlords.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4">
                      <Icon size={28} weight="bold" className="text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of satisfied renters and landlords using RentHub to find their perfect match. 
                Create your account today and experience the easiest way to rent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-colors">
                  <MagnifyingGlass size={20} className="mr-2" weight="bold" />
                  Browse Properties
                </a>
                <a href="/" className="inline-flex items-center justify-center rounded-lg bg-accent text-accent-foreground px-6 py-3 font-semibold hover:bg-accent/90 transition-colors">
                  <House size={20} className="mr-2" weight="bold" />
                  List Your Property
                </a>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
