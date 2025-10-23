import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FileText, CheckCircle, WarningCircle, Lightbulb, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { ContentAnalysis, SEOSuggestion } from '@/lib/seo-types'

interface ContentOptimizerProps {
  analyses: ContentAnalysis[]
  onAddAnalysis: (analysis: ContentAnalysis) => void
  onDeleteAnalysis: (id: string) => void
}

export function ContentOptimizer({ analyses, onAddAnalysis, onDeleteAnalysis }: ContentOptimizerProps) {
  const [title, setTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [content, setContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeContent = async () => {
    if (!content.trim() || content.trim().split(/\s+/).length < 50) {
      toast.error('Please enter at least 50 words of content')
      return
    }

    setIsAnalyzing(true)

    try {
      const wordCount = content.trim().split(/\s+/).length

      const promptText = `You are an SEO content analysis expert. Analyze this content:

Title: ${title || 'No title'}
Meta Description: ${metaDescription || 'No meta description'}
Content: ${content}

Provide a comprehensive SEO analysis. Return ONLY a JSON object with this structure:
{
  "seoScore": number (0-100),
  "readabilityScore": number (0-100),
  "suggestions": [
    {
      "type": "critical" | "warning" | "info" | "success",
      "category": "title" | "meta" | "content" | "keywords" | "readability" | "structure" | "images" | "links",
      "message": "specific suggestion text",
      "priority": number (1-5)
    }
  ]
}`

      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(response)

      const headings = {
        h1: content.match(/^#\s+(.+)$/gm) || [],
        h2: content.match(/^##\s+(.+)$/gm) || [],
        h3: content.match(/^###\s+(.+)$/gm) || []
      }

      const suggestions: SEOSuggestion[] = data.suggestions.map((s: any, idx: number) => ({
        id: `sugg-${Date.now()}-${idx}`,
        ...s
      }))

      const newAnalysis: ContentAnalysis = {
        id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        title: title || 'Untitled',
        metaDescription: metaDescription || '',
        seoScore: data.seoScore,
        readabilityScore: data.readabilityScore,
        wordCount,
        keywordDensity: {},
        suggestions,
        headings,
        images: {
          total: 0,
          withAlt: 0,
          withoutAlt: 0
        },
        links: {
          internal: 0,
          external: 0
        },
        createdAt: Date.now()
      }

      onAddAnalysis(newAnalysis)
      toast.success('Content analyzed!')
      setContent('')
      setTitle('')
      setMetaDescription('')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze content')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-accent'
    if (score >= 60) return 'text-warning'
    return 'text-destructive'
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-accent" weight="fill" />
      case 'critical':
      case 'warning':
        return <WarningCircle className="h-5 w-5 text-warning" weight="fill" />
      default:
        return <Lightbulb className="h-5 w-5 text-primary" weight="fill" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" weight="bold" />
            Content Optimizer
          </CardTitle>
          <CardDescription>
            Real-time SEO analysis and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              placeholder="Enter page title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isAnalyzing}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {title.length}/60 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Meta Description</label>
            <Textarea
              placeholder="Enter meta description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              disabled={isAnalyzing}
              rows={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metaDescription.length}/160 characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <Textarea
              placeholder="Paste your content here (minimum 50 words)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isAnalyzing}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          <Button onClick={analyzeContent} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
          </Button>
        </CardContent>
      </Card>

      {analyses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
            <p className="text-muted-foreground text-center">
              Enter content above to get SEO analysis and optimization tips
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <Card key={analysis.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{analysis.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.wordCount} words · {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteAnalysis(analysis.id)}
                    aria-label="Delete analysis"
                    title="Delete analysis"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">SEO Score</p>
                    <div className="flex items-center gap-3">
                      <p className={`text-3xl font-bold ${getScoreColor(analysis.seoScore)}`}>
                        {analysis.seoScore}
                      </p>
                      <Progress value={analysis.seoScore} className="flex-1" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Readability Score</p>
                    <div className="flex items-center gap-3">
                      <p className={`text-3xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                        {analysis.readabilityScore}
                      </p>
                      <Progress value={analysis.readabilityScore} className="flex-1" />
                    </div>
                  </div>
                </div>

                {analysis.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Optimization Suggestions</h4>
                    <div className="space-y-2">
                      {analysis.suggestions
                        .sort((a, b) => b.priority - a.priority)
                        .slice(0, 5)
                        .map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                          >
                            {getSuggestionIcon(suggestion.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-xs">
                                  {suggestion.category}
                                </Badge>
                              </div>
                              <p className="text-sm">{suggestion.message}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
