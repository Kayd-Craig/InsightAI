import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PaymentModal from '@/app/components/PaymentModal'

// Mock fetch
global.fetch = jest.fn()

// Mock next/navigation
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('PaymentModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubscriptionComplete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the modal when open', () => {
    render(<PaymentModal {...defaultProps} />)
    
    expect(screen.getByText('Choose Your Plan')).toBeInTheDocument()
    expect(screen.getByText('Select the perfect plan for your needs')).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    render(<PaymentModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Choose Your Plan')).not.toBeInTheDocument()
  })

  it('should display both pricing plans', () => {
    render(<PaymentModal {...defaultProps} />)
    
    expect(screen.getByText('Basic Plan')).toBeInTheDocument()
    expect(screen.getByText('$9.99/month')).toBeInTheDocument()
    expect(screen.getByText('Pro Plan')).toBeInTheDocument()
    expect(screen.getByText('$19.99/month')).toBeInTheDocument()
  })

  it('should display plan features correctly', () => {
    render(<PaymentModal {...defaultProps} />)
    
    // Basic plan features
    expect(screen.getByText('Up to 3 social media accounts')).toBeInTheDocument()
    expect(screen.getByText('Basic analytics dashboard')).toBeInTheDocument()
    expect(screen.getByText('Email support')).toBeInTheDocument()
    
    // Pro plan features
    expect(screen.getByText('Unlimited social media accounts')).toBeInTheDocument()
    expect(screen.getByText('Advanced analytics & insights')).toBeInTheDocument()
    expect(screen.getByText('Priority support')).toBeInTheDocument()
    expect(screen.getByText('Custom integrations')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = jest.fn()
    render(<PaymentModal {...defaultProps} onClose={onClose} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should handle Basic plan selection', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ url: 'https://checkout.stripe.com/basic' }),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    // Mock window.location.href assignment
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    render(<PaymentModal {...defaultProps} />)
    
    const basicButton = screen.getByRole('button', { name: /choose basic/i })
    fireEvent.click(basicButton)
    
    expect(screen.getByText('Processing...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_basic_monthly',
        }),
      })
    })
  })

  it('should handle Pro plan selection', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ url: 'https://checkout.stripe.com/pro' }),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    })

    render(<PaymentModal {...defaultProps} />)
    
    const proButton = screen.getByRole('button', { name: /choose pro/i })
    fireEvent.click(proButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_pro_monthly',
        }),
      })
    })
  })

  it('should handle checkout session creation error', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ error: 'Failed to create checkout session' }),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    // Mock console.error to suppress error logs in tests
    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    render(<PaymentModal {...defaultProps} />)
    
    const basicButton = screen.getByRole('button', { name: /choose basic/i })
    fireEvent.click(basicButton)
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error creating checkout session:', 'Failed to create checkout session')
    })

    consoleError.mockRestore()
  })

  it('should handle network errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    render(<PaymentModal {...defaultProps} />)
    
    const basicButton = screen.getByRole('button', { name: /choose basic/i })
    fireEvent.click(basicButton)
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith('Error:', expect.any(Error))
    })

    consoleError.mockRestore()
  })

  it('should disable buttons and show loading state during processing', async () => {
    const mockResponse = {
      ok: true,
      json: async () => new Promise(resolve => setTimeout(() => resolve({ url: 'test' }), 100)),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    render(<PaymentModal {...defaultProps} />)
    
    const basicButton = screen.getByRole('button', { name: /choose basic/i })
    const proButton = screen.getByRole('button', { name: /choose pro/i })
    
    fireEvent.click(basicButton)
    
    // Should show loading state
    expect(screen.getByText('Processing...')).toBeInTheDocument()
    
    // Both buttons should be disabled
    expect(basicButton).toBeDisabled()
    expect(proButton).toBeDisabled()
  })

  it('should reset loading state if payment fails', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({ error: 'Payment failed' }),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    render(<PaymentModal {...defaultProps} />)
    
    const basicButton = screen.getByRole('button', { name: /choose basic/i })
    fireEvent.click(basicButton)
    
    await waitFor(() => {
      expect(basicButton).not.toBeDisabled()
    })

    // Should not show loading state anymore
    expect(screen.queryByText('Processing...')).not.toBeInTheDocument()

    consoleError.mockRestore()
  })
})