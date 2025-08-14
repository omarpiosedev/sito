'use client';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { slideVariants, transitions } from '@/lib/animation-variants';
import { usePrefersReducedMotion } from '@/lib/use-scroll';

interface MultiDirectionSlideProps {
  textLeft?: string;
  textRight?: string;
  className?: string;
  style?: React.CSSProperties;
  animate?: boolean;
}

export const MultiDirectionSlide: React.FC<MultiDirectionSlideProps> = ({
  textLeft = '',
  textRight = '',
  className = '',
  style = {},
  animate = false,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Performance: Use optimized transition duration
  const transition = prefersReducedMotion ? { duration: 0 } : transitions.slow;

  return (
    <div className={clsx('overflow-hidden', className)}>
      <motion.h1
        initial="hiddenLeft"
        animate={animate ? 'visible' : 'hiddenLeft'}
        variants={slideVariants}
        transition={transition}
        className={clsx(
          'text-center font-display font-bold drop-shadow-sm',
          className
        )}
        style={style}
      >
        {textLeft}
      </motion.h1>

      <motion.h1
        initial="hiddenRight"
        animate={animate ? 'visible' : 'hiddenRight'}
        variants={slideVariants}
        transition={transition}
        className={clsx(
          'text-center font-display font-bold drop-shadow-sm',
          className
        )}
        style={style}
      >
        {textRight}
      </motion.h1>
    </div>
  );
};
