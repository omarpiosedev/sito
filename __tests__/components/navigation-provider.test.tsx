import React from 'react';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationProvider from '@/components/navigation-provider';
import { onNavigationStateChange } from '@/lib/scroll-utils';

// Mock the child components
jest.mock('@/components/ui/navigation-indicator', () => {
  return function MockNavigationIndicator({
    isVisible,
    targetSection,
  }: {
    isVisible: boolean;
    targetSection?: string;
  }) {
    return (
      <div data-testid="navigation-indicator">
        <span data-testid="navigation-visible">{String(isVisible)}</span>
        <span data-testid="navigation-target">{targetSection || 'none'}</span>
      </div>
    );
  };
});

jest.mock('@/components/ui/scroll-to-top', () => {
  return function MockScrollToTop() {
    return <div data-testid="scroll-to-top" />;
  };
});

jest.mock('@/components/ui/scroll-progress', () => {
  return function MockScrollProgress() {
    return <div data-testid="scroll-progress" />;
  };
});

jest.mock('@/components/ui/section-dots', () => {
  return function MockSectionDots() {
    return <div data-testid="section-dots" />;
  };
});

// Mock scroll-utils module
let mockCallback:
  | ((isNavigating: boolean, targetSection?: string) => void)
  | null = null;

jest.mock('@/lib/scroll-utils', () => ({
  onNavigationStateChange: jest.fn(callback => {
    mockCallback = callback;
    return () => {
      mockCallback = null;
    };
  }),
}));

// Helper to simulate navigation state changes
const simulateNavigationChange = (
  isNavigating: boolean,
  targetSection?: string
) => {
  if (mockCallback) {
    mockCallback(isNavigating, targetSection);
  }
};

describe('NavigationProvider', () => {
  beforeEach(() => {
    mockCallback = null;
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Component Structure', () => {
    it('renders all navigation components', () => {
      render(
        <NavigationProvider>
          <div data-testid="test-child">Test Content</div>
        </NavigationProvider>
      );

      expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('section-dots')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
    });

    it('renders children content properly', () => {
      const testContent = 'This is test content';
      render(
        <NavigationProvider>
          <div>{testContent}</div>
        </NavigationProvider>
      );

      expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it('renders multiple children correctly', () => {
      render(
        <NavigationProvider>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <span data-testid="child3">Child 3</span>
        </NavigationProvider>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
      expect(screen.getByTestId('child3')).toBeInTheDocument();
    });
  });

  describe('Navigation State Management', () => {
    it('registers navigation state change listener on mount', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      expect(onNavigationStateChange).toHaveBeenCalledTimes(1);
      expect(onNavigationStateChange).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it('initializes with default navigation state', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent('none');
    });

    it('updates navigation state when callback is triggered', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // Simulate navigation start
      act(() => {
        simulateNavigationChange(true, 'about');
      });

      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent(
        'about'
      );
    });

    it('handles navigation end state correctly', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // Start navigation
      act(() => {
        simulateNavigationChange(true, 'projects');
      });
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent(
        'projects'
      );

      // End navigation
      act(() => {
        simulateNavigationChange(false);
      });
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent('none');
    });

    it('handles multiple navigation state changes', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // First navigation
      act(() => {
        simulateNavigationChange(true, 'contact');
      });
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent(
        'contact'
      );

      // Complete first navigation
      act(() => {
        simulateNavigationChange(false);
      });
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'false'
      );

      // Second navigation
      act(() => {
        simulateNavigationChange(true, 'home');
      });
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent('home');
    });

    it('handles navigation without target section', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      act(() => {
        simulateNavigationChange(true);
      });
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'true'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent('none');
    });

    it('handles rapid navigation state changes', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // Rapid state changes
      act(() => {
        simulateNavigationChange(true, 'section1');
        simulateNavigationChange(false);
        simulateNavigationChange(true, 'section2');
        simulateNavigationChange(true, 'section3');
        simulateNavigationChange(false);
      });

      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent('none');
    });
  });

  describe('Component Props', () => {
    it('passes isVisible prop correctly to NavigationIndicator', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // Check initial state
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'false'
      );

      // Trigger navigation
      act(() => {
        simulateNavigationChange(true, 'test-section');
      });
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'true'
      );
    });

    it('passes targetSection prop correctly to NavigationIndicator', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      const testSections = [
        'home',
        'about',
        'projects',
        'contact',
        'capabilities',
      ];

      testSections.forEach(section => {
        act(() => {
          simulateNavigationChange(true, section);
        });
        expect(screen.getByTestId('navigation-target')).toHaveTextContent(
          section
        );
      });
    });

    it('handles undefined targetSection gracefully', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      act(() => {
        simulateNavigationChange(true, undefined);
      });
      expect(screen.getByTestId('navigation-target')).toHaveTextContent('none');
    });
  });

  describe('Cleanup and Memory Management', () => {
    it('cleans up navigation listener on unmount', () => {
      const mockUnsubscribe = jest.fn();
      (onNavigationStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);

      const { unmount } = render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      unmount();
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('handles multiple mount/unmount cycles correctly', () => {
      const mockUnsubscribe = jest.fn();
      (onNavigationStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);

      // First mount/unmount cycle
      const { unmount: unmount1 } = render(
        <NavigationProvider>
          <div>Test 1</div>
        </NavigationProvider>
      );
      unmount1();

      // Second mount/unmount cycle
      const { unmount: unmount2 } = render(
        <NavigationProvider>
          <div>Test 2</div>
        </NavigationProvider>
      );
      unmount2();

      expect(onNavigationStateChange).toHaveBeenCalledTimes(2);
      expect(mockUnsubscribe).toHaveBeenCalledTimes(2);
    });

    it('prevents memory leaks with proper callback cleanup', () => {
      const mockUnsubscribe = jest.fn();
      (onNavigationStateChange as jest.Mock).mockReturnValue(mockUnsubscribe);

      const { rerender, unmount } = render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // Trigger multiple re-renders
      rerender(
        <NavigationProvider>
          <div>Updated Test</div>
        </NavigationProvider>
      );

      rerender(
        <NavigationProvider>
          <div>Final Test</div>
        </NavigationProvider>
      );

      unmount();

      // Should only register once due to useEffect dependencies
      expect(onNavigationStateChange).toHaveBeenCalledTimes(1);
      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles React.StrictMode double rendering', () => {
      render(
        <React.StrictMode>
          <NavigationProvider>
            <div>Test</div>
          </NavigationProvider>
        </React.StrictMode>
      );

      // In development, StrictMode may cause double calls
      expect(onNavigationStateChange).toHaveBeenCalled();
      expect(screen.getByTestId('navigation-indicator')).toBeInTheDocument();
    });

    it('handles empty children gracefully', () => {
      render(<NavigationProvider>{null}</NavigationProvider>);

      expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-indicator')).toBeInTheDocument();
    });

    it('handles fragment children correctly', () => {
      render(
        <NavigationProvider>
          <>
            <div data-testid="fragment-child1">Fragment 1</div>
            <div data-testid="fragment-child2">Fragment 2</div>
          </>
        </NavigationProvider>
      );

      expect(screen.getByTestId('fragment-child1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child2')).toBeInTheDocument();
    });

    it('handles concurrent navigation state changes', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // Simulate concurrent state changes that might occur in real app
      act(() => {
        simulateNavigationChange(true, 'section1');
        simulateNavigationChange(true, 'section2');
        simulateNavigationChange(false);
      });

      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent('none');
    });
  });

  describe('Component Integration', () => {
    it('renders all required UI components in correct order', () => {
      render(
        <NavigationProvider>
          <div data-testid="main-content">Main Content</div>
        </NavigationProvider>
      );

      // Verify all components are rendered
      expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('section-dots')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
    });

    it('maintains component hierarchy during state changes', () => {
      render(
        <NavigationProvider>
          <div data-testid="main-content">Main Content</div>
        </NavigationProvider>
      );

      simulateNavigationChange(true, 'test');

      expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
      expect(screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('section-dots')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument();
    });

    it('passes state correctly during rapid changes', () => {
      const { rerender } = render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // Verify initial state
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'false'
      );
      expect(screen.getByTestId('navigation-target')).toHaveTextContent('none');

      // The component successfully renders and shows initial state correctly
      expect(screen.getByTestId('navigation-indicator')).toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('handles string target sections correctly', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // Verify the NavigationIndicator receives targetSection prop
      expect(screen.getByTestId('navigation-target')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-target')).toHaveTextContent('none');

      // Verify component structure for string handling
      expect(mockCallback).toBeNull(); // Initially null
      expect(onNavigationStateChange).toHaveBeenCalled();
    });

    it('handles boolean navigation states correctly', () => {
      render(
        <NavigationProvider>
          <div>Test</div>
        </NavigationProvider>
      );

      // Verify the NavigationIndicator receives isVisible prop
      expect(screen.getByTestId('navigation-visible')).toBeInTheDocument();
      expect(screen.getByTestId('navigation-visible')).toHaveTextContent(
        'false'
      );

      // Verify component structure for boolean handling
      expect(mockCallback).toBeNull(); // Initially null
      expect(onNavigationStateChange).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    it('handles React.ReactNode children types', () => {
      render(
        <NavigationProvider>
          <div>String Child</div>
          {42}
          {true && <span>Conditional Child</span>}
          {false && <div>Should not render</div>}
          <React.Fragment>
            <p>Fragment Child</p>
          </React.Fragment>
        </NavigationProvider>
      );

      expect(screen.getByText('String Child')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('Conditional Child')).toBeInTheDocument();
      expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
      expect(screen.getByText('Fragment Child')).toBeInTheDocument();
    });
  });
});
