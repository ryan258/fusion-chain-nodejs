// examples/extendedCharacterConversationWithLogging.js

// 📚 Let's bring in all the tools we need for our super story machine!
const MinimalChainable = require('../src/chain/MinimalChainable');  // Our storytelling helper
const OllamaProvider = require('../src/llm-providers/OllamaProvider');  // Our AI friend
const readline = require('readline');  // Helps us talk to the person using our program
const Logger = require('../src/utils/logger');  // Our new friend who writes down everything in a diary
const path = require('path');  // Helps us find where to save our diary

// 🎤 Setting up our way to talk to the person using our program
const rl = readline.createInterface({
  input: process.stdin,   // Our ear for listening
  output: process.stdout  // Our mouth for talking
});

// 📔 Let's create our special diary to write down all our crazy conversations
const logger = new Logger(path.join(__dirname, 'logs'));  // We're telling our diary where to save things

async function generateExtendedCharacterConversation() {
  // 👋 Say hello and explain what our amazing program does!
  console.log("🎭✨ Welcome to the Extended Character Conversation Generator with a Magic Diary!");
  logger.log("Started our magical conversation generator!", "INFO");  // 📝 Writing in our diary that we've started

  // 🤖 Create our AI friend to help us tell stories
  const ollama = new OllamaProvider('llama3.1:latest');

  // 🎬 Set up our characters and their exciting scenario
  const context = {
    character1: "Sherlock Holmes",
    character2: "Captain Jack Sparrow",
    scenario: "solving a mystery on a pirate ship"
  };

  // 📜 Our first set of questions for our AI storyteller
  let prompts = [
    "Introduce {{character1}} and {{character2}} in the scenario of {{scenario}}. Start with '{{character1}} found himself...'",
    "{{character1}} speaks first, addressing the situation. What does he say?",
    "{{character2}} responds to {{character1}}'s statement. What's his reply?",
    "{{character1}} makes a deduction about the mystery. What does he deduce?",
    "{{character2}} reacts to the deduction with surprise. How does he express this?"
  ];

  // 📖 This is where we'll keep all the parts of our growing story
  let conversationHistory = [];

  try {
    // 🔁 Our story loop - it keeps going until we say stop!
    while (true) {
      // 🚀 Ask our AI friend to continue the story
      const [outputs, askedPrompts] = await MinimalChainable.run(context, ollama, async (model, prompt) => {
        console.log("🤔 Our AI is thinking about:", prompt);
        logger.log(`AI is pondering: ${prompt}`, "INFO");  // 📝 Writing down what we asked the AI
        const response = await model.generateResponse(prompt);
        console.log("💡 Our AI came up with:", response);
        logger.log(`AI responded: ${response}`, "INFO");  // 📝 Writing down what the AI said
        return response;
      }, prompts);

      // 📚 Add the new story parts to our big storybook
      conversationHistory = conversationHistory.concat(outputs);

      // 📖 Show the new part of the story
      console.log("\n🎭 New Part of Our Incredible Story:\n");
      outputs.forEach((output, index) => {
        const partNumber = conversationHistory.length - outputs.length + index + 1;
        console.log(`Part ${partNumber}:`);
        console.log(output);
        console.log();
        logger.log(`Story Part ${partNumber}: ${output}`, "INFO");  // 📝 Writing each part of the story in our diary
      });

      // 🙋 Ask if we should keep the story going
      const answer = await new Promise(resolve => {
        rl.question("Shall we continue our adventure? (yes/no): ", resolve);
      });

      // 🛑 If they say anything other than 'yes', we wrap up our story
      if (answer.toLowerCase() !== 'yes') {
        break;
      }

      // ✨ New questions for our AI friend to make the story even more exciting
      prompts = [
        `{{character1}} discovers a new clue. What does he find?`,
        `{{character2}} offers an unusual idea. What does he suggest?`,
        `{{character1}} and {{character2}} disagree about what to do next. How do they argue?`
      ];

      // 🧠 Remember the last thing that happened in our story
      context.lastResponse = outputs[outputs.length - 1];
    }

    // 📝 Create a fancy report of our whole amazing story
    const report = MinimalChainable.toDelimTextFile("Our Incredible Character Adventure", conversationHistory);
    console.log("📄 Here's Our Complete Magical Story:\n");
    console.log(report);
    logger.log("Finished generating our magical story!", "INFO");  // 📝 Writing in our diary that we've finished

  } catch (error) {
    // 😢 If something goes wrong, we tell everyone and write it in our diary
    console.error("Oh no! Our story machine had a hiccup:", error);
    logger.log(`Error in story generation: ${error.message}`, "ERROR");
  } finally {
    // 🎬 We're done, so we close our question-asking tool and our diary
    rl.close();
    logger.close();  // 📘 Closing our magical diary
  }
}

// 🎉 Start up our amazing story machine!
generateExtendedCharacterConversation();