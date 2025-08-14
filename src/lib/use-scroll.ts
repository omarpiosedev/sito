import { useState, useEffect, useMemo } from 'react';

// Performance: Debounce utility for scroll events
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Performance: Optimized scroll progress hook with debouncing
export function useScrollProgress(debounceMs: number = 16) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    // Performance: Use requestAnimationFrame for smooth updates
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Performance: Return debounced progress for less frequent updates
  const debouncedProgress = useDebounce(scrollProgress, debounceMs);
  return debouncedProgress;
}

// Performance: Optimized scroll visibility hook with threshold
export function useScrollVisibility(
  threshold: number = 300,
  debounceMs: number = 100
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const toggleVisibility = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsVisible(window.pageYOffset > threshold);
      }, debounceMs);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Initial check

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      clearTimeout(timeoutId);
    };
  }, [threshold, debounceMs]);

  return isVisible;
}

// Performance: Check for prefers-reduced-motion preference
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Performance: Combined scroll hook for common use cases
export function useOptimizedScroll(
  options: {
    progressDebounce?: number;
    visibilityThreshold?: number;
    visibilityDebounce?: number;
  } = {}
) {
  const {
    progressDebounce = 16,
    visibilityThreshold = 300,
    visibilityDebounce = 100,
  } = options;

  const scrollProgress = useScrollProgress(progressDebounce);
  const isScrollVisible = useScrollVisibility(
    visibilityThreshold,
    visibilityDebounce
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  return useMemo(
    () => ({
      scrollProgress,
      isScrollVisible,
      prefersReducedMotion,
    }),
    [scrollProgress, isScrollVisible, prefersReducedMotion]
  );
}
