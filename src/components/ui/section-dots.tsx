'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCurrentSection, handleMenuClick } from '@/lib/scroll-utils';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'process', label: 'Process' },
  { id: 'feedbacks', label: 'Feedbacks' },
  { id: 'contact', label: 'Contact' },
];

export default function SectionDots() {
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = getCurrentSection();
      if (current) {
        setActiveSection(current);
      }

      // Show dots after scrolling past first section
      setIsVisible(window.pageYOffset > window.innerHeight * 0.3);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDotClick = (sectionId: string) => {
    const sectionNames: Record<string, string> = {
      home: 'HOME',
      about: 'ABOUT ME',
      projects: 'PROJECTS',
      capabilities: 'CAPABILITIES',
      process: 'PROCESS',
      feedbacks: 'FEEDBACKS',
      contact: 'CONTACT',
    };
    handleMenuClick(sectionNames[sectionId] || sectionId.toUpperCase());
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
    >
      <div className="flex flex-col space-y-4">
        {sections.map(section => {
          const isActive = activeSection === section.id;
          return (
            <motion.button
              key={section.id}
              onClick={() => handleDotClick(section.id)}
              className="group relative flex items-center"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-red-500 border-red-500 shadow-lg shadow-red-500/30'
                    : 'bg-transparent border-white/40 hover:border-red-400'
                }`}
                animate={{
                  scale: isActive ? 1.3 : 1,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.8 }}
                whileHover={{ opacity: 1, x: 0, scale: 1 }}
                className="absolute right-6 whitespace-nowrap bg-black/90 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-xl border border-white/10"
                style={{ fontFamily: 'Anton, sans-serif' }}
              >
                {section.label.toUpperCase()}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black/90 rotate-45 border-l border-b border-white/10"></div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
