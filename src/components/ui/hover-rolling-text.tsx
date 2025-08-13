'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

interface HoverRollingTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  isHovered?: boolean; // Prop per controllo esterno
}

const ENTRY_ANIMATION = {
  initial: { rotateX: 0 },
  animate: { rotateX: 90 },
};

const EXIT_ANIMATION = {
  initial: { rotateX: 90 },
  animate: { rotateX: 0 },
};

const formatCharacter = (char: string) => (char === ' ' ? '\u00A0' : char);

export function HoverRollingText({
  text,
  className = '',
  style = {},
  children,
  isHovered: externalIsHovered,
}: HoverRollingTextProps) {
  const [internalIsHovered, setInternalIsHovered] = useState(false);
  const isHovered =
    externalIsHovered !== undefined ? externalIsHovered : internalIsHovered;
  const characters = text.split('');

  return (
    <span
      className={className}
      style={style}
      onMouseEnter={() => setInternalIsHovered(true)}
      onMouseLeave={() => setInternalIsHovered(false)}
    >
      {characters.map((char, idx) => (
        <span
          key={idx}
          className="relative inline-block perspective-[9999999px] transform-3d w-auto"
          aria-hidden="true"
        >
          <motion.span
            className="absolute inline-block backface-hidden origin-[50%_25%]"
            initial={ENTRY_ANIMATION.initial}
            animate={
              isHovered ? ENTRY_ANIMATION.animate : ENTRY_ANIMATION.initial
            }
            style={{ color: 'white' }}
            transition={{
              duration: 0.3,
              delay: isHovered
                ? idx * 0.05
                : (characters.length - 1 - idx) * 0.05 + 0.2,
              ease: 'easeOut',
            }}
          >
            {formatCharacter(char)}
          </motion.span>
          <motion.span
            className="absolute inline-block backface-hidden origin-[50%_100%]"
            initial={EXIT_ANIMATION.initial}
            animate={
              isHovered ? EXIT_ANIMATION.animate : EXIT_ANIMATION.initial
            }
            style={{ color: 'rgb(239, 68, 68)' }}
            transition={{
              duration: 0.3,
              delay: isHovered
                ? idx * 0.05 + 0.2
                : (characters.length - 1 - idx) * 0.05,
              ease: 'easeOut',
            }}
          >
            {formatCharacter(char)}
          </motion.span>
          <span className="invisible">{formatCharacter(char)}</span>
        </span>
      ))}

      <span className="sr-only">{text}</span>
      {children}
    </span>
  );
}
