'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// Menu and X icons removed as they're not used
import { cn } from '@/lib/utils';
import { handleMenuClick, getCurrentSection } from '@/lib/scroll-utils';
import { HoverRollingText } from '@/components/ui/hover-rolling-text';

interface NavBarProps {
  className?: string;
}

interface MenuButtonProps {
  item: string;
  index: number;
  onMenuClose: () => void;
  isActive?: boolean;
}

// Componente per singola voce del menu con animazioni migliorate
const MenuButton = ({
  item,
  index,
  onMenuClose,
  isActive = false,
}: MenuButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    handleMenuClick(item);
    onMenuClose(); // Chiude il menu desktop dopo il click
  };

  return (
    <motion.button
      className={cn(
        'relative flex items-center justify-center py-2 px-4 font-light text-2xl tracking-widest transition-colors duration-300',
        isActive ? 'text-red-400' : 'text-white'
      )}
      style={{
        background: 'transparent',
        border: 'none',
        fontFamily: 'Anton, sans-serif',
      }}
      role="menuitem"
      tabIndex={0}
      initial={{
        opacity: 0,
        x: index % 2 === 0 ? 600 : -600,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        delay: index * 0.2,
        duration: 0.8,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <span className="hidden sm:inline">
        <HoverRollingText text={item} isHovered={isHovering} />
      </span>
      <motion.span
        className="sm:hidden"
        animate={{
          letterSpacing: isHovering ? '0.3em' : '0.2em',
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {item}
      </motion.span>

      {/* Animated underline */}
      <motion.div
        className={cn(
          'absolute bottom-1 left-1/2 h-px bg-gradient-to-r from-transparent to-transparent',
          isActive ? 'via-red-400/80' : 'via-white/60'
        )}
        initial={{ width: '0%', x: '-50%' }}
        animate={{
          width: isHovering || isActive ? '120%' : '0%',
          boxShadow:
            isHovering || isActive
              ? isActive
                ? '0 0 10px rgba(248,113,113,0.5)'
                : '0 0 10px rgba(255,255,255,0.5)'
              : 'none',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />

      {/* Active section indicator */}
      {isActive && (
        <motion.div
          className="absolute -left-1 top-1/2 w-1 h-8 bg-red-400 rounded-full"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ transform: 'translateY(-50%)' }}
        />
      )}
    </motion.button>
  );
};

export default function NavBar({ className }: NavBarProps) {
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('home');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Force re-animation on mount
  useEffect(() => {
    setAnimationKey(Date.now());
  }, []);

  // Handle scroll detection for visibility, blurred background, and active section
  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      // Update blur background
      setIsScrolled(currentScrollY > 50);
      void isScrolled; // Used for scroll state tracking

      // Update active section
      const currentSection = getCurrentSection();
      if (currentSection) {
        setActiveSection(currentSection);
      }

      // Show/hide navbar based on scroll direction
      if (currentScrollY < 100) {
        // Always show navbar at the top
        setIsVisible(true);
      } else {
        // Show when scrolling up, hide when scrolling down
        if (currentScrollY < lastScrollY.current) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current) {
          setIsVisible(false);
          // Close menus when hiding navbar
          setIsDesktopMenuOpen(false);
          setIsMobileMenuOpen(false);
          void isMobileMenuOpen; // Used for mobile menu state tracking
        }
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobileMenuOpen, isScrolled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesktopMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsDesktopMenuOpen(false);
        setIsMobileMenuOpen(false);
      }

      // Toggle menu with Enter/Space when focused on menu trigger
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        document.activeElement?.closest('[data-menu-trigger]')
      ) {
        event.preventDefault();
        setIsDesktopMenuOpen(!isDesktopMenuOpen);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDesktopMenuOpen]);

  return (
    <>
      <motion.div
        key={animationKey}
        data-testid="navbar"
        className={cn('fixed top-0 left-0 right-0 z-50', className)}
        style={{
          background: 'none',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          willChange: 'transform, opacity, filter',
        }}
        initial={{
          y: -150,
          opacity: 0,
          scale: 0.7,
          filter: 'blur(12px)',
          visibility: 'hidden',
        }}
        animate={{
          y: isVisible ? 0 : -150,
          opacity: isVisible ? 1 : 0,
          scale: 1,
          filter: 'blur(0px)',
          visibility: isVisible ? 'visible' : 'hidden',
        }}
        transition={{
          duration: isVisible ? 1.0 : 0.3,
          ease: isVisible ? [0.25, 0.25, 0.25, 1] : 'easeOut',
          delay: isVisible ? 0.5 : 0,
          y: {
            duration: isVisible ? 1.0 : 0.3,
            ease: isVisible ? [0.25, 0.25, 0.25, 1] : 'easeOut',
          },
          opacity: {
            duration: isVisible ? 1.0 : 0.3,
            ease: isVisible ? [0.25, 0.25, 0.25, 1] : 'easeOut',
          },
          scale: {
            duration: isVisible ? 1.0 : 0.3,
            ease: isVisible ? [0.25, 0.25, 0.25, 1] : 'easeOut',
          },
          filter: {
            duration: isVisible ? 1.4 : 0.3,
            ease: 'easeOut',
            delay: isVisible ? 0.2 : 0,
          },
          visibility: {
            duration: 0,
            delay: isVisible ? 0 : 0.5,
          },
        }}
      >
        <div className="w-full px-4 sm:px-8 py-4 sm:py-6">
          {/* Desktop Layout - ora visibile anche su mobile */}
          <div className="grid grid-cols-3 items-center w-full">
            {/* Left - Name */}
            <div className="justify-self-start">
              <motion.div
                animate={{
                  opacity: isDesktopMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => handleMenuClick('HOME')}
                  className="cursor-pointer text-sm sm:text-lg font-light tracking-wider text-white"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                >
                  <span className="hidden sm:inline">
                    <HoverRollingText text="OMAR PIOSELLI" />
                  </span>
                  <span
                    className="sm:hidden"
                    style={{ fontFamily: 'Anton, sans-serif' }}
                  >
                    OMAR
                  </span>
                </button>
              </motion.div>
            </div>

            {/* Center - Menu with bar and text decryption */}
            <motion.div
              className="flex flex-col items-center relative justify-self-center"
              ref={dropdownRef}
              whileHover="hover"
              initial="initial"
              animate={isDesktopMenuOpen ? 'open' : 'initial'}
            >
              <motion.div className="relative mb-2">
                <motion.div
                  className="bg-white relative overflow-hidden"
                  variants={{
                    initial: {
                      width: '10rem',
                      height: '4px',
                      boxShadow: 'none',
                    },
                    hover: {
                      width: '14rem',
                      height: '8px',
                      boxShadow:
                        '0 0 25px rgba(255,255,255,0.9), 0 0 50px rgba(255,255,255,0.5)',
                    },
                    open: {
                      width: '14rem',
                      height: '8px',
                      boxShadow:
                        '0 0 25px rgba(255,255,255,0.9), 0 0 50px rgba(255,255,255,0.5)',
                    },
                  }}
                  transition={{
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                />
              </motion.div>
              <div
                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                data-menu-trigger
                data-testid="menu-trigger"
                role="button"
                tabIndex={0}
                aria-expanded={isDesktopMenuOpen}
                aria-haspopup="menu"
                aria-label="Toggle navigation menu"
                className="relative"
              >
                {/* MENU text */}
                <motion.div
                  animate={{
                    opacity: isDesktopMenuOpen ? 0 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <span className="hidden sm:inline">
                    <HoverRollingText
                      text="MENU"
                      className="text-sm font-medium tracking-wider cursor-pointer text-white"
                      style={{ fontFamily: 'Anton, sans-serif' }}
                    />
                  </span>
                  <span
                    className="sm:hidden text-sm font-medium tracking-wider cursor-pointer text-white"
                    style={{ fontFamily: 'Anton, sans-serif' }}
                  >
                    MENU
                  </span>
                </motion.div>

                {/* CLOSE text */}
                <motion.div
                  animate={{
                    opacity: isDesktopMenuOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium tracking-wider cursor-pointer text-white"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                >
                  <span className="hidden sm:inline">
                    <HoverRollingText text="CLOSE" />
                  </span>
                  <span className="sm:hidden">CLOSE</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Right - Contact */}
            <div className="justify-self-end">
              <motion.div
                animate={{
                  opacity: isDesktopMenuOpen ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => handleMenuClick('CONTACT')}
                  className="cursor-pointer text-sm sm:text-lg font-light tracking-wider text-white"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                >
                  <span className="hidden sm:inline">
                    <HoverRollingText text="CONTATTAMI" />
                  </span>
                  <span
                    className="sm:hidden"
                    style={{ fontFamily: 'Anton, sans-serif' }}
                  >
                    CONTATTI
                  </span>
                </button>
              </motion.div>
            </div>
          </div>

          {/* Desktop Slide-out Menu - Integrated with navbar */}
          <AnimatePresence>
            {isDesktopMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                }}
                className="w-full overflow-hidden"
                style={{
                  background: 'none',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                }}
                role="menu"
                aria-label="Main navigation menu"
              >
                <div
                  className="w-full px-8 py-6"
                  style={{ background: 'transparent' }}
                >
                  <div
                    className="flex justify-center"
                    style={{ background: 'transparent' }}
                  >
                    <div
                      className="flex flex-col items-center gap-3"
                      style={{ background: 'transparent' }}
                    >
                      {[
                        'HOME',
                        'ABOUT ME',
                        'PROJECTS',
                        'CAPABILITIES',
                        'PROCESS',
                        'FEEDBACKS',
                      ].map((item, index) => {
                        const sectionMap: Record<string, string> = {
                          HOME: 'home',
                          'ABOUT ME': 'about',
                          PROJECTS: 'projects',
                          CAPABILITIES: 'capabilities',
                          PROCESS: 'process',
                          FEEDBACKS: 'feedbacks',
                        };
                        const sectionId =
                          sectionMap[item] || item.toLowerCase();
                        const isActive = activeSection === sectionId;

                        return (
                          <MenuButton
                            key={item}
                            item={item}
                            index={index}
                            onMenuClose={() => setIsDesktopMenuOpen(false)}
                            isActive={isActive}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
