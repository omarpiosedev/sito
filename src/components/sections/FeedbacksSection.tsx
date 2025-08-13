'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import StickyFeedbackCard from '@/components/ui/sticky-feedback-card';
import LogoCard from '@/components/ui/logo-card';
import { logos } from '@/components/ui/tech-logos';
import LightRays from '@/components/blocks/Backgrounds/LightRays/LightRays';

const feedbacks = [
  {
    id: 1,
    quote:
      'The landing page he built for my business is fast, modern, and works perfectly on any device. He even took care of the SEO and added subtle animations that make it feel premium.',
    author: {
      name: 'ELENA F.',
      role: 'SMALL BUSINESS OWNER',
      company: '',
      avatar: 'https://mockmind-api.uifaces.co/content/human/125.jpg',
      rating: 5,
    },
    position: { top: '0%', left: '20%' },
  },
  {
    id: 2,
    quote:
      'I needed a website in Next.js with great performance and short loading times. He delivered ahead of schedule and really cared about the user experience.',
    author: {
      name: 'LUCA B.',
      role: 'STARTUP FOUNDER',
      company: '',
      avatar: 'https://mockmind-api.uifaces.co/content/human/92.jpg',
      rating: 4.5,
    },
    position: { top: '7%', right: '18%' },
  },
  {
    id: 3,
    quote:
      'He turned my outdated website into something modern and intuitive. The animations and responsive design made a huge difference for my visitors.',
    author: {
      name: 'GIULIA C.',
      role: 'FREELANCE DESIGNER',
      company: '',
      avatar: 'https://mockmind-api.uifaces.co/content/human/108.jpg',
      rating: 5,
    },
    position: { top: '14%', left: '15%' },
  },
  {
    id: 4,
    quote:
      'Working with him was super easy. He came up with creative solutions for tricky problems and integrated all the features I needed without any hassle.',
    author: {
      name: 'ROBERTO G.',
      role: 'ONLINE STORE OWNER',
      company: '',
      avatar: 'https://mockmind-api.uifaces.co/content/human/97.jpg',
      rating: 4.5,
    },
    position: { top: '21%', right: '25%' },
  },
  {
    id: 5,
    quote:
      'From the look and feel to the performance, everything was on point. My new site feels professional and my visitors are staying longer than before.',
    author: {
      name: 'MARTA R.',
      role: 'CONTENT CREATOR',
      company: '',
      avatar: 'https://mockmind-api.uifaces.co/content/human/124.jpg',
      rating: 4,
    },
    position: { top: '28%', left: '25%' },
  },
  {
    id: 6,
    quote:
      'I needed a custom web app with a few tricky API integrations. He handled everything smoothly and explained the process in a way I could understand.',
    author: {
      name: 'DANIEL P.',
      role: 'TECH ENTHUSIAST',
      company: '',
      avatar: 'https://mockmind-api.uifaces.co/content/human/112.jpg',
      rating: 5,
    },
    position: { top: '35%', right: '20%' },
  },
  {
    id: 7,
    quote:
      'Great communication and project management. I always knew what stage the work was at, and he delivered exactly what we agreed on.',
    author: {
      name: 'LAURA M.',
      role: 'PHOTOGRAPHER',
      company: '',
      avatar: 'https://mockmind-api.uifaces.co/content/human/129.jpg',
      rating: 4.5,
    },
    position: { top: '42%', left: '18%' },
  },
  {
    id: 8,
    quote:
      "He found clever solutions to some challenges I didn't even realize were there. The final site fits my needs perfectly.",
    author: {
      name: 'JAMES T.',
      role: 'FITNESS COACH',
      company: '',
      avatar: 'https://mockmind-api.uifaces.co/content/human/107.jpg',
      rating: 4,
    },
    position: { top: '49%', right: '30%' },
  },
  {
    id: 9,
    quote:
      'Everything was delivered polished and exactly how I imagined it. The site is fast, works on all devices, and just feels great to use.',
    author: {
      name: 'MAYA S.',
      role: 'BLOGGER',
      company: '',
      avatar: 'https://mockmind-api.uifaces.co/content/human/122.jpg',
      rating: 5,
    },
    position: { top: '56%', left: '22%' },
  },
];

export default function FeedbacksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [titleSticky, setTitleSticky] = useState(true);
  const [lightRaysActive, setLightRaysActive] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const titleOpacity = useTransform(scrollYProgress, [0.88, 0.92], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0.86, 0.92], [0, -80]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(value => {
      // Alla fine della sezione (95%), disabilita lo sticky
      if (value >= 0.95) {
        setTitleSticky(false);
      } else {
        setTitleSticky(true);
      }
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Quando il titolo è centrato nel viewport, attiva le card E i LightRays
        if (entry.intersectionRatio >= 0.9) {
          setCardsVisible(true);
          // Attiva i LightRays con un leggero ritardo per l'effetto lampadina
          setTimeout(() => {
            setLightRaysActive(true);
          }, 300);
        } else {
          setCardsVisible(false);
          setLightRaysActive(false);
        }
      },
      {
        threshold: [0, 0.5, 0.9, 1],
        rootMargin: '0px',
      }
    );

    const currentTitleRef = titleRef.current;
    if (currentTitleRef) {
      observer.observe(currentTitleRef);
    }

    return () => {
      unsubscribe();
      if (currentTitleRef) {
        observer.unobserve(currentTitleRef);
      }
    };
  }, [scrollYProgress]);

  return (
    <section
      id="feedbacks"
      ref={containerRef}
      role="region"
      className="relative bg-black"
      style={{ height: '900vh' }}
    >
      {/* Fade gradiente all'inizio della sezione */}
      <div
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none"
        data-testid="fade-overlay"
      ></div>

      {/* Fixed title - always visible within this section */}
      <motion.div
        ref={titleRef}
        data-testid="title-container"
        className={`${titleSticky ? 'sticky' : 'absolute'} top-0 left-0 w-full h-screen flex items-center justify-center z-0 pointer-events-none`}
        style={{
          opacity: titleOpacity,
          y: titleY,
          ...(titleSticky ? {} : { top: '90%' }),
        }}
      >
        {/* LightRays background - con animazione tipo lampadina */}
        <div
          data-testid="light-rays-background"
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-out ${
            lightRaysActive ? 'opacity-95 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1.2}
            lightSpread={0.6}
            rayLength={4.5}
            pulsating={true}
            fadeDistance={2.5}
            saturation={1.0}
            followMouse={false}
            mouseInfluence={0.0}
            noiseAmount={0.0}
            distortion={0.0}
            className="blur-sm"
          />
          {/* Fade overlay per sfumare la luce con il background */}
          <div
            data-testid="light-rays-fade-overlay"
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none"
          ></div>
        </div>

        {/* Title content */}
        <div className="relative z-10 text-center">
          <h2
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-wider text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.5)]"
            style={{
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            TRUSTED
          </h2>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-wider text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.5)]"
            style={{
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            FEEDBACKS
          </h2>
        </div>
      </motion.div>

      {/* Sticky positioned cards - appaiono solo quando il titolo è centrato */}
      {cardsVisible && (
        <div className="relative w-full h-full">
          {feedbacks.map(feedback => (
            <StickyFeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}

      {/* Logo cards section - sovrappongono il titolo alla fine */}
      <div
        data-testid="logo-cards-section"
        className="absolute bottom-0 left-0 w-full z-10"
        style={{ height: '150vh' }}
      >
        <div
          data-testid="logo-cards-container"
          className="sticky top-0 w-full h-screen flex items-center justify-center"
        >
          <div
            data-testid="logo-grid"
            className="grid grid-cols-3 gap-4 md:gap-6 w-full h-full px-6 md:px-24 py-8"
          >
            {logos.map(logoItem => (
              <LogoCard key={logoItem.id} LogoComponent={logoItem.component} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
