import { create } from 'zustand'
import {
  syncFacebookData,
  getFacebookPages,
  getLastSyncTime,
  getFacebookPosts,
  getFacebookPageInsights,
  getFacebookPostInsights,
  getFacebookPageRawInsights,
  getFacebookPostRawInsights,
  getPageWithInsights,
  getPagePosts,
  getPostWithInsights,
} from '@/app/api/facebook/utils/sync'
import {
  refreshAllTokens,
  autoRefreshTokensIfNeeded,
  getTokenExpirationInfo,
} from '@/app/api/facebook/utils/token/token_refresh'
import {
  FacebookPage,
  FacebookPost,
  FacebookPageInsight,
  FacebookPostInsight,
  FacebookPageWithInsights,
  FacebookPostWithInsights,
  SyncStats,
} from '@/app/api/facebook/types/server'

interface FacebookState {
  // Data
  pages: FacebookPage[]
  posts: FacebookPost[]
  pageInsights: FacebookPageInsight[]
  postInsights: FacebookPostInsight[]
  pageInsightsRaw: any[]
  postInsightsRaw: any[]

  // State
  isLoading: boolean
  isSyncing: boolean
  isRefreshingTokens: boolean
  lastSyncTime: string | null
  syncStats: SyncStats | null
  tokenExpiresAt: string | null
  tokenDaysRemaining: number | null
  error: string | null

  // Actions - Initialization
  initialize: () => Promise<void>

  // Actions - Syncing
  syncData: (manualTrigger?: boolean) => Promise<void>

  // Actions - Token Management
  refreshTokens: () => Promise<void>
  checkTokenExpiration: () => Promise<void>

  // Actions - Loading Data
  loadPages: () => Promise<void>
  loadPosts: () => Promise<void>
  loadPageInsights: () => Promise<void>
  loadPostInsights: () => Promise<void>
  loadPageInsightsRaw: () => Promise<void>
  loadPostInsightsRaw: () => Promise<void>
  loadAll: () => Promise<void>

  // Actions - Loading Specific Data with Relations
  loadPageWithInsights: (
    pageId: string
  ) => Promise<FacebookPageWithInsights | null>
  loadPagePosts: (pageId: string) => Promise<FacebookPostWithInsights[]>
  loadPostWithInsights: (
    postId: string
  ) => Promise<FacebookPostWithInsights | null>

  // Actions - Utility
  clearError: () => void
  reset: () => void
}

// Helper: Wrapped set function for error handling in async operations
type SetState = (state: Partial<FacebookState>) => void

async function loadDataWithErrorHandling(
  fetchFn: () => Promise<any>,
  statePath: keyof FacebookState,
  set: SetState,
  errorMessage: string
): Promise<any> {
  set({ isLoading: true, error: null })
  try {
    const data = await fetchFn()
    set({
      [statePath]: data,
      isLoading: false,
    })
    return data
  } catch (error) {
    const message = error instanceof Error ? error.message : errorMessage
    set({
      error: message,
      isLoading: false,
    })
    throw error
  }
}

export const useFacebookStore = create<FacebookState>((set, get) => ({
  // Initial State
  pages: [],
  posts: [],
  pageInsights: [],
  postInsights: [],
  pageInsightsRaw: [],
  postInsightsRaw: [],
  isLoading: false,
  isSyncing: false,
  isRefreshingTokens: false,
  lastSyncTime: null,
  syncStats: null,
  tokenExpiresAt: null,
  tokenDaysRemaining: null,
  error: null,

  // INITIALIZATION
  initialize: async () => {
    set({ isLoading: true, error: null })

    try {
      // Step 1: Check token expiration
      await get().checkTokenExpiration()

      // Step 2: Auto-refresh if expiring soon
      const { tokenDaysRemaining } = get()
      if (tokenDaysRemaining !== null && tokenDaysRemaining < 7) {
        console.log('Token expires soon, auto-refreshing...')
        await get().refreshTokens()
      }

      // Step 3: Get last sync time and load all data
      const lastSync = await getLastSyncTime()
      await get().loadAll()

      set({
        lastSyncTime: lastSync,
        isLoading: false,
      })

      // Step 4: Auto-sync in background if needed
      get().syncData(false)
    } catch (error) {
      console.error('Initialize error:', error)
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize',
        isLoading: false,
      })
    }
  },

  // SYNCING
  syncData: async (manualTrigger: boolean = false) => {
    set({ isSyncing: true, error: null })

    try {
      // Auto-refresh tokens before syncing
      await autoRefreshTokensIfNeeded()

      const result = await syncFacebookData(manualTrigger)
      console.log('Sync result:', result)

      // Update sync metadata
      set({
        lastSyncTime: result.synced_at || result.last_sync_at || null,
        syncStats: result.stats || null,
      })

      // Reload data if sync occurred
      if (!result.skipped) {
        await get().loadAll()
      }

      set({ isSyncing: false })
    } catch (error) {
      console.error('Sync error:', error)
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to sync Facebook data',
        isSyncing: false,
      })
    }
  },

  // TOKEN MANAGEMENT
  refreshTokens: async () => {
    set({ isRefreshingTokens: true, error: null })

    try {
      console.log('Manually refreshing tokens...')
      const result = await refreshAllTokens()

      if (result.success) {
        console.log(`Tokens refreshed: ${result.pagesRefreshed} pages updated`)
        await get().checkTokenExpiration()
        await get().loadPages()
      } else {
        throw new Error(result.error || 'Failed to refresh tokens')
      }

      set({ isRefreshingTokens: false })
    } catch (error) {
      console.error('Token refresh error:', error)
      set({
        error:
          error instanceof Error ? error.message : 'Failed to refresh tokens',
        isRefreshingTokens: false,
      })
    }
  },

  checkTokenExpiration: async () => {
    try {
      const info = await getTokenExpirationInfo()
      set({
        tokenExpiresAt: info.expiresAt,
        tokenDaysRemaining: info.daysUntilExpiration,
      })
    } catch (error) {
      console.error('Error checking token expiration:', error)
    }
  },

  // DATA LOADING - Single items
  loadPages: async () => {
    await loadDataWithErrorHandling(
      () => getFacebookPages(),
      'pages',
      set,
      'Failed to load pages'
    )
  },

  loadPosts: async () => {
    await loadDataWithErrorHandling(
      () => getFacebookPosts(),
      'posts',
      set,
      'Failed to load posts'
    )
  },

  loadPageInsights: async () => {
    await loadDataWithErrorHandling(
      () => getFacebookPageInsights(),
      'pageInsights',
      set,
      'Failed to load page insights'
    )
  },

  loadPostInsights: async () => {
    await loadDataWithErrorHandling(
      () => getFacebookPostInsights(),
      'postInsights',
      set,
      'Failed to load post insights'
    )
  },

  loadPageInsightsRaw: async () => {
    await loadDataWithErrorHandling(
      () => getFacebookPageRawInsights(),
      'pageInsightsRaw',
      set,
      'Failed to load raw page insights'
    )
  },

  loadPostInsightsRaw: async () => {
    await loadDataWithErrorHandling(
      () => getFacebookPostRawInsights(),
      'postInsightsRaw',
      set,
      'Failed to load raw post insights'
    )
  },

  // DATA LOADING - All data
  loadAll: async () => {
    set({ isLoading: true, error: null })

    try {
      const [
        pages,
        posts,
        pageInsights,
        postInsights,
        pageInsightsRaw,
        postInsightsRaw,
      ] = await Promise.all([
        getFacebookPages(),
        getFacebookPosts(),
        getFacebookPageInsights(),
        getFacebookPostInsights(),
        getFacebookPageRawInsights(),
        getFacebookPostRawInsights(),
      ])

      set({
        pages,
        posts,
        pageInsights,
        postInsights,
        pageInsightsRaw,
        postInsightsRaw,
        isLoading: false,
      })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load Facebook data',
        isLoading: false,
      })
    }
  },

  // DATA LOADING - Specific items with relations
  loadPageWithInsights: async (
    pageId: string
  ): Promise<FacebookPageWithInsights | null> => {
    try {
      const pageWithInsights = await getPageWithInsights(pageId)

      // Update pages in store
      set((state) => ({
        pages: state.pages.find((p) => p.id === pageId)
          ? state.pages.map((p) => (p.id === pageId ? pageWithInsights : p))
          : [...state.pages, pageWithInsights],
      }))

      return pageWithInsights
    } catch (error) {
      console.error('Error loading page with insights:', error)
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load page with insights',
      })
      return null
    }
  },

  loadPagePosts: async (
    pageId: string
  ): Promise<FacebookPostWithInsights[]> => {
    try {
      const posts = await getPagePosts(pageId)

      // Update posts in store, replacing old posts from this page
      set((state) => ({
        posts: [...state.posts.filter((p) => p.page_id !== pageId), ...posts],
      }))

      return posts
    } catch (error) {
      console.error('Error loading page posts:', error)
      set({
        error:
          error instanceof Error ? error.message : 'Failed to load page posts',
      })
      return []
    }
  },

  loadPostWithInsights: async (
    postId: string
  ): Promise<FacebookPostWithInsights | null> => {
    try {
      const postWithInsights = await getPostWithInsights(postId)

      // Update posts in store
      set((state) => ({
        posts: state.posts.find((p) => p.id === postId)
          ? state.posts.map((p) => (p.id === postId ? postWithInsights : p))
          : [...state.posts, postWithInsights],
      }))

      return postWithInsights
    } catch (error) {
      console.error('Error loading post with insights:', error)
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load post with insights',
      })
      return null
    }
  },

  // UTILITY
  clearError: () => set({ error: null }),

  reset: () =>
    set({
      pages: [],
      posts: [],
      pageInsights: [],
      postInsights: [],
      pageInsightsRaw: [],
      postInsightsRaw: [],
      isLoading: false,
      isSyncing: false,
      isRefreshingTokens: false,
      lastSyncTime: null,
      syncStats: null,
      tokenExpiresAt: null,
      tokenDaysRemaining: null,
      error: null,
    }),
}))
