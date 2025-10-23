export interface KeywordData {
  id: string
  keyword: string
  searchVolume: number
  difficulty: number
  competition: 'low' | 'medium' | 'high'
  cpc: number
  trend: 'rising' | 'stable' | 'falling'
  relatedKeywords: string[]
  createdAt: number
}

export interface ContentAnalysis {
  id: string
  content: string
  title: string
  metaDescription: string
  seoScore: number
  readabilityScore: number
  wordCount: number
  keywordDensity: Record<string, number>
  suggestions: SEOSuggestion[]
  headings: {
    h1: string[]
    h2: string[]
    h3: string[]
  }
  images: {
    total: number
    withAlt: number
    withoutAlt: number
  }
  links: {
    internal: number
    external: number
  }
  createdAt: number
}

export interface SEOSuggestion {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  category: 'title' | 'meta' | 'content' | 'keywords' | 'readability' | 'structure' | 'images' | 'links'
  message: string
  priority: number
}

export interface GeneratedContent {
  id: string
  type: 'blog_post' | 'product_description' | 'meta_tags' | 'ad_copy' | 'social_post'
  title: string
  content: string
  keywords: string[]
  tone: 'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive'
  length: 'short' | 'medium' | 'long'
  seoScore?: number
  createdAt: number
}

export interface BacklinkData {
  id: string
  domain: string
  url: string
  authorityScore: number
  domainRating: number
  backlinks: Backlink[]
  totalBacklinks: number
  referringDomains: number
  toxicLinks: number
  createdAt: number
}

export interface Backlink {
  id: string
  sourceUrl: string
  sourceDomain: string
  targetUrl: string
  anchorText: string
  domainRating: number
  type: 'dofollow' | 'nofollow'
  status: 'active' | 'broken' | 'toxic'
  firstSeen: number
}

export interface CompetitorAnalysis {
  id: string
  competitors: string[]
  yourDomain: string
  keywordOverlap: {
    competitor: string
    sharedKeywords: number
    uniqueToCompetitor: number
    uniqueToYou: number
    keywords: string[]
  }[]
  contentGaps: {
    keyword: string
    competitorRanking: Record<string, number>
    yourRanking?: number
    opportunity: 'high' | 'medium' | 'low'
  }[]
  createdAt: number
}

export interface ContentCalendarItem {
  id: string
  title: string
  type: 'blog_post' | 'article' | 'video' | 'infographic' | 'social_post' | 'email'
  keywords: string[]
  publishDate: number
  status: 'draft' | 'in_progress' | 'review' | 'scheduled' | 'published'
  assignedTo?: string
  notes?: string
  url?: string
  createdAt: number
}

export interface SEOAudit {
  id: string
  url: string
  overallScore: number
  technicalSEO: {
    score: number
    issues: AuditIssue[]
  }
  onPageSEO: {
    score: number
    issues: AuditIssue[]
  }
  contentQuality: {
    score: number
    issues: AuditIssue[]
  }
  userExperience: {
    score: number
    issues: AuditIssue[]
  }
  createdAt: number
}

export interface AuditIssue {
  id: string
  category: 'technical' | 'on_page' | 'content' | 'ux'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  recommendation: string
  affectedPages?: string[]
}

export interface MetaTags {
  id: string
  title: string
  description: string
  keywords: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  createdAt: number
}

export interface RankingData {
  id: string
  keyword: string
  url: string
  position: number
  previousPosition?: number
  searchVolume: number
  traffic: number
  change: number
  lastChecked: number
}

export interface AnalyticsSummary {
  totalKeywords: number
  averagePosition: number
  totalTraffic: number
  topRankingKeywords: RankingData[]
  improvingKeywords: RankingData[]
  decliningKeywords: RankingData[]
  timeRange: '7d' | '30d' | '90d' | 'all'
}
