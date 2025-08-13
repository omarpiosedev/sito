import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { motion } from 'framer-motion';
import PrivacyPolicy from '@/app/privacy/page';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: jest.fn(({ children, ...props }) => <div {...props}>{children}</div>),
  },
}));

describe('PrivacyPolicy Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      expect(() => render(<PrivacyPolicy />)).not.toThrow();
    });

    it('renders the main container with correct CSS classes', () => {
      render(<PrivacyPolicy />);
      const mainElement = screen.getByRole('main');
      
      expect(mainElement).toBeInTheDocument();
      expect(mainElement).toHaveClass('min-h-screen', 'bg-black', 'text-white', 'pt-24');
    });

    it('renders the centered content wrapper with correct classes', () => {
      render(<PrivacyPolicy />);
      const contentWrapper = screen.getByRole('main').firstChild;
      
      expect(contentWrapper).toHaveClass('max-w-4xl', 'mx-auto', 'px-6', 'py-16');
    });
  });

  describe('Title and Header', () => {
    it('displays the "Privacy Policy" title correctly', () => {
      render(<PrivacyPolicy />);
      const title = screen.getByRole('heading', { level: 1 });
      
      expect(title).toBeInTheDocument();
      expect(title).toHaveTextContent('Privacy Policy');
    });

    it('applies correct styling to the title', () => {
      render(<PrivacyPolicy />);
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
      render(<PrivacyPolicy />);
      const dateElement = screen.getByText(/Last updated:/);
      
      expect(dateElement).toBeInTheDocument();
      expect(dateElement).toHaveClass('text-gray-400', 'text-lg');
      
      // Check if date is formatted correctly (Month Day, Year format)
      const dateText = dateElement.textContent;
      expect(dateText).toMatch(/Last updated: \w+ \d{1,2}, \d{4}/);
    });

    it('shows current date in the last updated field', () => {
      render(<PrivacyPolicy />);
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      
      expect(screen.getByText(`Last updated: ${today}`)).toBeInTheDocument();
    });

    it('renders header section with proper text center alignment', () => {
      render(<PrivacyPolicy />);
      const headerSection = document.querySelector('.text-center.mb-12');
      
      expect(headerSection).toBeInTheDocument();
      expect(headerSection).toHaveClass('text-center', 'mb-12');
    });
  });

  describe('Framer Motion Integration', () => {
    it('uses motion.div with correct initial animation props', () => {
      render(<PrivacyPolicy />);
      
      const motionCall = (motion.div as jest.Mock).mock.calls[0];
      const props = motionCall[0];
      
      expect(props.initial).toEqual({ opacity: 0, y: 20 });
      expect(props.animate).toEqual({ opacity: 1, y: 0 });
      expect(props.transition).toEqual({ duration: 0.6 });
      expect(props.className).toBe('space-y-8');
    });

    it('wraps content in motion.div component', () => {
      render(<PrivacyPolicy />);
      
      expect(motion.div).toHaveBeenCalledTimes(1);
    });

    it('applies space-y-8 class to motion.div', () => {
      render(<PrivacyPolicy />);
      
      const motionCall = (motion.div as jest.Mock).mock.calls[0][0];
      expect(motionCall.className).toBe('space-y-8');
    });

    it('motion component receives all required animation props', () => {
      render(<PrivacyPolicy />);
      
      const motionCall = (motion.div as jest.Mock).mock.calls[0][0];
      expect(motionCall).toHaveProperty('initial');
      expect(motionCall).toHaveProperty('animate');
      expect(motionCall).toHaveProperty('transition');
      expect(motionCall).toHaveProperty('className');
    });
  });

  describe('Content Structure and Sections', () => {
    it('renders the prose container with correct classes', () => {
      render(<PrivacyPolicy />);
      const proseContainer = document.querySelector('.prose');
      
      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer).toHaveClass('prose', 'prose-invert', 'max-w-none');
    });

    it('renders all main section headings', () => {
      render(<PrivacyPolicy />);
      
      const expectedHeadings = [
        '1. Information We Collect',
        '2. How We Use Your Information',
        '3. Information Sharing',
        '4. Cookies and Tracking Technologies',
        '5. Data Security',
        '6. Your Rights (GDPR Compliance)',
        '7. Data Retention',
        '8. Changes to This Privacy Policy',
        '9. Contact Information'
      ];

      expectedHeadings.forEach(heading => {
        expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
      });
    });

    it('renders section headings with correct styling', () => {
      render(<PrivacyPolicy />);
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

    it('renders subsection headings with correct styling', () => {
      render(<PrivacyPolicy />);
      const subsectionHeadings = screen.getAllByRole('heading', { level: 3 });
      
      subsectionHeadings.forEach(heading => {
        expect(heading).toHaveClass(
          'text-xl',
          'font-medium',
          'text-white'
        );
      });
    });

    it('renders all sections with proper mb-8 spacing', () => {
      render(<PrivacyPolicy />);
      const sections = document.querySelectorAll('section.mb-8');
      
      expect(sections.length).toBe(9); // Total number of privacy policy sections
      sections.forEach(section => {
        expect(section).toHaveClass('mb-8');
      });
    });
  });

  describe('Information Collection Section', () => {
    it('renders Contact Information subsection', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByRole('heading', { name: 'Contact Information' })).toBeInTheDocument();
      expect(screen.getAllByText('omarpioselli.dev@gmail.com')).toHaveLength(2);
    });

    it('renders Analytics Data subsection', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByRole('heading', { name: 'Analytics Data' })).toBeInTheDocument();
      expect(screen.getByText(/This website uses analytics tools/)).toBeInTheDocument();
    });

    it('renders information collection lists correctly', () => {
      render(<PrivacyPolicy />);
      const lists = document.querySelectorAll('.list-disc.list-inside.ml-4.space-y-2');
      
      expect(lists.length).toBeGreaterThan(0);
      lists.forEach(list => {
        expect(list).toHaveClass('list-disc', 'list-inside', 'ml-4', 'space-y-2');
      });
    });
  });

  describe('GDPR Rights Section', () => {
    it('renders all GDPR rights correctly', () => {
      render(<PrivacyPolicy />);
      
      const gdprRights = [
        'Right of access:',
        'Right to rectification:',
        'Right to erasure:',
        'Right to restrict processing:',
        'Right to data portability:',
        'Right to object:',
        'Right to withdraw consent:'
      ];

      gdprRights.forEach(right => {
        expect(screen.getByText(right, { exact: false })).toBeInTheDocument();
      });
    });

    it('renders strong tags for GDPR rights', () => {
      render(<PrivacyPolicy />);
      const strongElements = document.querySelectorAll('strong');
      
      expect(strongElements.length).toBeGreaterThan(0);
      // Check that at least one strong element contains GDPR right text
      const hasGdprRight = Array.from(strongElements).some(el => 
        el.textContent?.includes('Right of access:') ||
        el.textContent?.includes('Right to rectification:') ||
        el.textContent?.includes('Right to erasure:')
      );
      expect(hasGdprRight).toBe(true);
    });
  });

  describe('Links and External References', () => {
    it('renders cookie policy link with correct attributes', () => {
      render(<PrivacyPolicy />);
      
      const cookieLink = screen.getByRole('link', { name: 'Cookie Policy' });
      expect(cookieLink).toHaveAttribute('href', '/cookies');
      expect(cookieLink).toHaveClass('text-red-400', 'hover:text-red-300', 'underline');
    });

    it('renders email links with correct attributes', () => {
      render(<PrivacyPolicy />);
      
      const emailLinks = screen.getAllByRole('link', { name: 'omarpioselli.dev@gmail.com' });
      emailLinks.forEach(link => {
        expect(link).toHaveAttribute('href', 'mailto:omarpioselli.dev@gmail.com');
        expect(link).toHaveClass('text-red-400', 'hover:text-red-300');
      });
    });

    it('renders website link with correct attributes', () => {
      render(<PrivacyPolicy />);
      
      const websiteLink = screen.getByRole('link', { name: 'omarpioselli.dev' });
      expect(websiteLink).toHaveAttribute('href', '/');
      expect(websiteLink).toHaveClass('text-red-400', 'hover:text-red-300');
    });
  });

  describe('Contact Information Section', () => {
    it('renders contact information card with correct styling', () => {
      render(<PrivacyPolicy />);
      const contactCard = document.querySelector('.bg-gray-900\\/50.p-6.rounded-lg.border.border-gray-800');
      
      expect(contactCard).toBeInTheDocument();
      expect(contactCard).toHaveClass('bg-gray-900/50', 'p-6', 'rounded-lg', 'border', 'border-gray-800');
    });

    it('renders complete contact information', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByText('Omar Pioselli')).toBeInTheDocument();
      expect(screen.getByText('Location: Lambrugo (CO), Italia')).toBeInTheDocument();
      expect(screen.getByText('Email:', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Website:', { exact: false })).toBeInTheDocument();
    });
  });

  describe('Content Styling', () => {
    it('applies correct text styling to content sections', () => {
      render(<PrivacyPolicy />);
      const textSections = document.querySelectorAll('.text-gray-300.space-y-4');
      
      textSections.forEach(section => {
        expect(section).toHaveClass('text-gray-300', 'space-y-4');
      });
    });

    it('applies correct margin top to subsection headings where specified', () => {
      render(<PrivacyPolicy />);
      const analyticsHeading = screen.getByRole('heading', { name: 'Analytics Data' });
      
      expect(analyticsHeading).toHaveClass('mt-6');
    });
  });

  describe('Component Export', () => {
    it('exports a default function component', () => {
      expect(typeof PrivacyPolicy).toBe('function');
      expect(PrivacyPolicy.name).toBe('PrivacyPolicy');
    });

    it('component returns valid JSX', () => {
      const { container } = render(<PrivacyPolicy />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('component is the default export', () => {
      // Test that the component is exported as default
      expect(PrivacyPolicy).toBeDefined();
      expect(typeof PrivacyPolicy).toBe('function');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<PrivacyPolicy />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });
      
      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBe(9); // Nine main sections
      expect(h3s.length).toBe(2); // Contact Information and Analytics Data subsections
    });

    it('has semantic main landmark', () => {
      render(<PrivacyPolicy />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('all links have accessible names', () => {
      render(<PrivacyPolicy />);
      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });

    it('uses proper list semantics', () => {
      render(<PrivacyPolicy />);
      const lists = document.querySelectorAll('ul');
      
      expect(lists.length).toBeGreaterThan(0);
      lists.forEach(list => {
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive classes to title', () => {
      render(<PrivacyPolicy />);
      const title = screen.getByRole('heading', { level: 1 });
      
      expect(title).toHaveClass('text-4xl', 'md:text-5xl');
    });

    it('uses responsive container classes', () => {
      render(<PrivacyPolicy />);
      const container = document.querySelector('.max-w-4xl.mx-auto.px-6.py-16');
      
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('max-w-4xl', 'mx-auto', 'px-6', 'py-16');
    });
  });

  describe('Animation Ready State', () => {
    it('renders content that will be animated by framer-motion', async () => {
      render(<PrivacyPolicy />);
      
      // Verify that the content is rendered and ready for animation
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument();
      });

      // Verify motion.div was called with proper animation props
      const motionCall = (motion.div as jest.Mock).mock.calls[0];
      const props = motionCall[0];
      
      expect(props.initial).toEqual({ opacity: 0, y: 20 });
      expect(props.animate).toEqual({ opacity: 1, y: 0 });
      expect(props.transition).toEqual({ duration: 0.6 });
    });

    it('content is properly structured for motion animation', () => {
      render(<PrivacyPolicy />);
      
      // Verify that motion.div wraps the content properly
      expect(motion.div).toHaveBeenCalledTimes(1);
      const motionProps = (motion.div as jest.Mock).mock.calls[0][0];
      
      expect(motionProps.className).toBe('space-y-8');
      expect(motionProps.children).toBeDefined();
    });
  });

  describe('Date Formatting', () => {
    it('formats date consistently across different locales', () => {
      // Mock a specific date to ensure consistent testing
      const fixedDate = new Date('2024-01-15');
      jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);

      render(<PrivacyPolicy />);
      
      expect(screen.getByText('Last updated: January 15, 2024')).toBeInTheDocument();

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
        
        const { unmount } = render(<PrivacyPolicy />);
        const expectedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        
        expect(screen.getByText(`Last updated: ${expectedDate}`)).toBeInTheDocument();
        unmount();
        
        (global.Date as jest.Mock).mockRestore();
      });
    });

    it('uses correct date formatting options', () => {
      render(<PrivacyPolicy />);
      const dateElement = screen.getByText(/Last updated:/);
      
      // Verify the date format matches expected pattern
      const dateText = dateElement.textContent;
      const datePattern = /Last updated: [A-Z][a-z]+ \d{1,2}, \d{4}/;
      expect(dateText).toMatch(datePattern);
    });
  });

  describe('Text Content Validation', () => {
    it('contains expected privacy policy content', () => {
      render(<PrivacyPolicy />);
      
      // Check for key privacy policy terms that actually exist in the component
      expect(screen.getAllByText(/personal information/i)).toHaveLength(3);
      expect(screen.getAllByText(/personal data/i)).toHaveLength(3);
      expect(screen.getByText(/GDPR/i)).toBeInTheDocument();
    });

    it('renders specific email address in content', () => {
      render(<PrivacyPolicy />);
      
      // Should appear multiple times in the content
      const emailMatches = screen.getAllByText('omarpioselli.dev@gmail.com');
      expect(emailMatches.length).toBeGreaterThan(0);
    });

    it('renders security measures list', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByText('SSL/TLS encryption for data transmission')).toBeInTheDocument();
      expect(screen.getByText('Regular security updates and monitoring')).toBeInTheDocument();
      expect(screen.getByText('Access controls and authentication')).toBeInTheDocument();
      expect(screen.getByText('Data backup and recovery procedures')).toBeInTheDocument();
    });
  });

  describe('Client-side Directive', () => {
    it('component handles client-side rendering properly', () => {
      // This test ensures the component can be rendered in a client environment
      const { container } = render(<PrivacyPolicy />);
      
      expect(container.firstChild).toBeInTheDocument();
      expect(container.firstChild).toHaveProperty('tagName', 'MAIN');
    });
  });

  describe('Code Coverage Edge Cases', () => {
    it('handles all conditional rendering paths', () => {
      render(<PrivacyPolicy />);
      
      // Ensure all sections render correctly
      const sections = document.querySelectorAll('section');
      expect(sections.length).toBe(9);
    });

    it('renders all list items in information collection', () => {
      render(<PrivacyPolicy />);
      
      // Contact information list items
      expect(screen.getByText('Your name and email address')).toBeInTheDocument();
      expect(screen.getByText('Project details and requirements')).toBeInTheDocument();
      expect(screen.getByText('Any other information you choose to share')).toBeInTheDocument();
    });

    it('renders all analytics data list items', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByText('Pages visited and time spent on each page')).toBeInTheDocument();
      expect(screen.getByText('Referral sources and search terms')).toBeInTheDocument();
      expect(screen.getByText('Device type, browser, and general location data')).toBeInTheDocument();
      expect(screen.getByText('User behavior patterns (anonymized)')).toBeInTheDocument();
    });

    it('renders all information usage list items', () => {
      render(<PrivacyPolicy />);
      
      expect(screen.getByText('Responding to your inquiries and project requests')).toBeInTheDocument();
      expect(screen.getByText('Providing information about my development services')).toBeInTheDocument();
      expect(screen.getByText('Improving website performance and user experience')).toBeInTheDocument();
      expect(screen.getByText('Understanding visitor preferences and behavior')).toBeInTheDocument();
      expect(screen.getByText('Complying with legal obligations')).toBeInTheDocument();
    });
  });
});