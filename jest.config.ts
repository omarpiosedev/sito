import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' });

// Add any custom config to be passed to Jest
const config: Config = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['text', 'lcov', 'html'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // Setup files after env
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
    '^.+\\.(js|jsx)$': [
      'babel-jest',
      {
        presets: ['next/babel'],
      },
    ],
  },

  // Module file extensions for resolving
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Test match patterns - exclude e2e folder
  testMatch: [
    '<rootDir>/__tests__/**/*.(test|spec).(ts|tsx|js)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js)',
    '<rootDir>/test/**/*.(test|spec).(ts|tsx|js)',
  ],
  testPathIgnorePatterns: ['<rootDir>/e2e/', '<rootDir>/node_modules/'],

  // Transform ignore patterns - allow GSAP and other ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(gsap|framer-motion|motion|lightswind|lucide-react|class-variance-authority|clsx|tailwind-merge)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ],

  // Module path ignore patterns
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/dist/'],

  // Directories to search for tests
  roots: ['<rootDir>'],

  // Verbose output
  verbose: true,

  // Test timeout for async operations
  testTimeout: 10000,

  // Collect coverage from these paths
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/layout.tsx',
    '!src/app/global-error.tsx',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/build/**',
    '!**/out/**',
    '!**/coverage/**',
  ],

  // Handle static assets and path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    
    // Handle CSS imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    
    // Handle static assets
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff2|mp4|webm|wav|mp3|m4a|aac|oga|avif|ico|bmp)$':
      '<rootDir>/__mocks__/fileMock.js',
    
    // Handle Next.js fonts
    '@next/font/(.*)': '<rootDir>/__mocks__/nextFontMock.js',
    'next/font/(.*)': '<rootDir>/__mocks__/nextFontMock.js',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
