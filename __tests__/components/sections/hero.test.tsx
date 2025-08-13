import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '@/components/sections/hero';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    priority,
    className,
    style,
  }: any) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        data-priority={priority}
        data-testid="hero-image"
      />
    );
  };
});

// Mock the ScrollVelocity component
jest.mock(
  '@/components/reactbits/TextAnimations/ScrollVelocity/ScrollVelocity',
  () => {
    return function MockScrollVelocity({
      texts,
      velocity,
      className,
      numCopies,
      parallaxClassName,
      scrollerClassName,
    }: any) {
      return (
        <div
          data-testid="mock-scroll-velocity"
          data-texts={JSON.stringify(texts)}
          data-velocity={velocity}
          data-num-copies={numCopies}
          data-parallax-classname={parallaxClassName}
          data-scroller-classname={scrollerClassName}
          className={className}
        >
          {texts.map((text: string, index: number) => (
            <span key={index} data-testid="velocity-text">
              {text}
            </span>
          ))}
        </div>
      );
    };
  }
);

describe('Hero', () => {
  it('renders the hero section with correct structure', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');
    expect(heroSection).toBeInTheDocument();
  });

  it('has correct section attributes and classes', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');
    expect(heroSection).toHaveAttribute('id', 'home');
    expect(heroSection).toHaveClass(
      'flex',
      'items-end',
      'justify-center',
      'min-h-screen',
      'bg-black',
      'relative',
      'overflow-hidden'
    );
  });

  it('renders the background ScrollVelocity component with correct props', () => {
    render(<Hero />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toBeInTheDocument();

    // Check props passed to ScrollVelocity
    expect(scrollVelocity).toHaveAttribute('data-texts', '["OMARPIOSELLI"]');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '-50');
    expect(scrollVelocity).toHaveAttribute('data-num-copies', '8');
    expect(scrollVelocity).toHaveAttribute('data-parallax-classname', 'w-full');
    expect(scrollVelocity).toHaveAttribute(
      'data-scroller-classname',
      'flex whitespace-nowrap'
    );
  });

  it('has correct typography classes on ScrollVelocity', () => {
    render(<Hero />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveClass(
      'text-8xl',
      'md:text-9xl',
      'lg:text-[12rem]',
      'font-bold',
      'text-white/10',
      'tracking-tighter'
    );
  });

  it('renders the scrolling background text content', () => {
    render(<Hero />);

    const velocityText = screen.getByTestId('velocity-text');
    expect(velocityText).toBeInTheDocument();
    expect(velocityText).toHaveTextContent('OMARPIOSELLI');
  });

  it('renders fade gradients at both edges', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');

    // Check for the overlay container
    const fadeContainer = heroSection!.querySelector(
      '.absolute.inset-0.pointer-events-none'
    );
    expect(fadeContainer).toBeInTheDocument();

    // Check for left fade gradient
    const leftFade = heroSection!.querySelector(
      '.absolute.left-0.top-0.w-32.h-full.bg-gradient-to-r.from-black.to-transparent.z-20'
    );
    expect(leftFade).toBeInTheDocument();

    // Check for right fade gradient
    const rightFade = heroSection!.querySelector(
      '.absolute.right-0.top-0.w-32.h-full.bg-gradient-to-l.from-black.to-transparent.z-20'
    );
    expect(rightFade).toBeInTheDocument();
  });

  it('renders the bottom description text', () => {
    render(<Hero />);

    const description = screen.getByText(
      /AN INDEPENDENT CREATIVE WEB DEVELOPER/i
    );
    expect(description).toBeInTheDocument();

    const location = screen.getByText(/BASED IN ITALY/i);
    expect(location).toBeInTheDocument();
  });

  it('has correct styling for description text', () => {
    render(<Hero />);

    const description = screen.getByText(
      /AN INDEPENDENT CREATIVE WEB DEVELOPER/i
    );
    expect(description).toHaveClass(
      'text-sm',
      'md:text-base',
      'leading-relaxed',
      'text-white'
    );
  });

  it('positions description text correctly at bottom', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');
    const descriptionContainer = heroSection!.querySelector(
      '.absolute.bottom-4.left-0.right-0.text-center.z-10'
    );
    expect(descriptionContainer).toBeInTheDocument();
  });

  it('renders the hero image with correct attributes', () => {
    render(<Hero />);

    const heroImage = screen.getByTestId('hero-image');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', '/hero-image.png');
    expect(heroImage).toHaveAttribute('alt', 'Hero Image');
    expect(heroImage).toHaveAttribute('width', '400');
    expect(heroImage).toHaveAttribute('height', '300');
    expect(heroImage).toHaveAttribute('data-priority', 'true');
  });

  it('has correct styling classes on hero image', () => {
    render(<Hero />);

    const heroImage = screen.getByTestId('hero-image');
    expect(heroImage).toHaveClass('mx-auto', 'w-80', 'md:w-96');
  });

  it('has transparent background style on hero image', () => {
    render(<Hero />);

    const heroImage = screen.getByTestId('hero-image');
    // Transparent can be computed as rgba(0, 0, 0, 0) by the browser
    expect(heroImage).toHaveStyle('background-color: rgba(0, 0, 0, 0)');
  });

  it('has proper container structure for main content', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');

    // Check for main container
    const mainContainer = heroSection!.querySelector(
      '.container.mx-auto.px-4.pb-20.text-center.relative.z-10'
    );
    expect(mainContainer).toBeInTheDocument();

    // Check for image wrapper
    const imageWrapper = heroSection!.querySelector('.max-w-md.mx-auto');
    expect(imageWrapper).toBeInTheDocument();
  });

  it('has correct z-index layering', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');

    // Fade gradients should have z-20
    const leftFade = heroSection!.querySelector('.bg-gradient-to-r');
    const rightFade = heroSection!.querySelector('.bg-gradient-to-l');
    expect(leftFade).toHaveClass('z-20');
    expect(rightFade).toHaveClass('z-20');

    // Main content should have z-10
    const mainContainer = heroSection!.querySelector('.container');
    const descriptionContainer = heroSection!.querySelector('.bottom-4');
    expect(mainContainer).toHaveClass('z-10');
    expect(descriptionContainer).toHaveClass('z-10');
  });

  it('uses black background and white text for contrast', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');
    expect(heroSection).toHaveClass('bg-black');

    const description = screen.getByText(
      /AN INDEPENDENT CREATIVE WEB DEVELOPER/i
    );
    expect(description).toHaveClass('text-white');
  });

  it('positions ScrollVelocity in background layer', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');
    const backgroundContainer = heroSection!.querySelector(
      '.absolute.inset-0.flex.items-center.justify-center'
    );
    expect(backgroundContainer).toBeInTheDocument();

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(backgroundContainer).toContainElement(scrollVelocity);
  });

  it('has overflow hidden to prevent content spillage', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');
    expect(heroSection).toHaveClass('overflow-hidden');
  });

  it('spans full viewport height with min-h-screen', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');
    expect(heroSection).toHaveClass('min-h-screen');
  });

  it('centers content with flexbox alignment', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');
    expect(heroSection).toHaveClass('flex', 'items-end', 'justify-center');
  });

  it('uses responsive typography for ScrollVelocity', () => {
    render(<Hero />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveClass(
      'text-8xl',
      'md:text-9xl',
      'lg:text-[12rem]'
    );
  });

  it('uses responsive sizing for hero image', () => {
    render(<Hero />);

    const heroImage = screen.getByTestId('hero-image');
    expect(heroImage).toHaveClass('w-80', 'md:w-96');
  });

  it('uses responsive typography for description', () => {
    render(<Hero />);

    const description = screen.getByText(
      /AN INDEPENDENT CREATIVE WEB DEVELOPER/i
    );
    expect(description).toHaveClass('text-sm', 'md:text-base');
  });

  it('has proper semantic structure with section element', () => {
    render(<Hero />);

    const heroSection = document.querySelector('section#home');
    expect(heroSection).toBeInTheDocument();
    expect(heroSection!.tagName).toBe('SECTION');
  });

  it('has accessible image with alt text', () => {
    render(<Hero />);

    const heroImage = screen.getByAltText('Hero Image');
    expect(heroImage).toBeInTheDocument();
  });

  it('prioritizes image loading', () => {
    render(<Hero />);

    const heroImage = screen.getByTestId('hero-image');
    expect(heroImage).toHaveAttribute('data-priority', 'true');
  });

  it('contains all visual elements', () => {
    render(<Hero />);

    // Background scrolling text
    expect(screen.getByTestId('mock-scroll-velocity')).toBeInTheDocument();

    // Hero image
    expect(screen.getByTestId('hero-image')).toBeInTheDocument();

    // Description text
    expect(
      screen.getByText(/AN INDEPENDENT CREATIVE WEB DEVELOPER/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/BASED IN ITALY/i)).toBeInTheDocument();

    // Fade gradients
    const heroSection = document.querySelector('#home');
    expect(
      heroSection!.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-l')
    ).toHaveLength(2);
  });

  it('renders exactly one ScrollVelocity component', () => {
    render(<Hero />);

    const scrollVelocityComponents = screen.getAllByTestId(
      'mock-scroll-velocity'
    );
    expect(scrollVelocityComponents).toHaveLength(1);
  });

  it('maintains proper spacing with padding and margins', () => {
    render(<Hero />);

    const heroSection = document.querySelector('#home');

    const mainContainer = heroSection!.querySelector('.container');
    expect(mainContainer).toHaveClass('mx-auto', 'px-4', 'pb-20');

    const imageWrapper = heroSection!.querySelector('.max-w-md');
    expect(imageWrapper).toHaveClass('mx-auto');
  });
});
