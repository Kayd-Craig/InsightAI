'use server'

import { createClient } from '@/lib/supabase/server'
import { FacebookClient } from '../client'
import { SyncResult, SyncStats } from '../types/server'
import {
  insertPage,
  insertPageInsightsRaw,
  insertPageInsightsBatch,
  insertPost,
  insertPostInsightsRaw,
  insertPostInsightsBatch,
  updateLastSyncTime,
} from './db_insert/utils'

// HELPER FUNCTIONS

export async function checkSync(
  manualTrigger?: boolean,
  lastSyncTime?: string | null
): Promise<boolean> {
  if (manualTrigger === true) {
    console.log('Manual trigger - will sync')
    return true
  }

  if (!lastSyncTime) {
    console.log('Never synced before - will sync')
    return true
  }

  const lastSyncTimestamp = new Date(lastSyncTime).getTime()
  const now = Date.now()
  const sixtyMinutesInMs = 60 * 60 * 1000
  const timeSinceLastSync = now - lastSyncTimestamp
  const minutesSinceLastSync = Math.floor(timeSinceLastSync / 1000 / 60)

  console.log('Minutes since last sync:', minutesSinceLastSync)

  if (timeSinceLastSync > sixtyMinutesInMs) {
    console.log('Data is stale (>60 mins) - will sync')
    return true
  }

  console.log('Data is fresh (<60 mins) - will NOT sync')
  return false
}

export async function getLastSyncTime(): Promise<string | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: integration } = await supabase
    .from('social_integrations')
    .select('last_sync_at')
    .eq('user_id', user.id)
    .eq('platform', 'facebook')
    .single()

  return integration?.last_sync_at || null
}

// MAIN SYNC FUNCTION

export async function syncFacebookData(
  manualTrigger: boolean = false
): Promise<SyncResult> {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('Auth error:', userError)
    throw new Error('Not authenticated')
  }

  // Get Facebook integration
  const { data: integration, error: integrationError } = await supabase
    .from('social_integrations')
    .select('*')
    .eq('user_id', user.id)
    .eq('platform', 'facebook')
    .single()

  if (integrationError || !integration) {
    console.error('Integration error:', integrationError)
    throw new Error(
      'No Facebook integration found. Please connect your Facebook account first.'
    )
  }

  // Check if should sync
  const shouldSync = await checkSync(manualTrigger, integration.last_sync_at)

  if (!shouldSync) {
    return {
      success: true,
      message: 'Data is already up to date',
      skipped: true,
      last_sync_at: integration.last_sync_at,
    }
  }

  // Create Facebook client
  const fbClient = new FacebookClient(integration.access_token)

  try {
    // Fetch pages from API
    const pagesFromAPI = await fbClient.fetchUserFacebookPages()

    const syncStats: SyncStats = {
      pages_synced: 0,
      page_insights_synced: 0,
      posts_synced: 0,
      post_insights_synced: 0,
    }

    // Process each page
    for (const pageData of pagesFromAPI) {
      // Insert page and get stored page record
      const page = await insertPage(supabase, pageData, user, integration)
      if (!page) continue
      syncStats.pages_synced++

      // Sync page insights (both raw and processed)
      try {
        const pageInsights = await fbClient.fetchPageInsights(
          pageData.id,
          pageData.access_token,
          'day',
          undefined,
          'facebook_page_insights'
        )

        // Insert raw insights for backup/debugging
        const rawInsightsSynced = await insertPageInsightsRaw(
          supabase,
          pageInsights,
          pageData.id,
          user.id
        )

        // Insert processed insights into structured format
        const processedInsightsSynced = await insertPageInsightsBatch(
          supabase,
          pageInsights,
          pageData.id,
          user.id
        )

        syncStats.page_insights_synced += processedInsightsSynced
        console.log(
          `Synced ${rawInsightsSynced} raw and ${processedInsightsSynced} processed page insights`
        )
      } catch (error) {
        console.error(`Error syncing page insights for ${pageData.id}:`, error)
      }

      // Sync page posts
      try {
        const pagePosts = await fbClient.fetchFacebookPagePosts(
          pageData.id,
          pageData.access_token,
          25,
          undefined,
          'facebook_post_metadata'
        )

        for (const postData of pagePosts) {
          // Fetch full post metadata
          let postMetadata = postData
          try {
            postMetadata = await fbClient.fetchFacebookPagePostMetadata(
              postData.id,
              pageData.access_token,
              undefined,
              'facebook_post_metadata'
            )
          } catch (error) {
            console.warn(
              `Could not fetch metadata for post ${postData.id}`,
              error
            )
          }

          // Insert post
          const post = await insertPost(
            supabase,
            postMetadata,
            page,
            user,
            integration
          )
          if (!post) continue
          syncStats.posts_synced++

          // Sync post insights (both raw and processed)
          try {
            const postInsights = await fbClient.fetchPagePostInsights(
              postData.id,
              pageData.access_token,
              'lifetime',
              undefined,
              'facebook_page_posts_insights'
            )

            // Insert raw insights for backup/debugging
            const rawInsightsSynced = await insertPostInsightsRaw(
              supabase,
              postInsights,
              postData.id,
              user.id
            )

            // Insert processed insights into structured format
            const processedInsightsSynced = await insertPostInsightsBatch(
              supabase,
              postInsights,
              postData.id,
              user.id
            )

            syncStats.post_insights_synced += processedInsightsSynced
            console.log(
              `Synced ${rawInsightsSynced} raw and ${processedInsightsSynced} processed post insights`
            )
          } catch (error) {
            console.error(
              `Error syncing post insights for ${postData.id}:`,
              error
            )
          }
        }
      } catch (error) {
        console.error('Error fetching page posts:', error)
      }
    }

    // Update last sync time
    const syncedAt = new Date().toISOString()
    await updateLastSyncTime(supabase, integration.id, syncedAt)

    return {
      success: true,
      message: 'Facebook data synced successfully',
      skipped: false,
      synced_at: syncedAt,
      stats: syncStats,
    }
  } catch (error) {
    console.error('Sync error:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to sync Facebook data'
    )
  }
}

// DATA RETRIEVAL FUNCTIONS

export async function getFacebookPages() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('Not authenticated')
  }

  const { data, error } = await supabase
    .from('facebook_pages')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Database error:', error)
    throw error
  }

  return data || []
}

export async function getPageWithInsights(pageId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('facebook_pages')
    .select(
      `
      *,
      insights:facebook_page_insights(*)
    `
    )
    .eq('id', pageId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching page with insights:', error)
    throw error
  }

  return data
}

export async function getPagePosts(pageId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('facebook_posts')
    .select(
      `
      *,
      insights:facebook_post_insights(*)
    `
    )
    .eq('page_id', pageId)
    .order('created_time', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    throw error
  }

  return data || []
}

export async function getFacebookPosts() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('facebook_posts')
    .select(
      `
      *,
      page:facebook_pages(*)
    `
    )
    .eq('user_id', user.id)
    .order('created_time', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getPostWithInsights(postId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('facebook_posts')
    .select(
      `
      *,
      insights:facebook_post_insights(*),
      page:facebook_pages(*)
    `
    )
    .eq('id', postId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching post with insights:', error)
    throw error
  }

  return data
}

export async function getFacebookPageInsights() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: pages } = await supabase
    .from('facebook_pages')
    .select('id')
    .eq('user_id', user.id)

  if (!pages) return []

  const pageIds = pages.map((p) => p.id)

  const { data, error } = await supabase
    .from('facebook_page_insights')
    .select('*')
    .in('page_id', pageIds)
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getFacebookPostInsights() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: posts } = await supabase
    .from('facebook_posts')
    .select('id')
    .eq('user_id', user.id)

  if (!posts) return []

  const postIds = posts.map((p) => p.id)

  const { data, error } = await supabase
    .from('facebook_post_insights')
    .select(
      `
      *,
      post:facebook_posts(
        id,
        message,
        created_time
      )
    `
    )
    .in('post_id', postIds)
    .order('date', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getFacebookPageRawInsights() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: pages } = await supabase
    .from('facebook_pages')
    .select('id')
    .eq('user_id', user.id)

  if (!pages) return []

  const pageIds = pages.map((p) => p.id)

  const { data, error } = await supabase
    .from('facebook_page_insights_raw')
    .select('*')
    .in('page_id', pageIds)
    .order('fetched_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getFacebookPostRawInsights() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: posts } = await supabase
    .from('facebook_posts')
    .select('id')
    .eq('user_id', user.id)

  if (!posts) return []

  const postIds = posts.map((p) => p.id)

  const { data, error } = await supabase
    .from('facebook_post_insights_raw')
    .select(
      `
      *,
      post:facebook_posts(
        id,
        message,
        created_time
      )
    `
    )
    .in('post_id', postIds)
    .order('fetched_at', { ascending: false })

  if (error) throw error
  return data || []
}
