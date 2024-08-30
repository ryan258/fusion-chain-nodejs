# 🚀 Fusion Chain Quick Reference Guide 🚀

Hey there, awesome coders! 👋 Welcome to your Fusion Chain Quick Reference Guide. This handbook will show you some of the coolest parts of our Fusion Chain project. Let's dive in and explore the awesomeness!

## 🌟 What's Inside Our Project?

Our Fusion Chain project has some super cool parts. Here are the main ones:

1. 🤖 **AI Helpers** (we call them "Providers")
2. 🔗 **Chain Types** (different ways our AI helpers work together)
3. 🎭 **Fun Examples** (cool things we can do with Fusion Chain)

Let's look at each of these!

## 🤖 AI Helpers (Providers)

We have two main AI helpers in our project:

### Ollama Provider

This is like our local AI friend. It lives right in our computer!

```javascript
// src/llm-providers/OllamaProvider.js
class OllamaProvider extends LLMProvider {
  async generateResponse(prompt) {
    // This is where our Ollama friend thinks and gives us an answer!
    // ... (more code here)
  }
}
```

### OpenAI Provider

This is like our cloud AI friend. It lives on the internet and is super smart!

```javascript
// src/llm-providers/OpenAIProvider.js
class OpenAIProvider extends LLMProvider {
  async generateResponse(prompt) {
    // This is where our OpenAI friend thinks and gives us an answer!
    // ... (more code here)
  }
}
```

## 🔗 Chain Types

We have different ways our AI helpers can work together. Here are some cool ones:

### Fusion Chain

This is like getting all our AI friends to answer a question and then picking the best answer.

```javascript
// src/chain/FusionChain.js
class FusionChain {
  static async run(context, models, callable, prompts, evaluator) {
    // This is where the magic happens! All our AI friends work together.
    // ... (more code here)
  }
}
```

### Recursive Chain

This is like asking our AI friend a question, then asking another question based on their answer, and so on!

```javascript
// src/chain/RecursiveChain.js
class RecursiveChain extends MinimalChainable {
  async run(context, model, callable, prompts, maxIterations = 5) {
    // This is where we keep asking questions based on previous answers.
    // ... (more code here)
  }
}
```

## 🎭 Fun Examples

Now, let's look at some cool things we can do with Fusion Chain!

### 📚 Story Generator

We can use Fusion Chain to create awesome stories! Check this out:

```javascript
// examples/simple-story-generator.js
async function generateStory() {
  // This is where we ask our AI friends to write a story about a haunted AI!
  // ... (more code here)
}
```

### 🦸‍♀️ Superhero Name Generator

We can even create superhero names and stories! How cool is that?

```javascript
// examples/superheroNameGenerator.js
async function createSuperhero(name, favoriteThing) {
  // This is where we create an awesome superhero identity!
  // ... (more code here)
}
```

## 🎉 Ready to Explore?

Now that you've seen some of the awesome things in our Fusion Chain project, it's time to explore! Here are some fun things you can try:

1. 🕵️‍♂️ Look at the different files and see if you can understand what they do.
2. 🖊️ Try changing some of the prompts in the examples to create your own stories or superheros.
3. 🤔 Think about what other cool things you could create with Fusion Chain. The sky's the limit!

Remember, coding is all about having fun and being creative. So don't be afraid to experiment and try new things!

Happy coding, awesome Fusion Chain explorers! 🌈👩‍💻👨‍💻