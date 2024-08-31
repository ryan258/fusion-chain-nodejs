// src/chain/MinimalChainable.js

class MinimalChainable {
  static async run(context, model, callable, prompts) {
    const outputs = [];
    const contextFilledPrompts = [];

    for (let prompt of prompts) {
      if (typeof prompt === 'function') {
        prompt = prompt(context);
      }

      for (const [key, value] of Object.entries(context)) {
        prompt = prompt.replace(`{{${key}}}`, value);
      }

      contextFilledPrompts.push(prompt);

      try {
        const response = await callable(model, prompt, context);
        outputs.push(response);

        // Update context with the new response
        if (!context.conversation) {
          context.conversation = [];
        }
        context.conversation.push({ question: prompt, answer: response });
      } catch (error) {
        console.error(`Error processing prompt: ${prompt}`, error);
        throw error;
      }
    }

    return [outputs, contextFilledPrompts];
  }

  static toDelimTextFile(name, content) {
    let result = '';
    for (let i = 0; i < content.length; i++) {
      const chainEmoji = '🔗'.repeat(i + 1);
      result += `${chainEmoji} -------- Prompt Chain Result #${i + 1} -------------\n\n`;
      result += `${content[i]}\n\n`;
    }
    return result;
  }
}

module.exports = MinimalChainable;
