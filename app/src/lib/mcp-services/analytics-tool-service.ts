// lib/mcp-services/analytics-tool-service.ts
import type { SocialIntegration } from '@/lib/integrationService/server'
import { socialIntegrationService } from '@/lib/integrationService/server'
import { createClient } from '@/lib/supabase/server'
import { FacebookPost } from '@/typings/SocialAccountTypings/FacebookPosts'

export interface AnalyticsMetrics {
  followers?: number
  engagement?: number
  reach?: number
  impressions?: number
  clicks?: number
  views?: number
  likes?: number
  comments?: number
  shares?: number
}

export interface AnalyticsData {
  platform: string
  timeframe: string
  metrics: AnalyticsMetrics
  period_start: string
  period_end: string
}

export class AnalyticsToolService {
  /**
   * Calculate date range based on timeframe
   */
  private static calculateDateRange(timeframe: '7d' | '30d' | '90d' | '1y'): {
    periodStart: Date
    periodEnd: Date
  } {
    const periodEnd = new Date()
    const periodStart = new Date()

    switch (timeframe) {
      case '7d':
        periodStart.setDate(periodStart.getDate() - 7)
        break
      case '30d':
        periodStart.setDate(periodStart.getDate() - 30)
        break
      case '90d':
        periodStart.setDate(periodStart.getDate() - 90)
        break
      case '1y':
        periodStart.setFullYear(periodStart.getFullYear() - 1)
        break
    }

    return { periodStart, periodEnd }
  }

  /**
   * Get analytics for a specific platform and timeframe
   */
  static async getUserAnalytics(
    platform: SocialIntegration['platform'],
    timeframe: '7d' | '30d' | '90d' | '1y',
    metrics?: string[]
  ): Promise<AnalyticsData> {
    // Get the user's integration for this platform
    const integration = await socialIntegrationService.getSocialIntegration(
      platform
    )

    if (!integration) {
      throw new Error(
        `No ${platform} integration found. Please connect your ${platform} account first.`
      )
    }

    if (
      !integration.is_active ||
      integration.connection_status !== 'connected'
    ) {
      throw new Error(
        `${platform} integration is not active. Connection status: ${integration.connection_status}`
      )
    }

    // Calculate date range
    const { periodStart, periodEnd } = this.calculateDateRange(timeframe)

    // Fetch analytics based on platform
    let analyticsMetrics: AnalyticsMetrics = {}

    if (platform === 'facebook') {
      analyticsMetrics = await this.fetchFacebookInsights(
        integration.user_id,
        periodStart,
        periodEnd,
        metrics
      )
    } else {
      throw new Error(`Platform ${platform} is not supported yet`)
    }

    return {
      platform,
      timeframe,
      metrics: analyticsMetrics,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    }
  }

  /**
   * Fetch Facebook Page Insights
   */
  private static async fetchFacebookInsights(
    userId: string,
    periodStart: Date,
    periodEnd: Date,
    requestedMetrics?: string[]
  ): Promise<AnalyticsMetrics> {
    const supabase = await createClient()

    // First, get the user's Facebook pages
    const { data: pages, error: pagesError } = await supabase
      .from('facebook_pages')
      .select('id')
      .eq('user_id', userId)

    if (pagesError) throw pagesError
    if (!pages || pages.length === 0) {
      throw new Error('No Facebook pages found for this user')
    }

    const pageIds = pages.map((p) => p.id)

    const { data: insights, error } = await supabase
      .from('facebook_page_insights')
      .select('*')
      .in('page_id', pageIds)
      .gte('date', periodStart.toISOString().split('T')[0])
      .lte('date', periodEnd.toISOString().split('T')[0])
      .order('date', { ascending: false })

    if (error) throw error
    if (!insights || insights.length === 0) {
      throw new Error(
        'No Facebook insights data found for the specified timeframe'
      )
    }

    const metrics: AnalyticsMetrics = {}

    const latestInsight = insights[0]
    if (!requestedMetrics || requestedMetrics.includes('followers')) {
      metrics.followers = Number(latestInsight.page_fans) || 0
    }

    if (!requestedMetrics || requestedMetrics.includes('engagement')) {
      metrics.engagement = insights.reduce(
        (sum, row) => sum + (Number(row.page_post_engagements) || 0),
        0
      )
    }

    if (!requestedMetrics || requestedMetrics.includes('impressions')) {
      metrics.impressions = insights.reduce(
        (sum, row) => sum + (Number(row.page_impressions) || 0),
        0
      )
    }

    if (!requestedMetrics || requestedMetrics.includes('reach')) {
      metrics.reach = insights.reduce(
        (sum, row) => sum + (Number(row.page_impressions_unique) || 0),
        0
      )
    }

    if (!requestedMetrics || requestedMetrics.includes('views')) {
      metrics.views = insights.reduce(
        (sum, row) => sum + (Number(row.page_video_views) || 0),
        0
      )
    }

    if (!requestedMetrics || requestedMetrics.includes('likes')) {
      metrics.likes = insights.reduce(
        (sum, row) =>
          sum + (Number(row.page_actions_post_reactions_like_total) || 0),
        0
      )
    }

    if (!requestedMetrics || requestedMetrics.includes('clicks')) {
      metrics.clicks = insights.reduce(
        (sum, row) => sum + (Number(row.page_total_actions) || 0),
        0
      )
    }

    return metrics
  }

  /**
   * Get top performing content
   */
  static async getTopPerformingContent(
    platform: SocialIntegration['platform'],
    limit: number = 10,
    metric:
      | 'likes'
      | 'comments'
      | 'shares'
      | 'engagement_rate' = 'engagement_rate'
  ) {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const integration = await socialIntegrationService.getSocialIntegration(
      platform
    )

    if (!integration) {
      throw new Error(
        `No ${platform} integration found. Please connect your ${platform} account first.`
      )
    }

    if (
      !integration.is_active ||
      integration.connection_status !== 'connected'
    ) {
      throw new Error(
        `${platform} integration is not active. Connection status: ${integration.connection_status}`
      )
    }

    if (platform !== 'facebook') {
      throw new Error(`Platform ${platform} is not supported yet`)
    }

    const { data: pages, error: pagesError } = await supabase
      .from('facebook_pages')
      .select('id, page_name')
      .eq('social_integration_id', integration.id)
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (pagesError) {
      throw new Error(`Failed to fetch Facebook pages: ${pagesError.message}`)
    }

    if (!pages || pages.length === 0) {
      throw new Error('No active Facebook pages found for this integration')
    }

    const pageIds = pages.map((page) => page.id)

    const { data: posts, error: postsError } = await supabase
      .from('facebook_posts')
      .select(
        `
        *,
        insights:facebook_post_insights(*)
      `
      )
      .in('page_id', pageIds)
      .order('created_time', { ascending: false })
      .limit(100) // Get more posts to analyze, then filter to top performers

    if (postsError) {
      throw new Error(`Failed to fetch posts: ${postsError.message}`)
    }

    if (!posts || posts.length === 0) {
      throw new Error('No posts found for this integration')
    }

    // Calculate metrics for each post
    const postsWithMetrics = posts.map((post: FacebookPost) => {
      // Calculate likes from reactions
      const reactions =
        typeof post.reactions === 'object' && post.reactions !== null
          ? post.reactions.data?.length || 0
          : 0

      // Calculate comments
      const comments =
        typeof post.comments === 'object' && post.comments !== null
          ? post.comments.data?.length || 0
          : 0

      const shares = post.shares?.count || 0

      const insights = post.insights || []
      const latestInsight = insights[0] || {}

      const postReactions =
        Number(latestInsight.post_reactions_like_total) ||
        Number(latestInsight.post_reactions_total) ||
        reactions ||
        0
      const postComments =
        Number(latestInsight.post_engaged_users) || comments || 0
      const postShares = Number(latestInsight.post_actions) || shares || 0
      const impressions =
        Number(latestInsight.post_impressions) ||
        Number(latestInsight.post_impressions_unique) ||
        0
      const reach = Number(latestInsight.post_reach) || impressions || 0

      const totalEngagement = postReactions + postComments + postShares

      const engagementRate =
        reach > 0
          ? ((totalEngagement / reach) * 100).toFixed(2)
          : impressions > 0
          ? ((totalEngagement / impressions) * 100).toFixed(2)
          : '0.00'

      return {
        id: post.id,
        platform,
        content: post.message || post.description || post.name || '',
        created_at: post.created_time,
        metrics: {
          likes: postReactions,
          comments: postComments,
          shares: postShares,
          engagement_rate: engagementRate,
          total_engagement: totalEngagement,
          impressions,
          reach,
        },
        url: post.permalink_url || `https://facebook.com/${post.id}`,
        type: post.type || 'post',
        page_name:
          pages.find((p) => p.id === post.page_id)?.page_name || 'Unknown',
      }
    })

    postsWithMetrics.sort((a, b) => {
      let aValue: number
      let bValue: number

      if (metric === 'engagement_rate') {
        aValue = parseFloat(a.metrics.engagement_rate as string)
        bValue = parseFloat(b.metrics.engagement_rate as string)
      } else {
        aValue = a.metrics[metric] as number
        bValue = b.metrics[metric] as number
      }

      return bValue - aValue
    })

    // Return top posts
    const topPosts = postsWithMetrics.slice(0, limit)

    return {
      platform,
      metric,
      posts: topPosts,
      total_posts: posts.length,
      analyzed_posts: topPosts.length,
    }
  }
}
