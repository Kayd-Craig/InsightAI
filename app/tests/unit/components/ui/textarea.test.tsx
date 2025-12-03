import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../../../../src/components/ui/textarea';

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}));

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('applies the data-slot attribute', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('data-slot', 'textarea');
  });

  it('applies the default classes', () => {
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass(
      'border-input',
      'placeholder:text-muted-foreground',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'flex',
      'field-sizing-content',
      'min-h-16',
      'w-full',
      'rounded-md',
      'border',
      'bg-transparent',
      'px-3',
      'py-2',
      'text-base',
      'shadow-xs',
      'transition-[color,box-shadow]',
      'outline-none',
      'focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'md:text-sm'
    );
  });

  it('accepts and applies custom className', () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-class');
  });

  it('forwards placeholder prop', () => {
    render(<Textarea placeholder="Enter your message..." />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('placeholder', 'Enter your message...');
  });

  it('forwards disabled prop', () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('forwards required prop', () => {
    render(<Textarea required />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeRequired();
  });

  it('forwards readOnly prop', () => {
    render(<Textarea readOnly />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('readonly');
  });

  it('supports controlled value', () => {
    const { rerender } = render(<Textarea value="initial value" onChange={() => {}} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('initial value');

    rerender(<Textarea value="updated value" onChange={() => {}} />);
    expect(textarea).toHaveValue('updated value');
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    
    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    
    await user.type(textarea, 'Hello, world!');
    
    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('Hello, world!');
  });

  it('supports multiline text', async () => {
    const user = userEvent.setup();
    
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    
    await user.type(textarea, 'Line 1{enter}Line 2{enter}Line 3');
    
    expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
  });

  it('forwards rows prop', () => {
    render(<Textarea rows={5} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('forwards cols prop', () => {
    render(<Textarea cols={50} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('cols', '50');
  });

  it('forwards maxLength prop', () => {
    render(<Textarea maxLength={100} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxlength', '100');
  });

  it('forwards id prop', () => {
    render(<Textarea id="custom-textarea" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'custom-textarea');
  });

  it('forwards name prop', () => {
    render(<Textarea name="message" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('name', 'message');
  });

  it('forwards defaultValue prop', () => {
    render(<Textarea defaultValue="Default text" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Default text');
  });

  it('supports ref forwarding', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    
    render(<Textarea onFocus={handleFocus} onBlur={handleBlur} />);
    const textarea = screen.getByRole('textbox');
    
    await user.click(textarea);
    expect(handleFocus).toHaveBeenCalled();
    
    await user.tab();
    expect(handleBlur).toHaveBeenCalled();
  });

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    
    // Type some text and then clear it
    await user.type(textarea, 'Initial text');
    await user.clear(textarea);
    await user.type(textarea, 'Final text');
    
    expect(textarea).toHaveValue('Final text');
  });

  it('applies aria-invalid styling when invalid', () => {
    render(<Textarea aria-invalid="true" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveClass('aria-invalid:ring-destructive/20');
  });

  it('supports accessibility attributes', () => {
    render(
      <Textarea
        aria-label="Message input"
        aria-describedby="message-help"
        aria-required="true"
      />
    );
    const textarea = screen.getByRole('textbox');
    
    expect(textarea).toHaveAttribute('aria-label', 'Message input');
    expect(textarea).toHaveAttribute('aria-describedby', 'message-help');
    expect(textarea).toHaveAttribute('aria-required', 'true');
  });
});