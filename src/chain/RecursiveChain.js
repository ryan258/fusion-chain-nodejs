// src/chain/RecursiveChain.js

const MinimalChainable = require('./MinimalChainable');

class RecursiveChain extends MinimalChainable {
  async run(context, model, callable, prompts, maxIterations = 5) {
    let currentOutput = '';
    let currentContext = { ...context };

    for (let i = 0; i < maxIterations; i++) {
      // Use `this` to call the `run` method of the MinimalChainable class
      const [outputs, contextFilledPrompts] = await MinimalChainable.run( // Call MinimalChainable.run directly
        currentContext,
        model,
        callable,
        prompts
      );

      currentOutput = outputs[outputs.length - 1];
      currentContext.previousOutput = currentOutput;
      currentContext.iteration = i + 1;

      // Termination condition: Stop after maxIterations
      if (i === maxIterations - 1) {
        return [currentOutput, currentContext];
      }
    }

    // Return the final output and context (even if maxIterations is not reached)
    return [currentOutput, currentContext];
  }
}

module.exports = RecursiveChain;