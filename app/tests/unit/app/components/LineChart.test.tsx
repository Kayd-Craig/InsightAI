import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChartLineInteractive } from '../../../../src/app/components/LineChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  Line: ({ dataKey, stroke, strokeWidth, dot, type }: { 
    dataKey: string; 
    stroke: string; 
    strokeWidth: number; 
    dot: boolean;
    type: string;
  }) => (
    <div 
      data-testid="line" 
      data-datakey={dataKey} 
      data-stroke={stroke}
      data-strokewidth={strokeWidth}
      data-dot={dot}
      data-type={type}
    >
      Line Component
    </div>
  ),
  LineChart: ({ children, data, accessibilityLayer, margin }: { 
    children: React.ReactNode; 
    data: any[];
    accessibilityLayer?: boolean;
    margin?: any;
  }) => (
    <div 
      data-testid="line-chart" 
      data-accessibility={accessibilityLayer} 
      data-data-length={data.length}
      data-margin={JSON.stringify(margin)}
    >
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
    axisLine,
    tickMargin,
    minTickGap,
    tickFormatter 
  }: { 
    dataKey: string;
    tickLine: boolean;
    axisLine: boolean;
    tickMargin: number;
    minTickGap: number;
    tickFormatter?: (value: string) => string;
  }) => (
    <div 
      data-testid="x-axis" 
      data-datakey={dataKey}
      data-tickline={tickLine}
      data-axisline={axisLine}
      data-tickmargin={tickMargin}
      data-minTickGap={minTickGap}
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
  CardContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-content" className={className}>{children}</div>
  ),
  CardDescription: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-description" className={className}>{children}</div>
  ),
  CardHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card-header" className={className}>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
}));

// Mock Chart components
jest.mock('../../../../src/components/ui/chart', () => ({
  ChartContainer: ({ children, config, className }: { 
    children: React.ReactNode; 
    config: any;
    className?: string;
  }) => (
    <div data-testid="chart-container" data-config={JSON.stringify(config)} className={className}>
      {children}
    </div>
  ),
  ChartTooltip: ({ content }: { content: React.ReactNode }) => (
    <div data-testid="chart-tooltip">
      {content}
    </div>
  ),
  ChartTooltipContent: ({ 
    className, 
    nameKey, 
    labelFormatter 
  }: { 
    className?: string;
    nameKey?: string;
    labelFormatter?: (value: string) => string;
  }) => (
    <div 
      data-testid="chart-tooltip-content" 
      className={className}
      data-namekey={nameKey}
    >
      Tooltip Content
    </div>
  ),
}));

describe('ChartLineInteractive', () => {
  it('renders the card with correct structure', () => {
    render(<ChartLineInteractive />);
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('displays correct title and description', () => {
    render(<ChartLineInteractive />);
    
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByText('Content Insights')).toBeInTheDocument();
    
    expect(screen.getByTestId('card-description')).toBeInTheDocument();
    expect(screen.getByText('Total reach across all content')).toBeInTheDocument();
  });

  it('renders desktop and mobile toggle buttons', () => {
    render(<ChartLineInteractive />);
    
    const desktopButton = screen.getByText('Desktop').closest('button');
    const mobileButton = screen.getByText('Mobile').closest('button');
    
    expect(desktopButton).toBeInTheDocument();
    expect(mobileButton).toBeInTheDocument();
  });

  it('displays total values for desktop and mobile', () => {
    render(<ChartLineInteractive />);
    
    // These values are calculated from the chartData in the component
    const totalElements = screen.getAllByText(/,/); // Numbers with commas
    expect(totalElements.length).toBeGreaterThan(0);
  });

  it('starts with desktop as active chart', () => {
    render(<ChartLineInteractive />);
    
    const desktopButton = screen.getByText('Desktop').closest('button');
    expect(desktopButton).toHaveAttribute('data-active', 'true');
  });

  it('switches active chart when mobile button is clicked', () => {
    render(<ChartLineInteractive />);
    
    const mobileButton = screen.getByText('Mobile').closest('button');
    const desktopButton = screen.getByText('Desktop').closest('button');
    
    // Initially desktop should be active
    expect(desktopButton).toHaveAttribute('data-active', 'true');
    expect(mobileButton).toHaveAttribute('data-active', 'false');
    
    // Click mobile button
    fireEvent.click(mobileButton!);
    
    // Now mobile should be active
    expect(mobileButton).toHaveAttribute('data-active', 'true');
    expect(desktopButton).toHaveAttribute('data-active', 'false');
  });

  it('renders line chart components with correct props', () => {
    render(<ChartLineInteractive />);
    
    // Check LineChart
    const lineChart = screen.getByTestId('line-chart');
    expect(lineChart).toBeInTheDocument();
    expect(lineChart).toHaveAttribute('data-accessibility', 'true');
    expect(lineChart).toHaveAttribute('data-data-length', '91'); // Number of data points
    
    const margin = JSON.parse(lineChart.getAttribute('data-margin') || '{}');
    expect(margin).toEqual({ left: 12, right: 12 });
  });

  it('renders Line component with desktop data initially', () => {
    render(<ChartLineInteractive />);
    
    const line = screen.getByTestId('line');
    expect(line).toHaveAttribute('data-datakey', 'desktop');
    expect(line).toHaveAttribute('data-stroke', 'white');
    expect(line).toHaveAttribute('data-strokewidth', '2');
    expect(line).toHaveAttribute('data-dot', 'false');
    expect(line).toHaveAttribute('data-type', 'monotone');
  });

  it('updates Line component when switching to mobile', () => {
    render(<ChartLineInteractive />);
    
    const mobileButton = screen.getByText('Mobile').closest('button');
    fireEvent.click(mobileButton!);
    
    const line = screen.getByTestId('line');
    expect(line).toHaveAttribute('data-datakey', 'mobile');
  });

  it('renders grid and axis components', () => {
    render(<ChartLineInteractive />);
    
    // Check CartesianGrid
    const grid = screen.getByTestId('cartesian-grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute('data-vertical', 'false');
    
    // Check XAxis
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toBeInTheDocument();
    expect(xAxis).toHaveAttribute('data-datakey', 'date');
    expect(xAxis).toHaveAttribute('data-tickline', 'false');
    expect(xAxis).toHaveAttribute('data-axisline', 'false');
    expect(xAxis).toHaveAttribute('data-tickmargin', '8');
    expect(xAxis).toHaveAttribute('data-minTickGap', '32');
  });

  it('renders tooltip components', () => {
    render(<ChartLineInteractive />);
    
    const tooltip = screen.getByTestId('chart-tooltip');
    expect(tooltip).toBeInTheDocument();
    
    const tooltipContent = screen.getByTestId('chart-tooltip-content');
    expect(tooltipContent).toBeInTheDocument();
    expect(tooltipContent).toHaveClass('w-[150px]');
    expect(tooltipContent).toHaveAttribute('data-namekey', 'views');
  });

  it('renders chart container with config and styling', () => {
    render(<ChartLineInteractive />);
    
    const container = screen.getByTestId('chart-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('aspect-auto', 'h-[250px]', 'w-full');
    
    const config = JSON.parse(container.getAttribute('data-config') || '{}');
    expect(config).toHaveProperty('views');
    expect(config).toHaveProperty('desktop');
    expect(config).toHaveProperty('mobile');
    expect(config.desktop).toHaveProperty('label', 'Desktop');
    expect(config.mobile).toHaveProperty('label', 'Mobile');
  });

  it('applies correct CSS classes to main card', () => {
    render(<ChartLineInteractive />);
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('py-4', 'sm:py-0', 'text-white', 'w-full');
  });

  it('applies correct styling to card header', () => {
    render(<ChartLineInteractive />);
    
    const header = screen.getByTestId('card-header');
    expect(header).toHaveClass('flex', 'flex-col', 'items-stretch', 'border-b', '!p-0', 'sm:flex-row');
  });

  it('applies correct styling to card content', () => {
    render(<ChartLineInteractive />);
    
    const content = screen.getByTestId('card-content');
    expect(content).toHaveClass('px-2', 'sm:p-6');
  });

  it('displays button styling correctly', () => {
    render(<ChartLineInteractive />);
    
    const desktopButton = screen.getByText('Desktop').closest('button');
    expect(desktopButton).toHaveClass(
      'data-[active=true]:bg-muted/50',
      'flex',
      'flex-1',
      'flex-col',
      'justify-center',
      'gap-1',
      'border-t',
      'px-6',
      'py-4',
      'text-left',
      'even:border-l',
      'sm:border-t-0',
      'sm:border-l',
      'sm:px-8',
      'sm:py-6'
    );
  });

  it('renders without crashing', () => {
    expect(() => render(<ChartLineInteractive />)).not.toThrow();
  });
});
