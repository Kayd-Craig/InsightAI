import { socialIntegrationService } from '../integrationService/server'
import type { SocialIntegration } from '@/lib/integrationService/server'
import { createClient } from '../supabase/server'
import { FacebookPost } from '@/typings/SocialAccountTypings/FacebookPosts'

export type ContentType = 'post' | 'story' | 'reel' | 'video' | 'thread'

export class ContentSuggestionsToolService {
  /**
   * Generate content suggestions based on historical post performance
   */
  static async generateContentSuggestions(
    platform: SocialIntegration['platform'],
    contentType: ContentType,
    topic?: string,
    count: number = 3
  ) {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get the social integration for the platform
    const integration = await socialIntegrationService.getSocialIntegration(
      platform
    )

    if (!integration) {
      throw new Error(`No ${platform} integration found`)
    }

    // Get Facebook pages for this integration
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
      .select('*')
      .in('page_id', pageIds)
      .order('created_time', { ascending: false })
      .limit(50)

    if (postsError) {
      throw new Error(`Failed to fetch posts: ${postsError.message}`)
    }

    const analysis = this.analyzePosts(posts || [])

    const suggestions = this.generateSuggestionsFromAnalysis(
      analysis,
      count,
      contentType,
      platform,
      topic
    )

    return {
      platform,
      content_type: contentType,
      topic: topic || 'general',
      suggestions,
      analysis_summary: {
        total_posts_analyzed: posts?.length || 0,
        pages_analyzed: pages.length,
        top_performing_types: analysis.topPostTypes,
        average_engagement: analysis.avgEngagement,
      },
      generated_at: new Date().toISOString(),
    }
  }

  /**
   * Analyze historical posts to identify patterns
   */
  private static analyzePosts(posts: FacebookPost[]) {
    if (posts.length === 0) {
      return {
        topPostTypes: [],
        avgEngagement: 0,
        bestPostingTimes: [],
        commonTopics: [],
      }
    }

    const typeCounts: Record<string, number> = {}
    posts.forEach((post: FacebookPost) => {
      const type = post.type || 'unknown'
      typeCounts[type] = (typeCounts[type] || 0) + 1
    })

    const topPostTypes = Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([type]) => type)

    const engagements = posts
      .map((post: FacebookPost) => {
        const reactions =
          typeof post.reactions === 'object' && post.reactions !== null
            ? post.reactions.summary?.total_count ||
              post.reactions.data?.length ||
              0
            : 0
        const comments =
          typeof post.comments === 'object' && post.comments !== null
            ? post.comments.summary?.total_count ||
              post.comments.data?.length ||
              0
            : 0
        const shares = post.shares?.count || 0
        return reactions + comments + shares
      })
      .filter((val) => val > 0)

    const avgEngagement =
      engagements.length > 0
        ? engagements.reduce((sum, val) => sum + val, 0) / engagements.length
        : 0

    const postingHours: number[] = []
    posts.forEach((post) => {
      if (post.created_time) {
        const date = new Date(post.created_time)
        postingHours.push(date.getHours())
      }
    })

    const hourCounts: Record<number, number> = {}
    postingHours.forEach((hour) => {
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    const bestPostingTimes = Object.entries(hourCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour))

    const messages = posts
      .map((post) => post.message || post.description || '')
      .filter((msg) => msg.length > 0)

    return {
      topPostTypes,
      avgEngagement: Math.round(avgEngagement),
      bestPostingTimes,
      commonTopics: messages.slice(0, 10),
    }
  }

  /**
   * Generate suggestions based on analysis
   */
  private static generateSuggestionsFromAnalysis(
    analysis: {
      topPostTypes: string[]
      avgEngagement: number
      bestPostingTimes: number[]
      commonTopics: string[]
    },
    count: number,
    contentType: ContentType,
    platform: string,
    topic?: string
  ) {
    const suggestions = []

    for (let i = 0; i < count; i++) {
      const bestHour =
        analysis.bestPostingTimes.length > 0
          ? analysis.bestPostingTimes[i % analysis.bestPostingTimes.length]
          : 14 // Default to 2 PM

      const days = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ]

      suggestions.push({
        id: `suggestion_${i + 1}`,
        title: topic
          ? `${topic} Content Idea ${i + 1}`
          : `${contentType} Idea ${i + 1}`,
        description: this.generateDescription(platform, contentType, topic),
        content_type: contentType,
        platform,
        best_posting_time: {
          day: days[i % days.length],
          hour: bestHour,
          timezone: 'Your local time',
        },
        hashtags: this.generateHashtags(topic),
        tips: this.generateTips(platform),
        based_on_analysis: {
          inspired_by_type:
            analysis.topPostTypes[i % analysis.topPostTypes.length] ||
            contentType,
          expected_engagement: `Based on your average of ${analysis.avgEngagement} engagements per post`,
        },
      })
    }

    return suggestions
  }

  private static generateDescription(
    platform: string,
    contentType: ContentType,
    topic?: string
  ): string {
    const templates = [
      `Create a ${contentType} about ${
        topic || 'your niche'
      } that showcases behind-the-scenes content`,
      `Share a ${contentType} featuring user testimonials or success stories`,
      `Post a ${contentType} with actionable tips related to ${
        topic || 'your audience interests'
      }`,
      `Develop a ${contentType} that answers common questions from your audience`,
      `Create an engaging ${contentType} using trending audio or effects`,
    ]
    return templates[Math.floor(Math.random() * templates.length)]
  }

  private static suggestPostingTime() {
    const days = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]
    const hours = [9, 12, 15, 18, 21]

    return {
      day: days[Math.floor(Math.random() * days.length)],
      hour: hours[Math.floor(Math.random() * hours.length)],
      timezone: 'Your local time',
    }
  }

  private static generateHashtags(topic?: string): string[] {
    const baseHashtags = ['trending', 'viral', 'explore', 'fyp', 'instagood']
    const topicHashtags = topic ? [topic.toLowerCase().replace(/\s+/g, '')] : []

    return [...topicHashtags, ...baseHashtags.slice(0, 4)]
  }

  private static generateTips(platform: string): string[] {
    return [
      `Use high-quality visuals for better engagement`,
      `Include a clear call-to-action`,
      `Post during peak activity hours`,
      `Engage with comments within the first hour`,
      `Use relevant hashtags (5-10 for ${platform})`,
    ]
  }
}
