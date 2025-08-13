import { render } from '@testing-library/react';
import Home from '@/app/page';

// Mock di tutti i componenti importati
jest.mock('@/components/sections/hero', () => {
  return function MockHero() {
    return <div data-testid="hero">Hero Section</div>;
  };
});

jest.mock('@/components/sections/About', () => {
  return function MockAbout() {
    return <div data-testid="about">About Section</div>;
  };
});

jest.mock('@/components/sections/Projects', () => {
  return function MockProjects() {
    return <div data-testid="projects">Projects Section</div>;
  };
});

jest.mock('@/components/sections/Capabilities', () => {
  return function MockCapabilities() {
    return <div data-testid="capabilities">Capabilities Section</div>;
  };
});

jest.mock('@/components/sections/Process', () => {
  return function MockProcess() {
    return <div data-testid="process">Process Section</div>;
  };
});

jest.mock('@/components/sections/FeedbacksSection', () => {
  return function MockFeedbacksSection() {
    return <div data-testid="feedbacks">Feedbacks Section</div>;
  };
});

jest.mock('@/components/sections/Contact', () => {
  return function MockContact() {
    return <div data-testid="contact">Contact Section</div>;
  };
});

jest.mock('@/components/sections/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer Section</div>;
  };
});

jest.mock('@/components/sections/SectionDivider', () => {
  return function MockSectionDivider(props: any) {
    return (
      <div data-testid="section-divider" data-text={props.text}>
        Section Divider: {props.text}
      </div>
    );
  };
});

jest.mock('@/components/sections/ScrollingBanner', () => {
  return function MockScrollingBanner() {
    return <div data-testid="scrolling-banner">Scrolling Banner</div>;
  };
});

describe('Home Page', () => {
  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Home />);
      expect(container).toBeInTheDocument();
    });

    it('renders ScrollingBanner at the top', () => {
      const { getByTestId } = render(<Home />);
      expect(getByTestId('scrolling-banner')).toBeInTheDocument();
    });

    it('renders main element with correct structure', () => {
      const { container } = render(<Home />);
      const main = container.querySelector('main');
      
      expect(main).toBeInTheDocument();
      expect(main).toHaveClass('relative', 'z-10');
    });

    it('renders all main sections', () => {
      const { getByTestId } = render(<Home />);
      
      expect(getByTestId('hero')).toBeInTheDocument();
      expect(getByTestId('about')).toBeInTheDocument();
      expect(getByTestId('projects')).toBeInTheDocument();
      expect(getByTestId('capabilities')).toBeInTheDocument();
      expect(getByTestId('process')).toBeInTheDocument();
      expect(getByTestId('feedbacks')).toBeInTheDocument();
      expect(getByTestId('contact')).toBeInTheDocument();
      expect(getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('Section Dividers', () => {
    it('renders ABOUT ME section divider', () => {
      const { getAllByTestId } = render(<Home />);
      
      const dividers = getAllByTestId('section-divider');
      const aboutDivider = dividers.find(div => div.getAttribute('data-text') === 'ABOUT ME');
      expect(aboutDivider).toBeDefined();
      expect(aboutDivider).toHaveAttribute('data-text', 'ABOUT ME');
    });

    it('renders all section dividers with correct text', () => {
      const { getAllByTestId } = render(<Home />);
      
      const dividers = getAllByTestId('section-divider');
      expect(dividers).toHaveLength(4); // ABOUT ME, CAPABILITIES, PROCESS, CONTACT
      
      const dividerTexts = dividers.map(div => div.getAttribute('data-text'));
      expect(dividerTexts).toEqual(['ABOUT ME', 'CAPABILITIES', 'PROCESS', 'CONTACT']);
    });
  });

  describe('Page Structure', () => {
    it('maintains correct component hierarchy', () => {
      const { container, getByTestId } = render(<Home />);
      
      // Verifica la presenza del React Fragment root
      expect(container.firstChild).toBeDefined();
      
      // Verifica che ScrollingBanner sia presente
      expect(getByTestId('scrolling-banner')).toBeInTheDocument();
      
      // Verifica che main sia presente con contenuto
      const main = container.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main?.children.length).toBeGreaterThan(0);
    });

    it('has correct CSS classes on main container', () => {
      const { container } = render(<Home />);
      
      const main = container.querySelector('main');
      expect(main).toHaveClass('relative', 'z-10');
      
      const bgContainer = main?.querySelector('.bg-black');
      expect(bgContainer).toBeInTheDocument();
    });

    it('includes transparent spacer div at the end', () => {
      const { container } = render(<Home />);
      
      // Cerca il div con altezza 48 (h-48)
      const spacerDiv = container.querySelector('.h-48');
      expect(spacerDiv).toBeInTheDocument();
    });
  });

  describe('Special Styling and Layout', () => {
    it('renders process section with special z-index styling', () => {
      const { container } = render(<Home />);
      
      // Cerca il div con relative z-30 -mt-32 che contiene PROCESS
      const processWrapper = container.querySelector('.relative.z-30.-mt-32');
      expect(processWrapper).toBeInTheDocument();
    });

    it('applies correct background styling', () => {
      const { container } = render(<Home />);
      
      const bgContainer = container.querySelector('.bg-black');
      expect(bgContainer).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('integrates all components without errors', () => {
      // Test che tutti i componenti si renderizzino insieme senza errori
      expect(() => {
        render(<Home />);
      }).not.toThrow();
    });

    it('maintains proper component order', () => {
      const { container } = render(<Home />);
      
      const main = container.querySelector('main');
      const children = Array.from(main?.children || []);
      
      // Verifica che ci sia almeno il container bg-black
      expect(children.length).toBeGreaterThan(0);
      
      const bgContainer = children.find(child => 
        child.classList.contains('bg-black')
      );
      expect(bgContainer).toBeDefined();
    });
  });
});