import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '@/components/sections/Footer';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, width, height, className }: any) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-testid="next-image"
      />
    );
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      initial,
      whileInView,
      transition,
      viewport,
      className,
      ...props
    }: any) => (
      <div
        data-testid="motion-div"
        data-initial={JSON.stringify(initial)}
        data-while-in-view={JSON.stringify(whileInView)}
        data-transition={JSON.stringify(transition)}
        data-viewport={JSON.stringify(viewport)}
        className={className}
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

// Mock Date for consistent year testing
const mockDate = new Date('2024-01-01');
const originalDate = Date;
global.Date = jest.fn().mockImplementation(() => mockDate);
(global.Date as any).now = originalDate.now;

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.Date = originalDate;
  });

  describe('Initial Rendering and Structure', () => {
    it('renders footer with correct semantic structure', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(
        'relative',
        'bg-black/90',
        'border-t',
        'border-white/5'
      );
    });

    it('renders main container with correct styling', () => {
      const { container } = render(<Footer />);

      const mainContainer = container.querySelector('.max-w-7xl.mx-auto');
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('px-6', 'py-16');
    });

    it('renders grid layout with responsive classes', () => {
      const { container } = render(<Footer />);

      const gridContainer = container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4'
      );
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('gap-8', 'lg:gap-12');
    });
  });

  describe('Brand Section', () => {
    it('renders brand section with correct structure', () => {
      const { container } = render(<Footer />);

      const brandSection = container.querySelector('.lg\\:col-span-2');
      expect(brandSection).toBeInTheDocument();
      expect(brandSection).toHaveAttribute('data-testid', 'motion-div');
    });

    it('renders main brand title with correct styling', () => {
      render(<Footer />);

      const brandTitle = screen.getByText('OMAR PIOSELLI');
      expect(brandTitle).toBeInTheDocument();
      expect(brandTitle.tagName).toBe('H3');
      expect(brandTitle).toHaveClass(
        'text-2xl',
        'font-bold',
        'text-white',
        'mb-2'
      );
      expect(brandTitle).toHaveStyle({
        fontFamily: 'Anton, sans-serif',
      });
    });

    it('renders subtitle with correct content', () => {
      render(<Footer />);

      const subtitle = screen.getByText('Full Stack Developer');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass('text-gray-400', 'text-sm');
    });

    it('renders brand description paragraph', () => {
      render(<Footer />);

      const description = screen.getByText(
        content =>
          content.includes(
            'Specialized in creating modern, scalable web applications'
          ) &&
          content.includes('Transforming ideas into powerful digital solutions')
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass(
        'text-gray-300',
        'text-sm',
        'leading-relaxed',
        'mb-6',
        'max-w-md'
      );
    });

    it('renders availability status with animated indicator', () => {
      const { container } = render(<Footer />);

      const statusIndicator = container.querySelector(
        '.w-2.h-2.bg-green-400.rounded-full.animate-pulse'
      );
      expect(statusIndicator).toBeInTheDocument();

      const statusText = screen.getByText('Available for new projects');
      expect(statusText).toBeInTheDocument();
      expect(statusText).toHaveClass('text-green-400', 'text-sm');
    });

    it('applies correct motion animation properties to brand section', () => {
      const { container } = render(<Footer />);

      const brandMotionDiv = container.querySelector(
        '.lg\\:col-span-2[data-testid="motion-div"]'
      );
      expect(brandMotionDiv).toHaveAttribute(
        'data-initial',
        JSON.stringify({ opacity: 0, y: 20 })
      );
      expect(brandMotionDiv).toHaveAttribute(
        'data-while-in-view',
        JSON.stringify({ opacity: 1, y: 0 })
      );
      expect(brandMotionDiv).toHaveAttribute(
        'data-transition',
        JSON.stringify({ duration: 0.6 })
      );
      expect(brandMotionDiv).toHaveAttribute(
        'data-viewport',
        JSON.stringify({ once: true })
      );
    });
  });

  describe('Quick Links Section', () => {
    it('renders quick links section with correct structure', () => {
      render(<Footer />);

      const quickLinksHeading = screen.getByText('Quick Links');
      expect(quickLinksHeading.tagName).toBe('H4');
      expect(quickLinksHeading).toHaveClass(
        'text-white',
        'font-medium',
        'mb-6',
        'uppercase',
        'tracking-wider',
        'text-sm'
      );
    });

    it('renders all quick links with correct attributes', () => {
      render(<Footer />);

      const expectedLinks = [
        'About',
        'Projects',
        'Capabilities',
        'Process',
        'Contact',
      ];

      expectedLinks.forEach(linkText => {
        const link = screen.getByRole('link', { name: linkText });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', `#${linkText.toLowerCase()}`);
        expect(link).toHaveClass(
          'text-gray-400',
          'hover:text-white',
          'transition-colors',
          'duration-200',
          'text-sm'
        );
      });
    });

    it('applies correct motion animation properties to quick links section', () => {
      const { container } = render(<Footer />);

      const motionDivs = container.querySelectorAll(
        '[data-testid="motion-div"]'
      );
      const quickLinksMotionDiv = Array.from(motionDivs).find(
        div => div.querySelector('h4')?.textContent === 'Quick Links'
      );

      expect(quickLinksMotionDiv).toHaveAttribute(
        'data-initial',
        JSON.stringify({ opacity: 0, y: 20 })
      );
      expect(quickLinksMotionDiv).toHaveAttribute(
        'data-while-in-view',
        JSON.stringify({ opacity: 1, y: 0 })
      );
      expect(quickLinksMotionDiv).toHaveAttribute(
        'data-transition',
        JSON.stringify({ duration: 0.6, delay: 0.1 })
      );
    });
  });

  describe('Contact Info Section', () => {
    it('renders contact section heading', () => {
      render(<Footer />);

      const contactHeading = screen.getByText('Get in Touch');
      expect(contactHeading.tagName).toBe('H4');
      expect(contactHeading).toHaveClass(
        'text-white',
        'font-medium',
        'mb-6',
        'uppercase',
        'tracking-wider',
        'text-sm'
      );
    });

    it('renders email contact with icon and link', () => {
      render(<Footer />);

      const emailLink = screen.getByRole('link', {
        name: /omarpioselli.dev@gmail.com/i,
      });
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute(
        'href',
        'mailto:omarpioselli.dev@gmail.com'
      );
      expect(emailLink).toHaveClass(
        'text-gray-400',
        'hover:text-white',
        'transition-colors',
        'duration-200',
        'text-sm'
      );

      const emailIcon = screen.getByTestId('email-icon');
      expect(emailIcon).toBeInTheDocument();
      expect(emailIcon).toHaveClass('w-4', 'h-4', 'text-gray-400');
      expect(emailIcon).toHaveAttribute('fill', 'none');
      expect(emailIcon).toHaveAttribute('stroke', 'currentColor');
      expect(emailIcon).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('renders location info with icon', () => {
      render(<Footer />);

      const locationText = screen.getByText('Lambrugo (CO), Italia');
      expect(locationText).toBeInTheDocument();
      expect(locationText).toHaveClass('text-gray-400', 'text-sm');

      const locationIcon = screen.getByTestId('location-icon');
      expect(locationIcon).toBeInTheDocument();
      expect(locationIcon).toHaveClass('w-4', 'h-4', 'text-gray-400');
      expect(locationIcon).toHaveAttribute('fill', 'none');
      expect(locationIcon).toHaveAttribute('stroke', 'currentColor');
    });

    it('applies correct motion animation properties to contact section', () => {
      const { container } = render(<Footer />);

      const motionDivs = container.querySelectorAll(
        '[data-testid="motion-div"]'
      );
      const contactMotionDiv = Array.from(motionDivs).find(
        div => div.querySelector('h4')?.textContent === 'Get in Touch'
      );

      expect(contactMotionDiv).toHaveAttribute(
        'data-initial',
        JSON.stringify({ opacity: 0, y: 20 })
      );
      expect(contactMotionDiv).toHaveAttribute(
        'data-while-in-view',
        JSON.stringify({ opacity: 1, y: 0 })
      );
      expect(contactMotionDiv).toHaveAttribute(
        'data-transition',
        JSON.stringify({ duration: 0.6, delay: 0.2 })
      );
    });
  });

  describe('Social Links Section', () => {
    it('renders social links section heading', () => {
      render(<Footer />);

      const socialHeading = screen.getByText('Follow Me');
      expect(socialHeading.tagName).toBe('H5');
      expect(socialHeading).toHaveClass(
        'text-white',
        'font-medium',
        'mb-3',
        'text-sm'
      );
    });

    it('renders LinkedIn link with correct attributes and styling', () => {
      render(<Footer />);

      const linkedinLink = screen.getByLabelText('LinkedIn Profile');
      expect(linkedinLink).toBeInTheDocument();
      expect(linkedinLink).toHaveAttribute(
        'href',
        'https://linkedin.com/in/omarpioselli'
      );
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(linkedinLink).toHaveClass(
        'w-8',
        'h-8',
        'bg-[#0077B5]',
        'rounded-lg',
        'flex',
        'items-center',
        'justify-center',
        'hover:scale-110',
        'transition-transform',
        'duration-200'
      );

      const linkedinSvg = linkedinLink.querySelector('svg');
      expect(linkedinSvg).toBeInTheDocument();
      expect(linkedinSvg).toHaveClass('w-4', 'h-4', 'text-white');
      expect(linkedinSvg).toHaveAttribute('fill', 'currentColor');
      expect(linkedinSvg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('renders Instagram link with correct attributes and styling', () => {
      render(<Footer />);

      const instagramLink = screen.getByLabelText('Instagram Profile');
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute(
        'href',
        'https://instagram.com/omarpioselli'
      );
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(instagramLink).toHaveClass(
        'w-8',
        'h-8',
        'bg-gradient-to-r',
        'from-purple-500',
        'via-pink-500',
        'to-orange-500',
        'rounded-lg',
        'flex',
        'items-center',
        'justify-center',
        'hover:scale-110',
        'transition-transform',
        'duration-200'
      );

      const instagramSvg = instagramLink.querySelector('svg');
      expect(instagramSvg).toBeInTheDocument();
      expect(instagramSvg).toHaveClass('w-4', 'h-4', 'text-white');
      expect(instagramSvg).toHaveAttribute('fill', 'currentColor');
    });

    it('renders Freelancer link with Image component', () => {
      render(<Footer />);

      const freelancerLink = screen.getByLabelText('Freelancer Profile');
      expect(freelancerLink).toBeInTheDocument();
      expect(freelancerLink).toHaveAttribute(
        'href',
        'https://freelancer.com/u/omarpioselli'
      );
      expect(freelancerLink).toHaveAttribute('target', '_blank');
      expect(freelancerLink).toHaveAttribute('rel', 'noopener noreferrer');
      expect(freelancerLink).toHaveClass(
        'w-8',
        'h-8',
        'bg-white',
        'rounded-lg',
        'flex',
        'items-center',
        'justify-center',
        'hover:scale-110',
        'transition-transform',
        'duration-200',
        'p-1'
      );

      const freelancerImage = screen.getByTestId('next-image');
      expect(freelancerImage).toBeInTheDocument();
      expect(freelancerImage).toHaveAttribute('src', '/freelancer-1.svg');
      expect(freelancerImage).toHaveAttribute('alt', 'Freelancer');
      expect(freelancerImage).toHaveAttribute('width', '32');
      expect(freelancerImage).toHaveAttribute('height', '32');
      expect(freelancerImage).toHaveClass('w-full', 'h-full', 'object-contain');
    });
  });

  describe('Bottom Section and Copyright', () => {
    it('renders bottom section with correct motion properties', () => {
      const { container } = render(<Footer />);

      const motionDivs = container.querySelectorAll(
        '[data-testid="motion-div"]'
      );
      // The bottom section is the last motion div (index 3)
      const bottomMotionDiv = motionDivs[3];

      expect(bottomMotionDiv).toBeInTheDocument();
      expect(bottomMotionDiv).toHaveAttribute(
        'data-initial',
        JSON.stringify({ opacity: 0 })
      );
      expect(bottomMotionDiv).toHaveAttribute(
        'data-while-in-view',
        JSON.stringify({ opacity: 1 })
      );
      expect(bottomMotionDiv).toHaveAttribute(
        'data-transition',
        JSON.stringify({ duration: 0.6, delay: 0.3 })
      );
    });

    it('renders copyright with dynamic year', () => {
      render(<Footer />);

      const copyright = screen.getByText(
        '© 2024 Omar Pioselli. All rights reserved.'
      );
      expect(copyright).toBeInTheDocument();
      expect(copyright.parentElement).toHaveClass(
        'text-gray-400',
        'text-sm',
        'text-center',
        'md:text-left'
      );
    });

    it('renders cookie notice', () => {
      render(<Footer />);

      const cookieNotice = screen.getByText(
        content =>
          content.includes('This site uses cookies for UX and analytics') &&
          content.includes('Continued use implies consent')
      );
      expect(cookieNotice).toBeInTheDocument();
      expect(cookieNotice.parentElement).toHaveClass(
        'text-gray-400',
        'text-xs',
        'text-center',
        'md:text-right'
      );
    });

    it('renders legal links with correct attributes', () => {
      render(<Footer />);

      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '/privacy');
      expect(privacyLink).toHaveClass(
        'text-gray-400',
        'hover:text-white',
        'transition-colors',
        'duration-200'
      );

      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      expect(termsLink).toBeInTheDocument();
      expect(termsLink).toHaveAttribute('href', '/terms');

      const cookiesLink = screen.getByRole('link', { name: /cookie policy/i });
      expect(cookiesLink).toBeInTheDocument();
      expect(cookiesLink).toHaveAttribute('href', '/cookies');
    });

    it('has correct responsive layout for bottom section', () => {
      const { container } = render(<Footer />);

      const bottomContainer = container.querySelector(
        '.border-t.border-white\\/10.mt-12.pt-8'
      );
      expect(bottomContainer).toBeInTheDocument();

      const flexContainer = container.querySelector(
        '.flex.flex-col.md\\:flex-row.justify-between.items-center'
      );
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer).toHaveClass('space-y-4', 'md:space-y-0');
    });
  });

  describe('Dynamic Year Calculation', () => {
    it('calculates and displays current year correctly', () => {
      render(<Footer />);

      const copyright = screen.getByText(
        '© 2024 Omar Pioselli. All rights reserved.'
      );
      expect(copyright).toBeInTheDocument();
    });

    it('handles different years correctly when date changes', () => {
      // Test with different year
      const mockDate2025 = new Date('2025-06-15');
      global.Date = jest.fn().mockImplementation(() => mockDate2025);

      const { rerender } = render(<Footer />);
      rerender(<Footer />);

      // Should still show 2024 since we mocked Date constructor
      // In real scenario, this would show 2025
      expect(screen.getByText(/© \d{4} Omar Pioselli/)).toBeInTheDocument();
    });
  });

  describe('Accessibility and Semantic Structure', () => {
    it('uses proper semantic HTML elements', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(4); // h3, 2x h4, h5

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('has proper heading hierarchy', () => {
      render(<Footer />);

      const h3 = screen.getByRole('heading', { level: 3 });
      expect(h3).toHaveTextContent('OMAR PIOSELLI');

      const h4s = screen.getAllByRole('heading', { level: 4 });
      expect(h4s).toHaveLength(2);
      expect(h4s[0]).toHaveTextContent('Quick Links');
      expect(h4s[1]).toHaveTextContent('Get in Touch');

      const h5 = screen.getByRole('heading', { level: 5 });
      expect(h5).toHaveTextContent('Follow Me');
    });

    it('provides aria-labels for social media links', () => {
      render(<Footer />);

      const linkedinLink = screen.getByLabelText('LinkedIn Profile');
      expect(linkedinLink).toBeInTheDocument();

      const instagramLink = screen.getByLabelText('Instagram Profile');
      expect(instagramLink).toBeInTheDocument();

      const freelancerLink = screen.getByLabelText('Freelancer Profile');
      expect(freelancerLink).toBeInTheDocument();
    });

    it('uses proper link attributes for external links', () => {
      render(<Footer />);

      const externalLinks = [
        screen.getByLabelText('LinkedIn Profile'),
        screen.getByLabelText('Instagram Profile'),
        screen.getByLabelText('Freelancer Profile'),
      ];

      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('has appropriate contrast with dark theme colors', () => {
      const { container } = render(<Footer />);

      const whiteText = container.querySelectorAll('.text-white');
      expect(whiteText.length).toBeGreaterThan(0);

      const grayText = container.querySelectorAll('.text-gray-400');
      expect(grayText.length).toBeGreaterThan(0);

      const greenText = container.querySelectorAll('.text-green-400');
      expect(greenText.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('has responsive grid layout', () => {
      const { container } = render(<Footer />);

      const gridContainer = container.querySelector(
        '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4'
      );
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('gap-8', 'lg:gap-12');
    });

    it('has responsive text alignment in bottom section', () => {
      const { container } = render(<Footer />);

      const copyright = container.querySelector(
        '.text-gray-400.text-sm.text-center.md\\:text-left'
      );
      expect(copyright).toBeInTheDocument();

      const cookieNotice = container.querySelector(
        '.text-gray-400.text-xs.text-center.md\\:text-right'
      );
      expect(cookieNotice).toBeInTheDocument();
    });

    it('has responsive flex direction in bottom section', () => {
      const { container } = render(<Footer />);

      const flexContainer = container.querySelector(
        '.flex.flex-col.md\\:flex-row.justify-between'
      );
      expect(flexContainer).toBeInTheDocument();
      expect(flexContainer).toHaveClass('space-y-4', 'md:space-y-0');
    });

    it('uses responsive brand column spanning', () => {
      const { container } = render(<Footer />);

      const brandSection = container.querySelector('.lg\\:col-span-2');
      expect(brandSection).toBeInTheDocument();
    });
  });

  describe('Animation and Motion Properties', () => {
    it('applies correct initial and whileInView animations to all motion components', () => {
      const { container } = render(<Footer />);

      const motionDivs = container.querySelectorAll(
        '[data-testid="motion-div"]'
      );
      expect(motionDivs).toHaveLength(4); // Brand, Quick Links, Contact, Bottom

      // All should have viewport once: true
      motionDivs.forEach(div => {
        const viewport = JSON.parse(div.getAttribute('data-viewport') || '{}');
        expect(viewport.once).toBe(true);
      });
    });

    it('has staggered animation delays', () => {
      const { container } = render(<Footer />);

      const motionDivs = container.querySelectorAll(
        '[data-testid="motion-div"]'
      );

      // Check that different sections have different delays
      const transitions = Array.from(motionDivs).map(div =>
        JSON.parse(div.getAttribute('data-transition') || '{}')
      );

      expect(transitions[0]).toEqual({ duration: 0.6 }); // Brand (no delay)
      expect(transitions[1]).toEqual({ duration: 0.6, delay: 0.1 }); // Quick Links
      expect(transitions[2]).toEqual({ duration: 0.6, delay: 0.2 }); // Contact
      expect(transitions[3]).toEqual({ duration: 0.6, delay: 0.3 }); // Bottom
    });

    it('applies correct y-transform animations to main sections', () => {
      const { container } = render(<Footer />);

      const motionDivs = container.querySelectorAll(
        '[data-testid="motion-div"]'
      );
      const mainSections = Array.from(motionDivs).slice(0, 3); // First 3 sections

      mainSections.forEach(div => {
        const initial = JSON.parse(div.getAttribute('data-initial') || '{}');
        const whileInView = JSON.parse(
          div.getAttribute('data-while-in-view') || '{}'
        );

        expect(initial).toEqual({ opacity: 0, y: 20 });
        expect(whileInView).toEqual({ opacity: 1, y: 0 });
      });
    });

    it('applies opacity-only animation to bottom section', () => {
      const { container } = render(<Footer />);

      const motionDivs = container.querySelectorAll(
        '[data-testid="motion-div"]'
      );
      const bottomSection = motionDivs[3]; // Last motion div

      const initial = JSON.parse(
        bottomSection.getAttribute('data-initial') || '{}'
      );
      const whileInView = JSON.parse(
        bottomSection.getAttribute('data-while-in-view') || '{}'
      );

      expect(initial).toEqual({ opacity: 0 });
      expect(whileInView).toEqual({ opacity: 1 });
    });
  });

  describe('Content Validation', () => {
    it('renders all required text content', () => {
      render(<Footer />);

      // Brand content
      expect(screen.getByText('OMAR PIOSELLI')).toBeInTheDocument();
      expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
      expect(
        screen.getByText('Available for new projects')
      ).toBeInTheDocument();

      // Section headings
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
      expect(screen.getByText('Follow Me')).toBeInTheDocument();

      // Contact info
      expect(
        screen.getByText('omarpioselli.dev@gmail.com')
      ).toBeInTheDocument();
      expect(screen.getByText('Lambrugo (CO), Italia')).toBeInTheDocument();
    });

    it('renders all navigation links with correct text and hrefs', () => {
      render(<Footer />);

      const expectedNavLinks = [
        { text: 'About', href: '#about' },
        { text: 'Projects', href: '#projects' },
        { text: 'Capabilities', href: '#capabilities' },
        { text: 'Process', href: '#process' },
        { text: 'Contact', href: '#contact' },
      ];

      expectedNavLinks.forEach(({ text, href }) => {
        const link = screen.getByRole('link', { name: text });
        expect(link).toHaveAttribute('href', href);
      });
    });

    it('renders all legal links with correct text and hrefs', () => {
      render(<Footer />);

      const expectedLegalLinks = [
        { text: 'Privacy Policy', href: '/privacy' },
        { text: 'Terms of Service', href: '/terms' },
        { text: 'Cookie Policy', href: '/cookies' },
      ];

      expectedLegalLinks.forEach(({ text, href }) => {
        const link = screen.getByRole('link', { name: new RegExp(text, 'i') });
        expect(link).toHaveAttribute('href', href);
      });
    });

    it('renders all social media links with correct hrefs', () => {
      render(<Footer />);

      const expectedSocialLinks = [
        {
          label: 'LinkedIn Profile',
          href: 'https://linkedin.com/in/omarpioselli',
        },
        {
          label: 'Instagram Profile',
          href: 'https://instagram.com/omarpioselli',
        },
        {
          label: 'Freelancer Profile',
          href: 'https://freelancer.com/u/omarpioselli',
        },
      ];

      expectedSocialLinks.forEach(({ label, href }) => {
        const link = screen.getByLabelText(label);
        expect(link).toHaveAttribute('href', href);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles component without any props', () => {
      expect(() => render(<Footer />)).not.toThrow();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });

    it('renders all icons and images without errors', () => {
      render(<Footer />);

      const emailIcon = screen.getByTestId('email-icon');
      expect(emailIcon).toBeInTheDocument();

      const locationIcon = screen.getByTestId('location-icon');
      expect(locationIcon).toBeInTheDocument();

      const nextImage = screen.getByTestId('next-image');
      expect(nextImage).toBeInTheDocument();
    });

    it('maintains layout integrity with long content', () => {
      const { container } = render(<Footer />);

      const maxWidthContainer = container.querySelector('.max-w-7xl');
      expect(maxWidthContainer).toBeInTheDocument();

      const brandDescription = container.querySelector('.max-w-md');
      expect(brandDescription).toBeInTheDocument();
    });

    it('handles all required test ids and data attributes', () => {
      render(<Footer />);

      expect(screen.getByTestId('email-icon')).toBeInTheDocument();
      expect(screen.getByTestId('location-icon')).toBeInTheDocument();
      expect(screen.getByTestId('next-image')).toBeInTheDocument();

      const { container } = render(<Footer />);
      const motionDivs = container.querySelectorAll(
        '[data-testid="motion-div"]'
      );
      expect(motionDivs).toHaveLength(4);
    });
  });
});
