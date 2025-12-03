import { subscriptionService } from '@/lib/subscriptionService'

// Mock Supabase client
jest.mock('@/lib/supabase/client')

import { supabase } from '@/lib/supabase/client'
const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('subscriptionService', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  }

  const mockSubscription = {
    id: 'sub-123',
    user_id: 'test-user-id',
    stripe_customer_id: 'cus_123',
    stripe_subscription_id: 'sub_stripe_123',
    status: 'active' as const,
    plan_id: 'basic',
    current_period_start: '2023-01-01T00:00:00Z',
    current_period_end: '2023-02-01T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkSubscription', () => {
  it('should return false when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const result = await subscriptionService.checkSubscription()

    expect(result).toEqual({ isSubscribed: false })
  })

  it('should return false when no active subscription exists', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const mockSubscriptionQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' }, // No rows returned
      }),
    }

    mockSupabase.from.mockReturnValue(mockSubscriptionQuery as any)

    const result = await subscriptionService.checkSubscription()

    expect(result).toEqual({ isSubscribed: false })
    expect(mockSupabase.from).toHaveBeenCalledWith('subscriptions')
    expect(mockSubscriptionQuery.select).toHaveBeenCalledWith('*')
    expect(mockSubscriptionQuery.eq).toHaveBeenCalledWith('user_id', 'test-user-id')
    expect(mockSubscriptionQuery.eq).toHaveBeenCalledWith('status', 'active')
  })

  it('should return true when active subscription exists', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const mockSubscriptionQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockSubscription,
        error: null,
      }),
    }

    mockSupabase.from.mockReturnValue(mockSubscriptionQuery as any)

    const result = await subscriptionService.checkSubscription()

    expect(result).toEqual({
      isSubscribed: true,
      subscription: mockSubscription,
    })
  })

  it('should handle database errors gracefully', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const mockSubscriptionQuery = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'SOME_ERROR', message: 'Database error' },
      }),
    }

    mockSupabase.from.mockReturnValue(mockSubscriptionQuery as any)

    const result = await subscriptionService.checkSubscription()

    expect(result).toEqual({ isSubscribed: false })
  })    it('should return true when active subscription exists', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSubscriptionQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockSubscription,
          error: null,
        }),
      }

      mockFrom.mockReturnValue(mockSubscriptionQuery)

      const result = await subscriptionService.checkSubscription()

      expect(result).toEqual({
        isSubscribed: true,
        subscription: mockSubscription,
      })
    })

    it('should handle database errors gracefully', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSubscriptionQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'SOME_ERROR', message: 'Database error' },
        }),
      }

      mockFrom.mockReturnValue(mockSubscriptionQuery)

      const result = await subscriptionService.checkSubscription()

      expect(result).toEqual({ isSubscribed: false })
    })
  })

  describe('getSubscription', () => {
    it('should return null when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await subscriptionService.getSubscription()

      expect(result).toBeNull()
    })

    it('should return subscription when it exists', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSubscriptionQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockSubscription,
          error: null,
        }),
      }

      mockFrom.mockReturnValue(mockSubscriptionQuery)

      const result = await subscriptionService.getSubscription()

      expect(result).toEqual(mockSubscription)
    })
  })

  describe('cancelSubscription', () => {
    it('should return false when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await subscriptionService.cancelSubscription()

      expect(result).toBe(false)
    })

    it('should update subscription status to canceled', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSubscriptionQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [{ ...mockSubscription, status: 'canceled' }],
          error: null,
        }),
      }

      mockFrom.mockReturnValue(mockSubscriptionQuery)

      const result = await subscriptionService.cancelSubscription()

      expect(result).toBe(true)
      expect(mockSubscriptionQuery.update).toHaveBeenCalledWith({
        status: 'canceled',
        updated_at: expect.any(String),
      })
      expect(mockSubscriptionQuery.eq).toHaveBeenCalledWith('user_id', 'test-user-id')
    })

    it('should handle database errors', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSubscriptionQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }

      mockFrom.mockReturnValue(mockSubscriptionQuery)

      const result = await subscriptionService.cancelSubscription()

      expect(result).toBe(false)
    })
  })

  describe('reactivateSubscription', () => {
    it('should return false when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await subscriptionService.reactivateSubscription()

      expect(result).toBe(false)
    })

    it('should update subscription status to active', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      const mockSubscriptionQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: [{ ...mockSubscription, status: 'active' }],
          error: null,
        }),
      }

      mockFrom.mockReturnValue(mockSubscriptionQuery)

      const result = await subscriptionService.reactivateSubscription()

      expect(result).toBe(true)
      expect(mockSubscriptionQuery.update).toHaveBeenCalledWith({
        status: 'active',
        updated_at: expect.any(String),
      })
    })
  })
})