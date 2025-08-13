'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ProcessCard {
  id: string;
  number: string;
  title: string;
  description: string;
  gradient?: string;
  accentColor?: string;
}

const processCards: ProcessCard[] = [
  {
    id: '01',
    number: '01',
    title: 'DISCOVER',
    description:
      'EVERY PROJECT BEGINS WITH UNDERSTANDING YOUR UNIQUE VISION, BUSINESS GOALS, TARGET AUDIENCE, AND SPECIFIC REQUIREMENTS.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: '02',
    number: '02',
    title: 'DESIGN',
    description:
      'ONCE THE DIRECTION IS CLEAR, I CRAFT CLEAN, MODERN, AND USER-CENTERED DESIGNS THAT FOCUS ON BOTH AESTHETICS AND USABILITY-SERVING GOALS.',
    accentColor: 'text-orange-500',
  },
  {
    id: '03',
    number: '03',
    title: 'DEVELOP',
    description:
      'FROM STATIC WEBSITES TO FULLY DYNAMIC APPLICATIONS, I WRITE SCALABLE, MAINTAINABLE CODE THAT PERFORMS SMOOTHLY ACROSS ALL DEVICES.',
    accentColor: 'text-orange-500',
  },
  {
    id: '04',
    number: '04',
    title: 'DELIVER',
    description:
      'I ENSURE THE FINAL PRODUCT IS THOROUGHLY TESTED AND OPTIMIZED BEFORE LAUNCH. AFTER DELIVERY I PROVIDE ONGOING SUPPORT AND UPDATES AS NEEDED.',
    accentColor: 'text-orange-500',
  },
];

export default function Process() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  // Intersection Observer per animazioni
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsExiting(false);
        } else {
          setIsExiting(true);
          setTimeout(() => {
            setIsVisible(false);
          }, 300);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      id="process"
      ref={sectionRef}
      role="main"
      className="w-full bg-black text-white relative overflow-hidden pt-16"
    >
      {/* Header Section - UNIQUE ANGLE */}
      <div
        ref={titleRef}
        className="px-6 md:px-12 lg:px-24 mb-16 relative z-10"
      >
        <h2
          className={`text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wide text-white mb-6 transform transition-all duration-1000 ease-out ${
            isVisible && !isExiting
              ? 'opacity-100 translate-y-0'
              : isExiting
                ? 'opacity-0 translate-y-8'
                : 'opacity-0 translate-y-8'
          }`}
          style={{
            fontFamily: 'Anton, sans-serif',
            transitionDelay: isVisible && !isExiting ? '0.1s' : '0s',
          }}
        >
          UNIQUE
        </h2>
        <h3
          className={`text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wide text-white transform transition-all duration-1000 ease-out ${
            isVisible && !isExiting
              ? 'opacity-100 translate-y-0'
              : isExiting
                ? 'opacity-0 translate-y-8'
                : 'opacity-0 translate-y-8'
          }`}
          style={{
            fontFamily: 'Anton, sans-serif',
            transitionDelay: isVisible && !isExiting ? '0.3s' : '0s',
          }}
        >
          ANGLE
        </h3>
      </div>

      {/* Cards Grid - Desktop: Cascading Layout, Mobile: Sequential */}
      <div
        className="relative px-6 md:px-12 lg:px-24 pb-24 z-10 will-change-contents"
        data-testid="cards-container"
      >
        {/* Mobile: Sequential Layout (1 column) */}
        <div className="block md:hidden space-y-8" data-testid="mobile-layout">
          {processCards.map((card, index) => (
            <ProcessCard key={card.id} card={card} index={index} />
          ))}
        </div>

        {/* Desktop: Cascading Layout (2 columns) */}
        <div
          className="hidden md:grid grid-cols-2 gap-8"
          data-testid="desktop-layout"
        >
          <div className="space-y-8" data-testid="left-column">
            <ProcessCard card={processCards[0]} index={0} />
            <ProcessCard card={processCards[2]} index={2} />
          </div>

          <div className="space-y-8 mt-32" data-testid="right-column">
            <ProcessCard card={processCards[1]} index={1} />
            <ProcessCard card={processCards[3]} index={3} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ProcessCardProps {
  card: ProcessCard;
  index: number;
}

function ProcessCard({ card, index }: ProcessCardProps) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Animazione molto rapida
  const delayStart = index * 0.03; // 0, 0.03, 0.06, 0.09 - Cascata più rapida
  const delayedProgress = useTransform(
    scrollYProgress,
    [delayStart, 0.25], // Animazione più veloce ma fluida
    [0, 1],
    { clamp: true }
  );

  // Animazioni con traslazione e inclinazione aumentate usando il progresso ritardato
  // Colonna sinistra (index 0,2): parte da sinistra (-120) verso centro (0)
  // Colonna destra (index 1,3): parte da destra (120) verso centro (0)
  const rotateRaw = useTransform(
    delayedProgress,
    [0, 1],
    index % 2 === 0 ? [-12, 0] : [12, 0]
  );
  const xRaw = useTransform(
    delayedProgress,
    [0, 1],
    index % 2 === 0 ? [-100, 0] : [100, 0]
  );
  const yRaw = useTransform(delayedProgress, [0, 1], [70, 0]);

  const rotate = useSpring(rotateRaw, {
    damping: 25,
    stiffness: 120,
    mass: 0.5,
  });
  const x = useSpring(xRaw, { damping: 25, stiffness: 120, mass: 0.5 });
  const y = useSpring(yRaw, { damping: 25, stiffness: 120, mass: 0.5 });

  return (
    <motion.div
      ref={ref}
      data-testid={`process-card-${index}`}
      className={`relative rounded-3xl p-8 h-96 flex flex-col justify-between overflow-hidden will-change-transform ${
        card.gradient
          ? `bg-gradient-to-br ${card.gradient}`
          : 'bg-gray-800 border border-gray-700'
      }`}
      style={{
        transformOrigin: '50% 50%',
        rotate,
        x,
        y,
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        perspective: 1000,
        ...(card.id === '01'
          ? {
              background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
              boxShadow:
                '0 0 50px rgba(220, 38, 38, 0.4), 0 0 100px rgba(220, 38, 38, 0.2), 0 0 150px rgba(220, 38, 38, 0.1)',
            }
          : {
              background:
                'linear-gradient(135deg, #111111 0%, #1f1f1f 50%, #000000 100%)',
              border: '1px solid #333333',
            }),
      }}
    >
      {/* Status dots - progressivi illuminati in bianco */}
      <div className="absolute top-6 right-6 flex space-x-1">
        <div
          data-testid={`progress-dot-${card.id}-1`}
          className={`w-2 h-2 rounded-full ${
            parseInt(card.id) >= 1
              ? 'bg-white shadow-lg shadow-white/50'
              : 'bg-white/20'
          }`}
        ></div>
        <div
          data-testid={`progress-dot-${card.id}-2`}
          className={`w-2 h-2 rounded-full ${
            parseInt(card.id) >= 2
              ? 'bg-white shadow-lg shadow-white/50'
              : 'bg-white/20'
          }`}
        ></div>
        <div
          data-testid={`progress-dot-${card.id}-3`}
          className={`w-2 h-2 rounded-full ${
            parseInt(card.id) >= 3
              ? 'bg-white shadow-lg shadow-white/50'
              : 'bg-white/20'
          }`}
        ></div>
        <div
          data-testid={`progress-dot-${card.id}-4`}
          className={`w-2 h-2 rounded-full ${
            parseInt(card.id) >= 4
              ? 'bg-white shadow-lg shadow-white/50'
              : 'bg-white/20'
          }`}
        ></div>
      </div>

      <div>
        <div
          className={`text-sm font-medium mb-4 ${
            card.id === '01' ? 'text-white/70' : 'text-red-500'
          }`}
        >
          / {card.number}
        </div>
        <h3 className="text-white text-4xl md:text-5xl font-bold mb-6">
          {card.title}
        </h3>
      </div>

      <p
        className={`text-sm leading-relaxed max-w-xs ${
          card.gradient ? 'text-white/90' : 'text-white/80'
        }`}
      >
        {card.description}
      </p>
    </motion.div>
  );
}
