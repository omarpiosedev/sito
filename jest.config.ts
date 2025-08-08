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
      },
    ],
  },

  // Module file extensions for resolving
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Test match patterns
  testMatch: [
    '<rootDir>/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/(tests|__tests__)/**/*.(ts|tsx|js)',
    '<rootDir>/**/*.(test|spec).(ts|tsx|js)',
  ],

  // Transform ignore patterns
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],

  // Module path ignore patterns
  modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/dist/'],

  // Directories to search for tests
  roots: ['<rootDir>'],

  // Verbose output
  verbose: true,

  // Handle static assets and path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
