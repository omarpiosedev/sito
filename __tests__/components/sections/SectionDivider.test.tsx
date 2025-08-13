import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SectionDivider from '@/components/sections/SectionDivider';

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

describe('SectionDivider', () => {
  const defaultProps = {
    text: 'TEST DIVIDER',
  };

  it('renders with required text prop', () => {
    render(<SectionDivider {...defaultProps} />);

    const velocityText = screen.getByTestId('velocity-text');
    expect(velocityText).toBeInTheDocument();
    expect(velocityText).toHaveTextContent('TEST DIVIDER');
  });

  it('has correct default section structure and classes', () => {
    render(<SectionDivider {...defaultProps} />);

    const section = document.querySelector('section');
    expect(section).toHaveClass(
      'h-32',
      'bg-black',
      'relative',
      'overflow-hidden',
      'flex',
      'items-center',
      'justify-center',
      '-mt-1',
      'md:mt-32',
      'lg:mt-48'
    );
  });

  it('renders ScrollVelocity with default props', () => {
    render(<SectionDivider {...defaultProps} />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveAttribute('data-texts', '["TEST DIVIDER"]');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '100'); // default direction=true, velocity=100
    expect(scrollVelocity).toHaveAttribute('data-num-copies', '8');
    expect(scrollVelocity).toHaveAttribute('data-parallax-classname', 'w-full');
    expect(scrollVelocity).toHaveAttribute(
      'data-scroller-classname',
      'flex whitespace-nowrap'
    );
  });

  it('has default typography classes', () => {
    render(<SectionDivider {...defaultProps} />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveClass(
      'text-4xl',
      'md:text-6xl',
      'lg:text-8xl',
      'font-bold',
      'text-white/10',
      'tracking-tighter',
      'uppercase'
    );
  });

  it('renders fade gradients with default black background', () => {
    render(<SectionDivider {...defaultProps} />);

    const section = document.querySelector('section');

    // Check for fade container
    const fadeContainer = section!.querySelector(
      '.absolute.inset-0.pointer-events-none'
    );
    expect(fadeContainer).toBeInTheDocument();

    // Check for left and right fade gradients
    const fadeElements = section!.querySelectorAll('.absolute.w-20.h-full');
    expect(fadeElements).toHaveLength(2);

    // Check fade directions
    const leftFade = section!.querySelector('.left-0.bg-gradient-to-r');
    const rightFade = section!.querySelector('.right-0.bg-gradient-to-l');
    expect(leftFade).toBeInTheDocument();
    expect(rightFade).toBeInTheDocument();
  });

  it('applies custom direction (left)', () => {
    render(
      <SectionDivider {...defaultProps} direction={false} velocity={50} />
    );

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '-50'); // negative velocity for left direction
  });

  it('applies custom direction (right)', () => {
    render(<SectionDivider {...defaultProps} direction={true} velocity={75} />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '75'); // positive velocity for right direction
  });

  it('applies custom velocity', () => {
    render(<SectionDivider {...defaultProps} velocity={200} />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '200');
  });

  it('applies custom textClassName', () => {
    render(
      <SectionDivider
        {...defaultProps}
        textClassName="custom-text-class text-red-500"
      />
    );

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveClass('custom-text-class', 'text-red-500');
    // Should not have default classes when custom textClassName is provided
    expect(scrollVelocity).not.toHaveClass('text-4xl', 'text-white/10');
  });

  it('applies custom containerClassName', () => {
    render(
      <SectionDivider
        {...defaultProps}
        containerClassName="custom-container-class border-2"
      />
    );

    const section = document.querySelector('section');
    expect(section).toHaveClass('custom-container-class', 'border-2');
  });

  it('applies custom height', () => {
    render(<SectionDivider {...defaultProps} height="h-64" />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('h-64');
    expect(section).not.toHaveClass('h-32');
  });

  it('applies custom backgroundColor', () => {
    render(<SectionDivider {...defaultProps} backgroundColor="bg-red-600" />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('bg-red-600');
    expect(section).not.toHaveClass('bg-black');
  });

  it('applies custom numCopies', () => {
    render(<SectionDivider {...defaultProps} numCopies={12} />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveAttribute('data-num-copies', '12');
  });

  it('applies custom textOpacity', () => {
    render(<SectionDivider {...defaultProps} textOpacity="text-blue-500/20" />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveClass('text-blue-500/20');
    expect(scrollVelocity).not.toHaveClass('text-white/10');
  });

  it('calculates baseVelocity correctly for direction=true', () => {
    render(<SectionDivider {...defaultProps} direction={true} velocity={80} />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '80');
  });

  it('calculates baseVelocity correctly for direction=false', () => {
    render(
      <SectionDivider {...defaultProps} direction={false} velocity={80} />
    );

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '-80');
  });

  it('combines default and custom text classes correctly', () => {
    render(<SectionDivider {...defaultProps} />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    // Should have all default text classes
    expect(scrollVelocity).toHaveClass(
      'text-4xl',
      'md:text-6xl',
      'lg:text-8xl',
      'font-bold',
      'text-white/10',
      'tracking-tighter',
      'uppercase'
    );
  });

  it('renders with semantic section element', () => {
    render(<SectionDivider {...defaultProps} />);

    const section = document.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section!.tagName).toBe('SECTION');
  });

  it('has proper z-index layering structure', () => {
    render(<SectionDivider {...defaultProps} />);

    const section = document.querySelector('section');

    // ScrollVelocity container should be absolute positioned
    const scrollContainer = section!.querySelector(
      '.absolute.inset-0.flex.items-center.justify-center'
    );
    expect(scrollContainer).toBeInTheDocument();

    // Fade container should be absolute with pointer-events-none
    const fadeContainer = section!.querySelector(
      '.absolute.inset-0.pointer-events-none'
    );
    expect(fadeContainer).toBeInTheDocument();
  });

  it('uses correct gradient backgrounds for black background', () => {
    render(<SectionDivider {...defaultProps} backgroundColor="bg-black" />);

    const section = document.querySelector('section');
    const leftFade = section!.querySelector('.left-0.bg-gradient-to-r');
    const rightFade = section!.querySelector('.right-0.bg-gradient-to-l');

    // Check inline styles for black gradients
    expect(leftFade).toHaveStyle(
      'background: linear-gradient(to right, black, transparent)'
    );
    expect(rightFade).toHaveStyle(
      'background: linear-gradient(to left, black, transparent)'
    );
  });

  it('uses correct gradient backgrounds for non-black background', () => {
    render(<SectionDivider {...defaultProps} backgroundColor="bg-white" />);

    const section = document.querySelector('section');
    const leftFade = section!.querySelector('.left-0.bg-gradient-to-r');
    const rightFade = section!.querySelector('.right-0.bg-gradient-to-l');

    // Check inline styles for white gradients
    expect(leftFade).toHaveStyle(
      'background: linear-gradient(to right, white, transparent)'
    );
    expect(rightFade).toHaveStyle(
      'background: linear-gradient(to left, white, transparent)'
    );
  });

  it('handles responsive margin classes', () => {
    render(<SectionDivider {...defaultProps} />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('-mt-1', 'md:mt-32', 'lg:mt-48');
  });

  it('positions ScrollVelocity correctly in center', () => {
    render(<SectionDivider {...defaultProps} />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('flex', 'items-center', 'justify-center');

    const scrollContainer = section!.querySelector(
      '.absolute.inset-0.flex.items-center.justify-center'
    );
    expect(scrollContainer).toBeInTheDocument();

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollContainer).toContainElement(scrollVelocity);
  });

  it('has overflow hidden to contain scrolling text', () => {
    render(<SectionDivider {...defaultProps} />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('overflow-hidden');
  });

  it('makes text uppercase by default', () => {
    render(<SectionDivider {...defaultProps} />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveClass('uppercase');
  });

  it('applies custom props correctly when all are provided', () => {
    const customProps = {
      text: 'CUSTOM TEXT',
      direction: false,
      velocity: 150,
      textClassName: 'text-green-500 text-xl',
      containerClassName: 'border-4 border-blue-500',
      height: 'h-48',
      backgroundColor: 'bg-red-500',
      numCopies: 6,
      textOpacity: 'text-yellow-300/30',
    };

    render(<SectionDivider {...customProps} />);

    const section = document.querySelector('section');
    expect(section).toHaveClass(
      'h-48',
      'bg-red-500',
      'border-4',
      'border-blue-500'
    );

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveAttribute('data-texts', '["CUSTOM TEXT"]');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '-150');
    expect(scrollVelocity).toHaveAttribute('data-num-copies', '6');
    expect(scrollVelocity).toHaveClass('text-green-500', 'text-xl');
  });

  it('defaults are applied when props are undefined', () => {
    render(<SectionDivider text="TEST" />);

    const section = document.querySelector('section');
    expect(section).toHaveClass('h-32', 'bg-black');

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '100'); // default direction=true, velocity=100
    expect(scrollVelocity).toHaveAttribute('data-num-copies', '8');
    expect(scrollVelocity).toHaveClass('text-white/10');
  });

  it('renders exactly one ScrollVelocity component', () => {
    render(<SectionDivider {...defaultProps} />);

    const scrollVelocityComponents = screen.getAllByTestId(
      'mock-scroll-velocity'
    );
    expect(scrollVelocityComponents).toHaveLength(1);
  });

  it('fade gradients have correct positioning and dimensions', () => {
    render(<SectionDivider {...defaultProps} />);

    const section = document.querySelector('section');

    const leftFade = section!.querySelector(
      '.absolute.left-0.top-0.w-20.h-full'
    );
    const rightFade = section!.querySelector(
      '.absolute.right-0.top-0.w-20.h-full'
    );

    expect(leftFade).toBeInTheDocument();
    expect(rightFade).toBeInTheDocument();

    expect(leftFade).toHaveClass(
      'bg-gradient-to-r',
      'from-current',
      'to-transparent',
      'opacity-100'
    );
    expect(rightFade).toHaveClass(
      'bg-gradient-to-l',
      'from-current',
      'to-transparent',
      'opacity-100'
    );
  });
});
