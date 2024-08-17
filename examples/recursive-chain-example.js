// examples/recursive-chain-example.js

// Let's bring in our special tools to talk to our AI friend!
const RecursiveChain = require('../src/chain/RecursiveChain');
const OllamaProvider = require('../src/llm-providers/OllamaProvider');

// This helper will write down our conversation in a neat way
const { logConversation } = require('../src/utils/conversationLogger');

// This is our main function where all the exciting stuff happens!
async function runRecursiveChainExample() {
  // Let's tell everyone we're starting our adventure!
  console.log("🚀 Starting our Recursive Chain example!");

  // We're creating our AI friend, who is really good at understanding and responding to questions
  const ollama = new OllamaProvider('llama3.1:latest'); // This is like choosing a specific AI friend to play with

  // We'll ask our AI friend to help us write a story, starting with this sentence
  const initialPrompt = "Once upon a time, the was a Monster Mash...";

  // We'll use a Recursive Chain, which is like a special tool that lets us ask our AI friend the same question multiple times, each time building on the previous answer
  const chain = new RecursiveChain();

  // We'll tell our AI friend to keep adding to the story for 10 rounds
  const maxIterations = 10;

  // This is like a special instruction for our AI friend on how to continue the story
  const prompts = [
    (context) => {
      // If this is the first time we're asking, we'll use the initial prompt
      if (context.iteration === 1) {
        console.log("💬 Asking for the initial part of the story..."); // New log
        return initialPrompt;
      } else {
        // Otherwise, we'll ask our AI friend to continue the story from where they left off
        console.log(`💬 Asking to continue the story (Iteration ${context.iteration})...`); // New log
        return `Continue the story: ${context.previousOutput}`;
      }
    },
  ];

  // We'll keep track of how our AI friend is doing with each response
  const callable = async (model, prompt) => {
    try {
      console.log("🤖 Waiting for our AI friend's response..."); // New log
      const response = await model.generateResponse(prompt);
      console.log("✅ Got a response from our AI friend!"); // New log
      return response;
    } catch (error) {
      console.error(`Error with ${model.constructor.name}: ${error.message}`);
      return "Sorry, I couldn't answer that.";
    }
  };

  try {
    // Let's start asking our AI friend!
    console.log("🤖 Asking our AI friend to write a story...");
    const [output, context] = await chain.run({}, ollama, callable, prompts, maxIterations);

    // Now let's see the amazing story our AI friend created!
    console.log("✨ Our AI friend's story:\n", output);

    // Let's also log the context to see what information was passed between iterations
    console.log("🔍 Here's the context:", context); // New log
  } catch (error) {
    // Oops, something went wrong! Let's tell everyone.
    console.error("😢 Oh no! Something went wrong:", error);
  }

  // Let's announce that our adventure is over!
  console.log("🎉 All done with our Recursive Chain example!");
}

// This line starts the whole process!
runRecursiveChainExample();