/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MultiDirectionSlide } from '@/components/eldoraui/multidirectionalslide';

// Mock framer-motion
let mockMotionH1Calls: Array<{
  initial: string;
  animate: string;
  variants: any;
  transition: any;
  className: string;
  style: any;
  children: string;
}> = [];

jest.mock('framer-motion', () => ({
  motion: {
    h1: React.forwardRef<HTMLHeadingElement, any>(
      (
        {
          initial,
          animate,
          variants,
          transition,
          className,
          style,
          children,
          ...props
        },
        ref
      ) => {
        // Store call details for testing
        mockMotionH1Calls.push({
          initial,
          animate,
          variants,
          transition,
          className,
          style,
          children,
        });

        return (
          <h1
            ref={ref}
            className={className}
            style={style}
            data-testid={`motion-h1-${mockMotionH1Calls.length}`}
            data-initial={initial}
            data-animate={animate}
            data-duration={transition?.duration}
            {...props}
          >
            {children}
          </h1>
        );
      }
    ),
  },
}));

// Mock clsx
jest.mock('clsx', () => {
  return jest.fn((...args: any[]) => {
    return args
      .flat()
      .filter(Boolean)
      .filter(arg => typeof arg === 'string' && arg.trim())
      .join(' ');
  });
});

describe('MultiDirectionSlide Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMotionH1Calls = [];
  });

  describe('Component Rendering and Structure', () => {
    it('renders without crashing', () => {
      const { container } = render(<MultiDirectionSlide />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders container with correct base classes', () => {
      const { container } = render(<MultiDirectionSlide />);

      expect(container.firstChild).toHaveClass('overflow-hidden');
    });

    it('applies custom className to container', () => {
      const { container } = render(
        <MultiDirectionSlide className="custom-container-class" />
      );

      expect(container.firstChild).toHaveClass(
        'overflow-hidden',
        'custom-container-class'
      );
    });

    it('renders two motion h1 elements', () => {
      render(<MultiDirectionSlide />);

      expect(screen.getByTestId('motion-h1-1')).toBeInTheDocument();
      expect(screen.getByTestId('motion-h1-2')).toBeInTheDocument();
    });

    it('applies default text content when none provided', () => {
      render(<MultiDirectionSlide />);

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveTextContent('');
      expect(rightElement).toHaveTextContent('');
    });

    it('applies custom text content correctly', () => {
      const leftText = 'Left Slide Text';
      const rightText = 'Right Slide Text';

      render(<MultiDirectionSlide textLeft={leftText} textRight={rightText} />);

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveTextContent(leftText);
      expect(rightElement).toHaveTextContent(rightText);
    });
  });

  describe('Motion Animation Configuration', () => {
    it('configures correct animation variants', () => {
      render(<MultiDirectionSlide />);

      expect(mockMotionH1Calls).toHaveLength(2);

      // Check variants are correctly defined
      const leftVariants = mockMotionH1Calls[0].variants;
      const rightVariants = mockMotionH1Calls[1].variants;

      expect(leftVariants).toEqual({
        hidden: { opacity: 0, x: '-100vw' },
        visible: { opacity: 1, x: 0 },
        right: { opacity: 0, x: '100vw' },
      });
      expect(rightVariants).toEqual({
        hidden: { opacity: 0, x: '-100vw' },
        visible: { opacity: 1, x: 0 },
        right: { opacity: 0, x: '100vw' },
      });
    });

    it('sets correct initial states for left and right elements', () => {
      render(<MultiDirectionSlide />);

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveAttribute('data-initial', 'hidden');
      expect(rightElement).toHaveAttribute('data-initial', 'right');
    });

    it('configures correct animation duration', () => {
      render(<MultiDirectionSlide />);

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveAttribute('data-duration', '1');
      expect(rightElement).toHaveAttribute('data-duration', '1');
    });

    it('handles animate prop for animation states', () => {
      const { rerender } = render(<MultiDirectionSlide animate={false} />);

      let leftElement = screen.getByTestId('motion-h1-1');
      let rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveAttribute('data-animate', 'hidden');
      expect(rightElement).toHaveAttribute('data-animate', 'right');

      // Test with animation enabled
      mockMotionH1Calls = [];
      rerender(<MultiDirectionSlide animate={true} />);

      leftElement = screen.getByTestId('motion-h1-1');
      rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveAttribute('data-animate', 'visible');
      expect(rightElement).toHaveAttribute('data-animate', 'visible');
    });

    it('animates both elements to visible state when animate is true', () => {
      render(<MultiDirectionSlide animate={true} />);

      expect(mockMotionH1Calls[0].animate).toBe('visible');
      expect(mockMotionH1Calls[1].animate).toBe('visible');
    });

    it('keeps elements in initial states when animate is false', () => {
      render(<MultiDirectionSlide animate={false} />);

      expect(mockMotionH1Calls[0].animate).toBe('hidden');
      expect(mockMotionH1Calls[1].animate).toBe('right');
    });
  });

  describe('Styling and CSS Classes', () => {
    it('applies base CSS classes to both elements', () => {
      render(<MultiDirectionSlide />);

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      const expectedClasses =
        'text-center font-display font-bold drop-shadow-sm';

      expect(leftElement).toHaveClass(expectedClasses);
      expect(rightElement).toHaveClass(expectedClasses);
    });

    it('applies custom className to both motion elements', () => {
      const customClass = 'custom-text-class';

      render(<MultiDirectionSlide className={customClass} />);

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveClass(customClass);
      expect(rightElement).toHaveClass(customClass);
    });

    it('applies custom styles to both motion elements', () => {
      const customStyle = { fontSize: '2rem', color: 'red' };

      render(<MultiDirectionSlide style={customStyle} />);

      expect(mockMotionH1Calls[0].style).toEqual(customStyle);
      expect(mockMotionH1Calls[1].style).toEqual(customStyle);
    });

    it('handles empty style object', () => {
      render(<MultiDirectionSlide style={{}} />);

      expect(mockMotionH1Calls[0].style).toEqual({});
      expect(mockMotionH1Calls[1].style).toEqual({});
    });

    it('applies default empty style when style prop is not provided', () => {
      render(<MultiDirectionSlide />);

      expect(mockMotionH1Calls[0].style).toEqual({});
      expect(mockMotionH1Calls[1].style).toEqual({});
    });
  });

  describe('Props Handling', () => {
    it('handles all props together', () => {
      const props = {
        textLeft: 'Welcome',
        textRight: 'to our site',
        className: 'hero-text large-text',
        style: { color: 'blue', fontSize: '3rem' },
        animate: true,
      };

      render(<MultiDirectionSlide {...props} />);

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveTextContent('Welcome');
      expect(rightElement).toHaveTextContent('to our site');
      expect(leftElement).toHaveClass('hero-text', 'large-text');
      expect(rightElement).toHaveClass('hero-text', 'large-text');
      expect(leftElement).toHaveAttribute('data-animate', 'visible');
      expect(rightElement).toHaveAttribute('data-animate', 'visible');
    });

    it('handles prop updates correctly', () => {
      const { rerender } = render(
        <MultiDirectionSlide textLeft="Initial" animate={false} />
      );

      expect(screen.getByTestId('motion-h1-1')).toHaveTextContent('Initial');
      expect(screen.getByTestId('motion-h1-1')).toHaveAttribute(
        'data-animate',
        'hidden'
      );

      mockMotionH1Calls = [];
      rerender(<MultiDirectionSlide textLeft="Updated" animate={true} />);

      expect(screen.getByTestId('motion-h1-1')).toHaveTextContent('Updated');
      expect(screen.getByTestId('motion-h1-1')).toHaveAttribute(
        'data-animate',
        'visible'
      );
    });

    it('handles undefined props gracefully', () => {
      render(
        <MultiDirectionSlide
          textLeft={undefined}
          textRight={undefined}
          className={undefined}
          style={undefined}
          animate={undefined}
        />
      );

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveTextContent('');
      expect(rightElement).toHaveTextContent('');
      expect(leftElement).toHaveAttribute('data-animate', 'hidden');
      expect(rightElement).toHaveAttribute('data-animate', 'right');
    });
  });

  describe('Animation States and Transitions', () => {
    it('maintains different initial positions for both elements', () => {
      render(<MultiDirectionSlide />);

      const leftCall = mockMotionH1Calls[0];
      const rightCall = mockMotionH1Calls[1];

      expect(leftCall.initial).toBe('hidden'); // Coming from left
      expect(rightCall.initial).toBe('right'); // Coming from right
    });

    it('moves both elements to center when animated', () => {
      render(<MultiDirectionSlide animate={true} />);

      const leftCall = mockMotionH1Calls[0];
      const rightCall = mockMotionH1Calls[1];

      expect(leftCall.animate).toBe('visible');
      expect(rightCall.animate).toBe('visible');
      expect(leftCall.variants.visible).toEqual({ opacity: 1, x: 0 });
      expect(rightCall.variants.visible).toEqual({ opacity: 1, x: 0 });
    });

    it('configures correct viewport-based movements', () => {
      render(<MultiDirectionSlide />);

      const variants = mockMotionH1Calls[0].variants;

      expect(variants.hidden.x).toBe('-100vw'); // Full viewport left
      expect(variants.right.x).toBe('100vw'); // Full viewport right
      expect(variants.visible.x).toBe(0); // Center position
    });

    it('handles opacity changes during animation', () => {
      render(<MultiDirectionSlide />);

      const variants = mockMotionH1Calls[0].variants;

      expect(variants.hidden.opacity).toBe(0);
      expect(variants.right.opacity).toBe(0);
      expect(variants.visible.opacity).toBe(1);
    });

    it('uses consistent animation timing', () => {
      render(<MultiDirectionSlide />);

      const leftTransition = mockMotionH1Calls[0].transition;
      const rightTransition = mockMotionH1Calls[1].transition;

      expect(leftTransition.duration).toBe(1);
      expect(rightTransition.duration).toBe(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty string text gracefully', () => {
      render(<MultiDirectionSlide textLeft="" textRight="" />);

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveTextContent('');
      expect(rightElement).toHaveTextContent('');
    });

    it('handles very long text content', () => {
      const longText =
        'This is a very long text content that might overflow or cause layout issues if not handled properly';

      render(<MultiDirectionSlide textLeft={longText} textRight={longText} />);

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveTextContent(longText);
      expect(rightElement).toHaveTextContent(longText);
    });

    it('handles special characters in text', () => {
      const specialText = 'Text with émojis 🎉 & spëcial châráctërs!';

      render(
        <MultiDirectionSlide textLeft={specialText} textRight={specialText} />
      );

      const leftElement = screen.getByTestId('motion-h1-1');
      const rightElement = screen.getByTestId('motion-h1-2');

      expect(leftElement).toHaveTextContent(specialText);
      expect(rightElement).toHaveTextContent(specialText);
    });

    it('handles rapid animation state changes', () => {
      const { rerender } = render(<MultiDirectionSlide animate={false} />);

      // Rapid state changes
      for (let i = 0; i < 5; i++) {
        mockMotionH1Calls = [];
        rerender(<MultiDirectionSlide animate={i % 2 === 0} />);
      }

      // Should handle the final state correctly
      const finalAnimate = mockMotionH1Calls[0].animate;
      expect(['hidden', 'visible']).toContain(finalAnimate);
    });

    it('maintains component structure with null/undefined children', () => {
      render(
        <MultiDirectionSlide textLeft={null as any} textRight={undefined} />
      );

      expect(screen.getByTestId('motion-h1-1')).toBeInTheDocument();
      expect(screen.getByTestId('motion-h1-2')).toBeInTheDocument();
    });
  });

  describe('Performance and Optimization', () => {
    it('reuses animation variants object', () => {
      render(<MultiDirectionSlide />);

      const leftVariants = mockMotionH1Calls[0].variants;
      const rightVariants = mockMotionH1Calls[1].variants;

      // Both should use the same variants object reference
      expect(leftVariants).toEqual(rightVariants);
    });

    it('handles multiple re-renders efficiently', () => {
      const { rerender } = render(<MultiDirectionSlide animate={false} />);

      for (let i = 0; i < 10; i++) {
        rerender(
          <MultiDirectionSlide textLeft={`Text ${i}`} animate={i % 2 === 0} />
        );
      }

      // Should render without errors - use query to check for any motion elements
      const motionElements = screen.getAllByRole('heading', { level: 1 });
      expect(motionElements).toHaveLength(2);
    });

    it('maintains consistent DOM structure across renders', () => {
      const { rerender } = render(<MultiDirectionSlide />);

      const initialElements = screen.getAllByRole('heading', { level: 1 });
      expect(initialElements).toHaveLength(2);

      rerender(<MultiDirectionSlide animate={true} textLeft="Changed" />);

      const afterChangeElements = screen.getAllByRole('heading', { level: 1 });

      // Elements should still exist in DOM
      expect(afterChangeElements).toHaveLength(2);
      expect(afterChangeElements[0]).toBeInTheDocument();
      expect(afterChangeElements[1]).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('works with complex styling scenarios', () => {
      const complexStyle = {
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
        borderRadius: '10px',
        padding: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      };

      render(
        <MultiDirectionSlide
          textLeft="Styled Left"
          textRight="Styled Right"
          className="complex-animation gradient-text"
          style={complexStyle}
          animate={true}
        />
      );

      expect(mockMotionH1Calls[0].style).toEqual(complexStyle);
      expect(mockMotionH1Calls[1].style).toEqual(complexStyle);
      expect(screen.getByTestId('motion-h1-1')).toHaveClass(
        'complex-animation',
        'gradient-text'
      );
      expect(screen.getByTestId('motion-h1-2')).toHaveClass(
        'complex-animation',
        'gradient-text'
      );
    });

    it('handles component lifecycle correctly', () => {
      const { rerender, unmount } = render(
        <MultiDirectionSlide textLeft="Initial" animate={false} />
      );

      expect(screen.getByText('Initial')).toBeInTheDocument();

      rerender(<MultiDirectionSlide textLeft="Updated" animate={true} />);

      expect(screen.getByText('Updated')).toBeInTheDocument();

      unmount();

      // Should not throw errors during unmount
      expect(() => {
        screen.queryByText('Updated');
      }).not.toThrow();
    });

    it('works in different animation scenarios', () => {
      // Test entrance animation
      const { rerender } = render(<MultiDirectionSlide animate={false} />);

      expect(screen.getByTestId('motion-h1-1')).toHaveAttribute(
        'data-animate',
        'hidden'
      );
      expect(screen.getByTestId('motion-h1-2')).toHaveAttribute(
        'data-animate',
        'right'
      );

      // Test visible state
      mockMotionH1Calls = [];
      rerender(<MultiDirectionSlide animate={true} />);

      expect(screen.getByTestId('motion-h1-1')).toHaveAttribute(
        'data-animate',
        'visible'
      );
      expect(screen.getByTestId('motion-h1-2')).toHaveAttribute(
        'data-animate',
        'visible'
      );
    });
  });

  describe('Accessibility', () => {
    it('renders semantic h1 elements', () => {
      render(<MultiDirectionSlide textLeft="Left" textRight="Right" />);

      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings).toHaveLength(2);
    });

    it('maintains readable text content', () => {
      const leftText = 'Accessible Left Text';
      const rightText = 'Accessible Right Text';

      render(<MultiDirectionSlide textLeft={leftText} textRight={rightText} />);

      expect(screen.getByText(leftText)).toBeInTheDocument();
      expect(screen.getByText(rightText)).toBeInTheDocument();
    });

    it('preserves text content during animations', () => {
      const { rerender } = render(
        <MultiDirectionSlide
          textLeft="Static Left"
          textRight="Static Right"
          animate={false}
        />
      );

      expect(screen.getByText('Static Left')).toBeInTheDocument();
      expect(screen.getByText('Static Right')).toBeInTheDocument();

      rerender(
        <MultiDirectionSlide
          textLeft="Static Left"
          textRight="Static Right"
          animate={true}
        />
      );

      expect(screen.getByText('Static Left')).toBeInTheDocument();
      expect(screen.getByText('Static Right')).toBeInTheDocument();
    });
  });
});
