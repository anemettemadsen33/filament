import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { MagnifyingGlass, TrendUp, TrendDown, Minus, Trash, Download } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { KeywordData } from '@/lib/seo-types'

interface KeywordResearchProps {
  keywords: KeywordData[]
  onAddKeyword: (keyword: KeywordData) => void
  onDeleteKeyword: (id: string) => void
}

export function KeywordResearch({ keywords, onAddKeyword, onDeleteKeyword }: KeywordResearchProps) {
  const [seedKeyword, setSeedKeyword] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeKeyword = async () => {
    if (!seedKeyword.trim()) {
      toast.error('Please enter a keyword')
      return
    }

    setIsAnalyzing(true)

    try {
      const promptText = `You are an SEO keyword research expert. Analyze the keyword "${seedKeyword}" and provide:
1. Estimated monthly search volume (a realistic number between 100-500000)
2. Keyword difficulty score (0-100, where 0 is easiest)
3. Competition level (low, medium, or high)
4. Estimated CPC in USD
5. Trend (rising, stable, or falling)
6. 10 highly relevant related keywords

Return ONLY a JSON object with this exact structure:
{
  "searchVolume": number,
  "difficulty": number,
  "competition": "low" | "medium" | "high",
  "cpc": number,
  "trend": "rising" | "stable" | "falling",
  "relatedKeywords": ["keyword1", "keyword2", ...]
}`

      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const data = JSON.parse(response)

      const newKeyword: KeywordData = {
        id: `keyword-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        keyword: seedKeyword.trim(),
        searchVolume: data.searchVolume,
        difficulty: data.difficulty,
        competition: data.competition,
        cpc: data.cpc,
        trend: data.trend,
        relatedKeywords: data.relatedKeywords,
        createdAt: Date.now()
      }

      onAddKeyword(newKeyword)
      toast.success('Keyword analyzed successfully!')
      setSeedKeyword('')
    } catch (error) {
      console.error('Keyword analysis error:', error)
      toast.error('Failed to analyze keyword. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty < 30) return 'text-accent'
    if (difficulty < 60) return 'text-warning'
    return 'text-destructive'
  }

  const getCompetitionBadge = (competition: string) => {
    const colors = {
      low: 'bg-accent/10 text-accent border-accent/20',
      medium: 'bg-warning/10 text-warning border-warning/20',
      high: 'bg-destructive/10 text-destructive border-destructive/20'
    }
    return colors[competition as keyof typeof colors]
  }

  const exportKeywords = () => {
    const csv = [
      'Keyword,Search Volume,Difficulty,Competition,CPC,Trend',
      ...keywords.map(k => `"${k.keyword}",${k.searchVolume},${k.difficulty},${k.competition},${k.cpc},${k.trend}`)
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keywords-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Keywords exported!')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MagnifyingGlass className="h-6 w-6" weight="bold" />
            Keyword Research
          </CardTitle>
          <CardDescription>
            Discover high-value keywords with AI-powered analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter seed keyword (e.g., digital marketing)"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyzeKeyword()}
              disabled={isAnalyzing}
            />
            <Button onClick={analyzeKeyword} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>

          {keywords.length > 0 && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={exportKeywords}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {keywords.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MagnifyingGlass className="h-16 w-16 text-muted-foreground mb-4" weight="duotone" />
            <p className="text-muted-foreground text-center">
              Enter a keyword above to start your research
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {keywords.map((keyword) => (
            <Card key={keyword.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{keyword.keyword}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getCompetitionBadge(keyword.competition)}>
                        {keyword.competition} competition
                      </Badge>
                      {keyword.trend === 'rising' && <TrendUp className="h-4 w-4 text-accent" weight="bold" />}
                      {keyword.trend === 'falling' && <TrendDown className="h-4 w-4 text-destructive" weight="bold" />}
                      {keyword.trend === 'stable' && <Minus className="h-4 w-4 text-muted-foreground" weight="bold" />}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteKeyword(keyword.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Search Volume</p>
                    <p className="text-2xl font-bold">{keyword.searchVolume.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Difficulty</p>
                    <p className={`text-2xl font-bold ${getDifficultyColor(keyword.difficulty)}`}>
                      {keyword.difficulty}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPC</p>
                    <p className="text-2xl font-bold">${keyword.cpc.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <p className="text-2xl font-bold capitalize">{keyword.trend}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Keyword Difficulty</p>
                  <Progress value={keyword.difficulty} className="h-2" />
                </div>

                {keyword.relatedKeywords.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Related Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {keyword.relatedKeywords.slice(0, 10).map((related, idx) => (
                        <Badge key={idx} variant="secondary">
                          {related}
                        </Badge>
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
