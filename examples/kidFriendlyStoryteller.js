// examples/kidFriendlyStoryteller.js

// 🧙‍♂️ This is our magical AI Storyteller! It helps us create fun stories!

// First, let's bring in some helper tools
const FusionChain = require('../src/chain/FusionChain');
const RecursiveChain = require('../src/chain/RecursiveChain');
const ConditionalChain = require('../src/chain/ConditionalChain');
const PipelineChain = require('../src/chain/PipelineChain');
const OllamaProvider = require('../src/llm-providers/OllamaProvider');

class KidFriendlyStoryteller {
  constructor() {
    // 🤖 This is our AI brain that helps us tell stories
    this.aiBrain = new OllamaProvider('llama3.1:latest');

    // 🏗️ Let's set up the different parts of our story machine
    this.storyStarter = this.setupStoryStarter();
    this.characterMaker = this.setupCharacterMaker();
    this.storyTeller = this.setupStoryTeller();
    this.storyChecker = this.setupStoryChecker();
  }

  setupStoryStarter() {
    // 🚀 This part comes up with cool story ideas
    return new FusionChain();
    // We'll add more fun stuff here later!
  }

  setupCharacterMaker() {
    // 👥 This part creates awesome characters for our story
    return new RecursiveChain();
  }

  async safeAIResponse(prompt, defaultResponse) {
    // 🛡️ This function helps us get answers from our AI friend, even if it gets confused
    try {
      const response = await this.aiBrain.generateResponse(prompt);
      return response || defaultResponse;
    } catch (error) {
      console.error('Oops! Our AI had a little hiccup:', error.message);
      return defaultResponse;
    }
  }

  setupStoryTeller() {
    // 📚 This is the main part that tells our story
    return new PipelineChain()
      .addStep(async (storyIdea) => {
        // 1️⃣ First, we start our story
        console.log('📖 Once upon a time...', storyIdea);
        return storyIdea;
      })
      .addStep(async (storyIdea) => {
        // 2️⃣ Then, we create our characters
        const characterPrompt = `Create two characters for a story about ${storyIdea}. Return them as a comma-separated list.`;
        const characters = await this.safeAIResponse(
          characterPrompt,
          'Sir Brave-a-lot, Draggles the Shy Dragon'
        );
        console.log('👥 Our brave heroes are:', characters);
        return { storyIdea, characters };
      })
      .addStep(async (story) => {
        // 3️⃣ Now, we tell the middle of our story
        const middlePrompt = `Continue the story about ${story.storyIdea} with characters ${story.characters}. What amazing thing happened?`;
        const middleEvent = await this.safeAIResponse(
          middlePrompt,
          'They found a magical map that led them to a cave full of friendly dragons!'
        );
        console.log('🌟 And then something amazing happened!', middleEvent);
        return story;
      })
      .addStep(async (story) => {
        // 4️⃣ Finally, we end our story
        const endingPrompt = `Conclude the story about ${story.storyIdea} with characters ${story.characters}. How did it end?`;
        const ending = await this.safeAIResponse(
          endingPrompt,
          'They all became best friends and lived happily ever after, teaching others not to be afraid of dragons.'
        );
        console.log('🎉 And they all lived happily ever after!', ending);
        return story;
      });
  }

  setupStoryChecker() {
    // 🧐 This part makes sure our story makes sense
    return new ConditionalChain();
    // We'll add more smart checks here later!
  }

  async tellStory(storyIdea) {
    // 🎭 This is where the magic happens! We tell our story from start to finish
    console.log('🧙‍♂️ Let me tell you a wonderful story!');
    const storyResult = await this.storyTeller.run(storyIdea);
    console.log('📚 The end! I hope you enjoyed our tale!');
    return storyResult;
  }
}

// 🚀 Let's use our storyteller to create a fun story!
async function createMagicalStory() {
  const storyteller = new KidFriendlyStoryteller();
  const storyIdea = "a brave knight who's afraid of dragons";
  await storyteller.tellStory(storyIdea);
}

// 🎬 Lights, camera, action! Let's tell our story!
if (require.main === module) {
  createMagicalStory().catch(console.error);
}

// 📦 We're packing up our storyteller so others can use it too!
module.exports = KidFriendlyStoryteller;
