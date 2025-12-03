import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Label } from '../../../../src/components/ui/label';

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}));

// Mock Radix UI Label
jest.mock('@radix-ui/react-label', () => ({
  Root: React.forwardRef<
    HTMLLabelElement,
    React.ComponentProps<'label'> & {
      'data-slot'?: string;
      children?: React.ReactNode;
    }
  >(({ children, 'data-slot': dataSlot, ...props }, ref) => (
    <label ref={ref} data-slot={dataSlot} {...props}>
      {children}
    </label>
  ))
}));

describe('Label', () => {
  it('renders a label element', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('applies the data-slot attribute', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('data-slot', 'label');
  });

  it('applies the default classes', () => {
    render(<Label>Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'text-sm',
      'leading-none',
      'font-medium',
      'select-none',
      'group-data-[disabled=true]:pointer-events-none',
      'group-data-[disabled=true]:opacity-50',
      'peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-50'
    );
  });

  it('accepts and applies custom className', () => {
    render(<Label className="custom-class">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveClass('custom-class');
    expect(label).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('forwards htmlFor prop', () => {
    render(<Label htmlFor="input-id">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'input-id');
  });

  it('forwards id prop', () => {
    render(<Label id="label-id">Test Label</Label>);
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('id', 'label-id');
  });

  it('renders children content', () => {
    render(
      <Label>
        <span>Complex</span> Label Content
      </Label>
    );
    const complexSpan = screen.getByText('Complex');
    const labelText = screen.getByText(/Label Content/);
    expect(complexSpan).toBeInTheDocument();
    expect(labelText).toBeInTheDocument();
  });

  it('supports click events', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    
    render(<Label onClick={handleClick}>Clickable Label</Label>);
    const label = screen.getByText('Clickable Label');
    
    await user.click(label);
    expect(handleClick).toHaveBeenCalled();
  });

  it('supports ref forwarding', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Test Label</Label>);
    
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current).toHaveAttribute('data-slot', 'label');
  });

  it('works with form controls', () => {
    render(
      <div>
        <Label htmlFor="test-input">Test Input</Label>
        <input id="test-input" type="text" />
      </div>
    );
    
    const label = screen.getByText('Test Input');
    const input = screen.getByRole('textbox');
    
    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('supports accessibility attributes', () => {
    render(
      <Label
        aria-label="Accessible Label"
        aria-describedby="label-help"
        role="label"
      >
        Test Label
      </Label>
    );
    const label = screen.getByText('Test Label');
    
    expect(label).toHaveAttribute('aria-label', 'Accessible Label');
    expect(label).toHaveAttribute('aria-describedby', 'label-help');
    expect(label).toHaveAttribute('role', 'label');
  });

  it('handles disabled state through group data', () => {
    render(
      <div data-disabled="true">
        <Label>Disabled Label</Label>
      </div>
    );
    const label = screen.getByText('Disabled Label');
    expect(label).toHaveClass(
      'group-data-[disabled=true]:pointer-events-none',
      'group-data-[disabled=true]:opacity-50'
    );
  });

  it('handles peer disabled state', () => {
    render(
      <div>
        <input disabled className="peer" />
        <Label>Peer Disabled Label</Label>
      </div>
    );
    const label = screen.getByText('Peer Disabled Label');
    expect(label).toHaveClass(
      'peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-50'
    );
  });

  it('supports custom styles', () => {
    render(
      <Label style={{ color: 'red', fontSize: '16px' }}>
        Styled Label
      </Label>
    );
    const label = screen.getByText('Styled Label');
    expect(label).toHaveAttribute('style');
  });

  it('can be used with required indicator', () => {
    render(
      <Label>
        Name <span className="text-red-500">*</span>
      </Label>
    );
    const label = screen.getByText(/Name/);
    expect(label).toContainHTML('Name <span class="text-red-500">*</span>');
  });

  it('can be used with icons', () => {
    render(
      <Label>
        <svg data-testid="icon" width="16" height="16">
          <circle cx="8" cy="8" r="4" />
        </svg>
        Icon Label
      </Label>
    );
    
    const label = screen.getByText('Icon Label');
    const icon = screen.getByTestId('icon');
    
    expect(label).toContainElement(icon);
    expect(label).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('maintains proper spacing with gap class', () => {
    render(
      <Label data-testid="label">
        <span>First</span>
        <span>Second</span>
      </Label>
    );
    
    const label = screen.getByTestId('label');
    expect(label).toHaveClass('gap-2');
  });

  it('supports conditional rendering', () => {
    const showLabel = true;
    const { rerender } = render(
      <div>
        {showLabel && <Label>Conditional Label</Label>}
      </div>
    );
    
    expect(screen.getByText('Conditional Label')).toBeInTheDocument();
    
    rerender(
      <div>
        {false && <Label>Conditional Label</Label>}
      </div>
    );
    
    expect(screen.queryByText('Conditional Label')).not.toBeInTheDocument();
  });

  it('handles long text content', () => {
    const longText = 'This is a very long label text that might wrap to multiple lines';
    render(<Label>{longText}</Label>);
    
    const label = screen.getByText(longText);
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent(longText);
  });
});