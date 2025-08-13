'use client';

// import { motion } from 'framer-motion'; // Unused import removed

interface LogoCardProps {
  LogoComponent: React.ComponentType<{ className?: string }>;
  // alt: string; // Removed unused prop
  // index: number; // Removed unused prop
}

export default function LogoCard({ LogoComponent }: LogoCardProps) {
  return (
    <div
      className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center w-full h-full relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.8) 100%)',
        backdropFilter: 'blur(20px)',
        boxShadow:
          '0 8px 32px 0 rgba(0,0,0,0.37), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      <LogoComponent className="text-red-500 w-16 h-16 lg:w-24 lg:h-24 z-10" />
      {/* Liquid glass shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-60"></div>
    </div>
  );
}
