'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-black/20 z-[999] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: scrollProgress > 1 ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-red-400 to-red-600 origin-left"
        initial={{ scaleX: 0 }}
        style={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
