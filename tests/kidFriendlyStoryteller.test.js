// tests/kidFriendlyStoryteller.test.js

// 🧪 This is our test lab where we make sure our storyteller works perfectly!

// First, let's bring in our storyteller and some helper tools
const KidFriendlyStoryteller = require('../examples/kidFriendlyStoryteller');
const FusionChain = require('../src/chain/FusionChain');
const RecursiveChain = require('../src/chain/RecursiveChain');
const ConditionalChain = require('../src/chain/ConditionalChain');
const PipelineChain = require('../src/chain/PipelineChain');

// 🃏 We're going to pretend to be the AI for our tests
jest.mock('../src/llm-providers/OllamaProvider');

// 🧰 This is our toolbox of tests for the storyteller
describe('KidFriendlyStoryteller', () => {
  // 🧙‍♂️ This is the storyteller we're going to test
  let storyteller;

  // 🏗️ Before each test, we create a fresh storyteller
  beforeEach(() => {
    storyteller = new KidFriendlyStoryteller();
    // Let's pretend our AI can respond to our questions
    storyteller.aiBrain.generateResponse = jest
      .fn()
      .mockResolvedValueOnce('Sir Shakes-a-lot, Draggles the Friendly Dragon')
      .mockResolvedValueOnce('They found a treasure map!')
      .mockResolvedValueOnce('They became best friends and opened a knight-dragon cafe.');
  });

  // 🧱 Let's check if our storyteller has all its parts
  test('should have all the story parts ready', () => {
    // 🔍 We're checking each part of our story machine
    expect(storyteller.storyStarter).toBeInstanceOf(FusionChain);
    expect(storyteller.characterMaker).toBeInstanceOf(RecursiveChain);
    expect(storyteller.storyTeller).toBeInstanceOf(PipelineChain);
    expect(storyteller.storyChecker).toBeInstanceOf(ConditionalChain);
  });

  // 📖 Let's see if our storyteller can tell a story
  test('should tell a complete story', async () => {
    // 👂 We're going to listen to what our storyteller says
    console.log = jest.fn();

    // 🎭 Let's give our storyteller an idea for a story
    const storyIdea = "a brave knight who's afraid of dragons";

    // 📚 Now, let's ask our storyteller to tell the story
    await storyteller.tellStory(storyIdea);

    // 🧐 Let's check if our storyteller said all the right things
    expect(console.log).toHaveBeenNthCalledWith(1, '🧙‍♂️ Let me tell you a wonderful story!');
    expect(console.log).toHaveBeenNthCalledWith(2, '📖 Once upon a time...', storyIdea);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      '👥 Our brave heroes are:',
      'Sir Shakes-a-lot, Draggles the Friendly Dragon'
    );
    expect(console.log).toHaveBeenNthCalledWith(
      4,
      '🌟 And then something amazing happened!',
      'They found a treasure map!'
    );
    expect(console.log).toHaveBeenNthCalledWith(
      5,
      '🎉 And they all lived happily ever after!',
      'They became best friends and opened a knight-dragon cafe.'
    );
    expect(console.log).toHaveBeenNthCalledWith(6, '📚 The end! I hope you enjoyed our tale!');
  });

  // 👥 Let's check if our storyteller can create characters
  test('should create characters for the story', async () => {
    // 📚 Let's tell a story and see what characters we get
    const storyResult = await storyteller.tellStory('a knight who makes friends with a dragon');

    // 🧐 Let's check if we got the characters we expected
    expect(storyResult.characters).toContain('Sir Shakes-a-lot');
    expect(storyResult.characters).toContain('Draggles the Friendly Dragon');
  });

  // 🛠️ Let's check if our storyteller can handle AI errors
  test('should use default responses when AI fails', async () => {
    // 🤖 Let's make our AI have some problems
    storyteller.aiBrain.generateResponse = jest.fn().mockRejectedValue(new Error('AI is tired'));

    // 👂 We're going to listen to what our storyteller says
    console.log = jest.fn();

    // 📚 Now, let's ask our storyteller to tell a story
    await storyteller.tellStory("a knight who's afraid of dragons");

    // 🧐 Let's check if our storyteller used the default responses
    expect(console.log).toHaveBeenNthCalledWith(1, '🧙‍♂️ Let me tell you a wonderful story!');
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      '📖 Once upon a time...',
      "a knight who's afraid of dragons"
    );
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      '👥 Our brave heroes are:',
      'Sir Brave-a-lot, Draggles the Shy Dragon'
    );
    expect(console.log).toHaveBeenNthCalledWith(
      4,
      '🌟 And then something amazing happened!',
      'They found a magical map that led them to a cave full of friendly dragons!'
    );
    expect(console.log).toHaveBeenNthCalledWith(
      5,
      '🎉 And they all lived happily ever after!',
      'They all became best friends and lived happily ever after, teaching others not to be afraid of dragons.'
    );
    expect(console.log).toHaveBeenNthCalledWith(6, '📚 The end! I hope you enjoyed our tale!');
  });
});
