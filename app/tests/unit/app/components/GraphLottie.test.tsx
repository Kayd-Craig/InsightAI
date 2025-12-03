import React from 'react';
import { render, screen } from '@testing-library/react';
import GraphLottie from '../../../../src/app/components/GraphLottie';

// Mock next/dynamic
jest.mock('next/dynamic', () => {
  return (importFunc: () => Promise<any>) => {
    const MockLottie = ({ animationData, style, loop, autoplay }: {
      animationData: any;
      style?: any;
      loop?: boolean;
      autoplay?: boolean;
    }) => (
      <div 
        data-testid="lottie-animation"
        data-animation-data={JSON.stringify(animationData)}
        data-loop={loop}
        data-autoplay={autoplay}
        style={style}
      >
        Lottie Animation
      </div>
    );
    return MockLottie;
  };
});

// Mock the Lottie animation data
jest.mock('../../../../public/LottieGraph.json', () => ({
  version: '5.7.4',
  fr: 30,
  ip: 0,
  op: 90,
  w: 400,
  h: 400,
  nm: 'Graph Animation',
  ddd: 0,
  assets: [],
  layers: [],
}));

describe('GraphLottie', () => {
  it('renders Lottie animation with default props', () => {
    render(<GraphLottie />);
    
    const lottieElement = screen.getByTestId('lottie-animation');
    expect(lottieElement).toBeInTheDocument();
  });

  it('applies default scale style', () => {
    render(<GraphLottie />);
    
    const lottieElement = screen.getByTestId('lottie-animation');
    expect(lottieElement).toHaveStyle({ scale: '1.1' });
  });

  it('applies custom style when provided', () => {
    const customStyle = { scale: '2.0', opacity: '0.8' };
    render(<GraphLottie style={customStyle} />);
    
    const lottieElement = screen.getByTestId('lottie-animation');
    expect(lottieElement).toHaveStyle(customStyle);
  });

  it('passes correct animation data', () => {
    render(<GraphLottie />);
    
    const lottieElement = screen.getByTestId('lottie-animation');
    const animationData = JSON.parse(lottieElement.getAttribute('data-animation-data') || '{}');
    
    expect(animationData).toHaveProperty('version', '5.7.4');
    expect(animationData).toHaveProperty('fr', 30);
    expect(animationData).toHaveProperty('nm', 'Graph Animation');
  });

  it('sets loop to true by default', () => {
    render(<GraphLottie />);
    
    const lottieElement = screen.getByTestId('lottie-animation');
    expect(lottieElement).toHaveAttribute('data-loop', 'true');
  });

  it('sets autoplay to true by default', () => {
    render(<GraphLottie />);
    
    const lottieElement = screen.getByTestId('lottie-animation');
    expect(lottieElement).toHaveAttribute('data-autoplay', 'true');
  });

  it('handles partial style prop', () => {
    render(<GraphLottie style={{ scale: '1.0' }} />);
    
    const lottieElement = screen.getByTestId('lottie-animation');
    expect(lottieElement).toBeInTheDocument();
    expect(lottieElement).toHaveStyle({ scale: '1.0' });
  });

  it('handles multiple style properties', () => {
    const multipleStyles = {
      scale: '0.5',
      transform: 'rotate(45deg)',
      filter: 'blur(2px)',
      opacity: '0.7'
    };
    
    render(<GraphLottie style={multipleStyles} />);
    
    const lottieElement = screen.getByTestId('lottie-animation');
    expect(lottieElement).toHaveStyle(multipleStyles);
  });

  it('renders without crashing when no props provided', () => {
    render(<GraphLottie />);
    
    expect(screen.getByTestId('lottie-animation')).toBeInTheDocument();
    expect(screen.getByText('Lottie Animation')).toBeInTheDocument();
  });

  it('is a functional component that can be imported dynamically', () => {
    // This test ensures the component structure is compatible with dynamic imports
    expect(typeof GraphLottie).toBe('function');
    expect(GraphLottie.name).toBe('GraphLottie');
  });
});
