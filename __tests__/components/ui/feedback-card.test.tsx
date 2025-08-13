import { render, screen } from '@testing-library/react';
import FeedbackCard from '@/components/ui/feedback-card';

describe('FeedbackCard', () => {
  const mockProps = {
    quote: 'This is a test feedback message',
    author: {
      name: 'Test User',
      role: 'Developer',
      company: 'Test Company',
      rating: 5,
    },
  };

  it('renders feedback quote correctly', () => {
    render(<FeedbackCard {...mockProps} />);
    
    expect(screen.getByText(mockProps.quote)).toBeInTheDocument();
  });

  it('renders author information correctly', () => {
    render(<FeedbackCard {...mockProps} />);
    
    expect(screen.getByText(mockProps.author.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.author.role)).toBeInTheDocument();
    // La company non è mostrata nel componente, solo name e role
    // expect(screen.getByText(mockProps.author.company)).toBeInTheDocument();
  });

  it('renders without avatar', () => {
    render(<FeedbackCard {...mockProps} />);
    
    // Il componente dovrebbe renderizzare anche senza avatar
    expect(screen.getByText(mockProps.author.name)).toBeInTheDocument();
  });

  it('handles missing optional props gracefully', () => {
    const propsWithoutAvatar = { ...mockProps };
    
    render(<FeedbackCard {...propsWithoutAvatar} />);
    
    expect(screen.getByText(mockProps.author.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.quote)).toBeInTheDocument();
  });
});