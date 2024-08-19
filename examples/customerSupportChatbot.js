// examples/customerSupportChatbot.js

// First, we need to bring in the tools we'll be using
// Think of this like getting all your ingredients before starting to cook
const ConditionalChain = require('../src/chain/ConditionalChain');
const MinimalChainable = require('../src/chain/MinimalChainable');
const OllamaProvider = require('../src/llm-providers/OllamaProvider');

// This is our main chatbot function. It's like a recipe for making a smart chatbot!
async function runCustomerSupportChatbot(userMessage) {
  // Let's announce what we're doing, like a chef explaining each step
  console.log("Starting chatbot process for message:", userMessage);

  // Create our AI assistant using Ollama
  // This is like hiring a smart helper for our chatbot kitchen
  const model = new OllamaProvider('llama2');
  console.log("Ollama provider initialized");

  // Set up our ConditionalChain
  // This is like creating a decision-making flowchart for our chatbot
  const chatbot = new ConditionalChain();
  console.log("ConditionalChain created");

  // Now, let's prepare our "scripts" for different types of questions
  // These are like different recipes our chatbot can follow

  // For billing questions
  const billingPrompt = [
    "You are a helpful billing assistant. The user has a billing-related question. Their message is: '{{message}}'. Provide a friendly and informative response to help with their billing inquiry."
  ];

  // For technical issues
  const technicalPrompt = [
    "You are a knowledgeable technical support agent. The user has a technical issue. Their message is: '{{message}}'. Offer a clear and helpful response to assist with their technical problem."
  ];

  // For general inquiries
  const generalPrompt = [
    "You are a friendly customer support agent. The user has a general inquiry. Their message is: '{{message}}'. Provide a warm and helpful response to assist with their question."
  ];

  // Now, let's set up our decision-making rules
  // This is like teaching our chatbot when to use each recipe

  // If the message is about billing, use the billing prompt
  chatbot.addBranch(
    (context) => context.message.toLowerCase().includes('bill') || context.message.toLowerCase().includes('payment'),
    async (context, model, callable, prompts) => {
      console.log("Billing branch selected");
      return MinimalChainable.run(context, model, callable, billingPrompt);
    }
  );

  // If the message is about a technical issue, use the technical prompt
  chatbot.addBranch(
    (context) => context.message.toLowerCase().includes('error') || context.message.toLowerCase().includes('not working'),
    async (context, model, callable, prompts) => {
      console.log("Technical branch selected");
      return MinimalChainable.run(context, model, callable, technicalPrompt);
    }
  );

  // For any other type of message, use the general prompt
  chatbot.setDefaultBranch(
    async (context, model, callable, prompts) => {
      console.log("General branch selected");
      return MinimalChainable.run(context, model, callable, generalPrompt);
    }
  );

  // Prepare the context (information) for our chatbot
  // This is like giving our chatbot the customer's question
  const context = { message: userMessage };

  console.log("Running ConditionalChain");
  try {
    // Now, let's run our chatbot and get its response!
    // This is like asking our chatbot to read the question and give an answer
    const result = await chatbot.run(context, model, async (model, prompt) => {
      console.log("Generating response for prompt:", prompt);
      const response = await model.generateResponse(prompt);
      console.log("Received response:", response);
      return response;
    }, []);

    console.log("ConditionalChain execution complete");
    // Return the chatbot's response (it's in an array, so we get the first item)
    return result[0];
  } catch (error) {
    // If something goes wrong, let's make sure we know about it
    console.error("Error in ConditionalChain execution:", error);
    throw error;
  }
}

// This function tests our chatbot with different messages
// It's like a quality check for our chatbot recipe
async function testChatbot() {
  console.log("Testing Customer Support Chatbot");
  console.log("--------------------------------");

  // List of test messages to try
  const testMessages = [
    "I have a question about my bill",
    "My account is not working",
    "What are your business hours?"
  ];

  // Let's try each test message
  for (const message of testMessages) {
    console.log(`User: ${message}`);
    try {
      // Get the chatbot's response
      const response = await runCustomerSupportChatbot(message);
      console.log(`Chatbot: ${response}`);
    } catch (error) {
      // If something goes wrong, let's log the error
      console.error(`Error processing message: ${error.message}`);
    }
    console.log("--------------------------------");
  }
}

// Run our test function
// This is like starting up our chatbot and seeing how it does!
testChatbot().catch(console.error);

// Remember, in a real application, you'd want to handle errors more gracefully
// and set up a way for users to interact with the chatbot directly!