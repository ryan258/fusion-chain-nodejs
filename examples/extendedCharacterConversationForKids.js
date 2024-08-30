// examples/extendedCharacterConversationForKids.js

// 📚 First, we're bringing in the tools we need for our story machine
const MinimalChainable = require('../src/chain/MinimalChainable');  // This is our storytelling helper
const OllamaProvider = require('../src/llm-providers/OllamaProvider');  // This is our AI friend
const readline = require('readline');  // This helps us talk to the person using our program

// 🎤 We're setting up a way to ask questions and get answers from the person using our program
// It's like setting up a microphone and speaker
const rl = readline.createInterface({
  input: process.stdin,   // This is like our ear, listening for what people type
  output: process.stdout  // This is like our mouth, speaking back to people
});

// 🎭 This is our main function that creates the character conversation
async function generateExtendedCharacterConversation() {
  // 👋 Let's say hello and explain what our program does
  console.log("🎭✨ Welcome to the Extended Character Conversation Generator!");

  // 🤖 We're creating our AI friend who will help us tell stories
  const ollama = new OllamaProvider('llama3.1:latest');

  // 🎬 We're setting up our characters and where they are
  // It's like choosing actors and a stage for our play
  const context = {
    character1: "Scooby Doo",  // Our first character
    character2: "Captain Jack Sparrow",  // Our second character
    scenario: "solving the mystery of who stole the cookies from the cookie jar?"  // Where our story takes place
  };

  // 📜 These are the first questions we'll ask our AI friend to start the story
  let prompts = [
    "Introduce {{character1}} and {{character2}} in the scenario of {{scenario}}. Start with '{{character1}} found himself...'",
    "{{character1}} speaks first, addressing the situation. What does he say?",
    "{{character2}} responds to {{character1}}'s statement. What's his reply?",
    "{{character1}} makes a deduction about the mystery. What does he deduce?",
    "{{character2}} reacts to the deduction with surprise. How does he express this?"
  ];

  // 📖 This is where we'll keep all the parts of our story as we make it
  let conversationHistory = [];

  try {
    // 🔁 This loop keeps our story going until we decide to stop
    while (true) {
      // 🚀 Let's ask our AI friend to continue the story!
      const [outputs, askedPrompts] = await MinimalChainable.run(context, ollama, async (model, prompt) => {
        console.log("🤔 Our AI is thinking about:", prompt);  // We tell people what question we're asking the AI
        const response = await model.generateResponse(prompt);  // We wait for the AI to answer
        console.log("💡 Our AI came up with:", response);  // We show what the AI said
        return response;  // We keep the AI's answer to use in our story
      }, prompts);

      // 📚 We add the new part of the story to our big storybook
      conversationHistory = conversationHistory.concat(outputs);

      // 📖 Let's show people the new part of the story we just made
      console.log("\n🎭 New Part of Our Story:\n");
      outputs.forEach((output, index) => {
        console.log(`Part ${conversationHistory.length - outputs.length + index + 1}:`);
        console.log(output);
        console.log();
      });

      // 🙋 We ask if people want to keep the story going
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

      // 🧠 We remember the last thing that happened in our story
      context.lastResponse = outputs[outputs.length - 1];
    }

    // 📝 Now that our story is done, let's make a nice report of the whole thing
    const report = MinimalChainable.toDelimTextFile("Our Amazing Character Story", conversationHistory);
    console.log("📄 Here's Our Whole Story:\n");
    console.log(report);

  } catch (error) {
    // 😢 If something goes wrong, we tell people about it
    console.error("Oh no! Our story machine had a problem:", error);
  } finally {
    // 🎬 We're done, so we close our question-asking tool
    rl.close();
  }
}

// 🎉 Let's start our story machine!
generateExtendedCharacterConversation();