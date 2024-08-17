// tests/MinimalChainable.test.js

const MinimalChainable = require('../src/chain/MinimalChainable');

// Hey there! 👋 This file is like a checklist for our MinimalChainable class.
// We're writing down what we expect it to do before we even create it!
// It's like planning a LEGO build before we start putting pieces together.

describe('MinimalChainable', () => {
  // First, let's test the main 'run' method
  describe('run method', () => {
    it('should process prompts and return outputs and filled prompts', async () => {
      // We're setting up a pretend scenario to test our class
      const context = { name: 'Alice' };
      const model = { name: 'TestModel' };
      const callable = jest.fn((model, prompt) => Promise.resolve(`Response to ${prompt}`));
      const prompts = ['Hello {{name}}', 'How are you?'];

      // Now, let's run our method and see what happens
      const [outputs, filledPrompts] = await MinimalChainable.run(context, model, callable, prompts);

      // Let's check if everything worked as we expected
      expect(outputs).toEqual(['Response to Hello Alice', 'Response to How are you?']);
      expect(filledPrompts).toEqual(['Hello Alice', 'How are you?']);
      expect(callable).toHaveBeenCalledTimes(2);
    });

    it('should handle function prompts', async () => {
      const context = { name: 'Bob' };
      const model = { name: 'TestModel' };
      const callable = jest.fn((model, prompt) => Promise.resolve(`Response to ${prompt}`));
      const prompts = [
        'Hello {{name}}',
        (ctx) => `How are you, ${ctx.name}?`
      ];

      const [outputs, filledPrompts] = await MinimalChainable.run(context, model, callable, prompts);

      expect(outputs).toEqual(['Response to Hello Bob', 'Response to How are you, Bob?']);
      expect(filledPrompts).toEqual(['Hello Bob', 'How are you, Bob?']);
    });
  });

  // Now, let's test the 'toDelimTextFile' method
  describe('toDelimTextFile method', () => {
    it('should format content into a delimited text', () => {
      const content = ['First response', 'Second response'];
      const result = MinimalChainable.toDelimTextFile('TestChain', content);

      const expected = 
        "🔗 -------- Prompt Chain Result #1 -------------\n\n" +
        "First response\n\n" +
        "🔗🔗 -------- Prompt Chain Result #2 -------------\n\n" +
        "Second response\n\n";

      expect(result).toBe(expected);
    });
  });

  // Let's also test how it handles errors
  describe('error handling', () => {
    it('should handle errors in callable function', async () => {
      const context = { name: 'Charlie' };
      const model = { name: 'TestModel' };
      const callable = jest.fn(() => Promise.reject(new Error('Test error')));
      const prompts = ['Hello {{name}}'];

      await expect(MinimalChainable.run(context, model, callable, prompts))
        .rejects.toThrow('Test error');
    });
  });
});

// Wow! We've written a lot of tests. Now our MinimalChainable class has a clear job description.
// When we start building the actual class, we'll know exactly what it needs to do to pass these tests.
// It's like having a map before we start a journey! 🗺️