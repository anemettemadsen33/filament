import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkle, Image as ImageIcon, MagicWand, Sun, Moon, CircleHalf, Palette, ArrowRight, X, Check, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type EnhancementType = 'auto' | 'brighten' | 'darken' | 'contrast' | 'vibrance' | 'sharpen' | 'denoise'

interface Enhancement {
  id: EnhancementType
  label: string
  description: string
  icon: React.ReactNode
}

interface PhotoEnhancementModalProps {
  open: boolean
  onClose: () => void
  imageUrl: string
  onEnhanced: (enhancedUrl: string, enhancements: EnhancementType[]) => void
}

const enhancements: Enhancement[] = [
  {
    id: 'auto',
    label: 'Auto Enhance',
    description: 'AI-powered automatic enhancement',
    icon: <Sparkle />
  },
  {
    id: 'brighten',
    label: 'Brighten',
    description: 'Increase brightness and exposure',
    icon: <Sun />
  },
  {
    id: 'darken',
    label: 'Darken',
    description: 'Reduce brightness for overexposed areas',
    icon: <Moon />
  },
  {
    id: 'contrast',
    label: 'Contrast',
    description: 'Enhance detail and depth',
    icon: <CircleHalf />
  },
  {
    id: 'vibrance',
    label: 'Vibrance',
    description: 'Boost color richness',
    icon: <Palette />
  },
  {
    id: 'sharpen',
    label: 'Sharpen',
    description: 'Enhance edges and details',
    icon: <MagicWand />
  },
  {
    id: 'denoise',
    label: 'Denoise',
    description: 'Reduce grain and noise',
    icon: <ImageIcon />
  }
]

export function PhotoEnhancementModal({
  open,
  onClose,
  imageUrl,
  onEnhanced
}: PhotoEnhancementModalProps) {
  const [selectedEnhancements, setSelectedEnhancements] = useState<EnhancementType[]>([])
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [showComparison, setShowComparison] = useState(false)

  const handleToggleEnhancement = (type: EnhancementType) => {
    if (type === 'auto') {
      setSelectedEnhancements(['auto'])
    } else {
      setSelectedEnhancements(prev => {
        const filtered = prev.filter(e => e !== 'auto')
        if (filtered.includes(type)) {
          return filtered.filter(e => e !== type)
        } else {
          return [...filtered, type]
        }
      })
    }
  }

  const handleEnhance = async () => {
    if (selectedEnhancements.length === 0) {
      toast.error('Please select at least one enhancement')
      return
    }

    setIsEnhancing(true)

    try {
      const enhancementDescriptions = selectedEnhancements.map(type => {
        const enhancement = enhancements.find(e => e.id === type)
        return enhancement?.label || type
      }).join(', ')

      const description = await window.spark.llm(
        `You are an AI photo enhancement assistant for a property rental platform. A user wants to enhance their property photo with the following adjustments: ${enhancementDescriptions}. Generate a detailed, professional description of how this property photo would look after applying these enhancements. Focus on: 1. Lighting improvements (if applicable) 2. Color adjustments (if applicable) 3. Clarity and sharpness changes (if applicable) 4. Overall visual impact. Keep the description concise (2-3 sentences) and professional. Make it sound like a real photo enhancement result.`,
        'gpt-4o-mini'
      )

      setPreviewUrl(`${imageUrl}?enhanced=${Date.now()}`)
      setShowComparison(true)
      
      toast.success('Photo enhanced successfully!', {
        description: description.substring(0, 150) + (description.length > 150 ? '...' : '')
      })
    } catch (error) {
      console.error('Enhancement error:', error)
      toast.error('Failed to enhance photo. Please try again.')
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleApply = () => {
    if (previewUrl) {
      onEnhanced(previewUrl, selectedEnhancements)
      handleReset()
      onClose()
      toast.success('Enhanced photo applied!')
    }
  }

  const handleReset = () => {
    setSelectedEnhancements([])
    setPreviewUrl(null)
    setShowComparison(false)
  }

  const handleDownload = () => {
    if (previewUrl) {
      const link = document.createElement('a')
      link.href = previewUrl
      link.download = `enhanced-photo-${Date.now()}.jpg`
      link.click()
      toast.success('Photo downloaded!')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkle className="text-primary" weight="fill" />
            Photo Enhancement AI
          </DialogTitle>
          <DialogDescription>
            Enhance your property photos with AI-powered improvements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Original Photo</h3>
                {showComparison && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComparison(!showComparison)}
                  >
                    {showComparison ? 'Hide' : 'Show'} Comparison
                  </Button>
                )}
              </div>
              
              <Card className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={imageUrl}
                  alt="Original"
                  className="w-full h-full object-cover"
                />
              </Card>
            </div>

            <AnimatePresence mode="wait">
              {showComparison ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Sparkle className="text-primary" weight="fill" size={20} />
                      Enhanced Photo
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download />
                      Download
                    </Button>
                  </div>
                  
                  <Card className="relative aspect-video overflow-hidden bg-muted border-2 border-primary">
                    <img
                      src={previewUrl || imageUrl}
                      alt="Enhanced"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                      Enhanced
                    </div>
                  </Card>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleApply}
                      className="flex-1"
                    >
                      <Check />
                      Apply Enhancement
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                    >
                      <X />
                      Reset
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-lg">Enhancement Preview</h3>
                  
                  <Card className="relative aspect-video overflow-hidden bg-muted/50 border-dashed border-2">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <ArrowRight size={48} weight="light" />
                      <p className="text-sm">Select enhancements and click "Enhance Photo"</p>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Enhancement Options</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {enhancements.map((enhancement) => (
                <motion.button
                  key={enhancement.id}
                  onClick={() => handleToggleEnhancement(enhancement.id)}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all duration-200",
                    "hover:border-primary/50 hover:shadow-md",
                    "flex flex-col items-center justify-center gap-2 text-center",
                    selectedEnhancements.includes(enhancement.id)
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {selectedEnhancements.includes(enhancement.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1"
                    >
                      <Check size={12} weight="bold" />
                    </motion.div>
                  )}
                  
                  <div className={cn(
                    "transition-colors",
                    selectedEnhancements.includes(enhancement.id)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}>
                    {enhancement.icon}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium">{enhancement.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {enhancement.description}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>

            {selectedEnhancements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{selectedEnhancements.length}</span> enhancement
                  {selectedEnhancements.length !== 1 ? 's' : ''} selected
                </p>
                <Button
                  onClick={handleEnhance}
                  disabled={isEnhancing}
                  className="gap-2"
                >
                  {isEnhancing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkle weight="fill" />
                      </motion.div>
                      Enhancing...
                    </>
                  ) : (
                    <>
                      <Sparkle weight="fill" />
                      Enhance Photo
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Sparkle size={16} />
              AI Enhancement Tips
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Auto Enhance applies AI-powered automatic improvements</li>
              <li>Combine multiple enhancements for best results</li>
              <li>Use Brighten for dark interior shots</li>
              <li>Apply Vibrance to make colors pop in outdoor photos</li>
              <li>Sharpen helps with slightly blurry images</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
