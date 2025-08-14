// Performance: Shared animation variants to reduce duplication and improve consistency
import { Variants } from 'framer-motion';

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Scale animations for buttons and cards
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  hover: { scale: 1.1 },
  tap: { scale: 0.9 },
};

// Slide animations
export const slideVariants: Variants = {
  hiddenLeft: { opacity: 0, x: '-100vw' },
  hiddenRight: { opacity: 0, x: '100vw' },
  hiddenUp: { opacity: 0, y: -50 },
  hiddenDown: { opacity: 0, y: 50 },
  visible: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Progress bar animations
export const progressVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1 },
};

// Common transition configurations
export const transitions = {
  // Performance: Optimized transition durations
  fast: { duration: 0.15, ease: 'easeOut' as const },
  medium: { duration: 0.3, ease: 'easeInOut' as const },
  slow: { duration: 0.6, ease: 'easeInOut' as const },
  spring: { type: 'spring' as const, stiffness: 300, damping: 20 },
  springSlow: { type: 'spring' as const, stiffness: 200, damping: 25 },
};

// Performance: Prefers-reduced-motion aware transitions
export const getTransition = (
  transitionType: keyof typeof transitions,
  prefersReducedMotion: boolean = false
) => {
  if (prefersReducedMotion) {
    return { duration: 0.01, ease: 'linear' };
  }
  return transitions[transitionType];
};

// Performance: Common animation configurations with accessibility
export const createAnimationProps = (
  variants: Variants,
  transitionType: keyof typeof transitions = 'medium',
  prefersReducedMotion: boolean = false
) => ({
  variants,
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  transition: getTransition(transitionType, prefersReducedMotion),
  ...(prefersReducedMotion && {
    initial: 'visible',
    animate: 'visible',
    transition: { duration: 0 },
  }),
});
