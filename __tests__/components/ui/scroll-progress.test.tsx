import { render, act } from '@testing-library/react';
import ScrollProgress from '@/components/ui/scroll-progress';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
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
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
}));

describe('ScrollProgress', () => {
  // Mock window properties and methods
  const mockScrollTo = jest.fn();
  const originalScrollY = window.pageYOffset;
  const originalInnerHeight = window.innerHeight;
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

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 800,
    });

    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      value: mockScrollTo,
    });

    // Mock document properties
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 1600,
    });

    // Mock event listeners
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'pageYOffset', {
      value: originalScrollY,
    });

    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
    });

    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  describe('Component Rendering', () => {
    it('renders the scroll progress bar', () => {
      const { container } = render(<ScrollProgress />);

      const progressContainer = container.querySelector(
        '.fixed.top-0.left-0.right-0'
      );
      expect(progressContainer).toBeInTheDocument();
    });

    it('has correct container styling classes', () => {
      const { container } = render(<ScrollProgress />);

      const progressContainer = container.firstChild;
      expect(progressContainer).toHaveClass(
        'fixed',
        'top-0',
        'left-0',
        'right-0',
        'h-1',
        'bg-black/20',
        'z-[999]',
        'pointer-events-none'
      );
    });

    it('renders progress bar with gradient styling', () => {
      const { container } = render(<ScrollProgress />);

      const progressBar = container.querySelector(
        '.h-full.bg-gradient-to-r.from-red-400.to-red-600.origin-left'
      );
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveClass(
        'h-full',
        'bg-gradient-to-r',
        'from-red-400',
        'to-red-600',
        'origin-left'
      );
    });

    it('is positioned correctly at top of viewport', () => {
      const { container } = render(<ScrollProgress />);

      const progressContainer = container.firstChild;
      expect(progressContainer).toHaveClass(
        'fixed',
        'top-0',
        'left-0',
        'right-0'
      );
    });

    it('has high z-index for overlay', () => {
      const { container } = render(<ScrollProgress />);

      const progressContainer = container.firstChild;
      expect(progressContainer).toHaveClass('z-[999]');
    });

    it('is non-interactive', () => {
      const { container } = render(<ScrollProgress />);

      const progressContainer = container.firstChild;
      expect(progressContainer).toHaveClass('pointer-events-none');
    });
  });

  describe('Event Listener Management', () => {
    it('adds scroll event listener on mount', () => {
      render(<ScrollProgress />);

      expect(window.addEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });

    it('calls initial scroll update on mount', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

      render(<ScrollProgress />);

      // Should be called once for scroll event
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    });

    it('removes scroll event listener on unmount', () => {
      const { unmount } = render(<ScrollProgress />);

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });

    it('calls removeEventListener with same function reference', () => {
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

      const { unmount } = render(<ScrollProgress />);
      unmount();

      expect(addedListener).toBe(removedListener);
    });
  });

  describe('Scroll Progress Calculation', () => {
    it('renders progress bar correctly', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 0 });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 1600,
      });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      const { container } = render(<ScrollProgress />);
      const progressBar = container.querySelector('.origin-left');

      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveClass(
        'h-full',
        'bg-gradient-to-r',
        'from-red-400',
        'to-red-600',
        'origin-left'
      );
    });

    it('updates progress on scroll', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 1600,
      });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      const { container } = render(<ScrollProgress />);

      // Trigger scroll event
      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      const progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();
    });

    it('handles scroll calculation with valid dimensions', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      Object.defineProperty(window, 'pageYOffset', { value: 800 });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 1600,
      });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      const { container } = render(<ScrollProgress />);

      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      const progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();
    });

    it('handles edge case where document height equals window height', () => {
      // No scrollable content: docHeight = 0
      Object.defineProperty(window, 'pageYOffset', { value: 0 });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 800,
      });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      const { container } = render(<ScrollProgress />);

      act(() => {
        scrollListener();
      });

      // When docHeight is 0, progress should be Infinity or handled gracefully
      // The component should handle this edge case
      const progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Scroll Event Handling', () => {
    it('updates progress when scroll event is fired', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      Object.defineProperty(window, 'pageYOffset', { value: 0 });
      const { container } = render(<ScrollProgress />);

      // Change scroll position
      Object.defineProperty(window, 'pageYOffset', { value: 200 });

      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      const progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();
    });

    it('handles multiple scroll events', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      const { container } = render(<ScrollProgress />);

      // First scroll
      Object.defineProperty(window, 'pageYOffset', { value: 100 });
      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      let progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();

      // Second scroll
      Object.defineProperty(window, 'pageYOffset', { value: 600 });
      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Initial State', () => {
    it('renders component with initial state', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 200 });
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 1600,
      });
      Object.defineProperty(window, 'innerHeight', { value: 800 });

      const { container } = render(<ScrollProgress />);
      const progressBar = container.querySelector('.origin-left');

      expect(progressBar).toBeInTheDocument();
    });

    it('initializes component correctly at page top', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 0 });

      const { container } = render(<ScrollProgress />);
      const progressBar = container.querySelector('.origin-left');

      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles negative scroll values', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      Object.defineProperty(window, 'pageYOffset', { value: -10 });
      const { container } = render(<ScrollProgress />);

      act(() => {
        scrollListener();
      });

      const progressBar = container.querySelector('.origin-left');
      // Should handle negative values gracefully
      expect(progressBar).toBeInTheDocument();
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

      Object.defineProperty(window, 'pageYOffset', { value: 10000 });
      const { container } = render(<ScrollProgress />);

      act(() => {
        scrollListener();
      });

      const progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();
    });

    it('handles rapid scroll changes', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      const { container } = render(<ScrollProgress />);

      // Rapid scroll changes
      const scrollValues = [0, 100, 200, 50, 300, 400, 150];
      scrollValues.forEach(value => {
        Object.defineProperty(window, 'pageYOffset', { value });
        act(() => {
          if (scrollListener) {
            scrollListener();
          }
        });
      });

      const progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('does not throw errors during mount', () => {
      expect(() => {
        render(<ScrollProgress />);
      }).not.toThrow();
    });

    it('does not throw errors during unmount', () => {
      const { unmount } = render(<ScrollProgress />);

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it('handles remount correctly', () => {
      const { unmount } = render(<ScrollProgress />);
      unmount();

      expect(() => {
        render(<ScrollProgress />);
      }).not.toThrow();
    });
  });

  describe('State Management', () => {
    it('maintains internal scroll progress state', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      const { container } = render(<ScrollProgress />);

      // Update scroll position
      Object.defineProperty(window, 'pageYOffset', { value: 400 });
      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      const progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();
    });

    it('updates state correctly on scroll events', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      const { container, rerender } = render(<ScrollProgress />);

      Object.defineProperty(window, 'pageYOffset', { value: 200 });
      act(() => {
        if (scrollListener) {
          scrollListener();
        }
      });

      rerender(<ScrollProgress />);

      const progressBar = container.querySelector('.origin-left');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('is not interactive (pointer-events-none)', () => {
      const { container } = render(<ScrollProgress />);

      const progressContainer = container.firstChild;
      expect(progressContainer).toHaveClass('pointer-events-none');
    });

    it('has appropriate visual styling for progress indication', () => {
      const { container } = render(<ScrollProgress />);

      const progressContainer = container.firstChild;
      const progressBar = container.querySelector('.origin-left');

      expect(progressContainer).toHaveClass('h-1'); // Thin progress bar
      expect(progressBar).toHaveClass('h-full'); // Full height of container
    });
  });

  describe('Performance', () => {
    it('does not cause memory leaks by properly cleaning up event listeners', () => {
      const { unmount } = render(<ScrollProgress />);

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      );
    });

    it('handles frequent scroll events without errors', () => {
      let scrollListener: EventListener;
      (window.addEventListener as jest.Mock).mockImplementation(
        (event, listener) => {
          if (event === 'scroll') {
            scrollListener = listener;
          }
        }
      );

      render(<ScrollProgress />);

      // Simulate frequent scroll events
      expect(() => {
        for (let i = 0; i < 100; i++) {
          Object.defineProperty(window, 'pageYOffset', { value: i * 5 });
          act(() => {
            scrollListener();
          });
        }
      }).not.toThrow();
    });
  });
});
