// tests/PipelineChain.test.js

const PipelineChain = require('../src/chain/PipelineChain');

describe('PipelineChain', () => {
  // Test case 1: Basic functionality
  it('should process a simple pipeline with two steps', async () => {
    const pipeline = new PipelineChain();
    
    // Define two simple steps
    const step1 = jest.fn((input, context) => input.toUpperCase());
    const step2 = jest.fn((input, context) => input + '!');

    pipeline.addStep(step1);
    pipeline.addStep(step2);

    const result = await pipeline.run('hello');

    expect(step1).toHaveBeenCalledWith('hello', expect.any(Object));
    expect(step2).toHaveBeenCalledWith('HELLO', expect.any(Object));
    expect(result).toBe('HELLO!');
  });

  // Test case 2: Error handling
  it('should handle errors in the pipeline', async () => {
    const pipeline = new PipelineChain();
    
    const step1 = jest.fn((input, context) => input.toUpperCase());
    const step2 = jest.fn((input, context) => {
      throw new Error('Step 2 failed');
    });

    pipeline.addStep(step1);
    pipeline.addStep(step2);

    await expect(pipeline.run('hello')).rejects.toThrow('Step 2 failed');
  });

  // Test case 3: Asynchronous steps
  it('should handle asynchronous steps', async () => {
    const pipeline = new PipelineChain();
    
    const step1 = jest.fn(async (input, context) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return input.toUpperCase();
    });
    const step2 = jest.fn(async (input, context) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return input + '!';
    });

    pipeline.addStep(step1);
    pipeline.addStep(step2);

    const result = await pipeline.run('hello');

    expect(result).toBe('HELLO!');
  });

  // Test case 4: Pipeline with context
  it('should pass context through the pipeline', async () => {
    const pipeline = new PipelineChain();
    
    const step1 = jest.fn((input, context) => {
      context.step1 = 'processed';
      return input.toUpperCase();
    });
    const step2 = jest.fn((input, context) => {
      context.step2 = 'processed';
      return input + '!';
    });

    pipeline.addStep(step1);
    pipeline.addStep(step2);

    const context = {};
    const result = await pipeline.run('hello', context);

    expect(result).toBe('HELLO!');
    expect(context).toEqual({ step1: 'processed', step2: 'processed' });
  });

  // Test case 5: Empty pipeline
  it('should return input unchanged for empty pipeline', async () => {
    const pipeline = new PipelineChain();
    const result = await pipeline.run('hello');
    expect(result).toBe('hello');
  });
});