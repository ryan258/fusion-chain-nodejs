// src/llm-providers/OpenAIProvider.js

const https = require('https');
const LLMProvider = require('./LLMProvider');

/**
 * Hey there! 👋 This is our OpenAIProvider class. It's like a special robot 🤖
 * that knows how to talk to OpenAI's AI models, like GPT-3 and GPT-4.
 */
class OpenAIProvider extends LLMProvider {
  /**
   * This is where we set up our OpenAI robot with its special key and model name.
   * 
   * @param {string} apiKey - This is the secret key we need to talk to OpenAI.
   * @param {string} modelName - This is the name of the OpenAI model we want to use.
   */
  constructor(apiKey, modelName) {
    super();
    this.apiKey = apiKey;
    this.modelName = modelName;
  }

  /**
   * This is how our OpenAI robot talks to the OpenAI API and gets answers!
   * 
   * @param {string} prompt - This is the question or instruction we want to give to OpenAI.
   * @returns {Promise<string>} - This is the answer we get back from OpenAI.
   */
  async generateResponse(prompt) {
    return new Promise((resolve, reject) => {
      // We're packing up our question in a way OpenAI understands
      const requestBody = JSON.stringify({
        model: this.modelName,
        messages: [{ role: 'user', content: prompt }],
      });

      // This is like the address and instructions for sending our package to OpenAI
      const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
      };

      // Now we're sending our package and waiting for a response
      const req = https.request(options, (res) => {
        let data = '';

        // We're collecting pieces of the response as they come in
        res.on('data', (chunk) => {
          data += chunk;
        });

        // When we have the whole response, we'll open it up and look inside
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.choices && response.choices.length > 0) {
              // We found the answer! Let's send it back.
              resolve(response.choices[0].message.content);
            } else {
              // Uh oh, the package didn't have what we expected
              reject(new Error('Invalid API response'));
            }
          } catch (error) {
            // Something went wrong when we tried to understand the response
            reject(error);
          }
        });
      });

      // If something goes wrong while sending our package, we'll know about it
      req.on('error', (error) => {
        reject(error);
      });

      // We're putting our question in the package and sending it off!
      req.write(requestBody);
      req.end();
    });
  }
}

// We're making our OpenAIProvider available for others to use.
// It's like sharing our special OpenAI-talking robot with friends!
module.exports = OpenAIProvider;