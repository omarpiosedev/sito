import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { motion } from 'framer-motion';
import CookiePolicy from '@/app/cookies/page';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  },
}));

describe('CookiePolicy Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      expect(() => render(<CookiePolicy />)).not.toThrow();
    });

    it('renders the main container with correct CSS classes', () => {
      render(<CookiePolicy />);
      const mainElement = screen.getByRole('main');

      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveClass(
        'min-h-screen',
        'bg-black',
        'text-white',
        'pt-24'
      );
    });

    it('renders the centered content wrapper with correct classes', () => {
      render(<CookiePolicy />);
      const contentWrapper = screen.getByRole('main').firstChild;

      expect(contentWrapper).toHaveClass(
        'max-w-4xl',
        'mx-auto',
        'px-6',
        'py-16'
      );
    });
  });

  describe('Title and Header', () => {
    it('displays the "Cookie Policy" title correctly', () => {
      render(<CookiePolicy />);
      const title = screen.getByRole('heading', { level: 1 });

      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Cookie Policy');
    });

    it('applies correct styling to the title', () => {
      render(<CookiePolicy />);
      const title = screen.getByRole('heading', { level: 1 });

      expect(title).toHaveClass(
        'text-4xl',
        'md:text-5xl',
        'font-bold',
        'text-white',
        'mb-4'
      );
      expect(title).toHaveStyle({ fontFamily: 'Anton, sans-serif' });
    });

    it('displays the last updated date with proper formatting', () => {
      render(<CookiePolicy />);
      const dateElement = screen.getByText(/Last updated:/);

      expect(dateElement).toBeInTheDocument();
      expect(dateElement).toHaveClass('text-gray-400', 'text-lg');

      // Check if date is formatted correctly (Month Day, Year format)
      const dateText = dateElement.textContent;
      expect(dateText).toMatch(/Last updated: \w+ \d{1,2}, \d{4}/);
    });

    it('shows current date in the last updated field', () => {
      render(<CookiePolicy />);
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      expect(screen.getByText(`Last updated: ${today}`)).toBeInTheDocument();
    });
  });

  describe('Framer Motion Integration', () => {
    it('uses motion.div with correct initial animation props', () => {
      render(<CookiePolicy />);

      const motionCall = (motion.div as jest.Mock).mock.calls[0];
      const props = motionCall[0];

      expect(props.initial).toEqual({ opacity: 0, y: 20 });
      expect(props.animate).toEqual({ opacity: 1, y: 0 });
      expect(props.transition).toEqual({ duration: 0.6 });
      expect(props.className).toBe('space-y-8');
    });

    it('wraps content in motion.div component', () => {
      render(<CookiePolicy />);

      expect(motion.div).toHaveBeenCalledTimes(1);
    });

    it('applies space-y-8 class to motion.div', () => {
      render(<CookiePolicy />);

      const motionCall = (motion.div as jest.Mock).mock.calls[0][0];
      expect(motionCall.className).toBe('space-y-8');
    });
  });

  describe('Content Structure and Sections', () => {
    it('renders the prose container with correct classes', () => {
      render(<CookiePolicy />);
      const proseContainer = document.querySelector('.prose');

      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer).toHaveClass('prose', 'prose-invert', 'max-w-none');
    });

    it('renders all main section headings', () => {
      render(<CookiePolicy />);

      const expectedHeadings = [
        'What Are Cookies?',
        'Types of Cookies I Use',
        'Specific Cookies Used',
        'Third-Party Cookies',
        'How to Control Cookies',
        'Cookie Consent',
        'Updates to This Cookie Policy',
        'Contact Information',
        'Related Policies',
      ];

      expectedHeadings.forEach(heading => {
        expect(
          screen.getByRole('heading', { name: heading })
        ).toBeInTheDocument();
      });
    });

    it('renders section headings with correct styling', () => {
      render(<CookiePolicy />);
      const sectionHeadings = screen.getAllByRole('heading', { level: 2 });

      sectionHeadings.forEach(heading => {
        expect(heading).toHaveClass(
          'text-2xl',
          'font-semibold',
          'text-white',
          'mb-4',
          'border-b',
          'border-red-500/30',
          'pb-2'
        );
      });
    });

    it('renders cookie type cards with correct structure', () => {
      render(<CookiePolicy />);

      const cookieTypes = [
        'Essential Cookies',
        'Performance Cookies',
        'Functionality Cookies',
        'Analytics Cookies',
      ];

      cookieTypes.forEach(cookieType => {
        const heading = screen.getByRole('heading', { name: cookieType });
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveClass(
          'text-xl',
          'font-medium',
          'text-white',
          'mb-3',
          'flex',
          'items-center'
        );
      });
    });

    it('renders cookie types with colored indicators', () => {
      render(<CookiePolicy />);
      const colorIndicators = document.querySelectorAll('.w-3.h-3');

      expect(colorIndicators).toHaveLength(4);
      expect(colorIndicators[0]).toHaveClass('bg-green-500', 'rounded-full');
      expect(colorIndicators[1]).toHaveClass('bg-blue-500', 'rounded-full');
      expect(colorIndicators[2]).toHaveClass('bg-purple-500', 'rounded-full');
      expect(colorIndicators[3]).toHaveClass('bg-orange-500', 'rounded-full');
    });
  });

  describe('Cookie Table', () => {
    it('renders the cookie information table', () => {
      render(<CookiePolicy />);
      const table = screen.getByRole('table');

      expect(table).toBeInTheDocument();
      expect(table).toHaveClass(
        'w-full',
        'border-collapse',
        'border',
        'border-gray-700',
        'text-sm'
      );
    });

    it('renders table headers correctly', () => {
      render(<CookiePolicy />);
      const headers = ['Cookie Name', 'Purpose', 'Duration', 'Type'];

      headers.forEach(header => {
        expect(
          screen.getByRole('columnheader', { name: header })
        ).toBeInTheDocument();
      });
    });

    it('renders specific cookie entries', () => {
      render(<CookiePolicy />);

      const cookieNames = [
        '_ga',
        '_ga_*',
        '_gid',
        'next-session',
        'theme-preference',
      ];

      cookieNames.forEach(cookieName => {
        expect(screen.getByText(cookieName)).toBeInTheDocument();
      });
    });
  });

  describe('Third-Party Services', () => {
    it('renders Google Analytics section', () => {
      render(<CookiePolicy />);

      expect(
        screen.getByRole('heading', { name: 'Google Analytics' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Website analytics and performance monitoring')
      ).toBeInTheDocument();
    });

    it('renders Social Media Platforms section', () => {
      render(<CookiePolicy />);

      expect(
        screen.getByRole('heading', { name: 'Social Media Platforms' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('LinkedIn, Instagram, Freelancer')
      ).toBeInTheDocument();
    });

    it('renders external links with correct attributes', () => {
      render(<CookiePolicy />);

      const googlePrivacyLink = screen.getByRole('link', {
        name: 'Google Privacy Policy',
      });
      expect(googlePrivacyLink).toHaveAttribute(
        'href',
        'https://policies.google.com/privacy'
      );
      expect(googlePrivacyLink).toHaveAttribute('target', '_blank');
      expect(googlePrivacyLink).toHaveAttribute('rel', 'noopener noreferrer');

      const optOutLink = screen.getByRole('link', {
        name: 'Google Analytics Opt-out Browser Add-on',
      });
      expect(optOutLink).toHaveAttribute(
        'href',
        'https://tools.google.com/dlpage/gaoptout'
      );
      expect(optOutLink).toHaveAttribute('target', '_blank');
      expect(optOutLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Browser Instructions', () => {
    it('renders browser-specific cookie control instructions', () => {
      render(<CookiePolicy />);

      const browsers = ['Chrome:', 'Firefox:', 'Safari:', 'Edge:'];

      browsers.forEach(browser => {
        expect(screen.getByText(browser, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders warning message about disabling cookies', () => {
      render(<CookiePolicy />);

      expect(screen.getByText(/⚠️ Important:/)).toBeInTheDocument();
      expect(
        screen.getByText(
          /Disabling certain cookies may affect the functionality/
        )
      ).toBeInTheDocument();
    });
  });

  describe('Contact Information', () => {
    it('renders contact information section', () => {
      render(<CookiePolicy />);

      expect(
        screen.getByText('Omar Pioselli', { selector: 'strong' })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Location: Lambrugo (CO), Italia')
      ).toBeInTheDocument();
    });

    it('renders email link with correct attributes', () => {
      render(<CookiePolicy />);

      const emailLink = screen.getByRole('link', {
        name: 'omarpioselli.dev@gmail.com',
      });
      expect(emailLink).toHaveAttribute(
        'href',
        'mailto:omarpioselli.dev@gmail.com'
      );
      expect(emailLink).toHaveClass('text-red-400', 'hover:text-red-300');
    });

    it('renders website link with correct attributes', () => {
      render(<CookiePolicy />);

      const websiteLink = screen.getByRole('link', {
        name: 'omarpioselli.dev',
      });
      expect(websiteLink).toHaveAttribute('href', '/');
      expect(websiteLink).toHaveClass('text-red-400', 'hover:text-red-300');
    });
  });

  describe('Related Policies', () => {
    it('renders related policies section', () => {
      render(<CookiePolicy />);

      expect(
        screen.getByRole('heading', { name: 'Related Policies' })
      ).toBeInTheDocument();
    });

    it('renders links to privacy policy and terms of service', () => {
      render(<CookiePolicy />);

      const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' });
      expect(privacyLink).toHaveAttribute('href', '/privacy');
      expect(privacyLink).toHaveClass(
        'text-red-400',
        'hover:text-red-300',
        'underline'
      );

      const termsLink = screen.getByRole('link', { name: 'Terms of Service' });
      expect(termsLink).toHaveAttribute('href', '/terms');
      expect(termsLink).toHaveClass(
        'text-red-400',
        'hover:text-red-300',
        'underline'
      );
    });
  });

  describe('Component Export', () => {
    it('exports a default function component', () => {
      expect(typeof CookiePolicy).toBe('function');
      expect(CookiePolicy.name).toBe('CookiePolicy');
    });

    it('component returns valid JSX', () => {
      const { container } = render(<CookiePolicy />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<CookiePolicy />);

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('has semantic main landmark', () => {
      render(<CookiePolicy />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('all links have accessible names', () => {
      render(<CookiePolicy />);
      const links = screen.getAllByRole('link');

      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });

    it('table has proper structure', () => {
      render(<CookiePolicy />);
      const table = screen.getByRole('table');

      expect(table).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(4);
      expect(screen.getAllByRole('row')).toHaveLength(6); // 1 header + 5 data rows
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes to title', () => {
      render(<CookiePolicy />);
      const title = screen.getByRole('heading', { level: 1 });

      expect(title).toHaveClass('text-4xl', 'md:text-5xl');
    });

    it('applies responsive grid classes to browser instructions', () => {
      render(<CookiePolicy />);
      const browserGrid = document.querySelector(
        '.grid-cols-1.md\\:grid-cols-2'
      );

      expect(browserGrid).toBeInTheDocument();
    });

    it('has responsive overflow handling for table', () => {
      render(<CookiePolicy />);
      const tableWrapper = document.querySelector('.overflow-x-auto');

      expect(tableWrapper).toBeInTheDocument();
    });
  });

  describe('Animation Ready State', () => {
    it('renders content that will be animated by framer-motion', async () => {
      render(<CookiePolicy />);

      // Verify that the content is rendered and ready for animation
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: 'Cookie Policy' })
        ).toBeInTheDocument();
      });

      // Verify motion.div was called with proper animation props
      const motionCall = (motion.div as jest.Mock).mock.calls[0];
      const props = motionCall[0];

      expect(props.initial).toEqual({ opacity: 0, y: 20 });
      expect(props.animate).toEqual({ opacity: 1, y: 0 });
      expect(props.transition).toEqual({ duration: 0.6 });
    });
  });

  describe('Date Formatting', () => {
    it('formats date consistently across different locales', () => {
      // Mock a specific date to ensure consistent testing
      const fixedDate = new Date('2024-01-15');
      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

      render(<CookiePolicy />);

      expect(
        screen.getByText('Last updated: January 15, 2024')
      ).toBeInTheDocument();

      // Restore Date mock
      (global.Date as jest.Mock).mockRestore();
    });

    it('handles date formatting edge cases', () => {
      // Test with different dates
      const testDates = [
        new Date('2024-12-31'), // End of year
        new Date('2024-01-01'), // Beginning of year
        new Date('2024-02-29'), // Leap year
      ];

      testDates.forEach(date => {
        jest.spyOn(global, 'Date').mockImplementation(() => date);

        const { unmount } = render(<CookiePolicy />);
        const expectedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        expect(
          screen.getByText(`Last updated: ${expectedDate}`)
        ).toBeInTheDocument();
        unmount();

        (global.Date as jest.Mock).mockRestore();
      });
    });
  });
});
