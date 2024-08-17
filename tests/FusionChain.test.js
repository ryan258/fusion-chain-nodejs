// tests/FusionChain.test.js

const FusionChain = require('../src/chain/FusionChain');
const FusionChainResult = require('../src/chain/FusionChainResult');
const MinimalChainable = require('../src/chain/MinimalChainable');

// Hey there! 👋 This is our test file for the FusionChain class.
// We're going to write tests for what we expect FusionChain to do,
// even before we build it! It's like making a wishlist for our code.

jest.mock('../src/chain/MinimalChainable');

describe('FusionChain', () => {
  // Let's set up some pretend data for our tests
  const mockContext = { user: 'Alice' };
  const mockModels = [{ name: 'Model1' }, { name: 'Model2' }];
  const mockCallable = jest.fn();
  const mockPrompts = ['Hello {{user}}', 'How are you?'];
  const mockEvaluator = jest.fn((outputs) => [outputs[0], [0.9, 0.8]]);

  beforeEach(() => {
    // Before each test, let's reset our mock functions
    jest.clearAllMocks();
    
    // Let's pretend MinimalChainable.run does something specific
    MinimalChainable.run.mockResolvedValue([
      ['Response 1', 'Response 2'],
      ['Filled Prompt 1', 'Filled Prompt 2']
    ]);
  });

  describe('run method', () => {
    it('should process each model sequentially and return a FusionChainResult', async () => {
      const result = await FusionChain.run(
        mockContext,
        mockModels,
        mockCallable,
        mockPrompts,
        mockEvaluator
      );

      // Let's check if everything worked as we expected
      expect(result).toBeInstanceOf(FusionChainResult);
      expect(MinimalChainable.run).toHaveBeenCalledTimes(2);
      expect(mockEvaluator).toHaveBeenCalledTimes(1);
    });
  });

  describe('runParallel method', () => {
    it('should process all models in parallel and return a FusionChainResult', async () => {
      const result = await FusionChain.runParallel(
        mockContext,
        mockModels,
        mockCallable,
        mockPrompts,
        mockEvaluator
      );

      // Let's check if everything worked as we expected
      expect(result).toBeInstanceOf(FusionChainResult);
      expect(MinimalChainable.run).toHaveBeenCalledTimes(2);
      expect(mockEvaluator).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('should handle errors in run method', async () => {
      MinimalChainable.run.mockRejectedValue(new Error('Test error'));

      await expect(FusionChain.run(
        mockContext,
        mockModels,
        mockCallable,
        mockPrompts,
        mockEvaluator
      )).rejects.toThrow('Test error');
    });

    it('should handle errors in runParallel method', async () => {
      MinimalChainable.run.mockRejectedValue(new Error('Test error'));

      await expect(FusionChain.runParallel(
        mockContext,
        mockModels,
        mockCallable,
        mockPrompts,
        mockEvaluator
      )).rejects.toThrow('Test error');
    });
  });
});

// Wow! We've written tests for our FusionChain class.
// These tests are like a blueprint for what we want our class to do.
// Now we can start building the actual FusionChain class to make these tests happy! 😊