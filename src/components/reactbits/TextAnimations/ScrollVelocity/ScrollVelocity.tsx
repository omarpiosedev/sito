'use client';

/*
	Installed from https://reactbits.dev/ts/tailwind/
	Optimized for performance with hardware acceleration and visibility detection
*/

import React, {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion';

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  texts: string[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

// Optimized element width hook with throttled resize and ResizeObserver fallback
function useElementWidth<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): number {
  const [width, setWidth] = useState(0);
  const resizeTimeoutRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initial measurement
    setWidth(element.offsetWidth);

    // Throttled resize handler for performance
    const throttledUpdateWidth = () => {
      if (resizeTimeoutRef.current) {
        cancelAnimationFrame(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = requestAnimationFrame(() => {
        if (ref.current) {
          setWidth(ref.current.offsetWidth);
        }
      });
    };

    // Use ResizeObserver if available, fallback to window resize
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          setWidth(entry.contentRect.width);
        }
      });
      resizeObserver.observe(element);
      return () => {
        resizeObserver.disconnect();
        if (resizeTimeoutRef.current) {
          cancelAnimationFrame(resizeTimeoutRef.current);
        }
      };
    } else {
      window.addEventListener('resize', throttledUpdateWidth, {
        passive: true,
      });
      return () => {
        window.removeEventListener('resize', throttledUpdateWidth);
        if (resizeTimeoutRef.current) {
          cancelAnimationFrame(resizeTimeoutRef.current);
        }
      };
    }
  }, [ref]);

  return width;
}

// Custom hook for intersection observer with performance optimizations
function useIntersectionObserver(
  ref: React.RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, hasBeenVisible, options]);

  return { isVisible, hasBeenVisible };
}

// Check for reduced motion preference
function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) =>
      setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = '',
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
}) => {
  function VelocityText({
    children,
    baseVelocity = velocity,
    scrollContainerRef,
    className = '',
    damping,
    stiffness,
    numCopies,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
  }: VelocityTextProps) {
    const baseX = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const copyRef = useRef<HTMLSpanElement>(null);
    // Animation ID ref for cleanup
  // const animationIdRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);

    // Performance optimizations
    const { isVisible } = useIntersectionObserver(containerRef);
    const reducedMotion = useReducedMotion();
    const copyWidth = useElementWidth(copyRef);

    // Scroll setup with optimizations
    const scrollOptions = scrollContainerRef
      ? { container: scrollContainerRef }
      : {};
    const { scrollY } = useScroll(scrollOptions);
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: damping ?? 50,
      stiffness: stiffness ?? 400,
      restSpeed: 0.001, // Prevent micro-animations
    });
    const velocityFactor = useTransform(
      smoothVelocity,
      velocityMapping?.input || [0, 1000],
      velocityMapping?.output || [0, 5],
      { clamp: false }
    );

    // Optimized wrap function with memoization
    const wrap = useCallback((min: number, max: number, v: number): number => {
      const range = max - min;
      const mod = (((v - min) % range) + range) % range;
      return mod + min;
    }, []);

    const x = useTransform(baseX, v => {
      if (copyWidth === 0) return '0px';
      return `${wrap(-copyWidth, 0, v)}px`;
    });

    const directionFactor = useRef<number>(1);

    // Optimized animation frame with visibility check and reduced motion support
    useAnimationFrame((t, delta) => {
      // Skip animation if not visible, reduced motion is preferred, or delta is too large (tab switching)
      if (!isVisible || reducedMotion || delta > 100) {
        lastTimeRef.current = t;
        return;
      }

      // Throttle to 60fps max
      if (t - lastTimeRef.current < 16.67) {
        return;
      }
      lastTimeRef.current = t;

      const currentVelocity = velocityFactor.get();
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      // Update direction based on velocity with deadzone to prevent jitter
      if (Math.abs(currentVelocity) > 0.1) {
        directionFactor.current = currentVelocity < 0 ? -1 : 1;
      }

      moveBy += directionFactor.current * moveBy * currentVelocity;
      baseX.set(baseX.get() + moveBy);
    });

    const spans = [];
    for (let i = 0; i < numCopies!; i++) {
      spans.push(
        <span
          className={`flex-shrink-0 ${className}`}
          key={i}
          ref={i === 0 ? copyRef : null}
        >
          {children}
        </span>
      );
    }

    return (
      <div
        ref={containerRef}
        className={`${parallaxClassName} relative overflow-hidden`}
        style={{
          ...parallaxStyle,
          willChange: isVisible ? 'transform' : 'auto',
          transform: 'translateZ(0)', // Force hardware acceleration
        }}
      >
        <motion.div
          className={`${scrollerClassName} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem] md:leading-[5rem]`}
          style={{
            x: reducedMotion ? 0 : x,
            willChange: isVisible && !reducedMotion ? 'transform' : 'auto',
            transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
            backfaceVisibility: 'hidden', // Prevent flickering
            ...scrollerStyle,
          }}
        >
          {spans}
        </motion.div>
      </div>
    );
  }

  return (
    <section>
      {texts.map((text: string, index: number) => (
        <VelocityText
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}-
        </VelocityText>
      ))}
    </section>
  );
};

export default ScrollVelocity;
