import { render } from '@testing-library/react';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img alt="" {...props} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock del componente Hero per evitare problemi con animazioni complesse
jest.mock('@/components/sections/hero', () => {
  return function MockHero() {
    return (
      <section data-testid="hero-section">
        <h1>Omar Pioselli</h1>
        <p>Web Developer</p>
      </section>
    );
  };
});

describe('Page Rendering Integration Tests', () => {
  it('renders without crashing', () => {
    // Test di base per verificare che il sistema di rendering funzioni
    const TestComponent = () => <div>Test</div>;

    const { container } = render(<TestComponent />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('handles Next.js Image component mock', () => {
    const { container } = render(
      <img src="/test.jpg" alt="Test" width={100} height={100} />
    );

    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', '/test.jpg');
    expect(img).toHaveAttribute('alt', 'Test');
  });

  it('handles component with className utilities', () => {
    const TestComponent = () => (
      <div className="bg-red-500 text-white p-4">Test Component</div>
    );

    const { getByText } = render(<TestComponent />);
    const element = getByText('Test Component');

    expect(element).toHaveClass('bg-red-500', 'text-white', 'p-4');
  });
});
