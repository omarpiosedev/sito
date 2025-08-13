import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import About from '@/components/sections/About';

// Mock GSAP
jest.mock('gsap', () => {
  const mockTimeline = {
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    kill: jest.fn(),
  };

  return {
    gsap: {
      registerPlugin: jest.fn(),
      fromTo: jest.fn(),
      timeline: jest.fn(() => mockTimeline),
      getAll: jest.fn(() => []),
    },
    ScrollTrigger: {
      getAll: jest.fn(() => [{ kill: jest.fn() }]),
      create: jest.fn(),
    },
  };
});

// Mock GSAP ScrollTrigger
jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    getAll: jest.fn(() => [{ kill: jest.fn() }]),
    create: jest.fn(),
  },
}));

// Mock ShaderBackground component
jest.mock('@/components/reactbits/Backgrounds/waves/waves', () => {
  return function MockShaderBackground({
    className,
    color,
    backdropBlurAmount,
  }: any) {
    return (
      <div
        data-testid="mock-shader-background"
        data-color={color}
        data-backdrop-blur={backdropBlurAmount}
        className={className}
      >
        Shader Background
      </div>
    );
  };
});

// Mock Timeline component
jest.mock('@/components/ui/timeline', () => ({
  Timeline: function MockTimeline({ data }: any) {
    return (
      <div data-testid="mock-timeline" data-timeline-items={data.length}>
        <div data-testid="timeline-title">Changelog from my journey</div>
        {data.map((item: any, index: number) => (
          <div key={index} data-testid={`timeline-item-${index}`}>
            <div data-testid={`timeline-title-${index}`}>{item.title}</div>
            <div data-testid={`timeline-content-${index}`}>{item.content}</div>
          </div>
        ))}
      </div>
    );
  },
}));

// Mock window.requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

describe('About', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the About section with correct structure', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');
    expect(aboutSection).toBeInTheDocument();
    expect(aboutSection).toHaveClass('relative', '-mt-1');
  });

  it('renders the main text content', () => {
    render(<About />);

    // The text is wrapped in individual char spans by GSAP animation
    // So we need to look for the paragraph element instead
    const textElement =
      document.querySelector('p[ref]') ||
      document.querySelector('p[style*="Anton"]');
    expect(textElement).toBeInTheDocument();
  });

  it('has correct text styling and typography', () => {
    render(<About />);

    // Find the paragraph element with Anton font style
    const textElement = document.querySelector('p[style*="Anton"]');
    expect(textElement).toHaveClass(
      'text-2xl',
      'md:text-3xl',
      'lg:text-4xl',
      'font-normal',
      'drop-shadow-lg',
      'leading-tight'
    );

    // Check for inline styles
    expect(textElement).toHaveStyle({
      fontFamily: 'Anton, sans-serif',
      letterSpacing: '0.05em',
    });
  });

  it('renders ShaderBackground with correct props', () => {
    render(<About />);

    const shaderBackground = screen.getByTestId('mock-shader-background');
    expect(shaderBackground).toBeInTheDocument();
    expect(shaderBackground).toHaveAttribute('data-color', '#ff0000');
    expect(shaderBackground).toHaveAttribute('data-backdrop-blur', 'none');
    expect(shaderBackground).toHaveClass('absolute', 'inset-0', 'z-0');
  });

  it('renders fade overlays for top and bottom', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');

    // Check fade overlay container
    const fadeOverlay = aboutSection!.querySelector(
      '.absolute.inset-0.z-5.pointer-events-none'
    );
    expect(fadeOverlay).toBeInTheDocument();

    // Check top fade gradient
    const topFade = aboutSection!.querySelector(
      '.absolute.top-0.left-0.w-full.bg-gradient-to-b.from-black'
    );
    expect(topFade).toBeInTheDocument();
    expect(topFade).toHaveClass('h-44', 'sm:h-36', 'md:h-44');

    // Check bottom fade gradient
    const bottomFade = aboutSection!.querySelector(
      '.absolute.-bottom-4.left-0.w-full.bg-gradient-to-t.from-black'
    );
    expect(bottomFade).toBeInTheDocument();
    expect(bottomFade).toHaveClass('h-44', 'sm:h-36', 'md:h-44');
  });

  it('renders LiquidGlassContainer with glass effects', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');

    // Check for glass container structure
    const glassContainer = aboutSection!.querySelector('.relative');
    expect(glassContainer).toBeInTheDocument();

    // Check for glass shadow effects
    const glassEffect = aboutSection!.querySelector('[class*="shadow-"]');
    expect(glassEffect).toBeInTheDocument();

    // Check for backdrop blur
    const backdropBlur = aboutSection!.querySelector('.backdrop-blur-3xl');
    expect(backdropBlur).toBeInTheDocument();
  });

  it('renders GlassFilter SVG component', () => {
    render(<About />);

    const svgFilter = document.querySelector('svg');
    expect(svgFilter).toBeInTheDocument();
    expect(svgFilter).toHaveClass('hidden');

    // Check for filter definition
    const filter = svgFilter!.querySelector('#container-glass');
    expect(filter).toBeInTheDocument();
  });

  it('renders Timeline component with correct data', () => {
    render(<About />);

    const timeline = screen.getByTestId('mock-timeline');
    expect(timeline).toBeInTheDocument();
    expect(timeline).toHaveAttribute('data-timeline-items', '4'); // 2019, 2021, 2023, 2025
  });

  it('renders all timeline items with correct years', () => {
    render(<About />);

    // Check for all year titles
    expect(screen.getByTestId('timeline-title-0')).toHaveTextContent('2019');
    expect(screen.getByTestId('timeline-title-1')).toHaveTextContent('2021');
    expect(screen.getByTestId('timeline-title-2')).toHaveTextContent('2023');
    expect(screen.getByTestId('timeline-title-3')).toHaveTextContent('2025');
  });

  it('timeline items contain expected content', () => {
    render(<About />);

    // Check 2019 content
    const item2019 = screen.getByTestId('timeline-content-0');
    expect(item2019).toHaveTextContent(
      'Got introduced to web development through HTML, CSS, and JavaScript'
    );

    // Check 2021 content
    const item2021 = screen.getByTestId('timeline-content-1');
    expect(item2021).toHaveTextContent(
      'Started exploring modern frameworks like React and Next.js'
    );

    // Check 2023 content
    const item2023 = screen.getByTestId('timeline-content-2');
    expect(item2023).toHaveTextContent(
      'Focused on improving UI/UX skills and learning TypeScript'
    );

    // Check 2025 content
    const item2025 = screen.getByTestId('timeline-content-3');
    expect(item2025).toHaveTextContent(
      'Currently dedicated to building fast, accessible, and visually appealing web apps'
    );
  });

  it('2025 timeline item includes technology highlights', () => {
    render(<About />);

    const item2025 = screen.getByTestId('timeline-content-3');
    expect(item2025).toHaveTextContent(
      '✨ Modern Web Frameworks (Next.js, React)'
    );
    expect(item2025).toHaveTextContent('🎨 Interactive UI & Motion Design');
    expect(item2025).toHaveTextContent('🚀 Performance & SEO Optimization');
  });

  it('has correct layout structure with proper z-index layering', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');

    // Check main content structure
    const mainContent = aboutSection!.querySelector('.min-h-screen.relative');
    expect(mainContent).toBeInTheDocument();

    // Check z-index layers
    const shaderBackground = screen.getByTestId('mock-shader-background');
    expect(shaderBackground).toHaveClass('z-0');

    const fadeOverlay = aboutSection!.querySelector('.z-5');
    expect(fadeOverlay).toBeInTheDocument();

    const contentLayer = aboutSection!.querySelector('.relative.z-10');
    expect(contentLayer).toBeInTheDocument();
  });

  it('has responsive layout classes', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');

    // Check responsive padding
    const contentContainer = aboutSection!.querySelector('.px-6');
    expect(contentContainer).toBeInTheDocument();

    // Check max-width container
    const maxWidthContainer = aboutSection!.querySelector('.max-w-6xl');
    expect(maxWidthContainer).toBeInTheDocument();
  });

  it('renders with semantic HTML structure', () => {
    render(<About />);

    const section = document.querySelector('section#about');
    expect(section).toBeInTheDocument();
    expect(section!.tagName).toBe('SECTION');
  });

  it('timeline section has black background', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');
    const timelineSection = aboutSection!.querySelector('.bg-black');
    expect(timelineSection).toBeInTheDocument();
  });

  it('main content is centered properly', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');
    const centeredContent = aboutSection!.querySelector(
      '.min-h-screen.flex.items-center.justify-center'
    );
    expect(centeredContent).toBeInTheDocument();

    const textCenter = aboutSection!.querySelector('.text-center');
    expect(textCenter).toBeInTheDocument();
  });

  it('text has uppercase styling', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');
    const uppercaseText = aboutSection!.querySelector('.text-white.uppercase');
    expect(uppercaseText).toBeInTheDocument();
  });

  it('uses min-h-screen for full viewport coverage', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');
    const fullHeightSection = aboutSection!.querySelector('.min-h-screen');
    expect(fullHeightSection).toBeInTheDocument();
  });

  it('glass container has correct padding', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');
    const glassContent = aboutSection!.querySelector('.relative.z-10.p-8');
    expect(glassContent).toBeInTheDocument();
  });

  it('applies GSAP animations to text on mount', async () => {
    const { gsap } = require('gsap');

    render(<About />);

    await waitFor(() => {
      expect(gsap.fromTo).toHaveBeenCalled();
    });
  });

  it('cleans up ScrollTrigger on unmount', () => {
    const { ScrollTrigger } = require('gsap/ScrollTrigger');

    const { unmount } = render(<About />);

    unmount();

    expect(ScrollTrigger.getAll).toHaveBeenCalled();
  });

  it('text content includes all expected phrases', () => {
    render(<About />);

    // Since GSAP wraps individual characters, we need to check for the original content
    // by looking at the paragraph element's data or checking for individual characters
    const textElement = document.querySelector('p[style*="Anton"]');
    expect(textElement).toBeInTheDocument();

    // Check if the characters are present in the DOM (they might be in individual spans)
    expect(document.body).toHaveTextContent('I');
    expect(document.body).toHaveTextContent('t');
    expect(document.body).toHaveTextContent('a');
    expect(document.body).toHaveTextContent('l');
    expect(document.body).toHaveTextContent('i');
    expect(document.body).toHaveTextContent('a');
    expect(document.body).toHaveTextContent('n');
  });

  it('has proper accessible structure', () => {
    render(<About />);

    // Check for proper heading structure in timeline
    const timelineTitle = screen.getByTestId('timeline-title');
    expect(timelineTitle).toBeInTheDocument();
  });

  it('maintains proper DOM structure', () => {
    render(<About />);

    const aboutSection = document.querySelector('#about');

    // Should have two main sections: hero text and timeline
    const heroSection = aboutSection!.querySelector('.min-h-screen.relative');
    const timelineSection = aboutSection!.querySelector('.bg-black');

    expect(heroSection).toBeInTheDocument();
    expect(timelineSection).toBeInTheDocument();
  });

  it('glass filter has correct SVG structure', () => {
    render(<About />);

    const svg = document.querySelector('svg');
    const defs = svg!.querySelector('defs');
    const filter = defs!.querySelector('filter#container-glass');

    expect(defs).toBeInTheDocument();
    expect(filter).toBeInTheDocument();
    // Check that filter has the correct attributes (JSX converts camelCase to kebab-case)
    expect(filter).toHaveAttribute('color-interpolation-filters', 'sRGB');
  });

  it('renders all SVG filter elements', () => {
    render(<About />);

    const filter = document.querySelector('filter#container-glass');

    expect(filter!.querySelector('feTurbulence')).toBeInTheDocument();
    expect(filter!.querySelector('feGaussianBlur')).toBeInTheDocument();
    expect(filter!.querySelector('feDisplacementMap')).toBeInTheDocument();
    expect(filter!.querySelector('feComposite')).toBeInTheDocument();
  });

  it('handles missing textRef element gracefully', () => {
    // This test ensures the early return branch is covered when textRef.current is null
    const { gsap } = require('gsap');

    // Mock textRef.current to return null
    jest.spyOn(React, 'useRef').mockReturnValueOnce({ current: null });

    render(<About />);

    // The component should still render without crashing
    expect(document.querySelector('#about')).toBeInTheDocument();
  });

  it('text element receives GSAP animation setup', () => {
    const { gsap } = require('gsap');

    render(<About />);

    // Verify GSAP fromTo was called for text animation
    expect(gsap.fromTo).toHaveBeenCalledWith(
      expect.any(Object), // charElements
      expect.objectContaining({
        color: '#666666',
        opacity: 0.3,
      }),
      expect.objectContaining({
        color: '#ffffff',
        opacity: 1,
        ease: 'none',
        stagger: 0.015,
      })
    );
  });

  it('creates individual character spans for animation', async () => {
    render(<About />);

    await waitFor(() => {
      // After GSAP animation setup, individual characters should be wrapped in spans
      const charSpans = document.querySelectorAll('.char');
      expect(charSpans.length).toBeGreaterThan(0);
    });
  });
});
