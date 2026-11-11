/**
 * Jest Configuration for Compliance-Insight
 * Supports ESM modules and provides comprehensive test coverage
 */

export default {
  // Use node test environment
  testEnvironment: 'node',

  // Transform ESM modules
  transform: {},
  
  // File extensions to consider
  moduleFileExtensions: ['js', 'json'],

  // Test match patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'lib/**/*.js',
    'server.js',
    '!lib/**/*.test.js',
    '!**/node_modules/**',
    '!**/tests/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],

  // Test timeout
  testTimeout: 30000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Reset mocks between tests
  resetMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Module paths
  modulePaths: ['<rootDir>'],

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/public/',
    '/sample-repo/'
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Max workers for parallel execution
  maxWorkers: '50%'
};

// Made with Bob