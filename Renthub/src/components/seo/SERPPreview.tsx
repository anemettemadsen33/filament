import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Globe } from '@phosphor-icons/react'
import type { MetaTags } from '@/lib/seo-types'

interface SERPPreviewProps {
  metaTags: MetaTags[]
}

export function SERPPreview({ metaTags }: SERPPreviewProps) {
  const [title, setTitle] = useState('Your Page Title | Brand Name')
  const [description, setDescription] = useState('Your meta description appears here. Make it compelling to increase click-through rates from search results.')
  const [url, setUrl] = useState('https://yoursite.com/page-url')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" weight="bold" />
            SERP Preview
          </CardTitle>
          <CardDescription>
            Preview how your content appears in search results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Page Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/60 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Meta Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meta description"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length}/160 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">URL</label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Desktop Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-white">
            <div className="text-sm text-green-700 mb-1">{url}</div>
            <div className="text-blue-600 text-xl hover:underline cursor-pointer mb-2 font-medium">
              {title || 'Your title will appear here'}
            </div>
            <div className="text-gray-600 text-sm leading-relaxed">
              {description || 'Your description will appear here'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mobile Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-white max-w-sm">
            <div className="text-xs text-green-700 mb-1 truncate">{url}</div>
            <div className="text-blue-600 text-base hover:underline cursor-pointer mb-1 font-medium line-clamp-2">
              {title || 'Your title will appear here'}
            </div>
            <div className="text-gray-600 text-xs leading-relaxed line-clamp-3">
              {description || 'Your description will appear here'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
