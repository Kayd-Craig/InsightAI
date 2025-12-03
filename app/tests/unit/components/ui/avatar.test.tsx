import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '../../../../src/components/ui/avatar';

// Mock the utils function
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}));

// Mock Radix UI Avatar
jest.mock('@radix-ui/react-avatar', () => ({
  Root: React.forwardRef<
    HTMLSpanElement,
    React.ComponentProps<'span'> & {
      'data-slot'?: string;
      children?: React.ReactNode;
    }
  >(({ children, 'data-slot': dataSlot, ...props }, ref) => (
    <span ref={ref} data-slot={dataSlot} {...props}>
      {children}
    </span>
  )),
  Image: React.forwardRef<
    HTMLImageElement,
    React.ComponentProps<'img'> & {
      'data-slot'?: string;
      onLoadingStatusChange?: (status: 'idle' | 'loading' | 'loaded' | 'error') => void;
    }
  >(({ 'data-slot': dataSlot, onLoadingStatusChange, ...props }, ref) => {
    const handleLoad = () => {
      onLoadingStatusChange?.('loaded');
    };
    
    const handleError = () => {
      onLoadingStatusChange?.('error');
    };

    return (
      <img
        ref={ref}
        data-slot={dataSlot}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  }),
  Fallback: React.forwardRef<
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

describe('Avatar', () => {
  describe('Avatar Root', () => {
    it('renders an avatar container', () => {
      render(<Avatar data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });

    it('applies the data-slot attribute', () => {
      render(<Avatar data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('data-slot', 'avatar');
    });

    it('applies the default classes', () => {
      render(<Avatar data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass(
        'relative',
        'flex',
        'size-8',
        'shrink-0',
        'overflow-hidden',
        'rounded-full'
      );
    });

    it('accepts and applies custom className', () => {
      render(<Avatar className="custom-size" data-testid="avatar" />);
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('custom-size');
      expect(avatar).toHaveClass('relative', 'flex', 'size-8');
    });

    it('supports ref forwarding', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Avatar ref={ref} data-testid="avatar" />);
      
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveAttribute('data-slot', 'avatar');
    });

    it('renders children content', () => {
      render(
        <Avatar data-testid="avatar">
          <span>Avatar Content</span>
        </Avatar>
      );
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toContainHTML('<span>Avatar Content</span>');
    });
  });

  describe('AvatarImage', () => {
    it('renders an image element', () => {
      render(<AvatarImage src="/test.jpg" alt="Test Avatar" />);
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
    });

    it('applies the data-slot attribute', () => {
      render(<AvatarImage src="/test.jpg" alt="Test Avatar" />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('data-slot', 'avatar-image');
    });

    it('applies the default classes', () => {
      render(<AvatarImage src="/test.jpg" alt="Test Avatar" />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('aspect-square', 'size-full');
    });

    it('accepts and applies custom className', () => {
      render(<AvatarImage className="custom-image" src="/test.jpg" alt="Test Avatar" />);
      const image = screen.getByRole('img');
      expect(image).toHaveClass('custom-image');
      expect(image).toHaveClass('aspect-square', 'size-full');
    });

    it('forwards image props', () => {
      render(<AvatarImage src="/test.jpg" alt="Test Avatar" />);
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', '/test.jpg');
      expect(image).toHaveAttribute('alt', 'Test Avatar');
    });

    it('supports ref forwarding', () => {
      const ref = React.createRef<HTMLImageElement>();
      render(<AvatarImage ref={ref} src="/test.jpg" alt="Test Avatar" />);
      
      expect(ref.current).toBeInstanceOf(HTMLImageElement);
      expect(ref.current).toHaveAttribute('data-slot', 'avatar-image');
    });
  });

  describe('AvatarFallback', () => {
    it('renders a fallback element', () => {
      render(<AvatarFallback>AB</AvatarFallback>);
      const fallback = screen.getByText('AB');
      expect(fallback).toBeInTheDocument();
    });

    it('applies the data-slot attribute', () => {
      render(<AvatarFallback>AB</AvatarFallback>);
      const fallback = screen.getByText('AB');
      expect(fallback).toHaveAttribute('data-slot', 'avatar-fallback');
    });

    it('applies the default classes', () => {
      render(<AvatarFallback>AB</AvatarFallback>);
      const fallback = screen.getByText('AB');
      expect(fallback).toHaveClass(
        'bg-muted',
        'flex',
        'size-full',
        'items-center',
        'justify-center',
        'rounded-full'
      );
    });

    it('accepts and applies custom className', () => {
      render(<AvatarFallback className="custom-fallback">AB</AvatarFallback>);
      const fallback = screen.getByText('AB');
      expect(fallback).toHaveClass('custom-fallback');
      expect(fallback).toHaveClass('bg-muted', 'flex', 'size-full');
    });

    it('supports ref forwarding', () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<AvatarFallback ref={ref}>AB</AvatarFallback>);
      
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(ref.current).toHaveAttribute('data-slot', 'avatar-fallback');
    });

    it('renders children content', () => {
      render(
        <AvatarFallback>
          <span className="text-lg">JD</span>
        </AvatarFallback>
      );
      const fallback = screen.getByText('JD');
      expect(fallback.parentElement).toContainHTML('<span class="text-lg">JD</span>');
    });
  });

  describe('Avatar Composition', () => {
    it('renders complete avatar with image and fallback', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/user.jpg" alt="User Avatar" />
          <AvatarFallback>UA</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      const image = screen.getByRole('img');
      const fallback = screen.getByText('UA');

      expect(avatar).toContainElement(image);
      expect(avatar).toContainElement(fallback);
    });

    it('handles different avatar sizes', () => {
      render(
        <Avatar className="size-12" data-testid="large-avatar">
          <AvatarImage src="/user.jpg" alt="User Avatar" />
          <AvatarFallback>UA</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('large-avatar');
      expect(avatar).toHaveClass('size-12');
    });

    it('supports custom styling', () => {
      render(
        <Avatar 
          className="border-2 border-blue-500" 
          data-testid="styled-avatar"
        >
          <AvatarImage src="/user.jpg" alt="User Avatar" />
          <AvatarFallback className="bg-blue-100 text-blue-900">UA</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('styled-avatar');
      const fallback = screen.getByText('UA');
      
      expect(avatar).toHaveClass('border-2', 'border-blue-500');
      expect(fallback).toHaveClass('bg-blue-100', 'text-blue-900');
    });

    it('handles initials in fallback', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/broken-image.jpg" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const fallback = screen.getByText('JD');
      expect(fallback).toBeInTheDocument();
    });

    it('supports accessibility attributes', () => {
      render(
        <Avatar data-testid="avatar" role="img" aria-label="User profile picture">
          <AvatarImage src="/user.jpg" alt="John Doe" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      );

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveAttribute('role', 'img');
      expect(avatar).toHaveAttribute('aria-label', 'User profile picture');
    });

    it('works with different content types in fallback', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/user.jpg" alt="User" />
          <AvatarFallback>
            <svg width="16" height="16" data-testid="user-icon">
              <circle cx="8" cy="8" r="4" />
            </svg>
          </AvatarFallback>
        </Avatar>
      );

      const icon = screen.getByTestId('user-icon');
      expect(icon).toBeInTheDocument();
    });

    it('maintains proper aspect ratio', () => {
      render(
        <Avatar data-testid="avatar">
          <AvatarImage src="/user.jpg" alt="User" />
        </Avatar>
      );

      const image = screen.getByRole('img');
      expect(image).toHaveClass('aspect-square');
    });

    it('handles multiple avatars', () => {
      render(
        <div>
          <Avatar data-testid="avatar-1">
            <AvatarImage src="/user1.jpg" alt="User 1" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar data-testid="avatar-2">
            <AvatarImage src="/user2.jpg" alt="User 2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
        </div>
      );

      const avatar1 = screen.getByTestId('avatar-1');
      const avatar2 = screen.getByTestId('avatar-2');
      const fallback1 = screen.getByText('U1');
      const fallback2 = screen.getByText('U2');

      expect(avatar1).toBeInTheDocument();
      expect(avatar2).toBeInTheDocument();
      expect(fallback1).toBeInTheDocument();
      expect(fallback2).toBeInTheDocument();
    });
  });
});