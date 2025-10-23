import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sparkle, Trash, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { GeneratedContent } from '@/lib/seo-types'

interface AIContentGeneratorProps {
  generatedContent: GeneratedContent[]
  onAddContent: (content: GeneratedContent) => void
  onDeleteContent: (id: string) => void
}

export function AIContentGenerator({ generatedContent, onAddContent, onDeleteContent }: AIContentGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [type, setType] = useState<'blog_post' | 'product_description' | 'meta_tags' | 'ad_copy' | 'social_post'>('blog_post')
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive'>('professional')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateContent = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    setIsGenerating(true)

    try {
      const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean)
      
      const lengthGuide = {
        short: '200-300 words',
        medium: '500-700 words',
        long: '1000-1500 words'
      }

      const typeInstructions = {
        blog_post: 'Create a comprehensive blog post with introduction, main points, and conclusion.',
        product_description: 'Write compelling product copy highlighting benefits and features.',
        meta_tags: 'Generate SEO-optimized title tag (50-60 chars) and meta description (150-160 chars).',
        ad_copy: 'Create persuasive ad copy with attention-grabbing headline and compelling call-to-action.',
        social_post: 'Write engaging social media post with hashtags and emoji where appropriate.'
      }

      const promptText = `You are an expert SEO content writer. Create ${type.replace('_', ' ')} content.

Topic: ${topic}
Target Keywords: ${keywordList.join(', ') || 'None specified'}
Tone: ${tone}
Length: ${lengthGuide[length]}

Instructions: ${typeInstructions[type]}

Requirements:
- Use natural, engaging language
- Incorporate keywords naturally
- Make it SEO-friendly
- Match the ${tone} tone
- Be compelling and valuable to readers

Write the content now:`

      const content = await window.spark.llm(promptText, 'gpt-4o-mini')

      const newContent: GeneratedContent = {
        id: `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        title: topic,
        content,
        keywords: keywordList,
        tone,
        length,
        createdAt: Date.now()
      }

      onAddContent(newContent)
      toast.success('Content generated successfully!')
      setTopic('')
      setKeywords('')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkle className="h-6 w-6" weight="fill" />
            AI Content Generator
          </CardTitle>
          <CardDescription>
            Generate SEO-optimized content with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Content Type</label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger aria-label="Content type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog_post">Blog Post</SelectItem>
                  <SelectItem value="product_description">Product Description</SelectItem>
                  <SelectItem value="meta_tags">Meta Tags</SelectItem>
                  <SelectItem value="ad_copy">Ad Copy</SelectItem>
                  <SelectItem value="social_post">Social Post</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tone</label>
              <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                <SelectTrigger aria-label="Tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Length</label>
              <Select value={length} onValueChange={(v: any) => setLength(v)}>
                <SelectTrigger aria-label="Length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Topic</label>
            <Input
              placeholder="e.g., How to improve website SEO"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
              aria-label="Topic"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Target Keywords (comma-separated)</label>
            <Input
              placeholder="e.g., SEO tips, website optimization, search rankings"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={isGenerating}
              aria-label="Target keywords"
            />
          </div>

          <Button onClick={generateContent} disabled={isGenerating} className="w-full">
            {isGenerating ? 'Generating...' : 'Generate Content'}
          </Button>
        </CardContent>
      </Card>

      {generatedContent.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkle className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
            <p className="text-muted-foreground text-center">
              Configure options above and generate your first AI-powered content
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {generatedContent.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge>{item.type.replace('_', ' ')}</Badge>
                      <Badge variant="secondary">{item.tone}</Badge>
                      <Badge variant="outline">{item.length}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(item.content)}
                      aria-label="Copy content"
                      title="Copy content"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteContent(item.id)}
                      aria-label="Delete content"
                      title="Delete content"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {item.keywords.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Target Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {item.keywords.map((keyword, idx) => (
                        <Badge key={idx} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-muted/50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {item.content}
                  </pre>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Generated on {new Date(item.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
