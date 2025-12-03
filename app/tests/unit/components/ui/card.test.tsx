import { render, screen } from '@testing-library/react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter, 
  CardAction 
} from '../../../../src/components/ui/card'

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' ')
}))

describe('Card Components', () => {
  describe('Card', () => {
    it('renders as a div with correct attributes', () => {
      render(<Card>Card content</Card>)
      
      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
      expect(card.tagName).toBe('DIV')
      expect(card).toHaveAttribute('data-slot', 'card')
    })

    it('applies default styling classes', () => {
      render(<Card>Card</Card>)
      
      const card = screen.getByText('Card')
      expect(card.className).toContain('bg-card')
      expect(card.className).toContain('text-card-foreground')
      expect(card.className).toContain('flex')
      expect(card.className).toContain('flex-col')
      expect(card.className).toContain('gap-6')
      expect(card.className).toContain('rounded-xl')
      expect(card.className).toContain('border')
      expect(card.className).toContain('py-6')
      expect(card.className).toContain('shadow-sm')
    })

    it('applies custom className', () => {
      render(<Card className="custom-card">Card</Card>)
      
      const card = screen.getByText('Card')
      expect(card.className).toContain('custom-card')
    })

    it('forwards HTML attributes', () => {
      render(<Card id="card-id" data-testid="card-element">Card</Card>)
      
      const card = screen.getByText('Card')
      expect(card).toHaveAttribute('id', 'card-id')
      expect(card).toHaveAttribute('data-testid', 'card-element')
    })
  })

  describe('CardHeader', () => {
    it('renders with correct attributes and classes', () => {
      render(<CardHeader>Header content</CardHeader>)
      
      const header = screen.getByText('Header content')
      expect(header).toBeInTheDocument()
      expect(header).toHaveAttribute('data-slot', 'card-header')
      expect(header.className).toContain('@container/card-header')
      expect(header.className).toContain('grid')
      expect(header.className).toContain('auto-rows-min')
      expect(header.className).toContain('grid-rows-[auto_auto]')
      expect(header.className).toContain('items-start')
      expect(header.className).toContain('gap-1.5')
      expect(header.className).toContain('px-6')
    })

    it('applies custom className', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>)
      
      const header = screen.getByText('Header')
      expect(header.className).toContain('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('renders with correct attributes and classes', () => {
      render(<CardTitle>Card Title</CardTitle>)
      
      const title = screen.getByText('Card Title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveAttribute('data-slot', 'card-title')
      expect(title.className).toContain('leading-none')
      expect(title.className).toContain('font-semibold')
    })

    it('applies custom className', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>)
      
      const title = screen.getByText('Title')
      expect(title.className).toContain('custom-title')
    })
  })

  describe('CardDescription', () => {
    it('renders with correct attributes and classes', () => {
      render(<CardDescription>Card description</CardDescription>)
      
      const description = screen.getByText('Card description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveAttribute('data-slot', 'card-description')
      expect(description.className).toContain('text-muted-foreground')
      expect(description.className).toContain('text-sm')
    })

    it('applies custom className', () => {
      render(<CardDescription className="custom-desc">Description</CardDescription>)
      
      const description = screen.getByText('Description')
      expect(description.className).toContain('custom-desc')
    })
  })

  describe('CardContent', () => {
    it('renders with correct attributes and classes', () => {
      render(<CardContent>Card content</CardContent>)
      
      const content = screen.getByText('Card content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveAttribute('data-slot', 'card-content')
      expect(content.className).toContain('px-6')
    })

    it('applies custom className', () => {
      render(<CardContent className="custom-content">Content</CardContent>)
      
      const content = screen.getByText('Content')
      expect(content.className).toContain('custom-content')
    })
  })

  describe('CardFooter', () => {
    it('renders with correct attributes and classes', () => {
      render(<CardFooter>Footer content</CardFooter>)
      
      const footer = screen.getByText('Footer content')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
      expect(footer.className).toContain('flex')
      expect(footer.className).toContain('items-center')
      expect(footer.className).toContain('px-6')
      expect(footer.className).toContain('[.border-t]:pt-6')
    })

    it('applies custom className', () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>)
      
      const footer = screen.getByText('Footer')
      expect(footer.className).toContain('custom-footer')
    })
  })

  describe('CardAction', () => {
    it('renders with correct attributes and classes', () => {
      render(<CardAction>Action content</CardAction>)
      
      const action = screen.getByText('Action content')
      expect(action).toBeInTheDocument()
      expect(action).toHaveAttribute('data-slot', 'card-action')
      expect(action.className).toContain('col-start-2')
      expect(action.className).toContain('row-span-2')
      expect(action.className).toContain('row-start-1')
      expect(action.className).toContain('self-start')
      expect(action.className).toContain('justify-self-end')
    })

    it('applies custom className', () => {
      render(<CardAction className="custom-action">Action</CardAction>)
      
      const action = screen.getByText('Action')
      expect(action.className).toContain('custom-action')
    })
  })

  describe('Card composition', () => {
    it('renders complete card structure', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Card Title</CardTitle>
            <CardDescription>Test card description</CardDescription>
            <CardAction>Action Button</CardAction>
          </CardHeader>
          <CardContent>
            This is the card content area.
          </CardContent>
          <CardFooter>
            Footer information
          </CardFooter>
        </Card>
      )

      // Check all parts are present
      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByText('Test Card Title')).toBeInTheDocument()
      expect(screen.getByText('Test card description')).toBeInTheDocument()
      expect(screen.getByText('Action Button')).toBeInTheDocument()
      expect(screen.getByText('This is the card content area.')).toBeInTheDocument()
      expect(screen.getByText('Footer information')).toBeInTheDocument()

      // Verify data-slot attributes
      expect(screen.getByText('Test Card Title')).toHaveAttribute('data-slot', 'card-title')
      expect(screen.getByText('Test card description')).toHaveAttribute('data-slot', 'card-description')
      expect(screen.getByText('Action Button')).toHaveAttribute('data-slot', 'card-action')
      expect(screen.getByText('This is the card content area.')).toHaveAttribute('data-slot', 'card-content')
      expect(screen.getByText('Footer information')).toHaveAttribute('data-slot', 'card-footer')
    })

    it('works with minimal structure', () => {
      render(
        <Card>
          <CardContent>Simple card</CardContent>
        </Card>
      )

      expect(screen.getByText('Simple card')).toBeInTheDocument()
    })
  })
})