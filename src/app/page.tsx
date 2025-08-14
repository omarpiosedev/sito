import Hero from '@/components/sections/hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Capabilities from '@/components/sections/Capabilities';
import Process from '@/components/sections/Process';
import FeedbacksSection from '@/components/sections/FeedbacksSection';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import SectionDivider from '@/components/sections/SectionDivider';
import ScrollingBanner from '@/components/sections/ScrollingBanner';

export default function Home() {
  return (
    <>
      <main className="relative">
        <div className="bg-black">
          <Hero />
          <SectionDivider
            text="ABOUT ME"
            direction={false}
            velocity={80}
            height="h-32"
            textClassName="text-5xl md:text-7xl lg:text-9xl font-bold text-white/10 tracking-tighter uppercase"
          />
          <About />
          <Projects />
          <SectionDivider
            text="CAPABILITIES"
            direction={true}
            velocity={80}
            height="h-32"
            textClassName="text-5xl md:text-7xl lg:text-9xl font-bold text-white/10 tracking-tighter uppercase"
          />
          <Capabilities />
          <div className="relative z-30 -mt-32">
            <SectionDivider
              text="PROCESS"
              direction={false}
              velocity={80}
              height="h-32"
              textClassName="text-5xl md:text-7xl lg:text-9xl font-bold text-white/10 tracking-tighter uppercase"
            />
            <Process />
          </div>
          <FeedbacksSection />
          <SectionDivider
            text="CONTACT"
            direction={true}
            velocity={80}
            height="h-32"
            textClassName="text-5xl md:text-7xl lg:text-9xl font-bold text-white/10 tracking-tighter uppercase"
          />
          <Contact />
          <Footer />
        </div>
        <ScrollingBanner />
      </main>
    </>
  );
}
