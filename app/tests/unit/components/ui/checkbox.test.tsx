import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../../../../src/components/ui/checkbox';

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  CheckIcon: ({ className }: { className?: string }) => (
    <div data-testid="check-icon" className={className}>✓</div>
  )
}));

// Mock Radix UI Checkbox
jest.mock('@radix-ui/react-checkbox', () => ({
  Root: React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'> & {
      'data-slot'?: string;
      children?: React.ReactNode;
      checked?: boolean | 'indeterminate';
      onCheckedChange?: (checked: boolean | 'indeterminate') => void;
    }
  >(({ children, 'data-slot': dataSlot, checked, onCheckedChange, ...props }, ref) => (
    <button
      ref={ref}
      role="checkbox"
      aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
      data-slot={dataSlot}
      data-state={
        checked === 'indeterminate' ? 'indeterminate' :
        checked ? 'checked' : 'unchecked'
      }
      onClick={() => {
        if (onCheckedChange) {
          if (checked === 'indeterminate') {
            onCheckedChange(false);
          } else {
            onCheckedChange(!checked);
          }
        }
      }}
      {...props}
    >
      {children}
    </button>
  )),
  Indicator: React.forwardRef<
    HTMLSpanElement,
    React.ComponentProps<'span'> & {
      'data-slot'?: string;
      children?: React.ReactNode;
    }
  >(({ children, 'data-slot': dataSlot, ...props }, ref) => (
    <span ref={ref} data-slot={dataSlot} {...props}>
      {children}
    </span>
  ))
}));

describe('Checkbox', () => {
  it('renders a checkbox element', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('applies the data-slot attribute', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('data-slot', 'checkbox');
  });

  it('applies the default classes', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'peer',
      'border-input',
      'size-4',
      'shrink-0',
      'rounded-[4px]',
      'border',
      'shadow-xs',
      'transition-shadow',
      'outline-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    );
  });

  it('accepts and applies custom className', () => {
    render(<Checkbox className="custom-class" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('renders the check indicator', () => {
    render(<Checkbox />);
    const indicator = screen.getByTestId('check-icon');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('size-3.5');
  });

  it('supports controlled checked state', () => {
    const { rerender } = render(<Checkbox checked={false} onCheckedChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    rerender(<Checkbox checked={true} onCheckedChange={() => {}} />);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  it('supports indeterminate state', () => {
    render(<Checkbox checked="indeterminate" onCheckedChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();
    
    render(<Checkbox checked={false} onCheckedChange={handleCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles from checked to unchecked', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();
    
    render(<Checkbox checked={true} onCheckedChange={handleCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('handles indeterminate to unchecked transition', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();
    
    render(<Checkbox checked="indeterminate" onCheckedChange={handleCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it('forwards disabled prop', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('forwards required prop', () => {
    render(<Checkbox required />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('required');
  });

  it('forwards id prop', () => {
    render(<Checkbox id="custom-checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'custom-checkbox');
  });

  it('forwards name prop', () => {
    render(<Checkbox name="agreement" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('name', 'agreement');
  });

  it('forwards value prop', () => {
    render(<Checkbox value="accepted" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('value', 'accepted');
  });

  it('supports ref forwarding', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('handles keyboard interaction', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();
    
    render(<Checkbox checked={false} onCheckedChange={handleCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    checkbox.focus();
    await user.keyboard(' ');
    
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('applies focus-visible styles', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[3px]'
    );
  });

  it('applies checked state styles', () => {
    render(<Checkbox checked={true} onCheckedChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass(
      'data-[state=checked]:bg-primary',
      'data-[state=checked]:text-primary-foreground',
      'data-[state=checked]:border-primary'
    );
  });

  it('applies aria-invalid styling when invalid', () => {
    render(<Checkbox aria-invalid="true" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveClass(
      'aria-invalid:ring-destructive/20',
      'aria-invalid:border-destructive'
    );
  });

  it('supports accessibility attributes', () => {
    render(
      <Checkbox
        aria-label="Accept terms"
        aria-describedby="terms-help"
        aria-required="true"
      />
    );
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).toHaveAttribute('aria-label', 'Accept terms');
    expect(checkbox).toHaveAttribute('aria-describedby', 'terms-help');
    expect(checkbox).toHaveAttribute('aria-required', 'true');
  });

  it('renders indicator with correct data-slot', () => {
    render(<Checkbox />);
    const indicator = screen.getByTestId('check-icon').parentElement;
    expect(indicator).toHaveAttribute('data-slot', 'checkbox-indicator');
  });

  it('indicator has correct classes', () => {
    render(<Checkbox />);
    const indicator = screen.getByTestId('check-icon').parentElement;
    expect(indicator).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'text-current',
      'transition-none'
    );
  });
});