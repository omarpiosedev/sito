import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FeedbacksSection from '@/components/sections/FeedbacksSection';

// Mock framer-motion
const mockScrollYProgress = {
  onChange: jest.fn(() => jest.fn()), // return unsubscribe function
};

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, className, ref, ...props }: any) => (
      <div
        ref={ref}
        style={style}
        className={className}
        data-testid="motion-div"
        {...props}
      >
        {children}
      </div>
    ),
  },
  useScroll: jest.fn(() => ({
    scrollYProgress: mockScrollYProgress,
  })),
  useTransform: jest.fn(() => 1),
}));

// Mock StickyFeedbackCard component
jest.mock('@/components/ui/sticky-feedback-card', () => {
  return function MockStickyFeedbackCard({ feedback }: any) {
    const attributes: any = {
      'data-testid': `mock-sticky-feedback-card-${feedback.id}`,
      'data-feedback-id': feedback.id,
      'data-quote': feedback.quote,
      'data-author-name': feedback.author.name,
      'data-author-role': feedback.author.role,
      'data-rating': feedback.author.rating,
      'data-position-top': feedback.position.top,
    };

    // Only add position attributes if they exist
    if (feedback.position.left) {
      attributes['data-position-left'] = feedback.position.left;
    }
    if (feedback.position.right) {
      attributes['data-position-right'] = feedback.position.right;
    }

    return (
      <div {...attributes}>
        <div data-testid="feedback-quote">{feedback.quote}</div>
        <div data-testid="feedback-author">{feedback.author.name}</div>
        <div data-testid="feedback-role">{feedback.author.role}</div>
        <div data-testid="feedback-rating">{feedback.author.rating}</div>
      </div>
    );
  };
});

// Mock LogoCard component
jest.mock('@/components/ui/logo-card', () => {
  return function MockLogoCard({ LogoComponent }: any) {
    return (
      <div
        data-testid="mock-logo-card"
        data-logo-component={LogoComponent?.name || 'LogoComponent'}
      >
        <LogoComponent />
      </div>
    );
  };
});

// Mock tech logos
jest.mock('@/components/ui/tech-logos', () => ({
  logos: [
    {
      id: 1,
      component: function TestLogo1() {
        return <div data-testid="test-logo-1">Logo 1</div>;
      },
    },
    {
      id: 2,
      component: function TestLogo2() {
        return <div data-testid="test-logo-2">Logo 2</div>;
      },
    },
    {
      id: 3,
      component: function TestLogo3() {
        return <div data-testid="test-logo-3">Logo 3</div>;
      },
    },
    {
      id: 4,
      component: function TestLogo4() {
        return <div data-testid="test-logo-4">Logo 4</div>;
      },
    },
    {
      id: 5,
      component: function TestLogo5() {
        return <div data-testid="test-logo-5">Logo 5</div>;
      },
    },
    {
      id: 6,
      component: function TestLogo6() {
        return <div data-testid="test-logo-6">Logo 6</div>;
      },
    },
  ],
}));

// Mock LightRays component
jest.mock('@/components/blocks/Backgrounds/LightRays/LightRays', () => {
  return function MockLightRays({
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
    className,
  }: any) {
    return (
      <div
        data-testid="mock-light-rays"
        data-rays-origin={raysOrigin}
        data-rays-color={raysColor}
        data-rays-speed={raysSpeed}
        data-light-spread={lightSpread}
        data-ray-length={rayLength}
        data-pulsating={pulsating}
        data-fade-distance={fadeDistance}
        data-saturation={saturation}
        data-follow-mouse={followMouse}
        data-mouse-influence={mouseInfluence}
        data-noise-amount={noiseAmount}
        data-distortion={distortion}
        className={className}
      />
    );
  };
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
});

// Mock setTimeout
Object.defineProperty(global, 'setTimeout', {
  value: jest.fn(callback => {
    callback();
    return 1;
  }),
});

describe('FeedbacksSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockScrollYProgress.onChange.mockClear();
  });

  describe('Initial Rendering', () => {
    it('renders feedbacks section with correct structure', () => {
      render(<FeedbacksSection />);

      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      expect(section).toHaveAttribute('id', 'feedbacks');
      expect(section).toHaveClass('relative', 'bg-black');
      expect(section).toHaveStyle({ height: '900vh' });
    });

    it('renders fade overlay with correct styling', () => {
      render(<FeedbacksSection />);

      const fadeOverlay = screen.getByTestId('fade-overlay');
      expect(fadeOverlay).toBeInTheDocument();
      expect(fadeOverlay).toHaveClass(
        'absolute',
        'top-0',
        'left-0',
        'w-full',
        'h-32',
        'bg-gradient-to-b',
        'from-black',
        'to-transparent',
        'z-20',
        'pointer-events-none'
      );
    });

    it('renders title container with initial state', () => {
      render(<FeedbacksSection />);

      const titleContainer = screen.getByTestId('title-container');
      expect(titleContainer).toBeInTheDocument();
      expect(titleContainer).toHaveClass(
        'sticky',
        'top-0',
        'left-0',
        'w-full',
        'h-screen',
        'flex',
        'items-center',
        'justify-center',
        'z-0',
        'pointer-events-none'
      );
    });

    it('renders title text with correct styling', () => {
      render(<FeedbacksSection />);

      const trustedTitle = screen.getByText('TRUSTED');
      expect(trustedTitle).toBeInTheDocument();
      expect(trustedTitle).toHaveClass(
        'text-5xl',
        'md:text-6xl',
        'lg:text-7xl',
        'xl:text-8xl',
        'font-normal',
        'tracking-wider',
        'text-white'
      );
      expect(trustedTitle).toHaveStyle({
        fontFamily: 'Anton, sans-serif',
        letterSpacing: '0.05em',
      });

      const feedbacksTitle = screen.getByText('FEEDBACKS');
      expect(feedbacksTitle).toBeInTheDocument();
      expect(feedbacksTitle).toHaveClass(
        'text-5xl',
        'md:text-6xl',
        'lg:text-7xl',
        'xl:text-8xl',
        'font-normal',
        'tracking-wider',
        'text-white'
      );
      expect(feedbacksTitle).toHaveStyle({
        fontFamily: 'Anton, sans-serif',
        letterSpacing: '0.05em',
      });
    });

    it('does not render feedback cards initially', () => {
      render(<FeedbacksSection />);

      // Cards should not be visible initially
      expect(
        screen.queryByTestId('mock-sticky-feedback-card-1')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('mock-sticky-feedback-card-2')
      ).not.toBeInTheDocument();
    });

    it('renders logo cards section with correct structure', () => {
      render(<FeedbacksSection />);

      const logoCardsSection = screen.getByTestId('logo-cards-section');
      expect(logoCardsSection).toBeInTheDocument();
      expect(logoCardsSection).toHaveClass(
        'absolute',
        'bottom-0',
        'left-0',
        'w-full',
        'z-10'
      );
      expect(logoCardsSection).toHaveStyle({ height: '150vh' });

      const logoCardsContainer = screen.getByTestId('logo-cards-container');
      expect(logoCardsContainer).toBeInTheDocument();
      expect(logoCardsContainer).toHaveClass(
        'sticky',
        'top-0',
        'w-full',
        'h-screen',
        'flex',
        'items-center',
        'justify-center'
      );

      const logoGrid = screen.getByTestId('logo-grid');
      expect(logoGrid).toBeInTheDocument();
      expect(logoGrid).toHaveClass(
        'grid',
        'grid-cols-3',
        'gap-4',
        'md:gap-6',
        'w-full',
        'h-full',
        'px-6',
        'md:px-24',
        'py-8'
      );
    });
  });

  describe('Light Rays Component', () => {
    it('renders light rays background with initial inactive state', () => {
      render(<FeedbacksSection />);

      const lightRaysBackground = screen.getByTestId('light-rays-background');
      expect(lightRaysBackground).toBeInTheDocument();
      expect(lightRaysBackground).toHaveClass(
        'absolute',
        'inset-0',
        'w-full',
        'h-full',
        'transition-all',
        'duration-1000',
        'ease-out',
        'opacity-0',
        'scale-95'
      );
    });

    it('renders light rays component with correct props', () => {
      render(<FeedbacksSection />);

      const lightRays = screen.getByTestId('mock-light-rays');
      expect(lightRays).toBeInTheDocument();
      expect(lightRays).toHaveAttribute('data-rays-origin', 'top-center');
      expect(lightRays).toHaveAttribute('data-rays-color', '#ffffff');
      expect(lightRays).toHaveAttribute('data-rays-speed', '1.2');
      expect(lightRays).toHaveAttribute('data-light-spread', '0.6');
      expect(lightRays).toHaveAttribute('data-ray-length', '4.5');
      expect(lightRays).toHaveAttribute('data-pulsating', 'true');
      expect(lightRays).toHaveAttribute('data-fade-distance', '2.5');
      expect(lightRays).toHaveAttribute('data-saturation', '1');
      expect(lightRays).toHaveAttribute('data-follow-mouse', 'false');
      expect(lightRays).toHaveAttribute('data-mouse-influence', '0');
      expect(lightRays).toHaveAttribute('data-noise-amount', '0');
      expect(lightRays).toHaveAttribute('data-distortion', '0');
      expect(lightRays).toHaveClass('blur-sm');
    });

    it('renders light rays fade overlay', () => {
      render(<FeedbacksSection />);

      const fadeOverlay = screen.getByTestId('light-rays-fade-overlay');
      expect(fadeOverlay).toBeInTheDocument();
      expect(fadeOverlay).toHaveClass(
        'absolute',
        'inset-0',
        'bg-gradient-to-b',
        'from-transparent',
        'via-transparent',
        'to-black/60',
        'pointer-events-none'
      );
    });
  });

  describe('Logo Cards Rendering', () => {
    it('renders all logo cards', () => {
      render(<FeedbacksSection />);

      const logoCards = screen.getAllByTestId('mock-logo-card');
      expect(logoCards).toHaveLength(6);

      // Check individual logos are rendered
      expect(screen.getByTestId('test-logo-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-logo-2')).toBeInTheDocument();
      expect(screen.getByTestId('test-logo-3')).toBeInTheDocument();
      expect(screen.getByTestId('test-logo-4')).toBeInTheDocument();
      expect(screen.getByTestId('test-logo-5')).toBeInTheDocument();
      expect(screen.getByTestId('test-logo-6')).toBeInTheDocument();
    });

    it('passes correct logo components to LogoCard', () => {
      render(<FeedbacksSection />);

      const logoCards = screen.getAllByTestId('mock-logo-card');

      // Check that different logo components are passed
      expect(logoCards[0]).toHaveAttribute('data-logo-component', 'TestLogo1');
      expect(logoCards[1]).toHaveAttribute('data-logo-component', 'TestLogo2');
      expect(logoCards[2]).toHaveAttribute('data-logo-component', 'TestLogo3');
      expect(logoCards[3]).toHaveAttribute('data-logo-component', 'TestLogo4');
      expect(logoCards[4]).toHaveAttribute('data-logo-component', 'TestLogo5');
      expect(logoCards[5]).toHaveAttribute('data-logo-component', 'TestLogo6');
    });
  });

  describe('Scroll Integration and Framer Motion', () => {
    it('initializes useScroll hook with correct configuration', () => {
      const { useScroll } = require('framer-motion');

      render(<FeedbacksSection />);

      expect(useScroll).toHaveBeenCalledWith({
        target: expect.any(Object),
        offset: ['start start', 'end end'],
      });
    });

    it('initializes useTransform hooks for title animations', () => {
      const { useTransform } = require('framer-motion');

      render(<FeedbacksSection />);

      expect(useTransform).toHaveBeenCalledWith(
        mockScrollYProgress,
        [0.88, 0.92],
        [1, 0]
      );
      expect(useTransform).toHaveBeenCalledWith(
        mockScrollYProgress,
        [0.86, 0.92],
        [0, -80]
      );
    });

    it('registers scroll progress change listener', () => {
      render(<FeedbacksSection />);

      expect(mockScrollYProgress.onChange).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it('applies motion styles to title container', () => {
      render(<FeedbacksSection />);

      const titleContainer = screen.getByTestId('title-container');
      expect(titleContainer).toHaveStyle({
        opacity: 1,
      });
      // The y transform is handled by framer-motion, not directly as CSS
    });
  });

  describe('Scroll Progress Effects', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('handles scroll progress change for title sticky behavior', () => {
      // Mock useState to track state changes
      const setTitleSticky = jest.fn();
      jest.spyOn(React, 'useState').mockImplementation(initial => {
        if (typeof initial === 'boolean') {
          return [initial, setTitleSticky];
        }
        return [initial, jest.fn()];
      });

      render(<FeedbacksSection />);

      // Get the callback that was registered
      const scrollCallback = mockScrollYProgress.onChange.mock.calls[0][0];

      // Trigger scroll progress to 95% (should disable sticky)
      act(() => {
        scrollCallback(0.95);
      });

      expect(setTitleSticky).toHaveBeenCalledWith(false);

      // Trigger scroll progress back to less than 95% (should enable sticky)
      act(() => {
        scrollCallback(0.5);
      });

      expect(setTitleSticky).toHaveBeenCalledWith(true);

      jest.restoreAllMocks();
    });

    it('shows title container positioning logic', () => {
      // Component renders with initial state - should be tested structurally
      render(<FeedbacksSection />);

      const titleContainer = screen.getByTestId('title-container');
      // Initially sticky is true, so should have sticky class
      expect(titleContainer).toHaveClass('sticky');

      // Test that the component handles different scroll positions
      const scrollCallback = mockScrollYProgress.onChange.mock.calls[0][0];
      expect(typeof scrollCallback).toBe('function');
    });
  });

  describe('IntersectionObserver Integration', () => {
    let mockObserve: jest.Mock;
    let mockUnobserve: jest.Mock;
    let observerCallback: (entries: IntersectionObserverEntry[]) => void;

    beforeEach(() => {
      mockObserve = jest.fn();
      mockUnobserve = jest.fn();

      mockIntersectionObserver.mockImplementation(callback => {
        observerCallback = callback;
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: jest.fn(),
        };
      });

      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('creates IntersectionObserver with correct configuration', () => {
      render(<FeedbacksSection />);

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: [0, 0.5, 0.9, 1],
          rootMargin: '0px',
        }
      );
    });

    it('observes title ref when available', () => {
      render(<FeedbacksSection />);

      expect(mockObserve).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('activates cards and light rays when intersection ratio >= 0.9', () => {
      render(<FeedbacksSection />);

      // Initially no cards should be visible
      expect(
        screen.queryByTestId('mock-sticky-feedback-card-1')
      ).not.toBeInTheDocument();

      // Initially light rays should be inactive
      const lightRaysBackground = screen.getByTestId('light-rays-background');
      expect(lightRaysBackground).toHaveClass('opacity-0', 'scale-95');

      // Trigger intersection with high ratio
      act(() => {
        observerCallback([
          {
            intersectionRatio: 0.9,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      // Cards should now be visible
      expect(
        screen.getByTestId('mock-sticky-feedback-card-1')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('mock-sticky-feedback-card-2')
      ).toBeInTheDocument();

      // Advance timers to trigger light rays activation
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Light rays should now be active
      const updatedLightRaysBackground = screen.getByTestId(
        'light-rays-background'
      );
      expect(updatedLightRaysBackground).toHaveClass('opacity-95', 'scale-100');
    });

    it('deactivates cards and light rays when intersection ratio < 0.9', () => {
      render(<FeedbacksSection />);

      // First activate
      act(() => {
        observerCallback([
          {
            intersectionRatio: 0.95,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Verify activation
      expect(
        screen.getByTestId('mock-sticky-feedback-card-1')
      ).toBeInTheDocument();
      expect(screen.getByTestId('light-rays-background')).toHaveClass(
        'opacity-95',
        'scale-100'
      );

      // Then deactivate
      act(() => {
        observerCallback([
          {
            intersectionRatio: 0.5,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      // Cards should be hidden
      expect(
        screen.queryByTestId('mock-sticky-feedback-card-1')
      ).not.toBeInTheDocument();

      // Light rays should be inactive
      const lightRaysBackground = screen.getByTestId('light-rays-background');
      expect(lightRaysBackground).toHaveClass('opacity-0', 'scale-95');
    });

    it('handles intersection changes correctly', () => {
      render(<FeedbacksSection />);

      // Test exact threshold
      act(() => {
        observerCallback([
          {
            intersectionRatio: 0.9,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      expect(
        screen.getByTestId('mock-sticky-feedback-card-1')
      ).toBeInTheDocument();

      // Test below threshold
      act(() => {
        observerCallback([
          {
            intersectionRatio: 0.89,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      expect(
        screen.queryByTestId('mock-sticky-feedback-card-1')
      ).not.toBeInTheDocument();
    });
  });

  describe('Feedback Cards Rendering', () => {
    let observerCallback: (entries: IntersectionObserverEntry[]) => void;

    beforeEach(() => {
      mockIntersectionObserver.mockImplementation(callback => {
        observerCallback = callback;
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
        };
      });
    });

    it('renders all feedback cards when visible', () => {
      render(<FeedbacksSection />);

      // Activate cards
      act(() => {
        observerCallback([
          {
            intersectionRatio: 0.9,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      // Check that all 9 feedback cards are rendered
      for (let i = 1; i <= 9; i++) {
        expect(
          screen.getByTestId(`mock-sticky-feedback-card-${i}`)
        ).toBeInTheDocument();
      }
    });

    it('passes correct feedback data to StickyFeedbackCard components', () => {
      render(<FeedbacksSection />);

      // Activate cards
      act(() => {
        observerCallback([
          {
            intersectionRatio: 0.9,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      // Test first feedback card
      const firstCard = screen.getByTestId('mock-sticky-feedback-card-1');
      expect(firstCard).toHaveAttribute('data-feedback-id', '1');
      expect(firstCard).toHaveAttribute(
        'data-quote',
        'The landing page he built for my business is fast, modern, and works perfectly on any device. He even took care of the SEO and added subtle animations that make it feel premium.'
      );
      expect(firstCard).toHaveAttribute('data-author-name', 'ELENA F.');
      expect(firstCard).toHaveAttribute(
        'data-author-role',
        'SMALL BUSINESS OWNER'
      );
      expect(firstCard).toHaveAttribute('data-rating', '5');
      expect(firstCard).toHaveAttribute('data-position-top', '0%');
      expect(firstCard).toHaveAttribute('data-position-left', '20%');

      // Test a card with right positioning
      const secondCard = screen.getByTestId('mock-sticky-feedback-card-2');
      expect(secondCard).toHaveAttribute('data-position-top', '7%');
      expect(secondCard).toHaveAttribute('data-position-right', '18%');
      expect(secondCard).toHaveAttribute('data-rating', '4.5');

      // Check that feedback content is rendered (use getAllByTestId since there are multiple)
      const quotes = screen.getAllByTestId('feedback-quote');
      expect(quotes[0]).toHaveTextContent(
        'The landing page he built for my business is fast, modern, and works perfectly on any device. He even took care of the SEO and added subtle animations that make it feel premium.'
      );

      const authors = screen.getAllByTestId('feedback-author');
      expect(authors[0]).toHaveTextContent('ELENA F.');

      const roles = screen.getAllByTestId('feedback-role');
      expect(roles[0]).toHaveTextContent('SMALL BUSINESS OWNER');

      const ratings = screen.getAllByTestId('feedback-rating');
      expect(ratings[0]).toHaveTextContent('5');
    });

    it('renders cards with various positioning configurations', () => {
      render(<FeedbacksSection />);

      // Activate cards
      act(() => {
        observerCallback([
          {
            intersectionRatio: 0.9,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      // Test cards with left positioning
      const cardWithLeft = screen.getByTestId('mock-sticky-feedback-card-3');
      expect(cardWithLeft).toHaveAttribute('data-position-left', '15%');
      expect(cardWithLeft).not.toHaveAttribute('data-position-right');

      // Test cards with right positioning
      const cardWithRight = screen.getByTestId('mock-sticky-feedback-card-4');
      expect(cardWithRight).toHaveAttribute('data-position-right', '25%');
      expect(cardWithRight).not.toHaveAttribute('data-position-left');
    });

    it('renders cards with different ratings and content', () => {
      render(<FeedbacksSection />);

      // Activate cards
      act(() => {
        observerCallback([
          {
            intersectionRatio: 0.9,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      // Test different rating values
      expect(screen.getByTestId('mock-sticky-feedback-card-1')).toHaveAttribute(
        'data-rating',
        '5'
      );
      expect(screen.getByTestId('mock-sticky-feedback-card-2')).toHaveAttribute(
        'data-rating',
        '4.5'
      );
      expect(screen.getByTestId('mock-sticky-feedback-card-5')).toHaveAttribute(
        'data-rating',
        '4'
      );

      // Test different authors and roles
      expect(screen.getByTestId('mock-sticky-feedback-card-6')).toHaveAttribute(
        'data-author-name',
        'DANIEL P.'
      );
      expect(screen.getByTestId('mock-sticky-feedback-card-6')).toHaveAttribute(
        'data-author-role',
        'TECH ENTHUSIAST'
      );

      expect(screen.getByTestId('mock-sticky-feedback-card-7')).toHaveAttribute(
        'data-author-name',
        'LAURA M.'
      );
      expect(screen.getByTestId('mock-sticky-feedback-card-7')).toHaveAttribute(
        'data-author-role',
        'PHOTOGRAPHER'
      );
    });
  });

  describe('Component Cleanup', () => {
    it('unsubscribes from scroll progress changes on unmount', () => {
      const mockUnsubscribe = jest.fn();
      mockScrollYProgress.onChange.mockReturnValue(mockUnsubscribe);

      const { unmount } = render(<FeedbacksSection />);

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it('unobserves title ref on unmount', () => {
      const mockUnobserve = jest.fn();
      mockIntersectionObserver.mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: mockUnobserve,
        disconnect: jest.fn(),
      }));

      const { unmount } = render(<FeedbacksSection />);

      unmount();

      expect(mockUnobserve).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });

    it('handles cleanup when titleRef is null', () => {
      // Mock useRef to return null for titleRef
      const originalUseRef = React.useRef;
      let refCallCount = 0;
      jest.spyOn(React, 'useRef').mockImplementation(initialValue => {
        refCallCount++;
        // Return null for titleRef (second call)
        if (refCallCount === 2) {
          return { current: null };
        }
        return originalUseRef(initialValue);
      });

      expect(() => {
        const { unmount } = render(<FeedbacksSection />);
        unmount();
      }).not.toThrow();

      jest.restoreAllMocks();
    });
  });

  describe('Light Rays Activation Timing', () => {
    beforeEach(() => {
      jest.useFakeTimers();

      mockIntersectionObserver.mockImplementation(callback => {
        return {
          observe: jest.fn(),
          unobserve: jest.fn(),
          disconnect: jest.fn(),
          _callback: callback,
        };
      });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('activates light rays with delay after cards become visible', () => {
      render(<FeedbacksSection />);

      const observerInstance = mockIntersectionObserver.mock.results[0].value;

      // Trigger intersection
      act(() => {
        observerInstance._callback([
          {
            intersectionRatio: 0.9,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      // Light rays should still be inactive immediately
      expect(screen.getByTestId('light-rays-background')).toHaveClass(
        'opacity-0',
        'scale-95'
      );

      // Advance timer by 300ms
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Light rays should now be active
      expect(screen.getByTestId('light-rays-background')).toHaveClass(
        'opacity-95',
        'scale-100'
      );
    });

    it('immediately deactivates light rays when cards become invisible', () => {
      render(<FeedbacksSection />);

      const observerInstance = mockIntersectionObserver.mock.results[0].value;

      // First activate
      act(() => {
        observerInstance._callback([
          {
            intersectionRatio: 0.9,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Verify activation
      expect(screen.getByTestId('light-rays-background')).toHaveClass(
        'opacity-95',
        'scale-100'
      );

      // Then deactivate
      act(() => {
        observerInstance._callback([
          {
            intersectionRatio: 0.5,
            isIntersecting: true,
          } as IntersectionObserverEntry,
        ]);
      });

      // Light rays should be immediately inactive (no delay on deactivation)
      expect(screen.getByTestId('light-rays-background')).toHaveClass(
        'opacity-0',
        'scale-95'
      );
    });
  });

  describe('Responsive Design', () => {
    it('has responsive classes for title text', () => {
      render(<FeedbacksSection />);

      const trustedTitle = screen.getByText('TRUSTED');
      const feedbacksTitle = screen.getByText('FEEDBACKS');

      [trustedTitle, feedbacksTitle].forEach(title => {
        expect(title).toHaveClass(
          'text-5xl',
          'md:text-6xl',
          'lg:text-7xl',
          'xl:text-8xl'
        );
      });
    });

    it('has responsive classes for logo grid', () => {
      render(<FeedbacksSection />);

      const logoGrid = screen.getByTestId('logo-grid');
      expect(logoGrid).toHaveClass('gap-4', 'md:gap-6', 'px-6', 'md:px-24');
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<FeedbacksSection />);

      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('id', 'feedbacks');
    });

    it('has proper heading hierarchy', () => {
      render(<FeedbacksSection />);

      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('TRUSTED');
      expect(headings[1]).toHaveTextContent('FEEDBACKS');
    });

    it('uses pointer-events-none where appropriate', () => {
      render(<FeedbacksSection />);

      expect(screen.getByTestId('fade-overlay')).toHaveClass(
        'pointer-events-none'
      );
      expect(screen.getByTestId('title-container')).toHaveClass(
        'pointer-events-none'
      );
      expect(screen.getByTestId('light-rays-fade-overlay')).toHaveClass(
        'pointer-events-none'
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles component with no intersection changes', () => {
      render(<FeedbacksSection />);

      expect(screen.getByRole('region')).toBeInTheDocument();
      expect(
        screen.queryByTestId('mock-sticky-feedback-card-1')
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('light-rays-background')).toHaveClass(
        'opacity-0'
      );
    });

    it('handles rapid intersection changes', () => {
      render(<FeedbacksSection />);

      const observerInstance = mockIntersectionObserver.mock.results[0].value;

      expect(() => {
        act(() => {
          // Rapid changes
          observerInstance._callback([
            { intersectionRatio: 0.9 } as IntersectionObserverEntry,
          ]);
          observerInstance._callback([
            { intersectionRatio: 0.5 } as IntersectionObserverEntry,
          ]);
          observerInstance._callback([
            { intersectionRatio: 0.95 } as IntersectionObserverEntry,
          ]);
          observerInstance._callback([
            { intersectionRatio: 0.1 } as IntersectionObserverEntry,
          ]);
        });
      }).not.toThrow();
    });

    it('renders all required test ids', () => {
      render(<FeedbacksSection />);

      expect(screen.getByTestId('fade-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('title-container')).toBeInTheDocument();
      expect(screen.getByTestId('light-rays-background')).toBeInTheDocument();
      expect(screen.getByTestId('mock-light-rays')).toBeInTheDocument();
      expect(screen.getByTestId('light-rays-fade-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('logo-cards-section')).toBeInTheDocument();
      expect(screen.getByTestId('logo-cards-container')).toBeInTheDocument();
      expect(screen.getByTestId('logo-grid')).toBeInTheDocument();
    });

    it('handles all scroll progress values correctly', () => {
      render(<FeedbacksSection />);

      const scrollCallback = mockScrollYProgress.onChange.mock.calls[0][0];

      // Test various scroll progress values
      const testValues = [0, 0.25, 0.5, 0.75, 0.9, 0.95, 0.96, 1.0];

      testValues.forEach(value => {
        expect(() => {
          act(() => {
            scrollCallback(value);
          });
        }).not.toThrow();
      });
    });
  });
});
