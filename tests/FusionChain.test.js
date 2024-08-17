// tests/FusionChain.test.js

// First, we're bringing in the tools we want to test and some helpers.
// It's like getting our science kit ready for an experiment!
const FusionChain = require('../src/chain/FusionChain');
const FusionChainResult = require('../src/chain/FusionChainResult');
const MinimalChainable = require('../src/chain/MinimalChainable');

// We're pretending to be the MinimalChainable.
// It's like playing dress-up as our friend!
jest.mock('../src/chain/MinimalChainable');

// We're starting our big test experiment for FusionChain.
describe('FusionChain', () => {
  // We're setting up some pretend things for our experiment.
  const mockContext = { user: 'Alice' };  // This is like a pretend person named Alice.
  const mockModels = [{ name: 'Model1' }, { name: 'Model2' }];  // These are our pretend robot friends.
  const mockCallable = jest.fn();  // This is a pretend function that doesn't do anything.
  const mockPrompts = ['Hello {{user}}', 'How are you?'];  // These are our pretend questions.
  const mockEvaluator = jest.fn((outputs) => [outputs[0], [0.9, 0.8]]);  // This is our pretend judge.

  // Before each small test, we clean up and set things up fresh.
  // It's like wiping the chalkboard clean before each new math problem.
  beforeEach(() => {
    jest.clearAllMocks();
    
    // We're telling our pretend MinimalChainable what to say when we talk to it.
    MinimalChainable.run.mockResolvedValue([
      ['Response 1', 'Response 2'],
      ['Filled Prompt 1', 'Filled Prompt 2']
    ]);
  });

  // We're testing our 'run' method.
  // It's like checking if our robot can talk to friends one by one.
  describe('run method', () => {
    it('should process each model sequentially and return a FusionChainResult', async () => {
      // We're running our experiment.
      const result = await FusionChain.run(
        mockContext,
        mockModels,
        mockCallable,
        mockPrompts,
        mockEvaluator
      );

      // We're checking if our experiment worked like we thought it would.
      expect(result).toBeInstanceOf(FusionChainResult);  // Did we get the right kind of answer?
      expect(MinimalChainable.run).toHaveBeenCalledTimes(2);  // Did we talk to both our robot friends?
      expect(mockEvaluator).toHaveBeenCalledTimes(1);  // Did we use our judge once?
    });
  });

  // We're testing our 'runParallel' method.
  // It's like checking if our robot can talk to all friends at once.
  describe('runParallel method', () => {
    it('should process all models in parallel and return a FusionChainResult', async () => {
      // We're running our experiment.
      const result = await FusionChain.runParallel(
        mockContext,
        mockModels,
        mockCallable,
        mockPrompts,
        mockEvaluator
      );

      // We're checking if our experiment worked like we thought it would.
      expect(result).toBeInstanceOf(FusionChainResult);  // Did we get the right kind of answer?
      expect(MinimalChainable.run).toHaveBeenCalledTimes(2);  // Did we talk to both our robot friends?
      expect(mockEvaluator).toHaveBeenCalledTimes(1);  // Did we use our judge once?
    });
  });

  // We're testing what happens when something goes wrong.
  // It's like checking if our robot knows what to do if it trips and falls.
  describe('error handling', () => {
    it('should handle errors in run method', async () => {
      // We're telling our pretend MinimalChainable to make a mistake.
      MinimalChainable.run.mockRejectedValueOnce(new Error('Test error'));

      // We're checking if our robot tells us when something goes wrong.
      await expect(FusionChain.run(
        mockContext,
        mockModels,
        mockCallable,
        mockPrompts,
        mockEvaluator
      )).rejects.toThrow('Test error');
    });

    it('should handle errors in runParallel method', async () => {
      // We're telling our pretend MinimalChainable to make a mistake.
      MinimalChainable.run.mockRejectedValueOnce(new Error('Test error'));

      // We're checking if our robot tells us when something goes wrong.
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