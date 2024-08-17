// src/chain/MinimalChainable.js

/**
 * Hey there! 👋 This is our MinimalChainable class. It's like a smart robot 🤖 
 * that helps us ask questions to AI models and get answers back.
 */
class MinimalChainable {
    /**
     * This is our main method that does all the cool stuff!
     * It's like a conversation manager for our AI friends.
     * 
     * @param {Object} context - This is like the background info for our conversation.
     * @param {Object} model - This is our AI friend who's going to answer questions.
     * @param {Function} callable - This is how we ask our AI friend questions.
     * @param {Array} prompts - These are the questions we want to ask.
     * @returns {Promise<[Array, Array]>} - This gives us back the answers and the questions we asked.
     */
    static async run(context, model, callable, prompts) {
      const outputs = [];  // This will store all the answers
      const contextFilledPrompts = [];  // This will store all the questions we actually asked
  
      // Let's go through each question one by one
      for (let prompt of prompts) {
        // If our prompt is a function, let's use it to make our question
        if (typeof prompt === 'function') {
          prompt = prompt(context);
        }
  
        // Now, let's fill in any blanks in our question using our context
        for (const [key, value] of Object.entries(context)) {
          prompt = prompt.replace(`{{${key}}}`, value);
        }
  
        // We'll save our filled-in question
        contextFilledPrompts.push(prompt);
  
        try {
          // Time to ask our AI friend the question!
          const response = await callable(model, prompt);
          // We'll save the answer
          outputs.push(response);
        } catch (error) {
          // Uh-oh, something went wrong. Let's tell everyone about it.
          console.error(`Error processing prompt: ${prompt}`, error);
          throw error;  // We'll let others know about this error too
        }
      }
  
      // All done! Let's return our answers and questions.
      return [outputs, contextFilledPrompts];
    }
  
    /**
     * This method helps us write down all our questions and answers in a neat way.
     * It's like creating a pretty report of our conversation with the AI.
     * 
     * @param {string} name - This is the title of our report.
     * @param {Array} content - This is all the stuff we want to put in our report.
     * @returns {string} - This is our neatly formatted report.
     */
    static toDelimTextFile(name, content) {
      let result = '';
      for (let i = 0; i < content.length; i++) {
        // We're adding a cool chain emoji for each item. More items = longer chain!
        const chainEmoji = '🔗'.repeat(i + 1);
        result += `${chainEmoji} -------- Prompt Chain Result #${i + 1} -------------\n\n`;
        result += `${content[i]}\n\n`;
      }
      return result;
    }
  }
  
  // We're making our MinimalChainable available for others to use.
  // It's like sharing our cool robot with friends!
  module.exports = MinimalChainable;