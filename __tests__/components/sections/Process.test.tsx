import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Process from '@/components/sections/Process';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, className, ref, ...props }: any) => (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
  useScroll: jest.fn(() => ({
    scrollYProgress: { get: () => 0, on: jest.fn(), destroy: jest.fn() },
  })),
  useTransform: jest.fn((input, inputRange, outputRange, options) => {
    // Mock transform that returns the first output value
    return {
      get: () => outputRange[0],
      on: jest.fn(),
      destroy: jest.fn(),
    };
  }),
  useSpring: jest.fn((input, config) => {
    // Mock spring that returns the input value
    return {
      get: () => (typeof input?.get === 'function' ? input.get() : input),
      on: jest.fn(),
      destroy: jest.fn(),
    };
  }),
}));

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

describe('Process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the process section with correct structure', () => {
    render(<Process />);

    const processSection = document.querySelector('#process');
    expect(processSection).toBeInTheDocument();
    expect(processSection).toHaveAttribute('role', 'main');
  });

  it('has correct section classes and styling', () => {
    render(<Process />);

    const processSection = document.querySelector('#process');
    expect(processSection).toHaveClass(
      'w-full',
      'bg-black',
      'text-white',
      'relative',
      'overflow-hidden',
      'pt-16'
    );
  });

  it('renders main heading "UNIQUE"', () => {
    render(<Process />);

    const uniqueHeading = screen.getByText('UNIQUE');
    expect(uniqueHeading).toBeInTheDocument();
    expect(uniqueHeading).toHaveClass(
      'text-6xl',
      'md:text-7xl',
      'lg:text-8xl',
      'xl:text-9xl',
      'font-bold',
      'tracking-wide',
      'text-white'
    );
  });

  it('renders secondary heading "ANGLE"', () => {
    render(<Process />);

    const angleHeading = screen.getByText('ANGLE');
    expect(angleHeading).toBeInTheDocument();
    expect(angleHeading).toHaveClass(
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
    render(<Process />);

    const uniqueHeading = screen.getByText('UNIQUE');
    const angleHeading = screen.getByText('ANGLE');

    expect(uniqueHeading).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
    expect(angleHeading).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
  });

  it('renders cards container with correct test IDs', () => {
    render(<Process />);

    const cardsContainer = screen.getByTestId('cards-container');
    expect(cardsContainer).toBeInTheDocument();
    expect(cardsContainer).toHaveClass(
      'relative',
      'px-6',
      'md:px-12',
      'lg:px-24',
      'pb-24',
      'z-10',
      'will-change-contents'
    );
  });

  it('renders mobile layout container', () => {
    render(<Process />);

    const mobileLayout = screen.getByTestId('mobile-layout');
    expect(mobileLayout).toBeInTheDocument();
    expect(mobileLayout).toHaveClass('block', 'md:hidden', 'space-y-8');
  });

  it('renders desktop layout container', () => {
    render(<Process />);

    const desktopLayout = screen.getByTestId('desktop-layout');
    expect(desktopLayout).toBeInTheDocument();
    expect(desktopLayout).toHaveClass(
      'hidden',
      'md:grid',
      'grid-cols-2',
      'gap-8'
    );
  });

  it('renders desktop left and right columns', () => {
    render(<Process />);

    const leftColumn = screen.getByTestId('left-column');
    const rightColumn = screen.getByTestId('right-column');

    expect(leftColumn).toBeInTheDocument();
    expect(rightColumn).toBeInTheDocument();

    expect(leftColumn).toHaveClass('space-y-8');
    expect(rightColumn).toHaveClass('space-y-8', 'mt-32');
  });

  it('renders all 4 process cards', () => {
    render(<Process />);

    // Cards appear in both mobile and desktop layouts
    const cards = screen.getAllByTestId(/^process-card-/);
    expect(cards).toHaveLength(8); // 4 cards × 2 layouts = 8 total elements
  });

  it('renders DISCOVER process card with correct content', () => {
    render(<Process />);

    expect(screen.getAllByText('DISCOVER')).toHaveLength(2); // Mobile + Desktop
    expect(screen.getAllByText('/ 01')).toHaveLength(2);
    expect(
      screen.getAllByText(/EVERY PROJECT BEGINS WITH UNDERSTANDING/)
    ).toHaveLength(2);
  });

  it('renders DESIGN process card with correct content', () => {
    render(<Process />);

    expect(screen.getAllByText('DESIGN')).toHaveLength(2);
    expect(screen.getAllByText('/ 02')).toHaveLength(2);
    expect(screen.getAllByText(/ONCE THE DIRECTION IS CLEAR/)).toHaveLength(2);
  });

  it('renders DEVELOP process card with correct content', () => {
    render(<Process />);

    expect(screen.getAllByText('DEVELOP')).toHaveLength(2);
    expect(screen.getAllByText('/ 03')).toHaveLength(2);
    expect(
      screen.getAllByText(/FROM STATIC WEBSITES TO FULLY DYNAMIC/)
    ).toHaveLength(2);
  });

  it('renders DELIVER process card with correct content', () => {
    render(<Process />);

    expect(screen.getAllByText('DELIVER')).toHaveLength(2);
    expect(screen.getAllByText('/ 04')).toHaveLength(2);
    expect(screen.getAllByText(/I ENSURE THE FINAL PRODUCT/)).toHaveLength(2);
  });

  it('first card (DISCOVER) has special gradient background', () => {
    render(<Process />);

    const firstCards = screen.getAllByTestId('process-card-0');
    firstCards.forEach(card => {
      expect(card).toHaveClass('bg-gradient-to-br');
      // Check for the special red gradient styling applied via style attribute
      expect(card).toHaveStyle({
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      });
    });
  });

  it('other cards have default gray background', () => {
    render(<Process />);

    // Cards 1, 2, 3 should have gray background
    for (let i = 1; i <= 3; i++) {
      const cards = screen.getAllByTestId(`process-card-${i}`);
      cards.forEach(card => {
        expect(card).toHaveClass('bg-gray-800', 'border', 'border-gray-700');
        expect(card).toHaveStyle({
          background:
            'linear-gradient(135deg, #111111 0%, #1f1f1f 50%, #000000 100%)',
        });
      });
    }
  });

  it('renders progress dots for each card', () => {
    render(<Process />);

    // Each card has 4 progress dots, and cards appear in both layouts
    for (let cardId = 1; cardId <= 4; cardId++) {
      for (let dotIndex = 1; dotIndex <= 4; dotIndex++) {
        const dots = screen.getAllByTestId(
          `progress-dot-0${cardId}-${dotIndex}`
        );
        expect(dots).toHaveLength(2); // One for mobile, one for desktop
      }
    }
  });

  it('progress dots show correct active states', () => {
    render(<Process />);

    // Card 01: Only first dot should be active (white)
    const card1Dot1 = screen.getAllByTestId('progress-dot-01-1');
    const card1Dot2 = screen.getAllByTestId('progress-dot-01-2');
    card1Dot1.forEach(dot =>
      expect(dot).toHaveClass('bg-white', 'shadow-lg', 'shadow-white/50')
    );
    card1Dot2.forEach(dot => expect(dot).toHaveClass('bg-white/20'));

    // Card 02: First two dots should be active
    const card2Dot1 = screen.getAllByTestId('progress-dot-02-1');
    const card2Dot2 = screen.getAllByTestId('progress-dot-02-2');
    const card2Dot3 = screen.getAllByTestId('progress-dot-02-3');
    card2Dot1.forEach(dot =>
      expect(dot).toHaveClass('bg-white', 'shadow-lg', 'shadow-white/50')
    );
    card2Dot2.forEach(dot =>
      expect(dot).toHaveClass('bg-white', 'shadow-lg', 'shadow-white/50')
    );
    card2Dot3.forEach(dot => expect(dot).toHaveClass('bg-white/20'));

    // Card 04: All four dots should be active
    const card4Dot4 = screen.getAllByTestId('progress-dot-04-4');
    card4Dot4.forEach(dot =>
      expect(dot).toHaveClass('bg-white', 'shadow-lg', 'shadow-white/50')
    );
  });

  it('card numbers have correct colors', () => {
    render(<Process />);

    // Card 01 should have white/70 text
    const card1Numbers = screen.getAllByText('/ 01');
    card1Numbers.forEach(number => {
      expect(number).toHaveClass('text-white/70');
    });

    // Other cards should have red text
    for (let i = 2; i <= 4; i++) {
      const cardNumbers = screen.getAllByText(`/ 0${i}`);
      cardNumbers.forEach(number => {
        expect(number).toHaveClass('text-red-500');
      });
    }
  });

  it('card titles have correct styling', () => {
    render(<Process />);

    const titles = ['DISCOVER', 'DESIGN', 'DEVELOP', 'DELIVER'];

    titles.forEach(title => {
      const titleElements = screen.getAllByText(title);
      titleElements.forEach(element => {
        expect(element).toHaveClass(
          'text-white',
          'text-4xl',
          'md:text-5xl',
          'font-bold',
          'mb-6'
        );
      });
    });
  });

  it('card descriptions have correct styling', () => {
    render(<Process />);

    // Card 01 (gradient) should have text-white/90
    const card1Descriptions = screen.getAllByText(
      /EVERY PROJECT BEGINS WITH UNDERSTANDING/
    );
    card1Descriptions.forEach(desc => {
      expect(desc).toHaveClass(
        'text-sm',
        'leading-relaxed',
        'max-w-xs',
        'text-white/90'
      );
    });

    // Other cards should have text-white/80
    const card2Descriptions = screen.getAllByText(
      /ONCE THE DIRECTION IS CLEAR/
    );
    card2Descriptions.forEach(desc => {
      expect(desc).toHaveClass(
        'text-sm',
        'leading-relaxed',
        'max-w-xs',
        'text-white/80'
      );
    });
  });

  it('sets up IntersectionObserver on mount', () => {
    render(<Process />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    expect(observerInstance.observe).toHaveBeenCalled();
  });

  it('handles intersection observer entry when entering viewport', async () => {
    render(<Process />);

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    const callback = observerInstance.callback;

    // Simulate element entering viewport
    act(() => {
      callback([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      // Check that headings have visible animation classes
      const uniqueHeading = screen.getByText('UNIQUE');
      expect(uniqueHeading).toHaveClass('opacity-100', 'translate-y-0');
    });
  });

  it('handles intersection observer entry when leaving viewport', async () => {
    render(<Process />);

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
    const { unmount } = render(<Process />);

    const observerInstance = mockIntersectionObserver.mock.results[0].value;

    unmount();

    expect(observerInstance.unobserve).toHaveBeenCalled();
  });

  it('applies correct transition delays for headings', () => {
    render(<Process />);

    const uniqueHeading = screen.getByText('UNIQUE');
    const angleHeading = screen.getByText('ANGLE');

    // Default state (not visible) should have no delay
    expect(uniqueHeading).toHaveStyle({ transitionDelay: '0s' });
    expect(angleHeading).toHaveStyle({ transitionDelay: '0s' });

    const observerInstance = mockIntersectionObserver.mock.results[0].value;
    const callback = observerInstance.callback;

    // Simulate element entering viewport
    act(() => {
      callback([{ isIntersecting: true }]);
    });

    waitFor(() => {
      // When visible, should have different delays
      expect(uniqueHeading).toHaveStyle({ transitionDelay: '0.1s' });
      expect(angleHeading).toHaveStyle({ transitionDelay: '0.3s' });
    });
  });

  it('cards have correct height and padding', () => {
    render(<Process />);

    const allCards = screen.getAllByTestId(/^process-card-/);
    allCards.forEach(card => {
      expect(card).toHaveClass(
        'relative',
        'rounded-3xl',
        'p-8',
        'h-96',
        'flex',
        'flex-col',
        'justify-between',
        'overflow-hidden',
        'will-change-transform'
      );
    });
  });

  it('cards have correct transform styling for performance', () => {
    render(<Process />);

    const allCards = screen.getAllByTestId(/^process-card-/);
    allCards.forEach(card => {
      expect(card).toHaveStyle({
        transform: 'translateZ(0)',
        perspective: '1000px',
      });
    });
  });

  it('progress dots are positioned correctly', () => {
    render(<Process />);

    // Check that progress dots container has correct positioning
    const processSection = document.querySelector('#process');
    const dotContainers = processSection!.querySelectorAll(
      '.absolute.top-6.right-6.flex.space-x-1'
    );
    expect(dotContainers.length).toBeGreaterThan(0);
  });

  it('has semantic main role', () => {
    render(<Process />);

    const processSection = document.querySelector('#process');
    expect(processSection).toHaveAttribute('role', 'main');
  });

  it('has correct header section structure', () => {
    render(<Process />);

    const processSection = document.querySelector('#process');
    const headerSection = processSection!.querySelector(
      '.px-6.md\\:px-12.lg\\:px-24.mb-16.relative.z-10'
    );
    expect(headerSection).toBeInTheDocument();
  });

  it('uses z-index layering correctly', () => {
    render(<Process />);

    const processSection = document.querySelector('#process');

    // Header should have z-10
    const headerSection = processSection!.querySelector('.mb-16.relative.z-10');
    expect(headerSection).toBeInTheDocument();

    // Cards container should have z-10
    const cardsContainer = screen.getByTestId('cards-container');
    expect(cardsContainer).toHaveClass('z-10');
  });

  it('has responsive padding classes', () => {
    render(<Process />);

    const processSection = document.querySelector('#process');

    // Header section responsive padding
    const headerSection = processSection!.querySelector(
      '.px-6.md\\:px-12.lg\\:px-24'
    );
    expect(headerSection).toBeInTheDocument();

    // Cards container responsive padding
    const cardsContainer = screen.getByTestId('cards-container');
    expect(cardsContainer).toHaveClass('px-6', 'md:px-12', 'lg:px-24');
  });

  it('handles responsive layout switching', () => {
    render(<Process />);

    // Mobile layout should be block on mobile, hidden on desktop
    const mobileLayout = screen.getByTestId('mobile-layout');
    expect(mobileLayout).toHaveClass('block', 'md:hidden');

    // Desktop layout should be hidden on mobile, grid on desktop
    const desktopLayout = screen.getByTestId('desktop-layout');
    expect(desktopLayout).toHaveClass('hidden', 'md:grid');
  });

  it('desktop right column has correct offset', () => {
    render(<Process />);

    const rightColumn = screen.getByTestId('right-column');
    expect(rightColumn).toHaveClass('mt-32'); // Cascading offset
  });

  it('applies correct backdrop and overflow properties', () => {
    render(<Process />);

    const processSection = document.querySelector('#process');
    expect(processSection).toHaveClass('overflow-hidden');

    const cardsContainer = screen.getByTestId('cards-container');
    expect(cardsContainer).toHaveClass('will-change-contents');

    const allCards = screen.getAllByTestId(/^process-card-/);
    allCards.forEach(card => {
      expect(card).toHaveClass('will-change-transform', 'overflow-hidden');
    });
  });

  it('renders exactly 4 unique process cards with correct IDs', () => {
    render(<Process />);

    // Check for each card index (appears twice due to mobile/desktop layouts)
    for (let i = 0; i < 4; i++) {
      const cards = screen.getAllByTestId(`process-card-${i}`);
      expect(cards).toHaveLength(2); // One in mobile layout, one in desktop layout
    }
  });

  it('all progress dots have correct dimensions', () => {
    render(<Process />);

    const allDots = screen.getAllByTestId(/^progress-dot-/);
    allDots.forEach(dot => {
      expect(dot).toHaveClass('w-2', 'h-2', 'rounded-full');
    });
  });
});
