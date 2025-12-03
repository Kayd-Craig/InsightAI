import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../../../../src/app/components/Navbar';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock FontAwesome components
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }: { icon: any; className?: string }) => (
    <span data-testid={`icon-${icon.iconName}`} className={className}>
      Icon
    </span>
  ),
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
  faBullseye: { iconName: 'bullseye' },
  faChartSimple: { iconName: 'chart-simple' },
  faGear: { iconName: 'gear' },
  faMessage: { iconName: 'message' },
}));

// Mock UI components
jest.mock('../../../../src/components/ui/sidebar', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar">{children}</div>
  ),
  SidebarContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarGroup: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="sidebar-group-content" className={className}>{children}</div>
  ),
  SidebarMenu: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="sidebar-menu" className={className}>{children}</div>
  ),
  SidebarMenuItem: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="sidebar-menu-item" className={className}>{children}</div>
  ),
  SidebarMenuButton: ({ 
    children, 
    onClick, 
    isActive, 
    className 
  }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    isActive?: boolean;
    className?: string;
  }) => (
    <button 
      data-testid="sidebar-menu-button"
      onClick={onClick}
      data-active={isActive}
      className={className}
    >
      {children}
    </button>
  ),
}));

// Mock Logo component
jest.mock('../../../../src/app/components/Logo', () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders navbar with all required elements', () => {
    render(<Navbar />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-group')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-group-content')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
  });

  it('displays logo and app name', () => {
    render(<Navbar />);
    
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByText('insightAI')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders icons for all menu items', () => {
    render(<Navbar />);
    
    expect(screen.getByTestId('icon-chart-simple')).toBeInTheDocument();
    expect(screen.getByTestId('icon-message')).toBeInTheDocument();
    expect(screen.getByTestId('icon-bullseye')).toBeInTheDocument();
    expect(screen.getByTestId('icon-gear')).toBeInTheDocument();
  });

  it('has dashboard as default active button', () => {
    render(<Navbar />);
    
    const menuButtons = screen.getAllByTestId('sidebar-menu-button');
    const dashboardButton = menuButtons.find(button => 
      button.textContent?.includes('Dashboard')
    );
    
    expect(dashboardButton).toHaveAttribute('data-active', 'true');
  });

  it('navigates to dashboard when dashboard is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    const dashboardButton = screen.getByText('Dashboard').closest('button');
    await user.click(dashboardButton!);
    
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to chat when chat is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    const chatButton = screen.getByText('Chat').closest('button');
    await user.click(chatButton!);
    
    expect(mockPush).toHaveBeenCalledWith('/chat');
  });

  it('does not navigate when goals is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    const goalsButton = screen.getByText('Goals').closest('button');
    await user.click(goalsButton!);
    
    // Should not call router.push for goals
    expect(mockPush).not.toHaveBeenCalledWith('/goals');
  });

  it('does not navigate when settings is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    const settingsButton = screen.getByText('Settings').closest('button');
    await user.click(settingsButton!);
    
    // Should not call router.push for settings
    expect(mockPush).not.toHaveBeenCalledWith('/settings');
  });

  it('updates active state when different buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    const menuButtons = screen.getAllByTestId('sidebar-menu-button');
    
    // Initially dashboard should be active
    const dashboardButton = menuButtons.find(button => 
      button.textContent?.includes('Dashboard')
    );
    expect(dashboardButton).toHaveAttribute('data-active', 'true');
    
    // Click on chat
    const chatButton = screen.getByText('Chat').closest('button');
    await user.click(chatButton!);
    
    // Now chat should be active and dashboard should not be
    const updatedMenuButtons = screen.getAllByTestId('sidebar-menu-button');
    const updatedChatButton = updatedMenuButtons.find(button => 
      button.textContent?.includes('Chat')
    );
    const updatedDashboardButton = updatedMenuButtons.find(button => 
      button.textContent?.includes('Dashboard')
    );
    
    expect(updatedChatButton).toHaveAttribute('data-active', 'true');
    expect(updatedDashboardButton).toHaveAttribute('data-active', 'false');
  });

  it('applies correct CSS classes for active items', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    // Initially dashboard should have gradient border
    const menuItems = screen.getAllByTestId('sidebar-menu-item');
    const dashboardMenuItem = menuItems.find(item => 
      item.textContent?.includes('Dashboard')
    );
    
    expect(dashboardMenuItem).toHaveClass('gradient-border-bottom');
    
    // Click on chat
    const chatButton = screen.getByText('Chat').closest('button');
    await user.click(chatButton!);
    
    // Now chat should have gradient border
    const updatedMenuItems = screen.getAllByTestId('sidebar-menu-item');
    const updatedChatMenuItem = updatedMenuItems.find(item => 
      item.textContent?.includes('Chat')
    );
    const updatedDashboardMenuItem = updatedMenuItems.find(item => 
      item.textContent?.includes('Dashboard')
    );
    
    expect(updatedChatMenuItem).toHaveClass('gradient-border-bottom');
    expect(updatedDashboardMenuItem).not.toHaveClass('gradient-border-bottom');
  });

  it('applies consistent styling to all menu items', () => {
    render(<Navbar />);
    
    const menuItems = screen.getAllByTestId('sidebar-menu-item');
    
    menuItems.forEach(item => {
      expect(item).toHaveClass('text-white');
      expect(item).toHaveClass('underline-animation-center');
      expect(item).toHaveClass('w-full');
    });
  });

  it('applies correct icon styling', () => {
    render(<Navbar />);
    
    const icons = [
      screen.getByTestId('icon-chart-simple'),
      screen.getByTestId('icon-message'),
      screen.getByTestId('icon-bullseye'),
      screen.getByTestId('icon-gear'),
    ];
    
    icons.forEach(icon => {
      expect(icon).toHaveClass('mr-3');
      expect(icon).toHaveClass('ml-1');
      expect(icon).toHaveClass('max-w-[1rem]');
      expect(icon).toHaveClass('max-h-[1rem]');
    });
  });

  it('handles rapid button clicks correctly', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    const chatButton = screen.getByText('Chat').closest('button');
    const dashboardButton = screen.getByText('Dashboard').closest('button');
    const goalsButton = screen.getByText('Goals').closest('button');
    
    // Rapid clicks
    await user.click(chatButton!);
    await user.click(dashboardButton!);
    await user.click(goalsButton!);
    
    // Should handle all clicks and end with goals active
    const menuButtons = screen.getAllByTestId('sidebar-menu-button');
    const finalGoalsButton = menuButtons.find(button => 
      button.textContent?.includes('Goals')
    );
    
    expect(finalGoalsButton).toHaveAttribute('data-active', 'true');
    expect(mockPush).toHaveBeenCalledWith('/chat');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('maintains correct active state after navigation', async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    
    // Click multiple items and verify state is maintained
    const settingsButton = screen.getByText('Settings').closest('button');
    await user.click(settingsButton!);
    
    const menuButtons = screen.getAllByTestId('sidebar-menu-button');
    const activeSettingsButton = menuButtons.find(button => 
      button.textContent?.includes('Settings')
    );
    
    expect(activeSettingsButton).toHaveAttribute('data-active', 'true');
    
    // Other buttons should not be active
    const otherButtons = menuButtons.filter(button => 
      !button.textContent?.includes('Settings')
    );
    
    otherButtons.forEach(button => {
      expect(button).toHaveAttribute('data-active', 'false');
    });
  });
});