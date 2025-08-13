'use client';
import clsx from 'clsx';
import { motion } from 'framer-motion';

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
  const MULTIDIRECTION_SLIDE_VARIANTS = {
    hidden: { opacity: 0, x: '-100vw' },
    visible: { opacity: 1, x: 0 },
    right: { opacity: 0, x: '100vw' },
  };

  return (
    <div className={clsx('overflow-hidden', className)}>
      <motion.h1
        initial="hidden"
        animate={animate ? 'visible' : 'hidden'}
        variants={MULTIDIRECTION_SLIDE_VARIANTS}
        transition={{ duration: 1 }}
        className={clsx(
          'text-center font-display font-bold drop-shadow-sm',
          className
        )}
        style={style}
      >
        {textLeft}
      </motion.h1>

      <motion.h1
        initial="right"
        animate={animate ? 'visible' : 'right'}
        variants={MULTIDIRECTION_SLIDE_VARIANTS}
        transition={{ duration: 1 }}
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
