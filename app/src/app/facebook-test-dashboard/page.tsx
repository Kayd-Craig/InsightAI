/* eslint-disable */
'use client'

import { useEffect } from 'react'
import { useFacebookStore } from '@/stores/facebook_store'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function FacebookDashboardPage() {
  const {
    pages,
    posts,
    pageInsights,
    postInsights,
    isLoading,
    isSyncing,
    lastSyncTime,
    syncStats,
    error,
    initialize,
    syncData,
    clearError,
  } = useFacebookStore()

  // Initialize on mount - this will auto-sync if needed
  useEffect(() => {
    console.log('Dashboard mounted, initializing...')
    initialize()
  }, [initialize])

  const handleManualSync = async () => {
    console.log('Manual sync requested')
    await syncData(true)
  }

  // Helper to format time ago
  const getTimeAgo = (timestamp: string | null) => {
    if (!timestamp) return 'Never'

    const now = Date.now()
    const syncTime = new Date(timestamp).getTime()
    const diff = now - syncTime

    const minutes = Math.floor(diff / 1000 / 60)
    const hours = Math.floor(minutes / 60)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`

    return new Date(timestamp).toLocaleDateString()
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader page='Facebook Dashboard' />
        <div className='flex flex-1 flex-col'>
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
              {/* Sync Header */}
              <div className='flex flex-row justify-between items-start px-4 lg:px-6'>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    {isSyncing ? (
                      <span className='flex items-center gap-2'>
                        <span className='inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse'></span>
                        Syncing from Facebook...
                      </span>
                    ) : (
                      <span>Last synced: {getTimeAgo(lastSyncTime)}</span>
                    )}
                  </p>
                  {syncStats && (
                    <p className='text-xs text-muted-foreground mt-1'>
                      {syncStats.pages_synced} pages, {syncStats.posts_synced}{' '}
                      posts,{' '}
                      {syncStats.page_insights_synced +
                        syncStats.post_insights_synced}{' '}
                      insights
                    </p>
                  )}
                </div>

                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
                >
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <div className='mx-4 lg:mx-6 bg-destructive/10 border border-destructive/50 rounded-lg p-4'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-semibold text-destructive'>Error</p>
                      <p className='text-sm text-destructive/90 mt-1'>
                        {error}
                      </p>
                    </div>
                    <button
                      onClick={clearError}
                      className='text-destructive hover:text-destructive/80'
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && pages.length === 0 ? (
                <div className='px-4 lg:px-6'>
                  <div className='bg-muted rounded-lg p-8 text-center'>
                    <p className='text-muted-foreground'>
                      Loading your Facebook data...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <FacebookStatsCards
                    pages={pages}
                    posts={posts}
                    pageInsights={pageInsights}
                    postInsights={postInsights}
                  />

                  {/* Pages and Posts Grid */}
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 lg:px-6'>
                    <FacebookPagesSection pages={pages} isSyncing={isSyncing} />
                    <FacebookPostsSection posts={posts} pages={pages} />
                  </div>

                  {/* Insights Section */}
                  <FacebookInsightsSection
                    pageInsights={pageInsights}
                    postInsights={postInsights}
                  />
                </>
              )}

              {/* Info Box */}
              <div className='mx-4 lg:mx-6 bg-muted/50 border rounded-lg p-4'>
                <p className='font-semibold text-sm mb-2'>Auto-Sync Enabled</p>
                <ul className='text-xs text-muted-foreground space-y-1 list-disc list-inside'>
                  <li>Data automatically refreshes if older than 60 minutes</li>
                  <li>
                    Click &quot;Sync Now&quot; to manually refresh anytime
                  </li>
                  <li>
                    Syncing happens in the background without blocking the UI
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// Stats Cards Component
function FacebookStatsCards({ pages, posts, pageInsights, postInsights }: any) {
  const totalFollowers = pages.reduce(
    (sum: number, page: any) => sum + (page.followers_count || 0),
    0
  )
  const totalPageInsights = pageInsights.length
  const totalPostInsights = postInsights.length

  const stats = [
    {
      label: 'Facebook Pages',
      value: pages.length.toString(),
      description: 'Connected pages',
    },
    {
      label: 'Total Followers',
      value: totalFollowers.toLocaleString(),
      description: 'Across all pages',
    },
    {
      label: 'Posts Tracked',
      value: posts.length.toString(),
      description: 'Recent posts',
    },
    {
      label: 'Insights Collected',
      value: (totalPageInsights + totalPostInsights).toLocaleString(),
      description: 'Data points',
    },
  ]

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6'>
      {stats.map((stat, index) => (
        <div
          key={index}
          className='bg-card border rounded-lg p-4 hover:shadow-md transition-shadow'
        >
          <p className='text-sm text-muted-foreground'>{stat.label}</p>
          <p className='text-2xl font-bold mt-1'>{stat.value}</p>
          <p className='text-xs text-muted-foreground mt-1'>
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  )
}

// Pages Section Component
function FacebookPagesSection({ pages, isSyncing }: any) {
  return (
    <div className='bg-card border rounded-lg p-4'>
      <h2 className='text-lg font-semibold mb-4'>
        Your Facebook Pages ({pages.length})
      </h2>

      {pages.length === 0 ? (
        <div className='bg-muted/50 rounded-lg p-6 text-center'>
          <p className='font-medium'>No pages found</p>
          <p className='text-sm text-muted-foreground mt-1'>
            {isSyncing
              ? 'Syncing your Facebook pages now...'
              : 'Click "Sync Now" to load your Facebook pages.'}
          </p>
        </div>
      ) : (
        <div className='space-y-3 max-h-96 overflow-y-auto'>
          {pages.map((page: any) => (
            <div
              key={page.id}
              className='bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors'
            >
              <h3 className='font-medium'>{page.page_name}</h3>
              <div className='grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground'>
                <div>
                  <span className='font-medium'>Category:</span>{' '}
                  {page.page_category || 'N/A'}
                </div>
                <div>
                  <span className='font-medium'>Followers:</span>{' '}
                  {page.followers_count?.toLocaleString() || 'N/A'}
                </div>
                <div className='col-span-2'>
                  <span className='font-medium'>Status:</span>{' '}
                  {page.is_active ? '✓ Active' : '✗ Inactive'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Posts Section Component
function FacebookPostsSection({ posts, pages }: any) {
  const getPageName = (pageId: string) => {
    const page = pages.find((p: any) => p.id === pageId)
    return page?.page_name || 'Unknown Page'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className='bg-card border rounded-lg p-4'>
      <h2 className='text-lg font-semibold mb-4'>
        Recent Posts ({posts.length})
      </h2>

      {posts.length === 0 ? (
        <div className='bg-muted/50 rounded-lg p-6 text-center'>
          <p className='font-medium'>No posts found</p>
          <p className='text-sm text-muted-foreground mt-1'>
            Posts will appear here after syncing
          </p>
        </div>
      ) : (
        <div className='space-y-3 max-h-96 overflow-y-auto'>
          {posts.slice(0, 10).map((post: any) => (
            <div
              key={post.id}
              className='bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors'
            >
              <div className='flex justify-between items-start mb-2'>
                <p className='text-xs text-muted-foreground'>
                  {getPageName(post.page_id)}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {formatDate(post.created_time)}
                </p>
              </div>
              {post.message && (
                <p className='text-sm line-clamp-2 mb-2'>{post.message}</p>
              )}
              {post.full_picture && (
                <img
                  src={post.full_picture}
                  alt='Post image'
                  className='w-full h-32 object-cover rounded mb-2'
                />
              )}
              <div className='flex gap-4 mt-2 text-xs text-muted-foreground'>
                {post.type && (
                  <span className='font-medium'>Type: {post.type}</span>
                )}
                {post.shares?.count !== undefined && (
                  <span>Shares: {post.shares.count}</span>
                )}
                {post.status_type && <span>Status: {post.status_type}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Insights Section Component
function FacebookInsightsSection({ pageInsights, postInsights }: any) {
  // Extract all available metrics from page insights
  const getPageMetrics = () => {
    if (!pageInsights || pageInsights.length === 0) return {}

    const metrics: Record<string, any[]> = {}
    const excludedKeys = [
      'id',
      'page_id',
      'user_id',
      'period',
      'date',
      'fetched_at',
      'updated_at',
    ]

    pageInsights.forEach((insight: any) => {
      Object.keys(insight).forEach((key) => {
        if (
          !excludedKeys.includes(key) &&
          insight[key] !== null &&
          insight[key] !== undefined
        ) {
          if (!metrics[key]) {
            metrics[key] = []
          }
          metrics[key].push({
            value: insight[key],
            date: insight.date,
            period: insight.period,
          })
        }
      })
    })

    return metrics
  }

  // Extract all available metrics from post insights
  const getPostMetrics = () => {
    if (!postInsights || postInsights.length === 0) return {}

    const metrics: Record<string, any[]> = {}
    const excludedKeys = [
      'id',
      'post_id',
      'user_id',
      'period',
      'date',
      'fetched_at',
      'updated_at',
      'post',
    ]

    postInsights.forEach((insight: any) => {
      Object.keys(insight).forEach((key) => {
        if (
          !excludedKeys.includes(key) &&
          insight[key] !== null &&
          insight[key] !== undefined
        ) {
          if (!metrics[key]) {
            metrics[key] = []
          }
          metrics[key].push({
            value: insight[key],
            date: insight.date,
            period: insight.period,
            postId: insight.post_id,
          })
        }
      })
    })

    return metrics
  }

  const pageMetrics = getPageMetrics()
  const postMetrics = getPostMetrics()

  const formatMetricName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const formatMetricValue = (value: any) => {
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    if (typeof value === 'object') {
      return 'Complex Data'
    }
    return String(value)
  }

  const getLatestValue = (dataPoints: any[]) => {
    if (!dataPoints || dataPoints.length === 0) return null
    // Sort by date descending and get the first one
    const sorted = [...dataPoints].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    return sorted[0].value
  }

  const getTotalValue = (dataPoints: any[]) => {
    return dataPoints.reduce((sum, dp) => {
      if (typeof dp.value === 'number') {
        return sum + dp.value
      }
      return sum
    }, 0)
  }

  return (
    <div className='px-4 lg:px-6 space-y-4'>
      {/* Page Insights */}
      {Object.keys(pageMetrics).length > 0 && (
        <div className='bg-card border rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-4'>
            Page Insights ({Object.keys(pageMetrics).length} metrics)
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {Object.entries(pageMetrics).map(([metricName, dataPoints]) => {
              const latestValue = getLatestValue(dataPoints)
              const displayValue = formatMetricValue(latestValue)

              return (
                <div key={metricName} className='bg-muted/30 rounded-lg p-3'>
                  <p
                    className='text-xs text-muted-foreground uppercase tracking-wide truncate'
                    title={metricName}
                  >
                    {formatMetricName(metricName)}
                  </p>
                  <p
                    className='text-2xl font-bold mt-1 truncate'
                    title={displayValue}
                  >
                    {displayValue}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    {dataPoints.length} data point
                    {dataPoints.length !== 1 ? 's' : ''}
                  </p>
                  {dataPoints[0]?.period && (
                    <p className='text-xs text-muted-foreground'>
                      Period: {dataPoints[0].period}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Post Insights */}
      {Object.keys(postMetrics).length > 0 && (
        <div className='bg-card border rounded-lg p-4'>
          <h2 className='text-lg font-semibold mb-4'>
            Post Insights ({Object.keys(postMetrics).length} metrics)
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {Object.entries(postMetrics).map(([metricName, dataPoints]) => {
              const totalValue = getTotalValue(dataPoints)
              const uniquePosts = new Set(dataPoints.map((dp) => dp.postId))
                .size
              const displayValue = formatMetricValue(
                totalValue || getLatestValue(dataPoints)
              )

              return (
                <div key={metricName} className='bg-muted/30 rounded-lg p-3'>
                  <p
                    className='text-xs text-muted-foreground uppercase tracking-wide truncate'
                    title={metricName}
                  >
                    {formatMetricName(metricName)}
                  </p>
                  <p
                    className='text-2xl font-bold mt-1 truncate'
                    title={displayValue}
                  >
                    {displayValue}
                  </p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    Across {uniquePosts} post{uniquePosts !== 1 ? 's' : ''}
                  </p>
                  {dataPoints[0]?.period && (
                    <p className='text-xs text-muted-foreground'>
                      Period: {dataPoints[0].period}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No Insights Message */}
      {Object.keys(pageMetrics).length === 0 &&
        Object.keys(postMetrics).length === 0 && (
          <div className='bg-card border rounded-lg p-8 text-center'>
            <p className='font-medium'>No insights data yet</p>
            <p className='text-sm text-muted-foreground mt-1'>
              Insights will appear here after syncing your Facebook data
            </p>
          </div>
        )}
    </div>
  )
}
