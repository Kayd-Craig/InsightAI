import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from '../../../../src/components/ui/skeleton';

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}));

describe('Skeleton', () => {
  it('renders a div element', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton.tagName).toBe('DIV');
  });

  it('applies the data-slot attribute', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton');
  });

  it('applies the default classes', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('bg-accent', 'animate-pulse', 'rounded-md');
  });

  it('accepts and applies custom className', () => {
    render(<Skeleton className="custom-class" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('custom-class');
    expect(skeleton).toHaveClass('bg-accent', 'animate-pulse', 'rounded-md');
  });

  it('forwards all other props', () => {
    render(<Skeleton id="custom-skeleton" role="presentation" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('id', 'custom-skeleton');
    expect(skeleton).toHaveAttribute('role', 'presentation');
  });

  it('supports custom styles', () => {
    render(<Skeleton style={{ width: '100px', height: '20px' }} data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveStyle({ width: '100px', height: '20px' });
  });

  it('supports children content', () => {
    render(
      <Skeleton data-testid="skeleton">
        <span>Loading content...</span>
      </Skeleton>
    );
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toContainHTML('<span>Loading content...</span>');
  });

  it('can be used with different sizes', () => {
    render(<Skeleton className="h-4 w-48" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('h-4', 'w-48');
  });

  it('can be used with different shapes', () => {
    render(<Skeleton className="rounded-full" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('rounded-full');
  });

  it('supports accessibility attributes', () => {
    render(
      <Skeleton
        aria-label="Loading content"
        aria-hidden="true"
        data-testid="skeleton"
      />
    );
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  it('supports ref forwarding', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} data-testid="skeleton" />);
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-slot', 'skeleton');
  });

  it('can be used as a placeholder for text', () => {
    render(
      <div>
        <Skeleton className="h-4 w-3/4 mb-2" data-testid="title-skeleton" />
        <Skeleton className="h-4 w-1/2" data-testid="subtitle-skeleton" />
      </div>
    );
    
    const titleSkeleton = screen.getByTestId('title-skeleton');
    const subtitleSkeleton = screen.getByTestId('subtitle-skeleton');
    
    expect(titleSkeleton).toHaveClass('h-4', 'w-3/4', 'mb-2');
    expect(subtitleSkeleton).toHaveClass('h-4', 'w-1/2');
  });

  it('can be used as a placeholder for avatars', () => {
    render(<Skeleton className="h-12 w-12 rounded-full" data-testid="avatar-skeleton" />);
    const skeleton = screen.getByTestId('avatar-skeleton');
    expect(skeleton).toHaveClass('h-12', 'w-12', 'rounded-full');
  });

  it('can be used as a placeholder for cards', () => {
    render(
      <div className="border rounded-lg p-4">
        <Skeleton className="h-48 w-full mb-4" data-testid="image-skeleton" />
        <Skeleton className="h-4 w-3/4 mb-2" data-testid="title-skeleton" />
        <Skeleton className="h-4 w-1/2" data-testid="description-skeleton" />
      </div>
    );
    
    const imageSkeleton = screen.getByTestId('image-skeleton');
    const titleSkeleton = screen.getByTestId('title-skeleton');
    const descriptionSkeleton = screen.getByTestId('description-skeleton');
    
    expect(imageSkeleton).toHaveClass('h-48', 'w-full', 'mb-4');
    expect(titleSkeleton).toHaveClass('h-4', 'w-3/4', 'mb-2');
    expect(descriptionSkeleton).toHaveClass('h-4', 'w-1/2');
  });

  it('maintains consistent animation', () => {
    const { rerender } = render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    
    expect(skeleton).toHaveClass('animate-pulse');
    
    rerender(<Skeleton className="custom-animation" data-testid="skeleton" />);
    expect(skeleton).toHaveClass('animate-pulse', 'custom-animation');
  });
});