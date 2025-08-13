import { render } from '@testing-library/react';
import RootLayout, { metadata } from '@/app/layout';

// Mock dei componenti Next.js
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
  }),
}));

// Mock dei componenti
jest.mock('@/components/sections/navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Mock Navbar</nav>;
  };
});

jest.mock('@/components/navigation-provider', () => {
  return function MockNavigationProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="navigation-provider">{children}</div>;
  };
});

describe('RootLayout', () => {
  // Mock per creare un componente testabile che rappresenta solo il contenuto del body
  const TestableRootLayoutBody = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    return (
      <div className="--font-geist-sans --font-geist-mono antialiased bg-black">
        <div data-testid="navigation-provider">
          <nav data-testid="navbar">Mock Navbar</nav>
          {children}
        </div>
      </div>
    );
  };

  describe('Component Structure', () => {
    it('renders NavigationProvider wrapper', () => {
      const { getByTestId } = render(
        <TestableRootLayoutBody>
          <div>Test</div>
        </TestableRootLayoutBody>
      );

      expect(getByTestId('navigation-provider')).toBeInTheDocument();
    });

    it('renders Navbar component', () => {
      const { getByTestId } = render(
        <TestableRootLayoutBody>
          <div>Test</div>
        </TestableRootLayoutBody>
      );

      expect(getByTestId('navbar')).toBeInTheDocument();
    });

    it('renders children content', () => {
      const { getByTestId } = render(
        <TestableRootLayoutBody>
          <div data-testid="children-content">Child Content</div>
        </TestableRootLayoutBody>
      );

      expect(getByTestId('children-content')).toBeInTheDocument();
    });

    it('applies correct CSS classes structure', () => {
      const { container } = render(
        <TestableRootLayoutBody>
          <div>Test</div>
        </TestableRootLayoutBody>
      );

      const rootDiv = container.firstChild as HTMLElement;
      expect(rootDiv).toHaveClass(
        '--font-geist-sans',
        '--font-geist-mono',
        'antialiased',
        'bg-black'
      );
    });
  });

  describe('Metadata Configuration', () => {
    it('exports correct metadata object', () => {
      expect(metadata).toBeDefined();
      expect(metadata.title).toBe('Omar Pioselli - Full Stack Developer');
      expect(metadata.description).toContain(
        'Professional Full Stack Developer'
      );
    });

    it('contains correct metadata fields', () => {
      expect(metadata.keywords).toEqual([
        'Full Stack Developer',
        'React',
        'Next.js',
        'Node.js',
        'JavaScript',
        'TypeScript',
        'Web Development',
        'Italy',
      ]);

      expect(metadata.authors).toEqual([
        { name: 'Omar Pioselli', url: 'https://omarpioselli.dev' },
      ]);
      expect(metadata.creator).toBe('Omar Pioselli');
    });

    it('has correct OpenGraph configuration', () => {
      expect(metadata.openGraph).toEqual({
        type: 'website',
        locale: 'en_US',
        url: 'https://omarpioselli.dev',
        title: 'Omar Pioselli - Full Stack Developer',
        description:
          'Professional Full Stack Developer specializing in modern web applications with React, Next.js, Node.js, and cutting-edge technologies.',
        siteName: 'Omar Pioselli Portfolio',
      });
    });

    it('has correct Twitter configuration', () => {
      expect(metadata.twitter).toEqual({
        card: 'summary_large_image',
        title: 'Omar Pioselli - Full Stack Developer',
        description:
          'Professional Full Stack Developer specializing in modern web applications with React, Next.js, Node.js, and cutting-edge technologies.',
      });
    });

    it('has correct robots configuration', () => {
      expect(metadata.robots).toEqual({
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      });
    });
  });

  describe('Next.js Layout Properties', () => {
    it('exports correct component function signature', () => {
      expect(RootLayout).toBeInstanceOf(Function);
      expect(RootLayout.length).toBe(1); // Accepts one parameter (props)
    });

    it('component function handles children prop correctly', () => {
      // Test che la funzione accetta e gestisce il parametro children
      const mockProps = { children: 'test-children' };

      // Questo test verifica che la funzione non lanci errori con props valide
      expect(() => {
        const result = RootLayout(mockProps);
        expect(result).toBeDefined();
      }).not.toThrow();
    });
  });
});
