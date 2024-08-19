// tests/ConditionalChain.test.js

const ConditionalChain = require('../src/chain/ConditionalChain');
const MinimalChainable = require('../src/chain/MinimalChainable');

jest.mock('../src/chain/MinimalChainable');

describe('ConditionalChain', () => {
  let conditionalChain;
  let mockModel;
  let mockCallable;

  beforeEach(() => {
    conditionalChain = new ConditionalChain();
    mockModel = { name: 'TestModel' };
    mockCallable = jest.fn();
    MinimalChainable.mockClear();
  });

  test('should add a branch with a condition', () => {
    const condition = jest.fn();
    const chain = new MinimalChainable();
    conditionalChain.addBranch(condition, chain);
    expect(conditionalChain.getBranches().size).toBe(1);
  });

  test('should set a default branch', () => {
    const chain = new MinimalChainable();
    conditionalChain.setDefaultBranch(chain);
    expect(conditionalChain.getDefaultBranch()).toBe(chain);
  });

  test('should throw an error when adding a branch with non-function condition', () => {
    expect(() => {
      conditionalChain.addBranch('not a function', new MinimalChainable());
    }).toThrow('Condition must be a function');
  });

  test('should execute the matching branch', async () => {
    const condition1 = jest.fn(() => false);
    const condition2 = jest.fn(() => true);
    const chain1 = new MinimalChainable();
    const chain2 = new MinimalChainable();

    chain2.run = jest.fn().mockResolvedValue('chain2 result');

    conditionalChain
      .addBranch(condition1, chain1)
      .addBranch(condition2, chain2);

    const context = { test: 'context' };
    const prompts = ['test prompt'];

    const result = await conditionalChain.run(context, mockModel, mockCallable, prompts);

    expect(condition1).toHaveBeenCalledWith(context);
    expect(condition2).toHaveBeenCalledWith(context);
    expect(chain2.run).toHaveBeenCalledWith(context, mockModel, mockCallable, prompts);
    expect(result).toBe('chain2 result');
  });

  test('should execute the default branch when no conditions match', async () => {
    const condition = jest.fn(() => false);
    const chain = new MinimalChainable();
    const defaultChain = new MinimalChainable();

    defaultChain.run = jest.fn().mockResolvedValue('default result');

    conditionalChain
      .addBranch(condition, chain)
      .setDefaultBranch(defaultChain);

    const context = { test: 'context' };
    const prompts = ['test prompt'];

    const result = await conditionalChain.run(context, mockModel, mockCallable, prompts);

    expect(condition).toHaveBeenCalledWith(context);
    expect(defaultChain.run).toHaveBeenCalledWith(context, mockModel, mockCallable, prompts);
    expect(result).toBe('default result');
  });

  test('should throw an error when no conditions match and no default branch is set', async () => {
    const condition = jest.fn(() => false);
    const chain = new MinimalChainable();

    conditionalChain.addBranch(condition, chain);

    const context = { test: 'context' };
    const prompts = ['test prompt'];

    await expect(conditionalChain.run(context, mockModel, mockCallable, prompts))
      .rejects.toThrow('No matching condition and no default branch set');
  });

  test('should allow function as a branch', async () => {
    const condition = jest.fn(() => true);
    const branchFunction = jest.fn().mockResolvedValue('function result');

    conditionalChain.addBranch(condition, branchFunction);

    const context = { test: 'context' };
    const prompts = ['test prompt'];

    const result = await conditionalChain.run(context, mockModel, mockCallable, prompts);

    expect(branchFunction).toHaveBeenCalledWith(context, mockModel, mockCallable, prompts);
    expect(result).toBe('function result');
  });
});