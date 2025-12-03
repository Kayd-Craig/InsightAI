import { render, screen } from '@testing-library/react'
import { Logo } from '../../../../src/app/components/Logo'

describe('Logo Component', () => {
  it('renders with default props', () => {
    render(<Logo />)
    
    const logo = screen.getByAltText('InsightAI Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders with custom width and height', () => {
    render(<Logo width={100} height={100} />)
    
    const logo = screen.getByAltText('InsightAI Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('width', '100')
    expect(logo).toHaveAttribute('height', '100')
  })

  it('applies custom className', () => {
    const customClass = 'custom-logo-class'
    render(<Logo className={customClass} />)
    
    const logo = screen.getByAltText('InsightAI Logo')
    expect(logo).toHaveClass(customClass)
  })

  it('uses correct image source', () => {
    render(<Logo />)
    
    const logo = screen.getByAltText('InsightAI Logo')
    expect(logo).toHaveAttribute('src', '/images/logo.png')
  })

  it('has priority attribute for loading optimization', () => {
    render(<Logo />)
    
    const logo = screen.getByAltText('InsightAI Logo')
    expect(logo).toHaveAttribute('data-priority', 'true')
  })
})