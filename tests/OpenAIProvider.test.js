// tests/OpenAIProvider.test.js

const OpenAIProvider = require('../src/llm-providers/OpenAIProvider');
const https = require('https');

// We're pretending to be the 'https' module here
jest.mock('https');

// This is where we describe all our tests for the OpenAIProvider
describe('OpenAIProvider', () => {
  let provider;

  // Before each test, we create a new OpenAIProvider to work with
  beforeEach(() => {
    provider = new OpenAIProvider('test-api-key', 'test-model');
  });

  // Let's make sure our OpenAIProvider exists
  it('should be defined', () => {
    expect(OpenAIProvider).toBeDefined();
  });

  // Check if OpenAIProvider is a type of LLMProvider
  it('should extend LLMProvider', () => {
    expect(provider).toBeInstanceOf(OpenAIProvider);
    expect(provider.generateResponse).toBeDefined();
  });

  // Make sure it has the right properties
  it('should have apiKey and modelName properties', () => {
    expect(provider.apiKey).toBe('test-api-key');
    expect(provider.modelName).toBe('test-model');
  });

  // Now let's test the main function: generateResponse
  describe('generateResponse', () => {
    // Test if it makes a POST request to OpenAI API correctly
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
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            // Do nothing for error event
          }
          return mockRequest;
        }),
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
      expect(https.request).toHaveBeenCalled();
      expect(mockRequest.write).toHaveBeenCalledWith(expect.stringContaining('"model":"test-model"'));
      expect(mockRequest.write).toHaveBeenCalledWith(expect.stringContaining('"messages":[{"role":"user","content":"Test prompt"}]'));
      expect(response).toBe('Test response');
    });

    // Test if it handles API errors correctly
    it('should handle API errors', async () => {
      // We're creating a fake request that will throw an error
      const mockRequest = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'error') {
            callback(new Error('API Error'));
          }
          return mockRequest;
        }),
        write: jest.fn(),
        end: jest.fn(),
      };

      // Pretend to be https.request again, but this time it'll cause an error
      https.request.mockImplementation((options, callback) => {
        return mockRequest;
      });

      // Make sure our function throws an error when the API fails
      await expect(provider.generateResponse('Test prompt')).rejects.toThrow('API Error');
    });
  });
});