import { render, screen } from '@testing-library/react'
import { Badge } from '../../../../src/components/ui/badge'

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}))

describe('Badge Component', () => {
  it('renders as a span by default', () => {
    render(<Badge>Test Badge</Badge>)
    
    const badge = screen.getByText('Test Badge')
    expect(badge).toBeInTheDocument()
    expect(badge.tagName).toBe('SPAN')
  })

  it('has the correct data-slot attribute', () => {
    render(<Badge>Badge</Badge>)
    
    const badge = screen.getByText('Badge')
    expect(badge).toHaveAttribute('data-slot', 'badge')
  })

  it('applies default variant styling', () => {
    render(<Badge>Default Badge</Badge>)
    
    const badge = screen.getByText('Default Badge')
    expect(badge.className).toContain('inline-flex')
    expect(badge.className).toContain('items-center')
    expect(badge.className).toContain('justify-center')
    expect(badge.className).toContain('bg-primary')
  })

  it('applies different variant styles', () => {
    const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
    let badge = screen.getByText('Secondary')
    expect(badge.className).toContain('bg-secondary')

    rerender(<Badge variant="destructive">Destructive</Badge>)
    badge = screen.getByText('Destructive')
    expect(badge.className).toContain('bg-destructive')

    rerender(<Badge variant="outline">Outline</Badge>)
    badge = screen.getByText('Outline')
    expect(badge.className).toContain('text-foreground')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-badge-class">Custom Badge</Badge>)
    
    const badge = screen.getByText('Custom Badge')
    expect(badge.className).toContain('custom-badge-class')
  })

  it('forwards HTML attributes', () => {
    render(
      <Badge id="test-badge" data-testid="badge-element" title="Badge title">
        Badge with attributes
      </Badge>
    )
    
    const badge = screen.getByText('Badge with attributes')
    expect(badge).toHaveAttribute('id', 'test-badge')
    expect(badge).toHaveAttribute('data-testid', 'badge-element')
    expect(badge).toHaveAttribute('title', 'Badge title')
  })

  it('renders as child component when asChild is true', () => {
    render(
      <Badge asChild>
        <a href="/test">Link Badge</a>
      </Badge>
    )
    
    const link = screen.getByRole('link', { name: 'Link Badge' })
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveAttribute('data-slot', 'badge')
  })

  it('handles empty content', () => {
    render(<Badge data-testid="empty-badge" />)
    
    const badge = screen.getByTestId('empty-badge')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute('data-slot', 'badge')
  })

  it('combines variant with custom className correctly', () => {
    render(
      <Badge variant="destructive" className="extra-class">
        Combined Badge
      </Badge>
    )
    
    const badge = screen.getByText('Combined Badge')
    expect(badge.className).toContain('bg-destructive') // variant class
    expect(badge.className).toContain('extra-class') // custom class
  })

  it('renders children correctly', () => {
    render(
      <Badge>
        <span>Child 1</span>
        <span>Child 2</span>
      </Badge>
    )
    
    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })

  it('supports complex content with icons', () => {
    render(
      <Badge>
        <svg data-testid="icon">
          <circle cx="10" cy="10" r="5" />
        </svg>
        Icon Badge
      </Badge>
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Icon Badge')).toBeInTheDocument()
  })
})