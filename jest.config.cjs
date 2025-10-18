module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testPathIgnorePatterns: ['<rootDir>/legacy-reference/', '<rootDir>/legacy-app/', '<rootDir>/server/'],
};
