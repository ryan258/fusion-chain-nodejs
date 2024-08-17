#!/bin/bash

# Install Jest and related packages
npm install --save-dev jest @types/jest

# Create Jest configuration file
cat > jest.config.js << EOL
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['text', 'lcov'],
};
EOL

# Add test scripts to package.json
npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:coverage="jest --coverage"

# Create a sample test file
mkdir -p tests
cat > tests/sample.test.js << EOL
describe('Sample Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
EOL

echo "Jest has been set up successfully!"