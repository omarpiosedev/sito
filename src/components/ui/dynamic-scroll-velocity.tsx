'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// Dynamic import del componente ScrollVelocity pesante
const ScrollVelocity = dynamic(
  () =>
    import(
      '@/components/reactbits/TextAnimations/ScrollVelocity/ScrollVelocity'
    ),
  {
    loading: () => <ScrollVelocitySkeleton />,
    ssr: true, // Mantiene SSR per SEO del testo
  }
);

/**
 * Skeleton loader per ScrollVelocity component
 * Mostra testo statico durante il caricamento
 */
function ScrollVelocitySkeleton() {
  return (
    <div className="relative overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-pulse">
        <span className="opacity-70">Loading text animation...</span>
      </div>
    </div>
  );
}

/**
 * Wrapper ottimizzato per ScrollVelocity con dynamic loading
 *
 * Caratteristiche:
 * - Lazy loading del componente con animazioni pesanti
 * - Skeleton loader con testo di fallback
 * - SSR mantenuto per contenuto testuale (SEO)
 * - Mantiene tutte le props del componente originale
 * - Backward compatibility totale
 */
interface DynamicScrollVelocityProps {
  texts?: string[];
  children?: React.ReactNode;
  className?: string;
  velocity?: number;
  baseVelocity?: number;
  velocityRange?: [number, number];
  velocityMapping?: {
    input: [number, number];
    output: [number, number];
  };
  direction?: 'left' | 'right';
  threshold?: number;
  springConfig?: {
    stiffness: number;
    damping: number;
    mass: number;
  };
  style?: React.CSSProperties;
  initialVelocity?: number;
  scrollVelocityFactor?: number;
  maxVelocity?: number;
  minVelocity?: number;
  parallaxClassName?: string;
  scrollerClassName?: string;
  numCopies?: number;
}

export default function DynamicScrollVelocity(
  props: DynamicScrollVelocityProps
) {
  return (
    <Suspense fallback={<ScrollVelocitySkeleton />}>
      <ScrollVelocity {...(props as any)} />
    </Suspense>
  );
}

/**
 * Hook per preload del componente ScrollVelocity
 * Utilizza questo hook per precaricare il componente quando appropriato
 */
export function usePreloadScrollVelocity() {
  React.useEffect(() => {
    // Preload quando il mouse entra nella viewport
    const handleMouseEnter = () => {
      import(
        '@/components/reactbits/TextAnimations/ScrollVelocity/ScrollVelocity'
      );
    };

    // Preload su interaction hints
    document.addEventListener('mouseenter', handleMouseEnter, { once: true });
    document.addEventListener('touchstart', handleMouseEnter, { once: true });

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('touchstart', handleMouseEnter);
    };
  }, []);
}
