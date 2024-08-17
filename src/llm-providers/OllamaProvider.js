// src/llm-providers/OllamaProvider.js

// We're importing the built-in 'http' module to make HTTP requests
const http = require('http');

// We're importing our base LLMProvider class. This is like a blueprint for all our AI providers.
const LLMProvider = require('./LLMProvider');

/**
 * OllamaProvider class
 * This class is responsible for communicating with the Ollama API.
 * It's like a translator between our code and the Ollama AI.
 */
class OllamaProvider extends LLMProvider {
  /**
   * Constructor for the OllamaProvider
   * @param {string} modelName - The name of the Ollama model to use (e.g., 'llama2')
   */
  constructor(modelName) {
    // We call the parent class constructor
    super();
    // We store the model name for later use
    this.modelName = modelName;
  }

  /**
   * Generates a response from the Ollama API
   * @param {string} prompt - The input prompt to send to the API
   * @returns {Promise<string>} - A promise that resolves with the API's response
   */
  async generateResponse(prompt) {
    // We're using a Promise because the HTTP request is asynchronous
    return new Promise((resolve, reject) => {
      // We prepare the request body. This is what we'll send to the API.
      const requestBody = JSON.stringify({
        model: this.modelName,
        prompt: prompt,
      });

      // These are the options for our HTTP request
      const options = {
        hostname: 'localhost',  // We're assuming Ollama is running locally
        port: 11434,  // This is the default Ollama API port
        path: '/api/generate',  // This is the API endpoint we're hitting
        method: 'POST',  // We're sending a POST request
        headers: {
          'Content-Type': 'application/json',  // We're sending JSON data
        },
      };

      // This will store the full response from the API
      let fullResponse = '';

      // We create and send the HTTP request
      const req = http.request(options, (res) => {
        // This event is fired when we receive data from the API
        res.on('data', (chunk) => {
          try {
            // Ollama sends the response in chunks, so we parse each chunk
            const jsonChunk = JSON.parse(chunk);
            if (jsonChunk.response) {
              // We add this chunk to our full response
              fullResponse += jsonChunk.response;
            }
          } catch (e) {
            // If we can't parse the chunk, we log an error
            console.error('Error processing chunk:', e);
          }
        });

        // This event is fired when the API has sent all the data
        res.on('end', () => {
          // We resolve our promise with the full response
          resolve(fullResponse);
        });
      });

      // This event is fired if there's an error with the HTTP request
      req.on('error', (error) => {
        // If there's an error, we reject our promise
        reject(error);
      });

      // We write our request body and end the request
      req.write(requestBody);
      req.end();
    });
  }
}

// We export our OllamaProvider so it can be used in other files
module.exports = OllamaProvider;