import { useState } from 'react'
import { ChatCircle, X, PaperPlaneRight, Sparkle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { Property } from '@/lib/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface AIChatButtonProps {
  properties: Property[]
  onPropertySelect?: (propertyId: string) => void
}

export function AIChatButton({ properties, onPropertySelect }: AIChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI rental assistant. I can help you find the perfect property, answer questions about listings, or provide recommendations based on your preferences. How can I help you today?',
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const propertiesContext = properties.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        location: p.location,
        type: p.type,
        rentalTerm: p.rentalTerm,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        amenities: p.amenities,
        available: p.available
      }))

      // Natural conversation with personality
      const lowerMessage = userMessage.content.toLowerCase()
      const originalMessage = userMessage.content
      let response = ''
      
      // Greeting detection (Romanian + English)
      const greetings = ['bună', 'salut', 'hello', 'hi', 'hey', 'hei', 'buna', 'salutare', 'ce faci']
      const hasGreeting = greetings.some(g => lowerMessage.includes(g))
      
      if (hasGreeting) {
        const greetingResponses = [
          "Salut! 👋 Mă bucur că vorbim! Sunt aici să te ajut să găsești locuința perfectă. Ce anume cauți?",
          "Bună! 😊 Sunt asistentul tău RentHub. Îți pot arăta proprietăți disponibile, pot răspunde la întrebări despre chirie, sau te pot ajuta să compari opțiuni. Cu ce începem?",
          "Hey! Bine te-am găsit! 🏠 Caut ceva anume sau vrei să explorăm împreună ce avem disponibil?",
          "Salutare! Super că ai apelat la mine! Pot să-ți recomand proprietăți bazat pe preferințele tale - buget, locație, număr camere. Spune-mi ce-ți dorești!",
          "Bună ziua! 🌟 Sunt aici să fac căutarea ta cât mai ușoară. Ai deja ceva în minte sau vrei recomandări?"
        ]
        response = greetingResponses[Math.floor(Math.random() * greetingResponses.length)]
      }
      // Property search
      else if (lowerMessage.includes('caut') || lowerMessage.includes('vreau') || lowerMessage.includes('find') || lowerMessage.includes('search') || lowerMessage.includes('looking')) {
        const availableProps = properties.filter(p => p.available)
        
        // Check for specific requirements
        const wantsBedrooms = originalMessage.match(/(\d+)\s*(cam|dorm|bed)/i)
        const wantsLocation = ['bucuresti', 'bucharest', 'cluj', 'timisoara', 'iasi', 'brasov', 'constanta'].find(loc => 
          lowerMessage.includes(loc)
        )
        const wantsBudget = originalMessage.match(/(\d+)\s*(euro|eur|lei|ron|\$|usd)/i)
        
        if (wantsBedrooms || wantsLocation || wantsBudget) {
          let filtered = availableProps
          
          if (wantsBedrooms) {
            const beds = parseInt(wantsBedrooms[1])
            filtered = filtered.filter(p => p.bedrooms === beds)
            response += `Perfect! Caut proprietăți cu ${beds} ${beds === 1 ? 'cameră' : 'camere'}...\n\n`
          }
          
          if (wantsLocation) {
            const loc = wantsLocation.charAt(0).toUpperCase() + wantsLocation.slice(1)
            filtered = filtered.filter(p => p.location.toLowerCase().includes(wantsLocation))
            response += `Am găsit ${filtered.length} opțiuni în ${loc}! 🎯\n\n`
          }
          
          if (filtered.length > 0) {
            const top3 = filtered.slice(0, 3)
            response += top3.map((p, i) => 
              `${i + 1}. **${p.title}**\n   📍 ${p.location}\n   💰 $${p.price}/lună\n   🛏️ ${p.bedrooms} camere | 🚿 ${p.bathrooms} băi\n   📐 ${p.area}m²\n`
            ).join('\n')
            response += `\n${filtered.length > 3 ? `Am încă ${filtered.length - 3} proprietăți care se potrivesc! ` : ''}Vrei mai multe detalii despre vreuna?`
          } else {
            response += `Hmm, nu am găsit exact ce cauți cu aceste criterii. 😕 Dar am ${availableProps.length} alte proprietăți superbe! Vrei să ajustăm puțin cerințele?`
          }
        } else {
          const top3 = availableProps.slice(0, 3)
          response = `Am ${availableProps.length} proprietăți disponibile! 🏡 Iată top 3 preferatele mele:\n\n`
          response += top3.map((p, i) => 
            `${i + 1}. **${p.title}**\n   📍 ${p.location} | 💰 $${p.price}/lună\n   🛏️ ${p.bedrooms} camere | 📐 ${p.area}m²\n`
          ).join('\n')
          response += `\nSpune-mi ce buget ai, câte camere vrei, sau în ce zonă preferi și-ți rafinez recomandările! 😊`
        }
      }
      // Price/Budget questions
      else if (lowerMessage.includes('pret') || lowerMessage.includes('cat costa') || lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('buget')) {
        const prices = properties.filter(p => p.available).map(p => p.price)
        if (prices.length > 0) {
          const min = Math.min(...prices)
          const max = Math.max(...prices)
          const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
          response = `Să vorbim despre prețuri! 💰\n\n` +
            `🔹 Cel mai accesibil: $${min}/lună\n` +
            `🔹 Cel mai premium: $${max}/lună\n` +
            `🔹 Prețul mediu: $${avg}/lună\n\n` +
            `Ai un buget în minte? Spune-mi și-ți arăt ce se încadrează! 😊`
        }
      }
      // Booking/Reservation
      else if (lowerMessage.includes('rezerv') || lowerMessage.includes('book') || lowerMessage.includes('închiri') || lowerMessage.includes('rent')) {
        response = `Super decizie! 🎉 Pentru rezervare, procesul e simplu:\n\n` +
          `1️⃣ Alege proprietatea care te interesează\n` +
          `2️⃣ Click pe "View Details" să vezi tot ce oferă\n` +
          `3️⃣ Apasă "Book Now" și completează datele\n` +
          `4️⃣ Vei primi confirmare în 24h! ✅\n\n` +
          `Ai nevoie de ajutor cu vreo proprietate anume? Spune-mi ID-ul sau numele ei! 😊`
      }
      // Amenities/Features
      else if (lowerMessage.includes('piscin') || lowerMessage.includes('gym') || lowerMessage.includes('parcare') || lowerMessage.includes('balcon') || lowerMessage.includes('amenities')) {
        const withPool = properties.filter(p => p.available && p.amenities?.toLowerCase().includes('pool')).length
        const withGym = properties.filter(p => p.available && p.amenities?.toLowerCase().includes('gym')).length
        const withParking = properties.filter(p => p.available && p.amenities?.toLowerCase().includes('parking')).length
        
        response = `Hai să vedem ce facilități avem! 🏋️‍♂️\n\n`
        if (withPool > 0) response += `🏊 ${withPool} proprietăți cu piscină\n`
        if (withGym > 0) response += `💪 ${withGym} proprietăți cu sală de sport\n`
        if (withParking > 0) response += `🚗 ${withParking} proprietăți cu parcare\n`
        response += `\nSpune-mi exact ce facilități îți dorești și-ți filtrez lista! 😊`
      }
      // Questions (how, what, why)
      else if (lowerMessage.includes('cum') || lowerMessage.includes('ce ') || lowerMessage.includes('de ce') || lowerMessage.includes('how') || lowerMessage.includes('what') || lowerMessage.includes('why') || originalMessage.includes('?')) {
        response = `Bună întrebare! 🤔 Te pot ajuta cu:\n\n` +
          `🏠 Informații despre proprietăți disponibile\n` +
          `📋 Termeni și condiții de închiriere\n` +
          `💳 Metode de plată și garanții\n` +
          `📅 Proces de rezervare și mutare\n` +
          `🔑 Facilități și dotări incluse\n\n` +
          `Întreabă-mă orice specific și-ți explic în detaliu! 😊`
      }
      // Thank you
      else if (lowerMessage.includes('multumesc') || lowerMessage.includes('mersi') || lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
        const thanks = [
          "Cu mare plăcere! 😊 Sunt aici oricând ai nevoie!",
          "Mersi că m-ai întrebat! Dacă mai ai nevoie de ceva, dă-mi un semn! 👋",
          "Oricând! Succes la căutare! 🏡✨",
          "Cu drag! Happy house hunting! 🎉"
        ]
        response = thanks[Math.floor(Math.random() * thanks.length)]
      }
      // Default helpful response
      else {
        const helpfulResponses = [
          `Înțeleg! 😊 Pot să-ți arăt proprietățile disponibile, să-ți recomand ceva bazat pe bugetul tău, sau să răspund la întrebări specifice. Ce te-ar ajuta cel mai mult?`,
          `Bună idee să vorbim despre asta! Te pot ajuta cu informații despre proprietăți, prețuri, facilități sau procesul de închiriere. Spune-mi ce te interesează! 🏡`,
          `Perfect! Sunt specializat în proprietăți și pot să-ți ofer recomandări personalizate. Ai un buget sau o locație preferată? Sau vrei să vezi ce-i mai popular acum? 😊`,
          `Super! Pot să-ți arăt opțiuni concrete - apartamente, case, studiouri. Spune-mi: câte camere vrei, ce buget ai, sau în ce zonă cauți? 🔍`
        ]
        response = helpfulResponses[Math.floor(Math.random() * helpfulResponses.length)]
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
          title={isOpen ? "Close AI chat" : "Open AI chat"}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} weight="bold" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatCircle size={24} weight="fill" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkle size={20} weight="fill" className="text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-foreground">AI Assistant</h3>
                  <p className="text-xs text-primary-foreground/80">Ask me anything about rentals</p>
                </div>
              </div>

              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}>
                          {message.role === 'user' ? 'U' : 'AI'}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-12'
                            : 'bg-muted text-foreground mr-12'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-accent text-accent-foreground">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 rounded-2xl px-4 py-3 bg-muted mr-12">
                        <div className="flex gap-1">
                          <motion.div
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                          />
                          <motion.div
                            className="w-2 h-2 bg-muted-foreground rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-background">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                    id="chat-input"
                    name="chat-message"
                    aria-label="Chat message input"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="bg-primary hover:bg-primary/90"
                    aria-label="Send message"
                    title="Send message"
                  >
                    <PaperPlaneRight size={20} weight="fill" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
