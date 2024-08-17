// tests/LLMProvider.test.js

const LLMProvider = require('../src/llm-providers/LLMProvider');

describe('LLMProvider', () => {
  it('should be defined', () => {
    expect(LLMProvider).toBeDefined();
  });

  it('should have a generateResponse method', () => {
    const provider = new LLMProvider();
    expect(provider.generateResponse).toBeDefined();
  });

  it('should throw an error when calling generateResponse', async () => {
    const provider = new LLMProvider();
    await expect(provider.generateResponse('Test prompt')).rejects.toThrow('Method not implemented');
  });
});