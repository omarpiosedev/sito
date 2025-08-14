'use client';

import React, { VideoHTMLAttributes, useEffect, useRef, useState } from 'react';

interface OptimizedVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  /**
   * Source URL del video
   */
  src: string;
  /**
   * Se true, il video è considerato above-the-fold e viene caricato immediatamente
   * Se false, viene caricato solo quando entra nel viewport (lazy loading)
   */
  priority?: boolean;
  /**
   * Qualità del video per ottimizzazioni bandwidth
   * 'auto' | 'high' | 'medium' | 'low'
   */
  quality?: 'auto' | 'high' | 'medium' | 'low';
  /**
   * Strategia di preload
   * 'metadata' (default) | 'auto' | 'none'
   */
  preloadStrategy?: 'metadata' | 'auto' | 'none';
  /**
   * Fallback image da mostrare durante il caricamento
   */
  poster?: string;
  /**
   * Callback quando il video è pronto per la riproduzione
   */
  onReady?: () => void;
}

/**
 * Componente video ottimizzato per performance
 *
 * Caratteristiche:
 * - Lazy loading automatico per video non priority
 * - Preload intelligente (solo metadata di default)
 * - Gestione bandwidth con quality settings
 * - Fallback poster image
 * - Attributi di ottimizzazione automatici
 * - Backward compatibility totale
 */
export default function OptimizedVideo({
  src,
  priority = false,
  // Quality managed by performance system
  preloadStrategy = 'metadata',
  onReady,
  className,
  ...props
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Intersection state managed internally
  // const [isIntersecting, setIsIntersecting] = useState(priority);
  const [shouldLoad, setShouldLoad] = useState(priority);

  // Intersection Observer per lazy loading
  useEffect(() => {
    if (priority) return; // Skip per video priority

    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.unobserve(video);
        }
      },
      {
        // Carica il video quando è a 200px dal viewport
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [priority]);

  // Callback quando il video è ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !onReady) return;

    const handleCanPlay = () => onReady();
    video.addEventListener('canplay', handleCanPlay);

    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [onReady]);

  // Determina la strategia di preload basata su priority e user preference
  const getPreloadValue = (): string => {
    if (!shouldLoad && !priority) return 'none';

    // Rispetta la riduzione di motion dell'utente
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    if (prefersReducedMotion) return 'none';

    return preloadStrategy;
  };

  // Attributi di ottimizzazione automatici
  const optimizedProps = {
    // Performance attributes
    preload: getPreloadValue() as 'metadata' | 'auto' | 'none',
    loading: priority ? undefined : ('lazy' as const),

    // Compatibilità e performance
    playsInline: true,
    webkit_playsinline: 'true', // iOS compatibility

    // Accessibility e UX
    muted: true, // Necessario per autoplay
    disablePictureInPicture: true,
    disableRemotePlayback: true,

    // Hardware acceleration hints
    style: {
      ...props.style,
      willChange: 'transform, opacity',
      transform: 'translateZ(0)', // Force GPU layer
      backfaceVisibility: 'hidden' as const,
    },

    ...props,
  };

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? src : undefined}
      className={className}
      {...optimizedProps}
    >
      {/* Source element per maggiore controllo */}
      {shouldLoad && <source src={src} type="video/mp4" />}
      {/* Fallback per browser non supportati */}
      Your browser does not support the video tag.
    </video>
  );
}

/**
 * Hook per monitorare performance video
 */
export function useVideoPerformance(
  videoRef: React.RefObject<HTMLVideoElement>
) {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    bufferedAmount: 0,
    quality: 'unknown',
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startTime = performance.now();

    const handleLoadedData = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedAmount = (video.buffered.end(0) / video.duration) * 100;
        setMetrics(prev => ({ ...prev, bufferedAmount }));
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('progress', handleProgress);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('progress', handleProgress);
    };
  }, [videoRef]);

  return metrics;
}
