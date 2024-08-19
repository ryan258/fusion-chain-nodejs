// tests/RecursiveChain.test.js

const RecursiveChain = require('../src/chain/RecursiveChain');
const MinimalChainable = require('../src/chain/MinimalChainable');

jest.mock('../src/chain/MinimalChainable');

describe('RecursiveChain', () => {
  let chain;
  let model;
  let callable;

  beforeEach(() => {
    chain = new RecursiveChain();
    model = { name: 'TestModel' };
    callable = jest.fn();
    MinimalChainable.run.mockClear();
  });

  // Test basic functionality
  it('should run recursively and update the context', async () => {
    const prompts = ['Initial prompt'];
    const maxIterations = 3;

    MinimalChainable.run.mockImplementation(() => Promise.resolve([['Output'], ['Filled Prompt']]));

    const [output, context] = await chain.run({}, model, callable, prompts, maxIterations);

    expect(MinimalChainable.run).toHaveBeenCalledTimes(maxIterations);
    expect(output).toBe('Output');
    expect(context.previousOutput).toBe('Output');
    expect(context.iteration).toBe(3);
  });

  // Test with different maxIterations
  it('should respect maxIterations parameter', async () => {
    const prompts = ['Initial prompt'];
    const maxIterations = 5;

    MinimalChainable.run.mockImplementation(() => Promise.resolve([['Output'], ['Filled Prompt']]));

    const [output, context] = await chain.run({}, model, callable, prompts, maxIterations);

    expect(MinimalChainable.run).toHaveBeenCalledTimes(maxIterations);
    expect(output).toBe('Output');
    expect(context.iteration).toBe(5);
  });

  // Test with initial context
  it('should incorporate initial context', async () => {
    const initialContext = { key: 'value' };
    const prompts = ['Use {{key}}'];
    const maxIterations = 1;

    MinimalChainable.run.mockImplementation(() => Promise.resolve([['Processed Use value'], ['Use value']]));

    const [output, context] = await chain.run(initialContext, model, callable, prompts, maxIterations);

    expect(MinimalChainable.run).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'value' }),
      model,
      callable,
      prompts
    );
    expect(output).toBe('Processed Use value');
    expect(context.key).toBe('value');
  });

  // Test error handling
  it('should handle errors in MinimalChainable.run', async () => {
    const prompts = ['Initial prompt'];
    const maxIterations = 3;

    MinimalChainable.run.mockRejectedValueOnce(new Error('API Error'));

    await expect(chain.run({}, model, callable, prompts, maxIterations))
      .rejects.toThrow('API Error');

    expect(MinimalChainable.run).toHaveBeenCalledTimes(1);
  });

  // Test with multiple prompts
  it('should handle multiple prompts', async () => {
    const prompts = ['Prompt 1', 'Prompt 2'];
    const maxIterations = 2;

    MinimalChainable.run.mockImplementation(() => Promise.resolve([['Output 1', 'Output 2'], ['Filled Prompt 1', 'Filled Prompt 2']]));

    const [output, context] = await chain.run({}, model, callable, prompts, maxIterations);

    expect(MinimalChainable.run).toHaveBeenCalledTimes(maxIterations);
    expect(output).toBe('Output 2');
  });

  // Test with dynamic prompts
  it('should handle dynamic prompts', async () => {
    const prompts = [
      'Initial prompt',
      (context) => `Follow-up: ${context.previousOutput}`
    ];
    const maxIterations = 2;

    MinimalChainable.run
      .mockImplementationOnce(() => Promise.resolve([['First response', 'Second response'], ['Initial prompt', 'Follow-up: undefined']]))
      .mockImplementationOnce(() => Promise.resolve([['Third response', 'Fourth response'], ['Initial prompt', 'Follow-up: Second response']]));

    const [output, context] = await chain.run({}, model, callable, prompts, maxIterations);

    expect(MinimalChainable.run).toHaveBeenCalledTimes(maxIterations);
    expect(output).toBe('Fourth response');
  });

  // Test early termination
  it('should terminate after maxIterations', async () => {
    const prompts = ['Prompt'];
    const maxIterations = 3;

    MinimalChainable.run.mockImplementation(() => Promise.resolve([['Output'], ['Filled Prompt']]));

    const [output, context] = await chain.run({}, model, callable, prompts, maxIterations);

    expect(MinimalChainable.run).toHaveBeenCalledTimes(maxIterations);
    expect(output).toBe('Output');
    expect(context.iteration).toBe(3);
  });
});