interface FacebookReaction {
  id: string
  type: string
}

interface FacebookReactionsData {
  data?: FacebookReaction[]
  summary: Record<string, number>
}

interface FacebookComment {
  id: string
  message: string
}

interface FacebookCommentsData {
  data?: FacebookComment[]
  summary: Record<string, number>
}

interface FacebookSharesData {
  count?: number
}

export interface FacebookPost {
  id: string
  social_integration_id: string
  user_id: string
  platform: string
  page_id: string | null
  actions: unknown | null
  can_reply_privately: boolean | null
  coordinates: unknown | null
  created_time: string | null
  from: unknown | null
  full_picture: string | null
  icon: string | null
  instagram_eligibility: string | null
  is_eligible_for_promotion: boolean | null
  promotion_status: string | null
  is_expired: boolean | null
  is_hidden: boolean | null
  is_inline_created: boolean | null
  is_instagram_eligible: boolean | null
  is_popular: boolean | null
  is_published: boolean | null
  is_spherical: boolean | null
  multi_share_end_card: boolean | null
  multi_share_optimized: boolean | null
  permalink_url: string | null
  privacy: unknown | null
  promotable_id: string | null
  status_type: string | null
  story: string | null
  story_tags: unknown | null
  subscribed: boolean | null
  timeline_visibility: string | null
  updated_time: string | null
  video_buying_eligibility: unknown | null
  attachments: unknown | null
  post_source: string | null
  fetched_at: string | null
  comments: FacebookCommentsData | null
  reactions: FacebookReactionsData | null
  likes: unknown | null
  message: string | null
  admin_creator: string | null
  allowed_advertising_objectives: unknown | null
  application: unknown | null
  backdated_time: string | null
  call_to_action: unknown | null
  caption: string | null
  child_attachments: unknown | null
  comments_mirroring_domain: string | null
  description: string | null
  event: unknown | null
  expanded_height: number | null
  expanded_width: number | null
  feed_targeting: unknown | null
  height: number | null
  is_app_share: boolean | null
  link: string | null
  message_tags: unknown | null
  name: string | null
  object_id: string | null
  parent_id: string | null
  place: unknown | null
  properties: unknown | null
  scheduled_publish_time: string | null
  shares: FacebookSharesData | null
  source: string | null
  target: unknown | null
  targeting: unknown | null
  type: string | null
  via: unknown | null
  width: number | null
  insights: FacebookPostInsight[] | null
}

interface FacebookPostInsight {
  post_reactions_like_total?: number
  post_reactions_total?: number
  post_engaged_users?: number
  post_actions?: number
  post_impressions?: number
  post_impressions_unique?: number
  post_reach?: number
}
