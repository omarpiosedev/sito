import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '@/components/sections/About';

// Mock ShaderBackground component
jest.mock('@/components/reactbits/Backgrounds/waves/waves', () => {
  return function MockShaderBackground(props: Record<string, unknown>) {
    return <div data-testid="shader-background" {...props} />;
  };
});

describe('About Component', () => {
  it('renders the main heading correctly', () => {
    render(<About />);

    // Verifica che il testo principale sia presente
    const mainText = screen.getByText(
      /I'm an Italian digital designer and web developer/
    );
    expect(mainText).toBeInTheDocument();
  });

  it('renders the complete main text content', () => {
    render(<About />);

    // Verifica che tutti i frammenti del testo principale siano presenti
    expect(
      screen.getByText(/with years of experience, blending design, animation,/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/and code into seamless digital experiences\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/I don't just build websites — I craft stories/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/that move, interact, and inspire\. My work lives/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/at the sweet spot where creativity meets technology\./)
    ).toBeInTheDocument();
  });

  it('renders the shader background component', () => {
    render(<About />);

    // Verifica che il componente shader background sia presente
    const shaderBackground = screen.getByTestId('shader-background');
    expect(shaderBackground).toBeInTheDocument();
  });

  it('applies correct styling to the main text', () => {
    render(<About />);

    const mainTextContainer = screen.getByText(
      /I'm an Italian digital designer and web developer/
    ).parentElement;
    expect(mainTextContainer).toHaveClass('text-white', 'uppercase');

    const mainTextParagraph = screen.getByText(
      /I'm an Italian digital designer and web developer/
    );
    expect(mainTextParagraph).toHaveClass('drop-shadow-lg', 'leading-tight');
  });

  it('renders the liquid glass container with correct structure', () => {
    const { container } = render(<About />);

    // Verifica che il container con effetto glass sia presente
    const glassContainers = container.querySelectorAll('.backdrop-blur-3xl');
    expect(glassContainers.length).toBeGreaterThan(0);
  });

  it('has proper section layout and positioning', () => {
    const { container } = render(<About />);

    // Verifica che la sezione abbia le classi di layout corrette
    const section = container.querySelector('section');
    expect(section).toHaveClass('relative', 'min-h-screen');

    // Verifica che il contenuto sia centrato
    const contentDiv = screen
      .getByText(/I'm an Italian digital designer and web developer/)
      .closest('.text-center');
    expect(contentDiv).toBeInTheDocument();
  });
});
