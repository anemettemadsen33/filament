import { useState } from 'react'
import { User, Conversation, ChatMessage } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { ChatCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import { ConversationsList } from '@/components/ConversationsList'
import { ChatWindow } from '@/components/ChatWindow'

interface MessagesPageProps {
  currentUser: User | null
  conversations: Conversation[]
  messages: ChatMessage[]
  onSendMessage: (conversationId: string, message: string, aiMessage?: ChatMessage) => void
  onMarkAsRead: (conversationId: string) => void
  onRequestAgent: (conversationId: string) => void
}

export function MessagesPage({ 
  currentUser, 
  conversations,
  messages,
  onSendMessage,
  onMarkAsRead,
  onRequestAgent
}: MessagesPageProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [showConversations, setShowConversations] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const { t } = useTranslation()

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md">
          <ChatCircle size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">{t.messages.signInRequired}</h2>
          <p className="text-muted-foreground">
            {t.messages.signInDescription}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{t.messages.title}</h1>
            <p className="text-muted-foreground">
              {t.messages.subtitle}
            </p>
          </div>

          {conversations.length === 0 ? (
            <Card className="p-12 text-center">
              <ChatCircle size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">{t.messages.noConversations}</h3>
              <p className="text-muted-foreground">{t.messages.startConversation}</p>
            </Card>
          ) : (
            <Card className="p-6">
              <p className="text-muted-foreground">{t.messages.conversations}: {conversations.length}</p>
            </Card>
          )}
        </motion.div>
      </div>

      <ConversationsList
        conversations={conversations}
        currentUser={currentUser}
        open={showConversations}
        onClose={() => setShowConversations(false)}
        onSelectConversation={(conv) => {
          setSelectedConversation(conv)
          setShowConversations(false)
          setShowChat(true)
        }}
      />

      {selectedConversation && (
        <ChatWindow
          conversation={selectedConversation}
          messages={messages.filter(m => m.conversationId === selectedConversation.id)}
          currentUser={currentUser}
          open={showChat}
          onClose={() => setShowChat(false)}
          onSendMessage={onSendMessage}
          onMarkAsRead={onMarkAsRead}
          onRequestAgent={onRequestAgent}
        />
      )}
    </div>
  )
}
