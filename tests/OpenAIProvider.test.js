// tests/OpenAIProvider.test.js

const https = require('https');
const OpenAIProvider = require('../src/llm-providers/OpenAIProvider');

// We're pretending to be the 'https' module here
jest.mock('https');

describe('OpenAIProvider', () => {
  let provider;

  // Before each test, we set up a fresh OpenAIProvider
  beforeEach(() => {
    provider = new OpenAIProvider('test-api-key', 'test-model');
  });

  // Let's make sure our OpenAIProvider exists
  it('should be defined', () => {
    expect(OpenAIProvider).toBeDefined();
  });

  // Check if OpenAIProvider has the right properties
  it('should have apiKey and modelName properties', () => {
    expect(provider.apiKey).toBe('test-api-key');
    expect(provider.modelName).toBe('test-model');
  });

  // Now let's test the main function: generateResponse
  describe('generateResponse', () => {
    it('should make a POST request to OpenAI API', async () => {
      // We're creating a fake response from the API
      const mockResponse = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'data') {
            callback(JSON.stringify({
              choices: [{ message: { content: 'Test response' } }]
            }));
          }
          if (event === 'end') {
            callback();
          }
          return mockResponse;
        }),
      };

      // We're also creating a fake request object
      const mockRequest = {
        on: jest.fn().mockReturnThis(),
        write: jest.fn(),
        end: jest.fn(),
      };

      // Here we're pretending to be the https.request function
      https.request.mockImplementation((options, callback) => {
        callback(mockResponse);
        return mockRequest;
      });

      // Now let's call our function and check the results
      const response = await provider.generateResponse('Test prompt');

      // Did it call the API correctly?
      expect(https.request).toHaveBeenCalledWith(
        expect.objectContaining({
          hostname: 'api.openai.com',
          path: '/v1/chat/completions',
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
          }),
        }),
        expect.any(Function)
      );
      expect(mockRequest.write).toHaveBeenCalledWith(expect.stringContaining('"model":"test-model"'));
      expect(mockRequest.write).toHaveBeenCalledWith(expect.stringContaining('"messages":[{"role":"user","content":"Test prompt"}]'));
      expect(response).toBe('Test response');
    });

    // Let's also test what happens when there's an error
    it('should handle network errors', async () => {
      const mockRequest = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            callback(new Error('Network error'));
          }
          return mockRequest;
        }),
        write: jest.fn(),
        end: jest.fn(),
      };

      https.request.mockReturnValue(mockRequest);

      await expect(provider.generateResponse('Test prompt')).rejects.toThrow('Network error');
    });
  });
});