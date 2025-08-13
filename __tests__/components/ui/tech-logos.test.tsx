import { render, screen } from '@testing-library/react';
import {
  NextJsLogo,
  ReactLogo,
  TailwindLogo,
  FramerLogo,
  TypeScriptLogo,
  ShadcnLogo,
  logos,
} from '@/components/ui/tech-logos';

describe('Tech Logos', () => {
  describe('NextJsLogo', () => {
    it('renders with default props', () => {
      const { container } = render(<NextJsLogo />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.tagName).toBe('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('renders with custom className', () => {
      const customClass = 'custom-next-logo';
      const { container } = render(<NextJsLogo className={customClass} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass(customClass);
    });

    it('renders without className', () => {
      const { container } = render(<NextJsLogo />);

      const svg = container.querySelector('svg');
      expect(svg).not.toHaveAttribute('class');
    });

    it('has correct SVG structure and content', () => {
      const { container } = render(<NextJsLogo />);

      const svg = container.querySelector('svg');
      const path = svg?.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');
    });

    it('has accessible title element', () => {
      render(<NextJsLogo />);

      const title = screen.getByTitle('Next.js icon');
      expect(title).toBeInTheDocument();
    });
  });

  describe('ReactLogo', () => {
    it('renders with default props', () => {
      const { container } = render(<ReactLogo />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('renders with custom className', () => {
      const customClass = 'custom-react-logo';
      const { container } = render(<ReactLogo className={customClass} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass(customClass);
    });

    it('renders without className', () => {
      const { container } = render(<ReactLogo />);

      const svg = container.querySelector('svg');
      expect(svg).not.toHaveAttribute('class');
    });

    it('has correct SVG structure', () => {
      const { container } = render(<ReactLogo />);

      const svg = container.querySelector('svg');
      const path = svg?.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');
    });
  });

  describe('TailwindLogo', () => {
    it('renders with default props', () => {
      const { container } = render(<TailwindLogo />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('renders with custom className', () => {
      const customClass = 'custom-tailwind-logo';
      const { container } = render(<TailwindLogo className={customClass} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass(customClass);
    });

    it('renders without className', () => {
      const { container } = render(<TailwindLogo />);

      const svg = container.querySelector('svg');
      expect(svg).not.toHaveAttribute('class');
    });

    it('has correct SVG structure', () => {
      const { container } = render(<TailwindLogo />);

      const svg = container.querySelector('svg');
      const path = svg?.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');
    });
  });

  describe('FramerLogo', () => {
    it('renders with default props', () => {
      const { container } = render(<FramerLogo />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('renders with custom className', () => {
      const customClass = 'custom-framer-logo';
      const { container } = render(<FramerLogo className={customClass} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass(customClass);
    });

    it('renders without className', () => {
      const { container } = render(<FramerLogo />);

      const svg = container.querySelector('svg');
      expect(svg).not.toHaveAttribute('class');
    });

    it('has correct SVG structure', () => {
      const { container } = render(<FramerLogo />);

      const svg = container.querySelector('svg');
      const path = svg?.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');
    });
  });

  describe('TypeScriptLogo', () => {
    it('renders with default props', () => {
      const { container } = render(<TypeScriptLogo />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('fill', 'currentColor');
    });

    it('renders with custom className', () => {
      const customClass = 'custom-typescript-logo';
      const { container } = render(<TypeScriptLogo className={customClass} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass(customClass);
    });

    it('renders without className', () => {
      const { container } = render(<TypeScriptLogo />);

      const svg = container.querySelector('svg');
      expect(svg).not.toHaveAttribute('class');
    });

    it('has correct SVG structure', () => {
      const { container } = render(<TypeScriptLogo />);

      const svg = container.querySelector('svg');
      const path = svg?.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d');
    });
  });

  describe('ShadcnLogo', () => {
    it('renders with default props', () => {
      const { container } = render(<ShadcnLogo />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 256 256');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
    });

    it('renders with custom className', () => {
      const customClass = 'custom-shadcn-logo';
      const { container } = render(<ShadcnLogo className={customClass} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass(customClass);
    });

    it('renders without className', () => {
      const { container } = render(<ShadcnLogo />);

      const svg = container.querySelector('svg');
      expect(svg).not.toHaveAttribute('class');
    });

    it('has correct SVG structure with stroke elements', () => {
      const { container } = render(<ShadcnLogo />);

      const svg = container.querySelector('svg');
      const rect = svg?.querySelector('rect');
      const lines = svg?.querySelectorAll('line');

      expect(rect).toBeInTheDocument();
      expect(rect).toHaveAttribute('width', '256');
      expect(rect).toHaveAttribute('height', '256');
      expect(rect).toHaveAttribute('fill', 'none');

      expect(lines).toHaveLength(2);

      // Check first line attributes
      const firstLine = lines?.[0];
      expect(firstLine).toHaveAttribute('x1', '208');
      expect(firstLine).toHaveAttribute('y1', '128');
      expect(firstLine).toHaveAttribute('x2', '128');
      expect(firstLine).toHaveAttribute('y2', '208');
      expect(firstLine).toHaveAttribute('stroke-linecap', 'round');
      expect(firstLine).toHaveAttribute('stroke-linejoin', 'round');
      expect(firstLine).toHaveAttribute('stroke-width', '32');

      // Check second line attributes
      const secondLine = lines?.[1];
      expect(secondLine).toHaveAttribute('x1', '192');
      expect(secondLine).toHaveAttribute('y1', '40');
      expect(secondLine).toHaveAttribute('x2', '40');
      expect(secondLine).toHaveAttribute('y2', '192');
      expect(secondLine).toHaveAttribute('stroke-linecap', 'round');
      expect(secondLine).toHaveAttribute('stroke-linejoin', 'round');
      expect(secondLine).toHaveAttribute('stroke-width', '32');
    });
  });

  describe('logos array', () => {
    it('contains all expected logo components', () => {
      expect(logos).toHaveLength(6);
      expect(logos).toEqual([
        { id: 1, component: NextJsLogo, alt: 'Next.js' },
        { id: 2, component: ReactLogo, alt: 'React' },
        { id: 3, component: TailwindLogo, alt: 'Tailwind CSS' },
        { id: 4, component: FramerLogo, alt: 'Framer Motion' },
        { id: 5, component: ShadcnLogo, alt: 'shadcn/ui' },
        { id: 6, component: TypeScriptLogo, alt: 'TypeScript' },
      ]);
    });

    it('has unique IDs for each logo', () => {
      const ids = logos.map(logo => logo.id);
      const uniqueIds = [...new Set(ids)];
      expect(uniqueIds).toHaveLength(logos.length);
    });

    it('has proper alt text for each logo', () => {
      const altTexts = logos.map(logo => logo.alt);
      expect(altTexts).toEqual([
        'Next.js',
        'React',
        'Tailwind CSS',
        'Framer Motion',
        'shadcn/ui',
        'TypeScript',
      ]);
    });

    it('all logos can be rendered', () => {
      logos.forEach((logo, index) => {
        const LogoComponent = logo.component;
        const { container } = render(<LogoComponent className="test-logo" />);

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('test-logo');
      });
    });

    it('all logo components are functions', () => {
      logos.forEach(logo => {
        expect(typeof logo.component).toBe('function');
      });
    });

    it('has consecutive IDs starting from 1', () => {
      logos.forEach((logo, index) => {
        expect(logo.id).toBe(index + 1);
      });
    });
  });

  describe('Integration and rendering consistency', () => {
    it('all logos render with consistent SVG structure', () => {
      const testClassName = 'integration-test';

      [
        NextJsLogo,
        ReactLogo,
        TailwindLogo,
        FramerLogo,
        TypeScriptLogo,
        ShadcnLogo,
      ].forEach(LogoComponent => {
        const { container } = render(
          <LogoComponent className={testClassName} />
        );

        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass(testClassName);
        expect(svg).toHaveAttribute('viewBox');
        expect(svg.tagName).toBe('svg');
      });
    });

    it('logos maintain props consistency', () => {
      const testProps = { className: 'test-prop-consistency' };

      logos.forEach(logo => {
        const LogoComponent = logo.component;
        const { container } = render(<LogoComponent {...testProps} />);

        const svg = container.querySelector('svg');
        expect(svg).toHaveClass('test-prop-consistency');
      });
    });
  });

  describe('Edge cases and error handling', () => {
    it('handles empty className gracefully', () => {
      const { container } = render(<NextJsLogo className="" />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('class', '');
    });

    it('handles undefined className gracefully', () => {
      const { container } = render(<NextJsLogo className={undefined} />);

      const svg = container.querySelector('svg');
      expect(svg).not.toHaveAttribute('class');
    });

    it('handles multiple classes in className', () => {
      const multipleClasses = 'class1 class2 class3';
      const { container } = render(<ReactLogo className={multipleClasses} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('class1');
      expect(svg).toHaveClass('class2');
      expect(svg).toHaveClass('class3');
    });

    it('handles special characters in className', () => {
      const specialClassName = 'logo-test_special-123';
      const { container } = render(
        <TailwindLogo className={specialClassName} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toHaveClass(specialClassName);
    });
  });

  describe('Accessibility', () => {
    it('NextJs logo has proper accessibility attributes', () => {
      const { container } = render(<NextJsLogo />);

      const svg = container.querySelector('svg');
      const title = svg?.querySelector('title');
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Next.js icon');
    });

    it('all logos without explicit titles are still accessible as images', () => {
      [ReactLogo, TailwindLogo, FramerLogo, TypeScriptLogo].forEach(
        LogoComponent => {
          const { container } = render(<LogoComponent />);

          const svg = container.querySelector('svg');
          expect(svg).toBeInTheDocument();
          // These should be accessible as generic images
          expect(svg.tagName).toBe('svg');
        }
      );
    });

    it('ShadcnLogo has proper stroke accessibility', () => {
      const { container } = render(<ShadcnLogo />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
      expect(svg).toHaveAttribute('fill', 'none');
    });
  });

  describe('Performance and rendering', () => {
    it('logos render quickly without performance issues', () => {
      const start = performance.now();

      logos.forEach(logo => {
        const LogoComponent = logo.component;
        render(<LogoComponent />);
      });

      const end = performance.now();
      const renderTime = end - start;

      // Should render all logos in under 100ms
      expect(renderTime).toBeLessThan(100);
    });

    it('logos can be rendered multiple times without issues', () => {
      const LogoComponent = NextJsLogo;

      for (let i = 0; i < 10; i++) {
        const { container } = render(<LogoComponent />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
      }
    });
  });
});
