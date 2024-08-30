// examples/simple-story-generator.js

const FusionChain = require('../src/chain/FusionChain');
const OllamaProvider = require('../src/llm-providers/OllamaProvider');
const { logConversation } = require('../src/utils/conversationLogger');

require('dotenv').config();

async function generateStory() {
  console.log("🚀 Starting our Simple Story Generator with Ollama!");

  const ollama = new OllamaProvider(process.env.MODEL_NAME || 'llama3.1:latest');

  const prompts = [
    "Generate a short story about a haunted AI. Start with 'Once upon a time...'",
    "Based on the previous story, add a twist ending in one or two sentences."
  ];

  const evaluator = (responses) => [responses[0], [1]];

  try {
    console.log("🤖 Asking Ollama to write a story...");
    const result = await FusionChain.run(
      { previousAnswers: [] }, // Initialize context with an empty previousAnswers array
      [ollama],
      async (model, prompt, context) => {
        console.log("🔍 Debug: Entering callable function");
        console.log("🔍 Debug: Context received:", JSON.stringify(context));
        
        try {
          let fullPrompt = prompt;
          if (context && Array.isArray(context.previousAnswers) && context.previousAnswers.length > 0) {
            const previousStory = context.previousAnswers.join(' ');
            fullPrompt = `Previous part of the story: ${previousStory}. Now, ${prompt}`;
          }
          
          console.log("📝 Sending prompt to Ollama:", fullPrompt);
          const response = await model.generateResponse(fullPrompt);
          console.log("✅ Received response from Ollama:", response);
          
          // Update context with the new answer
          if (context && Array.isArray(context.previousAnswers)) {
            context.previousAnswers.push(response);
          } else {
            console.warn("⚠️ Warning: context.previousAnswers is not an array");
          }
          
          return response;
        } catch (error) {
          console.error(`❌ Error in callable function: ${error.message}`);
          return "Sorry, I couldn't generate the story part.";
        }
      },
      prompts,
      evaluator
    );

    console.log("\n✨ Generated Story:");
    console.log(result.topResponse);

    prompts.forEach((prompt, i) => {
      logConversation(i*2+1, "Human", prompt);
      result.allPromptResponses.forEach((responses, j) => {
        logConversation(i*2+2, `AI ${j+1}`, responses[i]);
      });
    });

  } catch (error) {
    console.error("😢 Oh no! Something went wrong:", error);
  }

  console.log("\n🎉 Story generation complete!");
}

generateStory();