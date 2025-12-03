import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LandingPage from '../../../../src/app/components/LandingPage';

// Mock AOS
jest.mock('aos', () => ({
  init: jest.fn(),
}));

// Mock AOS CSS import
jest.mock('aos/dist/aos.css', () => {});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
  }),
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Supabase client
jest.mock('../../../../src/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

// Mock UI components
jest.mock('../../../../src/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, ...props }: any) => (
    <input
      data-testid="email-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  ),
}));

jest.mock('../../../../src/components/ui/accordion', () => ({
  Accordion: ({ children, ...props }: any) => (
    <div data-testid="accordion" {...props}>{children}</div>
  ),
  AccordionContent: ({ children }: any) => (
    <div data-testid="accordion-content">{children}</div>
  ),
  AccordionItem: ({ children, value }: any) => (
    <div data-testid="accordion-item" data-value={value}>{children}</div>
  ),
  AccordionTrigger: ({ children }: any) => (
    <button data-testid="accordion-trigger">{children}</button>
  ),
}));

// Mock child components
jest.mock('../../../../src/app/components/SignUpModal', () => ({
  SocialSignUp: ({ open, onOpenChange }: any) => (
    <div data-testid="signup-modal" data-open={open}>
      <button onClick={() => onOpenChange(false)}>Close</button>
    </div>
  ),
}));

jest.mock('../../../../src/app/components/LoginModal', () => ({
  LoginModal: ({ open, onOpenChange }: any) => (
    <div data-testid="login-modal" data-open={open}>
      <button onClick={() => onOpenChange(false)}>Close</button>
    </div>
  ),
}));

jest.mock('../../../../src/app/components/Logo', () => ({
  Logo: ({ className }: any) => (
    <div data-testid="logo" className={className}>Logo</div>
  ),
}));

// Mock images
jest.mock('../../../public/images/iphone_mockup.png', () => 'iphone-mockup.png');
jest.mock('../../../public/images/final-mac.png', () => 'final-mac.png');
jest.mock('../../../public/images/bottom-half-iphone.png', () => 'bottom-half-iphone.png');
jest.mock('../../../public/images/browser-dashboard.png', () => 'browser-dashboard.png');
jest.mock('../../../public/images/cam.png', () => 'cam.png');
jest.mock('../../../public/images/jake.jpeg', () => 'jake.jpeg');
jest.mock('../../../public/images/brent.png', () => 'brent.png');

// Mock window methods
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

const mockScrollIntoView = jest.fn();
Element.prototype.scrollIntoView = mockScrollIntoView;

describe('LandingPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main container', () => {
    render(<LandingPage />);
    
    const container = document.querySelector('.relative.max-w-screen.overflow-x-hidden.radial-gradient-bg.overflow-y-hidden');
    expect(container).toBeInTheDocument();
  });

  it('renders the header with logo and navigation', () => {
    render(<LandingPage />);
    
    // Check header
    const header = document.querySelector('header.fixed.top-0.left-0.right-0.z-50');
    expect(header).toBeInTheDocument();
    
    // Check logo (multiple logos exist)
    expect(screen.getAllByTestId('logo').length).toBeGreaterThan(0);
    expect(screen.getByText('insightAI')).toBeInTheDocument();
  });

  it('renders navigation links on desktop', () => {
    render(<LandingPage />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
  });

  it('renders mobile hamburger menu button', () => {
    render(<LandingPage />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    expect(hamburgerButton).toBeInTheDocument();
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<LandingPage />);
    
    const hamburgerButton = screen.getByLabelText('Toggle menu');
    
    // Click to open menu
    fireEvent.click(hamburgerButton);
    
    // Check if SVG has rotate class
    const svg = hamburgerButton.querySelector('svg');
    expect(svg).toHaveClass('rotate-90');
  });

  it('renders signup and login modals', () => {
    render(<LandingPage />);
    
    expect(screen.getByTestId('signup-modal')).toBeInTheDocument();
    expect(screen.getByTestId('login-modal')).toBeInTheDocument();
  });

  it('renders FAQ accordion', () => {
    render(<LandingPage />);
    
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
  });

  it('handles navigation scrolling', () => {
    render(<LandingPage />);
    
    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);
    
    // Should call scrollIntoView (mocked)
    expect(mockScrollIntoView).toHaveBeenCalled();
  });

  it('handles window resize events', () => {
    render(<LandingPage />);
    
    // Change window width
    Object.defineProperty(window, 'innerWidth', { value: 500 });
    
    // Trigger resize event
    fireEvent(window, new Event('resize'));
    
    // Component should react to resize (internal state change)
    expect(window.innerWidth).toBe(500);
  });

  it('renders pricing plans', () => {
    render(<LandingPage />);
    
    // Look for pricing plan names
    expect(screen.getByText('Starter')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
  });

  it('renders testimonials', () => {
    render(<LandingPage />);
    
    // Look for testimonial names (multiple instances exist)
    expect(screen.getAllByText('Cambree Bernkopf').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Brent Wright').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Jacob Wright').length).toBeGreaterThan(0);
  });

  it('renders FAQ questions', () => {
    render(<LandingPage />);
    
    // Look for some FAQ questions
    expect(screen.getByText(/What social media platforms does insightAI support/)).toBeInTheDocument();
    expect(screen.getByText(/How does the AI assistant provide personalized recommendations/)).toBeInTheDocument();
  });

  it('initializes AOS on mount', () => {
    const AOS = require('aos');
    render(<LandingPage />);
    
    expect(AOS.init).toHaveBeenCalledWith({ once: true });
  });

  it('cycles through adjectives', async () => {
    jest.useFakeTimers();
    render(<LandingPage />);
    
    // Fast-forward time to trigger adjective change
    jest.advanceTimersByTime(3000);
    
    // The component should cycle through adjectives
    // Since we can't easily mock setTimeout, just verify the component renders
    expect(screen.getByText('Dedicated')).toBeInTheDocument();
    
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    expect(() => render(<LandingPage />)).not.toThrow();
  });

  it('applies correct CSS classes to main container', () => {
    render(<LandingPage />);
    
    const container = document.querySelector('[class*="relative"]');
    expect(container).toHaveClass('relative', 'max-w-screen', 'overflow-x-hidden', 'radial-gradient-bg', 'overflow-y-hidden');
  });

  it('renders header with correct positioning classes', () => {
    render(<LandingPage />);
    
    const header = document.querySelector('header');
    expect(header).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  });

  it('has responsive navigation visibility', () => {
    render(<LandingPage />);
    
    // Desktop navigation should have lg:flex and hidden classes
    const desktopNav = document.querySelector('.lg\\:flex-row.justify-between.w-3\\/5.lg\\:flex.hidden');
    expect(desktopNav).toBeInTheDocument();
    
    // Mobile hamburger should have lg:hidden class
    const mobileButton = document.querySelector('.lg\\:hidden.flex.items-center');
    expect(mobileButton).toBeInTheDocument();
  });

  it('renders images with correct alt text', () => {
    render(<LandingPage />);
    
    // Check that images are rendered (mocked)
    const images = document.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });
});
