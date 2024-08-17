// tests/OllamaProvider.test.js

const OllamaProvider = require('../src/llm-providers/OllamaProvider');
const http = require('http');

jest.mock('http');

describe('OllamaProvider', () => {
  let provider;

  beforeEach(() => {
    provider = new OllamaProvider('test-model');
  });

  it('should be defined', () => {
    expect(OllamaProvider).toBeDefined();
  });

  it('should extend LLMProvider', () => {
    expect(provider).toBeInstanceOf(OllamaProvider);
    expect(provider.generateResponse).toBeDefined();
  });

  it('should have a modelName property', () => {
    expect(provider.modelName).toBe('test-model');
  });

  describe('generateResponse', () => {
    it('should make a POST request to Ollama API', async () => {
      const mockResponse = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'data') {
            callback(JSON.stringify({ response: 'Test response' }));
          }
          if (event === 'end') {
            callback();
          }
          return mockResponse;
        }),
      };

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

      http.request.mockImplementation((options, callback) => {
        callback(mockResponse);
        return mockRequest;
      });

      const response = await provider.generateResponse('Test prompt');

      expect(http.request).toHaveBeenCalled();
      expect(mockRequest.write).toHaveBeenCalledWith(expect.stringContaining('"model":"test-model"'));
      expect(mockRequest.write).toHaveBeenCalledWith(expect.stringContaining('"prompt":"Test prompt"'));
      expect(response).toBe('Test response');
    });

    it('should handle API errors', async () => {
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

      http.request.mockImplementation((options, callback) => {
        return mockRequest;
      });

      await expect(provider.generateResponse('Test prompt')).rejects.toThrow('API Error');
    });
  });
});