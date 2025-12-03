import React from 'react';
import { render, screen } from '@testing-library/react';
import { Separator } from '../../../../src/components/ui/separator';

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}));

// Mock Radix UI Separator
jest.mock('@radix-ui/react-separator', () => ({
  Root: React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<'div'> & {
      'data-slot'?: string;
      decorative?: boolean;
      orientation?: 'horizontal' | 'vertical';
    }
  >(({ 'data-slot': dataSlot, decorative, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-slot={dataSlot}
      data-orientation={orientation}
      {...props}
    />
  ))
}));

describe('Separator', () => {
  it('renders a separator element', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
  });

  it('applies the data-slot attribute', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-slot', 'separator');
  });

  it('applies the default classes', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass(
      'bg-border',
      'shrink-0',
      'data-[orientation=horizontal]:h-px',
      'data-[orientation=horizontal]:w-full',
      'data-[orientation=vertical]:h-full',
      'data-[orientation=vertical]:w-px'
    );
  });

  it('accepts and applies custom className', () => {
    render(<Separator className="custom-class" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('custom-class');
    expect(separator).toHaveClass('bg-border', 'shrink-0');
  });

  it('defaults to horizontal orientation', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('supports vertical orientation', () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('defaults to decorative=true', () => {
    render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'none');
  });

  it('supports decorative=false for semantic separator', () => {
    render(<Separator decorative={false} data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('supports vertical semantic separator', () => {
    render(
      <Separator
        decorative={false}
        orientation="vertical"
        data-testid="separator"
      />
    );
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('forwards id prop', () => {
    render(<Separator id="custom-separator" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('id', 'custom-separator');
  });

  it('supports ref forwarding', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} data-testid="separator" />);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'separator');
  });

  it('supports custom styles', () => {
    render(
      <Separator
        style={{ backgroundColor: 'red', margin: '10px' }}
        data-testid="separator"
      />
    );
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('style');
  });

  it('can be used in horizontal layouts', () => {
    render(
      <div className="flex flex-col">
        <div>Content Above</div>
        <Separator data-testid="separator" />
        <div>Content Below</div>
      </div>
    );
    
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('can be used in vertical layouts', () => {
    render(
      <div className="flex">
        <div>Left Content</div>
        <Separator orientation="vertical" data-testid="separator" />
        <div>Right Content</div>
      </div>
    );
    
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('supports accessibility attributes', () => {
    render(
      <Separator
        decorative={false}
        aria-label="Section divider"
        data-testid="separator"
      />
    );
    const separator = screen.getByTestId('separator');
    
    expect(separator).toHaveAttribute('aria-label', 'Section divider');
    expect(separator).toHaveAttribute('role', 'separator');
  });

  it('can be styled with different colors', () => {
    render(<Separator className="bg-red-500" data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('bg-red-500');
  });

  it('can be styled with different sizes', () => {
    render(
      <Separator
        className="data-[orientation=horizontal]:h-0.5"
        data-testid="separator"
      />
    );
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('data-[orientation=horizontal]:h-0.5');
  });

  it('maintains data-orientation attribute consistency', () => {
    const { rerender } = render(<Separator data-testid="separator" />);
    const separator = screen.getByTestId('separator');
    
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    
    rerender(<Separator orientation="vertical" data-testid="separator" />);
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
  });

  it('handles conditional rendering', () => {
    const showSeparator = true;
    const { rerender } = render(
      <div>
        {showSeparator && <Separator data-testid="separator" />}
      </div>
    );
    
    expect(screen.getByTestId('separator')).toBeInTheDocument();
    
    rerender(
      <div>
        {false && <Separator data-testid="separator" />}
      </div>
    );
    
    expect(screen.queryByTestId('separator')).not.toBeInTheDocument();
  });

  it('works in component composition', () => {
    render(
      <div>
        <h2>Section 1</h2>
        <p>Content for section 1</p>
        <Separator className="my-4" data-testid="separator" />
        <h2>Section 2</h2>
        <p>Content for section 2</p>
      </div>
    );
    
    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('my-4');
  });

  it('supports multiple separators in the same component', () => {
    render(
      <div>
        <Separator data-testid="separator-1" />
        <Separator orientation="vertical" data-testid="separator-2" />
      </div>
    );
    
    const horizontalSeparator = screen.getByTestId('separator-1');
    const verticalSeparator = screen.getByTestId('separator-2');
    
    expect(horizontalSeparator).toHaveAttribute('data-orientation', 'horizontal');
    expect(verticalSeparator).toHaveAttribute('data-orientation', 'vertical');
  });
});