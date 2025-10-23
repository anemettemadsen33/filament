import { useState, useRef, useEffect } from 'react'
import { VirtualTour } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Play, Pause, ArrowsOut, ArrowClockwise, MagnifyingGlassPlus, MagnifyingGlassMinus, Cube } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface VirtualTourViewerProps {
  tours: VirtualTour[]
  open: boolean
  onClose: () => void
  initialTourIndex?: number
}

export function VirtualTourViewer({ tours, open, onClose, initialTourIndex = 0 }: VirtualTourViewerProps) {
  const [currentTourIndex, setCurrentTourIndex] = useState(initialTourIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentTour = tours[currentTourIndex]

  useEffect(() => {
    setCurrentTourIndex(initialTourIndex)
  }, [initialTourIndex])

  useEffect(() => {
    if (!open) {
      setIsPlaying(false)
      setRotation({ x: 0, y: 0 })
      setZoom(1)
    }
  }, [open])

  useEffect(() => {
    if (currentTour?.type === '360' && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = currentTour.url

      img.onload = () => {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        renderPanorama(ctx, img, canvas.width, canvas.height)
      }
    }
  }, [currentTour, rotation, zoom])

  const renderPanorama = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    ctx.save()

    ctx.translate(width / 2, height / 2)
    ctx.scale(zoom, zoom)
    ctx.translate(-width / 2, -height / 2)

    const offsetX = (rotation.y / 360) * img.width
    const imgWidth = img.width * (width / img.width)
    const imgHeight = height

    ctx.drawImage(img, -offsetX, 0, imgWidth, imgHeight)
    ctx.drawImage(img, imgWidth - offsetX, 0, imgWidth, imgHeight)

    ctx.restore()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentTour?.type === '360') {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && currentTour?.type === '360') {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y

      setRotation(prev => ({
        x: Math.max(-45, Math.min(45, prev.x + deltaY * 0.2)),
        y: (prev.y + deltaX * 0.5) % 360
      }))

      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        containerRef.current.requestFullscreen()
      }
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleResetView = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
  }

  if (!open || !currentTour) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          ref={containerRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full h-full max-w-7xl max-h-[90vh] m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm text-white border-white/20">
                <Cube className="mr-1" />
                {currentTour.type === '360' ? '360° View' : 'Video Tour'}
              </Badge>
              <div className="text-white">
                <h3 className="font-semibold text-lg">{currentTour.title}</h3>
                {currentTour.description && (
                  <p className="text-sm text-white/70">{currentTour.description}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              aria-label="Close virtual tour"
              title="Close virtual tour"
            >
              <X />
            </Button>
          </div>

          <div className="w-full h-full flex items-center justify-center">
            {currentTour.type === '360' ? (
              <div className="relative w-full h-full">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full cursor-move"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                />
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleZoomIn}
                    className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                    aria-label="Zoom in"
                    title="Zoom in"
                  >
                    <MagnifyingGlassPlus />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleZoomOut}
                    className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                    aria-label="Zoom out"
                    title="Zoom out"
                  >
                    <MagnifyingGlassMinus />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleResetView}
                    className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                    aria-label="Reset view"
                    title="Reset view"
                  >
                    <ArrowClockwise />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleFullscreen}
                    className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                    aria-label="Enter fullscreen"
                    title="Enter fullscreen"
                  >
                    <ArrowsOut />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 text-white/60 text-sm bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
                  Click and drag to look around • Zoom: {(zoom * 100).toFixed(0)}%
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={currentTour.url}
                  className="w-full h-full object-contain"
                  controls={false}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handlePlayPause}
                    className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                    title={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleFullscreen}
                    className="bg-black/50 backdrop-blur-sm text-white hover:bg-black/70"
                    aria-label="Enter fullscreen"
                    title="Enter fullscreen"
                  >
                    <ArrowsOut />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {tours.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 mb-16">
              {tours.map((tour, index) => (
                <button
                  key={tour.id}
                  onClick={() => setCurrentTourIndex(index)}
                  className={`group relative w-20 h-20 rounded-lg overflow-hidden transition-all ${
                    index === currentTourIndex
                      ? 'ring-2 ring-white scale-110'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  {tour.thumbnail ? (
                    <img
                      src={tour.thumbnail}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <Cube className="text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">{tour.title}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
