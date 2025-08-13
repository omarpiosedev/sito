import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configurazione globale per React Testing Library
configure({
  // Aumenta il timeout per i test più complessi
  asyncUtilTimeout: 5000,
  // Configura il selettore di test id
  testIdAttribute: 'data-testid',
});

// Mock per IntersectionObserver (usato spesso in animazioni)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock per ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock per matchMedia (CSS media queries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock per requestAnimationFrame (animazioni)
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock per window.scrollTo
global.scrollTo = jest.fn();

// Suppress console.warn per test più puliti (opzionale)
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
});
