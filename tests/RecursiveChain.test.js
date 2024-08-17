// tests/RecursiveChain.test.js

const RecursiveChain = require('../src/chain/RecursiveChain');
const OllamaProvider = require('../src/llm-providers/OllamaProvider');

jest.mock('../src/llm-providers/OllamaProvider');

describe('RecursiveChain', () => {
  it('should run recursively and update the context', async () => {
    const model = new OllamaProvider('llama2');
    const callable = jest.fn();
    const prompts = ['Initial prompt'];
    const maxIterations = 3;

    // Mock the callable to return a different output for each iteration
    callable.mockImplementationOnce(() => Promise.resolve('Output 1'));
    callable.mockImplementationOnce(() => Promise.resolve('Output 2'));
    callable.mockImplementationOnce(() => Promise.resolve('Output 3'));

    const chain = new RecursiveChain();
    const [output, context] = await chain.run({}, model, callable, prompts, maxIterations);

    // Assertions
    expect(callable).toHaveBeenCalledTimes(maxIterations); // Called for each iteration
    expect(output).toBe('Output 3'); // Final output after 3 iterations
    expect(context.previousOutput).toBe('Output 3'); // Previous output in context
    expect(context.iteration).toBe(3); // Iteration count in context
  });
});