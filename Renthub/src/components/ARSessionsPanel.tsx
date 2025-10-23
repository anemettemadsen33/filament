import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Cube, 
  Camera, 
  Clock, 
  Share, 
  Trash,
  Eye,
  Download,
  ChartLine
} from '@phosphor-icons/react'
import { ARSession } from '@/lib/types'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface ARSessionsPanelProps {
  sessions: ARSession[]
  onDeleteSession?: (sessionId: string) => void
  onViewSession?: (session: ARSession) => void
}

export function ARSessionsPanel({ sessions, onDeleteSession, onViewSession }: ARSessionsPanelProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null)

  const totalSessions = sessions.length
  const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0)
  const totalObjects = sessions.reduce((sum, s) => sum + s.placedObjects.length, 0)
  const totalScreenshots = sessions.reduce((sum, s) => sum + s.screenshots.length, 0)
  const sharedSessions = sessions.filter(s => s.shared).length

  const handleShareSession = (session: ARSession) => {
    if (session.shareLink) {
      navigator.clipboard.writeText(session.shareLink)
      toast.success('Share link copied to clipboard')
    } else {
      toast.error('No share link available')
    }
  }

  const handleDownloadSession = (session: ARSession) => {
    const data = {
      property: session.propertyTitle,
      duration: session.duration,
      placedObjects: session.placedObjects.map(obj => ({
        name: obj.object.name,
        position: obj.position,
        rotation: obj.rotation
      })),
      screenshots: session.screenshots.length
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ar-session-${session.id}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Session data downloaded')
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Cube className="w-5 h-5 text-primary" weight="duotone" />
            </div>
            <div>
              <CardTitle>AR Virtual Tours</CardTitle>
              <CardDescription>View and manage your AR tour sessions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-4">
              <Cube className="w-10 h-10 text-muted-foreground" weight="duotone" />
            </div>
            <p className="text-sm text-muted-foreground">
              No AR tour sessions yet. Start exploring properties with AR to see your sessions here.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Cube className="w-5 h-5 text-primary" weight="duotone" />
            </div>
            <div>
              <CardTitle>AR Virtual Tours</CardTitle>
              <CardDescription>{totalSessions} sessions saved</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Cube className="w-4 h-4" />
              <span>Total Sessions</span>
            </div>
            <p className="text-2xl font-bold">{totalSessions}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              <span>Total Duration</span>
            </div>
            <p className="text-2xl font-bold">{Math.floor(totalDuration / 60)}m</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <ChartLine className="w-4 h-4" />
              <span>Objects Placed</span>
            </div>
            <p className="text-2xl font-bold">{totalObjects}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Camera className="w-4 h-4" />
              <span>Screenshots</span>
            </div>
            <p className="text-2xl font-bold">{totalScreenshots}</p>
          </div>
        </div>

        <Separator />

        <ScrollArea className="h-[400px] -mx-6 px-6">
          <div className="space-y-3">
            <AnimatePresence>
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{session.propertyTitle}</h4>
                            <p className="text-sm text-muted-foreground">
                              {format(session.startedAt, 'MMM dd, yyyy • h:mm a')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {session.shared && (
                              <Badge variant="secondary" className="gap-1">
                                <Share className="w-3 h-3" />
                                Shared
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="gap-1">
                            <Clock className="w-3 h-3" />
                            {session.duration}s
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Cube className="w-3 h-3" />
                            {session.placedObjects.length} objects
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Camera className="w-3 h-3" />
                            {session.screenshots.length} photos
                          </Badge>
                        </div>

                        {expandedSession === session.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-2 pt-2"
                          >
                            <Separator />
                            <div className="text-sm space-y-1">
                              <p className="text-muted-foreground">Placed Objects:</p>
                              <div className="flex flex-wrap gap-1">
                                {session.placedObjects.slice(0, 5).map(obj => (
                                  <Badge key={obj.id} variant="secondary" className="text-xs">
                                    {obj.object.name}
                                  </Badge>
                                ))}
                                {session.placedObjects.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{session.placedObjects.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setExpandedSession(
                              expandedSession === session.id ? null : session.id
                            )}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            {expandedSession === session.id ? 'Hide' : 'Details'}
                          </Button>
                          {session.shared && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShareSession(session)}
                              className="gap-2"
                            >
                              <Share className="w-4 h-4" />
                              Copy Link
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadSession(session)}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Export
                          </Button>
                          {onDeleteSession && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDeleteSession(session.id)}
                              className="gap-2 text-destructive hover:text-destructive ml-auto"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
