'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HackerBackground from '../eldoraui/hackerbg';
import { MultiDirectionSlide } from '../eldoraui/multidirectionalslide';
import ScrollIndicator from '../ui/scroll-indicator';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const readyBlockRef = useRef<HTMLDivElement>(null);
  const [animationStarted, setAnimationStarted] = React.useState(false);
  const [resetAnimation, setResetAnimation] = React.useState(false);
  const [textAnimationStarted, setTextAnimationStarted] = React.useState(false);
  const [readyBlockAnimationStarted, setReadyBlockAnimationStarted] =
    React.useState(false);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const readyBlockElement = readyBlockRef.current;

    if (!sectionElement) return;

    // ScrollTrigger per attivare il background e le animazioni di testo
    ScrollTrigger.create({
      trigger: sectionElement,
      start: 'top 100%',
      onEnter: () => {
        setResetAnimation(true);
        setAnimationStarted(true);
        setTextAnimationStarted(false);
        setTimeout(() => {
          setResetAnimation(false);
          setTextAnimationStarted(true);
        }, 200);
      },
      onEnterBack: () => {
        setResetAnimation(true);
        setAnimationStarted(true);
        setTextAnimationStarted(false);
        setTimeout(() => {
          setResetAnimation(false);
          setTextAnimationStarted(true);
        }, 200);
      },
      onLeave: () => {
        setTextAnimationStarted(false);
      },
      onLeaveBack: () => {
        setTextAnimationStarted(false);
      },
    });

    // ScrollTrigger separato per il blocco "READY TO START"
    if (readyBlockElement) {
      ScrollTrigger.create({
        trigger: readyBlockElement,
        start: 'top 100%',
        onEnter: () => {
          setReadyBlockAnimationStarted(true);
        },
        onLeave: () => {
          setReadyBlockAnimationStarted(false);
        },
        onEnterBack: () => {
          setReadyBlockAnimationStarted(true);
        },
        onLeaveBack: () => {
          setReadyBlockAnimationStarted(false);
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen overflow-hidden"
      role="region"
    >
      {animationStarted && (
        <HackerBackground
          color="#F00"
          fontSize={12}
          speed={0.8}
          reset={resetAnimation}
          className="absolute inset-0 z-0"
        />
      )}

      {/* Fade nero solo nella parte superiore per nascondere l'inizio delle cascate */}
      <div
        data-testid="fade-overlay"
        className="absolute top-0 left-0 right-0 z-10 h-20"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 70%, rgba(0, 0, 0, 0) 100%)',
        }}
      />

      <div
        data-testid="main-container"
        className="min-h-screen flex items-center justify-center px-6 relative z-20"
      >
        <div
          data-testid="content-wrapper"
          className="max-w-6xl w-full text-center relative"
        >
          {/* Titolo animato - entra da sinistra */}
          <div className="mb-12 relative z-10">
            <MultiDirectionSlide
              textLeft="LET'S CREATE SOMETHING AMAZING TOGETHER"
              textRight=""
              animate={textAnimationStarted}
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight uppercase text-white"
              style={{
                fontFamily: 'Anton, sans-serif',
                letterSpacing: '0.02em',
                lineHeight: '1.1',
              }}
            />
          </div>

          {/* Testo descrittivo - entra da destra */}
          <div className="mb-16 max-w-5xl mx-auto relative z-10">
            <MultiDirectionSlide
              textLeft=""
              textRight="Ready to turn your vision into a digital experience? Whether it's a modern website, an interactive web app, or a complete brand transformation, I'm here to bring your ideas to life with cutting-edge technology and creative flair."
              animate={textAnimationStarted}
              className="text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed text-white"
              style={{
                fontFamily: 'Anton, sans-serif',
                letterSpacing: '0.01em',
                fontWeight: '300',
              }}
            />
          </div>

          {/* Scroll Indicator */}
          {textAnimationStarted && (
            <ScrollIndicator className="relative z-10 mt-12" />
          )}
        </div>
      </div>

      {/* Sezione Contatti Professional */}
      <div className="relative z-20 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Layout semplificato - CTA a sinistra, Video a destra */}
          <div
            ref={readyBlockRef}
            data-testid="grid-container"
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            {/* Colonna sinistra - Call to Action principale */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={
                readyBlockAnimationStarted
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 100, scale: 0.8 }
              }
              transition={{
                duration: 0.8,
                delay: 0.1,
                type: 'spring',
                stiffness: 120,
                damping: 12,
              }}
              className="text-center lg:text-left"
            >
              <motion.h3
                initial={{ opacity: 0, y: 50 }}
                animate={
                  readyBlockAnimationStarted
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 140,
                }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight uppercase"
                style={{ fontFamily: 'Anton, sans-serif' }}
              >
                READY TO START YOUR NEXT PROJECT?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={
                  readyBlockAnimationStarted
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed"
              >
                Let&apos;s collaborate to transform your ideas into powerful
                digital solutions.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  readyBlockAnimationStarted
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <a
                  href="https://wa.me/393421489670"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="mailto:omarpioselli.dev@gmail.com"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-xl hover:bg-white/5 hover:border-white/40 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email
                </a>
              </motion.div>
            </motion.div>

            {/* Colonna destra - Video */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotateY: -15 }}
              animate={
                readyBlockAnimationStarted
                  ? { opacity: 1, scale: 1, rotateY: 0 }
                  : { opacity: 0, scale: 0.7, rotateY: -15 }
              }
              transition={{
                duration: 0.7,
                delay: 0.3,
                type: 'spring',
                stiffness: 100,
                damping: 10,
              }}
              className="flex justify-center"
            >
              <motion.div
                initial={{ y: 30 }}
                animate={readyBlockAnimationStarted ? { y: 0 } : { y: 30 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{
                  scale: 1.02,
                  rotateY: 5,
                  transition: { duration: 0.3 },
                }}
                data-testid="video-container"
                className="w-full max-w-md backdrop-blur-sm bg-black/20 border border-white/5 rounded-3xl relative group hover:border-white/10 transition-all duration-500 min-h-[520px] lg:min-h-[600px] overflow-hidden"
              >
                {/* Video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  role="application"
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source
                    data-testid="video-source"
                    src="/kling_video.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
