// src/llm-providers/OllamaProvider.js

const http = require('http');
const LLMProvider = require('./LLMProvider');

/**
 * Hey there! 👋 This is our OllamaProvider class. It's like a special robot 🤖
 * that knows how to talk to Ollama, a specific type of AI model.
 */
class OllamaProvider extends LLMProvider {
  /**
   * This is where we set up our Ollama robot with its special name.
   * 
   * @param {string} modelName - This is the name of the Ollama model we want to use.
   */
  constructor(modelName) {
    super();
    this.modelName = modelName;
  }

  /**
   * This is how our Ollama robot talks to the Ollama AI and gets answers!
   * 
   * @param {string} prompt - This is the question or instruction we want to give to Ollama.
   * @returns {Promise<string>} - This is the answer we get back from Ollama.
   */
  async generateResponse(prompt) {
    return new Promise((resolve, reject) => {
      const requestBody = JSON.stringify({
        model: this.modelName,
        prompt: prompt,
      });

      const options = {
        hostname: 'localhost',
        port: 11434,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      let fullResponse = '';

      const req = http.request(options, (res) => {
        res.on('data', (chunk) => {
          try {
            const jsonChunk = JSON.parse(chunk);
            if (jsonChunk.response) {
              fullResponse += jsonChunk.response;
            }
          } catch (e) {
            console.error('Error processing chunk:', e);
          }
        });

        res.on('end', () => {
          resolve(fullResponse);
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(requestBody);
      req.end();
    });
  }
}

// We're making our OllamaProvider available for others to use.
// It's like sharing our special Ollama-talking robot with friends!
module.exports = OllamaProvider;