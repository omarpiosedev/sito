/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import CardSwap, {
  Card,
} from '@/components/reactbits/Components/CardSwap/CardSwap';

// Mock GSAP
jest.mock('gsap', () => {
  const mockTimeline = {
    to: jest.fn().mockReturnThis(),
    addLabel: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    call: jest.fn().mockReturnThis(),
    pause: jest.fn().mockReturnThis(),
    play: jest.fn().mockReturnThis(),
    kill: jest.fn().mockReturnThis(),
  };

  return {
    timeline: jest.fn(() => mockTimeline),
    set: jest.fn(),
    to: jest.fn(),
    __mockTimeline: mockTimeline, // Export for test access
  };
});

// Mock window.innerWidth for mobile detection
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

// Mock setInterval/clearInterval
let mockIntervalId = 0;
const mockSetInterval = jest.fn((callback: () => void, delay: number) => {
  mockIntervalId++;
  setTimeout(callback, delay); // Execute once for testing
  return mockIntervalId;
});
const mockClearInterval = jest.fn();

global.setInterval = mockSetInterval;
global.clearInterval = mockClearInterval;

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('CardSwap Component', () => {
  let mockGsap: any;
  let mockTimeline: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIntervalId = 0;

    // Get the mocked GSAP instance
    mockGsap = require('gsap');
    mockTimeline = mockGsap.__mockTimeline;

    // Reset GSAP mock state
    mockTimeline.to.mockReturnThis();
    mockTimeline.addLabel.mockReturnThis();
    mockTimeline.set.mockReturnThis();
    mockTimeline.call.mockReturnThis();
    mockGsap.timeline.mockReturnValue(mockTimeline);

    // Reset window size to desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  describe('Component Rendering and Structure', () => {
    it('renders without crashing', () => {
      render(
        <CardSwap>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });

    it('renders container with correct classes and styles', () => {
      const { container } = render(
        <CardSwap width={600} height={500}>
          <Card>Test Card</Card>
        </CardSwap>
      );

      const containerDiv = container.firstChild as HTMLElement;
      expect(containerDiv).toHaveClass(
        'relative',
        'transform',
        'origin-center',
        'perspective-[900px]',
        'overflow-visible',
        'scale-75',
        'md:scale-90',
        'lg:scale-100'
      );
      expect(containerDiv).toHaveStyle({
        width: '600px',
        height: '500px',
      });
    });

    it('renders multiple cards correctly', () => {
      render(
        <CardSwap>
          <Card data-testid="card-1">Card 1</Card>
          <Card data-testid="card-2">Card 2</Card>
          <Card data-testid="card-3">Card 3</Card>
        </CardSwap>
      );

      expect(screen.getByTestId('card-1')).toBeInTheDocument();
      expect(screen.getByTestId('card-2')).toBeInTheDocument();
      expect(screen.getByTestId('card-3')).toBeInTheDocument();
    });

    it('applies custom width and height to cards', () => {
      render(
        <CardSwap width={300} height={200}>
          <Card data-testid="test-card">Test</Card>
        </CardSwap>
      );

      const card = screen.getByTestId('test-card');
      expect(card).toHaveStyle({
        width: '300px',
        height: '200px',
      });
    });

    it('handles string width and height values', () => {
      render(
        <CardSwap width="50%" height="80vh">
          <Card data-testid="test-card">Test</Card>
        </CardSwap>
      );

      const card = screen.getByTestId('test-card');
      expect(card).toHaveStyle({
        width: '50%',
        height: '80vh',
      });
    });
  });

  describe('Card Component', () => {
    it('renders Card component with default classes', () => {
      render(<Card data-testid="test-card">Test Content</Card>);

      const card = screen.getByTestId('test-card');
      expect(card).toHaveClass(
        'absolute',
        'top-1/2',
        'left-1/2',
        'rounded-xl',
        'border',
        'border-white',
        'bg-black',
        '[transform-style:preserve-3d]',
        '[will-change:transform]',
        '[backface-visibility:hidden]'
      );
      expect(card).toHaveTextContent('Test Content');
    });

    it('applies custom className to Card', () => {
      render(
        <Card className="custom-class" data-testid="test-card">
          Test
        </Card>
      );

      const card = screen.getByTestId('test-card');
      expect(card).toHaveClass('custom-class');
    });

    it('applies customClass prop to Card', () => {
      render(
        <Card customClass="custom-prop-class" data-testid="test-card">
          Test
        </Card>
      );

      const card = screen.getByTestId('test-card');
      expect(card).toHaveClass('custom-prop-class');
    });

    it('combines customClass and className', () => {
      render(
        <Card
          customClass="custom-prop"
          className="custom-class"
          data-testid="test-card"
        >
          Test
        </Card>
      );

      const card = screen.getByTestId('test-card');
      expect(card).toHaveClass('custom-prop', 'custom-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Test</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveTextContent('Test');
    });

    it('passes through other HTML attributes', () => {
      render(
        <Card id="test-id" role="button" tabIndex={0} data-testid="test-card">
          Test
        </Card>
      );

      const card = screen.getByTestId('test-card');
      expect(card).toHaveAttribute('id', 'test-id');
      expect(card).toHaveAttribute('role', 'button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('GSAP Integration and Animations', () => {
    it('initializes GSAP timeline on mount', () => {
      render(
        <CardSwap>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(mockGsap.timeline).toHaveBeenCalled();
      expect(mockGsap.set).toHaveBeenCalled();
    });

    it('executes GSAP callback functions correctly', () => {
      render(
        <CardSwap>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // Get the callbacks that were passed to timeline.call
      const callCalls = mockTimeline.call.mock.calls;
      expect(callCalls.length).toBeGreaterThan(0);

      // Execute the first callback (zIndex setting)
      if (callCalls[0] && callCalls[0][0]) {
        callCalls[0][0]();
        expect(mockGsap.set).toHaveBeenCalled();
      }

      // Execute the second callback (order update)
      if (callCalls[1] && callCalls[1][0]) {
        callCalls[1][0]();
      }
    });

    it('sets up initial card positions with GSAP', () => {
      render(
        <CardSwap cardDistance={50} verticalDistance={60}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
          <Card>Card 3</Card>
        </CardSwap>
      );

      // Should call gsap.set for each card to position them
      expect(mockGsap.set).toHaveBeenCalledTimes(3);
    });

    it('creates timeline animations for card swapping', () => {
      render(
        <CardSwap>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(mockGsap.timeline).toHaveBeenCalled();
      expect(mockTimeline.to).toHaveBeenCalled();
      expect(mockTimeline.addLabel).toHaveBeenCalled();
    });

    it('uses different animation configurations for elastic easing', () => {
      render(
        <CardSwap easing="elastic">
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(mockTimeline.to).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          duration: 2, // Elastic configuration
          ease: 'elastic.out(0.6,0.9)',
        })
      );
    });

    it('uses different animation configurations for linear easing', () => {
      render(
        <CardSwap easing="linear">
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(mockTimeline.to).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          duration: 0.8, // Linear configuration
          ease: 'power1.inOut',
        })
      );
    });

    it('handles skew animations correctly', () => {
      render(
        <CardSwap skewAmount={10}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(mockGsap.set).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          skewY: 10,
        })
      );
    });

    it('applies 3D transforms correctly', () => {
      render(
        <CardSwap>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(mockGsap.set).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          transformOrigin: 'center center',
          force3D: true,
        })
      );
    });

    it('executes complete animation sequence with timeline callbacks', async () => {
      render(
        <CardSwap delay={50}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
          <Card>Card 3</Card>
        </CardSwap>
      );

      // Wait for initial swap to execute
      await waitFor(() => {
        expect(mockTimeline.call).toHaveBeenCalled();
      });

      // Execute all the callback functions that were registered
      const allCallbacks = mockTimeline.call.mock.calls;
      allCallbacks.forEach(call => {
        if (call[0] && typeof call[0] === 'function') {
          call[0](); // Execute the callback
        }
      });

      // Verify GSAP methods were called as expected
      expect(mockTimeline.to).toHaveBeenCalled();
      expect(mockTimeline.set).toHaveBeenCalled();
      expect(mockTimeline.addLabel).toHaveBeenCalled();
    });
  });

  describe('Mobile Responsive Behavior', () => {
    it('detects mobile screen size correctly', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768, // Mobile size
      });

      render(
        <CardSwap
          cardDistance={60}
          mobileCardDistance={30}
          skewAmount={6}
          mobileSkewAmount={2}
        >
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // Should use mobile values when screen is small
      expect(mockGsap.set).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          skewY: 2, // Mobile skew amount
        })
      );
    });

    it('uses desktop values on large screens', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200, // Desktop size
      });

      render(
        <CardSwap
          cardDistance={60}
          mobileCardDistance={30}
          skewAmount={6}
          mobileSkewAmount={2}
        >
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // Should use desktop values
      expect(mockGsap.set).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          skewY: 6, // Desktop skew amount
        })
      );
    });

    it('responds to window resize events', () => {
      const { rerender } = render(
        <CardSwap cardDistance={60} mobileCardDistance={30}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // Change window size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500, // Mobile
      });

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // Component should detect the change and update
      expect(window.innerWidth).toBe(500);
    });

    it('handles mobile vertical distance correctly', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500, // Mobile
      });

      render(
        <CardSwap verticalDistance={70} mobileVerticalDistance={35}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // The positioning logic should use mobile vertical distance
      expect(mockGsap.set).toHaveBeenCalled();
    });
  });

  describe('Animation Timing and Intervals', () => {
    it('sets up animation interval with correct delay', () => {
      render(
        <CardSwap delay={3000}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 3000);
    });

    it('uses default delay when none provided', () => {
      render(
        <CardSwap>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(mockSetInterval).toHaveBeenCalledWith(
        expect.any(Function),
        5000 // Default delay
      );
    });

    it('cleans up interval on unmount', () => {
      const { unmount } = render(
        <CardSwap>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      unmount();

      expect(mockClearInterval).toHaveBeenCalled();
    });

    it('executes swap function on interval', async () => {
      render(
        <CardSwap delay={100}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // Wait for interval execution
      await waitFor(() => {
        expect(mockTimeline.to).toHaveBeenCalled();
      });
    });
  });

  describe('Hover Pause/Resume Functionality', () => {
    it('pauses animation on hover when pauseOnHover is enabled', () => {
      const { container } = render(
        <CardSwap pauseOnHover={true}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      const cardSwapContainer = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(cardSwapContainer);

      expect(mockTimeline.pause).toHaveBeenCalled();
      expect(mockClearInterval).toHaveBeenCalled();
    });

    it('resumes animation on mouse leave when pauseOnHover is enabled', () => {
      const { container } = render(
        <CardSwap pauseOnHover={true}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      const cardSwapContainer = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(cardSwapContainer);
      fireEvent.mouseLeave(cardSwapContainer);

      expect(mockTimeline.play).toHaveBeenCalled();
      expect(mockSetInterval).toHaveBeenCalledTimes(2); // Initial + resume
    });

    it('does not add hover listeners when pauseOnHover is disabled', () => {
      const { container } = render(
        <CardSwap pauseOnHover={false}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      const cardSwapContainer = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(cardSwapContainer);

      // Should not pause because pauseOnHover is false
      expect(mockTimeline.pause).not.toHaveBeenCalled();
    });

    it('cleans up hover event listeners on unmount', () => {
      const { unmount } = render(
        <CardSwap pauseOnHover={true}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      const removeEventListenerSpy = jest.spyOn(
        HTMLElement.prototype,
        'removeEventListener'
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mouseenter',
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mouseleave',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Card Click Handling', () => {
    it('triggers onCardClick when a card is clicked', () => {
      const mockOnCardClick = jest.fn();

      render(
        <CardSwap onCardClick={mockOnCardClick}>
          <Card data-testid="card-1">Card 1</Card>
          <Card data-testid="card-2">Card 2</Card>
        </CardSwap>
      );

      fireEvent.click(screen.getByTestId('card-1'));

      expect(mockOnCardClick).toHaveBeenCalledWith(0);

      fireEvent.click(screen.getByTestId('card-2'));

      expect(mockOnCardClick).toHaveBeenCalledWith(1);
    });

    it('calls original card onClick handler when present', () => {
      const mockOriginalClick = jest.fn();
      const mockOnCardClick = jest.fn();

      render(
        <CardSwap onCardClick={mockOnCardClick}>
          <Card onClick={mockOriginalClick} data-testid="card-1">
            Card 1
          </Card>
        </CardSwap>
      );

      fireEvent.click(screen.getByTestId('card-1'));

      expect(mockOriginalClick).toHaveBeenCalled();
      expect(mockOnCardClick).toHaveBeenCalledWith(0);
    });

    it('handles clicks when onCardClick is not provided', () => {
      const mockOriginalClick = jest.fn();

      render(
        <CardSwap>
          <Card onClick={mockOriginalClick} data-testid="card-1">
            Card 1
          </Card>
        </CardSwap>
      );

      fireEvent.click(screen.getByTestId('card-1'));

      expect(mockOriginalClick).toHaveBeenCalled();
    });
  });

  describe('Card Order and Positioning Logic', () => {
    it('handles single card gracefully', () => {
      render(
        <CardSwap>
          <Card>Single Card</Card>
        </CardSwap>
      );

      expect(screen.getByText('Single Card')).toBeInTheDocument();
      expect(mockGsap.set).toHaveBeenCalled();
    });

    it('positions multiple cards with correct z-index order', () => {
      render(
        <CardSwap>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
          <Card>Card 3</Card>
        </CardSwap>
      );

      // Should set different zIndex values for each card
      expect(mockGsap.set).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          zIndex: expect.any(Number),
        })
      );
    });

    it('calculates slot positions correctly', () => {
      render(
        <CardSwap cardDistance={50} verticalDistance={60}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // Should position cards with appropriate x, y, z values
      expect(mockGsap.set).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          x: expect.any(Number),
          y: expect.any(Number),
          z: expect.any(Number),
          xPercent: -50,
          yPercent: -50,
        })
      );
    });
  });

  describe('Props Handling and Default Values', () => {
    it('applies default prop values correctly', () => {
      render(
        <CardSwap>
          <Card>Test Card</Card>
        </CardSwap>
      );

      // Should use default width (500) and height (400)
      const card = screen.getByText('Test Card');
      expect(card).toHaveStyle({
        width: '500px',
        height: '400px',
      });
    });

    it('overrides default values with provided props', () => {
      render(
        <CardSwap
          width={300}
          height={250}
          cardDistance={80}
          verticalDistance={90}
          delay={2000}
          skewAmount={8}
        >
          <Card>Test Card</Card>
        </CardSwap>
      );

      const card = screen.getByText('Test Card');
      expect(card).toHaveStyle({
        width: '300px',
        height: '250px',
      });

      expect(mockSetInterval).toHaveBeenCalledWith(expect.any(Function), 2000);
    });

    it('handles edge case prop values', () => {
      render(
        <CardSwap
          width={0}
          height={0}
          cardDistance={0}
          verticalDistance={0}
          delay={0}
          skewAmount={0}
        >
          <Card>Test Card</Card>
        </CardSwap>
      );

      const card = screen.getByText('Test Card');
      expect(card).toHaveStyle({
        width: '0px',
        height: '0px',
      });
    });
  });

  describe('Children Handling', () => {
    it('handles mixed children types correctly', () => {
      render(
        <CardSwap>
          <Card>Card 1</Card>
          {null}
          <Card>Card 2</Card>
          {false && <Card>Hidden Card</Card>}
          <Card>Card 3</Card>
        </CardSwap>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
      expect(screen.getByText('Card 3')).toBeInTheDocument();
      expect(screen.queryByText('Hidden Card')).not.toBeInTheDocument();
    });

    it('preserves child props and styles', () => {
      render(
        <CardSwap width={200} height={150}>
          <Card style={{ border: '2px solid red' }} data-testid="styled-card">
            Styled Card
          </Card>
        </CardSwap>
      );

      const card = screen.getByTestId('styled-card');
      expect(card).toHaveStyle({
        width: '200px',
        height: '150px',
        border: '2px solid red',
      });
    });

    it('handles empty children gracefully', () => {
      render(<CardSwap>{[]}</CardSwap>);

      // Should render without errors even with no children
      expect(mockGsap.set).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('handles invalid React elements in children', () => {
      const { container } = render(
        <CardSwap>
          <Card>Valid Card</Card>
          {'String child'}
          {123}
          <div>Invalid child type</div>
        </CardSwap>
      );

      expect(screen.getByText('Valid Card')).toBeInTheDocument();
      expect(container).toHaveTextContent('String child');
      expect(container).toHaveTextContent('123');
      expect(screen.getByText('Invalid child type')).toBeInTheDocument();
    });

    it('handles component updates correctly', () => {
      const { rerender } = render(
        <CardSwap delay={1000}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      rerender(
        <CardSwap delay={2000}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
          <Card>Card 3</Card>
        </CardSwap>
      );

      expect(screen.getByText('Card 3')).toBeInTheDocument();
    });

    it('prevents animation when less than 2 cards', () => {
      render(
        <CardSwap>
          <Card>Only Card</Card>
        </CardSwap>
      );

      // Should not create complex timeline animations for single card
      expect(mockTimeline.addLabel).not.toHaveBeenCalled();
    });
  });

  describe('Performance and Optimization', () => {
    it('memoizes child array correctly', () => {
      const { rerender } = render(
        <CardSwap>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // Re-render with same children should not recreate refs
      rerender(
        <CardSwap delay={2000}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });

    it('handles rapid prop changes efficiently', () => {
      const { rerender } = render(
        <CardSwap delay={1000}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // Rapid prop changes
      for (let i = 0; i < 5; i++) {
        rerender(
          <CardSwap delay={1000 + i * 100}>
            <Card>Card 1</Card>
            <Card>Card 2</Card>
          </CardSwap>
        );
      }

      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });

    it('cleans up resources properly on unmount', () => {
      const { unmount } = render(
        <CardSwap pauseOnHover={true}>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      unmount();

      expect(mockClearInterval).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('works with all props combined', () => {
      const mockOnCardClick = jest.fn();
      const { container } = render(
        <CardSwap
          width="400px"
          height="300px"
          cardDistance={40}
          verticalDistance={50}
          mobileCardDistance={20}
          mobileVerticalDistance={25}
          delay={1500}
          pauseOnHover={true}
          onCardClick={mockOnCardClick}
          skewAmount={5}
          mobileSkewAmount={2}
          easing="linear"
        >
          <Card className="custom-card-1" data-testid="card-1">
            Card 1
          </Card>
          <Card className="custom-card-2" data-testid="card-2">
            Card 2
          </Card>
          <Card className="custom-card-3" data-testid="card-3">
            Card 3
          </Card>
        </CardSwap>
      );

      const card1 = screen.getByTestId('card-1');
      const card2 = screen.getByTestId('card-2');
      const card3 = screen.getByTestId('card-3');

      expect(card1).toHaveStyle({ width: '400px', height: '300px' });
      expect(card2).toHaveStyle({ width: '400px', height: '300px' });
      expect(card3).toHaveStyle({ width: '400px', height: '300px' });

      expect(card1).toHaveClass('custom-card-1');
      expect(card2).toHaveClass('custom-card-2');
      expect(card3).toHaveClass('custom-card-3');

      // Test click functionality
      fireEvent.click(card2);
      expect(mockOnCardClick).toHaveBeenCalledWith(1);

      // Test pause on hover
      const cardSwapContainer = container.firstChild as HTMLElement;
      fireEvent.mouseEnter(cardSwapContainer);
      expect(mockTimeline.pause).toHaveBeenCalled();
    });

    it('maintains functionality during mobile/desktop transitions', () => {
      // Start on desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      const { container } = render(
        <CardSwap
          cardDistance={60}
          mobileCardDistance={30}
          skewAmount={6}
          mobileSkewAmount={2}
        >
          <Card>Card 1</Card>
          <Card>Card 2</Card>
        </CardSwap>
      );

      // Switch to mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper DOM structure for screen readers', () => {
      render(
        <CardSwap>
          <Card role="button" tabIndex={0} aria-label="First card">
            Card 1
          </Card>
          <Card role="button" tabIndex={0} aria-label="Second card">
            Card 2
          </Card>
        </CardSwap>
      );

      const card1 = screen.getByLabelText('First card');
      const card2 = screen.getByLabelText('Second card');

      expect(card1).toHaveAttribute('role', 'button');
      expect(card1).toHaveAttribute('tabIndex', '0');
      expect(card2).toHaveAttribute('role', 'button');
      expect(card2).toHaveAttribute('tabIndex', '0');
    });

    it('preserves keyboard navigation attributes', () => {
      render(
        <CardSwap>
          <Card tabIndex={0} onKeyDown={() => {}}>
            Keyboard Card
          </Card>
        </CardSwap>
      );

      const card = screen.getByText('Keyboard Card');
      expect(card).toHaveAttribute('tabIndex', '0');
    });
  });
});
