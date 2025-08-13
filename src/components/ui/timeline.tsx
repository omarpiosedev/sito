'use client';
import { useScroll, useTransform, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

// Funzione helper per creare l'animazione carattere per carattere
const createCharAnimation = (element: HTMLElement, text: string, delay = 0) => {
  if (!element) return;

  const wrappedHTML = text
    .split('')
    .map(char =>
      char === ' '
        ? ' '
        : `<span class="char" style="color: transparent; opacity: 0; display: inline;">${char}</span>`
    )
    .join('');

  element.innerHTML = wrappedHTML;

  const charElements = element.querySelectorAll('.char');

  gsap.fromTo(
    charElements,
    {
      color: 'transparent',
      opacity: 0,
    },
    {
      color: '#ffffff',
      opacity: 1,
      ease: 'none',
      stagger: 0.015,
      delay: delay,
      scrollTrigger: {
        trigger: element,
        start: 'top bottom-=10%',
        end: 'center center',
        scrub: 1,
      },
    }
  );
};

// Componente per ogni item della timeline con animazione
const TimelineItem = ({
  item,
  index,
}: {
  item: TimelineEntry;
  index: number;
}) => {
  const titleDesktopRef = useRef<HTMLHeadingElement>(null);
  const titleMobileRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleDesktopRef.current) {
      createCharAnimation(titleDesktopRef.current, item.title, index * 0.2);
    }
    if (titleMobileRef.current) {
      createCharAnimation(titleMobileRef.current, item.title, index * 0.2);
    }
    if (contentRef.current) {
      // Estrai il testo dal contenuto React
      const textContent = contentRef.current.textContent || '';
      if (textContent) {
        createCharAnimation(contentRef.current, textContent, index * 0.2 + 0.3);
      }
    }
  }, [item.title, index]);

  return (
    <div className="flex justify-start pt-10 md:pt-40 md:gap-10">
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
        <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-neutral-600 border border-neutral-400 p-2" />
        </div>
        <h3
          ref={titleDesktopRef}
          className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-white"
        >
          {item.title}
        </h3>
      </div>

      <div className="relative pl-20 pr-4 md:pl-4 w-full">
        <h3
          ref={titleMobileRef}
          className="md:hidden block text-2xl mb-4 text-left font-bold text-white"
        >
          {item.title}
        </h3>
        <div ref={contentRef}>{item.content}</div>
      </div>
    </div>
  );
};

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  // Applica l'animazione carattere per carattere al titolo e descrizione
  useEffect(() => {
    if (titleRef.current) {
      createCharAnimation(titleRef.current, 'Changelog from my journey', 0);
    }
    if (descRef.current) {
      createCharAnimation(
        descRef.current,
        "Over the past years, I've been growing my skills and working on projects that mix creativity and functionality. Here's a snapshot of my journey.",
        0.5
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-black font-sans md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 text-center">
        <h2
          ref={titleRef}
          className="text-2xl md:text-3xl lg:text-4xl mb-8 text-white uppercase drop-shadow-lg"
          style={{
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '0.05em',
          }}
        >
          Changelog from my journey
        </h2>
        <p
          ref={descRef}
          className="text-white/90 text-sm md:text-base max-w-3xl mx-auto leading-normal"
          style={{
            fontFamily: 'Anton, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          Over the past years, I&apos;ve been growing my skills and working on
          projects that mix creativity and functionality. Here&apos;s a snapshot
          of my journey.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}
        <div
          style={{
            height: height + 'px',
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-400 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
