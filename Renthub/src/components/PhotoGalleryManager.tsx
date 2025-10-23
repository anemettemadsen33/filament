import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MagicWand, Trash, Plus, Check, Image as ImageIcon, Sparkle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { PhotoEnhancementModal } from './PhotoEnhancementModal'
import { cn } from '@/lib/utils'

interface PhotoGalleryManagerProps {
  open: boolean
  onClose: () => void
  images: string[]
  onUpdateImages: (images: string[]) => void
  propertyTitle?: string
}

export function PhotoGalleryManager({
  open,
  onClose,
  images,
  onUpdateImages,
  propertyTitle
}: PhotoGalleryManagerProps) {
  const [localImages, setLocalImages] = useState<string[]>(images)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [selectedImageForEnhancement, setSelectedImageForEnhancement] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }

    if (!newImageUrl.startsWith('http')) {
      toast.error('Please enter a valid URL starting with http:// or https://')
      return
    }

    setLocalImages([...localImages, newImageUrl])
    setNewImageUrl('')
    toast.success('Image added!')
  }

  const handleRemoveImage = (index: number) => {
    const newImages = localImages.filter((_, i) => i !== index)
    setLocalImages(newImages)
    setSelectedImages(prev => {
      const newSet = new Set(prev)
      newSet.delete(index)
      return newSet
    })
    toast.success('Image removed')
  }

  const handleEnhanceImage = (imageUrl: string) => {
    setSelectedImageForEnhancement(imageUrl)
  }

  const handleImageEnhanced = (enhancedUrl: string) => {
    const index = localImages.indexOf(selectedImageForEnhancement!)
    if (index !== -1) {
      const newImages = [...localImages]
      newImages[index] = enhancedUrl
      setLocalImages(newImages)
    }
  }

  const handleToggleSelect = (index: number) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleEnhanceSelected = async () => {
    if (selectedImages.size === 0) {
      toast.error('Please select images to enhance')
      return
    }

    toast.success(`Enhancing ${selectedImages.size} image${selectedImages.size > 1 ? 's' : ''}...`)
    
    for (const index of Array.from(selectedImages)) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const imageUrl = localImages[index]
      const newImages = [...localImages]
      newImages[index] = `${imageUrl}?enhanced=${Date.now()}`
      setLocalImages(newImages)
    }

    setSelectedImages(new Set())
    toast.success('All selected images enhanced!')
  }

  const handleRemoveSelected = () => {
    if (selectedImages.size === 0) {
      toast.error('Please select images to remove')
      return
    }

    const newImages = localImages.filter((_, i) => !selectedImages.has(i))
    setLocalImages(newImages)
    setSelectedImages(new Set())
    toast.success(`Removed ${selectedImages.size} image${selectedImages.size > 1 ? 's' : ''}`)
  }

  const handleSave = () => {
    if (localImages.length === 0) {
      toast.error('Please add at least one image')
      return
    }

    onUpdateImages(localImages)
    toast.success('Photo gallery updated!')
    onClose()
  }

  const handleCancel = () => {
    setLocalImages(images)
    setSelectedImages(new Set())
    onClose()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleCancel}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <ImageIcon className="text-primary" weight="fill" />
              Manage Property Photos
            </DialogTitle>
            <DialogDescription>
              {propertyTitle ? `Manage photos for ${propertyTitle}` : 'Add, remove, and enhance property photos'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Add New Photo</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter image URL (https://...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddImage()}
                  className="flex-1"
                />
                <Button onClick={handleAddImage} className="gap-2">
                  <Plus weight="bold" />
                  Add Photo
                </Button>
              </div>
            </div>

            {selectedImages.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{selectedImages.size}</span> image
                  {selectedImages.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleEnhanceSelected}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <MagicWand weight="fill" />
                    Enhance Selected
                  </Button>
                  <Button
                    onClick={handleRemoveSelected}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash />
                    Remove Selected
                  </Button>
                </div>
              </motion.div>
            )}

            {localImages.length === 0 ? (
              <Card className="p-12">
                <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                  <ImageIcon size={64} weight="thin" />
                  <div className="text-center">
                    <p className="font-medium text-foreground">No photos yet</p>
                    <p className="text-sm">Add photos using the form above</p>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">
                    Photo Gallery ({localImages.length})
                  </Label>
                  {selectedImages.size > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedImages(new Set())}
                    >
                      Clear Selection
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {localImages.map((imageUrl, index) => (
                      <motion.div
                        key={`${imageUrl}-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <Card
                          className={cn(
                            "relative aspect-video overflow-hidden cursor-pointer transition-all duration-200",
                            selectedImages.has(index)
                              ? "ring-2 ring-primary shadow-lg"
                              : "hover:shadow-md"
                          )}
                          onClick={() => handleToggleSelect(index)}
                        >
                          <img
                            src={imageUrl}
                            alt={`Property photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                              Cover Photo
                            </div>
                          )}

                          {selectedImages.has(index) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5"
                            >
                              <Check size={16} weight="bold" />
                            </motion.div>
                          )}

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200">
                            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="gap-1.5 h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEnhanceImage(imageUrl)
                                }}
                              >
                                <MagicWand size={14} weight="fill" />
                                Enhance
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1.5 h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveImage(index)
                                }}
                              >
                                <Trash size={14} />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </Card>

                        <div className="mt-1.5 text-xs text-muted-foreground text-center">
                          Photo {index + 1}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Sparkle size={16} />
                Photo Management Tips
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                <li>First photo will be used as the cover image</li>
                <li>Click on photos to select multiple for batch enhancement or deletion</li>
                <li>Use high-quality images for best results (recommended: 1200x800px or larger)</li>
                <li>Enhance photos to improve lighting, colors, and overall appeal</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 gap-2"
                disabled={localImages.length === 0}
              >
                <Check weight="bold" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedImageForEnhancement && (
        <PhotoEnhancementModal
          open={!!selectedImageForEnhancement}
          onClose={() => setSelectedImageForEnhancement(null)}
          imageUrl={selectedImageForEnhancement}
          onEnhanced={handleImageEnhanced}
        />
      )}
    </>
  )
}
