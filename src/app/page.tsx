import Hero from '@/components/sections/hero';
import About from '@/components/sections/About';
import SectionDivider from '@/components/sections/SectionDivider';

export default function Home() {
  return (
    <main>
      <Hero />
      <SectionDivider 
        text="ABOUT ME"
        direction={false}
        velocity={80}
        height="h-32"
        textClassName="text-5xl md:text-7xl lg:text-9xl font-bold text-white/10 tracking-tighter uppercase"
      />
      <About />
    </main>
  );
}
