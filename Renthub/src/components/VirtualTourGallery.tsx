import { useState } from 'react'
import { VirtualTour } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Cube, Video, Play } from '@phosphor-icons/react'
import { VirtualTourViewer } from './VirtualTourViewer'
import { motion } from 'framer-motion'

interface VirtualTourGalleryProps {
  tours: VirtualTour[]
  propertyTitle: string
}

export function VirtualTourGallery({ tours, propertyTitle }: VirtualTourGalleryProps) {
  const [showViewer, setShowViewer] = useState(false)
  const [selectedTourIndex, setSelectedTourIndex] = useState(0)

  if (!tours || tours.length === 0) {
    return null
  }

  const handleTourClick = (index: number) => {
    setSelectedTourIndex(index)
    setShowViewer(true)
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Virtual Tours</h3>
            <p className="text-sm text-muted-foreground">
              Explore this property in immersive 360° or video
            </p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Cube />
            {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="group relative overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleTourClick(index)}
              >
                <div className="aspect-video relative bg-muted">
                  {tour.thumbnail ? (
                    <img
                      src={tour.thumbnail}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {tour.type === '360' ? (
                        <Cube className="w-16 h-16 text-muted-foreground" />
                      ) : (
                        <Video className="w-16 h-16 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="lg"
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTourClick(index)
                      }}
                    >
                      <Play className="mr-2" />
                      {tour.type === '360' ? 'View 360°' : 'Watch Tour'}
                    </Button>
                  </div>

                  <div className="absolute top-3 left-3">
                    <Badge variant={tour.type === '360' ? 'default' : 'secondary'}>
                      {tour.type === '360' ? (
                        <>
                          <Cube className="mr-1" />
                          360° Tour
                        </>
                      ) : (
                        <>
                          <Video className="mr-1" />
                          Video Tour
                        </>
                      )}
                    </Badge>
                  </div>

                  {tour.duration && tour.type === 'video' && (
                    <div className="absolute bottom-3 right-3">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {Math.floor(tour.duration / 60)}:{(tour.duration % 60).toString().padStart(2, '0')}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-1">{tour.title}</h4>
                  {tour.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tour.description}
                    </p>
                  )}
                  {tour.roomName && (
                    <p className="text-xs text-primary mt-2">
                      Room: {tour.roomName}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <VirtualTourViewer
        tours={tours}
        open={showViewer}
        onClose={() => setShowViewer(false)}
        initialTourIndex={selectedTourIndex}
      />
    </>
  )
}
