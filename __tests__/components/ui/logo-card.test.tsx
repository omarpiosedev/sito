import { render, screen } from '@testing-library/react';
import LogoCard from '@/components/ui/logo-card';

// Mock logo component for testing
const MockLogoComponent = ({ className }: { className?: string }) => (
  <div className={className} data-testid="mock-logo">
    Mock Logo
  </div>
);

const MockSvgLogoComponent = ({ className }: { className?: string }) => (
  <svg className={className} data-testid="mock-svg-logo" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="currentColor" />
  </svg>
);

describe('LogoCard', () => {
  const defaultProps = {
    LogoComponent: MockLogoComponent,
  };

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<LogoCard {...defaultProps} />);

      expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
    });

    it('renders the LogoComponent with correct className', () => {
      render(<LogoCard {...defaultProps} />);

      const logoElement = screen.getByTestId('mock-logo');
      expect(logoElement).toHaveClass(
        'text-red-500',
        'w-16',
        'h-16',
        'lg:w-24',
        'lg:h-24',
        'z-10'
      );
    });

    it('renders with SVG logo component', () => {
      render(<LogoCard LogoComponent={MockSvgLogoComponent} />);

      const svgLogo = screen.getByTestId('mock-svg-logo');
      expect(svgLogo).toBeInTheDocument();
      expect(svgLogo).toHaveClass(
        'text-red-500',
        'w-16',
        'h-16',
        'lg:w-24',
        'lg:h-24',
        'z-10'
      );
    });

    it('renders the container with correct styling classes', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild as HTMLElement;
      expect(cardContainer).toHaveClass(
        'bg-black/80',
        'backdrop-blur-xl',
        'border',
        'border-white/10',
        'rounded-xl',
        'flex',
        'items-center',
        'justify-center',
        'w-full',
        'h-full',
        'relative',
        'overflow-hidden'
      );
    });

    it('applies inline styles correctly', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild as HTMLElement;
      expect(cardContainer).toHaveStyle({
        background:
          'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.8) 100%)',
      });

      // Check that backdrop-filter and box-shadow properties are set
      expect(cardContainer.style.backdropFilter).toBe('blur(20px)');
      expect(cardContainer.style.boxShadow).toBe(
        '0 8px 32px 0 rgba(0,0,0,0.37), inset 0 1px 0 rgba(255,255,255,0.05)'
      );
    });

    it('renders the shine effect overlay', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const shineEffect = container.querySelector(
        '.absolute.inset-0.bg-gradient-to-br'
      );
      expect(shineEffect).toBeInTheDocument();
      expect(shineEffect).toHaveClass(
        'absolute',
        'inset-0',
        'bg-gradient-to-br',
        'from-white/5',
        'via-transparent',
        'to-transparent',
        'opacity-60'
      );
    });
  });

  describe('Logo Component Integration', () => {
    it('passes className prop to LogoComponent', () => {
      const ClassNameTestComponent = ({
        className,
      }: {
        className?: string;
      }) => (
        <div data-testid="className-test" className={className}>
          Test
        </div>
      );

      render(<LogoCard LogoComponent={ClassNameTestComponent} />);

      const testElement = screen.getByTestId('className-test');
      expect(testElement).toHaveClass(
        'text-red-500',
        'w-16',
        'h-16',
        'lg:w-24',
        'lg:h-24',
        'z-10'
      );
    });

    it('works with different logo component types', () => {
      const IconComponent = ({ className }: { className?: string }) => (
        <i className={className} data-testid="icon-logo">
          icon
        </i>
      );

      render(<LogoCard LogoComponent={IconComponent} />);

      expect(screen.getByTestId('icon-logo')).toBeInTheDocument();
    });

    it('works with component that does not use className', () => {
      const NoClassNameComponent = () => (
        <span data-testid="no-classname">No className</span>
      );

      render(<LogoCard LogoComponent={NoClassNameComponent} />);

      expect(screen.getByTestId('no-classname')).toBeInTheDocument();
    });
  });

  describe('Layout and Structure', () => {
    it('maintains correct container structure', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild;
      const logoElement = screen.getByTestId('mock-logo');
      const shineEffect = container.querySelector(
        '.absolute.inset-0.bg-gradient-to-br'
      );

      expect(cardContainer).toContainElement(logoElement);
      expect(cardContainer).toContainElement(shineEffect);
    });

    it('positions logo and shine effect correctly', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const logoElement = screen.getByTestId('mock-logo');
      const shineEffect = container.querySelector(
        '.absolute.inset-0.bg-gradient-to-br'
      );

      expect(logoElement).toHaveClass('z-10'); // Logo should be on top
      expect(shineEffect).toHaveClass('absolute', 'inset-0'); // Shine should cover full area
    });

    it('has proper flex layout for centering', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild as HTMLElement;
      expect(cardContainer).toHaveClass(
        'flex',
        'items-center',
        'justify-center'
      );
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive sizing classes to logo', () => {
      render(<LogoCard {...defaultProps} />);

      const logoElement = screen.getByTestId('mock-logo');
      expect(logoElement).toHaveClass('w-16', 'h-16', 'lg:w-24', 'lg:h-24');
    });

    it('maintains full width and height', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild as HTMLElement;
      expect(cardContainer).toHaveClass('w-full', 'h-full');
    });
  });

  describe('Visual Effects', () => {
    it('applies glassmorphism effect', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild as HTMLElement;
      expect(cardContainer).toHaveClass(
        'bg-black/80',
        'backdrop-blur-xl',
        'border',
        'border-white/10'
      );
    });

    it('has liquid glass shine overlay', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const shineEffect = container.querySelector('.bg-gradient-to-br');
      expect(shineEffect).toHaveClass(
        'from-white/5',
        'via-transparent',
        'to-transparent',
        'opacity-60'
      );
    });

    it('has rounded corners', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild as HTMLElement;
      expect(cardContainer).toHaveClass('rounded-xl');
    });

    it('has overflow hidden for proper containment', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild as HTMLElement;
      expect(cardContainer).toHaveClass('overflow-hidden');
    });
  });

  describe('Edge Cases', () => {
    it('handles LogoComponent that throws error gracefully', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      // Suppress console.error for this test
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<LogoCard LogoComponent={ErrorComponent} />);
      }).toThrow();

      consoleError.mockRestore();
    });

    it('works with minimal LogoComponent', () => {
      const MinimalComponent = () => <div data-testid="minimal">Min</div>;

      render(<LogoCard LogoComponent={MinimalComponent} />);

      expect(screen.getByTestId('minimal')).toBeInTheDocument();
    });

    it('works with complex LogoComponent', () => {
      const ComplexComponent = ({ className }: { className?: string }) => (
        <div className={className} data-testid="complex">
          <div>Inner</div>
          <span>Content</span>
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
      );

      render(<LogoCard LogoComponent={ComplexComponent} />);

      expect(screen.getByTestId('complex')).toBeInTheDocument();
      expect(screen.getByText('Inner')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Styling Consistency', () => {
    it('maintains consistent color scheme', () => {
      render(<LogoCard {...defaultProps} />);

      const logoElement = screen.getByTestId('mock-logo');
      expect(logoElement).toHaveClass('text-red-500');
    });

    it('has consistent shadow and blur effects', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild as HTMLElement;
      // Check individual style properties
      expect(cardContainer.style.backdropFilter).toBe('blur(20px)');
      expect(cardContainer.style.boxShadow).toBe(
        '0 8px 32px 0 rgba(0,0,0,0.37), inset 0 1px 0 rgba(255,255,255,0.05)'
      );
    });

    it('uses consistent gradient pattern', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      const cardContainer = container.firstChild as HTMLElement;
      expect(cardContainer).toHaveStyle({
        background:
          'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.8) 100%)',
      });
    });
  });

  describe('Accessibility', () => {
    it('maintains semantic structure', () => {
      const { container } = render(<LogoCard {...defaultProps} />);

      // Should have a div container with content
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
    });

    it('works with accessible LogoComponent', () => {
      const AccessibleComponent = ({ className }: { className?: string }) => (
        <img
          className={className}
          data-testid="accessible-logo"
          src="test.svg"
          alt="Company Logo"
        />
      );

      render(<LogoCard LogoComponent={AccessibleComponent} />);

      expect(screen.getByTestId('accessible-logo')).toBeInTheDocument();
      expect(screen.getByAltText('Company Logo')).toBeInTheDocument();
    });
  });

  describe('Component API', () => {
    it('has required LogoComponent prop', () => {
      // TypeScript should enforce this, but we can test the interface expectation
      expect(() => {
        render(<LogoCard {...defaultProps} />);
      }).not.toThrow();
    });

    it('LogoComponent receives expected props', () => {
      let receivedProps: Record<string, unknown> = {};

      const PropTestComponent = (props: Record<string, unknown>) => {
        receivedProps = props;
        return <div data-testid="prop-test">Test</div>;
      };

      render(<LogoCard LogoComponent={PropTestComponent} />);

      expect(receivedProps).toHaveProperty('className');
      expect(receivedProps.className).toContain('text-red-500');
    });
  });
});
