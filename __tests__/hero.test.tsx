import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/sections/hero';

// Mock ScrollVelocity component
jest.mock(
  '@/components/reactbits/TextAnimations/ScrollVelocity/ScrollVelocity',
  () => {
    return function MockScrollVelocity({
      texts,
      className,
    }: {
      texts: string[];
      className?: string;
    }) {
      return (
        <div className={className} data-testid="scroll-velocity">
          {texts.join(' ')}
        </div>
      );
    };
  }
);

describe('Hero Component', () => {
  it('renders the main title text correctly', () => {
    render(<Hero />);

    // Verifica che il titolo principale sia presente
    const scrollingTitle = screen.getByTestId('scroll-velocity');
    expect(scrollingTitle).toBeInTheDocument();
    expect(scrollingTitle).toHaveTextContent('OMARPIOSELLI');
  });

  it('renders the call-to-action text', () => {
    render(<Hero />);

    // Verifica che il testo call-to-action sia presente (potrebbe essere spezzato da <br/>)
    const ctaText = screen.getByText(/AN INDEPENDENT CREATIVE WEB DEVELOPER/);
    expect(ctaText).toBeInTheDocument();

    const locationText = screen.getByText(/BASED IN ITALY/);
    expect(locationText).toBeInTheDocument();
  });

  it('renders the hero image with correct attributes', () => {
    render(<Hero />);

    // Verifica che l'immagine hero sia presente con gli attributi corretti
    const heroImage = screen.getByAltText('Hero Image');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', '/hero-image.png');
  });

  it('applies correct CSS classes for layout', () => {
    const { container } = render(<Hero />);

    // Verifica che il contenitore principale abbia le classi corrette
    const section = container.querySelector('section');
    expect(section).toHaveClass('min-h-screen', 'bg-black', 'relative');
  });

  it('renders fade gradients for visual effects', () => {
    const { container } = render(<Hero />);

    // Verifica che i gradienti di fade siano presenti
    const fadeGradients = container.querySelectorAll(
      '.bg-gradient-to-r, .bg-gradient-to-l'
    );
    expect(fadeGradients).toHaveLength(2);
  });
});
