// examples/fusion-chain-example.js

// First, we need to load our secret information. It's like getting the secret ingredients for a recipe!
require('dotenv').config();

// Now, we're inviting our robot friends to help us. Think of these as different smart robots we can talk to.
const OllamaProvider = require('../src/llm-providers/OllamaProvider');
const OpenAIProvider = require('../src/llm-providers/OpenAIProvider');

// This is like the rule book for our robot game. It tells our robots how to work together.
const FusionChain = require('../src/chain/FusionChain');

// This helper will write down our conversation in a neat way. It's like having a friend take notes for us.
const { logConversation } = require('../src/utils/conversationLogger');

// This is our main function. It's like the main event of our robot game!
async function runFusionChainExample() {
  // We're announcing the start of our game!
  console.log("🚀 Starting our Fusion Chain example!");

  // We're creating our robot friends. We use our secret ingredients to make them.
  // It's like giving each robot a special name tag.
  const ollama = new OllamaProvider(process.env.OLLAMA_MODEL_NAME || 'llama3.1:latest');
  const openai = new OpenAIProvider(process.env.OPENAI_API_KEY, process.env.OPENAI_MODEL_NAME || 'gpt-4o-mini');

  // These are the questions we want to ask our robot friends.
  // It's like writing down our questions on a piece of paper.
  const prompts = [
    "What's the capital of France?",
    "Considering the previous answer, what's a fun fact about this city?"
  ];

  // This function helps us decide which answer is the best.
  // It's like being a judge in a contest!
  const evaluator = (responses) => {
    // We're giving points to each answer based on how good it is.
    // It's like scoring a game!
    const scores = responses.map(response => {
      let score = 0;
      if (response.toLowerCase().includes('paris')) score += 2;  // Extra points for mentioning Paris!
      if (response.toLowerCase().includes('france')) score += 1;  // A point for mentioning France
      if (response.toLowerCase().includes('eiffel tower')) score += 1;  // A point for the Eiffel Tower
      if (response.toLowerCase().includes('louvre')) score += 1;  // A point for the Louvre
      if (response.length > 50 && response.length < 500) score += 1;  // A point for being just the right length
      return score;
    });
    
    // We find the highest score and the best answer.
    // It's like finding the winner of our game!
    const maxScore = Math.max(...scores);
    const bestResponse = responses[scores.indexOf(maxScore)];
    
    // We return the best answer and how well each robot friend did.
    return [bestResponse, scores.map(score => score / maxScore)];
  };

  // We use a try-catch block to handle any errors that might occur.
  // It's like having a safety net in case something goes wrong in our game.
  try {
    // We're telling everyone what questions we're going to ask.
    console.log("🤖 Asking our robot friends:", prompts);

    // Now, we're starting our game with our robot friends!
    const result = await FusionChain.run(
      {}, // This is like giving our robots a blank notebook to start with.
      [ollama, openai], // These are our robot friends joining the game.
      async (model, prompt, context) => {
        // This is how we ask each robot friend a question.
        try {
          // If our robots have answered questions before, we remind them of those answers.
          // It's like saying "Remember, you said this earlier" before asking a new question.
          const fullPrompt = context.previousAnswers && context.previousAnswers.length > 0
            ? `Previous answers: ${context.previousAnswers.join(' ')}. Now answer: ${prompt}`
            : prompt;

          // Now we ask our robot friend the question and wait for the answer.
          return await model.generateResponse(fullPrompt);
        } catch (error) {
          // If something goes wrong, we tell everyone about it.
          // It's like saying "Oops! This robot friend couldn't answer."
          console.error(`Error with ${model.constructor.name}: ${error.message}`);
          return "Sorry, I couldn't answer that.";
        }
      },
      prompts, // These are our questions.
      evaluator // This is our judge function.
    );

    // We're writing down what everyone said in our conversation.
    // It's like keeping a record of our game.
    prompts.forEach((prompt, i) => {
      logConversation(i*2+1, "Human", prompt);
      result.allPromptResponses.forEach((responses, j) => {
        logConversation(i*2+2, `AI ${j+1}`, responses[i]);
      });
    });

    // We're announcing the best answer and how well everyone did!
    // It's like declaring the winner of our game.
    console.log("✨ Our robot friends' best answer:", result.topResponse);
    console.log("📊 How well each robot friend did:", result.performanceScores);
  } catch (error) {
    // If something goes really wrong, we let everyone know.
    // It's like stopping the game if there's a big problem.
    console.error("😢 Oh no! Something went wrong:", error);
  }

  // We're announcing that our game is over!
  console.log("🎉 All done with our Fusion Chain example!");
}

// This line starts our whole game!
// It's like pressing the "Start" button on a video game.
runFusionChainExample();