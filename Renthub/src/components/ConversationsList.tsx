import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Conversation, User } from '@/lib/types'
import { ChatCircle, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ConversationsListProps {
  conversations: Conversation[]
  currentUser: User | null
  open: boolean
  onClose: () => void
  onSelectConversation: (conversation: Conversation) => void
}

export function ConversationsList({
  conversations,
  currentUser,
  open,
  onClose,
  onSelectConversation
}: ConversationsListProps) {
  const formatTime = (timestamp: number | undefined) => {
    if (!timestamp) return ''
    
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
    
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const sortedConversations = [...conversations].sort((a, b) => {
    const timeA = a.lastMessageTime || a.createdAt
    const timeB = b.lastMessageTime || b.createdAt
    return timeB - timeA
  })

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px] flex flex-col p-0 gap-0 bg-background">
        <DialogHeader className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-xl font-bold">Messages</DialogTitle>
              {totalUnread > 0 && (
                <Badge variant="destructive" className="h-5 px-2 text-xs font-semibold">
                  {totalUnread}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={onClose}
              aria-label="Close messages"
              title="Close messages"
            >
              <X size={18} />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          {sortedConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <ChatCircle size={64} weight="thin" className="text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                When you contact property owners, your conversations will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sortedConversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(
                  p => p.userId !== currentUser?.id
                )

                return (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      onSelectConversation(conversation)
                      onClose()
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors text-left",
                      conversation.unreadCount > 0 && "bg-primary/5"
                    )}
                  >
                    <Avatar className="h-12 w-12 flex-shrink-0 ring-2 ring-primary/10">
                      <AvatarImage src={otherParticipant?.userAvatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-foreground font-semibold">
                        {otherParticipant?.userName?.slice(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h4 className={cn(
                          "text-sm font-semibold truncate",
                          conversation.unreadCount > 0 ? "text-foreground" : "text-foreground/90"
                        )}>
                          {otherParticipant?.userName || 'User'}
                        </h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-1.5 truncate">
                        {conversation.propertyTitle}
                      </p>
                      
                      {conversation.lastMessage && (
                        <p className={cn(
                          "text-sm truncate",
                          conversation.unreadCount > 0 
                            ? "text-foreground font-medium" 
                            : "text-muted-foreground"
                        )}>
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>

                    {conversation.unreadCount > 0 && (
                      <Badge 
                        variant="default" 
                        className="ml-2 h-5 min-w-5 px-1.5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-bold"
                      >
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
