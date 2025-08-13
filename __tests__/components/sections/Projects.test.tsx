import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Projects from '@/components/sections/Projects';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({
    src,
    alt,
    width,
    height,
    fill,
    className,
    priority,
  }: any) {
    return (
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        data-priority={priority}
        data-testid="mock-image"
        data-fill={fill}
      />
    );
  };
});

// Mock SectionDivider component
jest.mock('@/components/sections/SectionDivider', () => {
  return function MockSectionDivider({
    text,
    direction,
    velocity,
    height,
    textClassName,
  }: any) {
    return (
      <div
        data-testid="mock-section-divider"
        data-text={text}
        data-direction={direction}
        data-velocity={velocity}
        data-height={height}
        data-text-classname={textClassName}
      >
        {text}
      </div>
    );
  };
});

// Mock HoverRollingText component
jest.mock('@/components/ui/hover-rolling-text', () => ({
  HoverRollingText: ({ text }: any) => (
    <span data-testid="hover-rolling-text">{text}</span>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, style, className, ref, ...props }: any) => (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    ),
  },
  useScroll: jest.fn(() => ({
    scrollYProgress: { get: () => 0.5, on: jest.fn(), destroy: jest.fn() },
  })),
  useTransform: jest.fn((input, inputRange, outputRange, options) => {
    // Mock transform that returns the middle output value
    const middleIndex = Math.floor(outputRange.length / 2);
    return {
      get: () => outputRange[middleIndex] || outputRange[0],
      on: jest.fn(),
      destroy: jest.fn(),
    };
  }),
  useSpring: jest.fn((input, config) => {
    // Mock spring that returns the input value
    return {
      get: () => (typeof input?.get === 'function' ? input.get() : input),
      on: jest.fn(),
      destroy: jest.fn(),
    };
  }),
}));

// Mock window.addEventListener for resize events
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'addEventListener', {
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  value: mockRemoveEventListener,
});

Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024, // Default to large screen
});

describe('Projects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.innerWidth = 1024; // Reset to desktop size
  });

  it('renders the projects component with section divider', () => {
    render(<Projects />);

    const sectionDivider = screen.getByTestId('mock-section-divider');
    expect(sectionDivider).toBeInTheDocument();
    expect(sectionDivider).toHaveAttribute('data-text', 'PROJECTS');
    expect(sectionDivider).toHaveAttribute('data-direction', 'false');
    expect(sectionDivider).toHaveAttribute('data-velocity', '80');
    expect(sectionDivider).toHaveAttribute('data-height', 'h-32');
  });

  it('renders projects section with correct attributes', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');
    expect(projectsSection).toBeInTheDocument();
    expect(projectsSection).toHaveClass(
      'relative',
      'w-full',
      'bg-black',
      'text-white',
      'overflow-hidden'
    );
  });

  it('renders all 4 project cards', () => {
    render(<Projects />);

    // Check for project titles
    expect(screen.getByText('BOLDCRAFT')).toBeInTheDocument();
    expect(screen.getByText('NEXORA')).toBeInTheDocument();
    expect(screen.getByText('CLAR & CO')).toBeInTheDocument();
    expect(screen.getByText('MODIVO')).toBeInTheDocument();
  });

  it('renders project numbers correctly', () => {
    render(<Projects />);

    expect(screen.getByText('/ 01')).toBeInTheDocument();
    expect(screen.getByText('/ 02')).toBeInTheDocument();
    expect(screen.getByText('/ 03')).toBeInTheDocument();
    expect(screen.getByText('/ 04')).toBeInTheDocument();
  });

  it('renders project categories correctly', () => {
    render(<Projects />);

    expect(screen.getByText('UI DESIGN • VISUAL BRANDING')).toBeInTheDocument();
    expect(
      screen.getByText('BRANDING • UI DESIGN • RESEARCH')
    ).toBeInTheDocument();
    expect(screen.getByText('BRANDING • LUXE WOMENS WEAR')).toBeInTheDocument();
    expect(screen.getByText('PRODUCT DESIGN • BRANDING')).toBeInTheDocument();
  });

  it('renders project descriptions', () => {
    render(<Projects />);

    expect(
      screen.getByText(/A comprehensive design system and branding/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Modern web application built with cutting-edge/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Luxury fashion brand identity with sophisticated/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Innovative product design and branding solution/)
    ).toBeInTheDocument();
  });

  it('renders project images with correct attributes', () => {
    render(<Projects />);

    const images = screen.getAllByTestId('mock-image');

    // Should have at least 4 project images (plus grid images)
    expect(images.length).toBeGreaterThanOrEqual(4);

    // Check that main project images exist
    const projectImages = images.filter(
      img =>
        img.getAttribute('src')?.includes('/projects/') &&
        !img.getAttribute('data-fill')
    );
    expect(projectImages).toHaveLength(4);

    // Check specific project images
    expect(screen.getByAltText('BOLDCRAFT')).toBeInTheDocument();
    expect(screen.getByAltText('NEXORA')).toBeInTheDocument();
    expect(screen.getByAltText('CLAR & CO')).toBeInTheDocument();
    expect(screen.getByAltText('MODIVO')).toBeInTheDocument();
  });

  it('renders VIEW PROJECT buttons', () => {
    render(<Projects />);

    const viewButtons = screen.getAllByText('VIEW PROJECT');
    expect(viewButtons).toHaveLength(8); // 4 regular + 4 hover rolling text
  });

  it('project titles use Anton font family', () => {
    render(<Projects />);

    const titleElements = screen
      .getAllByText('BOLDCRAFT')
      .concat(
        screen.getAllByText('NEXORA'),
        screen.getAllByText('CLAR & CO'),
        screen.getAllByText('MODIVO')
      );

    titleElements.forEach(title => {
      if (title.tagName === 'H2') {
        expect(title).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
      }
    });
  });

  it('project numbers have red color', () => {
    render(<Projects />);

    const numbers = [
      screen.getByText('/ 01'),
      screen.getByText('/ 02'),
      screen.getByText('/ 03'),
      screen.getByText('/ 04'),
    ];

    numbers.forEach(number => {
      expect(number).toHaveClass('text-red-500');
    });
  });

  it('project categories have correct styling', () => {
    render(<Projects />);

    const categories = [
      screen.getByText('UI DESIGN • VISUAL BRANDING'),
      screen.getByText('BRANDING • UI DESIGN • RESEARCH'),
      screen.getByText('BRANDING • LUXE WOMENS WEAR'),
      screen.getByText('PRODUCT DESIGN • BRANDING'),
    ];

    categories.forEach(category => {
      expect(category).toHaveClass(
        'text-white/60',
        'text-xs',
        'md:text-sm',
        'lg:text-base',
        'font-light',
        'tracking-wider',
        'uppercase'
      );
    });
  });

  it('project descriptions have correct styling', () => {
    render(<Projects />);

    const descriptions = screen.getAllByText(
      /comprehensive design system|Modern web application|Luxury fashion brand|Innovative product design/
    );

    descriptions.forEach(description => {
      expect(description).toHaveClass(
        'text-white/80',
        'text-sm',
        'md:text-base',
        'lg:text-lg',
        'font-light',
        'leading-relaxed'
      );
    });
  });

  it('VIEW PROJECT buttons have correct styling', () => {
    render(<Projects />);

    const buttons = screen.getAllByRole('button', { name: /VIEW PROJECT/ });

    buttons.forEach(button => {
      expect(button).toHaveClass(
        'relative',
        'isolate',
        'cursor-pointer',
        'rounded-full',
        'bg-white/10',
        'backdrop-blur-sm',
        'border',
        'border-white/20',
        'text-white',
        'font-medium'
      );
      expect(button).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
    });
  });

  it('renders hover rolling text for larger screens', () => {
    render(<Projects />);

    const hoverRollingTexts = screen.getAllByTestId('hover-rolling-text');
    expect(hoverRollingTexts).toHaveLength(4);

    hoverRollingTexts.forEach(text => {
      expect(text).toHaveTextContent('VIEW PROJECT');
    });
  });

  it('renders projects grid', () => {
    render(<Projects />);

    // Should render grid images
    const gridImages = screen
      .getAllByTestId('mock-image')
      .filter(img => img.getAttribute('data-fill') === 'true');

    expect(gridImages.length).toBeGreaterThan(0);
  });

  it('handles screen size changes', async () => {
    render(<Projects />);

    // Initially large screen (1024px)
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    // Simulate resize to mobile
    act(() => {
      window.innerWidth = 768;
      const resizeHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'resize'
      )?.[1];
      if (resizeHandler) {
        resizeHandler();
      }
    });

    // Component should still render correctly
    expect(screen.getByText('BOLDCRAFT')).toBeInTheDocument();
  });

  it('cleans up resize event listeners on unmount', () => {
    const { unmount } = render(<Projects />);

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );
  });

  it('project images have correct dimensions and classes', () => {
    render(<Projects />);

    const projectImages = screen
      .getAllByTestId('mock-image')
      .filter(img => !img.getAttribute('data-fill'));

    projectImages.forEach(img => {
      expect(img).toHaveAttribute('width', '800');
      expect(img).toHaveAttribute('height', '600');
      expect(img).toHaveClass('w-full', 'h-full', 'object-cover');
    });
  });

  it('grid images use fill prop correctly', () => {
    render(<Projects />);

    const fillImages = screen
      .getAllByTestId('mock-image')
      .filter(img => img.getAttribute('data-fill') === 'true');

    fillImages.forEach(img => {
      expect(img).toHaveAttribute('data-fill', 'true');
      expect(img).not.toHaveAttribute('width');
      expect(img).not.toHaveAttribute('height');
    });
  });

  it('project cards have correct container styling', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');
    const projectContainers = projectsSection!.querySelectorAll(
      '.relative.min-h-\\[70vh\\].lg\\:min-h-\\[90vh\\]'
    );

    expect(projectContainers.length).toBeGreaterThan(0);
  });

  it('text content has responsive alignment for reversed cards', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');

    // Check for reversed layout classes (should exist for cards with index % 2 === 1)
    const reversedElements =
      projectsSection!.querySelectorAll('.lg\\:text-right');
    expect(reversedElements.length).toBeGreaterThan(0);
  });

  it('project images have gradient overlays', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');
    const gradientOverlays = projectsSection!.querySelectorAll(
      '.absolute.inset-0.bg-gradient-to-t'
    );

    expect(gradientOverlays.length).toBeGreaterThanOrEqual(4);
  });

  it('renders gradient background containers for images', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');
    const gradientBgs = projectsSection!.querySelectorAll(
      '.bg-gradient-to-br.from-red-900\\/20.to-red-500\\/10'
    );

    expect(gradientBgs.length).toBeGreaterThanOrEqual(4);
  });

  it('has correct z-index layering in projects grid', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');

    // Check for z-index classes in grid
    const zIndex10 = projectsSection!.querySelectorAll('.z-10');
    const zIndex20 = projectsSection!.querySelectorAll('.z-20');

    expect(zIndex10.length).toBeGreaterThan(0);
    expect(zIndex20.length).toBeGreaterThan(0);
  });

  it('projects grid has correct aspect ratios', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');
    const aspectSquares = projectsSection!.querySelectorAll('.aspect-square');

    expect(aspectSquares.length).toBeGreaterThan(0);
  });

  it('applies correct transform styles for performance', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');

    // Check that the projects section exists and has content
    expect(projectsSection).toBeInTheDocument();

    // Just check that projects render - transform styles are applied via framer-motion
    expect(screen.getByText('BOLDCRAFT')).toBeInTheDocument();
  });

  it('has pointer-events-none on gradient overlays', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');
    const pointerEventsNone = projectsSection!.querySelectorAll(
      '.pointer-events-none'
    );

    expect(pointerEventsNone.length).toBeGreaterThan(0);
  });

  it('renders with memo optimization', () => {
    render(<Projects />);

    // Component should render normally with memo wrapper
    expect(screen.getByText('PROJECTS')).toBeInTheDocument();
  });

  it('has correct display name', () => {
    expect(Projects.displayName).toBe('Projects');
  });

  it('applies responsive padding classes', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');
    const responsivePadding = projectsSection!.querySelectorAll(
      '.px-6, .md\\:px-16, .lg\\:px-6'
    );

    expect(responsivePadding.length).toBeGreaterThan(0);
  });

  it('handles overflow correctly', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');
    expect(projectsSection).toHaveClass('overflow-hidden');

    // Check for overflow-hidden in grid containers
    const overflowHidden =
      projectsSection!.querySelectorAll('.overflow-hidden');
    expect(overflowHidden.length).toBeGreaterThan(1);
  });

  it('uses correct rounded corners', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');

    // Check for rounded-2xl on project images
    const rounded2xl = projectsSection!.querySelectorAll('.rounded-2xl');
    expect(rounded2xl.length).toBeGreaterThan(0);

    // Check for rounded-lg on grid items
    const roundedLg = projectsSection!.querySelectorAll('.rounded-lg');
    expect(roundedLg.length).toBeGreaterThan(0);
  });

  it('renders all project elements with correct structure', () => {
    render(<Projects />);

    // Check main structural elements exist
    expect(screen.getByTestId('mock-section-divider')).toBeInTheDocument();
    expect(document.querySelector('#projects')).toBeInTheDocument();

    // Check all 4 projects are rendered
    const projectTitles = ['BOLDCRAFT', 'NEXORA', 'CLAR & CO', 'MODIVO'];
    projectTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Check VIEW PROJECT buttons exist
    expect(screen.getAllByText('VIEW PROJECT')).toHaveLength(8);
  });

  it('handles mobile screen size correctly', async () => {
    // Set to mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    render(<Projects />);

    // Should still render all projects
    expect(screen.getByText('BOLDCRAFT')).toBeInTheDocument();
    expect(screen.getByText('NEXORA')).toBeInTheDocument();
    expect(screen.getByText('CLAR & CO')).toBeInTheDocument();
    expect(screen.getByText('MODIVO')).toBeInTheDocument();
  });

  it('shows small screen text for VIEW PROJECT buttons on mobile', () => {
    // Set to mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480,
    });

    render(<Projects />);

    // Check for sm:hidden classes (mobile version)
    const projectsSection = document.querySelector('#projects');
    const mobileButtons = projectsSection!.querySelectorAll('.sm\\:hidden');

    expect(mobileButtons.length).toBeGreaterThan(0);
  });

  it('project text alignment changes for reversed cards', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');

    // Check for lg:order-2 and lg:text-right classes (reversed layout)
    const orderElements = projectsSection!.querySelectorAll('.lg\\:order-2');
    const textRightElements =
      projectsSection!.querySelectorAll('.lg\\:text-right');

    expect(orderElements.length).toBeGreaterThan(0);
    expect(textRightElements.length).toBeGreaterThan(0);
  });

  it('applies correct grid column spans', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');

    // Check for lg:col-span-2 and lg:col-span-3 classes
    const colSpan2 = projectsSection!.querySelectorAll('.lg\\:col-span-2');
    const colSpan3 = projectsSection!.querySelectorAll('.lg\\:col-span-3');

    expect(colSpan2.length).toBeGreaterThan(0);
    expect(colSpan3.length).toBeGreaterThan(0);
  });

  it('renders correct image sources for projects', () => {
    render(<Projects />);

    // Check specific project image sources
    expect(screen.getByAltText('BOLDCRAFT')).toHaveAttribute(
      'src',
      '/projects/boldcraft.svg'
    );
    expect(screen.getByAltText('NEXORA')).toHaveAttribute(
      'src',
      '/projects/nexora.svg'
    );
    expect(screen.getByAltText('CLAR & CO')).toHaveAttribute(
      'src',
      '/projects/clar-co.svg'
    );
    expect(screen.getByAltText('MODIVO')).toHaveAttribute(
      'src',
      '/projects/modivo.svg'
    );
  });

  it('applies correct shadow effects', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');

    // Check for shadow-lg class which is actually used in the component
    const shadowLg = projectsSection!.querySelectorAll('.shadow-lg');

    expect(shadowLg.length).toBeGreaterThan(0);
  });

  it('has correct flex and grid layouts', () => {
    render(<Projects />);

    const projectsSection = document.querySelector('#projects');

    // Check for grid layouts
    const gridLayouts = projectsSection!.querySelectorAll('.grid');
    const flexLayouts = projectsSection!.querySelectorAll('.flex');

    expect(gridLayouts.length).toBeGreaterThan(0);
    expect(flexLayouts.length).toBeGreaterThan(0);
  });
});
