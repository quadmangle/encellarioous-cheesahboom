module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testPathIgnorePatterns: ['<rootDir>/legacy-reference/', '<rootDir>/legacy-app/', '<rootDir>/server/'],
};
