import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../../../../src/components/ui/input'

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}))

describe('Input Component', () => {
  it('renders as an input element', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('has the correct data-slot attribute', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('data-slot', 'input')
  })

  it('applies default styling classes', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('flex')
    expect(input.className).toContain('h-9')
    expect(input.className).toContain('w-full')
    expect(input.className).toContain('rounded-md')
    expect(input.className).toContain('border')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input-class" />)
    
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('custom-input-class')
  })

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" />)
    input = screen.getByDisplayValue('')
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="number" />)
    input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('handles user input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText('Enter text')
    await user.type(input, 'Hello World')
    
    expect(input).toHaveValue('Hello World')
  })

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'test')
    
    expect(handleChange).toHaveBeenCalledTimes(4) // once for each character
  })

  it('forwards HTML input attributes', () => {
    render(
      <Input
        id="test-input"
        name="test-name"
        placeholder="Test placeholder"
        disabled
        required
        maxLength={10}
        data-testid="input-element"
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('name', 'test-name')
    expect(input).toHaveAttribute('placeholder', 'Test placeholder')
    expect(input).toBeDisabled()
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('maxlength', '10')
    expect(input).toHaveAttribute('data-testid', 'input-element')
  })

  it('applies disabled styling when disabled', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input.className).toContain('disabled:pointer-events-none')
    expect(input.className).toContain('disabled:cursor-not-allowed')
    expect(input.className).toContain('disabled:opacity-50')
  })

  it('can be controlled', () => {
    const { rerender } = render(<Input value="initial" readOnly />)
    
    let input = screen.getByRole('textbox')
    expect(input).toHaveValue('initial')
    
    rerender(<Input value="updated" readOnly />)
    input = screen.getByRole('textbox')
    expect(input).toHaveValue('updated')
  })

  it('handles focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = jest.fn()
    const handleBlur = jest.fn()
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
    
    const input = screen.getByRole('textbox')
    
    await user.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    expect(input).toHaveFocus()
    
    await user.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Input defaultValue="Hello World" />)
    
    const input = screen.getByRole('textbox')
    input.focus()
    
    // Test arrow key navigation
    await user.keyboard('{Home}')
    expect((input as HTMLInputElement).selectionStart).toBe(0)
    
    await user.keyboard('{End}')
    expect((input as HTMLInputElement).selectionStart).toBe(11) // "Hello World".length
  })

  it('handles file input type correctly', () => {
    render(<Input type="file" data-testid="file-input" />)
    
    const input = screen.getByTestId('file-input')
    expect(input).toHaveAttribute('type', 'file')
    expect(input.className).toContain('file:inline-flex')
    expect(input.className).toContain('file:h-7')
  })

  it('applies focus styling classes', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('focus-visible:border-ring')
    expect(input.className).toContain('focus-visible:ring-ring/50')
    expect(input.className).toContain('focus-visible:ring-[3px]')
  })

  it('applies validation styling classes', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input.className).toContain('aria-invalid:ring-destructive/20')
    expect(input.className).toContain('aria-invalid:border-destructive')
  })

  it('can handle ref forwarding', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.tagName).toBe('INPUT')
  })
})