// examples/simple-ollama-example.js

require('dotenv').config();  // Let's load our secret settings
const OllamaProvider = require('../src/llm-providers/OllamaProvider');  // We're inviting our Ollama robot friend
const { logConversation } = require('../src/utils/conversationLogger');  // This helps us write down our conversation

// This is like setting up our play area
async function runSimpleExample() {
  console.log("🚀 Starting our simple Ollama example!");

  // Let's create our Ollama robot friend
  const ollama = new OllamaProvider(process.env.OLLAMA_MODEL_NAME || 'llama2');

  // This is the question we want to ask our robot friend
  const prompt = "What's the capital of France?";

  try {
    // Now, let's ask our robot friend the question!
    console.log("🤖 Asking Ollama: " + prompt);
    const response = await ollama.generateResponse(prompt);

    // Let's write down what our robot friend said
    logConversation(1, "Human", prompt);
    logConversation(2, "AI", response);

    console.log("✨ Our robot friend's answer: " + response);
  } catch (error) {
    // Oops, something went wrong!
    console.error("😢 Oh no! Something went wrong:", error);
  }

  console.log("🎉 All done with our simple example!");
}

// Let's run our example!
runSimpleExample();