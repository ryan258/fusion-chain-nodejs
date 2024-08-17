// src/utils/conversationLogger.js

/**
 * Hey there! 👋 This is our conversationLogger. It's like a special diary 📔
 * that writes down conversations between humans and AI. How cool is that?
 */

/**
 * This function writes down a message in our conversation diary.
 * 
 * @param {number} turn - This is like counting which message we're on.
 * @param {string} role - This tells us who's talking (like "Human" or "AI").
 * @param {string} message - This is what they're saying.
 * @param {Object} [context] - This is like extra information to help understand the message.
 */
function logConversation(turn, role, message, context = {}) {
    // First, let's get the current time
    const timestamp = new Date().toISOString();
  
    // Now, if we have any extra information (context), let's use it to understand the message better
    if (context) {
      // We look at each piece of extra information...
      for (const [key, value] of Object.entries(context)) {
        // ...and use it to fill in any blanks in our message
        message = message.replace(`{{${key}}}`, value);
      }
    }
  
    // Now we put it all together in a nice format
    const logEntry = `[${timestamp}] Turn ${turn}: ${role} - ${message}`;
  
    // And finally, we write it in our diary (which in this case, is the console)
    console.log(logEntry);
  }
  
  // We're making our conversationLogger available for others to use.
  // It's like sharing our cool diary with friends!
  module.exports = { logConversation };