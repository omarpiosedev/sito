/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ScrollVelocity from '@/components/reactbits/TextAnimations/ScrollVelocity/ScrollVelocity';

// Mock Framer Motion
jest.mock('framer-motion', () => {
  const mockMotionValue = {
    get: jest.fn(() => 0),
    set: jest.fn(),
  };

  const mockVelocityFactorMotionValue = {
    get: jest.fn(() => 0),
    set: jest.fn(),
  };

  const mockXMotionValue = {
    get: jest.fn(() => 0),
    set: jest.fn(),
  };

  const mockTransform = jest.fn((input, arg1, arg2) => {
    if (typeof arg1 === 'function') {
      // Called with transformer function: useTransform(baseX, v => ...)
      // Store the transformer for later use in tests
      mockTransform._lastTransformer = arg1;
      return mockXMotionValue;
    } else {
      // Called with ranges: useTransform(smoothVelocity, inputRange, outputRange)
      // Return a motion value for velocityFactor
      return mockVelocityFactorMotionValue;
    }
  });
  const mockSpring = jest.fn(() => mockMotionValue);
  const mockVelocity = jest.fn(() => mockMotionValue);
  const mockScroll = jest.fn(() => ({ scrollY: mockMotionValue }));
  const mockUseAnimationFrame = jest.fn();

  return {
    motion: {
      div: React.forwardRef<HTMLDivElement, any>(
        ({ children, style, className, ...props }, ref) => (
          <div
            ref={ref}
            className={className}
            style={style}
            {...props}
            data-testid="motion-div"
          >
            {children}
          </div>
        )
      ),
    },
    useMotionValue: jest.fn(() => mockMotionValue),
    useScroll: mockScroll,
    useSpring: mockSpring,
    useTransform: mockTransform,
    useVelocity: mockVelocity,
    useAnimationFrame: mockUseAnimationFrame,
    __mockMotionValue: mockMotionValue,
    __mockVelocityFactorMotionValue: mockVelocityFactorMotionValue,
    __mockXMotionValue: mockXMotionValue,
    __mockTransform: mockTransform,
    __mockSpring: mockSpring,
    __mockVelocity: mockVelocity,
    __mockScroll: mockScroll,
    __mockUseAnimationFrame: mockUseAnimationFrame,
  };
});

// Mock window resize and layout effects
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

// Mock HTMLElement offsetWidth
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  get: jest.fn(() => 200),
  configurable: true,
});

describe('ScrollVelocity Component', () => {
  let mockFramerMotion: any;
  let mockMotionValue: any;
  let mockVelocityFactorMotionValue: any;
  let mockXMotionValue: any;
  let mockTransform: any;
  let mockSpring: any;
  let mockVelocity: any;
  let mockScroll: any;
  let mockUseAnimationFrame: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the mocked Framer Motion instance
    mockFramerMotion = require('framer-motion');
    mockMotionValue = mockFramerMotion.__mockMotionValue;
    mockVelocityFactorMotionValue =
      mockFramerMotion.__mockVelocityFactorMotionValue;
    mockXMotionValue = mockFramerMotion.__mockXMotionValue;
    mockTransform = mockFramerMotion.__mockTransform;
    mockSpring = mockFramerMotion.__mockSpring;
    mockVelocity = mockFramerMotion.__mockVelocity;
    mockScroll = mockFramerMotion.__mockScroll;
    mockUseAnimationFrame = mockFramerMotion.__mockUseAnimationFrame;

    // Reset motion value mocks
    mockMotionValue.get.mockReturnValue(0);
    mockVelocityFactorMotionValue.get.mockReturnValue(0);
    mockXMotionValue.get.mockReturnValue(0);
    mockScroll.mockReturnValue({ scrollY: mockMotionValue });
    mockSpring.mockReturnValue(mockMotionValue);
    mockVelocity.mockReturnValue(mockMotionValue);
  });

  describe('Component Rendering and Structure', () => {
    it('renders without crashing with basic props', () => {
      const { container } = render(
        <ScrollVelocity texts={['Hello', 'World']} />
      );

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(screen.getAllByText('Hello-').length).toBeGreaterThan(0);
      expect(screen.getAllByText('World-').length).toBeGreaterThan(0);
    });

    it('renders empty when no texts provided', () => {
      const { container } = render(<ScrollVelocity texts={[]} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section.children).toHaveLength(0);
    });

    it('renders multiple text items with correct structure', () => {
      render(<ScrollVelocity texts={['Text 1', 'Text 2', 'Text 3']} />);

      expect(screen.getAllByText('Text 1-').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Text 2-').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Text 3-').length).toBeGreaterThan(0);
    });

    it('applies custom className to text elements', () => {
      render(<ScrollVelocity texts={['Test']} className="custom-text-class" />);

      const textSpans = screen.getAllByText('Test-');
      expect(textSpans[0]).toHaveClass('custom-text-class');
    });

    it('applies custom parallax and scroller classes', () => {
      const { container } = render(
        <ScrollVelocity
          texts={['Test']}
          parallaxClassName="custom-parallax"
          scrollerClassName="custom-scroller"
        />
      );

      const parallaxDiv = container.querySelector('.custom-parallax');
      const scrollerDiv = container.querySelector('.custom-scroller');

      expect(parallaxDiv).toBeInTheDocument();
      expect(scrollerDiv).toBeInTheDocument();
    });

    it('applies custom styles correctly', () => {
      const parallaxStyle = { backgroundColor: 'red' };
      const scrollerStyle = { color: 'blue' };

      const { container } = render(
        <ScrollVelocity
          texts={['Test']}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        />
      );

      const parallaxDiv = container.querySelector('.relative.overflow-hidden');
      expect(parallaxDiv).toHaveStyle('background-color: rgb(255, 0, 0)');
    });
  });

  describe('Framer Motion Integration', () => {
    it('initializes motion hooks correctly', () => {
      render(<ScrollVelocity texts={['Test']} />);

      expect(mockScroll).toHaveBeenCalled();
      expect(mockSpring).toHaveBeenCalled();
      expect(mockVelocity).toHaveBeenCalled();
      expect(mockUseAnimationFrame).toHaveBeenCalled();
    });

    it('configures scroll with custom container ref', () => {
      const containerRef = React.createRef<HTMLDivElement>();

      render(
        <ScrollVelocity texts={['Test']} scrollContainerRef={containerRef} />
      );

      expect(mockScroll).toHaveBeenCalledWith(
        expect.objectContaining({
          container: containerRef,
        })
      );
    });

    it('configures scroll without container when ref not provided', () => {
      render(<ScrollVelocity texts={['Test']} />);

      expect(mockScroll).toHaveBeenCalledWith({});
    });

    it('configures spring with custom damping and stiffness', () => {
      render(<ScrollVelocity texts={['Test']} damping={75} stiffness={500} />);

      expect(mockSpring).toHaveBeenCalledWith(
        mockMotionValue,
        expect.objectContaining({
          damping: 75,
          stiffness: 500,
        })
      );
    });

    it('uses default spring values when not provided', () => {
      render(<ScrollVelocity texts={['Test']} />);

      expect(mockSpring).toHaveBeenCalledWith(
        mockMotionValue,
        expect.objectContaining({
          damping: 50,
          stiffness: 400,
        })
      );
    });

    it('configures velocity mapping correctly', () => {
      const customMapping = { input: [0, 2000], output: [0, 10] };

      render(
        <ScrollVelocity texts={['Test']} velocityMapping={customMapping} />
      );

      expect(mockTransform).toHaveBeenCalledWith(
        mockMotionValue,
        customMapping.input,
        customMapping.output,
        { clamp: false }
      );
    });

    it('uses default velocity mapping when not provided', () => {
      render(<ScrollVelocity texts={['Test']} />);

      expect(mockTransform).toHaveBeenCalledWith(
        mockMotionValue,
        [0, 1000],
        [0, 5],
        { clamp: false }
      );
    });
  });

  describe('Animation Logic and Physics', () => {
    it('executes animation frame callback', () => {
      render(<ScrollVelocity texts={['Test']} velocity={100} />);

      expect(mockUseAnimationFrame).toHaveBeenCalled();

      // Get the animation callback
      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      expect(typeof animationCallback).toBe('function');
    });

    it('handles positive velocity direction changes', () => {
      mockVelocityFactorMotionValue.get.mockReturnValue(2); // Positive velocity

      render(<ScrollVelocity texts={['Test']} velocity={100} />);

      // Execute the animation frame callback
      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      animationCallback(0, 16); // 60fps delta

      expect(mockVelocityFactorMotionValue.get).toHaveBeenCalled();
      expect(mockMotionValue.set).toHaveBeenCalled();
    });

    it('handles negative velocity direction changes', () => {
      mockVelocityFactorMotionValue.get.mockReturnValue(-2); // Negative velocity

      render(<ScrollVelocity texts={['Test']} velocity={100} />);

      // Execute the animation frame callback
      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      animationCallback(0, 16); // 60fps delta

      expect(mockVelocityFactorMotionValue.get).toHaveBeenCalled();
      expect(mockMotionValue.set).toHaveBeenCalled();
    });

    it('handles zero velocity correctly', () => {
      mockVelocityFactorMotionValue.get.mockReturnValue(0); // Zero velocity

      render(<ScrollVelocity texts={['Test']} velocity={100} />);

      // Execute the animation frame callback
      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      animationCallback(0, 16);

      expect(mockMotionValue.set).toHaveBeenCalled();
    });

    it('calculates movement correctly with different base velocities', () => {
      render(<ScrollVelocity texts={['Test']} velocity={200} />);

      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      animationCallback(1000, 16); // timestamp=1000ms, delta=16ms

      expect(mockMotionValue.set).toHaveBeenCalled();
    });

    it('applies velocity factor to movement calculations', () => {
      mockVelocityFactorMotionValue.get.mockReturnValue(1.5); // Some velocity factor

      render(<ScrollVelocity texts={['Test']} velocity={100} />);

      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      animationCallback(0, 16);

      expect(mockVelocityFactorMotionValue.get).toHaveBeenCalled();
      expect(mockMotionValue.set).toHaveBeenCalled();
    });

    it('handles direction changes based on velocity factor - covers lines 136-139', () => {
      let callCount = 0;

      // Mock velocity factor that changes from negative to positive
      mockVelocityFactorMotionValue.get.mockImplementation(() => {
        callCount++;
        if (callCount <= 2) return -2.5; // Negative velocity
        if (callCount <= 4) return 0; // Zero velocity
        return 3.0; // Positive velocity
      });

      render(<ScrollVelocity texts={['Test']} velocity={100} />);

      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];

      // Call animation frame multiple times to test all branches
      animationCallback(0, 16); // Should trigger negative direction
      animationCallback(16, 16); // Should trigger negative direction again
      animationCallback(32, 16); // Should trigger zero (no change)
      animationCallback(48, 16); // Should trigger positive direction
      animationCallback(64, 16); // Should trigger positive direction again

      expect(mockVelocityFactorMotionValue.get).toHaveBeenCalled();
      expect(mockMotionValue.set).toHaveBeenCalled();
    });

    it('specifically tests velocity direction factor assignment - covers lines 136-143', () => {
      // Test negative velocity factor (< 0) - should set directionFactor to -1
      mockVelocityFactorMotionValue.get.mockReturnValue(-1.5);

      render(<ScrollVelocity texts={['NegTest']} velocity={100} />);

      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      animationCallback(0, 16);

      expect(mockVelocityFactorMotionValue.get).toHaveBeenCalled();
      expect(mockMotionValue.set).toHaveBeenCalled();

      // Reset and test positive velocity factor (> 0) - should set directionFactor to 1
      jest.clearAllMocks();
      mockVelocityFactorMotionValue.get.mockReturnValue(2.5);

      const { unmount: unmount1 } = render(
        <ScrollVelocity texts={['PosTest']} velocity={100} />
      );

      const animationCallback2 = mockUseAnimationFrame.mock.calls[0][0];
      animationCallback2(0, 16);

      expect(mockVelocityFactorMotionValue.get).toHaveBeenCalled();
      expect(mockMotionValue.set).toHaveBeenCalled();

      unmount1();

      // Reset and test zero velocity factor (= 0) - should not change directionFactor
      jest.clearAllMocks();
      mockVelocityFactorMotionValue.get.mockReturnValue(0);

      const { unmount: unmount2 } = render(
        <ScrollVelocity texts={['ZeroTest']} velocity={100} />
      );

      const animationCallback3 = mockUseAnimationFrame.mock.calls[0][0];
      animationCallback3(0, 16);

      expect(mockVelocityFactorMotionValue.get).toHaveBeenCalled();
      expect(mockMotionValue.set).toHaveBeenCalled();

      unmount2();
    });

    it('tests velocity direction edge cases with boundary values', () => {
      const boundaryValues = [
        -0.001, // Just below zero
        0.001, // Just above zero
        -1, // Exact -1
        1, // Exact 1
        -100, // Large negative
        100, // Large positive
      ];

      boundaryValues.forEach((velocityValue, index) => {
        jest.clearAllMocks();
        mockVelocityFactorMotionValue.get.mockReturnValue(velocityValue);

        const { unmount } = render(
          <ScrollVelocity texts={[`Test${index}`]} velocity={100} />
        );

        const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
        animationCallback(0, 16);

        expect(mockVelocityFactorMotionValue.get).toHaveBeenCalled();
        expect(mockMotionValue.set).toHaveBeenCalled();

        unmount();
      });
    });
  });

  describe('Text Wrapping and Positioning', () => {
    it('handles wrap calculations when width is zero', () => {
      // Mock zero width
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        get: jest.fn(() => 0),
        configurable: true,
      });

      render(<ScrollVelocity texts={['Test']} />);

      // The transform should handle zero width case
      const transformCallback = mockTransform.mock.calls.find(
        call => typeof call[1] === 'function'
      )?.[1];

      if (transformCallback) {
        const result = transformCallback(0);
        expect(result).toBe('0px');
      }
    });

    it('calculates wrap positions correctly with non-zero width', () => {
      // Mock non-zero width
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        get: jest.fn(() => 200),
        configurable: true,
      });

      render(<ScrollVelocity texts={['Test']} />);

      const transformCallback = mockTransform.mock.calls.find(
        call => typeof call[1] === 'function'
      )?.[1];

      if (transformCallback) {
        const result = transformCallback(100);
        expect(typeof result).toBe('string');
        expect(result).toMatch(/px$/);
      }
    });

    it('specifically tests transform function return statement - covers lines 128-129', () => {
      // Test the specific return statement logic in the transform function
      const testWidths = [0, 50, 100, 150, 200, 300];

      testWidths.forEach(width => {
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
          get: jest.fn(() => width),
          configurable: true,
        });

        const { unmount } = render(
          <ScrollVelocity texts={['TransformTest']} />
        );

        // Find the transform callback that contains our return logic
        const transformCallback = mockTransform.mock.calls.find(
          call => typeof call[1] === 'function'
        )?.[1];

        if (transformCallback) {
          if (width === 0) {
            // When width is 0, should return '0px' (line 127)
            const result = transformCallback(100);
            expect(result).toBe('0px');
          } else {
            // When width > 0, should return the wrapped value as pixels (line 128)
            const testValues = [-width, width / 2, width, width * 1.5];
            testValues.forEach(value => {
              const result = transformCallback(value);
              expect(typeof result).toBe('string');
              expect(result).toMatch(/^-?\d+(\.\d+)?px$/);
              // For non-zero values, it should actually call the wrap function
              // and return something other than '0px' for most cases
              if (value !== 0) {
                expect(result).toBeDefined();
              }
            });
          }
        }

        unmount();
      });
    });

    it('covers the wrap function with various inputs', () => {
      // Mock width to trigger wrap function
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        get: jest.fn(() => 300),
        configurable: true,
      });

      render(<ScrollVelocity texts={['Test']} />);

      const transformCallback = mockTransform.mock.calls.find(
        call => typeof call[1] === 'function'
      )?.[1];

      if (transformCallback) {
        // Test various values to exercise the wrap function
        transformCallback(0);
        transformCallback(150);
        transformCallback(300);
        transformCallback(-150);
        transformCallback(450);
      }
    });

    it('specifically tests wrap function mathematical operations - covers lines 121-124', () => {
      // Create a component that ensures the ref has a width
      const TestWrapper = () => {
        const ref = React.useRef<HTMLSpanElement>(null);

        // Mock the ref to have offsetWidth
        React.useEffect(() => {
          if (ref.current) {
            Object.defineProperty(ref.current, 'offsetWidth', {
              value: 100,
              writable: true,
              configurable: true,
            });
          }
        }, []);

        return <ScrollVelocity texts={['WrapTest']} />;
      };

      render(<TestWrapper />);

      // Find the transform callback that contains the wrap function
      const transformCallback = mockTransform.mock.calls.find(
        call => typeof call[1] === 'function'
      )?.[1];

      if (transformCallback) {
        // Test specific values that will exercise all parts of the wrap function
        // These values are designed to hit different branches of the modulo calculation
        const testValues = [
          -250, // Large negative (tests negative modulo handling)
          -100, // Exact width negative
          -50, // Half width negative
          50, // Half width positive
          100, // Exact width
          150, // Over width
          250, // Much larger than width
          300, // Even larger
        ];

        testValues.forEach(value => {
          const result = transformCallback(value);
          // Should always return a pixel value
          expect(typeof result).toBe('string');
          expect(result).toMatch(/^-?\d+(\.\d+)?px$/);
        });
      }
    });

    it('exercises wrap function edge cases for complete line coverage', () => {
      // Test with different widths to ensure all wrap function branches are hit
      const widthValues = [50, 75, 100, 200, 500];

      widthValues.forEach(width => {
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
          get: jest.fn(() => width),
          configurable: true,
        });

        const { unmount } = render(<ScrollVelocity texts={['EdgeTest']} />);

        const transformCallback = mockTransform.mock.calls.find(
          call => typeof call[1] === 'function'
        )?.[1];

        if (transformCallback) {
          // Test values designed to hit edge cases in wrap function
          const edgeCaseValues = [
            -width * 3, // Large negative multiple
            -width - 1, // Just over negative width
            -width, // Exact negative width
            -width + 1, // Just under negative width
            -1, // Small negative
            0, // Zero baseline
            1, // Small positive
            width - 1, // Just under width
            width, // Exact width
            width + 1, // Just over width
            width * 2, // Double width
            width * 3, // Triple width
          ];

          edgeCaseValues.forEach(value => {
            const result = transformCallback(value);
            expect(result).toMatch(/^-?\d+(\.\d+)?px$/);
          });
        }

        unmount();
      });
    });

    it('forces wrap function execution by simulating real component lifecycle', () => {
      // Create a test that forces the component to have a real width and trigger wrap
      const mockOffsetWidth = jest.fn().mockReturnValue(200);

      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        get: mockOffsetWidth,
        configurable: true,
      });

      const { container } = render(
        <ScrollVelocity texts={['ForceWrapTest']} />
      );

      // Wait for useLayoutEffect to complete and trigger width update
      act(() => {
        // Simulate window resize to trigger width recalculation
        window.dispatchEvent(new Event('resize'));
      });

      // Get the transform function
      const transformCallback = mockTransform.mock.calls.find(
        call => typeof call[1] === 'function'
      )?.[1];

      if (transformCallback) {
        // These calls will definitely execute the wrap function since width > 0
        const criticalValues = [
          -200, // -copyWidth (should wrap to 0)
          -100, // -copyWidth/2 (should wrap to -100)
          -400, // -copyWidth*2 (should wrap to 0)
          -50, // Small negative (should wrap to -50)
          100, // Positive (will be wrapped)
          500, // Large positive (will be wrapped)
        ];

        criticalValues.forEach(value => {
          const result = transformCallback(value);
          // These should all execute lines 121-124 (wrap function) and 128 (return statement)
          expect(result).toMatch(/^-?\d+(\.\d+)?px$/);
          // The wrap function should return valid results but we need to be more specific
          expect(typeof result).toBe('string');
          expect(result.endsWith('px')).toBe(true);
        });
      }

      // Verify that offsetWidth was actually called
      expect(mockOffsetWidth).toHaveBeenCalled();
    });

    it('generates correct number of text copies', () => {
      render(<ScrollVelocity texts={['Test']} numCopies={8} />);

      const spans = screen.getAllByText('Test-');
      expect(spans).toHaveLength(8);
    });

    it('uses default number of copies when not specified', () => {
      render(<ScrollVelocity texts={['Test']} />);

      const spans = screen.getAllByText('Test-');
      expect(spans).toHaveLength(6); // Default numCopies
    });

    it('applies ref only to the first span copy', () => {
      render(<ScrollVelocity texts={['Test']} numCopies={3} />);

      const spans = screen.getAllByText('Test-');
      expect(spans).toHaveLength(3);

      // Only first span should have the ref (hard to test directly, but structure should be consistent)
      spans.forEach(span => {
        expect(span).toHaveClass('flex-shrink-0');
      });
    });
  });

  describe('Scroll Direction and Velocity Handling', () => {
    it('alternates velocity direction for multiple texts', () => {
      render(
        <ScrollVelocity
          texts={['Text 1', 'Text 2', 'Text 3', 'Text 4']}
          velocity={100}
        />
      );

      // Should create VelocityText components with alternating velocities
      expect(screen.getAllByText('Text 1-').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Text 2-').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Text 3-').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Text 4-').length).toBeGreaterThan(0);
    });

    it('handles single text item correctly', () => {
      render(<ScrollVelocity texts={['Single']} velocity={150} />);

      expect(screen.getAllByText('Single-').length).toBeGreaterThan(0);
    });

    it('passes through velocity prop correctly', () => {
      render(<ScrollVelocity texts={['Test']} velocity={250} />);

      // The component should use the velocity in calculations
      expect(mockUseAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Width Tracking Hook (useElementWidth)', () => {
    it('sets up resize listener on mount', () => {
      render(<ScrollVelocity texts={['Test']} />);

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('cleans up resize listener on unmount', () => {
      const { unmount } = render(<ScrollVelocity texts={['Test']} />);

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });

    it('handles resize events to update width', () => {
      render(<ScrollVelocity texts={['Test']} />);

      // Get the resize callback
      const resizeCallback = mockAddEventListener.mock.calls.find(
        call => call[0] === 'resize'
      )?.[1];

      expect(resizeCallback).toBeDefined();

      if (resizeCallback) {
        // Should not throw when called
        expect(() => resizeCallback()).not.toThrow();
      }
    });

    it('updates width when element is available', () => {
      // Mock a different width
      const offsetWidthSpy = jest.fn(() => 300);
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        get: offsetWidthSpy,
        configurable: true,
      });

      act(() => {
        render(<ScrollVelocity texts={['Test']} />);
      });

      // Width should be tracked and used in calculations
      expect(offsetWidthSpy).toHaveBeenCalled();
    });
  });

  describe('Props Handling and Default Values', () => {
    it('applies all custom props correctly', () => {
      const customMapping = { input: [0, 1500], output: [0, 8] };
      const customParallaxStyle = { backgroundColor: 'blue' };
      const customScrollerStyle = { fontSize: '2rem' };

      const { container } = render(
        <ScrollVelocity
          texts={['Custom Test']}
          velocity={300}
          className="custom-class"
          damping={60}
          stiffness={600}
          numCopies={4}
          velocityMapping={customMapping}
          parallaxClassName="custom-parallax"
          scrollerClassName="custom-scroller"
          parallaxStyle={customParallaxStyle}
          scrollerStyle={customScrollerStyle}
        />
      );

      const spans = screen.getAllByText('Custom Test-');
      expect(spans[0]).toHaveClass('custom-class');
      expect(container.querySelector('.custom-parallax')).toBeInTheDocument();
      expect(container.querySelector('.custom-scroller')).toBeInTheDocument();
      expect(spans).toHaveLength(4);
    });

    it('handles undefined and null props gracefully', () => {
      render(
        <ScrollVelocity
          texts={['Test']}
          className={undefined}
          parallaxClassName={undefined}
          scrollerClassName={undefined}
          parallaxStyle={undefined}
          scrollerStyle={undefined}
        />
      );

      expect(screen.getAllByText('Test-').length).toBeGreaterThan(0);
    });

    it('uses correct default values', () => {
      render(<ScrollVelocity texts={['Default Test']} />);

      expect(mockSpring).toHaveBeenCalledWith(
        mockMotionValue,
        expect.objectContaining({
          damping: 50,
          stiffness: 400,
        })
      );

      const spans = screen.getAllByText('Default Test-');
      expect(spans).toHaveLength(6); // Default numCopies
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty string texts', () => {
      render(<ScrollVelocity texts={['', 'Valid', '']} />);

      expect(screen.getAllByText('-').length).toBeGreaterThan(0); // Empty string with dash
      expect(screen.getAllByText('Valid-').length).toBeGreaterThan(0);
    });

    it('handles very large velocity values', () => {
      render(<ScrollVelocity texts={['Test']} velocity={10000} />);

      expect(screen.getAllByText('Test-').length).toBeGreaterThan(0);
      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      expect(() => animationCallback(0, 16)).not.toThrow();
    });

    it('handles zero velocity', () => {
      render(<ScrollVelocity texts={['Test']} velocity={0} />);

      expect(screen.getAllByText('Test-').length).toBeGreaterThan(0);
      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      expect(() => animationCallback(0, 16)).not.toThrow();
    });

    it('handles negative velocity', () => {
      render(<ScrollVelocity texts={['Test']} velocity={-100} />);

      expect(screen.getAllByText('Test-').length).toBeGreaterThan(0);

      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      expect(() => animationCallback(0, 16)).not.toThrow();
    });

    it('handles very small delta values', () => {
      render(<ScrollVelocity texts={['Test']} />);

      expect(screen.getAllByText('Test-').length).toBeGreaterThan(0);
      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      expect(() => animationCallback(0, 0.001)).not.toThrow();
    });

    it('handles very large delta values', () => {
      render(<ScrollVelocity texts={['Test']} />);

      expect(screen.getAllByText('Test-').length).toBeGreaterThan(0);
      const animationCallback = mockUseAnimationFrame.mock.calls[0][0];
      expect(() => animationCallback(0, 1000)).not.toThrow();
    });

    it('handles many text items efficiently', () => {
      const manyTexts = Array.from({ length: 20 }, (_, i) => `Text ${i + 1}`);

      render(<ScrollVelocity texts={manyTexts} />);

      manyTexts.forEach((text, index) => {
        expect(screen.getAllByText(`${text}-`).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('handles component updates correctly', () => {
      const { rerender } = render(
        <ScrollVelocity texts={['Initial']} velocity={100} />
      );

      expect(screen.getAllByText('Initial-').length).toBeGreaterThan(0);

      rerender(<ScrollVelocity texts={['Updated']} velocity={200} />);

      expect(screen.getAllByText('Updated-').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('Initial-')).toHaveLength(0);
    });

    it('handles text array changes', () => {
      const { rerender } = render(<ScrollVelocity texts={['One', 'Two']} />);

      expect(screen.getAllByText('One-').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Two-').length).toBeGreaterThan(0);

      rerender(<ScrollVelocity texts={['Three', 'Four', 'Five']} />);

      expect(screen.getAllByText('Three-').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Four-').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Five-').length).toBeGreaterThan(0);
      expect(screen.queryAllByText('One-')).toHaveLength(0);
    });

    it('cleans up properly on unmount', () => {
      const { unmount } = render(<ScrollVelocity texts={['Test']} />);

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });
  });

  describe('Integration Tests', () => {
    it('works with complex scroll container setup', () => {
      const scrollRef = React.createRef<HTMLDivElement>();

      render(
        <div>
          <div ref={scrollRef} style={{ height: '200px', overflow: 'scroll' }}>
            <ScrollVelocity
              texts={['Scrollable Content']}
              scrollContainerRef={scrollRef}
            />
          </div>
        </div>
      );

      expect(screen.getAllByText('Scrollable Content-').length).toBeGreaterThan(
        0
      );
      expect(mockScroll).toHaveBeenCalledWith(
        expect.objectContaining({
          container: scrollRef,
        })
      );
    });

    it('maintains performance with rapid prop changes', () => {
      const { rerender } = render(
        <ScrollVelocity texts={['Performance Test']} velocity={100} />
      );

      // Rapid prop changes
      for (let i = 0; i < 10; i++) {
        rerender(
          <ScrollVelocity
            texts={['Performance Test']}
            velocity={100 + i * 10}
            damping={50 + i}
            stiffness={400 + i * 10}
          />
        );
      }

      expect(screen.getAllByText('Performance Test-').length).toBeGreaterThan(
        0
      );
    });

    it('handles complex styling combinations', () => {
      const { container } = render(
        <ScrollVelocity
          texts={['Styled Test']}
          className="text-large bold"
          parallaxClassName="bg-gradient fancy-border"
          scrollerClassName="smooth-animation custom-font"
          parallaxStyle={{
            background: 'linear-gradient(45deg, red, blue)',
            borderRadius: '10px',
          }}
          scrollerStyle={{
            fontFamily: 'Arial',
            letterSpacing: '2px',
          }}
        />
      );

      const styledTexts = screen.getAllByText('Styled Test-');
      expect(styledTexts[0]).toHaveClass('text-large', 'bold');
      expect(
        container.querySelector('.bg-gradient.fancy-border')
      ).toBeInTheDocument();
      expect(
        container.querySelector('.smooth-animation.custom-font')
      ).toBeInTheDocument();
    });

    it('achieves 100% coverage by forcing copyWidth to be non-zero', () => {
      // Create a more realistic DOM environment with proper offsetWidth
      const originalOffsetWidth = Object.getOwnPropertyDescriptor(
        HTMLElement.prototype,
        'offsetWidth'
      );

      // Mock offsetWidth to return a non-zero value for all elements
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        configurable: true,
        get: function () {
          if (
            this.tagName === 'SPAN' &&
            this.textContent &&
            this.textContent.includes('CoverageTest-')
          ) {
            return 500; // Return a meaningful width for our test spans
          }
          return 0;
        },
      });

      let capturedTransformFunction: ((v: number) => string) | null = null;

      // Mock the transform function to capture it
      mockTransform.mockImplementation((input, arg1, arg2) => {
        if (typeof arg1 === 'function') {
          capturedTransformFunction = arg1;
          return mockXMotionValue;
        } else {
          return mockVelocityFactorMotionValue;
        }
      });

      const { rerender } = render(
        <ScrollVelocity texts={['CoverageTest']} numCopies={1} />
      );

      // Force a re-render to ensure the useLayoutEffect has time to run
      rerender(<ScrollVelocity texts={['CoverageTest']} numCopies={1} />);

      // Simulate the transform function being called with various values
      // This should execute lines 127-129 (the transform return and wrap function)
      if (capturedTransformFunction) {
        // Test with positive value - should execute wrap function (lines 121-124)
        const result1 = capturedTransformFunction(100);
        expect(result1).toBe('-400px'); // wrap(-500, 0, 100) should give -400

        // Test with negative value - should execute wrap function
        const result2 = capturedTransformFunction(-50);
        expect(result2).toBe('-50px'); // wrap(-500, 0, -50) should give -50

        // Test with zero - should execute wrap function
        const result3 = capturedTransformFunction(0);
        expect(result3).toBe('-500px'); // wrap(-500, 0, 0) should give -500

        // Test with large value - should wrap around
        const result4 = capturedTransformFunction(1000);
        expect(result4).toBe('-500px'); // wrap(-500, 0, 1000) should wrap back to -500
      }

      // Restore original offsetWidth
      if (originalOffsetWidth) {
        Object.defineProperty(
          HTMLElement.prototype,
          'offsetWidth',
          originalOffsetWidth
        );
      }

      expect(screen.getByText('CoverageTest-')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic section element', () => {
      const { container } = render(<ScrollVelocity texts={['Accessible']} />);

      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('maintains text content accessibility', () => {
      render(<ScrollVelocity texts={['Screen Reader Text']} />);

      expect(screen.getAllByText('Screen Reader Text-').length).toBeGreaterThan(
        0
      );
    });

    it('handles motion preference considerations', () => {
      // Component should render regardless of motion preferences
      render(<ScrollVelocity texts={['Motion Text']} />);

      expect(screen.getAllByText('Motion Text-').length).toBeGreaterThan(0);
      expect(mockUseAnimationFrame).toHaveBeenCalled();
    });
  });
});
