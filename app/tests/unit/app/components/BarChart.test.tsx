import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChartBarDefault } from '../../../../src/app/components/BarChart';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  TrendingUp: ({ className }: { className?: string }) => (
    <span data-testid="trending-up-icon" className={className}>↑</span>
  ),
}));

// Mock Recharts components
jest.mock('recharts', () => ({
  Bar: ({ dataKey, fill, radius }: { dataKey: string; fill: string; radius: number }) => (
    <div data-testid="bar" data-datakey={dataKey} data-fill={fill} data-radius={radius}>
      Bar Component
    </div>
  ),
  BarChart: ({ children, data, accessibilityLayer }: { 
    children: React.ReactNode; 
    data: any[];
    accessibilityLayer?: boolean;
  }) => (
    <div data-testid="bar-chart" data-accessibility={accessibilityLayer} data-data-length={data.length}>
      {children}
    </div>
  ),
  CartesianGrid: ({ vertical }: { vertical: boolean }) => (
    <div data-testid="cartesian-grid" data-vertical={vertical}>
      Grid
    </div>
  ),
  XAxis: ({ 
    dataKey, 
    tickLine, 
    tickMargin, 
    axisLine, 
    tickFormatter 
  }: { 
    dataKey: string;
    tickLine: boolean;
    tickMargin: number;
    axisLine: boolean;
    tickFormatter?: (value: string) => string;
  }) => (
    <div 
      data-testid="x-axis" 
      data-datakey={dataKey}
      data-tickline={tickLine}
      data-tickmargin={tickMargin}
      data-axisline={axisLine}
    >
      X Axis
    </div>
  ),
}));

// Mock UI components
jest.mock('../../../../src/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-description">{children}</div>
  ),
  CardFooter: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-footer" className={className}>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
}));

// Mock Chart components
jest.mock('../../../../src/components/ui/chart', () => ({
  ChartContainer: ({ children, config }: { children: React.ReactNode; config: any }) => (
    <div data-testid="chart-container" data-config={JSON.stringify(config)}>
      {children}
    </div>
  ),
  ChartTooltip: ({ cursor, content }: { cursor: boolean; content: React.ReactNode }) => (
    <div data-testid="chart-tooltip" data-cursor={cursor}>
      {content}
    </div>
  ),
  ChartTooltipContent: ({ hideLabel }: { hideLabel?: boolean }) => (
    <div data-testid="chart-tooltip-content" data-hidelabel={hideLabel}>
      Tooltip Content
    </div>
  ),
}));

describe('ChartBarDefault', () => {
  it('renders the card with correct structure', () => {
    render(<ChartBarDefault />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
  });

  it('displays correct title and description', () => {
    render(<ChartBarDefault />);
    
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByText('Profile views')).toBeInTheDocument();
    
    expect(screen.getByTestId('card-description')).toBeInTheDocument();
    expect(screen.getByText('January - June 2024')).toBeInTheDocument();
  });

  it('renders chart components with correct props', () => {
    render(<ChartBarDefault />);
    
    // Check BarChart
    const barChart = screen.getByTestId('bar-chart');
    expect(barChart).toBeInTheDocument();
    expect(barChart).toHaveAttribute('data-accessibility', 'true');
    expect(barChart).toHaveAttribute('data-data-length', '12');
    
    // Check Bar component
    const bar = screen.getByTestId('bar');
    expect(bar).toHaveAttribute('data-datakey', 'desktop');
    expect(bar).toHaveAttribute('data-fill', 'white');
    expect(bar).toHaveAttribute('data-radius', '8');
  });

  it('renders grid and axis components', () => {
    render(<ChartBarDefault />);
    
    // Check CartesianGrid
    const grid = screen.getByTestId('cartesian-grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute('data-vertical', 'false');
    
    // Check XAxis
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toBeInTheDocument();
    expect(xAxis).toHaveAttribute('data-datakey', 'month');
    expect(xAxis).toHaveAttribute('data-tickline', 'false');
    expect(xAxis).toHaveAttribute('data-tickmargin', '10');
    expect(xAxis).toHaveAttribute('data-axisline', 'false');
  });

  it('renders tooltip components', () => {
    render(<ChartBarDefault />);
    
    const tooltip = screen.getByTestId('chart-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveAttribute('data-cursor', 'false');
    
    const tooltipContent = screen.getByTestId('chart-tooltip-content');
    expect(tooltipContent).toBeInTheDocument();
    expect(tooltipContent).toHaveAttribute('data-hidelabel', 'true');
  });

  it('renders chart container with config', () => {
    render(<ChartBarDefault />);
    
    const container = screen.getByTestId('chart-container');
    expect(container).toBeInTheDocument();
    
    const config = JSON.parse(container.getAttribute('data-config') || '{}');
    expect(config).toHaveProperty('desktop');
    expect(config.desktop).toHaveProperty('label', 'Desktop');
    expect(config.desktop).toHaveProperty('color', 'var(--chart-1)');
  });

  it('displays footer with trending information', () => {
    render(<ChartBarDefault />);
    
    const footer = screen.getByTestId('card-footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('flex-col', 'items-start', 'gap-2', 'text-sm');
    
    expect(screen.getByText(/Trending up by 45.2% this month/)).toBeInTheDocument();
    expect(screen.getByTestId('trending-up-icon')).toBeInTheDocument();
  });

  it('displays additional footer information', () => {
    render(<ChartBarDefault />);
    
    expect(screen.getByText('Showing total visitors for the last 6 months')).toBeInTheDocument();
  });

  it('applies correct CSS classes to main card', () => {
    render(<ChartBarDefault />);
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('text-white', 'w-full');
  });

  it('applies correct styling to trending indicator', () => {
    render(<ChartBarDefault />);
    
    const trendingIcon = screen.getByTestId('trending-up-icon');
    expect(trendingIcon).toHaveClass('h-4', 'w-4', 'text-green-500');
  });

  it('renders without crashing', () => {
    expect(() => render(<ChartBarDefault />)).not.toThrow();
  });
});
