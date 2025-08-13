'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ShaderBackground from '../reactbits/Backgrounds/waves/waves';
import { Timeline } from '../ui/timeline';

gsap.registerPlugin(ScrollTrigger);

// Componente LiquidGlassContainer semplificato
const LiquidGlassContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div
        className="absolute top-0 left-0 z-0 h-full w-full rounded-3xl 
          shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
      transition-all duration-300
      dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]"
      />
      <div
        className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-3xl bg-black/20 backdrop-blur-3xl"
        style={{ backdropFilter: 'blur(24px) saturate(2.2) brightness(1.4)' }}
      />
      <div className="relative z-10 p-8">{children}</div>
      <GlassFilter />
    </div>
  );
};

const GlassFilter = () => {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.08 0.08"
            numOctaves="2"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur
            in="turbulence"
            stdDeviation="3"
            result="blurredNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="100"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="8" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
};

const About = () => {
  const textRef = useRef<HTMLParagraphElement>(null);

  // Dati per la Timeline
  const timelineData = [
    {
      title: '2019',
      content: (
        <div>
          <p className="text-white text-xs md:text-sm font-normal mb-8">
            Got introduced to web development through HTML, CSS, and JavaScript.
            Built small personal projects and simple landing pages, discovering
            the joy of turning ideas into interactive websites.
          </p>
        </div>
      ),
    },
    {
      title: '2021',
      content: (
        <div>
          <p className="text-white text-xs md:text-sm font-normal mb-8">
            Started exploring modern frameworks like React and Next.js.
            Experimented with APIs, dynamic routing, and responsive layouts.
            Completed my first freelance gigs, helping small businesses improve
            their online presence.
          </p>
        </div>
      ),
    },
    {
      title: '2023',
      content: (
        <div>
          <p className="text-white text-xs md:text-sm font-normal mb-8">
            Focused on improving UI/UX skills and learning TypeScript for more
            scalable code. Implemented animations with Framer Motion and GSAP to
            create engaging user interactions.
          </p>
        </div>
      ),
    },
    {
      title: '2025',
      content: (
        <div>
          <p className="text-white text-xs md:text-sm font-normal mb-4">
            Currently dedicated to building fast, accessible, and visually
            appealing web apps with Next.js. Exploring serverless functions,
            edge deployment, and performance optimization to deliver smooth
            experiences.
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-white text-xs md:text-sm">
              ✨ Modern Web Frameworks (Next.js, React)
            </div>
            <div className="flex gap-2 items-center text-white text-xs md:text-sm">
              🎨 Interactive UI & Motion Design
            </div>
            <div className="flex gap-2 items-center text-white text-xs md:text-sm">
              🚀 Performance & SEO Optimization
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    // Salvo il contenuto di testo originale (senza HTML)
    // const originalText = textElement.textContent || '';

    // Divido in caratteri e ricostruisco con <br /> nelle posizioni giuste
    const lines = [
      "I'm an Italian digital designer and web developer",
      'with years of experience, blending design, animation,',
      'and code into seamless digital experiences.',
      "I don't just build websites — I craft stories",
      'that move, interact, and inspire. My work lives',
      'at the sweet spot where creativity meets technology.',
    ];

    const wrappedHTML = lines
      .map(line => {
        return line
          .split('')
          .map(char =>
            char === ' '
              ? ' '
              : `<span class="char" style="color: #666666; opacity: 0.3; display: inline;">${char}</span>`
          )
          .join('');
      })
      .join('<br />');

    textElement.innerHTML = wrappedHTML;

    const charElements = textElement.querySelectorAll('.char');

    // Animazione carattere per carattere
    gsap.fromTo(
      charElements,
      {
        color: '#666666',
        opacity: 0.3,
      },
      {
        color: '#ffffff',
        opacity: 1,
        ease: 'none',
        stagger: 0.015, // Velocità illuminazione carattere per carattere
        scrollTrigger: {
          trigger: textElement,
          start: 'top bottom-=10%',
          end: 'center center',
          scrub: 1,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section id="about" className="relative -mt-1">
      {/* Sezione con il testo animato - mantiene il background rosso */}
      <div className="min-h-screen relative">
        <ShaderBackground
          className="absolute inset-0 z-0"
          color="#ff0000"
          backdropBlurAmount="none"
        />
        {/* Fade overlay per bordi top e bottom */}
        <div className="absolute inset-0 z-5 pointer-events-none">
          {/* Fade top più intenso su mobile - esteso oltre il bordo */}
          <div className="absolute top-0 left-0 w-full h-44 sm:h-36 md:h-44 bg-gradient-to-b from-black via-black/90 via-black/70 via-black/40 to-transparent"></div>
          {/* Fade bottom più intenso su mobile */}
          <div className="absolute -bottom-4 left-0 w-full h-44 sm:h-36 md:h-44 bg-gradient-to-t from-black via-black/90 via-black/70 via-black/40 to-transparent"></div>
        </div>
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl text-center">
            <LiquidGlassContainer>
              <div className="text-white uppercase">
                <p
                  ref={textRef}
                  className="text-2xl md:text-3xl lg:text-4xl font-normal drop-shadow-lg leading-tight"
                  style={{
                    fontFamily: 'Anton, sans-serif',
                    letterSpacing: '0.05em',
                  }}
                >
                  I&apos;m an Italian digital designer and web developer
                  <br />
                  with years of experience, blending design, animation,
                  <br />
                  and code into seamless digital experiences.
                  <br />
                  I don&apos;t just build websites — I craft stories
                  <br />
                  that move, interact, and inspire. My work lives
                  <br />
                  at the sweet spot where creativity meets technology.
                </p>
              </div>
            </LiquidGlassContainer>
          </div>
        </div>
      </div>

      {/* Timeline Section con background nero */}
      <div className="bg-black">
        <Timeline data={timelineData} />
      </div>
    </section>
  );
};

export default About;
