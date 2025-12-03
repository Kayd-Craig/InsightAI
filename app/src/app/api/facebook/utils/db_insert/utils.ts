/* eslint-disable */
import { SupabaseClient } from '@supabase/supabase-js'
import { FacebookInsightFromAPI } from '../../types/api'

// Insert a single page
export async function insertPage(
  supabase: SupabaseClient,
  pageData: any,
  user: any,
  integration: any
): Promise<any | null> {
  try {
    const { data: page, error: pageError } = await supabase
      .from('facebook_pages')
      .upsert(
        {
          id: pageData.id,
          user_id: user.id,
          social_integration_id: integration.id,
          page_name: pageData.name,
          page_category: pageData.category || null,
          page_access_token: pageData.access_token,
          followers_count: pageData.followers_count || null,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single()

    if (pageError) {
      console.error('Error storing page:', pageError)
      return null
    }

    return page
  } catch (error) {
    console.error('Exception storing page:', error)
    return null
  }
}

// Insert page insights (raw format)
export async function insertPageInsightsRaw(
  supabase: SupabaseClient,
  pageInsights: any[],
  pageId: string,
  userId: string
): Promise<number> {
  try {
    const { error: insightError } = await supabase
      .from('facebook_page_insights_raw')
      .upsert(
        {
          user_id: userId,
          page_id: pageId,
          raw_data: pageInsights,
          fetched_at: new Date().toISOString(),
        },
        {
          onConflict: 'page_id,fetched_at',
        }
      )

    if (insightError) {
      console.error('Error storing page insights:', insightError)
      return 0
    }

    return 1
  } catch (error) {
    console.error('Exception storing page insights:', error)
    return 0
  }
}

// Insert a single post
export async function insertPost(
  supabase: SupabaseClient,
  postMetadata: any,
  page: any,
  user: any,
  integration: any
): Promise<any | null> {
  try {
    const { data: post, error: postError } = await supabase
      .from('facebook_posts')
      .upsert(
        {
          id: postMetadata.id,
          user_id: user.id,
          social_integration_id: integration.id,
          page_id: page.id,
          platform: 'facebook',
          actions: postMetadata.actions || null,
          admin_creator: postMetadata.admin_creator || null,
          allowed_advertising_objectives:
            postMetadata.allowed_advertising_objectives || null,
          application: postMetadata.application || null,
          backdated_time: postMetadata.backdated_time || null,
          call_to_action: postMetadata.call_to_action || null,
          can_reply_privately: postMetadata.can_reply_privately ?? false,
          caption: postMetadata.caption || null,
          child_attachments: postMetadata.child_attachments || null,
          comments_mirroring_domain:
            postMetadata.comments_mirroring_domain || null,
          coordinates: postMetadata.coordinates || null,
          created_time: postMetadata.created_time,
          description: postMetadata.description || null,
          event: postMetadata.event || null,
          expanded_height: postMetadata.expanded_height || null,
          expanded_width: postMetadata.expanded_width || null,
          feed_targeting: postMetadata.feed_targeting || null,
          from: postMetadata.from || null,
          full_picture: postMetadata.full_picture || null,
          height: postMetadata.height || null,
          icon: postMetadata.icon || null,
          instagram_eligibility: postMetadata.instagram_eligibility || null,
          is_app_share: postMetadata.is_app_share ?? null,
          is_eligible_for_promotion:
            postMetadata.is_eligible_for_promotion ?? false,
          promotion_status: postMetadata.promotion_status || null,
          is_expired: postMetadata.is_expired ?? false,
          is_hidden: postMetadata.is_hidden ?? false,
          is_inline_created: postMetadata.is_inline_created ?? false,
          is_instagram_eligible: postMetadata.is_instagram_eligible ?? false,
          is_popular: postMetadata.is_popular ?? false,
          is_published: postMetadata.is_published ?? true,
          is_spherical: postMetadata.is_spherical ?? false,
          link: postMetadata.link || null,
          message: postMetadata.message || null,
          message_tags: postMetadata.message_tags || null,
          multi_share_end_card: postMetadata.multi_share_end_card ?? false,
          multi_share_optimized: postMetadata.multi_share_optimized ?? false,
          name: postMetadata.name || null,
          object_id: postMetadata.object_id || null,
          parent_id: postMetadata.parent_id || null,
          permalink_url: postMetadata.permalink_url || null,
          place: postMetadata.place || null,
          privacy: postMetadata.privacy || null,
          promotable_id: postMetadata.promotable_id || null,
          properties: postMetadata.properties || null,
          scheduled_publish_time: postMetadata.scheduled_publish_time || null,
          shares: postMetadata.shares || null,
          source: postMetadata.source || null,
          status_type: postMetadata.status_type || null,
          story: postMetadata.story || null,
          story_tags: postMetadata.story_tags || null,
          subscribed: postMetadata.subscribed ?? false,
          target: postMetadata.target || null,
          targeting: postMetadata.targeting || null,
          timeline_visibility: postMetadata.timeline_visibility || null,
          type: postMetadata.type || null,
          updated_time: postMetadata.updated_time,
          via: postMetadata.via || null,
          video_buying_eligibility:
            postMetadata.video_buying_eligibility || null,
          width: postMetadata.width || null,
          attachments: postMetadata.attachments || null,
          comments: postMetadata.comments || null,
          reactions: postMetadata.reactions || null,
          likes: postMetadata.likes || null,
          post_source: 'page',
          fetched_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single()

    if (postError) {
      console.error('Error storing post:', postError)
      return null
    }

    return post
  } catch (error) {
    console.error('Exception storing post:', error)
    return null
  }
}

// Insert post insights (raw format)
export async function insertPostInsightsRaw(
  supabase: SupabaseClient,
  postInsights: any[],
  postId: string,
  userId: string
): Promise<number> {
  try {
    const { error: insightError } = await supabase
      .from('facebook_post_insights_raw')
      .upsert(
        {
          user_id: userId,
          post_id: postId,
          raw_data: postInsights,
          fetched_at: new Date().toISOString(),
        },
        {
          onConflict: 'post_id,fetched_at',
        }
      )

    if (insightError) {
      console.error('Error storing post insights:', insightError)
      return 0
    }

    return 1
  } catch (error) {
    console.error('Exception storing post insights:', error)
    return 0
  }
}

// Insert page insights (processed format)
export async function insertPageInsights(
  supabase: SupabaseClient,
  pageInsights: FacebookInsightFromAPI[],
  pageId: string,
  userId: string
): Promise<number> {
  try {
    let insertedCount = 0

    for (const insight of pageInsights) {
      // Process each value in the insight
      for (const valueObj of insight.values) {
        // Prepare the base record
        const record: Record<string, any> = {
          page_id: pageId,
          user_id: userId,
          period: insight.period,
          date: valueObj.end_time || new Date().toISOString(),
          fetched_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Add the metric as a dynamic column using the insight name
        record[insight.name] = valueObj.value

        // Upsert the record
        const { error } = await supabase
          .from('facebook_page_insights')
          .upsert(record, {
            onConflict: 'page_id,date,period',
          })

        if (error) {
          console.error(`Error inserting page insight ${insight.name}:`, error)
        } else {
          insertedCount++
        }
      }
    }

    return insertedCount
  } catch (error) {
    console.error('Exception inserting page insights:', error)
    return 0
  }
}

// Insert post insights (processed format)
export async function insertPostInsights(
  supabase: SupabaseClient,
  postInsights: FacebookInsightFromAPI[],
  postId: string,
  userId: string
): Promise<number> {
  try {
    let insertedCount = 0

    for (const insight of postInsights) {
      // Process each value in the insight
      for (const valueObj of insight.values) {
        // Prepare the base record
        const record: Record<string, any> = {
          post_id: postId,
          user_id: userId,
          period: insight.period,
          date: valueObj.end_time || new Date().toISOString(),
          fetched_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        // Add the metric as a dynamic column using the insight name
        record[insight.name] = valueObj.value

        // Upsert the record
        const { error } = await supabase
          .from('facebook_post_insights')
          .upsert(record, {
            onConflict: 'post_id,date,period',
          })

        if (error) {
          console.error(`Error inserting post insight ${insight.name}:`, error)
        } else {
          insertedCount++
        }
      }
    }

    return insertedCount
  } catch (error) {
    console.error('Exception inserting post insights:', error)
    return 0
  }
}

// Alternative: Batch insert with aggregated metrics
export async function insertPageInsightsBatch(
  supabase: SupabaseClient,
  pageInsights: FacebookInsightFromAPI[],
  pageId: string,
  userId: string
): Promise<number> {
  try {
    // Group insights by date and period
    const groupedInsights = new Map<string, Record<string, any>>()

    for (const insight of pageInsights) {
      for (const valueObj of insight.values) {
        const date = valueObj.end_time || new Date().toISOString()
        const key = `${date}_${insight.period}`

        if (!groupedInsights.has(key)) {
          groupedInsights.set(key, {
            page_id: pageId,
            user_id: userId,
            period: insight.period,
            date: date,
            fetched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }

        // Add the metric to the grouped record
        const record = groupedInsights.get(key)!
        record[insight.name] = valueObj.value
      }
    }

    // Insert all records
    const records = Array.from(groupedInsights.values())

    if (records.length === 0) return 0

    const { error } = await supabase
      .from('facebook_page_insights')
      .upsert(records, {
        onConflict: 'page_id,date,period',
      })

    if (error) {
      console.error('Error batch inserting page insights:', error)
      return 0
    }

    return records.length
  } catch (error) {
    console.error('Exception batch inserting page insights:', error)
    return 0
  }
}

// Alternative: Batch insert with aggregated metrics for posts
export async function insertPostInsightsBatch(
  supabase: SupabaseClient,
  postInsights: FacebookInsightFromAPI[],
  postId: string,
  userId: string
): Promise<number> {
  try {
    // Group insights by date and period
    const groupedInsights = new Map<string, Record<string, any>>()

    for (const insight of postInsights) {
      for (const valueObj of insight.values) {
        const date = valueObj.end_time || new Date().toISOString()
        const key = `${date}_${insight.period}`

        if (!groupedInsights.has(key)) {
          groupedInsights.set(key, {
            post_id: postId,
            user_id: userId,
            period: insight.period,
            date: date,
            fetched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        }

        // Add the metric to the grouped record
        const record = groupedInsights.get(key)!
        record[insight.name] = valueObj.value
      }
    }

    // Insert all records
    const records = Array.from(groupedInsights.values())

    if (records.length === 0) return 0

    const { error } = await supabase
      .from('facebook_post_insights')
      .upsert(records, {
        onConflict: 'post_id,date,period',
      })

    if (error) {
      console.error('Error batch inserting post insights:', error)
      return 0
    }

    return records.length
  } catch (error) {
    console.error('Exception batch inserting post insights:', error)
    return 0
  }
}

// Update last sync time
export async function updateLastSyncTime(
  supabase: SupabaseClient,
  integrationId: string,
  syncedAt: string
): Promise<boolean> {
  try {
    const { error: updateError } = await supabase
      .from('social_integrations')
      .update({ last_sync_at: syncedAt })
      .eq('id', integrationId)

    if (updateError) {
      console.error('Error updating last_sync_at:', updateError)
      return false
    }

    return true
  } catch (error) {
    console.error('Exception updating last_sync_at:', error)
    return false
  }
}
