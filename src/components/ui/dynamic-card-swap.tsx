'use client';

import dynamic from 'next/dynamic';
import React, { Suspense, useState, useEffect } from 'react';

// Dynamic import del componente CardSwap pesante
const CardSwap = dynamic(
  () => import('@/components/reactbits/Components/CardSwap/CardSwap'),
  {
    loading: () => <CardSwapSkeleton />,
    ssr: false, // Evita problemi di hydration con animazioni GSAP
  }
);

// Dynamic import del componente Card
const Card = dynamic(
  () =>
    import('@/components/reactbits/Components/CardSwap/CardSwap').then(mod => ({
      default: mod.Card,
    })),
  {
    loading: () => (
      <div className="w-full h-full animate-pulse bg-gray-800/50 rounded-lg" />
    ),
    ssr: false,
  }
);

/**
 * Skeleton loader per CardSwap component
 * Mantiene le dimensioni e layout durante il caricamento
 */
function CardSwapSkeleton({ width = 350, height = 450 }: { width?: number | string; height?: number | string }) {
  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {/* Container principale skeleton */}
      <div className="relative">
        {/* Card principale skeleton */}
        <div 
          className="bg-gradient-to-br from-gray-900/90 to-black/95 backdrop-blur-sm border border-gray-800/50 rounded-lg animate-pulse" 
          style={{ 
            width: typeof width === 'number' ? `${width}px` : width, 
            height: typeof height === 'number' ? `${height}px` : height 
          }}
        >
          <div className="p-8 h-full flex flex-col justify-between">
            {/* Header skeleton */}
            <div>
              <div className="w-12 h-4 bg-orange-500/50 rounded mb-4 animate-pulse" />
              <div className="w-32 h-8 bg-gray-700/50 rounded mb-8 animate-pulse" />

              {/* List items skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500/50 rounded-full mr-3" />
                    <div className="w-20 h-4 bg-gray-700/50 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cards di background per indicare lo stack */}
        <div 
          className="absolute top-2 left-2 bg-gradient-to-br from-gray-900/70 to-black/80 backdrop-blur-sm border border-gray-800/30 rounded-lg -z-10" 
          style={{ 
            width: typeof width === 'number' ? `${width}px` : width, 
            height: typeof height === 'number' ? `${height}px` : height 
          }}
        />
        <div 
          className="absolute top-4 left-4 bg-gradient-to-br from-gray-900/50 to-black/70 backdrop-blur-sm border border-gray-800/20 rounded-lg -z-20" 
          style={{ 
            width: typeof width === 'number' ? `${width}px` : width, 
            height: typeof height === 'number' ? `${height}px` : height 
          }}
        />
      </div>
    </div>
  );
}

/**
 * Wrapper ottimizzato per CardSwap con dynamic loading
 *
 * Caratteristiche:
 * - Lazy loading del componente pesante
 * - Skeleton loader per UX migliore
 * - SSR disabilitato per evitare problemi di hydration
 * - Mantiene tutte le props del componente originale
 * - Backward compatibility totale
 */
interface DynamicCardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  mobileCardDistance?: number;
  mobileVerticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  skewAmount?: number;
  mobileSkewAmount?: number;
  easing?: 'elastic' | 'linear' | string;
  children: React.ReactNode;
  className?: string;
}

export default function DynamicCardSwap(props: DynamicCardSwapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Durante SSR o prima dell'hydration, mostra solo il skeleton
  if (!isClient) {
    return <CardSwapSkeleton width={props.width} height={props.height} />;
  }

  return (
    <Suspense fallback={<CardSwapSkeleton width={props.width} height={props.height} />}>
      <CardSwap {...(props as any)} />
    </Suspense>
  );
}

/**
 * Wrapper ottimizzato per Card component
 */
interface DynamicCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DynamicCard(props: DynamicCardProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full animate-pulse bg-gray-800/50 rounded-lg" />
      }
    >
      <Card {...props} />
    </Suspense>
  );
}

// Export dei componenti per compatibilità
export { DynamicCard as Card };
