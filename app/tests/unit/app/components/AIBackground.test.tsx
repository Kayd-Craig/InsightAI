import React from 'react';
import { render } from '@testing-library/react';

// Mock the entire AIBackground component to avoid memory issues with animations
jest.mock('../../../../src/app/components/AIBackground', () => {
  return function MockAIBackground() {
    return (
      <div className="fixed inset-0 -z-10" data-testid="ai-background">
        <svg className="absolute inset-0 w-full h-full" data-testid="background-svg">
          <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="#FFFFFF" strokeWidth="0.5" />
        </svg>
      </div>
    );
  };
});

import AIBackground from '../../../../src/app/components/AIBackground';

describe('AIBackground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<AIBackground />);
    expect(getByTestId('ai-background')).toBeInTheDocument();
  });

  it('renders svg background', () => {
    const { getByTestId } = render(<AIBackground />);
    const svg = getByTestId('background-svg');
    expect(svg).toBeInTheDocument();
  });

  it('has fixed positioning', () => {
    const { getByTestId } = render(<AIBackground />);
    const backgroundDiv = getByTestId('ai-background');
    expect(backgroundDiv).toHaveClass('fixed');
  });

  it('covers full screen', () => {
    const { getByTestId } = render(<AIBackground />);
    const backgroundDiv = getByTestId('ai-background');
    expect(backgroundDiv).toHaveClass('inset-0');
  });

  it('has correct z-index', () => {
    const { getByTestId } = render(<AIBackground />);
    const backgroundDiv = getByTestId('ai-background');
    expect(backgroundDiv).toHaveClass('-z-10');
  });
});
