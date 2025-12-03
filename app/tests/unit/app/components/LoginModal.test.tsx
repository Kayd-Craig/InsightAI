import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginModal } from '../../../../src/app/components/LoginModal';

// Mock all dependencies
jest.mock('../../../../src/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => 
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => 
    <h2 data-testid="dialog-title">{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => 
    <p data-testid="dialog-description">{children}</p>
}));

jest.mock('../../../../src/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type, ...props }: any) => 
    <button 
      onClick={onClick} 
      disabled={disabled} 
      type={type}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
}));

jest.mock('../../../../src/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />
}));

jest.mock('../../../../src/components/ui/input-otp', () => ({
  InputOTP: ({ children, value, onChange, maxLength }: any) => (
    <div data-testid="input-otp">
      <input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        data-testid="otp-input"
      />
      {children}
    </div>
  ),
  InputOTPGroup: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="input-otp-group">{children}</div>,
  InputOTPSlot: ({ index }: { index: number }) => 
    <div data-testid={`otp-slot-${index}`}>OTP Slot {index}</div>
}));

jest.mock('../../../../src/app/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>
}));

jest.mock('../../../../src/lib/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithOtp: jest.fn(),
      verifyOtp: jest.fn()
    }
  }
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn()
  })
}));

jest.mock('../../../../public/stores/store', () => ({
  usePhoneStore: () => ({
    phone: '5551234567',
    setPhone: jest.fn()
  })
}));

jest.mock('zod', () => ({
  z: {
    object: () => ({
      safeParse: jest.fn(() => ({ success: true }))
    }),
    string: () => ({
      min: () => ({})
    })
  }
}));

describe('LoginModal', () => {
  const mockOnOpenChange = jest.fn();
  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login modal when open', () => {
    render(<LoginModal {...defaultProps} />);
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('insightAI');
    expect(screen.getByTestId('dialog-description')).toHaveTextContent('log in');
  });

  it('does not render when closed', () => {
    render(<LoginModal open={false} onOpenChange={mockOnOpenChange} />);
    
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('renders logo and title', () => {
    render(<LoginModal {...defaultProps} />);
    
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText('insightAI')).toBeInTheDocument();
  });

  it('renders phone input field', () => {
    render(<LoginModal {...defaultProps} />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'tel');
    expect(input).toHaveAttribute('placeholder', '555-555-5555');
  });

  it('renders send verification button initially', () => {
    render(<LoginModal {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /send verification code/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('shows loading state when submitting', async () => {
    const { supabase } = require('@/lib/supabase/client');
    supabase.auth.signInWithOtp.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ error: null }), 100))
    );
    
    const user = userEvent.setup();
    render(<LoginModal {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /send verification code/i });
    await user.click(button);
    
    // Check for loading state immediately after click
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    
    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
    });
  });

  it('shows OTP input after successful phone submission', async () => {
    const { supabase } = require('@/lib/supabase/client');
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    
    const user = userEvent.setup();
    render(<LoginModal {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /send verification code/i });
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByTestId('input-otp')).toBeInTheDocument();
      expect(screen.getByText(/enter the code sent to/i)).toBeInTheDocument();
    });
  });

  it('shows error message on failed OTP request', async () => {
    const { supabase } = require('@/lib/supabase/client');
    supabase.auth.signInWithOtp.mockResolvedValue({ 
      error: { message: 'Invalid phone number' } 
    });
    
    const user = userEvent.setup();
    render(<LoginModal {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /send verification code/i });
    await user.click(button);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
    });
  });

  it('calls verifyOtp when clicking verify button', async () => {
    const { supabase } = require('@/lib/supabase/client');
    
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    supabase.auth.verifyOtp.mockResolvedValue({ error: null });
    
    const user = userEvent.setup();
    render(<LoginModal {...defaultProps} />);
    
    // First submit phone
    const submitButton = screen.getByRole('button', { name: /send verification code/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('input-otp')).toBeInTheDocument();
    });
    
    // Enter OTP directly by changing the input value
    const otpInput = screen.getByTestId('otp-input');
    fireEvent.change(otpInput, { target: { value: '123456' } });
    
    // Wait for the verify button to be enabled
    await waitFor(() => {
      const verifyButton = screen.getByRole('button', { name: /verify code/i });
      expect(verifyButton).not.toBeDisabled();
    });
    
    const verifyButton = screen.getByRole('button', { name: /verify code/i });
    await user.click(verifyButton);
    
    // Verify the auth function was called with correct parameters
    await waitFor(() => {
      expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
        phone: '+15551234567',
        token: '123456',
        type: 'sms',
      });
    });
  });

  it('shows back button in OTP view', async () => {
    const { supabase } = require('@/lib/supabase/client');
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    
    const user = userEvent.setup();
    render(<LoginModal {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /send verification code/i });
    await user.click(button);
    
    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /back/i });
      expect(backButton).toBeInTheDocument();
    });
  });

  it('goes back to phone input when back button is clicked', async () => {
    const { supabase } = require('@/lib/supabase/client');
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    
    const user = userEvent.setup();
    render(<LoginModal {...defaultProps} />);
    
    // Submit phone to show OTP
    const submitButton = screen.getByRole('button', { name: /send verification code/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('input-otp')).toBeInTheDocument();
    });
    
    // Click back button
    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);
    
    // Should show phone input again
    expect(screen.getByRole('button', { name: /send verification code/i })).toBeInTheDocument();
  });

  it('disables verify button when OTP is incomplete', async () => {
    const { supabase } = require('@/lib/supabase/client');
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    
    const user = userEvent.setup();
    render(<LoginModal {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /send verification code/i });
    await user.click(button);
    
    await waitFor(() => {
      const verifyButton = screen.getByRole('button', { name: /verify code/i });
      expect(verifyButton).toBeDisabled();
    });
  });

  it('formats phone number correctly', async () => {
    const { supabase } = require('@/lib/supabase/client');
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    
    const user = userEvent.setup();
    render(<LoginModal {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /send verification code/i });
    await user.click(button);
    
    await waitFor(() => {
      expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
        phone: '+15551234567'
      });
    });
  });

  it('handles OTP verification errors', async () => {
    const { supabase } = require('@/lib/supabase/client');
    supabase.auth.signInWithOtp.mockResolvedValue({ error: null });
    supabase.auth.verifyOtp.mockResolvedValue({ 
      error: { message: 'Invalid verification code' } 
    });
    
    const user = userEvent.setup();
    render(<LoginModal {...defaultProps} />);
    
    // Submit phone
    const submitButton = screen.getByRole('button', { name: /send verification code/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('input-otp')).toBeInTheDocument();
    });
    
    // Enter OTP and verify
    const otpInput = screen.getByTestId('otp-input');
    await user.type(otpInput, '123456');
    
    const verifyButton = screen.getByRole('button', { name: /verify code/i });
    await user.click(verifyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid verification code')).toBeInTheDocument();
    });
  });
});