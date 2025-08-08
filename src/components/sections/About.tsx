'use client';

import React from 'react';
import ShaderBackground from '../reactbits/Backgrounds/waves/waves';

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
  return (
    <section id="about" className="min-h-screen relative">
      <ShaderBackground
        className="absolute inset-0 z-0"
        color="#ff0000"
        backdropBlurAmount="none"
      />
      {/* Fade overlay per bordi top e bottom */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {/* Fade top più accentuato */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black via-black/80 to-transparent"></div>
        {/* Fade bottom più accentuato */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl text-center">
          <LiquidGlassContainer>
            <div className="text-white uppercase">
              <p
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
    </section>
  );
};

export default About;
