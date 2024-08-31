// examples/kidFriendlyStoryteller.js

// 🧙‍♂️ This is our magical AI Storyteller! It helps us create fun stories!

// First, let's bring in some helper tools
const FusionChain = require('../src/chain/FusionChain');
const PipelineChain = require('../src/chain/PipelineChain');
const OllamaProvider = require('../src/llm-providers/OllamaProvider');

class KidFriendlyStoryteller {
  constructor() {
    // 🤖 This is our AI brain that helps us tell stories
    this.aiBrain = new OllamaProvider('llama2');

    // 🏗️ Let's set up the different parts of our story machine
    this.storyTeller = this.setupStoryTeller();
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
      .addStep(async () => {
        // 1️⃣ First, we come up with a story idea
        const storyIdea = await this.safeAIResponse(
          "Generate a creative story idea for a children's tale. Keep it brief and exciting!",
          "A young wizard discovers a hidden door in their school that leads to a world where magic doesn't work!"
        );
        console.log('🚀 Our exciting story idea:', storyIdea);
        return { storyIdea };
      })
      .addStep(async (context) => {
        // 2️⃣ Then, we create our characters
        const characters = await this.safeAIResponse(
          `Create two unique characters for this story: ${context.storyIdea}. Give them names and brief descriptions.`,
          `1. Zoe Sparkle: A curious 10-year-old with wild curly hair and a backpack full of gadgets.
           2. Mr. Whiskers: A talking cat with a monocle who knows all the secrets of the magic school.`
        );
        console.log('👥 Our brave heroes are:', characters);
        return { ...context, characters };
      })
      .addStep(async (story) => {
        // 3️⃣ Now, we tell the middle of our story
        const middleEvent = await this.safeAIResponse(
          `Continue the story about ${story.storyIdea} with these characters: ${story.characters}. What amazing thing happened?`,
          'They found a magical map that led them to a cave full of friendly dragons!'
        );
        console.log('🌟 And then something amazing happened!', middleEvent);
        return { ...story, middleEvent };
      })
      .addStep(async (story) => {
        // 4️⃣ Finally, we end our story
        const ending = await this.safeAIResponse(
          `Conclude the story about ${story.storyIdea} with characters ${story.characters}. How did it end?`,
          'They all became best friends and lived happily ever after, teaching others not to be afraid of the unknown.'
        );
        console.log('🎉 And they all lived happily ever after!', ending);
        return { ...story, ending };
      });
  }

  async tellStory() {
    // 🎭 This is where the magic happens! We tell our story from start to finish
    console.log('🧙‍♂️ Let me tell you a wonderful story!');
    const storyContext = await this.storyTeller.run({});
    console.log('📚 The end! I hope you enjoyed our tale!');
    return storyContext;
  }
}

// 🚀 Let's use our storyteller to create a fun story!
async function createMagicalStory() {
  const storyteller = new KidFriendlyStoryteller();
  await storyteller.tellStory();
}

// 🎬 Lights, camera, action! Let's tell our story!
if (require.main === module) {
  createMagicalStory().catch(console.error);
}

// 📦 We're packing up our storyteller so others can use it too!
module.exports = KidFriendlyStoryteller;
