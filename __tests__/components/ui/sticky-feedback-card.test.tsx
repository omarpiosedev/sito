import { render, screen } from '@testing-library/react';
import StickyFeedbackCard from '@/components/ui/sticky-feedback-card';

// Mock FeedbackCard component since it's already tested separately
jest.mock('@/components/ui/feedback-card', () => {
  return function MockFeedbackCard({
    quote,
    author,
  }: {
    quote: string;
    author: {
      name: string;
      role: string;
      company: string;
      avatar?: string;
      rating: number;
    };
  }) {
    return (
      <div data-testid="feedback-card">
        <div data-testid="quote">{quote}</div>
        <div data-testid="author-name">{author.name}</div>
        <div data-testid="author-role">{author.role}</div>
        <div data-testid="author-company">{author.company}</div>
        <div data-testid="author-rating">{author.rating}</div>
        {author.avatar && (
          <div data-testid="author-avatar">{author.avatar}</div>
        )}
      </div>
    );
  };
});

describe('StickyFeedbackCard', () => {
  const mockFeedback = {
    id: 1,
    quote: 'This is an amazing product! The user experience is fantastic.',
    author: {
      name: 'John Smith',
      role: 'Senior Developer',
      company: 'Tech Corp',
      avatar: 'https://example.com/avatar.jpg',
      rating: 5,
    },
    position: {
      top: '10vh',
      left: '2rem',
    },
  };

  describe('Rendering', () => {
    it('renders with all feedback data', () => {
      render(<StickyFeedbackCard feedback={mockFeedback} />);

      expect(screen.getByTestId('feedback-card')).toBeInTheDocument();
      expect(screen.getByTestId('quote')).toHaveTextContent(mockFeedback.quote);
      expect(screen.getByTestId('author-name')).toHaveTextContent(
        mockFeedback.author.name
      );
      expect(screen.getByTestId('author-role')).toHaveTextContent(
        mockFeedback.author.role
      );
      expect(screen.getByTestId('author-company')).toHaveTextContent(
        mockFeedback.author.company
      );
      expect(screen.getByTestId('author-rating')).toHaveTextContent(
        mockFeedback.author.rating.toString()
      );
      expect(screen.getByTestId('author-avatar')).toHaveTextContent(
        mockFeedback.author.avatar!
      );
    });

    it('renders without avatar', () => {
      const feedbackWithoutAvatar = {
        ...mockFeedback,
        author: {
          ...mockFeedback.author,
          avatar: undefined,
        },
      };

      render(<StickyFeedbackCard feedback={feedbackWithoutAvatar} />);

      expect(screen.getByTestId('feedback-card')).toBeInTheDocument();
      expect(screen.queryByTestId('author-avatar')).not.toBeInTheDocument();
    });

    it('passes feedback props correctly to FeedbackCard', () => {
      render(<StickyFeedbackCard feedback={mockFeedback} />);

      expect(screen.getByTestId('quote')).toHaveTextContent(mockFeedback.quote);
      expect(screen.getByTestId('author-name')).toHaveTextContent(
        mockFeedback.author.name
      );
    });
  });

  describe('Container Styling and Structure', () => {
    it('has correct container classes and styling', () => {
      const { container } = render(
        <StickyFeedbackCard feedback={mockFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer).toHaveClass('sticky', 'z-10');
    });

    it('applies default styling correctly', () => {
      const { container } = render(
        <StickyFeedbackCard feedback={mockFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      const styles = window.getComputedStyle(stickyContainer);

      // Check inline styles that should be applied
      expect(stickyContainer.style.width).toBe('300px');
      expect(stickyContainer.style.maxWidth).toBe('300px');
      expect(stickyContainer.style.position).toBe('absolute');
      expect(stickyContainer.style.top).toBe('10vh'); // Custom position from mockFeedback
    });

    it('applies custom position styling from props', () => {
      const customPositionFeedback = {
        ...mockFeedback,
        position: {
          top: '50vh',
          left: '100px',
          right: '50px',
        },
      };

      const { container } = render(
        <StickyFeedbackCard feedback={customPositionFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer.style.top).toBe('50vh');
      expect(stickyContainer.style.left).toBe('100px');
      expect(stickyContainer.style.right).toBe('50px');
    });

    it('has correct ref element', () => {
      const { container } = render(
        <StickyFeedbackCard feedback={mockFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer.tagName).toBe('DIV');
    });
  });

  describe('Position Variations', () => {
    it('handles position with only top', () => {
      const feedbackWithTopOnly = {
        ...mockFeedback,
        position: {
          top: '30vh',
        },
      };

      const { container } = render(
        <StickyFeedbackCard feedback={feedbackWithTopOnly} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer.style.top).toBe('30vh');
      expect(stickyContainer.style.left).toBe('');
      expect(stickyContainer.style.right).toBe('');
    });

    it('handles position with only left', () => {
      const feedbackWithLeftOnly = {
        ...mockFeedback,
        position: {
          left: '200px',
        },
      };

      const { container } = render(
        <StickyFeedbackCard feedback={feedbackWithLeftOnly} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer.style.left).toBe('200px');
      expect(stickyContainer.style.top).toBe('20vh'); // Default top
      expect(stickyContainer.style.right).toBe('');
    });

    it('handles position with only right', () => {
      const feedbackWithRightOnly = {
        ...mockFeedback,
        position: {
          right: '100px',
        },
      };

      const { container } = render(
        <StickyFeedbackCard feedback={feedbackWithRightOnly} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer.style.right).toBe('100px');
      expect(stickyContainer.style.top).toBe('20vh'); // Default top
      expect(stickyContainer.style.left).toBe('');
    });

    it('handles empty position object', () => {
      const feedbackWithEmptyPosition = {
        ...mockFeedback,
        position: {},
      };

      const { container } = render(
        <StickyFeedbackCard feedback={feedbackWithEmptyPosition} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer.style.top).toBe('20vh'); // Default top
      expect(stickyContainer.style.left).toBe('');
      expect(stickyContainer.style.right).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('handles minimal feedback data', () => {
      const minimalFeedback = {
        id: 0,
        quote: '',
        author: {
          name: '',
          role: '',
          company: '',
          rating: 0,
        },
        position: {},
      };

      render(<StickyFeedbackCard feedback={minimalFeedback} />);

      expect(screen.getByTestId('feedback-card')).toBeInTheDocument();
      expect(screen.getByTestId('quote')).toHaveTextContent('');
      expect(screen.getByTestId('author-name')).toHaveTextContent('');
      expect(screen.getByTestId('author-rating')).toHaveTextContent('0');
    });

    it('handles negative ID', () => {
      const feedbackWithNegativeId = {
        ...mockFeedback,
        id: -1,
      };

      render(<StickyFeedbackCard feedback={feedbackWithNegativeId} />);

      expect(screen.getByTestId('feedback-card')).toBeInTheDocument();
    });

    it('handles long quote text', () => {
      const feedbackWithLongQuote = {
        ...mockFeedback,
        quote:
          "This is a very long feedback quote that might span multiple lines and test the component's ability to handle extensive text content without breaking the layout or causing any rendering issues.",
      };

      render(<StickyFeedbackCard feedback={feedbackWithLongQuote} />);

      expect(screen.getByTestId('quote')).toHaveTextContent(
        feedbackWithLongQuote.quote
      );
    });

    it('handles special characters in feedback data', () => {
      const feedbackWithSpecialChars = {
        ...mockFeedback,
        quote: 'Amazing! @#$%^&*()_+ "quotes" <tags> &amp; entities',
        author: {
          ...mockFeedback.author,
          name: 'Jöhn Døe & Co.',
          company: 'Tech <Corp> & "Associates"',
        },
      };

      render(<StickyFeedbackCard feedback={feedbackWithSpecialChars} />);

      expect(screen.getByTestId('quote')).toHaveTextContent(
        feedbackWithSpecialChars.quote
      );
      expect(screen.getByTestId('author-name')).toHaveTextContent(
        feedbackWithSpecialChars.author.name
      );
    });
  });

  describe('Component Integration', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(
        <StickyFeedbackCard feedback={mockFeedback} />
      );

      expect(screen.getByTestId('feedback-card')).toBeInTheDocument();

      rerender(<StickyFeedbackCard feedback={mockFeedback} />);

      expect(screen.getByTestId('feedback-card')).toBeInTheDocument();
    });

    it('maintains ref correctly', () => {
      const { container } = render(
        <StickyFeedbackCard feedback={mockFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer).toBeInTheDocument();
      expect(stickyContainer.tagName).toBe('DIV');
    });
  });

  describe('Accessibility', () => {
    it('maintains semantic structure', () => {
      const { container } = render(
        <StickyFeedbackCard feedback={mockFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer.tagName).toBe('DIV');
      expect(screen.getByTestId('feedback-card')).toBeInTheDocument();
    });

    it('has proper positioning for screen readers', () => {
      const { container } = render(
        <StickyFeedbackCard feedback={mockFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      // Sticky positioning should not interfere with screen reader navigation
      expect(stickyContainer).toHaveClass('sticky');
    });
  });

  describe('Visual Layout', () => {
    it('has correct z-index for layering', () => {
      const { container } = render(
        <StickyFeedbackCard feedback={mockFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer).toHaveClass('z-10');
    });

    it('has fixed width constraints', () => {
      const { container } = render(
        <StickyFeedbackCard feedback={mockFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer.style.width).toBe('300px');
      expect(stickyContainer.style.maxWidth).toBe('300px');
    });

    it('overrides default top position with custom position', () => {
      const customTopFeedback = {
        ...mockFeedback,
        position: {
          top: '80vh',
        },
      };

      const { container } = render(
        <StickyFeedbackCard feedback={customTopFeedback} />
      );

      const stickyContainer = container.firstChild as HTMLElement;
      expect(stickyContainer.style.top).toBe('80vh');
    });
  });
});
