'use client';

import Image, { ImageProps } from 'next/image';
import React, { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  /**
   * Source URL dell'immagine
   */
  src: string;
  /**
   * Alt text per accessibilità
   */
  alt: string;
  /**
   * Se true, l'immagine è above-the-fold e ha priority
   */
  priority?: boolean;
  /**
   * Sizes attribute per responsive images
   */
  sizes?: string;
  /**
   * Quality dell'immagine (1-100)
   */
  quality?: number;
  /**
   * Placeholder durante il caricamento
   */
  placeholder?: 'blur' | 'empty';
  /**
   * BlurDataURL per placeholder
   */
  blurDataURL?: string;
  /**
   * Callback quando l'immagine è caricata
   */
  onLoadComplete?: () => void;
  /**
   * Fallback image in caso di errore
   */
  fallbackSrc?: string;
}

/**
 * Componente immagine ottimizzato per performance
 *
 * Caratteristiche:
 * - Sizes attribute automatico per responsive loading
 * - Quality ottimizzata per context
 * - Priority automatico per immagini above-the-fold
 * - Lazy loading per immagini non priority
 * - Fallback image per errori
 * - Placeholder blur ottimizzato
 * - Backward compatibility totale
 */
export default function OptimizedImage({
  src,
  alt,
  priority = false,
  sizes,
  quality,
  placeholder = 'blur',
  blurDataURL,
  onLoadComplete,
  fallbackSrc,
  className,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Genera sizes automatico se non specificato
  const getOptimizedSizes = (): string => {
    if (sizes) return sizes;

    // Sizes automatico basato su uso comune
    if (props.fill) {
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    }

    // Per immagini con width/height specifiche
    if (props.width && typeof props.width === 'number') {
      if (props.width <= 400) {
        return '(max-width: 768px) 100vw, 400px';
      } else if (props.width <= 800) {
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px';
      }
    }

    return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  };

  // Quality ottimizzata per context
  const getOptimizedQuality = (): number => {
    if (quality !== undefined) return quality;

    // Quality basata su priority e uso
    if (priority) return 90; // Alta qualità per above-the-fold
    if (props.fill) return 85; // Buona qualità per background
    return 80; // Quality standard per altre immagini
  };

  // Genera blurDataURL se non specificato
  const getBlurDataURL = (): string => {
    if (blurDataURL) return blurDataURL;

    // BlurDataURL minimalista per performance
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';
  };

  // Handler per errori di caricamento
  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    }
  };

  // Handler per completamento caricamento
  const handleLoadComplete = () => {
    onLoadComplete?.();
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      priority={priority}
      sizes={getOptimizedSizes()}
      quality={getOptimizedQuality()}
      placeholder={placeholder}
      blurDataURL={placeholder === 'blur' ? getBlurDataURL() : undefined}
      onError={handleError}
      onLoad={handleLoadComplete}
      className={className}
      {...props}
    />
  );
}

/**
 * Hook per preload delle immagini critiche
 */
export function useImagePreload(srcs: string[]) {
  React.useEffect(() => {
    srcs.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }, [srcs]);
}

/**
 * Utility per generare blurDataURL da immagine
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Gradiente semplice come placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.1);
}
