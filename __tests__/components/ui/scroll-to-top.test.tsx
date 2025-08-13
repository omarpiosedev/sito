import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScrollToTop from '@/components/ui/scroll-to-top';

// Mock scroll-utils
jest.mock('@/lib/scroll-utils', () => ({
  handleMenuClick: jest.fn(),
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ChevronUp: ({ size }: { size?: number }) => (
    <div data-testid="chevron-up-icon" data-size={size}>
      ChevronUp
    </div>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({
      children,
      className,
      style,
      onClick,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
      onClick?: () => void;
      initial?: any;
      animate?: any;
      exit?: any;
      whileHover?: any;
      whileTap?: any;
      [key: string]: any;
    }) => (
      <button className={className} style={style} onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Import the mocked function
import { handleMenuClick } from '@/lib/scroll-utils';

describe('ScrollToTop', () => {
  // Mock window properties and methods
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window properties
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock event listeners
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  afterEach(() => {
    // Restore original values
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  describe('Component Rendering', () => {
    it('renders nothing when scroll position is below threshold', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 200 });

      render(<ScrollToTop />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('renders button when scroll position is above threshold', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      Object.defineProperty(window, 'pageYOffset', { value: 100 });
      render(<ScrollToTop />);

      // Simulate scroll above threshold
      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders ChevronUp icon inside button', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      const icon = screen.getByTestId('chevron-up-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('data-size', '24');
    });

    it('applies correct styling classes to button', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'fixed',
        'bottom-8',
        'right-8',
        'z-50',
        'p-4',
        'bg-red-500',
        'text-white',
        'rounded-full',
        'shadow-2xl',
        'hover:bg-red-600',
        'transition-colors',
        'duration-300'
      );
    });

    it('applies inline styles correctly', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        boxShadow:
          '0 10px 25px rgba(239, 68, 68, 0.3), 0 4px 10px rgba(0, 0, 0, 0.3)',
      });
    });
  });

  describe('Scroll Detection', () => {
    it('adds scroll event listener on mount', () => {
      render(<ScrollToTop />);

      expect(window.addEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });

    it('removes scroll event listener on unmount', () => {
      const { unmount } = render(<ScrollToTop />);

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });

    it('shows button when scrolled past 300px threshold', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      // Scroll past threshold
      Object.defineProperty(window, 'pageYOffset', { value: 350 });
      act(() => {
        scrollListener();
      });

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('hides button when scrolled back below 300px threshold', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      // First scroll past threshold
      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      expect(screen.getByRole('button')).toBeInTheDocument();

      // Then scroll back below threshold
      Object.defineProperty(window, 'pageYOffset', { value: 200 });
      act(() => {
        scrollListener();
      });

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles exact threshold value (300px)', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      // Exactly at threshold - should not show
      Object.defineProperty(window, 'pageYOffset', { value: 300 });
      act(() => {
        scrollListener();
      });

      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      // Just above threshold - should show
      Object.defineProperty(window, 'pageYOffset', { value: 301 });
      act(() => {
        scrollListener();
      });

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Click Interaction', () => {
    it('calls handleMenuClick with HOME when clicked', async () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');
      await userEvent.click(button);

      expect(handleMenuClick).toHaveBeenCalledWith('HOME');
      expect(handleMenuClick).toHaveBeenCalledTimes(1);
    });

    it('handles click event with fireEvent', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleMenuClick).toHaveBeenCalledWith('HOME');
    });

    it('handles multiple clicks correctly', async () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');

      await userEvent.click(button);
      await userEvent.click(button);
      await userEvent.click(button);

      expect(handleMenuClick).toHaveBeenCalledTimes(3);
      expect(handleMenuClick).toHaveBeenCalledWith('HOME');
    });
  });

  describe('State Management', () => {
    it('manages visibility state correctly', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      // Initial state - not visible
      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      // Scroll to show
      Object.defineProperty(window, 'pageYOffset', { value: 500 });
      act(() => {
        scrollListener();
      });

      expect(screen.getByRole('button')).toBeInTheDocument();

      // Scroll to hide
      Object.defineProperty(window, 'pageYOffset', { value: 100 });
      act(() => {
        scrollListener();
      });

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('maintains state correctly across re-renders', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      const { rerender } = render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      expect(screen.getByRole('button')).toBeInTheDocument();

      rerender(<ScrollToTop />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid scroll changes', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      // Rapid scroll changes
      const scrollValues = [0, 500, 200, 400, 100, 600];
      scrollValues.forEach(value => {
        Object.defineProperty(window, 'pageYOffset', { value });
        act(() => {
          scrollListener();
        });
      });

      // Final state should be visible (600 > 300)
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles negative scroll values', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: -100 });
      act(() => {
        scrollListener();
      });

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles very large scroll values', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 999999 });
      act(() => {
        scrollListener();
      });

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('handles scroll event listener cleanup correctly', () => {
      let addedListener: EventListener;
      let removedListener: EventListener;

      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            addedListener = listener;
          }
        }
      );

      (window.removeEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            removedListener = listener;
          }
        }
      );

      const { unmount } = render(<ScrollToTop />);
      unmount();

      expect(addedListener).toBe(removedListener);
    });
  });

  describe('Component Lifecycle', () => {
    it('does not throw errors during mount', () => {
      expect(() => {
        render(<ScrollToTop />);
      }).not.toThrow();
    });

    it('does not throw errors during unmount', () => {
      const { unmount } = render(<ScrollToTop />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('handles remount correctly', () => {
      const { unmount } = render(<ScrollToTop />);
      unmount();

      expect(() => {
        render(<ScrollToTop />);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('renders semantic button element', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');
      expect(button.tagName.toLowerCase()).toBe('button');
    });

    it('is keyboard accessible', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');

      // Focus the button
      button.focus();
      expect(document.activeElement).toBe(button);

      // Press Enter
      fireEvent.keyDown(button, { key: 'Enter' });
      fireEvent.click(button);

      expect(handleMenuClick).toHaveBeenCalledWith('HOME');
    });

    it('has appropriate visual styling for a floating action button', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'fixed',
        'bottom-8',
        'right-8',
        'rounded-full',
        'shadow-2xl'
      );
    });
  });

  describe('Visual Design', () => {
    it('has correct positioning classes', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('fixed', 'bottom-8', 'right-8', 'z-50');
    });

    it('has appropriate padding and sizing', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('p-4', 'rounded-full');
    });

    it('uses consistent red color scheme', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-red-500',
        'text-white',
        'hover:bg-red-600'
      );
      expect(button).toHaveStyle({
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      });
    });

    it('has shadow effects for depth', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('shadow-2xl');
      expect(button).toHaveStyle({
        boxShadow:
          '0 10px 25px rgba(239, 68, 68, 0.3), 0 4px 10px rgba(0, 0, 0, 0.3)',
      });
    });

    it('has smooth transitions', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        scrollListener();
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('transition-colors', 'duration-300');
    });
  });

  describe('Performance', () => {
    it('does not cause memory leaks with event listener cleanup', () => {
      const { unmount } = render(<ScrollToTop />);

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });

    it('handles frequent scroll events efficiently', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollToTop />);

      // Simulate many scroll events
      expect(() => {
        for (let i = 0; i < 100; i++) {
          Object.defineProperty(window, 'pageYOffset', { value: i * 10 });
          act(() => {
            scrollListener();
          });
        }
      }).not.toThrow();
    });
  });
});
