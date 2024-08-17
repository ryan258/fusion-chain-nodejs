// tests/conversationLogger.test.js

const { logConversation } = require('../src/utils/conversationLogger');

// Let's pretend we're playing a game where we test our conversationLogger!
describe('conversationLogger', () => {
  // Before each test, let's set up our playground
  beforeEach(() => {
    // We're going to pretend to be console.log
    console.log = jest.fn();
  });

  // Let's test if our logger can write a simple message
  it('should log a simple message correctly', () => {
    logConversation(1, "Human", "Hello, AI!");
    
    // We expect our logger to have said something like this:
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Turn 1: Human - Hello, AI!/)
    );
  });

  // Now let's see if it can handle a message with context
  it('should replace context variables in the message', () => {
    const context = { name: 'Alice' };
    logConversation(2, "AI", "Hello, {{name}}!", context);
    
    // We expect our logger to have replaced {{name}} with 'Alice'
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Turn 2: AI - Hello, Alice!/)
    );
  });

  // What if we have multiple context variables?
  it('should replace multiple context variables', () => {
    const context = { name: 'Bob', age: '30' };
    logConversation(3, "Human", "My name is {{name}} and I'm {{age}} years old.", context);
    
    // We expect our logger to have replaced both {{name}} and {{age}}
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Turn 3: Human - My name is Bob and I'm 30 years old./)
    );
  });

  // Let's make sure it doesn't change things it shouldn't
  it('should not replace variables that are not in the context', () => {
    const context = { name: 'Charlie' };
    logConversation(4, "AI", "Hello, {{name}}! How's the {{weather}}?", context);
    
    // We expect {{name}} to be replaced, but {{weather}} should stay as is
    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] Turn 4: AI - Hello, Charlie! How's the {{weather}}?/)
    );
  });
});