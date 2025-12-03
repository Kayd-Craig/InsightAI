import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountSignIn from '../../../../src/app/components/AccountSignIn';

// Mock FontAwesome components
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }: { icon: any; className?: string }) => (
    <span data-testid={`icon-${icon.iconName}`} className={className}>
      Icon
    </span>
  ),
}));

jest.mock('@fortawesome/free-brands-svg-icons', () => ({
  faInstagram: { iconName: 'instagram' },
  faTiktok: { iconName: 'tiktok' },
  faXTwitter: { iconName: 'x-twitter' },
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faChartLine: { iconName: 'chart-line' },
  faUserFriends: { iconName: 'user-friends' },
  faHeart: { iconName: 'heart' },
  faComments: { iconName: 'comments' },
}));

// Mock AIBackground component
jest.mock('../../../../src/app/components/AIBackground', () => {
  return function MockAIBackground() {
    return <div data-testid="ai-background">AI Background</div>;
  };
});

// Mock Logo component
jest.mock('../../../../src/app/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

describe('AccountSignIn', () => {
  const mockOnSignIn = jest.fn();

  const defaultProps = {
    onSignIn: mockOnSignIn,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main layout with background and logo', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    expect(screen.getByTestId('ai-background')).toBeInTheDocument();
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText('insightAI')).toBeInTheDocument();
  });

  it('displays the welcome message', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    expect(screen.getByText(/get started by linking one of your accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/you can add different accounts later/i)).toBeInTheDocument();
  });

  it('renders all three social media platforms', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    // Check platform titles
    expect(screen.getByText('instagram')).toBeInTheDocument();
    expect(screen.getByText('tiktok')).toBeInTheDocument();
    expect(screen.getByText('x')).toBeInTheDocument();
    
    // Check platform icons (multiple instances exist, so use getAllByTestId)
    expect(screen.getAllByTestId('icon-instagram').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('icon-tiktok').length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('icon-x-twitter').length).toBeGreaterThan(0);
  });

  it('displays platform descriptions', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    expect(screen.getByText(/unlock detailed analytics on your posts, stories/i)).toBeInTheDocument();
    expect(screen.getByText(/see which videos perform best, track engagement/i)).toBeInTheDocument();
    expect(screen.getByText(/analyze tweet reach, engagement, and audience growth/i)).toBeInTheDocument();
  });

  it('displays metrics for each platform', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    // Instagram metrics (multiple elements exist so use getAllByText)
    expect(screen.getAllByText('follower growth').length).toBeGreaterThan(0);
    expect(screen.getByText('likes & engagement')).toBeInTheDocument();
    expect(screen.getByText('audience demographics')).toBeInTheDocument();
    
    // TikTok metrics
    expect(screen.getByText('video views')).toBeInTheDocument();
    expect(screen.getByText('likes & shares')).toBeInTheDocument();
    expect(screen.getByText('follower insights')).toBeInTheDocument();
    
    // X/Twitter metrics
    expect(screen.getByText('tweet impressions')).toBeInTheDocument();
    expect(screen.getByText('likes & retweets')).toBeInTheDocument();
    expect(screen.getByText('replies')).toBeInTheDocument();
  });

  it('renders metric icons for all platforms', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    // Should have multiple instances of each metric icon
    expect(screen.getAllByTestId('icon-chart-line')).toHaveLength(3); // One for each platform
    expect(screen.getAllByTestId('icon-heart')).toHaveLength(3);
    expect(screen.getAllByTestId('icon-comments')).toHaveLength(3);
    expect(screen.getAllByTestId('icon-user-friends')).toHaveLength(3);
  });

  it('renders sign-in buttons for each platform', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    expect(screen.getByText('continue with instagram')).toBeInTheDocument();
    expect(screen.getByText('continue with tiktok')).toBeInTheDocument();
    expect(screen.getByText('continue with x')).toBeInTheDocument();
  });

  it('calls onSignIn with correct platform when Instagram button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccountSignIn {...defaultProps} />);
    
    const instagramButton = screen.getByText('continue with instagram');
    await user.click(instagramButton);
    
    expect(mockOnSignIn).toHaveBeenCalledTimes(1);
    expect(mockOnSignIn).toHaveBeenCalledWith('instagram');
  });

  it('calls onSignIn with correct platform when TikTok button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccountSignIn {...defaultProps} />);
    
    const tiktokButton = screen.getByText('continue with tiktok');
    await user.click(tiktokButton);
    
    expect(mockOnSignIn).toHaveBeenCalledTimes(1);
    expect(mockOnSignIn).toHaveBeenCalledWith('tiktok');
  });

  it('calls onSignIn with correct platform when X button is clicked', async () => {
    const user = userEvent.setup();
    render(<AccountSignIn {...defaultProps} />);
    
    const xButton = screen.getByText('continue with x');
    await user.click(xButton);
    
    expect(mockOnSignIn).toHaveBeenCalledTimes(1);
    expect(mockOnSignIn).toHaveBeenCalledWith('x');
  });

  it('displays terms of service and privacy policy links', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    expect(screen.getByText(/by continuing, you agree to insightAI's/i)).toBeInTheDocument();
    expect(screen.getByText('terms of service')).toBeInTheDocument();
    expect(screen.getByText('privacy policy')).toBeInTheDocument();
    
    // Check that links have proper attributes
    const termsLink = screen.getByText('terms of service');
    const privacyLink = screen.getByText('privacy policy');
    
    expect(termsLink.closest('a')).toHaveAttribute('href', '#');
    expect(privacyLink.closest('a')).toHaveAttribute('href', '#');
  });

  it('applies hover effects to buttons', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    const buttons = screen.getAllByText(/continue with/);
    
    buttons.forEach(button => {
      expect(button).toHaveClass('hover:bg-gray-100');
      expect(button).toHaveClass('transition');
    });
  });

  it('has proper accessibility structure', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    // Check that buttons are actually buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    
    // Check that links are properly marked
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2); // Terms and privacy policy
  });

  it('handles multiple rapid button clicks', async () => {
    const user = userEvent.setup();
    render(<AccountSignIn {...defaultProps} />);
    
    const instagramButton = screen.getByText('continue with instagram');
    const tiktokButton = screen.getByText('continue with tiktok');
    
    // Rapid clicks
    await user.click(instagramButton);
    await user.click(tiktokButton);
    await user.click(instagramButton);
    
    expect(mockOnSignIn).toHaveBeenCalledTimes(3);
    expect(mockOnSignIn).toHaveBeenNthCalledWith(1, 'instagram');
    expect(mockOnSignIn).toHaveBeenNthCalledWith(2, 'tiktok');
    expect(mockOnSignIn).toHaveBeenNthCalledWith(3, 'instagram');
  });

  it('renders with proper CSS classes and styling', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    // Check main container classes (container structure might be different)
    const mainContainer = screen.getByText('insightAI').closest('div');
    expect(mainContainer).toHaveClass('flex', 'items-center', 'justify-center');
    
    // Check platform cards have proper styling
    const cards = document.querySelectorAll('.bg-gray-50');
    expect(cards).toHaveLength(3);
    
    cards.forEach(card => {
      expect(card).toHaveClass('rounded-lg', 'p-6', 'shadow');
    });
  });

  it('displays platform metrics in proper list format', () => {
    render(<AccountSignIn {...defaultProps} />);
    
    // Check that metrics are displayed as list items
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(12); // 4 metrics per platform * 3 platforms
    
    // Check that each list item has an icon and text
    listItems.forEach(item => {
      expect(item).toHaveClass('flex', 'items-center');
    });
  });
});
