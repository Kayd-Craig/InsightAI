/* eslint-disable */
// DEFINE API RESULT STRUCTURES
export interface FacebookPageFromAPI {
  id: string
  name: string
  category: string
  access_token: string
  followers_count?: number
}

export interface FacebookPostFromAPI {
  id: string
  actions: Array<{ link: string; name?: string }> | null
  admin_creator: string | null
  allowed_advertising_objectives: Array<{ objective: string }> | null
  application: Record<string, any> | null
  backdated_time: string | null
  call_to_action: Record<string, any> | null
  can_reply_privately: boolean | null
  caption: string | null
  child_attachments: Array<{ link: string; media?: Record<string, any> }> | null
  comments_mirroring_domain: string | null
  coordinates: Record<string, any> | null
  created_time: string
  description: string | null
  event: Record<string, any> | null
  expanded_height: number | null
  expanded_width: number | null
  feed_targeting: Record<string, any> | null
  from: Record<string, any> | null
  full_picture: string | null
  height: number | null
  icon: string | null
  instagram_eligibility: string | null
  is_app_share: boolean | null
  is_eligible_for_promotion: boolean | null
  promotion_status: string
  is_expired: boolean | null
  is_hidden: boolean | null
  is_inline_created: boolean | null
  is_instagram_eligible: boolean | null
  is_popular: boolean | null
  is_published: boolean | null
  is_spherical: boolean | null
  link: string | null
  message: string | null
  message_tags: Array<Record<string, any>> | null
  multi_share_end_card: boolean | null
  multi_share_optimized: boolean | null
  name: string | null
  object_id: string | null
  parent_id: string | null
  permalink_url: string | null
  place: Record<string, any> | null
  privacy: Record<string, any> | null
  promotable_id: string | null
  properties: Array<Record<string, any>> | null
  scheduled_publish_time: string | null
  shares: { count?: number } | null
  source: string | null
  status_type: string | null
  story: string | null
  story_tags: Array<Record<string, any>> | null
  subscribed: boolean | null
  target: Record<string, any> | null
  targeting: Record<string, any> | null
  timeline_visibility: string | null
  type: string | null
  updated_time: string | null
  via: Record<string, any> | null
  video_buying_eligibility: string | null
  width: number | null
  attachments: {
    data: any[]
  }
  comments: {
    data: Array<Record<string, any>>
    paging?: { cursors?: Record<string, any> }
  } | null
  reactions: {
    data: Array<Record<string, any>>
    paging?: { cursors?: Record<string, any> }
  } | null
  likes: {
    data: Array<Record<string, any>>
    paging?: { cursors?: Record<string, any> }
  } | null
}

export interface FacebookInsightFromAPI {
  id: string
  name: string
  title: string | null
  period: string
  values: Array<{
    value: number | Record<string, any>
    end_time?: string
  }>
  description: string
}
