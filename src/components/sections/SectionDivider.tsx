'use client';

import React from 'react';
import DynamicScrollVelocity from '@/components/ui/dynamic-scroll-velocity';

interface SectionDividerProps {
  /** Il testo da mostrare nel divisore */
  text: string;
  /** Direzione dello scroll: true per destra, false per sinistra */
  direction?: boolean;
  /** Velocità dello scroll (default: 100) */
  velocity?: number;
  /** Classe CSS personalizzata per il testo */
  textClassName?: string;
  /** Classe CSS personalizzata per il container */
  containerClassName?: string;
  /** Altezza del divisore (default: h-32) */
  height?: string;
  /** Colore di sfondo (default: bg-black) */
  backgroundColor?: string;
  /** Numero di copie del testo (default: 8) */
  numCopies?: number;
  /** Opacità del testo (default: 0.1) */
  textOpacity?: string;
}

export default function SectionDivider({
  text,
  direction = true,
  velocity = 100,
  textClassName = '',
  containerClassName = '',
  height = 'h-32',
  backgroundColor = 'bg-black',
  numCopies = 8,
  textOpacity = 'text-white/10',
}: SectionDividerProps) {
  const baseVelocity = direction ? velocity : -velocity;

  const defaultTextClass = `text-4xl md:text-6xl lg:text-8xl font-bold ${textOpacity} tracking-tighter uppercase`;
  const finalTextClass = textClassName || defaultTextClass;

  return (
    <section
      className={`${height} ${backgroundColor} relative overflow-hidden flex items-center justify-center -mt-1 md:mt-32 lg:mt-48 ${containerClassName}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <DynamicScrollVelocity
          texts={[text]}
          velocity={baseVelocity}
          className={finalTextClass}
          parallaxClassName="w-full"
          scrollerClassName="flex whitespace-nowrap"
          numCopies={numCopies}
        />
      </div>

      {/* Fade ai bordi per un effetto più pulito */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fade sinistro */}
        <div
          className={`absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-current to-transparent opacity-100`}
          style={{
            background: `linear-gradient(to right, ${backgroundColor === 'bg-black' ? 'black' : 'white'}, transparent)`,
          }}
        ></div>
        {/* Fade destro */}
        <div
          className={`absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-current to-transparent opacity-100`}
          style={{
            background: `linear-gradient(to left, ${backgroundColor === 'bg-black' ? 'black' : 'white'}, transparent)`,
          }}
        ></div>
      </div>
    </section>
  );
}
