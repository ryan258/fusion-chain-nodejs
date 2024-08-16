# Fusion Chain - NodeJS

A modular implementation of Fusion Chain for NodeJS, designed to integrate multiple Language Learning Models (LLMs) for enhanced AI capabilities.

## Project Roadmap

### Setup and Infrastructure
- [x] Create project structure
- [x] Initialize package.json
- [x] Set up .gitignore
- [ ] Configure ESLint and Prettier for code consistency
- [ ] Set up Jest for testing

### Core Components
- [ ] Implement FusionChainResult class
  - [ ] Constructor
  - [ ] toString method
- [ ] Implement MinimalChainable class
  - [ ] run method
  - [ ] Private helper methods
  - [ ] toDelimTextFile method
- [ ] Implement FusionChain class
  - [ ] run method
  - [ ] runParallel method

### LLM Providers
- [ ] Implement base LLMProvider class
- [ ] Implement OllamaProvider
  - [ ] Constructor
  - [ ] generateResponse method
- [ ] Implement OpenAIProvider
  - [ ] Constructor
  - [ ] generateResponse method

### Utility Functions
- [ ] Implement logger
  - [ ] Log to file
  - [ ] Log to console
- [ ] Implement conversationLogger
  - [ ] logConversation function

### Integration and Testing
- [ ] Create main index.js to export public API
- [ ] Write unit tests for each component
- [ ] Create integration tests
- [ ] Implement multichain-example.js

### Documentation
- [ ] Write JSDoc comments for all classes and methods
- [ ] Create API documentation
- [ ] Write usage guide
- [ ] Create CONTRIBUTING.md

### Finalization
- [ ] Perform code review and refactoring
- [ ] Update package.json with final details
- [ ] Create LICENSE.md
- [ ] Finalize README.md

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file with your API keys and configuration
4. Run `npm start` to start the application

## Running Examples

To run the multichain example:

```
node examples/multichain-example.js
```

## Project Structure

```
fusion-chain-nodejs/
├── src/
│   ├── chain/
│   │   ├── FusionChain.js
│   │   ├── FusionChainResult.js
│   │   └── MinimalChainable.js
│   ├── llm-providers/
│   │   ├── LLMProvider.js
│   │   ├── OllamaProvider.js
│   │   └── OpenAIProvider.js
│   ├── utils/
│   │   ├── logger.js
│   │   └── conversationLogger.js
│   └── index.js
├── examples/
│   └── multichain-example.js
├── tests/
│   └── ... (test files)
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the LICENSE.md file for details.
