#!/bin/bash

# Remove previous ESLint and related packages
npm uninstall eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-node

# Install ESLint and Prettier
npm install --save-dev eslint@latest prettier eslint-config-prettier

# Create ESLint configuration file
cat > eslint.config.js << EOL
const js = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
    },
    rules: {
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'no-console': 'warn',
    },
  },
  prettierConfig,
];
EOL

# Create Prettier configuration file
cat > .prettierrc << EOL
{
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": true,
  "printWidth": 100
}
EOL

# Add lint and format scripts to package.json
npm pkg set scripts.lint="eslint \"src/**/*.js\" --fix"
npm pkg set scripts.format="prettier --write \"src/**/*.js\""

echo "ESLint 9.x and Prettier have been set up successfully!"