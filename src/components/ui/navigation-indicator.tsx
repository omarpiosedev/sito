'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationIndicatorProps {
  isVisible: boolean;
  targetSection?: string;
}

export default function NavigationIndicator({
  isVisible,
  targetSection,
}: NavigationIndicatorProps) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (targetSection && isVisible) {
      const sectionNames: Record<string, string> = {
        home: 'HOME',
        about: 'ABOUT ME',
        projects: 'PROJECTS',
        capabilities: 'CAPABILITIES',
        process: 'PROCESS',
        feedbacks: 'FEEDBACKS',
        contact: 'CONTACT',
      };
      setDisplayText(
        sectionNames[targetSection] || targetSection.toUpperCase()
      );
    }
  }, [targetSection, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[999] pointer-events-none"
        >
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl px-8 py-6 text-center shadow-2xl">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full mb-4"
            />

            <div
              className="text-white font-light text-lg tracking-wide mb-2"
              style={{ fontFamily: 'Anton, sans-serif' }}
            >
              NAVIGATING TO
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-red-400 font-bold text-2xl tracking-wider"
              style={{ fontFamily: 'Anton, sans-serif' }}
            >
              {displayText}
            </motion.div>

            {/* Animated dots */}
            <div className="flex justify-center space-x-1 mt-4">
              {[0, 1, 2].map(index => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0.3, scale: 0.8 }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 bg-red-400 rounded-full"
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
