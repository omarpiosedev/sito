'use client';

import { useRef } from 'react';
import FeedbackCard from './feedback-card';

interface StickyFeedbackCardProps {
  feedback: {
    id: number;
    quote: string;
    author: {
      name: string;
      role: string;
      company: string;
      avatar?: string;
      rating: number;
    };
    position: {
      top?: string;
      left?: string;
      right?: string;
    };
  };
  // index: number; // Removed unused prop
}

export default function StickyFeedbackCard({
  feedback,
}: StickyFeedbackCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="sticky z-10"
      style={{
        top: '20vh',
        position: 'absolute',
        ...feedback.position,
        width: '300px',
        maxWidth: '300px',
      }}
    >
      <FeedbackCard quote={feedback.quote} author={feedback.author} />
    </div>
  );
}
