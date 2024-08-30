// examples/characterConversationWithLogger.js

// 📚 Let's bring in all the tools we need for our super story machine!
const MinimalChainable = require('../src/chain/MinimalChainable');  // Our storytelling helper
const OllamaProvider = require('../src/llm-providers/OllamaProvider');  // Our AI friend
const readline = require('readline');  // Helps us talk to the person using our program
const fs = require('fs');  // This is like a pencil for writing in our log book
const path = require('path');  // This helps us find where to put our log book

// 📝 Let's create our special log book (we call it a logger)
class StoryLogger {
  constructor(logFileName) {
    // 📓 This is like opening a new notebook for our story
    this.logFile = path.join(__dirname, logFileName);
  }

  // ✏️ This is how we write in our log book
  log(message) {
    // 🕒 Let's add a timestamp (like writing the date in a diary)
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    // 📜 Now we're actually writing in our log book
    fs.appendFileSync(this.logFile, logMessage, 'utf8');

    // 🖨️ Let's also print it on the screen so we can see it
    console.log(message);
  }
}

// 🎤 Setting up our way to talk to the person using the program
const rl = readline.createInterface({
  input: process.stdin,   // 👂 This is like our ear, listening for what people type
  output: process.stdout  // 🗣️ This is like our mouth, speaking back to people
});

// 🌟 This is our main function that creates the character conversation
async function generateCharacterConversationWithLogging() {
  // 📘 Let's create our special log book
  const logger = new StoryLogger('crazy-convos.log');

  // 👋 Say hello and explain what our program does
  logger.log("🎭✨ Welcome to the Character Conversation Generator with Logging!");

  // 🤖 Create our AI friend who will help us tell stories
  const ollama = new OllamaProvider('llama2');

  // 🎬 Set up our characters and where they are
  const context = {
    character1: "Sherlock Holmes",
    character2: "Captain Jack Sparrow",
    scenario: "solving a mystery on a pirate ship"
  };

  // 📜 These are the questions we'll ask our AI friend to start the story
  let prompts = [
    "Introduce {{character1}} and {{character2}} in the scenario of {{scenario}}. Start with '{{character1}} found himself...'",
    "{{character1}} speaks first, addressing the situation. What does he say?",
    "{{character2}} responds to {{character1}}'s statement. What's his reply?",
    "{{character1}} makes a deduction about the mystery. What does he deduce?",
    "{{character2}} reacts to the deduction with surprise. How does he express this?"
  ];

  // 📚 This is where we'll keep all parts of our story
  let conversationHistory = [];

  try {
    // 🔁 This loop keeps our story going until we decide to stop
    while (true) {
      // 🚀 Let's ask our AI friend to continue the story!
      const [outputs, askedPrompts] = await MinimalChainable.run(context, ollama, async (model, prompt) => {
        logger.log("🤔 Our AI is thinking about: " + prompt);
        const response = await model.generateResponse(prompt);
        logger.log("💡 Our AI came up with: " + response);
        return response;
      }, prompts);

      // 📚 Add the new part of the story to our big storybook
      conversationHistory = conversationHistory.concat(outputs);

      // 📖 Show the new part of the story we just made
      logger.log("\n🎭 New Part of Our Story:\n");
      outputs.forEach((output, index) => {
        logger.log(`Part ${conversationHistory.length - outputs.length + index + 1}:`);
        logger.log(output);
        logger.log("");
      });

      // 🙋 Ask if people want to keep the story going
      const answer = await new Promise(resolve => {
        rl.question("Do you want to continue the story? (yes/no): ", resolve);
      });

      // 🛑 If they say anything other than 'yes', we stop the story
      if (answer.toLowerCase() !== 'yes') {
        break;
      }

      // ✨ If we're continuing, we come up with new questions for our AI friend
      prompts = [
        `{{character1}} discovers a new clue. What does he find?`,
        `{{character2}} offers an unusual idea. What does he suggest?`,
        `{{character1}} and {{character2}} disagree about what to do next. How do they argue?`
      ];

      // 🧠 Remember the last thing that happened in our story
      context.lastResponse = outputs[outputs.length - 1];
    }

    // 📝 Now that our story is done, let's make a nice report of the whole thing
    const report = MinimalChainable.toDelimTextFile("Our Amazing Character Story", conversationHistory);
    logger.log("📄 Here's Our Whole Story:\n");
    logger.log(report);

  } catch (error) {
    // 😢 If something goes wrong, we tell people about it
    logger.log("😢 Oh no! Our story machine had a problem: " + error.message);
  } finally {
    // 🎬 We're done, so we close our question-asking tool
    rl.close();
  }

  // 📢 Let's tell everyone where they can find our story log
  console.log(`\n📘 You can find the full story log in: ${path.resolve(__dirname, 'crazy-convos.log')}`);
}

// 🎉 Let's start our story machine!
generateCharacterConversationWithLogging();