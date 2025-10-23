import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkle, Sun, Moon, CircleHalf, Palette, MagicWand, ImageSquare } from '@phosphor-icons/react'

export function PhotoEnhancementGuide() {
  const enhancements = [
    {
      icon: <Sparkle weight="fill" />,
      name: 'Auto Enhance',
      description: 'AI-powered automatic improvements for optimal results',
      color: 'text-primary'
    },
    {
      icon: <Sun />,
      name: 'Brighten',
      description: 'Increase brightness for dark or underexposed photos',
      color: 'text-yellow-500'
    },
    {
      icon: <Moon />,
      name: 'Darken',
      description: 'Reduce brightness for overexposed or washed-out photos',
      color: 'text-blue-500'
    },
    {
      icon: <CircleHalf />,
      name: 'Contrast',
      description: 'Enhance detail and depth by adjusting contrast',
      color: 'text-gray-500'
    },
    {
      icon: <Palette />,
      name: 'Vibrance',
      description: 'Boost color richness and make photos more appealing',
      color: 'text-orange-500'
    },
    {
      icon: <MagicWand />,
      name: 'Sharpen',
      description: 'Enhance edges and fine details for crisp images',
      color: 'text-purple-500'
    },
    {
      icon: <ImageSquare />,
      name: 'Denoise',
      description: 'Reduce grain and noise for cleaner photos',
      color: 'text-green-500'
    }
  ]

  const tips = [
    'Use Auto Enhance as a starting point for quick improvements',
    'Combine multiple enhancements for best results',
    'Brighten is perfect for dark interior shots',
    'Apply Vibrance to outdoor photos to make colors pop',
    'Sharpen helps with slightly blurry images',
    'Always preview before applying changes',
    'High-quality source images yield better results'
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkle className="text-primary" weight="fill" />
          Photo Enhancement Guide
        </CardTitle>
        <CardDescription>
          Learn how to make your property photos stand out
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 text-sm">Available Enhancements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enhancements.map((enhancement) => (
              <div
                key={enhancement.name}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50"
              >
                <div className={`${enhancement.color} mt-0.5`}>
                  {enhancement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{enhancement.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {enhancement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-sm">Pro Tips</h3>
          <div className="space-y-2">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <Badge variant="outline" className="mt-0.5 shrink-0">
                  {index + 1}
                </Badge>
                <p className="text-muted-foreground">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2 text-sm flex items-center gap-2">
            <Sparkle size={16} className="text-primary" />
            Why Enhanced Photos Matter
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
            <li>Properties with professional photos get 40% more views</li>
            <li>High-quality images increase booking rates significantly</li>
            <li>Well-lit, sharp photos build trust with potential renters</li>
            <li>Enhanced photos make your listing stand out from competitors</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
