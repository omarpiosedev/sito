import { render, screen, waitFor } from '@testing-library/react';
import NavigationIndicator from '@/components/ui/navigation-indicator';

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
      exit?: any;
      transition?: any;
      [key: string]: any;
    }) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('NavigationIndicator', () => {
  const defaultProps = {
    isVisible: true,
    targetSection: 'home',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders when visible', () => {
      render(<NavigationIndicator {...defaultProps} />);

      expect(screen.getByText('NAVIGATING TO')).toBeInTheDocument();
      expect(screen.getByText('HOME')).toBeInTheDocument();
    });

    it('does not render when not visible', () => {
      render(<NavigationIndicator isVisible={false} targetSection="home" />);

      expect(screen.queryByText('NAVIGATING TO')).not.toBeInTheDocument();
      expect(screen.queryByText('HOME')).not.toBeInTheDocument();
    });

    it('renders without targetSection', () => {
      render(<NavigationIndicator isVisible={true} />);

      expect(screen.getByText('NAVIGATING TO')).toBeInTheDocument();
      // Should have empty display text initially
    });

    it('renders with undefined targetSection', () => {
      render(
        <NavigationIndicator isVisible={true} targetSection={undefined} />
      );

      expect(screen.getByText('NAVIGATING TO')).toBeInTheDocument();
    });
  });

  describe('Section Name Mapping', () => {
    const sectionMappings = [
      { input: 'home', expected: 'HOME' },
      { input: 'about', expected: 'ABOUT ME' },
      { input: 'projects', expected: 'PROJECTS' },
      { input: 'capabilities', expected: 'CAPABILITIES' },
      { input: 'process', expected: 'PROCESS' },
      { input: 'feedbacks', expected: 'FEEDBACKS' },
      { input: 'contact', expected: 'CONTACT' },
    ];

    sectionMappings.forEach(({ input, expected }) => {
      it(`maps ${input} section to ${expected}`, async () => {
        render(<NavigationIndicator isVisible={true} targetSection={input} />);

        await waitFor(() => {
          expect(screen.getByText(expected)).toBeInTheDocument();
        });
      });
    });

    it('handles unknown section by converting to uppercase', async () => {
      render(
        <NavigationIndicator isVisible={true} targetSection="custom-section" />
      );

      await waitFor(() => {
        expect(screen.getByText('CUSTOM-SECTION')).toBeInTheDocument();
      });
    });

    it('handles section with mixed case', async () => {
      render(
        <NavigationIndicator isVisible={true} targetSection="MyCustomSection" />
      );

      await waitFor(() => {
        expect(screen.getByText('MYCUSTOMSECTION')).toBeInTheDocument();
      });
    });

    it('handles empty string section', async () => {
      render(<NavigationIndicator isVisible={true} targetSection="" />);

      await waitFor(() => {
        // Should render the component but with empty text
        expect(screen.getByText('NAVIGATING TO')).toBeInTheDocument();
      });
    });
  });

  describe('Visibility State Changes', () => {
    it('updates display text when becoming visible', async () => {
      const { rerender } = render(
        <NavigationIndicator isVisible={false} targetSection="about" />
      );

      expect(screen.queryByText('ABOUT ME')).not.toBeInTheDocument();

      rerender(<NavigationIndicator isVisible={true} targetSection="about" />);

      await waitFor(() => {
        expect(screen.getByText('ABOUT ME')).toBeInTheDocument();
      });
    });

    it('maintains text when visible and targetSection changes', async () => {
      const { rerender } = render(
        <NavigationIndicator isVisible={true} targetSection="home" />
      );

      await waitFor(() => {
        expect(screen.getByText('HOME')).toBeInTheDocument();
      });

      rerender(
        <NavigationIndicator isVisible={true} targetSection="projects" />
      );

      await waitFor(() => {
        expect(screen.getByText('PROJECTS')).toBeInTheDocument();
        expect(screen.queryByText('HOME')).not.toBeInTheDocument();
      });
    });

    it('does not update text when not visible even if targetSection changes', async () => {
      const { rerender } = render(
        <NavigationIndicator isVisible={false} targetSection="home" />
      );

      expect(screen.queryByText('HOME')).not.toBeInTheDocument();

      rerender(
        <NavigationIndicator isVisible={false} targetSection="projects" />
      );

      await waitFor(() => {
        expect(screen.queryByText('PROJECTS')).not.toBeInTheDocument();
        expect(screen.queryByText('HOME')).not.toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    it('has correct container classes', () => {
      const { container } = render(<NavigationIndicator {...defaultProps} />);

      const mainContainer = container.querySelector(
        '.fixed.top-1\\/2.left-1\\/2'
      );
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass(
        'fixed',
        'top-1/2',
        'left-1/2',
        'transform',
        '-translate-x-1/2',
        '-translate-y-1/2',
        'z-[999]',
        'pointer-events-none'
      );
    });

    it('has glassmorphism effect on inner container', () => {
      const { container } = render(<NavigationIndicator {...defaultProps} />);

      const innerContainer = container.querySelector(
        '.bg-black\\/80.backdrop-blur-xl'
      );
      expect(innerContainer).toBeInTheDocument();
      expect(innerContainer).toHaveClass(
        'bg-black/80',
        'backdrop-blur-xl',
        'border',
        'border-white/20',
        'rounded-2xl',
        'px-8',
        'py-6',
        'text-center',
        'shadow-2xl'
      );
    });

    it('renders progress bar element', () => {
      const { container } = render(<NavigationIndicator {...defaultProps} />);

      const progressBar = container.querySelector(
        '.h-1.bg-gradient-to-r.from-red-400.to-red-600'
      );
      expect(progressBar).toBeInTheDocument();
      expect(progressBar).toHaveClass(
        'h-1',
        'bg-gradient-to-r',
        'from-red-400',
        'to-red-600',
        'rounded-full',
        'mb-4'
      );
    });

    it('renders navigation text with correct styling', () => {
      render(<NavigationIndicator {...defaultProps} />);

      const navText = screen.getByText('NAVIGATING TO');
      expect(navText).toHaveClass(
        'text-white',
        'font-light',
        'text-lg',
        'tracking-wide',
        'mb-2'
      );
      expect(navText).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
    });

    it('renders target section text with correct styling', async () => {
      render(<NavigationIndicator {...defaultProps} />);

      await waitFor(() => {
        const sectionText = screen.getByText('HOME');
        expect(sectionText).toHaveClass(
          'text-red-400',
          'font-bold',
          'text-2xl',
          'tracking-wider'
        );
        expect(sectionText).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
      });
    });

    it('renders animated dots', () => {
      const { container } = render(<NavigationIndicator {...defaultProps} />);

      const dotsContainer = container.querySelector(
        '.flex.justify-center.space-x-1.mt-4'
      );
      expect(dotsContainer).toBeInTheDocument();

      const dots = container.querySelectorAll(
        '.w-2.h-2.bg-red-400.rounded-full'
      );
      expect(dots).toHaveLength(3);
    });
  });

  describe('Font Family Styling', () => {
    it('applies Anton font to navigation text', () => {
      render(<NavigationIndicator {...defaultProps} />);

      const navText = screen.getByText('NAVIGATING TO');
      expect(navText).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
    });

    it('applies Anton font to section text', async () => {
      render(<NavigationIndicator {...defaultProps} />);

      await waitFor(() => {
        const sectionText = screen.getByText('HOME');
        expect(sectionText).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
      });
    });
  });

  describe('Animation Elements', () => {
    it('renders progress bar with animation classes', () => {
      const { container } = render(<NavigationIndicator {...defaultProps} />);

      const progressBar = container.querySelector('.h-1.bg-gradient-to-r');
      expect(progressBar).toBeInTheDocument();
    });

    it('renders section text with animation wrapper', async () => {
      render(<NavigationIndicator {...defaultProps} />);

      await waitFor(() => {
        const sectionText = screen.getByText('HOME');
        expect(sectionText).toBeInTheDocument();
      });
    });

    it('renders animated dots with correct count and classes', () => {
      const { container } = render(<NavigationIndicator {...defaultProps} />);

      const dots = container.querySelectorAll(
        '.w-2.h-2.bg-red-400.rounded-full'
      );
      expect(dots).toHaveLength(3);

      dots.forEach(dot => {
        expect(dot).toHaveClass('w-2', 'h-2', 'bg-red-400', 'rounded-full');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid visibility changes', async () => {
      const { rerender } = render(
        <NavigationIndicator isVisible={false} targetSection="home" />
      );

      // Rapidly toggle visibility
      rerender(<NavigationIndicator isVisible={true} targetSection="home" />);
      rerender(<NavigationIndicator isVisible={false} targetSection="home" />);
      rerender(<NavigationIndicator isVisible={true} targetSection="home" />);

      await waitFor(() => {
        expect(screen.getByText('NAVIGATING TO')).toBeInTheDocument();
        expect(screen.getByText('HOME')).toBeInTheDocument();
      });
    });

    it('handles rapid section changes while visible', async () => {
      const { rerender } = render(
        <NavigationIndicator isVisible={true} targetSection="home" />
      );

      await waitFor(() => {
        expect(screen.getByText('HOME')).toBeInTheDocument();
      });

      // Rapidly change sections
      rerender(<NavigationIndicator isVisible={true} targetSection="about" />);
      rerender(
        <NavigationIndicator isVisible={true} targetSection="projects" />
      );
      rerender(
        <NavigationIndicator isVisible={true} targetSection="contact" />
      );

      await waitFor(() => {
        expect(screen.getByText('CONTACT')).toBeInTheDocument();
      });
    });

    it('handles null targetSection', () => {
      render(
        <NavigationIndicator isVisible={true} targetSection={null as any} />
      );

      expect(screen.getByText('NAVIGATING TO')).toBeInTheDocument();
    });

    it('handles numeric section names', async () => {
      render(<NavigationIndicator isVisible={true} targetSection="123" />);

      await waitFor(() => {
        expect(screen.getByText('123')).toBeInTheDocument();
      });
    });

    it('handles special characters in section names', async () => {
      render(
        <NavigationIndicator isVisible={true} targetSection="test-section_2!" />
      );

      await waitFor(() => {
        expect(screen.getByText('TEST-SECTION_2!')).toBeInTheDocument();
      });
    });
  });

  describe('Component State Management', () => {
    it('manages internal state correctly with useEffect', async () => {
      const { rerender } = render(
        <NavigationIndicator isVisible={false} targetSection="home" />
      );

      // Initially not visible, no text should be set
      expect(screen.queryByText('HOME')).not.toBeInTheDocument();

      // Make visible with section
      rerender(<NavigationIndicator isVisible={true} targetSection="about" />);

      await waitFor(() => {
        expect(screen.getByText('ABOUT ME')).toBeInTheDocument();
      });

      // Change section while visible
      rerender(
        <NavigationIndicator isVisible={true} targetSection="projects" />
      );

      await waitFor(() => {
        expect(screen.getByText('PROJECTS')).toBeInTheDocument();
      });
    });

    it('preserves state correctly across re-renders', async () => {
      const { rerender } = render(
        <NavigationIndicator isVisible={true} targetSection="capabilities" />
      );

      await waitFor(() => {
        expect(screen.getByText('CAPABILITIES')).toBeInTheDocument();
      });

      // Re-render with same props
      rerender(
        <NavigationIndicator isVisible={true} targetSection="capabilities" />
      );

      expect(screen.getByText('CAPABILITIES')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains proper text hierarchy', () => {
      render(<NavigationIndicator {...defaultProps} />);

      const navText = screen.getByText('NAVIGATING TO');
      const sectionText = screen.getByText('HOME');

      expect(navText).toBeInTheDocument();
      expect(sectionText).toBeInTheDocument();
    });

    it('has proper z-index for overlay', () => {
      const { container } = render(<NavigationIndicator {...defaultProps} />);

      const overlay = container.querySelector('.z-\\[999\\]');
      expect(overlay).toBeInTheDocument();
    });

    it('is non-interactive with pointer-events-none', () => {
      const { container } = render(<NavigationIndicator {...defaultProps} />);

      const overlay = container.querySelector('.pointer-events-none');
      expect(overlay).toBeInTheDocument();
    });
  });
});
