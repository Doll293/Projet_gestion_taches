module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!jest.config.js'
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  verbose: true
};
