'use client';

import React, { useRef, memo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import OptimizedImage from '@/components/ui/optimized-image';
import SectionDivider from './SectionDivider';
import { HoverRollingText } from '@/components/ui/hover-rolling-text';

interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  description?: string;
  image: string;
  link?: string;
}

const projectsData: Project[] = [
  {
    id: '01',
    number: '01',
    title: "LORENZOSAINI'S ART",
    category: 'PHOTOGRAPHY • VIDEO • GRAPHIC DESIGN',
    description:
      'Portfolio website showcasing creative photography, videography and graphic design work. A modern digital showcase for artistic expression and professional services.',
    image: '/projects/work-in-progress.svg',
    link: '#',
  },
  {
    id: '02',
    number: '02',
    title: 'PIZZERIA LARIANA',
    category: 'RESTAURANT • LOCAL BUSINESS • UI DESIGN',
    description:
      'Traditional Italian pizzeria website featuring authentic recipes, local charm and online ordering system. Bringing the taste of Italy to the digital world.',
    image: '/projects/work-in-progress.svg',
    link: '#',
  },
  {
    id: '03',
    number: '03',
    title: 'IMPRESA CUGINI PIOSELLI',
    category: 'CONSTRUCTION • CORPORATE • BRANDING',
    description:
      'Professional construction company website showcasing expertise in building and renovation projects. Reliable craftsmanship meets modern digital presence.',
    image: '/projects/work-in-progress.svg',
    link: '#',
  },
  {
    id: '04',
    number: '04',
    title: "GIUSEPPECHILA'S SEX",
    category: 'E-COMMERCE • ADULT ENTERTAINMENT • UI DESIGN',
    description:
      'Modern e-commerce platform for adult products with sophisticated design, secure shopping experience and discreet customer service.',
    image: '/projects/giuseppe-chila.jpg',
    link: '#',
  },
];

const Projects = memo(() => {
  return (
    <>
      {/* Section Divider */}
      <SectionDivider
        text="PROJECTS"
        direction={false}
        velocity={80}
        height="h-32"
        textClassName="text-5xl md:text-7xl lg:text-9xl font-bold text-white/10 tracking-tighter uppercase"
      />

      <section
        id="projects"
        className="relative w-full bg-black text-white overflow-x-hidden"
      >
        {projectsData.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            isReversed={index % 2 === 1}
          />
        ))}

        {/* Projects Grid - 9 Images Full Screen with Parallax */}
        <ProjectsGrid />
      </section>
    </>
  );
});

interface ProjectCardProps {
  project: Project;
  index: number;
  isReversed?: boolean;
}

function ProjectCard({ project, isReversed = false }: ProjectCardProps) {
  const ref = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Ritardo per evitare flash delle animazioni
    const timer = setTimeout(() => {
      checkScreenSize();
      setIsLoaded(true);
    }, 100);

    const debouncedResize = () => {
      clearTimeout(timer);
      setTimeout(checkScreenSize, 150);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  // Animazioni ottimizzate per mobile senza overflow
  const rotateRaw = useTransform(
    scrollYProgress,
    [0, 1],
    isLoaded && isLargeScreen
      ? isReversed
        ? [-4, 0]
        : [4, 0]
      : [0, 0] // Nessuna rotazione se non caricato o su mobile
  ); // Rotazione ridotta per evitare problemi

  const xRaw = useTransform(
    scrollYProgress,
    [0, 1],
    isLoaded && isLargeScreen
      ? isReversed
        ? [-15, 8]
        : [15, -8]
      : [0, 0] // Nessun movimento X su mobile per evitare overflow
  ); // Movimento X controllato

  const yRaw = useTransform(
    scrollYProgress,
    [0, 1],
    isLoaded ? (isLargeScreen ? (isReversed ? [-15, 8] : [-15, 8]) : [-5, 2]) : [0, 0]
  ); // Movimento Y ridotto

  const rotate = useSpring(rotateRaw, { damping: 40, stiffness: 80 }); // Spring più stabili
  const x = useSpring(xRaw, { damping: 40, stiffness: 80 });
  const y = useSpring(yRaw, { damping: 40, stiffness: 80 });

  // Text animations - controllate per mobile
  const textXRaw = useTransform(
    scrollYProgress,
    [0, 1],
    isLoaded && isLargeScreen
      ? isReversed
        ? [20, 0]
        : [-20, 0]
      : [0, 0] // Nessun movimento testo su mobile
  ); // Movimento testo controllato

  const textOpacityRaw = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  const textX = useSpring(textXRaw, { damping: 20, stiffness: 100 });
  const textOpacity = useSpring(textOpacityRaw, {
    damping: 20,
    stiffness: 100,
  });

  return (
    <div
      ref={ref}
      className="relative min-h-[70vh] lg:min-h-[90vh] flex items-center px-4 py-4 md:py-6 md:px-8 lg:py-8 lg:px-6 xl:px-8 2xl:px-12 overflow-hidden"
    >
      <div className="w-full max-w-full mx-auto">
        <div
          className={`grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 items-center max-w-full`}
        >
          {/* Text Content */}
          <motion.div
            className={`space-y-3 md:space-y-4 lg:space-y-6 lg:col-span-2 text-center lg:text-left ${
              isReversed
                ? 'lg:col-start-4 lg:order-2 lg:text-right'
                : 'lg:col-start-1 lg:order-1'
            }`}
            style={{
              x: textX,
              opacity: textOpacity,
            }}
          >
            {/* Project Number */}
            <div className="text-red-500 text-base md:text-lg font-light tracking-wider">
              / {project.number}
            </div>

            {/* Project Title */}
            <h2
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-none"
              style={{
                fontFamily: 'Anton, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              {project.title}
            </h2>

            {/* Project Category */}
            <p className="text-white/60 text-xs md:text-sm lg:text-base font-light tracking-wider uppercase">
              {project.category}
            </p>

            {/* Project Description */}
            {project.description && (
              <p
                className={`text-white/80 text-sm md:text-base lg:text-lg font-light leading-relaxed max-w-md mx-auto lg:mx-0 ${
                  isReversed ? 'lg:ml-auto' : ''
                }`}
              >
                {project.description}
              </p>
            )}

            {/* View Project Button */}
            <div>
              <button
                className="relative isolate cursor-pointer rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium px-6 md:px-8 py-3 md:py-4 transition-all duration-300 ease-out hover:scale-105 hover:bg-white/20 hover:border-white/30 inline-flex items-center justify-center text-sm md:text-base shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'Anton, sans-serif' }}
              >
                <span className="hidden sm:inline">
                  <HoverRollingText text="VIEW PROJECT" />
                </span>
                <span className="sm:hidden">VIEW PROJECT</span>
              </button>
            </div>
          </motion.div>

          {/* Project Image */}
          <motion.div
            className={`relative overflow-hidden rounded-2xl lg:col-span-3 mx-auto lg:mx-0 w-full max-w-full ${
              isReversed
                ? 'lg:col-start-1 lg:order-1 lg:mr-2 xl:mr-3 2xl:mr-4'
                : 'lg:col-start-3 lg:order-2 lg:ml-2 xl:ml-3 2xl:ml-4'
            }`}
            style={{
              transformOrigin: 'center center',
              rotate,
              x,
              y,
              willChange: 'transform',
            }}
          >
            <div className="w-full h-[300px] md:h-[400px] lg:h-[600px] bg-gradient-to-br from-red-900/20 to-red-500/10 rounded-2xl overflow-hidden shadow-2xl">
              <OptimizedImage
                src={project.image}
                alt={project.title}
                width={800}
                height={600}
                priority={false} // Non above-the-fold
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                quality={85} // Buona qualità per project images
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ProjectsGrid() {
  const ref = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Ritardo per evitare flash delle animazioni
    const timer = setTimeout(() => {
      checkScreenSize();
      setIsLoaded(true);
    }, 100);

    const debouncedResize = () => {
      clearTimeout(timer);
      setTimeout(checkScreenSize, 150);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: isLargeScreen
      ? ['start end', 'end start']
      : ['start end', 'center center'],
  });

  // Progetti placeholder per la griglia
  const gridImages = [
    '/projects/work-in-progress.svg',
    '/projects/work-in-progress.svg',
    '/projects/work-in-progress.svg',
    '/projects/giuseppe-chila.jpg',
    '/projects/logo-op-center.png', // Logo OP al centro
    '/projects/giuseppe-chila.jpg',
    '/projects/work-in-progress.svg',
    '/projects/work-in-progress.svg',
    '/projects/work-in-progress.svg',
  ];

  // Hooks per mobile - sempre chiamati (stessi valori del desktop per consistenza)
  // const centerRowY = useTransform(
  //   scrollYProgress,
  //   [0, 0.3, 0.6, 1],
  //   [-100, -50, 0, 50]
  // );
  // const centerRowYSpring = useSpring(centerRowY, {
  //   damping: 80,
  //   stiffness: 400,
  // });
  const mobileScale = useTransform(
    scrollYProgress,
    isLargeScreen
      ? [0, 0.15, 0.25, 0.35, 0.45, 0.5, 1] // Desktop timing
      : [0, 0.3, 0.6, 1], // Mobile timing semplificato
    isLargeScreen 
      ? [2.8, 2.2, 1.6, 1.2, 1.05, 1, 1]
      : [2.2, 1.5, 1.1, 1] // Scale ridotte per mobile
  );
  const mobileScaleSpring = useSpring(mobileScale, {
    damping: 80,
    stiffness: 200,
  });

  // Animazioni aggiuntive per mobile - sempre chiamate (non utilizzate se isLargeScreen)
  // const topRowY1 = useTransform(centerRowYSpring, [-100, 50], [-10, 5]);
  // const topRowY2 = useTransform(centerRowYSpring, [-100, 50], [10, -5]);
  // const topRowRotate1 = useTransform(scrollYProgress, [0, 1], [0.5, -0.2]);
  // const topRowRotate2 = useTransform(scrollYProgress, [0, 1], [-0.5, 0.2]);

  // const centerRotate1 = useTransform(scrollYProgress, [0, 1], [1, -0.5]);
  // const centerRotate2 = useTransform(scrollYProgress, [0, 1], [-1, 0.5]);
  // const centerScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1]);

  // const bottomRowY1 = useTransform(centerRowYSpring, [-100, 50], [5, -10]);
  // const bottomRowY2 = useTransform(centerRowYSpring, [-100, 50], [-5, 10]);
  // const bottomRowRotate1 = useTransform(scrollYProgress, [0, 1], [0.3, -0.1]);
  // const bottomRowRotate2 = useTransform(scrollYProgress, [0, 1], [-0.3, 0.1]);

  // Hooks per desktop - sempre chiamati
  const centerColumnY = useTransform(
    scrollYProgress,
    isLargeScreen
      ? [0, 0.15, 0.4, 0.5, 1] // Desktop: completa a 0.5
      : [0, 0.3, 0.6, 1], // Mobile: timing semplificato
    isLargeScreen
      ? [-200, -120, -40, 0, 0] // Desktop: movimento ridotto
      : [-150, -80, -20, 0] // Mobile: movimento ancora più ridotto
  );
  const centerColumnYSpring = useSpring(centerColumnY, {
    damping: 90,
    stiffness: 300,
    mass: 0.3,
  });

  const leftColumnWidth = useTransform(
    scrollYProgress,
    isLargeScreen
      ? [0, 0.4, 0.5, 1] // Desktop: completa a 0.5
      : [0, 0.5, 1], // Mobile: completa al centro
    isLargeScreen
      ? ['42%', '35%', '33.33%', '33.33%'] // Desktop: mantiene larghezza finale
      : ['42%', '35%', '33.33%']
  );
  const rightColumnWidth = useTransform(
    scrollYProgress,
    isLargeScreen
      ? [0, 0.4, 0.5, 1] // Desktop: completa a 0.5
      : [0, 0.5, 1], // Mobile: completa al centro
    isLargeScreen
      ? ['42%', '35%', '33.33%', '33.33%'] // Desktop: mantiene larghezza finale
      : ['42%', '35%', '33.33%']
  );
  const centerColumnWidth = useTransform(
    scrollYProgress,
    isLargeScreen
      ? [0, 0.4, 0.5, 1] // Desktop: completa a 0.5
      : [0, 0.5, 1], // Mobile: completa al centro
    isLargeScreen
      ? ['16%', '30%', '33.33%', '33.33%'] // Desktop: mantiene larghezza finale
      : ['16%', '30%', '33.33%']
  );

  const leftWidthSpring = useSpring(leftColumnWidth, {
    damping: 75,
    stiffness: 350,
    mass: 0.25,
  });
  const rightWidthSpring = useSpring(rightColumnWidth, {
    damping: 75,
    stiffness: 350,
    mass: 0.25,
  });
  const centerWidthSpring = useSpring(centerColumnWidth, {
    damping: 75,
    stiffness: 350,
    mass: 0.25,
  });

  const desktopScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.35, 0.5, 1],
    [2.2, 1.8, 1.3, 1, 1]
  );
  const desktopScaleSpring = useSpring(desktopScale, {
    damping: 80,
    stiffness: 250,
    mass: 0.4,
  });

  if (!isLargeScreen) {
    // Layout mobile: stessa animazione del desktop ma ottimizzata per mobile
    return (
      <div
        ref={ref}
        className="w-full h-[60vh] md:h-screen flex items-center justify-center overflow-hidden relative"
      >
        <motion.div
          className="flex gap-1 w-full h-full p-4 justify-center items-center"
          style={{
            scale: mobileScaleSpring,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Prima colonna (sinistra) - mobile */}
          <motion.div
            className="flex flex-col gap-1 relative z-10"
            style={{
              width: leftWidthSpring,
              transformOrigin: 'right center',
            }}
          >
            {[0, 3, 6].map(index => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg aspect-square"
              >
                <OptimizedImage
                  src={gridImages[index]}
                  alt={`Project ${index + 1}`}
                  fill
                  priority={false} // Grid images non priority
                  sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                  quality={80} // Quality standard per grid
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>

          {/* Seconda colonna (centro) - con movimento verticale mobile */}
          <motion.div
            className="flex flex-col gap-1 relative z-20"
            style={{
              y: centerColumnYSpring,
              width: centerWidthSpring,
              transformOrigin: 'center center',
            }}
          >
            {[1, 4, 7].map(index => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg aspect-square"
              >
                <OptimizedImage
                  src={gridImages[index]}
                  alt={`Project ${index + 1}`}
                  fill
                  priority={false} // Grid images non priority
                  sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                  quality={80} // Quality standard per grid
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>

          {/* Terza colonna (destra) - mobile */}
          <motion.div
            className="flex flex-col gap-1 relative z-10"
            style={{
              width: rightWidthSpring,
              transformOrigin: 'left center',
            }}
          >
            {[2, 5, 8].map(index => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg aspect-square"
              >
                <OptimizedImage
                  src={gridImages[index]}
                  alt={`Project ${index + 1}`}
                  fill
                  priority={false} // Grid images non priority
                  sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                  quality={80} // Quality standard per grid
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Gradient overlay per sfumare in basso */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-20"
          style={{
            background:
              'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 85%, transparent 100%)',
          }}
        ></div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="w-full h-screen flex items-center justify-center overflow-hidden relative"
    >
      <motion.div
        className="flex gap-2 w-full h-full lg:p-4"
        style={{
          scale: desktopScaleSpring,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Prima colonna (sinistra) */}
        <motion.div
          className="flex flex-col gap-2 relative z-10"
          style={{
            width: leftWidthSpring,
            transformOrigin: 'right center',
          }}
        >
          {[0, 3, 6].map(index => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg aspect-square"
            >
              <OptimizedImage
                src={gridImages[index]}
                alt={`Project ${index + 1}`}
                fill
                priority={false}
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                quality={80}
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>

        {/* Seconda colonna (centro) - con movimento verticale */}
        <motion.div
          className="flex flex-col gap-2 relative z-20"
          style={{
            y: centerColumnYSpring,
            width: centerWidthSpring,
            transformOrigin: 'center center',
          }}
        >
          {[1, 4, 7].map(index => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg aspect-square"
            >
              <OptimizedImage
                src={gridImages[index]}
                alt={`Project ${index + 1}`}
                fill
                priority={false}
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                quality={80}
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>

        {/* Terza colonna (destra) */}
        <motion.div
          className="flex flex-col gap-2 relative z-10"
          style={{
            width: rightWidthSpring,
            transformOrigin: 'left center',
          }}
        >
          {[2, 5, 8].map(index => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg aspect-square"
            >
              <OptimizedImage
                src={gridImages[index]}
                alt={`Project ${index + 1}`}
                fill
                priority={false}
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                quality={80}
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Gradient overlay per sfumare in basso */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-20"
        style={{
          background:
            'linear-gradient(to top, #000000 0%, rgba(0,0,0,0.95) 15%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 85%, transparent 100%)',
        }}
      ></div>
    </div>
  );
}

Projects.displayName = 'Projects';

export default Projects;
