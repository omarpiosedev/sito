'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useOptimizedScroll } from '@/lib/use-scroll';
import {
  fadeVariants,
  progressVariants,
  transitions,
} from '@/lib/animation-variants';

export default function ScrollProgress() {
  const { scrollProgress, prefersReducedMotion } = useOptimizedScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-black/20 z-[999] pointer-events-none"
      variants={fadeVariants}
      initial="hidden"
      animate={scrollProgress > 1 ? 'visible' : 'hidden'}
      transition={prefersReducedMotion ? { duration: 0 } : transitions.medium}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-red-400 to-red-600 origin-left"
        style={{ scaleX: scrollProgress / 100 }}
        variants={progressVariants}
        transition={prefersReducedMotion ? { duration: 0 } : transitions.fast}
      />
    </motion.div>
  );
}
