import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ChatMessage, Conversation, User } from '@/lib/types'
import { PaperPlaneRight, Robot, User as UserIcon } from '@phosphor-icons/react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ChatWindowProps {
  conversation: Conversation
  messages: ChatMessage[]
  currentUser: User | null
  open: boolean
  onClose: () => void
  onSendMessage: (conversationId: string, message: string, aiMessage?: ChatMessage) => void
  onMarkAsRead: (conversationId: string) => void
  onRequestAgent: (conversationId: string) => void
}

export function ChatWindow({
  conversation,
  messages,
  currentUser,
  open,
  onClose,
  onSendMessage,
  onMarkAsRead,
  onRequestAgent
}: ChatWindowProps) {
  const [messageText, setMessageText] = useState('')
  const [isAIResponding, setIsAIResponding] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const isAIMode = conversation.mode === 'ai'
  const agentRequested = conversation.agentRequested

  const otherParticipant = conversation.participants.find(
    p => p.userId !== currentUser?.id
  )

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const scrollHeight = scrollContainerRef.current.scrollHeight
      scrollContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    if (open) {
      setTimeout(scrollToBottom, 100)
    }
  }, [messages, isAIResponding, open])

  useEffect(() => {
    if (open) {
      onMarkAsRead(conversation.id)
    }
  }, [open, conversation.id])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!messageText.trim() || !currentUser) return

    const userMessage = messageText.trim()
    onSendMessage(conversation.id, userMessage)
    setMessageText('')

    if (isAIMode && !agentRequested) {
      setIsAIResponding(true)
      try {
        const aiResponse = await window.spark.llm(
          `You are a helpful AI assistant for a property rental platform called RentHub. You are assisting with inquiries about the property: ${conversation.propertyTitle}.

Recent conversation:
${messages.slice(-6).map(m => `${m.senderName}: ${m.message}`).join('\n')}

User message: ${userMessage}

Provide a helpful, friendly, and professional response. Keep it concise (2-3 sentences max). If the user asks questions you cannot answer (like specific availability, pricing negotiations, or personal landlord details), politely suggest they can request to speak with a real agent.`,
          'gpt-4o-mini'
        )
        
        setTimeout(() => {
          const aiMessageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          const aiMessage: ChatMessage = {
            id: aiMessageId,
            conversationId: conversation.id,
            senderId: 'ai-assistant',
            senderName: 'AI Assistant',
            message: aiResponse,
            timestamp: Date.now(),
            read: false,
            isAI: true
          }
          
          onSendMessage(conversation.id, aiResponse, aiMessage)
          setIsAIResponding(false)
        }, 500)
      } catch (error) {
        console.error('AI response error:', error)
        setIsAIResponding(false)
      }
    }
  }

  const handleRequestAgent = () => {
    onRequestAgent(conversation.id)
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0 gap-0 bg-background">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10">
              <AvatarImage src={isAIMode && !agentRequested ? undefined : otherParticipant?.userAvatar} />
              <AvatarFallback className={cn(
                "font-semibold",
                isAIMode && !agentRequested 
                  ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-600" 
                  : "bg-gradient-to-br from-primary/20 to-accent/20 text-foreground"
              )}>
                {isAIMode && !agentRequested ? (
                  <Robot size={20} weight="bold" />
                ) : (
                  otherParticipant?.userName?.slice(0, 2).toUpperCase() || 'U'
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg font-bold">
                  {isAIMode && !agentRequested ? 'AI Assistant' : otherParticipant?.userName || 'Agent'}
                </DialogTitle>
                {isAIMode && !agentRequested && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-blue-500/20">
                    <Robot size={12} className="mr-1" />
                    AI
                  </Badge>
                )}
                {agentRequested && (
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                    Agent Requested
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {conversation.propertyTitle}
              </p>
            </div>
          </div>
          
          {isAIMode && !agentRequested && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex items-start gap-2 text-sm">
                <Robot size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-muted-foreground">
                    You're chatting with an AI assistant. Need more help?
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-primary/30 hover:bg-primary/5 hover:border-primary/50"
                  onClick={handleRequestAgent}
                >
                  <UserIcon size={14} className="mr-1" />
                  Talk to Agent
                </Button>
              </div>
            </div>
          )}
        </DialogHeader>

        <div 
          ref={scrollContainerRef}
          className="flex-1 px-6 py-4 overflow-y-auto"
        >
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3">
                {isAIMode && !agentRequested ? (
                  <>
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <Robot size={32} className="text-blue-600" weight="bold" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">AI Assistant Ready</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ask me anything about this property!
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No messages yet. Start the conversation!
                  </p>
                )}
              </div>
            ) : (
              messages.map((message) => {
                const isCurrentUser = message.senderId === currentUser?.id
                const isAIMessage = message.isAI
                
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
                      isCurrentUser ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={isAIMessage ? undefined : message.senderAvatar} />
                      <AvatarFallback className={cn(
                        "text-xs font-semibold",
                        isAIMessage 
                          ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-600" 
                          : "bg-gradient-to-br from-primary/20 to-accent/20"
                      )}>
                        {isAIMessage ? (
                          <Robot size={16} weight="bold" />
                        ) : (
                          message.senderName.slice(0, 2).toUpperCase()
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={cn(
                      "flex flex-col gap-1 max-w-[70%]",
                      isCurrentUser ? "items-end" : "items-start"
                    )}>
                      <div className={cn(
                        "rounded-2xl px-4 py-2.5 shadow-sm",
                        isCurrentUser 
                          ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm" 
                          : isAIMessage
                          ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-foreground border border-blue-500/20 rounded-tl-sm"
                          : "bg-muted/80 text-foreground rounded-tl-sm"
                      )}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.message}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground px-2">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
            {isAIResponding && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-600">
                    <Robot size={16} weight="bold" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 max-w-[70%]">
                  <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-blue-500/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 rounded-full bg-blue-500/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 rounded-full bg-blue-500/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 flex-shrink-0 bg-muted/30">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-background/80 border-border/50 focus-visible:ring-primary/50 h-11"
              disabled={!currentUser}
            />
            <Button
              type="submit"
              disabled={!messageText.trim() || !currentUser}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all h-11 px-5"
            >
              <PaperPlaneRight size={18} weight="bold" />
            </Button>
          </form>
          {!currentUser && (
            <p className="text-xs text-muted-foreground mt-2">
              Please sign in to send messages
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
