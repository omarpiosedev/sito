'use client';

import ScrollVelocity from '@/components/reactbits/TextAnimations/ScrollVelocity/ScrollVelocity';

export default function ScrollingBanner() {
  return (
    <div
      role="banner"
      className="fixed bottom-0 left-0 right-0 bg-red-600 overflow-hidden z-0 h-32 md:h-48"
    >
      {/* Testo scorrevole massimo che riempie tutto lo spazio */}
      <div className="flex items-center justify-center h-full">
        <ScrollVelocity
          texts={['OMARPIOSELLI']}
          velocity={-50}
          className="text-[6rem] md:text-[12rem] lg:text-[14rem] font-bold text-black tracking-tighter leading-none"
          parallaxClassName="w-full"
          scrollerClassName="flex whitespace-nowrap items-center"
          numCopies={8}
        />
      </div>

      {/* Fade rosso ai bordi */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fade sinistro */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-red-600 to-transparent z-20"></div>
        {/* Fade destro */}
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-red-600 to-transparent z-20"></div>
      </div>
    </div>
  );
}
