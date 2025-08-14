'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { handleMenuClick } from '@/lib/scroll-utils';
import { useOptimizedScroll } from '@/lib/use-scroll';
import { scaleVariants, transitions } from '@/lib/animation-variants';

export default function ScrollToTop() {
  const { isScrollVisible, prefersReducedMotion } = useOptimizedScroll({
    visibilityThreshold: 300,
  });

  const scrollToTop = () => {
    handleMenuClick('HOME');
  };

  // Performance: Create optimized animation props
  const animationProps = {
    variants: scaleVariants,
    initial: 'hidden',
    animate: 'visible',
    exit: 'exit',
    whileHover: prefersReducedMotion ? {} : 'hover',
    whileTap: prefersReducedMotion ? {} : 'tap',
    transition: prefersReducedMotion ? { duration: 0 } : transitions.medium,
  };

  return (
    <AnimatePresence>
      {isScrollVisible && (
        <motion.button
          {...animationProps}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-red-500 text-white rounded-full shadow-2xl hover:bg-red-600 transition-colors duration-300"
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            boxShadow:
              '0 10px 25px rgba(239, 68, 68, 0.3), 0 4px 10px rgba(0, 0, 0, 0.3)',
          }}
        >
          <ChevronUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
