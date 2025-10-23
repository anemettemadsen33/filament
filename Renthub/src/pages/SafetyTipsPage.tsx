import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ShieldCheck, 
  LockKey,
  UserCheck,
  Phone,
  CreditCard,
  Warning,
  CheckCircle,
  Info,
  House,
  ChatCircle
} from '@phosphor-icons/react'

export function SafetyTipsPage() {
  const safetyTips = [
    {
      icon: UserCheck,
      title: 'Verify Identity',
      description: 'Check that the landlord is the actual property owner. Ask for identification and proof of ownership documents.',
      type: 'important'
    },
    {
      icon: LockKey,
      title: 'Use Secure Payment Methods',
      description: 'Only use traceable payment methods like bank transfers. Never pay in cash or use untraceable services like cryptocurrency or wire transfers to unknown parties.',
      type: 'critical'
    },
    {
      icon: ChatCircle,
      title: 'Keep Communication On Platform',
      description: 'Use RentHub\'s messaging system for all communications. This protects both parties and provides a record of all conversations.',
      type: 'important'
    },
    {
      icon: House,
      title: 'Research the Neighborhood',
      description: 'Visit the area at different times of day. Check local crime statistics and speak with neighbors about their experiences.',
      type: 'tip'
    },
    {
      icon: CreditCard,
      title: 'Understand Deposit Rules',
      description: 'Know your rights regarding security deposits. In most regions, deposits must be held in protected schemes and returned within specific timeframes.',
      type: 'tip'
    },
    {
      icon: Phone,
      title: 'Trust Your Instincts - Money-Back Guarantee',
      description: 'If something feels wrong or too good to be true, it probably is. Don\'t let pressure tactics force you into quick decisions. RentHub offers a satisfaction guarantee: if you\'re unsatisfied after paying your deposit or first month\'s rent, you can request a full refund within 48 hours of the initial payment, no questions asked. Your peace of mind is our priority.',
      type: 'important'
    },
    {
      icon: ShieldCheck,
      title: 'Prioritize Verified Listings',
      description: 'Look for properties with verification badges and superhosts. These have been vetted by our team for authenticity.',
      type: 'tip'
    }
  ]



  const beforeRenting = [
    {
      title: 'Read the Lease Carefully',
      description: 'Review all terms and conditions. Don\'t sign anything you don\'t understand.'
    },
    {
      title: 'Document Everything',
      description: 'Take photos and videos of the property condition before moving in.'
    },
    {
      title: 'Get It in Writing',
      description: 'All agreements, promises, and terms should be documented in the lease.'
    },
    {
      title: 'Check References',
      description: 'Ask for references from previous tenants and verify them.'
    },
    {
      title: 'Understand Your Rights',
      description: 'Know your legal rights as a tenant in your area.'
    },
    {
      title: 'Budget Properly',
      description: 'Ensure rent is no more than 30% of your monthly income.'
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'oklch(0.60 0.20 25)'
      case 'important':
        return 'oklch(0.70 0.15 35)'
      case 'tip':
        return 'oklch(0.50 0.20 250)'
      default:
        return 'oklch(0.556 0 0)'
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'critical':
        return 'Critical'
      case 'important':
        return 'Important'
      case 'tip':
        return 'Tip'
      default:
        return 'Info'
    }
  }

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
            <ShieldCheck size={16} className="mr-1" weight="fill" />
            Safety & Security
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Safety Tips
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Essential guidelines to protect yourself when renting a property online
          </p>
        </motion.div>

        <Alert className="mb-8 border-l-4 border-l-destructive bg-destructive/5">
          <Warning size={20} weight="bold" className="text-destructive" />
          <AlertDescription className="ml-2">
            <strong className="font-semibold">Important:</strong> If you suspect fraud or encounter suspicious activity, 
            report it immediately to our support team and local authorities. Your safety is our priority.
          </AlertDescription>
        </Alert>

        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Essential Safety Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyTips.map((tip, index) => {
              const Icon = tip.icon
              const color = getTypeColor(tip.type)
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 border-l-4" style={{ borderLeftColor: color }}>
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon size={24} weight="bold" style={{ color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{tip.title}</h3>
                          <Badge 
                            variant={tip.type === 'critical' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {getTypeBadge(tip.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={24} weight="fill" className="text-primary" />
                <h2 className="text-xl font-bold">Before You Rent</h2>
              </div>
              <ul className="space-y-3">
                {beforeRenting.map((item, index) => (
                  <li key={index} className="text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle size={16} weight="fill" className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <strong className="font-semibold">{item.title}:</strong>{' '}
                        <span className="text-muted-foreground">{item.description}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="p-8 bg-gradient-to-br from-accent/5 to-primary/5 border-2 border-primary/20">
            <div className="text-center">
              <Info size={48} weight="fill" className="mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-4">Need Help or Have Concerns?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our support team is here to help. If you encounter any suspicious activity, 
                have safety concerns, or need assistance, don't hesitate to reach out.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-colors"
              >
                <ChatCircle size={20} className="mr-2" weight="bold" />
                Contact Support
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
