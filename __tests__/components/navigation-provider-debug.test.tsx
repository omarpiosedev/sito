import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationProvider from '@/components/navigation-provider';

// Mock all child components with simpler implementations
jest.mock('@/components/ui/navigation-indicator', () => {
  return function MockNavigationIndicator(props: any) {
    console.log('NavigationIndicator props:', props);
    return (
      <div data-testid="navigation-indicator">
        <span data-testid="navigation-visible">{String(props.isVisible)}</span>
        <span data-testid="navigation-target">
          {props.targetSection || 'none'}
        </span>
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

// Mock scroll-utils with real callback simulation
let callback: ((isNavigating: boolean, targetSection?: string) => void) | null =
  null;

jest.mock('@/lib/scroll-utils', () => ({
  onNavigationStateChange: jest.fn(cb => {
    console.log('Registering callback');
    callback = cb;
    return () => {
      console.log('Unregistering callback');
      callback = null;
    };
  }),
}));

const triggerNavigation = (isNavigating: boolean, targetSection?: string) => {
  console.log('Triggering navigation:', { isNavigating, targetSection });
  if (callback) {
    callback(isNavigating, targetSection);
  }
};

describe('NavigationProvider Debug', () => {
  beforeEach(() => {
    callback = null;
    jest.clearAllMocks();
  });

  it('should properly update navigation state', () => {
    render(
      <NavigationProvider>
        <div>Test Content</div>
      </NavigationProvider>
    );

    // Check initial state
    console.log(
      'Initial visible:',
      screen.getByTestId('navigation-visible').textContent
    );
    console.log(
      'Initial target:',
      screen.getByTestId('navigation-target').textContent
    );

    expect(screen.getByTestId('navigation-visible')).toHaveTextContent('false');
    expect(screen.getByTestId('navigation-target')).toHaveTextContent('none');

    // Trigger navigation
    act(() => {
      triggerNavigation(true, 'about');
    });

    console.log(
      'After trigger visible:',
      screen.getByTestId('navigation-visible').textContent
    );
    console.log(
      'After trigger target:',
      screen.getByTestId('navigation-target').textContent
    );

    expect(screen.getByTestId('navigation-visible')).toHaveTextContent('true');
    expect(screen.getByTestId('navigation-target')).toHaveTextContent('about');
  });
});
