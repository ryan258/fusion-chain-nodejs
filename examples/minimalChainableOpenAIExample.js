// examples/minimalChainableOpenAIExample.js

// 📚 Import our cool tools
const MinimalChainable = require('../src/chain/MinimalChainable');
const OpenAIProvider = require('../src/llm-providers/OpenAIProvider');
const Logger = require('../src/utils/logger');
const path = require('path');
require('dotenv').config();

// 🚀 Our main function that runs the example
async function runMinimalChainableOpenAIExample() {
  // 📝 Create our magic diary (logger)
  const logger = new Logger(path.join(__dirname, 'logs'));
  logger.log('🎬 Starting MinimalChainable OpenAI Example', 'INFO');

  // 🤖 Create our AI friend (OpenAI)
  const openai = new OpenAIProvider(
    process.env.OPENAI_API_KEY,
    process.env.OPENAI_MODEL_NAME || 'gpt-4o-mini'
  );

  // 🧠 Set up our initial context (like giving our AI some background info)
  const initialContext = {
    topic: 'existential crisis of artificial intelligence',
    tone: 'mysteriously suspenseful',
    conversation: [], // 🗨️ This will store our ongoing conversation
  };

  // 📜 Prepare our questions for the AI
  const prompts = [
    'Write a brief introduction about {{topic}} in a {{tone}} tone.',
    'Based on the previous response, suggest 3 fascinating areas of {{topic}} to explore further.',
    'Considering all previous responses, speculate on one potential future breakthrough in {{topic}}.',
  ];

  // 📊 Log our initial setup
  logger.log(`🧠 Initial context: ${JSON.stringify(initialContext)}`, 'DEBUG');
  logger.log(`📜 Prompts: ${JSON.stringify(prompts)}`, 'DEBUG');

  try {
    // 🏃‍♂️ Run our MinimalChainable
    logger.log('🤖 Asking our AI friend some questions...', 'INFO');
    const [outputs, filledPrompts] = await MinimalChainable.run(
      initialContext,
      openai,
      async (model, prompt, context) => {
        // 📝 Log the current state of the context
        logger.log(`🧠 Current context: ${JSON.stringify(context)}`, 'DEBUG');

        // 🔍 Send prompt to OpenAI
        logger.log(`🔍 Sending prompt to OpenAI: ${prompt}`, 'DEBUG');
        const response = await model.generateResponse(prompt);
        logger.log(`✅ Received response from OpenAI: ${response}`, 'DEBUG');

        return response;
      },
      prompts
    );

    // 📊 Display and log our results
    console.log('\n🌟 Here are the results of our space exploration journey:\n');
    outputs.forEach((output, index) => {
      console.log(`Question ${index + 1}: ${filledPrompts[index]}`);
      console.log(`Answer: ${output}\n`);

      // 🗄️ Log each Q&A pair
      logger.log(`Question ${index + 1}: ${filledPrompts[index]}`, 'INFO');
      logger.log(`Answer ${index + 1}: ${output}`, 'INFO');
    });

    // 📄 Create a nice report
    const report = MinimalChainable.toDelimTextFile('AI Suspense Journey', outputs);
    console.log("📑 Here's our full report:\n");
    console.log(report);

    // 🗄️ Log our report
    logger.log('📑 Generated Report:', 'INFO');
    logger.log(report, 'INFO');

    // 🔍 Log final context
    logger.log(`🧠 Final context: ${JSON.stringify(initialContext)}`, 'DEBUG');

    // 🗄️ Log our success
    logger.log('✨ MinimalChainable OpenAI Example completed successfully', 'INFO');
  } catch (error) {
    // 🚨 Uh-oh, something went wrong!
    console.error('😢 Oops! We hit a space rock:', error);
    logger.log(`Error in MinimalChainable OpenAI Example: ${error.message}`, 'ERROR');
    logger.log(`Error stack: ${error.stack}`, 'ERROR');
  } finally {
    // 🎬 Close our magic diary
    logger.close();
  }
}

// 🏁 Start our space exploration journey!
runMinimalChainableOpenAIExample().catch(console.error);
