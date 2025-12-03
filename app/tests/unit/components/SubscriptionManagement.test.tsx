import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SubscriptionManagement from '@/app/components/SubscriptionManagement'
import { subscriptionService } from '@/lib/subscriptionService'

// Mock the subscription service
jest.mock('@/lib/subscriptionService', () => ({
  subscriptionService: {
    getSubscription: jest.fn(),
    cancelSubscription: jest.fn(),
    reactivateSubscription: jest.fn(),
  },
}))

const mockSubscriptionService = subscriptionService as jest.Mocked<typeof subscriptionService>

describe('SubscriptionManagement', () => {
  const mockActiveSubscription = {
    id: 'sub-123',
    user_id: 'user-123',
    stripe_customer_id: 'cus_123',
    stripe_subscription_id: 'sub_stripe_123',
    status: 'active' as const,
    plan_id: 'basic',
    current_period_start: '2023-01-01T00:00:00Z',
    current_period_end: '2023-02-01T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  }

  const mockCanceledSubscription = {
    ...mockActiveSubscription,
    status: 'canceled' as const,
  }

  const defaultProps = {
    isSubscribed: true,
    onSubscriptionChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state initially', () => {
    mockSubscriptionService.getSubscription.mockReturnValue(new Promise(() => {})) // Never resolves
    
    render(<SubscriptionManagement {...defaultProps} />)
    
    expect(screen.getByText('Loading subscription information...')).toBeInTheDocument()
  })

  it('should render no subscription message when user has no subscription', async () => {
    mockSubscriptionService.getSubscription.mockResolvedValue(null)
    
    render(<SubscriptionManagement {...defaultProps} isSubscribed={false} />)
    
    await waitFor(() => {
      expect(screen.getByText('No active subscription')).toBeInTheDocument()
    })
    
    expect(screen.getByText('You don\'t have an active subscription. Subscribe to unlock premium features!')).toBeInTheDocument()
  })

  it('should render active subscription details', async () => {
    mockSubscriptionService.getSubscription.mockResolvedValue(mockActiveSubscription)
    
    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Current Subscription')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Basic Plan')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Feb 1, 2023')).toBeInTheDocument() // Current period end
    expect(screen.getByRole('button', { name: /cancel subscription/i })).toBeInTheDocument()
  })

  it('should render canceled subscription with reactivate option', async () => {
    mockSubscriptionService.getSubscription.mockResolvedValue(mockCanceledSubscription)
    
    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Current Subscription')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Basic Plan')).toBeInTheDocument()
    expect(screen.getByText('Canceled')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reactivate subscription/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /cancel subscription/i })).not.toBeInTheDocument()
  })

  it('should handle subscription cancellation', async () => {
    mockSubscriptionService.getSubscription
      .mockResolvedValueOnce(mockActiveSubscription)
      .mockResolvedValueOnce(mockCanceledSubscription)
    mockSubscriptionService.cancelSubscription.mockResolvedValue(true)

    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel subscription/i })).toBeInTheDocument()
    })
    
    const cancelButton = screen.getByRole('button', { name: /cancel subscription/i })
    fireEvent.click(cancelButton)
    
    await waitFor(() => {
      expect(mockSubscriptionService.cancelSubscription).toHaveBeenCalledTimes(1)
    })
    
    // Should refresh subscription data after cancellation
    await waitFor(() => {
      expect(mockSubscriptionService.getSubscription).toHaveBeenCalledTimes(2)
    })
  })

  it('should handle subscription reactivation', async () => {
    mockSubscriptionService.getSubscription
      .mockResolvedValueOnce(mockCanceledSubscription)
      .mockResolvedValueOnce(mockActiveSubscription)
    mockSubscriptionService.reactivateSubscription.mockResolvedValue(true)

    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reactivate subscription/i })).toBeInTheDocument()
    })
    
    const reactivateButton = screen.getByRole('button', { name: /reactivate subscription/i })
    fireEvent.click(reactivateButton)
    
    await waitFor(() => {
      expect(mockSubscriptionService.reactivateSubscription).toHaveBeenCalledTimes(1)
    })
    
    // Should refresh subscription data after reactivation
    await waitFor(() => {
      expect(mockSubscriptionService.getSubscription).toHaveBeenCalledTimes(2)
    })
  })

  it('should show loading state during cancellation', async () => {
    mockSubscriptionService.getSubscription.mockResolvedValue(mockActiveSubscription)
    mockSubscriptionService.cancelSubscription.mockReturnValue(new Promise(() => {})) // Never resolves

    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel subscription/i })).toBeInTheDocument()
    })
    
    const cancelButton = screen.getByRole('button', { name: /cancel subscription/i })
    fireEvent.click(cancelButton)
    
    expect(screen.getByText('Canceling...')).toBeInTheDocument()
    expect(cancelButton).toBeDisabled()
  })

  it('should show loading state during reactivation', async () => {
    mockSubscriptionService.getSubscription.mockResolvedValue(mockCanceledSubscription)
    mockSubscriptionService.reactivateSubscription.mockReturnValue(new Promise(() => {})) // Never resolves

    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reactivate subscription/i })).toBeInTheDocument()
    })
    
    const reactivateButton = screen.getByRole('button', { name: /reactivate subscription/i })
    fireEvent.click(reactivateButton)
    
    expect(screen.getByText('Reactivating...')).toBeInTheDocument()
    expect(reactivateButton).toBeDisabled()
  })

  it('should handle cancellation failure gracefully', async () => {
    mockSubscriptionService.getSubscription.mockResolvedValue(mockActiveSubscription)
    mockSubscriptionService.cancelSubscription.mockResolvedValue(false)

    // Mock console.error to suppress error logs in tests
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cancel subscription/i })).toBeInTheDocument()
    })
    
    const cancelButton = screen.getByRole('button', { name: /cancel subscription/i })
    fireEvent.click(cancelButton)
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Failed to cancel subscription')
    })

    // Button should be re-enabled
    expect(cancelButton).not.toBeDisabled()

    consoleError.mockRestore()
  })

  it('should handle reactivation failure gracefully', async () => {
    mockSubscriptionService.getSubscription.mockResolvedValue(mockCanceledSubscription)
    mockSubscriptionService.reactivateSubscription.mockResolvedValue(false)

    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /reactivate subscription/i })).toBeInTheDocument()
    })
    
    const reactivateButton = screen.getByRole('button', { name: /reactivate subscription/i })
    fireEvent.click(reactivateButton)
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Failed to reactivate subscription')
    })

    // Button should be re-enabled
    expect(reactivateButton).not.toBeDisabled()

    consoleError.mockRestore()
  })

  it('should format subscription plan name correctly', async () => {
    const proSubscription = {
      ...mockActiveSubscription,
      plan_id: 'pro',
    }

    mockSubscriptionService.getSubscription.mockResolvedValue(proSubscription)
    
    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Pro Plan')).toBeInTheDocument()
    })
  })

  it('should format billing period correctly', async () => {
    mockSubscriptionService.getSubscription.mockResolvedValue(mockActiveSubscription)
    
    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Billing Period:')).toBeInTheDocument()
      expect(screen.getByText('Jan 1, 2023 - Feb 1, 2023')).toBeInTheDocument()
    })
  })

  it('should handle subscription service errors', async () => {
    mockSubscriptionService.getSubscription.mockRejectedValue(new Error('Service error'))

    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    render(<SubscriptionManagement {...defaultProps} />)
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error fetching subscription:', expect.any(Error))
    })

    // Should show no subscription message on error
    expect(screen.getByText('No active subscription')).toBeInTheDocument()

    consoleError.mockRestore()
  })
})