'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left - Nome */}
          <div className="text-lg font-bold">OMAR PIOSELLI</div>

          {/* Center - Menu button (Desktop) */}
          <div
            className="hidden md:flex flex-col items-center cursor-pointer"
            onClick={toggleMenu}
          >
            <div className="w-8 h-0.5 bg-white mb-1"></div>
            <span className="text-sm font-medium">MENU</span>
          </div>

          {/* Right - Contattami (Desktop) */}
          <div className="hidden md:block text-lg font-bold">CONTATTAMI</div>

          {/* Mobile - Hamburger Menu */}
          <div className="md:hidden cursor-pointer" onClick={toggleMenu}>
            <div
              className={`w-6 h-0.5 bg-white mb-1.5 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white mb-1.5 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
            ></div>
          </div>
        </div>
      </div>

      {/* Menu a scomparsa */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-t border-white/20">
          <div className="container mx-auto px-4 py-8">
            <ul className="space-y-6 text-center">
              <li>
                <a
                  href="#home"
                  className="text-xl hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOME
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-xl hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CHI SONO
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-xl hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  PROGETTI
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-xl hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SERVIZI
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-xl hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CONTATTI
                </a>
              </li>
              {/* Contattami per mobile */}
              <li className="md:hidden pt-4 border-t border-white/20">
                <a
                  href="#contact"
                  className="text-xl font-bold hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CONTATTAMI
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
