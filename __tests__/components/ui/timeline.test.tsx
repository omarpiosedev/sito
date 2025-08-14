import { render, screen, waitFor, act } from '@testing-library/react';
import { Timeline } from '@/components/ui/timeline';

// Mock framer-motion
jest.mock('motion/react', () => ({
  useScroll: jest.fn(() => ({
    scrollYProgress: { get: () => 0.5 },
  })),
  useTransform: jest.fn((scrollYProgress, input, output) => ({
    get: () => output[1], // Return transformed value
  })),
  motion: {
    div: ({ children, style, className, ...props }: any) => (
      <div
        className={className}
        style={
          typeof style === 'object' && style?.height
            ? { height: style.height }
            : {}
        }
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

// Mock GSAP
jest.mock('gsap', () => ({
  gsap: {
    registerPlugin: jest.fn(),
    fromTo: jest.fn(),
  },
}));

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: jest.fn(),
    getAll: jest.fn(() => [{ kill: jest.fn() }, { kill: jest.fn() }]),
  },
}));

// Mock getBoundingClientRect
const mockGetBoundingClientRect = jest.fn(() => ({
  height: 1000,
  width: 800,
  top: 0,
  left: 0,
  bottom: 1000,
  right: 800,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

// Mock ResizeObserver if needed
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Timeline', () => {
  const mockTimelineData = [
    {
      title: 'Frontend Development',
      content: (
        <div>
          <p>Started learning React and modern web technologies.</p>
          <ul>
            <li>React.js fundamentals</li>
            <li>TypeScript integration</li>
            <li>State management</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Full-Stack Development',
      content: (
        <div>
          <p>Expanded skills to include backend development.</p>
          <ul>
            <li>Node.js and Express</li>
            <li>Database design</li>
            <li>API development</li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Senior Developer',
      content: (
        <div>
          <p>Leading development teams and architecture decisions.</p>
          <ul>
            <li>Team leadership</li>
            <li>System architecture</li>
            <li>Code reviews</li>
          </ul>
        </div>
      ),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the element methods
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    Element.prototype.querySelectorAll = jest.fn(() => []);

    // Reset GSAP mocks
    const { gsap } = require('gsap');
    const { ScrollTrigger } = require('gsap/ScrollTrigger');
    gsap.fromTo.mockClear();
    gsap.registerPlugin.mockClear();
    ScrollTrigger.getAll.mockClear();

    // Mock innerHTML setter
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: jest.fn(),
      configurable: true,
    });

    // Mock textContent getter and setter
    Object.defineProperty(Element.prototype, 'textContent', {
      get: jest.fn(() => 'Mock text content'),
      set: jest.fn(),
      configurable: true,
    });
  });

  describe('Component Rendering', () => {
    it('renders the timeline with provided data', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      // Check for the main heading since GSAP modifies text content
      const mainHeading = container.querySelector('h2');
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveClass('text-2xl', 'md:text-3xl', 'lg:text-4xl');

      // Check for paragraph element
      const paragraph = container.querySelector('p');
      expect(paragraph).toBeInTheDocument();

      // Verify that we have the expected timeline structure
      const timelineContainer = container.querySelector('.relative.max-w-7xl');
      expect(timelineContainer).toBeInTheDocument();

      // Check that we get some content rendered from the data
      expect(container.querySelector('.sticky')).toBeInTheDocument();
    });

    it('renders the timeline description', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      // Check for paragraph element directly in the DOM since GSAP modifies text content
      const description = container.querySelector('p');
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass(
        'text-white/90',
        'text-sm',
        'md:text-base'
      );
    });

    it('renders all timeline items', () => {
      render(<Timeline data={mockTimelineData} />);

      mockTimelineData.forEach(item => {
        expect(screen.getByText(item.title)).toBeInTheDocument();
      });
    });

    it('renders timeline items content correctly', () => {
      render(<Timeline data={mockTimelineData} />);

      expect(
        screen.getByText('Started learning React and modern web technologies.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Expanded skills to include backend development.')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Leading development teams and architecture decisions.'
        )
      ).toBeInTheDocument();
    });

    it('has correct container structure and styling', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const timelineContainer = container.querySelector('.w-full.bg-black');
      expect(timelineContainer).toBeInTheDocument();
      expect(timelineContainer).toHaveClass('font-sans', 'md:px-10');
    });

    it('has correct header styling with Anton font', () => {
      render(<Timeline data={mockTimelineData} />);

      const header = screen.getByText('Changelog from my journey');
      expect(header).toHaveStyle({
        fontFamily: 'Anton, sans-serif',
        letterSpacing: '0.05em',
      });
      expect(header).toHaveClass(
        'text-2xl',
        'md:text-3xl',
        'lg:text-4xl',
        'mb-8',
        'text-white',
        'uppercase',
        'drop-shadow-lg'
      );
    });

    it('has correct description styling with Anton font', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const description = container.querySelector('p');
      expect(description).toHaveStyle({
        fontFamily: 'Anton, sans-serif',
        letterSpacing: '0.02em',
      });
      expect(description).toHaveClass(
        'text-white/90',
        'text-sm',
        'md:text-base',
        'max-w-3xl',
        'mx-auto',
        'leading-normal'
      );
    });
  });

  describe('Timeline Items Structure', () => {
    it('renders timeline items with correct structure', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const timelineItems = container.querySelectorAll('.flex.justify-start');
      expect(timelineItems).toHaveLength(mockTimelineData.length);
    });

    it('renders sticky elements for timeline items', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const stickyElements = container.querySelectorAll('.sticky');
      expect(stickyElements.length).toBeGreaterThan(0);
    });

    it('renders timeline dots correctly', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const dots = container.querySelectorAll('.h-10.absolute');
      expect(dots).toHaveLength(mockTimelineData.length);

      dots.forEach(dot => {
        expect(dot).toHaveClass('rounded-full', 'bg-white');
        const innerDot = dot.querySelector('.h-4.w-4');
        expect(innerDot).toBeInTheDocument();
        expect(innerDot).toHaveClass('rounded-full', 'bg-neutral-600');
      });
    });

    it('renders desktop and mobile titles separately', () => {
      render(<Timeline data={mockTimelineData} />);

      const desktopTitles = screen.getAllByText('Frontend Development');
      // Should have both desktop and mobile versions
      expect(desktopTitles.length).toBeGreaterThanOrEqual(1);
    });

    it('applies correct responsive classes to titles', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const desktopTitles = container.querySelectorAll('.hidden.md\\:block');
      const mobileTitles = container.querySelectorAll('.md\\:hidden.block');

      expect(desktopTitles.length).toBeGreaterThan(0);
      expect(mobileTitles.length).toBeGreaterThan(0);
    });
  });

  describe('GSAP Integration and Animations', () => {
    it('registers GSAP ScrollTrigger plugin', () => {
      const { gsap } = require('gsap');
      const { ScrollTrigger } = require('gsap/ScrollTrigger');

      render(<Timeline data={mockTimelineData} />);

      expect(gsap.registerPlugin).toHaveBeenCalledWith(ScrollTrigger);
    });

    it('calls GSAP animations for title and description', async () => {
      const { gsap } = require('gsap');

      await act(async () => {
        render(<Timeline data={mockTimelineData} />);
      });

      await waitFor(() => {
        // Should call GSAP fromTo for title and description animations
        expect(gsap.fromTo).toHaveBeenCalled();
      });
    });

    it('cleans up ScrollTrigger instances on unmount', async () => {
      const { ScrollTrigger } = require('gsap/ScrollTrigger');
      const { unmount } = render(<Timeline data={mockTimelineData} />);

      await act(async () => {
        unmount();
      });

      await waitFor(() => {
        expect(ScrollTrigger.getAll).toHaveBeenCalled();
      });
    });

    it('sets up scroll triggers for timeline items', async () => {
      const { gsap } = require('gsap');

      await act(async () => {
        render(<Timeline data={mockTimelineData} />);
      });

      await waitFor(() => {
        // GSAP should be called for each timeline item
        expect(gsap.fromTo).toHaveBeenCalled();
      });
    });
  });

  describe('Framer Motion Integration', () => {
    it('uses framer motion scroll integration', () => {
      const { useScroll } = require('motion/react');

      render(<Timeline data={mockTimelineData} />);

      expect(useScroll).toHaveBeenCalled();
    });

    it('uses transform for scroll-based animations', () => {
      const { useTransform } = require('motion/react');

      render(<Timeline data={mockTimelineData} />);

      expect(useTransform).toHaveBeenCalled();
    });

    it('renders motion.div for animated timeline line', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const animatedLine = container.querySelector('.absolute.inset-x-0');
      expect(animatedLine).toBeInTheDocument();
      expect(animatedLine).toHaveClass('bg-gradient-to-t');
    });
  });

  describe('Height Calculation and Refs', () => {
    it('calculates and sets timeline height based on ref', async () => {
      await act(async () => {
        render(<Timeline data={mockTimelineData} />);
      });

      await waitFor(() => {
        expect(mockGetBoundingClientRect).toHaveBeenCalled();
      });
    });

    it('updates height when ref changes', async () => {
      const { rerender } = render(<Timeline data={mockTimelineData} />);

      await act(async () => {
        rerender(<Timeline data={mockTimelineData} />);
      });

      await waitFor(() => {
        expect(mockGetBoundingClientRect).toHaveBeenCalled();
      });
    });

    it('renders timeline line with calculated height', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const timelineLine = container.querySelector('.absolute.md\\:left-8');
      expect(timelineLine).toBeInTheDocument();
      expect(timelineLine).toHaveStyle('height: 1000px');
    });
  });

  describe('Responsive Design', () => {
    it('has responsive padding on container', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const mainContainer = container.querySelector('.w-full.bg-black');
      expect(mainContainer).toHaveClass('md:px-10');
    });

    it('has responsive text sizes on header', () => {
      render(<Timeline data={mockTimelineData} />);

      const header = screen.getByText('Changelog from my journey');
      expect(header).toHaveClass('text-2xl', 'md:text-3xl', 'lg:text-4xl');
    });

    it('has responsive padding on content area', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const contentArea = container.querySelector('.max-w-7xl');
      expect(contentArea).toHaveClass('py-20', 'px-4', 'md:px-8', 'lg:px-10');
    });

    it('has responsive spacing for timeline items', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const timelineItems = container.querySelectorAll('.pt-10.md\\:pt-40');
      expect(timelineItems.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty data array', () => {
      render(<Timeline data={[]} />);

      expect(screen.getByText('Changelog from my journey')).toBeInTheDocument();

      const { container } = render(<Timeline data={[]} />);
      const timelineItems = container.querySelectorAll('.flex.justify-start');
      expect(timelineItems).toHaveLength(0);
    });

    it('handles single timeline item', () => {
      const singleItem = [mockTimelineData[0]];
      render(<Timeline data={singleItem} />);

      expect(screen.getByText('Frontend Development')).toBeInTheDocument();
      expect(
        screen.queryByText('Full-Stack Development')
      ).not.toBeInTheDocument();
    });

    it('handles very large number of timeline items', () => {
      const manyItems = Array.from({ length: 50 }, (_, i) => ({
        title: `Item ${i + 1}`,
        content: <div>Content {i + 1}</div>,
      }));

      render(<Timeline data={manyItems} />);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 50')).toBeInTheDocument();
    });

    it('handles timeline items without content', () => {
      const itemWithoutContent = [
        {
          title: 'Empty Item',
          content: null,
        },
      ];

      render(<Timeline data={itemWithoutContent} />);
      expect(screen.getByText('Empty Item')).toBeInTheDocument();
    });

    it('handles timeline items with complex content', () => {
      const complexContent = [
        {
          title: 'Complex Item',
          content: (
            <div>
              <h3>Nested Header</h3>
              <p>
                Paragraph with <strong>bold</strong> and <em>italic</em> text.
              </p>
              <button onClick={() => {}}>Interactive Button</button>
              <img src="test.jpg" alt="Test" />
            </div>
          ),
        },
      ];

      render(<Timeline data={complexContent} />);

      expect(screen.getByText('Complex Item')).toBeInTheDocument();
      expect(screen.getByText('Nested Header')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /interactive button/i })
      ).toBeInTheDocument();
    });

    it('handles very long titles', () => {
      const longTitleItem = [
        {
          title:
            "This is a very long timeline title that might wrap to multiple lines and test the component's ability to handle extensive text without breaking the layout",
          content: <div>Content</div>,
        },
      ];

      render(<Timeline data={longTitleItem} />);

      const longTitle = screen.getByText(content =>
        content.includes('This is a very long timeline title')
      );
      expect(longTitle).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('maintains semantic HTML structure', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const headings = container.querySelectorAll('h2, h3');
      expect(headings.length).toBeGreaterThan(0);

      const mainHeading = screen.getByRole('heading', {
        name: /changelog from my journey/i,
      });
      expect(mainHeading).toBeInTheDocument();
    });

    it('provides proper heading hierarchy', () => {
      render(<Timeline data={mockTimelineData} />);

      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Changelog from my journey');

      const h3Elements = screen.getAllByRole('heading', { level: 3 });
      expect(h3Elements.length).toBeGreaterThan(0);
    });

    it('maintains readable text contrast with white text on black background', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const mainContainer = container.querySelector('.bg-black');
      expect(mainContainer).toBeInTheDocument();

      const whiteText = container.querySelector('.text-white');
      expect(whiteText).toBeInTheDocument();
    });

    it('provides appropriate color contrast for timeline elements', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      // White background dots should have good contrast
      const whiteDots = container.querySelectorAll('.bg-white');
      expect(whiteDots.length).toBeGreaterThan(0);

      // Dark inner dots for contrast
      const darkInnerDots = container.querySelectorAll('.bg-neutral-600');
      expect(darkInnerDots.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Lifecycle', () => {
    it('does not cause memory leaks with proper cleanup', async () => {
      const { unmount } = render(<Timeline data={mockTimelineData} />);

      await act(async () => {
        unmount();
      });

      // ScrollTrigger cleanup should be called
      const { ScrollTrigger } = require('gsap/ScrollTrigger');
      expect(ScrollTrigger.getAll).toHaveBeenCalled();
    });

    it('handles component remounting gracefully', async () => {
      const { unmount, rerender } = render(
        <Timeline data={mockTimelineData} />
      );

      unmount();

      await act(async () => {
        rerender(<Timeline data={mockTimelineData} />);
      });

      expect(screen.getByText('Changelog from my journey')).toBeInTheDocument();
    });

    it('updates properly when data changes', () => {
      const initialData = [mockTimelineData[0]];
      const { rerender } = render(<Timeline data={initialData} />);

      expect(screen.getByText('Frontend Development')).toBeInTheDocument();
      expect(
        screen.queryByText('Full-Stack Development')
      ).not.toBeInTheDocument();

      rerender(<Timeline data={mockTimelineData} />);

      expect(screen.getByText('Frontend Development')).toBeInTheDocument();
      expect(screen.getByText('Full-Stack Development')).toBeInTheDocument();
    });
  });

  describe('Layout and Visual Design', () => {
    it('has correct gradient styling for timeline line', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const timelineLine = container.querySelector(
        '.bg-\\[linear-gradient\\(to_bottom\\,var\\(--tw-gradient-stops\\)\\)\\]'
      );
      expect(timelineLine).toBeInTheDocument();

      const animatedPortion = container.querySelector(
        '.bg-gradient-to-t.from-purple-500'
      );
      expect(animatedPortion).toBeInTheDocument();
    });

    it('applies correct mask styling to timeline line', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const maskedLine = container.querySelector(
        '[style*="mask-image:linear-gradient"]'
      );
      expect(maskedLine).toBeInTheDocument();
    });

    it('positions timeline elements correctly', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const stickyElements = container.querySelectorAll('.sticky.top-40');
      expect(stickyElements.length).toBeGreaterThan(0);
    });

    it('has proper spacing and margins', () => {
      const { container } = render(<Timeline data={mockTimelineData} />);

      const contentSections = container.querySelectorAll(
        '.pl-20.pr-4.md\\:pl-4'
      );
      expect(contentSections).toHaveLength(mockTimelineData.length);
    });
  });
});
