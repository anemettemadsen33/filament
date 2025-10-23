import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhotoEnhancementModal } from '@/components/PhotoEnhancementModal'
import { PhotoGalleryManager } from '@/components/PhotoGalleryManager'
import { PhotoEnhancementGuide } from '@/components/PhotoEnhancementGuide'
import { Sparkle, MagicWand, ImageSquare, Images } from '@phosphor-icons/react'

const samplePropertyImages = [
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
]

export function PhotoEnhancementDemo() {
  const [showSingleEnhancement, setShowSingleEnhancement] = useState(false)
  const [showGalleryManager, setShowGalleryManager] = useState(false)
  const [customImageUrl, setCustomImageUrl] = useState('')
  const [selectedImage, setSelectedImage] = useState(samplePropertyImages[0])
  const [galleryImages, setGalleryImages] = useState(samplePropertyImages)

  const handleEnhanceSingle = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setShowSingleEnhancement(true)
  }

  const handleEnhanceCustom = () => {
    if (customImageUrl.trim()) {
      setSelectedImage(customImageUrl)
      setShowSingleEnhancement(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Sparkle size={48} weight="fill" className="text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Photo Enhancement AI
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your property photos with AI-powered enhancements. Make your listings stand out with professional-quality images.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageSquare className="text-primary" />
                  Single Photo Enhancement
                </CardTitle>
                <CardDescription>
                  Enhance individual property photos with AI-powered tools
                </CardDescription>
              </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Try with Sample Images</Label>
                <div className="grid grid-cols-2 gap-3">
                  {samplePropertyImages.map((url, index) => (
                    <Card
                      key={index}
                      className="relative aspect-video overflow-hidden cursor-pointer group hover:ring-2 hover:ring-primary transition-all"
                      onClick={() => handleEnhanceSingle(url)}
                    >
                      <img
                        src={url}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <Button
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity gap-2"
                        >
                          <MagicWand weight="fill" />
                          Enhance
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="custom-image-url">Or Enter Your Own Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEnhanceCustom()}
                    id="custom-image-url"
                    name="customImageUrl"
                    aria-label="Custom image URL"
                  />
                  <Button
                    onClick={handleEnhanceCustom}
                    disabled={!customImageUrl.trim()}
                    className="gap-2"
                  >
                    <Sparkle weight="fill" />
                    Enhance
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-medium text-sm mb-2">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Auto Enhance with AI</li>
                  <li>Manual adjustments (Brighten, Darken, Contrast)</li>
                  <li>Color enhancements (Vibrance)</li>
                  <li>Image quality improvements (Sharpen, Denoise)</li>
                  <li>Side-by-side preview before applying</li>
                  <li>Download enhanced photos</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Images className="text-primary" />
                Photo Gallery Manager
              </CardTitle>
              <CardDescription>
                Manage multiple property photos and batch enhance them
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video rounded-lg overflow-hidden border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center">
                <div className="text-center space-y-3 p-6">
                  <Images size={64} className="text-primary/50 mx-auto" />
                  <div>
                    <p className="font-medium">Full Gallery Management</p>
                    <p className="text-sm text-muted-foreground">
                      Add, remove, and enhance multiple photos at once
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowGalleryManager(true)}
                    className="gap-2"
                  >
                    <Images />
                    Open Gallery Manager
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-medium text-sm mb-2">Gallery Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Upload multiple property photos</li>
                  <li>Drag & drop reordering (coming soon)</li>
                  <li>Batch enhancement of selected photos</li>
                  <li>Set cover photo</li>
                  <li>Delete individual or multiple photos</li>
                  <li>Preview all photos in grid view</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {galleryImages.slice(0, 4).map((url, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border">
                    <img
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                        Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <PhotoEnhancementGuide />
        </div>
      </div>

      <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Our AI-powered photo enhancement uses advanced algorithms to improve your property images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  1
                </div>
                <h3 className="font-semibold">Upload or Select</h3>
                <p className="text-sm text-muted-foreground">
                  Choose photos from your existing library or upload new images via URL
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  2
                </div>
                <h3 className="font-semibold">Choose Enhancements</h3>
                <p className="text-sm text-muted-foreground">
                  Select from auto-enhance or manual adjustments like brightness, contrast, and vibrance
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  3
                </div>
                <h3 className="font-semibold">Preview & Apply</h3>
                <p className="text-sm text-muted-foreground">
                  Review side-by-side comparison, then apply the enhancements to your listing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Ready to enhance your listings?</h3>
                <p className="text-muted-foreground">
                  Professional-quality photos can increase booking rates by up to 40%
                </p>
              </div>
              <Button size="lg" className="gap-2">
                <Sparkle weight="fill" />
                Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PhotoEnhancementModal
        open={showSingleEnhancement}
        onClose={() => setShowSingleEnhancement(false)}
        imageUrl={selectedImage}
        onEnhanced={(enhancedUrl) => {
          console.log('Enhanced image:', enhancedUrl)
        }}
      />

      <PhotoGalleryManager
        open={showGalleryManager}
        onClose={() => setShowGalleryManager(false)}
        images={galleryImages}
        onUpdateImages={(newImages) => {
          setGalleryImages(newImages)
        }}
        propertyTitle="Sample Property Listing"
      />
    </div>
  )
}
