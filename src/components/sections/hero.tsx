import Image from 'next/image';
import DynamicScrollVelocity from '@/components/ui/dynamic-scroll-velocity';

export default function Hero() {
  return (
    <section
      id="home"
      className="flex items-end justify-center min-h-screen bg-black relative overflow-hidden"
    >
      {/* Testo scorrevole dietro l'immagine */}
      <div className="absolute inset-0 flex items-center justify-center">
        <DynamicScrollVelocity
          texts={['OMARPIOSELLI']}
          velocity={-50}
          className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-white/10 tracking-tighter"
          parallaxClassName="w-full"
          scrollerClassName="flex whitespace-nowrap"
          numCopies={8}
        />
      </div>

      {/* Fade nero ai bordi */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fade sinistro */}
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-20"></div>
        {/* Fade destro */}
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-20"></div>
      </div>

      {/* Scritta in basso */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-sm md:text-base leading-relaxed text-white">
          AN INDEPENDENT CREATIVE WEB DEVELOPER
          <br />
          BASED IN ITALY
        </p>
      </div>

      {/* Contenuto principale */}
      <div className="container mx-auto px-4 pb-20 text-center relative z-10">
        <div className="max-w-md mx-auto">
          <Image
            src="/hero-image.png"
            alt="Hero Image"
            width={400}
            height={300}
            priority
            className="mx-auto w-80 md:w-96"
            style={{ backgroundColor: 'transparent' }}
          />
        </div>
      </div>
    </section>
  );
}
