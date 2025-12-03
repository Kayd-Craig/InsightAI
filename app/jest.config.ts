import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/tests/configs/jest.setup.ts'],
  
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Limit worker processes to prevent memory issues
  maxWorkers: 2,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "tests/coverage",

  // Coverage reporters - includes formats that can be opened in Excel
  coverageReporters: [
    "text",           // Terminal output
    "html",           // HTML report for viewing in browser
    "lcov",           // LCOV format
    "json",           // JSON format that can be converted to Excel
    "json-summary",   // Summary JSON
    "cobertura"       // XML format that Excel can import
  ],

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],

  // Module name mapping for path aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Test file patterns
  testMatch: [
    "**/tests/unit/**/*.?([mc])[jt]s?(x)",
    "**/tests/unit/**/*.(test|spec).?([mc])[jt]s?(x)"
  ],

  // Ignore patterns for test paths
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/tests/e2e/",
    "playwright.config.ts"
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
