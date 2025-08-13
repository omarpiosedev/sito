import { render, screen } from '@testing-library/react';
import ScrollIndicator from '@/components/ui/scroll-indicator';

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

describe('ScrollIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<ScrollIndicator />);

      expect(screen.getByText('Scroll')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = render(
        <ScrollIndicator className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders without className', () => {
      const { container } = render(<ScrollIndicator />);

      expect(container.firstChild).toHaveClass(
        'flex',
        'flex-col',
        'items-center'
      );
    });

    it('combines default classes with custom className', () => {
      const { container } = render(
        <ScrollIndicator className="my-custom-class" />
      );

      expect(container.firstChild).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'my-custom-class'
      );
    });
  });

  describe('Scroll Text', () => {
    it('renders scroll text with correct content', () => {
      render(<ScrollIndicator />);

      const scrollText = screen.getByText('Scroll');
      expect(scrollText).toBeInTheDocument();
    });

    it('applies correct styling classes to scroll text', () => {
      render(<ScrollIndicator />);

      const scrollText = screen.getByText('Scroll');
      expect(scrollText).toHaveClass(
        'text-white/70',
        'text-sm',
        'font-light',
        'mb-6',
        'tracking-widest',
        'uppercase'
      );
    });

    it('applies Anton font family to scroll text', () => {
      render(<ScrollIndicator />);

      const scrollText = screen.getByText('Scroll');
      expect(scrollText).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
    });
  });

  describe('Desktop Mouse Indicator', () => {
    it('renders desktop mouse container', () => {
      const { container } = render(<ScrollIndicator />);

      const mouseContainer = container.querySelector(
        '.relative.hidden.md\\:block'
      );
      expect(mouseContainer).toBeInTheDocument();
    });

    it('renders mouse body with correct styling', () => {
      const { container } = render(<ScrollIndicator />);

      const mouseBody = container.querySelector(
        '.w-6.h-10.border-2.border-white\\/40.rounded-full.relative'
      );
      expect(mouseBody).toBeInTheDocument();
      expect(mouseBody).toHaveClass(
        'w-6',
        'h-10',
        'border-2',
        'border-white/40',
        'rounded-full',
        'relative'
      );
    });

    it('renders animated scroll wheel', () => {
      const { container } = render(<ScrollIndicator />);

      const scrollWheel = container.querySelector(
        '.absolute.top-2.left-1\\/2.transform.-translate-x-1\\/2.w-1.h-3.bg-white\\/60.rounded-full'
      );
      expect(scrollWheel).toBeInTheDocument();
      expect(scrollWheel).toHaveClass(
        'absolute',
        'top-2',
        'left-1/2',
        'transform',
        '-translate-x-1/2',
        'w-1',
        'h-3',
        'bg-white/60',
        'rounded-full'
      );
    });

    it('has correct responsive visibility for desktop', () => {
      const { container } = render(<ScrollIndicator />);

      const mouseContainer = container.querySelector('.hidden.md\\:block');
      expect(mouseContainer).toHaveClass('hidden', 'md:block');
    });
  });

  describe('Mobile Touch Indicator', () => {
    it('renders mobile touch container', () => {
      const { container } = render(<ScrollIndicator />);

      const touchContainer = container.querySelector(
        '.relative.block.md\\:hidden'
      );
      expect(touchContainer).toBeInTheDocument();
    });

    it('renders touch dots container with correct layout', () => {
      const { container } = render(<ScrollIndicator />);

      const dotsContainer = container.querySelector(
        '.flex.flex-col.items-center.space-y-1'
      );
      expect(dotsContainer).toBeInTheDocument();
      expect(dotsContainer).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'space-y-1'
      );
    });

    it('renders three animated dots', () => {
      const { container } = render(<ScrollIndicator />);

      const dots = container.querySelectorAll(
        '.w-1.h-1.bg-white\\/70.rounded-full'
      );
      expect(dots).toHaveLength(3);

      dots.forEach(dot => {
        expect(dot).toHaveClass('w-1', 'h-1', 'bg-white/70', 'rounded-full');
      });
    });

    it('has correct responsive visibility for mobile', () => {
      const { container } = render(<ScrollIndicator />);

      const touchContainer = container.querySelector('.block.md\\:hidden');
      expect(touchContainer).toHaveClass('block', 'md:hidden');
    });
  });

  describe('Component Structure', () => {
    it('maintains correct layout hierarchy', () => {
      const { container } = render(<ScrollIndicator />);

      const mainContainer = container.firstChild;
      const scrollText = screen.getByText('Scroll');
      const mouseContainer = container.querySelector('.hidden.md\\:block');
      const touchContainer = container.querySelector('.block.md\\:hidden');

      expect(mainContainer).toContainElement(scrollText);
      expect(mainContainer).toContainElement(mouseContainer);
      expect(mainContainer).toContainElement(touchContainer);
    });

    it('has proper flexbox layout', () => {
      const { container } = render(<ScrollIndicator />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('flex', 'flex-col', 'items-center');
    });
  });

  describe('Responsive Design', () => {
    it('shows mouse indicator on desktop only', () => {
      const { container } = render(<ScrollIndicator />);

      const mouseContainer = container.querySelector('.hidden.md\\:block');
      expect(mouseContainer).toHaveClass('hidden', 'md:block');
    });

    it('shows touch indicator on mobile only', () => {
      const { container } = render(<ScrollIndicator />);

      const touchContainer = container.querySelector('.block.md\\:hidden');
      expect(touchContainer).toHaveClass('block', 'md:hidden');
    });

    it('ensures both indicators are mutually exclusive', () => {
      const { container } = render(<ScrollIndicator />);

      const mouseContainer = container.querySelector('.hidden.md\\:block');
      const touchContainer = container.querySelector('.block.md\\:hidden');

      expect(mouseContainer).toBeInTheDocument();
      expect(touchContainer).toBeInTheDocument();

      // One should be hidden on mobile, the other hidden on desktop
      expect(mouseContainer).toHaveClass('hidden');
      expect(touchContainer).toHaveClass('block');
    });
  });

  describe('Animation Elements', () => {
    it('renders scroll text with animation wrapper', () => {
      render(<ScrollIndicator />);

      const scrollText = screen.getByText('Scroll');
      expect(scrollText).toBeInTheDocument();
    });

    it('renders mouse container with animation wrapper', () => {
      const { container } = render(<ScrollIndicator />);

      const mouseContainer = container.querySelector(
        '.relative.hidden.md\\:block'
      );
      expect(mouseContainer).toBeInTheDocument();
    });

    it('renders touch container with animation wrapper', () => {
      const { container } = render(<ScrollIndicator />);

      const touchContainer = container.querySelector(
        '.relative.block.md\\:hidden'
      );
      expect(touchContainer).toBeInTheDocument();
    });

    it('renders animated scroll wheel in mouse indicator', () => {
      const { container } = render(<ScrollIndicator />);

      const scrollWheel = container.querySelector('.absolute.top-2.left-1\\/2');
      expect(scrollWheel).toBeInTheDocument();
    });

    it('renders animated dots in touch indicator', () => {
      const { container } = render(<ScrollIndicator />);

      const dots = container.querySelectorAll(
        '.w-1.h-1.bg-white\\/70.rounded-full'
      );
      expect(dots).toHaveLength(3);
    });
  });

  describe('Styling Consistency', () => {
    it('uses consistent white/opacity color scheme', () => {
      const { container } = render(<ScrollIndicator />);

      const scrollText = screen.getByText('Scroll');
      const mouseBody = container.querySelector('.border-white\\/40');
      const scrollWheel = container.querySelector('.bg-white\\/60');
      const dots = container.querySelectorAll('.bg-white\\/70');

      expect(scrollText).toHaveClass('text-white/70');
      expect(mouseBody).toHaveClass('border-white/40');
      expect(scrollWheel).toHaveClass('bg-white/60');
      expect(dots).toHaveLength(3);
    });

    it('uses consistent spacing and sizing', () => {
      render(<ScrollIndicator />);

      const scrollText = screen.getByText('Scroll');
      expect(scrollText).toHaveClass('mb-6');
    });

    it('maintains consistent typography', () => {
      render(<ScrollIndicator />);

      const scrollText = screen.getByText('Scroll');
      expect(scrollText).toHaveClass(
        'text-sm',
        'font-light',
        'tracking-widest',
        'uppercase'
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles empty className', () => {
      const { container } = render(<ScrollIndicator className="" />);

      expect(container.firstChild).toHaveClass(
        'flex',
        'flex-col',
        'items-center'
      );
    });

    it('handles multiple custom classes', () => {
      const { container } = render(
        <ScrollIndicator className="class1 class2 class3" />
      );

      expect(container.firstChild).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'class1',
        'class2',
        'class3'
      );
    });

    it('handles whitespace in className', () => {
      const { container } = render(
        <ScrollIndicator className="  spaced-class  " />
      );

      expect(container.firstChild).toHaveClass('spaced-class');
    });

    it('renders correctly without any props', () => {
      render(<ScrollIndicator />);

      expect(screen.getByText('Scroll')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders semantic text content', () => {
      render(<ScrollIndicator />);

      const scrollText = screen.getByText('Scroll');
      expect(scrollText).toBeInTheDocument();
      expect(scrollText).toHaveTextContent('Scroll');
    });

    it('maintains proper visual hierarchy', () => {
      const { container } = render(<ScrollIndicator />);

      const scrollText = screen.getByText('Scroll');
      const mouseContainer = container.querySelector(
        '.relative.hidden.md\\:block'
      );
      const touchContainer = container.querySelector(
        '.relative.block.md\\:hidden'
      );

      expect(scrollText).toBeInTheDocument();
      expect(mouseContainer).toBeInTheDocument();
      expect(touchContainer).toBeInTheDocument();
    });

    it('provides appropriate visual cues for different devices', () => {
      const { container } = render(<ScrollIndicator />);

      // Desktop: mouse with scroll wheel
      const mouseIndicator = container.querySelector('.hidden.md\\:block');
      const scrollWheel = container.querySelector('.w-1.h-3');

      // Mobile: touch dots
      const touchIndicator = container.querySelector('.block.md\\:hidden');
      const touchDots = container.querySelectorAll('.w-1.h-1');

      expect(mouseIndicator).toBeInTheDocument();
      expect(scrollWheel).toBeInTheDocument();
      expect(touchIndicator).toBeInTheDocument();
      expect(touchDots).toHaveLength(3);
    });
  });

  describe('Component Behavior', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<ScrollIndicator />);

      expect(screen.getByText('Scroll')).toBeInTheDocument();

      rerender(<ScrollIndicator className="new-class" />);

      expect(screen.getByText('Scroll')).toBeInTheDocument();
    });

    it('maintains state independence', () => {
      const { container: container1 } = render(<ScrollIndicator />);
      const { container: container2 } = render(
        <ScrollIndicator className="different" />
      );

      expect(container1.firstChild).not.toHaveClass('different');
      expect(container2.firstChild).toHaveClass('different');
    });
  });

  describe('Mouse Indicator Details', () => {
    it('positions scroll wheel correctly within mouse body', () => {
      const { container } = render(<ScrollIndicator />);

      const scrollWheel = container.querySelector(
        '.absolute.top-2.left-1\\/2.transform.-translate-x-1\\/2'
      );
      expect(scrollWheel).toBeInTheDocument();
      expect(scrollWheel).toHaveClass(
        'absolute',
        'top-2',
        'left-1/2',
        'transform',
        '-translate-x-1/2'
      );
    });

    it('has proper dimensions for mouse components', () => {
      const { container } = render(<ScrollIndicator />);

      const mouseBody = container.querySelector('.w-6.h-10');
      const scrollWheel = container.querySelector('.w-1.h-3');

      expect(mouseBody).toHaveClass('w-6', 'h-10');
      expect(scrollWheel).toHaveClass('w-1', 'h-3');
    });
  });

  describe('Touch Indicator Details', () => {
    it('arranges touch dots in vertical column', () => {
      const { container } = render(<ScrollIndicator />);

      const dotsContainer = container.querySelector(
        '.flex.flex-col.items-center.space-y-1'
      );
      expect(dotsContainer).toBeInTheDocument();
      expect(dotsContainer).toHaveClass(
        'flex-col',
        'items-center',
        'space-y-1'
      );
    });

    it('ensures all touch dots have uniform styling', () => {
      const { container } = render(<ScrollIndicator />);

      const dots = container.querySelectorAll(
        '.w-1.h-1.bg-white\\/70.rounded-full'
      );
      expect(dots).toHaveLength(3);

      dots.forEach(dot => {
        expect(dot).toHaveClass('w-1', 'h-1', 'bg-white/70', 'rounded-full');
      });
    });
  });
});
