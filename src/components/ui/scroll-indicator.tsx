'use client';

import { motion } from 'framer-motion';

interface ScrollIndicatorProps {
  className?: string;
}

export default function ScrollIndicator({
  className = '',
}: ScrollIndicatorProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Testo "Scroll" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-white/70 text-sm font-light mb-6 tracking-widest uppercase"
        style={{ fontFamily: 'Anton, sans-serif' }}
      >
        Scroll
      </motion.div>

      {/* Mouse animato - Desktop */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative hidden md:block"
      >
        {/* Corpo del mouse */}
        <div className="w-6 h-10 border-2 border-white/40 rounded-full relative">
          {/* Rotellina animata */}
          <motion.div
            animate={{ y: [2, 6, 2] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white/60 rounded-full"
          />
        </div>
      </motion.div>

      {/* Touch/Swipe animato - Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative block md:hidden"
      >
        {/* Touch swipe indicator - semplice e pulito */}
        <div className="flex flex-col items-center space-y-1">
          {/* Tre puntini che simulano il movimento di swipe */}
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [1, 0.5, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-1 h-1 bg-white/70 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [1, 0.5, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            className="w-1 h-1 bg-white/70 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 6, 0], opacity: [1, 0.5, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.4,
            }}
            className="w-1 h-1 bg-white/70 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
