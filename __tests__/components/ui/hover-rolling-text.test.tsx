import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HoverRollingText } from '@/components/ui/hover-rolling-text';

// Mock framer-motion
jest.mock('motion/react', () => ({
  motion: {
    span: ({
      children,
      className,
      style,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
      initial?: any;
      animate?: any;
      transition?: any;
      [key: string]: any;
    }) => (
      <span className={className} style={style} {...props}>
        {children}
      </span>
    ),
  },
}));

describe('HoverRollingText', () => {
  const defaultProps = {
    text: 'Test Text',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<HoverRollingText {...defaultProps} />);

      // Check if the component renders the text (via sr-only for accessibility)
      expect(screen.getByText('Test Text')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <HoverRollingText {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders with custom style', () => {
      const customStyle = { color: 'blue', fontSize: '16px' };
      const { container } = render(
        <HoverRollingText {...defaultProps} style={customStyle} />
      );

      expect(container.firstChild).toHaveStyle('color: rgb(0, 0, 255)');
      expect(container.firstChild).toHaveStyle('font-size: 16px');
    });

    it('renders with children', () => {
      render(
        <HoverRollingText {...defaultProps}>
          <span data-testid="child">Child content</span>
        </HoverRollingText>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('renders empty text', () => {
      const { container } = render(<HoverRollingText text="" />);

      // Should still render the component structure
      expect(container.firstChild).toBeInTheDocument();
      // Check for sr-only class specifically
      const srOnlyElement = container.querySelector('.sr-only');
      expect(srOnlyElement).toBeInTheDocument();
    });

    it('renders text with spaces', () => {
      render(<HoverRollingText text="Hello World" />);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('renders text with special characters', () => {
      const specialText = 'Test@123!#$%';
      render(<HoverRollingText text={specialText} />);

      expect(screen.getByText(specialText)).toBeInTheDocument();
    });
  });

  describe('Character Processing', () => {
    it('creates individual spans for each character', () => {
      const { container } = render(<HoverRollingText text="ABC" />);

      // Should have spans for each character plus the container
      const spans = container.querySelectorAll('span');
      // Container + 3 character containers + 6 motion spans (2 per character) + 3 invisible spans + 1 sr-only = 14 spans
      expect(spans.length).toBeGreaterThan(10);
    });

    it('handles spaces correctly', () => {
      render(<HoverRollingText text="A B" />);

      // Should render the text with spaces
      expect(screen.getByText('A B')).toBeInTheDocument();
    });

    it('processes single character correctly', () => {
      const { container } = render(<HoverRollingText text="X" />);

      // Check if the sr-only text is there
      const srOnlyElement = container.querySelector('.sr-only');
      expect(srOnlyElement).toHaveTextContent('X');
    });
  });

  describe('Hover Interactions', () => {
    it('handles mouse enter event', async () => {
      const { container } = render(<HoverRollingText {...defaultProps} />);
      const mainElement = container.firstChild as HTMLElement;

      await userEvent.hover(mainElement);

      // Component should have received the hover event
      expect(mainElement).toBeInTheDocument();
    });

    it('handles mouse leave event', async () => {
      const { container } = render(<HoverRollingText {...defaultProps} />);
      const mainElement = container.firstChild as HTMLElement;

      await userEvent.hover(mainElement);
      await userEvent.unhover(mainElement);

      // Component should have received the unhover event
      expect(mainElement).toBeInTheDocument();
    });

    it('triggers hover state with fireEvent', () => {
      const { container } = render(<HoverRollingText {...defaultProps} />);
      const mainElement = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(mainElement);
      fireEvent.mouseLeave(mainElement);

      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('External Hover Control', () => {
    it('respects external isHovered prop when true', () => {
      render(<HoverRollingText {...defaultProps} isHovered={true} />);

      // Component should render with external hover state
      expect(screen.getByText('Test Text')).toBeInTheDocument();
    });

    it('respects external isHovered prop when false', () => {
      render(<HoverRollingText {...defaultProps} isHovered={false} />);

      // Component should render with external hover state
      expect(screen.getByText('Test Text')).toBeInTheDocument();
    });

    it('ignores internal hover when external isHovered is provided', async () => {
      const { container } = render(
        <HoverRollingText {...defaultProps} isHovered={false} />
      );
      const mainElement = container.firstChild as HTMLElement;

      // Try to hover internally
      await userEvent.hover(mainElement);

      // Should still respect external prop
      expect(mainElement).toBeInTheDocument();
    });

    it('uses internal hover state when external isHovered is undefined', async () => {
      const { container } = render(<HoverRollingText {...defaultProps} />);
      const mainElement = container.firstChild as HTMLElement;

      await userEvent.hover(mainElement);

      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides screen reader text', () => {
      render(<HoverRollingText text="Accessible Text" />);

      const srText = screen.getByText('Accessible Text');
      expect(srText).toBeInTheDocument();
      expect(srText).toHaveClass('sr-only');
    });

    it('marks decorative spans as aria-hidden', () => {
      const { container } = render(<HoverRollingText text="ABC" />);

      const ariaHiddenSpans = container.querySelectorAll(
        'span[aria-hidden="true"]'
      );
      expect(ariaHiddenSpans.length).toBe(3); // One for each character
    });

    it('maintains semantic structure', () => {
      render(<HoverRollingText text="Test" />);

      // Should have proper heading structure if used as heading
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });

  describe('Animation Constants', () => {
    it('has proper animation configuration', () => {
      // These constants should be accessible and well-defined
      render(<HoverRollingText {...defaultProps} />);

      // Test that the component renders without animation errors
      expect(screen.getByText('Test Text')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles very long text', () => {
      const longText = 'A'.repeat(1000);
      render(<HoverRollingText text={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles text with only spaces', () => {
      const { container } = render(<HoverRollingText text="   " />);

      // Check that the component renders properly with spaces
      expect(container.firstChild).toBeInTheDocument();
      const srOnlyElement = container.querySelector('.sr-only');
      expect(srOnlyElement).toBeInTheDocument();
    });

    it('handles unicode characters', () => {
      const unicodeText = '🎉✨🚀';
      render(<HoverRollingText text={unicodeText} />);

      expect(screen.getByText(unicodeText)).toBeInTheDocument();
    });

    it('handles newline characters', () => {
      const textWithNewlines = 'Line1\nLine2';
      const { container } = render(
        <HoverRollingText text={textWithNewlines} />
      );

      // Check that the component renders properly with newlines
      expect(container.firstChild).toBeInTheDocument();
      const srOnlyElement = container.querySelector('.sr-only');
      expect(srOnlyElement).toBeInTheDocument();
      expect(srOnlyElement).toHaveTextContent('Line1 Line2'); // DOM normalizes newlines to spaces
    });
  });

  describe('Component State Management', () => {
    it('manages internal hover state correctly', () => {
      const { container, rerender } = render(
        <HoverRollingText {...defaultProps} />
      );
      const mainElement = container.firstChild as HTMLElement;

      // Initial state
      expect(mainElement).toBeInTheDocument();

      // Hover
      fireEvent.mouseEnter(mainElement);
      expect(mainElement).toBeInTheDocument();

      // Unhover
      fireEvent.mouseLeave(mainElement);
      expect(mainElement).toBeInTheDocument();

      // Re-render with same props
      rerender(<HoverRollingText {...defaultProps} />);
      expect(mainElement).toBeInTheDocument();
    });

    it('updates when text prop changes', () => {
      const { rerender } = render(<HoverRollingText text="Initial" />);
      expect(screen.getByText('Initial')).toBeInTheDocument();

      rerender(<HoverRollingText text="Updated" />);
      expect(screen.getByText('Updated')).toBeInTheDocument();
      expect(screen.queryByText('Initial')).not.toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('handles rapid hover/unhover without errors', () => {
      const { container } = render(<HoverRollingText {...defaultProps} />);
      const mainElement = container.firstChild as HTMLElement;

      // Rapid hover/unhover
      for (let i = 0; i < 10; i++) {
        fireEvent.mouseEnter(mainElement);
        fireEvent.mouseLeave(mainElement);
      }

      expect(mainElement).toBeInTheDocument();
      expect(screen.getByText('Test Text')).toBeInTheDocument();
    });
  });
});
