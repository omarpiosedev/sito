'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// Dynamic imports per i background pesanti
const HackerBackground = dynamic(
  () => import('@/components/eldoraui/hackerbg'),
  {
    loading: () => <BackgroundSkeleton type="hacker" />,
    ssr: false, // Background non necessari per SEO
  }
);

const WavesBackground = dynamic(
  () => import('@/components/reactbits/Backgrounds/waves/waves'),
  {
    loading: () => <BackgroundSkeleton type="waves" />,
    ssr: false,
  }
);

const LightRaysBackground = dynamic(
  () => import('@/components/blocks/Backgrounds/LightRays/LightRays'),
  {
    loading: () => <BackgroundSkeleton type="lightrays" />,
    ssr: false,
  }
);

const ShaderBackground = dynamic(
  () => import('@/components/lightswind/shader-background'),
  {
    loading: () => <BackgroundSkeleton type="shader" />,
    ssr: false,
  }
);

/**
 * Skeleton loader generico per background
 */
interface BackgroundSkeletonProps {
  type: 'hacker' | 'waves' | 'lightrays' | 'shader';
  className?: string;
}

function BackgroundSkeleton({ type, className = '' }: BackgroundSkeletonProps) {
  const skeletonStyles = {
    hacker: 'bg-gradient-to-br from-green-900/20 to-black/40',
    waves: 'bg-gradient-to-t from-blue-900/20 to-transparent',
    lightrays:
      'bg-gradient-radial from-white/10 via-transparent to-transparent',
    shader: 'bg-gradient-to-br from-purple-900/20 to-black/40',
  };

  return (
    <div
      className={`absolute inset-0 ${skeletonStyles[type]} animate-pulse transition-opacity duration-1000 ${className}`}
      style={{
        background:
          type === 'lightrays'
            ? 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)'
            : undefined,
      }}
    >
      {/* Overlay per indicare caricamento */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}

/**
 * Wrapper ottimizzato per HackerBackground
 */
interface DynamicHackerBackgroundProps {
  color?: string;
  fontSize?: number;
  className?: string;
  speed?: number;
  delay?: number;
  reset?: boolean;
  priority?: number;
}

export function DynamicHackerBackground(props: DynamicHackerBackgroundProps) {
  return (
    <Suspense
      fallback={
        <BackgroundSkeleton type="hacker" className={props.className} />
      }
    >
      <HackerBackground {...props} />
    </Suspense>
  );
}

/**
 * Wrapper ottimizzato per WavesBackground
 */
interface DynamicWavesBackgroundProps {
  className?: string;
  [key: string]: any; // Per props aggiuntive del componente waves
}

export function DynamicWavesBackground(props: DynamicWavesBackgroundProps) {
  return (
    <Suspense
      fallback={<BackgroundSkeleton type="waves" className={props.className} />}
    >
      <WavesBackground {...props} />
    </Suspense>
  );
}

/**
 * Wrapper ottimizzato per LightRaysBackground
 */
interface DynamicLightRaysBackgroundProps {
  className?: string;
  [key: string]: any; // Per props aggiuntive del componente
}

export function DynamicLightRaysBackground(
  props: DynamicLightRaysBackgroundProps
) {
  return (
    <Suspense
      fallback={
        <BackgroundSkeleton type="lightrays" className={props.className} />
      }
    >
      <LightRaysBackground {...props} />
    </Suspense>
  );
}

/**
 * Wrapper ottimizzato per ShaderBackground
 */
interface DynamicShaderBackgroundProps {
  className?: string;
  [key: string]: any; // Per props aggiuntive del componente
}

export function DynamicShaderBackground(props: DynamicShaderBackgroundProps) {
  return (
    <Suspense
      fallback={
        <BackgroundSkeleton type="shader" className={props.className} />
      }
    >
      <ShaderBackground {...props} />
    </Suspense>
  );
}

/**
 * Hook per preload intelligente dei background
 * Precarica background in base all'interazione utente
 */
export function usePreloadBackgrounds() {
  React.useEffect(() => {
    const preloadOnInteraction = () => {
      // Preload background pesanti su prima interazione
      Promise.all([
        import('@/components/eldoraui/hackerbg'),
        import('@/components/reactbits/Backgrounds/waves/waves'),
        import('@/components/blocks/Backgrounds/LightRays/LightRays'),
        import('@/components/lightswind/shader-background'),
      ]);
    };

    // Preload su interazioni o dopo 2 secondi
    const timeoutId = setTimeout(preloadOnInteraction, 2000);
    document.addEventListener('mouseenter', preloadOnInteraction, {
      once: true,
    });
    document.addEventListener('touchstart', preloadOnInteraction, {
      once: true,
    });
    document.addEventListener('scroll', preloadOnInteraction, { once: true });

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mouseenter', preloadOnInteraction);
      document.removeEventListener('touchstart', preloadOnInteraction);
      document.removeEventListener('scroll', preloadOnInteraction);
    };
  }, []);
}

// Default export per compatibilità
export default DynamicHackerBackground;
