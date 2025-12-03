import { POST } from '@/app/api/stripe/create-checkout-session/route'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  }))
})

// Mock Supabase
const mockGetUser = jest.fn()
jest.mock('@/lib/supabase/server', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
  }),
}))

describe('/api/stripe/create-checkout-session', () => {
  const mockStripeSessionCreate = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    ;(Stripe as jest.MockedClass<typeof Stripe>).mockImplementation(() => ({
      checkout: {
        sessions: {
          create: mockStripeSessionCreate,
        },
      },
    }) as any)
  })

  const createMockRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  it('should create checkout session for authenticated user', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    }

    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const mockSession = {
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/c/pay/123',
    }

    mockStripeSessionCreate.mockResolvedValue(mockSession)

    const request = createMockRequest({
      priceId: 'price_basic_monthly',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ url: mockSession.url })
    
    expect(mockStripeSessionCreate).toHaveBeenCalledWith({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_basic_monthly',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/dashboard?success=true',
      cancel_url: 'http://localhost:3000/dashboard?canceled=true',
      customer_email: 'test@example.com',
      metadata: {
        userId: 'user-123',
      },
    })
  })

  it('should return 401 for unauthenticated user', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const request = createMockRequest({
      priceId: 'price_basic_monthly',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data).toEqual({ error: 'Unauthorized' })
  })

  it('should return 400 for missing priceId', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    }

    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const request = createMockRequest({})

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toEqual({ error: 'Price ID is required' })
  })

  it('should handle Stripe errors', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    }

    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const stripeError = new Error('Stripe API error')
    mockStripeSessionCreate.mockRejectedValue(stripeError)

    const request = createMockRequest({
      priceId: 'price_basic_monthly',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toEqual({ error: 'Internal server error' })
  })

  it('should handle authentication errors', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid token' },
    })

    const request = createMockRequest({
      priceId: 'price_basic_monthly',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data).toEqual({ error: 'Unauthorized' })
  })

  it('should create session with correct URLs for different environments', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    }

    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const mockSession = {
      id: 'cs_test_123',
      url: 'https://checkout.stripe.com/c/pay/123',
    }

    mockStripeSessionCreate.mockResolvedValue(mockSession)

    const request = createMockRequest({
      priceId: 'price_pro_monthly',
    })

    await POST(request)

    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: expect.stringContaining('/dashboard?success=true'),
        cancel_url: expect.stringContaining('/dashboard?canceled=true'),
      })
    )
  })

  it('should include user metadata in checkout session', async () => {
    const mockUser = {
      id: 'user-456',
      email: 'another@example.com',
    }

    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const mockSession = {
      id: 'cs_test_456',
      url: 'https://checkout.stripe.com/c/pay/456',
    }

    mockStripeSessionCreate.mockResolvedValue(mockSession)

    const request = createMockRequest({
      priceId: 'price_basic_monthly',
    })

    await POST(request)

    expect(mockStripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: 'another@example.com',
        metadata: {
          userId: 'user-456',
        },
      })
    )
  })
})