# Fusion Chain - NodeJS

A modular implementation of Fusion Chain for NodeJS, designed to integrate multiple Language Learning Models (LLMs) for enhanced AI capabilities.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Project Roadmap](#project-roadmap)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Architecture](#architecture)
7. [Testing](#testing)
8. [Contributing](#contributing)
9. [License](#license)

## Project Overview

Fusion Chain is an innovative framework that allows seamless integration and collaboration between multiple AI language models. It provides a flexible and powerful way to leverage the strengths of different LLMs, enabling more robust and versatile AI-powered applications.

## Features

- **Multi-Model Integration**: Easily integrate and use multiple LLM providers (e.g., Ollama, OpenAI) within a single application.
- **Flexible Chaining**: Use either sequential (MinimalChainable) or parallel (FusionChain) processing of prompts across multiple models.
- **Context Preservation**: Maintain context across multiple prompts and model interactions.
- **Custom Evaluation**: Implement custom evaluation logic to select the best responses from multiple models.
- **Error Handling**: Robust error handling and logging for reliable operation.
- **Extensibility**: Easily extend with new LLM providers or custom processing logic.

## Project Roadmap

### Completed
- [x] Create project structure
- [x] Initialize package.json
- [x] Set up .gitignore
- [x] Configure ESLint and Prettier for code consistency
- [x] Set up Jest for testing
- [x] Implement FusionChainResult class
- [x] Implement MinimalChainable class
- [x] Implement FusionChain class
- [x] Implement base LLMProvider class
- [x] Implement OllamaProvider
- [x] Implement OpenAIProvider
- [x] Implement logger
- [x] Implement conversationLogger

### In Progress
- [ ] Create main index.js to export public API
- [ ] Create integration tests
- [ ] Implement multichain-example.js

### Upcoming
- [ ] Write JSDoc comments for all classes and methods
- [ ] Create API documentation
- [ ] Write usage guide
- [ ] Create CONTRIBUTING.md
- [ ] Perform code review and refactoring
- [ ] Update package.json with final details
- [ ] Create LICENSE.md
- [ ] Finalize README.md

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/fusion-chain-nodejs.git
   ```
2. Navigate to the project directory:
   ```
   cd fusion-chain-nodejs
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add the following configuration:
   ```
   API_URL=http://localhost:11434/api/generate
   MODEL_NAME=llama3.1:latest
   PORT=3000
   OPENAI_MODEL_NAME=gpt-4o-mini-2024-07-18
   OPENAI_API_KEY=your-openai-api-key
   ```

   Note: 
   - `API_URL` is set to the local Ollama API endpoint. Adjust if your Ollama instance is running elsewhere.
   - `MODEL_NAME` is set to "llama3.1:latest" for Ollama. Change this if you're using a different model.
   - `PORT` is the port your application will run on.
   - `OPENAI_MODEL_NAME` is set to "gpt-4o-mini-2024-07-18". Adjust this if you're using a different OpenAI model.
   - Replace `your-openai-api-key` with your actual OpenAI API key.

## Usage

Here's a basic example of how to use Fusion Chain:

```javascript
const { FusionChain, OllamaProvider, OpenAIProvider } = require('./src/index');

async function runExample() {
  const ollama = new OllamaProvider(process.env.MODEL_NAME);
  const openai = new OpenAIProvider(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL_NAME);

  const prompts = [
    "What's the capital of France?",
    "Give me a fun fact about this city."
  ];

  const result = await FusionChain.run(
    {},
    [ollama, openai],
    (model, prompt) => model.generateResponse(prompt),
    prompts,
    (responses) => {
      // Simple evaluator that chooses the longest response
      const bestResponse = responses.reduce((a, b) => a.length > b.length ? a : b);
      return [bestResponse, responses.map(r => r.length / bestResponse.length)];
    }
  );

  console.log("Best response:", result.topResponse);
  console.log("Performance scores:", result.performanceScores);
}

runExample();
```

For more detailed examples, check the `examples/` directory.

## Architecture

Fusion Chain is built with a modular architecture:

- **LLMProvider**: Base class for all LLM providers.
- **OllamaProvider & OpenAIProvider**: Specific implementations of LLM providers.
- **MinimalChainable**: Handles sequential processing of prompts for a single model.
- **FusionChain**: Orchestrates the process of running multiple models and combining their results.
- **FusionChainResult**: Stores and represents the results of a fusion chain operation.

## Testing

We use Jest for testing. To run the tests:

```
npm test
```

To run tests with coverage:

```
npm run test:coverage
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the ISC License. See the [LICENSE.md](LICENSE.md) file for details.

---

We hope you find Fusion Chain useful for your AI-powered applications. If you have any questions or feedback, please open an issue or submit a pull request. Happy coding!