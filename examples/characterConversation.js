// examples/characterConversation.js

const MinimalChainable = require('../src/chain/MinimalChainable');
const OllamaProvider = require('../src/llm-providers/OllamaProvider');
const readline = require('readline');

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function generateExtendedCharacterConversation() {
  console.log("🎭✨ Welcome to the Extended Character Conversation Generator!");

  // 🤖 Create our AI friend
  const ollama = new OllamaProvider('llama3.1:latest');

  // 🎬 Set up our characters and scenario
  const context = {
    character1: "Sherlock Holmes",
    character2: "Captain Jack Sparrow",
    scenario: "solving a mystery on a pirate ship"
  };

  // 📜 Create our initial conversation prompts
  let prompts = [
    "Introduce {{character1}} and {{character2}} in the scenario of {{scenario}}. Start with '{{character1}} found himself...'",
    "{{character1}} speaks first, addressing the situation. What does he say?",
    "{{character2}} responds to {{character1}}'s statement. What's his reply?",
    "{{character1}} makes a deduction about the mystery. What does he deduce?",
    "{{character2}} reacts to the deduction with surprise. How does he express this?"
  ];

  let conversationHistory = [];

  try {
    while (true) {
      // 🚀 Let's run our conversation generator!
      const [outputs, askedPrompts] = await MinimalChainable.run(context, ollama, async (model, prompt) => {
        console.log("🤔 Thinking about:", prompt);
        const response = await model.generateResponse(prompt);
        console.log("💡 Generated:", response);
        return response;
      }, prompts);

      // Add new outputs to our conversation history
      conversationHistory = conversationHistory.concat(outputs);

      // 📖 Let's see the new part of the conversation
      console.log("\n🎭 New Conversation Part:\n");
      outputs.forEach((output, index) => {
        console.log(`Round ${conversationHistory.length - outputs.length + index + 1}:`);
        console.log(output);
        console.log();
      });

      // Ask the user if they want to continue the conversation
      const answer = await new Promise(resolve => {
        rl.question("Do you want to continue the conversation? (yes/no): ", resolve);
      });

      if (answer.toLowerCase() !== 'yes') {
        break;
      }

      // If continuing, add new prompts for the next part of the conversation
      prompts = [
        `{{character1}} discovers a new clue. What does he find?`,
        `{{character2}} offers an unconventional solution. What does he suggest?`,
        `{{character1}} and {{character2}} argue about the best course of action. Describe their debate.`
      ];

      // Update context with the last response for continuity
      context.lastResponse = outputs[outputs.length - 1];
    }

    // 📝 Let's create a neat report of our entire conversation
    const report = MinimalChainable.toDelimTextFile("Extended Character Conversation", conversationHistory);
    console.log("📄 Final Conversation Report:\n");
    console.log(report);

  } catch (error) {
    console.error("😢 Oh no! Something went wrong:", error);
  } finally {
    rl.close();
  }
}

// 🎬 Action! Let's run our extended character conversation generator
generateExtendedCharacterConversation();