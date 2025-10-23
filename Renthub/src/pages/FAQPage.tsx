import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Question,
  MagnifyingGlass,
  CaretDown,
  CaretUp,
  Sparkle
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const categories = [
    {
      name: 'Getting Started',
      icon: Sparkle,
      color: 'oklch(0.50 0.20 250)',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign In" button in the header and authenticate using your GitHub account. Your account will be created automatically, and you can start browsing properties immediately.'
        },
        {
          question: 'Is RentHub free to use?',
          answer: 'Yes, browsing and searching for properties is completely free. Landlords can list properties for free as well. We may introduce premium features in the future, but core functionality will always remain free.'
        },
        {
          question: 'How do I search for properties?',
          answer: 'Use the search bar on the homepage, apply filters for property type, price range, bedrooms, and rental term. You can also use our AI-powered search for natural language queries or browse properties on the interactive map.'
        }
      ]
    },
    {
      name: 'Renting',
      icon: Question,
      color: 'oklch(0.65 0.18 35)',
      faqs: [
        {
          question: 'What\'s the difference between short-term and long-term rentals?',
          answer: 'Short-term rentals are for daily or weekly stays (like vacation rentals), while long-term rentals are monthly or yearly leases. Each property clearly indicates its rental term, and you can filter by your preference.'
        },
        {
          question: 'How do I book a property?',
          answer: 'Click "Reserve Now" on any property detail page. For short-term rentals, select your dates on the calendar. For long-term rentals, choose your lease duration and payment option (deposit only or full payment). Fill in your details and confirm the booking.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'Currently, properties on RentHub use bank transfer payments. After booking, you\'ll receive an invoice with complete bank details and payment instructions. Always use traceable payment methods for your safety.'
        },
        {
          question: 'Can I cancel my booking?',
          answer: 'Yes, you can cancel bookings from your dashboard. Navigate to the Bookings tab, find your reservation, and click the cancel button. Cancellation policies vary by property, so check the terms before booking.'
        }
      ]
    },
    {
      name: 'Listing Properties',
      icon: Question,
      color: 'oklch(0.60 0.15 280)',
      faqs: [
        {
          question: 'How do I list my property?',
          answer: 'Click the "List Property" button in the header, fill in the property details including title, description, location, pricing, and rental term. Upload photos, specify amenities, and publish your listing.'
        },
        {
          question: 'Can I edit my listing after publishing?',
          answer: 'Yes, you can edit your listings anytime from your dashboard. Go to the Properties tab, find your listing, and use the edit option to update details, photos, or availability.'
        },
        {
          question: 'How do I manage availability for short-term rentals?',
          answer: 'In your dashboard Properties tab, select your property and use the availability calendar to block dates when your property isn\'t available. Booked dates are automatically blocked.'
        },
        {
          question: 'How do I get verified or become a superhost?',
          answer: 'Verification and superhost status are earned through consistent positive reviews, quick response times, and maintaining high-quality listings. Keep providing excellent service, and these badges will be awarded automatically.'
        }
      ]
    },
    {
      name: 'Features & Tools',
      icon: Sparkle,
      color: 'oklch(0.55 0.15 160)',
      faqs: [
        {
          question: 'How does the AI search work?',
          answer: 'Our AI-powered search understands natural language queries. Instead of using filters, just describe what you\'re looking for (e.g., "2 bedroom apartment near downtown under €1000/month") and the AI will find matching properties.'
        },
        {
          question: 'What is the AI Chatbot?',
          answer: 'The AI Chatbot (accessible via the floating button) is your personal rental assistant. It can help you find properties, answer questions, provide recommendations, and understand your preferences through natural conversation.'
        },
        {
          question: 'How do price alerts work?',
          answer: 'On any property detail page, you can set price alerts to notify you when the price drops below a certain amount or changes by a percentage. Manage all your alerts from the dashboard.'
        },
        {
          question: 'What are saved searches?',
          answer: 'Save your filter combinations to quickly re-apply them later. You can also enable alerts to be notified when new properties match your saved search criteria.'
        },
        {
          question: 'How does roommate matching work?',
          answer: 'Create a roommate profile with your preferences, budget, and lifestyle. Browse other profiles and like ones you\'re interested in. When both users like each other, it\'s a match and you can start chatting.'
        }
      ]
    },
    {
      name: 'Account & Settings',
      icon: Question,
      color: 'oklch(0.70 0.15 35)',
      faqs: [
        {
          question: 'How do I change my language preference?',
          answer: 'Click the globe icon in the header to access the language switcher. Select your preferred language from the dropdown. Your choice is saved automatically and applied across the entire site.'
        },
        {
          question: 'Can I use dark mode?',
          answer: 'Yes! Click the theme toggle button (sun/moon icon) in the header to switch between light and dark modes. Your preference is saved for future visits.'
        },
        {
          question: 'How do I update my search preferences?',
          answer: 'Click your profile avatar and select "Profile Settings". In the preferences section, set your default rental term, property type, price range, and bedroom count. These will be auto-applied to your searches.'
        },
        {
          question: 'How do I manage notifications?',
          answer: 'Click the bell icon in the header to view all notifications. You can filter by type, mark as read, or clear individual notifications. Notification preferences can be adjusted in your profile settings.'
        }
      ]
    },
    {
      name: 'Safety & Support',
      icon: Question,
      color: 'oklch(0.60 0.20 25)',
      faqs: [
        {
          question: 'How do I report a suspicious listing?',
          answer: 'If you encounter a suspicious listing or fraudulent activity, contact our support team immediately through the Contact page. Provide the property ID and details of your concerns.'
        },
        {
          question: 'What if I have a dispute with a landlord?',
          answer: 'First, try to resolve the issue directly through our messaging system. If that doesn\'t work, contact our support team with all relevant details and message history. We\'ll mediate and help find a solution.'
        },
        {
          question: 'Are my personal details safe?',
          answer: 'Yes, we take data privacy seriously. Your personal information is encrypted and never shared with third parties without your consent. Read our Privacy Policy for complete details.'
        },
        {
          question: 'How do I contact support?',
          answer: 'Visit our Contact page and fill out the support form with your question or issue. Our team typically responds within 24 hours. For urgent matters, mark your request as high priority.'
        }
      ]
    }
  ]

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4" variant="secondary">
            <Question size={16} className="mr-1" weight="fill" />
            Help Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions about using RentHub
          </p>

          <div className="relative max-w-xl mx-auto">
            <MagnifyingGlass 
              size={20} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
              weight="bold"
            />
            <Input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
              id="faq-search"
              name="faqSearch"
              aria-label="Search FAQs"
            />
          </div>
        </motion.div>

        <div className="space-y-6">
          {filteredCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon
            
            return (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <CategoryIcon size={20} weight="bold" style={{ color: category.color }} />
                  </div>
                  <h2 className="text-xl font-bold">{category.name}</h2>
                </div>

                <div className="space-y-3">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex
                    const isOpen = openIndex === globalIndex

                    return (
                      <Card
                        key={faqIndex}
                        className={cn(
                          'overflow-hidden transition-all duration-300',
                          isOpen && 'ring-2 ring-primary/20'
                        )}
                      >
                        <Button
                          variant="ghost"
                          className="w-full p-6 h-auto justify-between items-start text-left hover:bg-transparent"
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        >
                          <span className="font-semibold text-base pr-4">{faq.question}</span>
                          {isOpen ? (
                            <CaretUp size={20} weight="bold" className="shrink-0 text-primary" />
                          ) : (
                            <CaretDown size={20} weight="bold" className="shrink-0" />
                          )}
                        </Button>
                        
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-6"
                          >
                            <div className="pt-4 border-t">
                              <p className="text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}

          {filteredCategories.length === 0 && (
            <Card className="p-12 text-center">
              <Question size={48} className="mx-auto mb-4 text-muted-foreground" weight="fill" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any FAQs matching "{searchQuery}"
              </p>
              <Button onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </Card>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-3 font-semibold hover:bg-primary/90 transition-colors"
            >
              <Question size={20} className="mr-2" weight="bold" />
              Contact Support
            </a>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
