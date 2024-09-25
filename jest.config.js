module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(azure-devops-ui|azure-devops-extension-sdk|azure-devops-extension-api)/)'
  ],
  moduleNameMapper: {
    '\\.(png)$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts'
  ],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.config.js',
    '!**/*.config/**',
    '!**/dist/**',
    '!**/node_modules/**',
  ],
  coverageReporters: [
    'text'
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60
    }
  },
  collectCoverage: true
}