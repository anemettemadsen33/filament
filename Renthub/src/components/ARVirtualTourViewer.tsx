import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { 
  Cube, 
  X, 
  Camera, 
  ArrowsOut, 
  Ruler, 
  Share, 
  Download,
  MagnifyingGlass,
  Trash,
  ArrowClockwise,
  Play,
  Pause,
  SlidersHorizontal
} from '@phosphor-icons/react'
import { Property, ARSession, ARObject, ARPlacedObject } from '@/lib/types'
import { 
  sampleARObjects, 
  createARPlacedObject, 
  detectARSupport, 
  generateShareLink,
  formatDimensions,
  searchARObjects,
  getObjectsByType
} from '@/lib/arTourUtils'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface ARVirtualTourViewerProps {
  property: Property
  open: boolean
  onClose: () => void
  onSessionSave?: (session: ARSession) => void
}

export function ARVirtualTourViewer({ property, open, onClose, onSessionSave }: ARVirtualTourViewerProps) {
  const [session, setSession] = useState<ARSession | null>(null)
  const [selectedObject, setSelectedObject] = useState<ARObject | null>(null)
  const [placedObjects, setPlacedObjects] = useState<ARPlacedObject[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'objects' | 'placed' | 'settings'>('objects')
  const [isARActive, setIsARActive] = useState(false)
  const [measurements, setMeasurements] = useState<any[]>([])
  const [showMeasurementMode, setShowMeasurementMode] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (open) {
      const arSupport = detectARSupport()
      if (!arSupport.supported) {
        toast.error(arSupport.reason || 'AR not supported')
      }
      
      setSession({
        id: `ar-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        propertyId: property.id,
        propertyTitle: property.title,
        placedObjects: [],
        screenshots: [],
        duration: 0,
        startedAt: Date.now(),
        shared: false
      })
      startTimeRef.current = Date.now()
    }
  }, [open, property])

  const filteredObjects = searchQuery 
    ? searchARObjects(searchQuery) 
    : sampleARObjects

  const handlePlaceObject = (object: ARObject) => {
    const randomX = Math.random() * 200 - 100
    const randomZ = Math.random() * 200 - 100
    
    const placedObject = createARPlacedObject(
      object,
      { x: randomX, y: 0, z: randomZ }
    )
    
    setPlacedObjects(prev => [...prev, placedObject])
    toast.success(`${object.name} placed in scene`)
  }

  const handleRemovePlacedObject = (id: string) => {
    setPlacedObjects(prev => prev.filter(obj => obj.id !== id))
    toast.info('Object removed')
  }

  const handleClearAll = () => {
    if (placedObjects.length === 0) {
      toast.info('No objects to clear')
      return
    }
    setPlacedObjects([])
    toast.success('All objects cleared')
  }

  const handleTakeScreenshot = () => {
    if (!session) return
    
    const screenshotUrl = `screenshot-${Date.now()}.jpg`
    setSession(prev => prev ? {
      ...prev,
      screenshots: [...prev.screenshots, screenshotUrl]
    } : null)
    toast.success('Screenshot captured')
  }

  const handleShareSession = () => {
    if (!session) return
    
    const shareLink = generateShareLink(session.id)
    navigator.clipboard.writeText(shareLink)
    
    setSession(prev => prev ? { ...prev, shared: true, shareLink } : null)
    toast.success('Share link copied to clipboard')
  }

  const handleSaveSession = () => {
    if (!session) return
    
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const finalSession: ARSession = {
      ...session,
      placedObjects,
      duration,
      endedAt: Date.now(),
      savedAt: Date.now()
    }
    
    onSessionSave?.(finalSession)
    toast.success('AR session saved successfully')
  }

  const handleDownloadScene = () => {
    const sceneData = {
      property: property.title,
      placedObjects: placedObjects.map(obj => ({
        name: obj.object.name,
        position: obj.position,
        rotation: obj.rotation
      })),
      measurements
    }
    
    const blob = new Blob([JSON.stringify(sceneData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ar-scene-${property.id}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Scene downloaded')
  }

  const handleToggleAR = () => {
    setIsARActive(!isARActive)
    toast.info(isARActive ? 'AR mode deactivated' : 'AR mode activated')
  }

  const objectCategories = Array.from(new Set(sampleARObjects.map(obj => obj.category)))

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Cube className="w-5 h-5 text-primary" weight="duotone" />
              </div>
              <div>
                <DialogTitle>AR Virtual Tour</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {property.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {isARActive ? 'AR Active' : 'Preview Mode'}
              </Badge>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={onClose}
                aria-label="Close AR viewer"
                title="Close AR viewer"
              >
                <X />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col bg-muted/30">
            <div className="flex-1 relative" ref={canvasRef}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mx-auto flex items-center justify-center">
                    <Cube className="w-16 h-16 text-primary" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">AR Preview Canvas</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Select objects from the panel to place them in the scene. Use your device's camera for full AR experience.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    <Badge variant="outline">{placedObjects.length} objects placed</Badge>
                    <Badge variant="outline">{measurements.length} measurements</Badge>
                    <Badge variant="outline">{session?.screenshots.length || 0} screenshots</Badge>
                  </div>
                </div>
              </div>

              {placedObjects.length > 0 && (
                <div className="absolute top-4 left-4 right-4">
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Cube className="w-4 h-4 text-primary" />
                      <span className="font-medium">Scene Objects:</span>
                      <div className="flex flex-wrap gap-1 flex-1">
                        {placedObjects.map(obj => (
                          <Badge key={obj.id} variant="secondary" className="text-xs">
                            {obj.object.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            <div className="border-t bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isARActive ? "default" : "outline"}
                    onClick={handleToggleAR}
                    className="gap-2"
                  >
                    {isARActive ? <Pause /> : <Play />}
                    {isARActive ? 'Stop AR' : 'Start AR'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowMeasurementMode(!showMeasurementMode)}
                    className="gap-2"
                  >
                    <Ruler />
                    Measure
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleTakeScreenshot}
                    className="gap-2"
                  >
                    <Camera />
                    Screenshot
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownloadScene}
                    className="gap-2"
                  >
                    <Download />
                    Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleShareSession}
                    className="gap-2"
                  >
                    <Share />
                    Share
                  </Button>
                  <Separator orientation="vertical" className="h-8" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearAll}
                    disabled={placedObjects.length === 0}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash />
                    Clear All
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveSession}
                    className="gap-2"
                  >
                    Save Session
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-96 border-l bg-background flex flex-col">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
                <TabsTrigger value="objects">Objects</TabsTrigger>
                <TabsTrigger value="placed">Placed</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="objects" className="flex-1 flex flex-col mt-0 px-4 pb-4">
                <div className="space-y-4 pt-4">
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search furniture..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <ScrollArea className="flex-1 -mx-4 px-4" style={{ height: 'calc(90vh - 280px)' }}>
                    <div className="space-y-4">
                      {objectCategories.map((category) => {
                        const categoryObjects = filteredObjects.filter(obj => obj.category === category)
                        if (categoryObjects.length === 0) return null

                        return (
                          <div key={category}>
                            <h4 className="text-sm font-semibold mb-2">{category}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {categoryObjects.map((object) => (
                                <motion.div
                                  key={object.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                                  onClick={() => handlePlaceObject(object)}
                                >
                                  <div className="aspect-square bg-muted relative overflow-hidden">
                                    <img 
                                      src={object.thumbnailUrl} 
                                      alt={object.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="p-2">
                                    <p className="text-xs font-medium truncate">{object.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {formatDimensions(object.dimensions, 'cm')}
                                    </p>
                                    {object.price && (
                                      <p className="text-xs text-primary font-semibold mt-1">
                                        ${object.price}
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="placed" className="flex-1 flex flex-col mt-0 px-4 pb-4">
                <ScrollArea className="flex-1 pt-4" style={{ height: 'calc(90vh - 240px)' }}>
                  {placedObjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <Cube className="w-16 h-16 text-muted-foreground/50 mb-4" weight="duotone" />
                      <p className="text-sm text-muted-foreground">
                        No objects placed yet. Select items from the Objects tab to start furnishing.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <AnimatePresence>
                        {placedObjects.map((placed, index) => (
                          <motion.div
                            key={placed.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="border rounded-lg p-3 hover:border-primary transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                                <img 
                                  src={placed.object.thumbnailUrl} 
                                  alt={placed.object.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{placed.object.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Position: ({placed.position.x.toFixed(0)}, {placed.position.y.toFixed(0)}, {placed.position.z.toFixed(0)})
                                </p>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemovePlacedObject(placed.id)}
                                className="flex-shrink-0"
                                aria-label="Remove object"
                                title="Remove object"
                              >
                                <Trash className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 mt-0 px-4 pb-4">
                <ScrollArea className="flex-1 pt-4" style={{ height: 'calc(90vh - 240px)' }}>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Session Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Session ID:</span>
                          <span className="font-mono text-xs">{session?.id.slice(0, 12)}...</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Objects Placed:</span>
                          <span className="font-semibold">{placedObjects.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Screenshots:</span>
                          <span className="font-semibold">{session?.screenshots.length || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-semibold">
                            {Math.floor((Date.now() - startTimeRef.current) / 1000)}s
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold mb-3">AR Controls</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Measurement Mode</span>
                          <Button
                            size="sm"
                            variant={showMeasurementMode ? "default" : "outline"}
                            onClick={() => setShowMeasurementMode(!showMeasurementMode)}
                          >
                            {showMeasurementMode ? 'On' : 'Off'}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Grid Snap</span>
                          <Button size="sm" variant="outline">
                            Enable
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Rotation Snap</span>
                          <Button size="sm" variant="outline">
                            15°
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start gap-2"
                          onClick={handleClearAll}
                        >
                          <ArrowClockwise />
                          Reset Scene
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start gap-2"
                          onClick={handleDownloadScene}
                        >
                          <Download />
                          Export Scene Data
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start gap-2"
                          onClick={handleShareSession}
                        >
                          <Share />
                          Share This Tour
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
