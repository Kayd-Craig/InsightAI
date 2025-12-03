/* eslint-disable */
// STORE ALL FACEBOOK TYPES HERE
// SHOULD MATCH DATABASE

// Database types
export interface SocialIntegration {
  id: string
  user_id: string
  platform: 'facebook'
  platform_user_id: string
  platform_username: string | null
  platform_email: string | null
  access_token: string
  refresh_token: string | null
  token_expires_at: string | null
  last_sync_at: string | null
  last_authenticated_at: string | null
  created_at: string
  updated_at: string
}

export interface FacebookPage {
  id: string
  user_id: string
  social_integration_id: string
  page_name: string
  page_category: string | null
  page_access_token: string
  followers_count: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FacebookPost {
  id: string
  social_integration_id: string
  user_id: string
  page_id: string
  platform: string
  actions: Array<{
    name: string
    link: string
  }>
  admin_creator: string | null
  allowed_advertising_objectives: Array<{ objective: string }> | null
  application: Record<string, any> | null
  backdated_time: string | null
  call_to_action: Record<string, any> | null
  can_reply_privately: boolean
  caption: string | null
  child_attachments: Array<{ link: string; media?: Record<string, any> }> | null
  comments_mirroring_domain: string | null
  coordinates: Record<string, any>
  created_time: string
  description: string | null
  event: Record<string, any> | null
  expanded_height: number | null
  expanded_width: number | null
  feed_targeting: Record<string, any> | null
  from: {
    name: string
    id: string
  }
  full_picture: string
  height: number | null
  icon: string
  instagram_eligibility: string
  is_app_share: boolean | null
  is_eligible_for_promotion: boolean
  promotion_status: string
  is_expired: boolean
  is_hidden: boolean
  is_inline_created: boolean
  is_instagram_eligible: boolean
  is_popular: boolean
  is_published: boolean
  is_spherical: boolean
  link: string | null
  message: string | null
  message_tags: Array<Record<string, any>> | null
  multi_share_end_card: boolean
  multi_share_optimized: boolean
  name: string | null
  object_id: string | null
  parent_id: string | null
  permalink_url: string
  place: Record<string, any> | null
  privacy: {
    allow: string
    deny: string
    description: string
    friends: string
    value: string
  }
  promotable_id: string
  properties: Array<Record<string, any>> | null
  scheduled_publish_time: string | null
  shares: { count?: number } | null
  source: string | null
  status_type: string
  story: string
  story_tags: Array<{
    id: string
    name: string
    type: string
    offset: number
    length: number
  }>
  subscribed: boolean
  target: Record<string, any> | null
  targeting: Record<string, any> | null
  timeline_visibility: string
  type: string | null
  updated_time: string
  via: Record<string, any> | null
  video_buying_eligibility: string[]
  width: number | null
  attachments: {
    data: any[]
  }
  comments: {
    data: Array<Record<string, any>>
    paging?: { cursors?: Record<string, any> }
    summary: Record<string, number>
  } | null
  reactions: {
    data: Array<Record<string, any>>
    paging?: { cursors?: Record<string, any> }
  } | null
  likes: {
    data: Array<Record<string, any>>
    paging?: { cursors?: Record<string, any> }
  } | null
  post_source: string
  fetched_at: string
}

export interface FacebookPostInsightRaw {
  user_id: string
  post_id: string | null
  raw_data: JSON
  fetched_at: string
}

export interface FacebookPageInsightRaw {
  user_id: string
  page_id: string | null
  raw_data: JSON
  fetched_at: string
}

export interface FacebookPageInsight {
  id: string
  page_id: string
  user_id: string
  period: string
  date: string
  fetched_at: string
  updated_at: string
  [key: string]: string | number | Record<string, any>
}

export interface FacebookPostInsight {
  id: string
  user_id: string
  post_id: string
  period: string
  date: string
  fetched_at: string
  updated_at: string
  [key: string]: string | number | Record<string, any>
}

// Joined types for queries
export interface FacebookPageWithInsights extends FacebookPage {
  insights: FacebookPageInsight[]
}

export interface FacebookPostWithInsights extends FacebookPost {
  insights: FacebookPostInsight[]
  page?: FacebookPage
}

// Sync statistics
export interface SyncStats {
  pages_synced: number
  page_insights_synced: number
  posts_synced: number
  post_insights_synced: number
}

export interface SyncResult {
  success: boolean
  message: string
  skipped: boolean
  synced_at?: string
  last_sync_at?: string
  stats?: SyncStats
}
