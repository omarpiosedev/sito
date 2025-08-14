'use client';

import OptimizedImage from './optimized-image';
import StarRating from './star-rating';

interface FeedbackCardProps {
  quote: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
    rating: number;
  };
}

export default function FeedbackCard({ quote, author }: FeedbackCardProps) {
  return (
    <div className="relative w-full">
      <div className="relative rounded-3xl p-8 shadow-2xl overflow-hidden backdrop-blur-xl w-full h-96">
        {/* Liquid glass background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl"></div>

        {/* Glass border effect */}
        <div className="absolute inset-0 rounded-3xl border border-white/20"></div>
        {/* Quote marks */}
        <div className="absolute top-6 left-8 text-4xl text-red-500 font-serif leading-none">
          &quot;
        </div>

        {/* Quote text */}
        <div className="relative z-10 pt-12 pb-20 overflow-hidden">
          <p
            className="text-white text-sm leading-relaxed font-medium uppercase tracking-wide text-center"
            style={{
              fontFamily:
                'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {quote}
          </p>
        </div>

        {/* Author info */}
        <div className="flex items-center gap-3 absolute bottom-6 left-6 right-6">
          {/* Avatar */}
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700">
            {author.avatar ? (
              <OptimizedImage
                src={author.avatar}
                alt={author.name}
                fill
                priority={false} // Avatar non priority
                sizes="48px" // Dimensione fissa piccola per avatar
                quality={85} // Buona qualità per foto profilo
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
                {author.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Name and role */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-red-500 font-medium text-sm">
                {author.name}
              </h4>
              <StarRating rating={author.rating} size="md" />
            </div>
            <p className="text-white/60 text-xs">{author.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
