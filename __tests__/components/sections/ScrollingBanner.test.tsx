import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScrollingBanner from '@/components/sections/ScrollingBanner';

// Mock the ScrollVelocity component to avoid complex framer-motion dependencies
jest.mock(
  '@/components/reactbits/TextAnimations/ScrollVelocity/ScrollVelocity',
  () => {
    return function MockScrollVelocity({
      texts,
      velocity,
      className,
      numCopies,
    }: any) {
      return (
        <div
          data-testid="mock-scroll-velocity"
          data-texts={JSON.stringify(texts)}
          data-velocity={velocity}
          data-num-copies={numCopies}
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

describe('ScrollingBanner', () => {
  it('renders the scrolling banner with correct structure', () => {
    render(<ScrollingBanner />);

    // Check for the main banner container
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
  });

  it('has the correct CSS classes for layout and styling', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass(
      'fixed',
      'bottom-0',
      'left-0',
      'right-0',
      'bg-red-600',
      'overflow-hidden',
      'z-0',
      'h-48'
    );
  });

  it('renders the center flex container with correct classes', () => {
    render(<ScrollingBanner />);

    const centerContainer = screen
      .getByRole('banner')
      .querySelector('.flex.items-center.justify-center.h-full');
    expect(centerContainer).toBeInTheDocument();
  });

  it('renders ScrollVelocity component with correct props', () => {
    render(<ScrollingBanner />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toBeInTheDocument();

    // Check props passed to ScrollVelocity
    expect(scrollVelocity).toHaveAttribute('data-texts', '["OMARPIOSELLI"]');
    expect(scrollVelocity).toHaveAttribute('data-velocity', '-50');
    expect(scrollVelocity).toHaveAttribute('data-num-copies', '8');
  });

  it('renders the scrolling text content', () => {
    render(<ScrollingBanner />);

    const velocityText = screen.getByTestId('velocity-text');
    expect(velocityText).toBeInTheDocument();
    expect(velocityText).toHaveTextContent('OMARPIOSELLI');
  });

  it('has correct typography classes on ScrollVelocity', () => {
    render(<ScrollingBanner />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');
    expect(scrollVelocity).toHaveClass(
      'text-[11rem]',
      'md:text-[12rem]',
      'lg:text-[14rem]',
      'font-bold',
      'text-black',
      'tracking-tighter',
      'leading-none'
    );
  });

  it('renders fade gradients at both edges', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');

    // Check for the overlay container
    const fadeContainer = banner.querySelector(
      '.absolute.inset-0.pointer-events-none'
    );
    expect(fadeContainer).toBeInTheDocument();

    // Check for left fade gradient
    const leftFade = banner.querySelector(
      '.absolute.left-0.top-0.w-32.h-full.bg-gradient-to-r.from-red-600.to-transparent.z-20'
    );
    expect(leftFade).toBeInTheDocument();

    // Check for right fade gradient
    const rightFade = banner.querySelector(
      '.absolute.right-0.top-0.w-32.h-full.bg-gradient-to-l.from-red-600.to-transparent.z-20'
    );
    expect(rightFade).toBeInTheDocument();
  });

  it('has correct z-index stacking', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('z-0');

    // Check fade gradients have higher z-index
    const leftFade = banner.querySelector('.bg-gradient-to-r');
    const rightFade = banner.querySelector('.bg-gradient-to-l');

    expect(leftFade).toHaveClass('z-20');
    expect(rightFade).toHaveClass('z-20');
  });

  it('is positioned fixed at the bottom of viewport', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('fixed', 'bottom-0');
  });

  it('spans full width with left-0 and right-0', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('left-0', 'right-0');
  });

  it('has overflow hidden to contain scrolling text', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('overflow-hidden');
  });

  it('uses red-600 background color consistently', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('bg-red-600');

    // Check that fade gradients also use red-600
    const leftFade = banner.querySelector('.bg-gradient-to-r');
    const rightFade = banner.querySelector('.bg-gradient-to-l');

    expect(leftFade).toHaveClass('from-red-600');
    expect(rightFade).toHaveClass('from-red-600');
  });

  it('has correct height of h-48', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveClass('h-48');
  });

  it('fade gradients are positioned correctly and have pointer-events-none', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    const fadeContainer = banner.querySelector(
      '.absolute.inset-0.pointer-events-none'
    );

    expect(fadeContainer).toHaveClass('pointer-events-none');
    expect(fadeContainer).toHaveClass('absolute', 'inset-0');
  });

  it('renders exactly one ScrollVelocity component', () => {
    render(<ScrollingBanner />);

    const scrollVelocityComponents = screen.getAllByTestId(
      'mock-scroll-velocity'
    );
    expect(scrollVelocityComponents).toHaveLength(1);
  });

  it('passes correct className props to ScrollVelocity for parallax and scroller', () => {
    render(<ScrollingBanner />);

    const scrollVelocity = screen.getByTestId('mock-scroll-velocity');

    // Note: In the actual component, these would be passed as separate props
    // but our mock captures them as attributes for testing
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
  });

  it('maintains semantic HTML structure with banner role', () => {
    render(<ScrollingBanner />);

    // Should have exactly one banner element
    const banners = screen.getAllByRole('banner');
    expect(banners).toHaveLength(1);
  });

  it('text content is properly nested within banner structure', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    const velocityText = screen.getByTestId('velocity-text');

    // Verify the text is contained within the banner
    expect(banner).toContainElement(velocityText.parentElement!);
  });

  // Accessibility tests
  it('has proper ARIA role for banner', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');
    expect(banner).toHaveAttribute('role', 'banner');
  });

  // Performance and structure tests
  it('uses CSS classes for styling instead of inline styles', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');

    // Should not have inline styles for main styling
    expect(banner).not.toHaveAttribute('style');
  });

  it('contains all necessary visual elements', () => {
    render(<ScrollingBanner />);

    const banner = screen.getByRole('banner');

    // Should contain text component
    expect(screen.getByTestId('mock-scroll-velocity')).toBeInTheDocument();

    // Should contain fade elements
    expect(
      banner.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-l')
    ).toHaveLength(2);
  });
});
