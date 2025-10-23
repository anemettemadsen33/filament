import { useState, useEffect, useRef } from 'react'
import { ChatCircle, X, PaperPlaneRight, Sparkle, Brain, TrendUp, MagnifyingGlass, Lightbulb } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { Property } from '@/lib/types'
import {
  analyzeUserMessage,
  generateContextualResponse,
  createEmptyContext,
  extractPropertyIntent,
  type ConversationContext,
  type Intent,
  type Entity,
  type Sentiment
} from '@/lib/chatbotNLP'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  intent?: Intent
  entities?: Entity[]
  sentiment?: Sentiment
  suggestedProperties?: Property[]
}

interface EnhancedAIChatButtonProps {
  properties: Property[]
  onPropertySelect?: (propertyId: string) => void
}

export function EnhancedAIChatButton({ properties, onPropertySelect }: EnhancedAIChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI rental assistant powered by advanced natural language understanding. I can help you find properties, answer questions, compare options, and provide personalized recommendations. What are you looking for today?',
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [context, setContext] = useState<ConversationContext>(createEmptyContext())
  const [showInsights, setShowInsights] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100)
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessageContent = input.trim()
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userMessageContent,
      timestamp: Date.now()
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const analysis = await analyzeUserMessage(userMessageContent, context, properties)
      
      setContext(analysis.context)

      const response = await generateContextualResponse(analysis, properties)

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
        intent: analysis.intent,
        entities: analysis.entities,
        sentiment: analysis.sentiment,
        suggestedProperties: analysis.suggestedProperties
      }

      setMessages((prev) => [...prev, assistantMessage])

      const propertyIntent = await extractPropertyIntent(userMessageContent)
      if (propertyIntent.wantsToSee && propertyIntent.propertyId && onPropertySelect) {
        const property = properties.find(p => p.id === propertyIntent.propertyId)
        if (property) {
          onPropertySelect(property.id)
        }
      }

      setContext((prev) => ({
        ...prev,
        conversationHistory: [
          ...prev.conversationHistory,
          { role: 'assistant', content: response, timestamp: Date.now() }
        ]
      }))

    } catch (error) {
      console.error('Chat error:', error)
      console.error('Error details:', error instanceof Error ? error.message : String(error))
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
      
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
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

  const handlePropertyClick = (propertyId: string) => {
    if (onPropertySelect) {
      onPropertySelect(propertyId)
      setIsOpen(false)
    }
  }

  const getSentimentColor = (sentiment?: Sentiment) => {
    if (!sentiment) return 'bg-muted'
    if (sentiment.score > 0.3) return 'bg-green-500/10 border-green-500/20'
    if (sentiment.score < -0.3) return 'bg-red-500/10 border-red-500/20'
    return 'bg-muted'
  }

  const getIntentIcon = (intent?: Intent) => {
    if (!intent) return null
    switch (intent.type) {
      case 'search':
        return <MagnifyingGlass size={14} weight="bold" />
      case 'recommendation':
        return <Lightbulb size={14} weight="fill" />
      case 'comparison':
        return <TrendUp size={14} weight="bold" />
      default:
        return <Brain size={14} weight="bold" />
    }
  }

  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').slice(-1)[0]

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="relative">
          {!isOpen && messages.length > 1 && (
            <motion.div
              className="absolute -top-2 -left-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Badge className="bg-accent text-accent-foreground h-6 w-6 rounded-full p-0 flex items-center justify-center">
                {messages.length - 1}
              </Badge>
            </motion.div>
          )}
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
            title={isOpen ? "Close AI assistant" : "Open AI assistant"}
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
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[450px] max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden backdrop-blur-sm">
              <div className="bg-gradient-to-r from-primary via-primary to-primary/80 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Sparkle size={20} weight="fill" className="text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-foreground flex items-center gap-2">
                      AI Assistant
                      <Brain size={16} weight="fill" className="opacity-80" />
                    </h3>
                    <p className="text-xs text-primary-foreground/80">Advanced NLP • Context-Aware</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInsights(!showInsights)}
                    className="text-primary-foreground hover:bg-white/10"
                    aria-label={showInsights ? "Hide insights" : "Show insights"}
                    title={showInsights ? "Hide insights" : "Show insights"}
                  >
                    <TrendUp size={18} weight={showInsights ? 'fill' : 'bold'} />
                  </Button>
                </div>

                <AnimatePresence>
                  {showInsights && lastAssistantMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-white/10"
                    >
                      <div className="space-y-2">
                        {lastAssistantMessage.intent && (
                          <div className="flex items-center gap-2 text-xs text-primary-foreground/90">
                            <div className="flex items-center gap-1">
                              {getIntentIcon(lastAssistantMessage.intent)}
                              <span className="capitalize">{lastAssistantMessage.intent.type}</span>
                            </div>
                            <span className="opacity-60">•</span>
                            <span>{Math.round(lastAssistantMessage.intent.confidence * 100)}% confidence</span>
                          </div>
                        )}
                        {lastAssistantMessage.sentiment && (
                          <div className="flex items-center gap-2 text-xs text-primary-foreground/90">
                            <span className="capitalize">{lastAssistantMessage.sentiment.label}</span>
                            <span className="opacity-60">•</span>
                            <span>Score: {lastAssistantMessage.sentiment.score.toFixed(2)}</span>
                          </div>
                        )}
                        {lastAssistantMessage.entities && lastAssistantMessage.entities.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {lastAssistantMessage.entities.map((entity, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs bg-white/10 text-primary-foreground border-white/20"
                              >
                                {entity.type}: {entity.value}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ScrollArea className="h-[450px] p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback
                          className={cn(
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground'
                          )}
                        >
                          {message.role === 'user' ? 'U' : <Brain size={16} weight="bold" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 max-w-[85%]">
                        <div
                          className={cn(
                            'rounded-2xl px-4 py-3',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : getSentimentColor(message.sentiment)
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>

                        {message.suggestedProperties && message.suggestedProperties.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 space-y-2"
                          >
                            <p className="text-xs text-muted-foreground px-1">Suggested Properties:</p>
                            {message.suggestedProperties.map((property) => (
                              <button
                                key={property.id}
                                onClick={() => handlePropertyClick(property.id)}
                                className="w-full text-left p-3 rounded-xl bg-card border border-border hover:border-primary hover:bg-accent/5 transition-all group"
                                aria-label={`View ${property.title} details`}
                                title={`View ${property.title} details`}
                              >
                                <div className="flex items-start gap-3">
                                  <img
                                    src={property.images[0]}
                                    alt={property.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                      {property.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">{property.location}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-sm font-semibold text-primary">
                                        ${property.price.toLocaleString()}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {property.bedrooms} bed • {property.bathrooms} bath
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}

                        {message.entities && message.entities.length > 0 && showInsights && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.entities.slice(0, 3).map((entity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {entity.type}
                              </Badge>
                            ))}
                          </div>
                        )}
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
                        <AvatarFallback className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground">
                          <Brain size={16} weight="bold" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 max-w-[85%] rounded-2xl px-4 py-3 bg-muted">
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

              <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
                {context.userPreferences && Object.keys(context.userPreferences).length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    <span className="text-xs text-muted-foreground mr-1">Context:</span>
                    {context.userPreferences.location && (
                      <Badge variant="secondary" className="text-xs">
                        📍 {context.userPreferences.location}
                      </Badge>
                    )}
                    {context.userPreferences.propertyType && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        🏠 {context.userPreferences.propertyType}
                      </Badge>
                    )}
                    {context.userPreferences.bedrooms && (
                      <Badge variant="secondary" className="text-xs">
                        🛏️ {context.userPreferences.bedrooms}+ bed
                      </Badge>
                    )}
                    {context.userPreferences.maxPrice && (
                      <Badge variant="secondary" className="text-xs">
                        💰 ${context.userPreferences.maxPrice.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1"
                    id="enhanced-chat-input"
                    name="chat-message"
                    aria-label="Chat message input"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
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
