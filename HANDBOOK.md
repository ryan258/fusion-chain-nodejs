# Fusion Chain Handbook: Building and Combining AI Chains

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Concepts](#basic-concepts)
3. [Chain Types](#chain-types)
   - [MinimalChainable](#minimalchainable)
   - [FusionChain](#fusionchain)
   - [RecursiveChain](#recursivechain)
4. [LLM Providers](#llm-providers)
   - [OllamaProvider](#ollamaprovider)
   - [OpenAIProvider](#openaiprovider)
5. [Building Chains](#building-chains)
6. [Combining Chains](#combining-chains)
7. [Use Cases](#use-cases)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Introduction

Fusion Chain is a powerful and flexible framework for creating, combining, and managing AI language model chains. This handbook will guide you through the process of building different types of chains, mixing and matching them to achieve specific use cases, and optimizing your AI workflows.

## Basic Concepts

Before diving into the specifics of each chain type, let's review some basic concepts:

- **Chain**: A sequence of operations that process input prompts through one or more language models.
- **Provider**: A wrapper for a specific language model API (e.g., Ollama, OpenAI).
- **Context**: The information passed between chain operations, including previous outputs and metadata.
- **Prompt**: The input text sent to a language model for processing.

## Chain Types

### MinimalChainable

MinimalChainable is the simplest form of chain, processing a single prompt through a single model.

```javascript
const MinimalChainable = require('./src/chain/MinimalChainable');
const OllamaProvider = require('./src/llm-providers/OllamaProvider');

const model = new OllamaProvider('llama2');
const context = { user: 'Alice' };
const prompts = ['Hello, {{user}}!'];

const [outputs, filledPrompts] = await MinimalChainable.run(context, model, model.generateResponse, prompts);
console.log(outputs[0]); // Output from the model
```

### FusionChain

FusionChain allows you to process prompts through multiple models in parallel or sequentially.

```javascript
const FusionChain = require('./src/chain/FusionChain');
const OllamaProvider = require('./src/llm-providers/OllamaProvider');
const OpenAIProvider = require('./src/llm-providers/OpenAIProvider');

const ollamaModel = new OllamaProvider('llama2');
const openaiModel = new OpenAIProvider('your-api-key', 'gpt-3.5-turbo');

const context = { query: 'Explain quantum computing' };
const prompts = ['{{query}}'];

const result = await FusionChain.runParallel(
  context,
  [ollamaModel, openaiModel],
  (model, prompt) => model.generateResponse(prompt),
  prompts,
  (outputs) => [outputs[0], [0.5, 0.5]] // Simple evaluator that returns the first output
);

console.log(result.topResponse); // Best response from either model
```

### RecursiveChain

RecursiveChain allows for iterative refinement of outputs, useful for tasks that benefit from multiple passes.

```javascript
const RecursiveChain = require('./src/chain/RecursiveChain');
const OllamaProvider = require('./src/llm-providers/OllamaProvider');

const model = new OllamaProvider('llama2');
const context = { topic: 'Climate change' };
const prompts = [
  'Write a brief summary about {{topic}}',
  (ctx) => `Expand on this summary: ${ctx.previousOutput}`
];

const chain = new RecursiveChain();
const [finalOutput, finalContext] = await chain.run(context, model, model.generateResponse, prompts, 3);

console.log(finalOutput); // Final expanded summary after 3 iterations
```

## LLM Providers

### OllamaProvider

OllamaProvider is used for interacting with locally hosted Ollama models.

```javascript
const OllamaProvider = require('./src/llm-providers/OllamaProvider');

const ollamaModel = new OllamaProvider('llama2');
const response = await ollamaModel.generateResponse('Tell me a joke');
```

### OpenAIProvider

OpenAIProvider is used for interacting with OpenAI's API.

```javascript
const OpenAIProvider = require('./src/llm-providers/OpenAIProvider');

const openaiModel = new OpenAIProvider('your-api-key', 'gpt-3.5-turbo');
const response = await openaiModel.generateResponse('Explain the theory of relativity');
```

## Building Chains

To build a chain:

1. Choose the appropriate chain type based on your use case.
2. Select the LLM provider(s) you want to use.
3. Prepare your context and prompts.
4. Implement any necessary evaluation or processing functions.
5. Run the chain and process the results.

## Combining Chains

You can combine different chain types to create more complex workflows:

1. Use MinimalChainable for simple, single-model tasks.
2. Use FusionChain to compare outputs from multiple models.
3. Use RecursiveChain for tasks that require iterative refinement.
4. Chain the outputs of one chain as inputs to another.

Example of chaining outputs:

```javascript
const minimalChain = new MinimalChainable();
const recursiveChain = new RecursiveChain();

// First, get a summary using MinimalChainable
const [summaries] = await minimalChain.run(context, model, model.generateResponse, ['Summarize {{topic}}']);

// Then, use the summary as input for RecursiveChain to expand and refine
const expandedPrompts = [
  summaries[0],
  (ctx) => `Expand on this: ${ctx.previousOutput}`
];

const [finalOutput] = await recursiveChain.run({ summary: summaries[0] }, model, model.generateResponse, expandedPrompts, 3);
```

## Use Cases

1. **Multi-model comparison**: Use FusionChain to compare outputs from different models for the same prompt.
2. **Iterative writing**: Use RecursiveChain to progressively improve a piece of writing.
3. **Complex problem-solving**: Combine chains to break down and solve multi-step problems.
4. **Content generation pipeline**: Use a series of chains to generate, refine, and optimize content.

## Best Practices

1. Start simple and add complexity as needed.
2. Use appropriate chain types for each task.
3. Implement robust error handling and logging.
4. Optimize prompts for each model and task.
5. Regularly evaluate and refine your chain configurations.

## Troubleshooting

- If a chain is not producing expected results, check your prompts and context.
- Ensure API keys and model names are correct for each provider.
- Use logging to track the flow of data through your chains.
- Test each component of your chain individually before combining them.

Remember, the key to successful chain building is experimentation and iteration. Don't be afraid to try different combinations and configurations to find what works best for your specific use case.