import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Capabilities from '@/components/sections/Capabilities';

// Mock IntersectionObserver
const mockIntersectionObserver = jest
  .fn()
  .mockImplementation((callback, options) => {
    const instance = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };

    // Store callback for manual triggering in tests
    instance.callback = callback;
    instance.options = options;

    return instance;
  });

global.IntersectionObserver = mockIntersectionObserver;

// Mock CardSwap and Card components
jest.mock('@/components/reactbits/Components/CardSwap/CardSwap', () => {
  return {
    __esModule: true,
    default: function MockCardSwap({
      width,
      height,
      cardDistance,
      verticalDistance,
      mobileCardDistance,
      mobileVerticalDistance,
      delay,
      pauseOnHover,
      skewAmount,
      mobileSkewAmount,
      easing,
      children,
    }: any) {
      return (
        <div
          data-testid="mock-card-swap"
          data-width={width}
          data-height={height}
          data-card-distance={cardDistance}
          data-vertical-distance={verticalDistance}
          data-mobile-card-distance={mobileCardDistance}
          data-mobile-vertical-distance={mobileVerticalDistance}
          data-delay={delay}
          data-pause-on-hover={pauseOnHover}
          data-skew-amount={skewAmount}
          data-mobile-skew-amount={mobileSkewAmount}
          data-easing={easing}
        >
          {children}
        </div>
      );
    },
    Card: function MockCard({ className, children, ...props }: any) {
      return (
        <div data-testid="mock-card" className={className} {...props}>
          {children}
        </div>
      );
    },
  };
});

describe('Capabilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the capabilities section with correct structure', () => {
    render(<Capabilities />);

    const capabilitiesSection = document.querySelector('#capabilities');
    expect(capabilitiesSection).toBeInTheDocument();
    expect(capabilitiesSection).toHaveClass(
      'w-full',
      'min-h-screen',
      'relative',
      'bg-black',
      'z-20',
      'capabilities-section'
    );
  });

  it('has correct inline styles for performance optimization', () => {
    render(<Capabilities />);

    const capabilitiesSection = document.querySelector('#capabilities');
    expect(capabilitiesSection).toHaveStyle({
      transform: 'translateZ(0)',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
    });
  });

  it('renders main heading "SOLUTIONS"', () => {
    render(<Capabilities />);

    const solutionsHeading = screen.getByText('SOLUTIONS');
    expect(solutionsHeading).toBeInTheDocument();
    expect(solutionsHeading).toHaveClass(
      'text-6xl',
      'md:text-7xl',
      'lg:text-8xl',
      'xl:text-9xl',
      'font-bold',
      'tracking-wide',
      'text-white'
    );
  });

  it('renders secondary heading "I PROVIDE"', () => {
    render(<Capabilities />);

    const provideHeading = screen.getByText('I PROVIDE');
    expect(provideHeading).toBeInTheDocument();
    expect(provideHeading).toHaveClass(
      'text-6xl',
      'md:text-7xl',
      'lg:text-8xl',
      'xl:text-9xl',
      'font-bold',
      'tracking-wide',
      'text-white'
    );
  });

  it('headings use Anton font family', () => {
    render(<Capabilities />);

    const solutionsHeading = screen.getByText('SOLUTIONS');
    const provideHeading = screen.getByText('I PROVIDE');

    expect(solutionsHeading).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
    expect(provideHeading).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
  });

  it('renders CardSwap component with correct props', () => {
    render(<Capabilities />);

    const cardSwap = screen.getByTestId('mock-card-swap');
    expect(cardSwap).toBeInTheDocument();

    expect(cardSwap).toHaveAttribute('data-width', '350');
    expect(cardSwap).toHaveAttribute('data-height', '450');
    expect(cardSwap).toHaveAttribute('data-card-distance', '60');
    expect(cardSwap).toHaveAttribute('data-vertical-distance', '70');
    expect(cardSwap).toHaveAttribute('data-mobile-card-distance', '0');
    expect(cardSwap).toHaveAttribute('data-mobile-vertical-distance', '15');
    expect(cardSwap).toHaveAttribute('data-delay', '3000');
    expect(cardSwap).toHaveAttribute('data-pause-on-hover', 'false');
    expect(cardSwap).toHaveAttribute('data-skew-amount', '5');
    expect(cardSwap).toHaveAttribute('data-mobile-skew-amount', '0');
    expect(cardSwap).toHaveAttribute('data-easing', 'elastic');
  });

  it('renders all capability cards', () => {
    render(<Capabilities />);

    const cards = screen.getAllByTestId('mock-card');
    expect(cards).toHaveLength(4); // Strategy, Design, Development, Production
  });

  it('renders Strategy capability card with correct content', () => {
    render(<Capabilities />);

    // Check card number and title
    expect(screen.getByText('/ 01')).toBeInTheDocument();
    expect(screen.getByText('STRATEGY')).toBeInTheDocument();

    // Check strategy items
    expect(screen.getByText('DISCOVERY')).toBeInTheDocument();
    expect(screen.getByText('RESEARCH')).toBeInTheDocument();
    expect(screen.getByText('ANALYSIS')).toBeInTheDocument();
    expect(screen.getByText('CONSULTATION')).toBeInTheDocument();
    expect(screen.getByText('OPTIMIZATION')).toBeInTheDocument();
  });

  it('renders Design capability card with correct content', () => {
    render(<Capabilities />);

    // Check card number and title
    expect(screen.getByText('/ 02')).toBeInTheDocument();
    expect(screen.getByText('DESIGN')).toBeInTheDocument();

    // Check design items
    expect(screen.getByText('BRANDING')).toBeInTheDocument();
    expect(screen.getByText('UI/UX')).toBeInTheDocument();
    expect(screen.getByText('VISUAL IDENTITY')).toBeInTheDocument();
    expect(screen.getByText('GRAPHICS')).toBeInTheDocument();
    expect(screen.getByText('ILLUSTRATION')).toBeInTheDocument();
  });

  it('renders Development capability card with correct content', () => {
    render(<Capabilities />);

    // Check card number and title
    expect(screen.getByText('/ 03')).toBeInTheDocument();
    expect(screen.getByText('DEVELOPMENT')).toBeInTheDocument();

    // Check development items
    expect(screen.getByText('FULL STACK')).toBeInTheDocument();
    expect(screen.getByText('FRONTEND')).toBeInTheDocument();
    expect(screen.getByText('API INTEGRATION')).toBeInTheDocument();
    expect(screen.getByText('TESTING')).toBeInTheDocument();
    expect(screen.getByText('DEPLOYMENT')).toBeInTheDocument();
  });

  it('renders Production capability card with correct content', () => {
    render(<Capabilities />);

    // Check card number and title
    expect(screen.getByText('/ 04')).toBeInTheDocument();
    expect(screen.getByText('PRODUCTION')).toBeInTheDocument();

    // Check production items
    expect(screen.getByText('3D MODELING')).toBeInTheDocument();
    expect(screen.getByText('VR EXPERIENCES')).toBeInTheDocument();
    expect(screen.getByText('VISUALIZATION')).toBeInTheDocument();
    expect(screen.getByText('MOTION GRAPHICS')).toBeInTheDocument();
    expect(screen.getByText('ANIMATIONS')).toBeInTheDocument();
  });

  it('renders Strategy card with correct video background', () => {
    render(<Capabilities />);

    const strategyVideos = screen.getAllByLabelText(
      'Strategy background animation video'
    );
    expect(strategyVideos).toHaveLength(1);

    const video = strategyVideos[0];
    expect(video).toHaveProperty('autoplay');
    expect(video).toHaveProperty('muted');
    expect(video).toHaveProperty('loop');
    expect(video).toHaveProperty('playsInline');
    expect(video).toHaveClass(
      'absolute',
      'inset-0',
      'w-full',
      'h-full',
      'object-cover',
      'z-0'
    );

    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', '/mystical-orb-video.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('renders Design card with correct video background', () => {
    render(<Capabilities />);

    const designVideos = screen.getAllByLabelText(
      'Design background animation video'
    );
    expect(designVideos).toHaveLength(1);

    const video = designVideos[0];
    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', '/reaching-light-video.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('renders Development card with correct video background', () => {
    render(<Capabilities />);

    const developmentVideos = screen.getAllByLabelText(
      'Development background animation video'
    );
    expect(developmentVideos).toHaveLength(1);

    const video = developmentVideos[0];
    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', '/mystical-red-tree-video.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('renders Production card with correct video background', () => {
    render(<Capabilities />);

    const productionVideos = screen.getAllByLabelText(
      'Production background animation video'
    );
    expect(productionVideos).toHaveLength(1);

    const video = productionVideos[0];
    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', '/red-lit-introspection-video.mp4');
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('card titles use Anton font family', () => {
    render(<Capabilities />);

    const strategyTitle = screen.getByText('STRATEGY');
    expect(strategyTitle).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
  });

  it('card items have orange bullet points', () => {
    render(<Capabilities />);

    const capabilitiesSection = document.querySelector('#capabilities');
    const bulletPoints = capabilitiesSection!.querySelectorAll(
      '.w-2.h-2.bg-orange-500.rounded-full'
    );

    // Each card has 5 items, and we have 4 cards = 20 bullet points
    expect(bulletPoints).toHaveLength(20);
  });

  it('capability numbers have orange color', () => {
    render(<Capabilities />);

    const numbers = screen.getAllByText(/\/ 0[1-4]/);
    numbers.forEach(number => {
      expect(number).toHaveClass('text-orange-500');
    });
  });

  it('sets up IntersectionObserver on mount', () => {
    render(<Capabilities />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '0px 0px 0px 0px',
      }
    );

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    expect(observerInstance.observe).toHaveBeenCalled();
  });

  it('handles intersection observer entry when entering viewport', async () => {
    render(<Capabilities />);

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    const callback = observerInstance.callback;

    // Simulate element entering viewport
    act(() => {
      callback([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      // Check that headings have visible animation classes
      const solutionsHeading = screen.getByText('SOLUTIONS');
      expect(solutionsHeading).toHaveClass(
        'opacity-100',
        'translate-x-0',
        'translate-y-0'
      );
    });
  });

  it('handles intersection observer entry when leaving viewport', async () => {
    render(<Capabilities />);

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    const callback = observerInstance.callback;

    // First enter viewport
    act(() => {
      callback([{ isIntersecting: true }]);
    });

    // Then leave viewport
    act(() => {
      callback([{ isIntersecting: false }]);
    });

    // Wait for timeout to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 350));
    });
  });

  it('cleans up intersection observer on unmount', () => {
    const { unmount } = render(<Capabilities />);

    const observerInstance = mockIntersectionObserver.mock.results[0].value;

    unmount();

    expect(observerInstance.unobserve).toHaveBeenCalled();
  });

  it('has correct responsive layout classes', () => {
    render(<Capabilities />);

    const capabilitiesSection = document.querySelector('#capabilities');
    expect(capabilitiesSection).toHaveClass(
      'px-6',
      'md:px-12',
      'lg:px-24',
      'py-16'
    );

    // Check main content container
    const mainContent = capabilitiesSection!.querySelector(
      '.flex.flex-col.lg\\:flex-row'
    );
    expect(mainContent).toBeInTheDocument();
  });

  it('header section has responsive text alignment', () => {
    render(<Capabilities />);

    const headerSection = document.querySelector('.text-center.lg\\:text-left');
    expect(headerSection).toBeInTheDocument();
  });

  it('card container has correct height classes', () => {
    render(<Capabilities />);

    const cardContainer = document.querySelector(
      '.h-\\[400px\\].md\\:h-\\[500px\\].lg\\:h-\\[600px\\]'
    );
    expect(cardContainer).toBeInTheDocument();
  });

  it('cards have gradient background styling', () => {
    render(<Capabilities />);

    const cards = screen.getAllByTestId('mock-card');
    cards.forEach(card => {
      expect(card).toHaveClass(
        'bg-gradient-to-br',
        'from-gray-900/90',
        'to-black/95',
        'backdrop-blur-sm',
        'border',
        'border-gray-800/50',
        'overflow-hidden'
      );
    });
  });

  it('uses semantic section element', () => {
    render(<Capabilities />);

    const section = document.querySelector('section#capabilities');
    expect(section).toBeInTheDocument();
    expect(section!.tagName).toBe('SECTION');
  });

  it('has proper z-index layering', () => {
    render(<Capabilities />);

    const capabilitiesSection = document.querySelector('#capabilities');
    expect(capabilitiesSection).toHaveClass('z-20');

    // Check that video containers have correct z-index positioning
    const capabilitiesContainer = document.querySelector('#capabilities');
    const videoContainers = capabilitiesContainer!.querySelectorAll('.z-0');
    expect(videoContainers.length).toBeGreaterThan(0);
  });

  it('content is positioned over video backgrounds', () => {
    render(<Capabilities />);

    // Content should have z-10 to be above video backgrounds (z-0)
    const capabilitiesContainer = document.querySelector('#capabilities');
    const contentContainers =
      capabilitiesContainer!.querySelectorAll('.relative.z-10');
    expect(contentContainers.length).toBeGreaterThan(0);
  });

  it('applies hw-accelerated class for performance', () => {
    render(<Capabilities />);

    const hwAcceleratedElements = document.querySelectorAll('.hw-accelerated');
    expect(hwAcceleratedElements.length).toBeGreaterThan(0);
  });

  it('has correct transition timing for animations', () => {
    render(<Capabilities />);

    const solutionsHeading = screen.getByText('SOLUTIONS');
    expect(solutionsHeading).toHaveClass('duration-1200');

    const provideHeading = screen.getByText('I PROVIDE');
    expect(provideHeading).toHaveClass('duration-1400');
  });

  it('applies correct transition delays based on visibility state', () => {
    render(<Capabilities />);

    const solutionsHeading = screen.getByText('SOLUTIONS');
    // Default state (not visible) should have no delay
    expect(solutionsHeading).toHaveStyle({ transitionDelay: '0s' });

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    const callback = observerInstance.callback;

    // Simulate element entering viewport
    act(() => {
      callback([{ isIntersecting: true }]);
    });

    waitFor(() => {
      // When visible, should have delay
      expect(solutionsHeading).toHaveStyle({ transitionDelay: '0.2s' });
    });
  });

  it('renders exactly 4 capability cards', () => {
    render(<Capabilities />);

    const cards = screen.getAllByTestId('mock-card');
    expect(cards).toHaveLength(4);
  });

  it('all video elements have required attributes for autoplay', () => {
    render(<Capabilities />);

    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      expect(video).toHaveProperty('autoplay');
      expect(video).toHaveProperty('muted');
      expect(video).toHaveProperty('loop');
      expect(video).toHaveProperty('playsInline');
    });
  });

  it('maintains proper content spacing', () => {
    render(<Capabilities />);

    const capabilitiesSection = document.querySelector('#capabilities');

    // Check for gap classes in main layout
    const mainLayout = capabilitiesSection!.querySelector('.gap-8.lg\\:gap-16');
    expect(mainLayout).toBeInTheDocument();

    // Check for margin adjustments
    const marginAdjusted =
      capabilitiesSection!.querySelector('.-mt-8.lg\\:mt-0');
    expect(marginAdjusted).toBeInTheDocument();
  });
});
