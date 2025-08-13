'use client';

import React, { useEffect, useState, useRef } from 'react';
import CardSwap, {
  Card,
} from '@/components/reactbits/Components/CardSwap/CardSwap';

export default function Capabilities() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const sectionRef = useRef(null);

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
        rootMargin: '0px 0px 0px 0px',
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  const capabilities = [
    {
      number: '01',
      title: 'STRATEGY',
      items: [
        'DISCOVERY',
        'RESEARCH',
        'ANALYSIS',
        'CONSULTATION',
        'OPTIMIZATION',
      ],
    },
    {
      number: '02',
      title: 'DESIGN',
      items: [
        'BRANDING',
        'UI/UX',
        'VISUAL IDENTITY',
        'GRAPHICS',
        'ILLUSTRATION',
      ],
    },
    {
      number: '03',
      title: 'DEVELOPMENT',
      items: [
        'FULL STACK',
        'FRONTEND',
        'API INTEGRATION',
        'TESTING',
        'DEPLOYMENT',
      ],
    },
    {
      number: '04',
      title: 'PRODUCTION',
      items: [
        '3D MODELING',
        'VR EXPERIENCES',
        'VISUALIZATION',
        'MOTION GRAPHICS',
        'ANIMATIONS',
      ],
    },
  ];

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="w-full min-h-screen px-6 md:px-12 lg:px-24 py-16 flex flex-col justify-center relative bg-black z-20 capabilities-section"
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="w-full max-w-none">
        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[600px] relative gap-8 lg:gap-16 -mt-8 lg:mt-0">
          {/* Header a sinistra */}
          <div className="flex-1 lg:pr-8 text-center lg:text-left">
            <h2
              className={`text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wide text-white mb-6 transform transition-all duration-1200 ease-out hw-accelerated ${
                isVisible && !isExiting
                  ? 'opacity-100 translate-x-0 translate-y-0'
                  : isExiting
                    ? 'opacity-0 translate-x-20 -translate-y-4 scale-95'
                    : 'opacity-0 -translate-x-20 translate-y-4'
              }`}
              style={{
                fontFamily: 'Anton, sans-serif',
                transitionDelay: isVisible && !isExiting ? '0.2s' : '0s',
              }}
            >
              SOLUTIONS
            </h2>
            <h3
              className={`text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wide text-white transform transition-all duration-1400 ease-out hw-accelerated ${
                isVisible && !isExiting
                  ? 'opacity-100 translate-x-0 translate-y-0'
                  : isExiting
                    ? 'opacity-0 translate-x-20 -translate-y-4 scale-95'
                    : 'opacity-0 -translate-x-20 translate-y-4'
              }`}
              style={{
                fontFamily: 'Anton, sans-serif',
                transitionDelay:
                  isVisible && !isExiting ? '0.5s' : isExiting ? '0.1s' : '0s',
              }}
            >
              I PROVIDE
            </h3>
          </div>

          {/* CardSwap Component Container a destra */}
          <div
            className={`flex-1 flex justify-center items-center relative h-[400px] md:h-[500px] lg:h-[600px] transform transition-all duration-1000 ease-out hw-accelerated ${
              isVisible && !isExiting
                ? 'opacity-100 translate-x-0 scale-100'
                : isExiting
                  ? 'opacity-0 translate-x-10 scale-90'
                  : 'opacity-0 translate-x-10 scale-90'
            }`}
            style={{
              transitionDelay:
                isVisible && !isExiting ? '0.6s' : isExiting ? '0s' : '0s',
            }}
          >
            <div className="relative w-full h-full flex justify-center items-center">
              <CardSwap
                width={350}
                height={450}
                cardDistance={60} // Desktop: offset laterale
                verticalDistance={70} // Desktop: offset verticale
                mobileCardDistance={0} // Mobile: nessun offset laterale
                mobileVerticalDistance={15} // Mobile: leggero offset per visibilità
                delay={3000}
                pauseOnHover={false}
                skewAmount={5} // Desktop: diagonali
                mobileSkewAmount={0} // Mobile: frontali
                easing="elastic"
              >
                {capabilities.map((capability, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-gray-900/90 to-black/95 backdrop-blur-sm border border-gray-800/50 overflow-hidden"
                  >
                    {/* Wrapper per video positioning */}
                    <div className="relative w-full h-full">
                      {/* Video Background for Strategy Card */}
                      {capability.title === 'STRATEGY' && (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover z-0"
                          aria-label="Strategy background animation video"
                        >
                          <source
                            src="/mystical-orb-video.mp4"
                            type="video/mp4"
                          />
                        </video>
                      )}

                      {/* Video Background for Design Card */}
                      {capability.title === 'DESIGN' && (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover z-0"
                          aria-label="Design background animation video"
                        >
                          <source
                            src="/reaching-light-video.mp4"
                            type="video/mp4"
                          />
                        </video>
                      )}

                      {/* Video Background for Development Card */}
                      {capability.title === 'DEVELOPMENT' && (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover z-0"
                          aria-label="Development background animation video"
                        >
                          <source
                            src="/mystical-red-tree-video.mp4"
                            type="video/mp4"
                          />
                        </video>
                      )}

                      {/* Video Background for Production Card */}
                      {capability.title === 'PRODUCTION' && (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover z-0"
                          aria-label="Production background animation video"
                        >
                          <source
                            src="/red-lit-introspection-video.mp4"
                            type="video/mp4"
                          />
                        </video>
                      )}

                      {/* Content */}
                      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                        <div>
                          {/* Number */}
                          <span className="text-orange-500 text-lg font-light tracking-wider mb-4 block">
                            / {capability.number}
                          </span>

                          {/* Title */}
                          <h4
                            className="text-3xl font-bold mb-8 tracking-tight text-white"
                            style={{ fontFamily: 'Anton, sans-serif' }}
                          >
                            {capability.title}
                          </h4>

                          {/* Items List */}
                          <ul className="space-y-3">
                            {capability.items.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="text-base font-light tracking-wide flex items-center text-white"
                              >
                                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
