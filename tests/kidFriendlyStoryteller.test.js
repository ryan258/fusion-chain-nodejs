// tests/kidFriendlyStoryteller.test.js

// 🧪 This is our test lab where we make sure our storyteller works perfectly!

// First, let's bring in our storyteller and some helper tools
const KidFriendlyStoryteller = require('../examples/kidFriendlyStoryteller');
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
      .mockResolvedValueOnce('A young wizard discovers a hidden door in their school')
      .mockResolvedValueOnce(
        '1. Zoe Sparkle: A curious 10-year-old with wild curly hair. 2. Mr. Whiskers: A talking cat with a monocle.'
      )
      .mockResolvedValueOnce('They found a magical map!')
      .mockResolvedValueOnce('They all became best friends and lived happily ever after.');
  });

  // 🧱 Let's check if our storyteller has all its parts
  test('should have all the story parts ready', () => {
    // 🔍 We're checking each part of our story machine
    expect(storyteller.storyTeller).toBeInstanceOf(PipelineChain);
  });

  // 📖 Let's see if our storyteller can tell a story
  test('should tell a complete story', async () => {
    // 👂 We're going to listen to what our storyteller says
    console.log = jest.fn();

    // 📚 Now, let's ask our storyteller to tell the story
    await storyteller.tellStory();

    // 🧐 Let's check if our storyteller said all the right things
    expect(console.log).toHaveBeenNthCalledWith(1, '🧙‍♂️ Let me tell you a wonderful story!');
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      '🚀 Our exciting story idea:',
      'A young wizard discovers a hidden door in their school'
    );
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      '👥 Our brave heroes are:',
      '1. Zoe Sparkle: A curious 10-year-old with wild curly hair. 2. Mr. Whiskers: A talking cat with a monocle.'
    );
    expect(console.log).toHaveBeenNthCalledWith(
      4,
      '🌟 And then something amazing happened!',
      'They found a magical map!'
    );
    expect(console.log).toHaveBeenNthCalledWith(
      5,
      '🎉 And they all lived happily ever after!',
      'They all became best friends and lived happily ever after.'
    );
    expect(console.log).toHaveBeenNthCalledWith(6, '📚 The end! I hope you enjoyed our tale!');
  });

  // 🛠️ Let's check if our storyteller can handle AI errors
  test('should use default responses when AI fails', async () => {
    // 🤖 Let's make our AI have some problems
    storyteller.aiBrain.generateResponse = jest.fn().mockRejectedValue(new Error('AI is tired'));

    // 👂 We're going to listen to what our storyteller says
    console.log = jest.fn();

    // 📚 Now, let's ask our storyteller to tell a story
    await storyteller.tellStory();

    // 🧐 Let's check if our storyteller used the default responses
    expect(console.log).toHaveBeenNthCalledWith(1, '🧙‍♂️ Let me tell you a wonderful story!');
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      '🚀 Our exciting story idea:',
      "A young wizard discovers a hidden door in their school that leads to a world where magic doesn't work!"
    );
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      '👥 Our brave heroes are:',
      expect.stringContaining('Zoe Sparkle')
    );
    expect(console.log).toHaveBeenNthCalledWith(
      4,
      '🌟 And then something amazing happened!',
      expect.stringContaining('magical map')
    );
    expect(console.log).toHaveBeenNthCalledWith(
      5,
      '🎉 And they all lived happily ever after!',
      expect.stringContaining('best friends')
    );
    expect(console.log).toHaveBeenNthCalledWith(6, '📚 The end! I hope you enjoyed our tale!');
  });
});
