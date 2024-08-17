// src/chain/FusionChainResult.js

/**
 * This is the FusionChainResult class! 🎉
 * 
 * Imagine you're playing a game where different robot friends help you solve puzzles.
 * This class is like a special report card that keeps track of how all your robot
 * friends did in solving the puzzle together.
 */
class FusionChainResult {
    /**
     * This is the constructor. It's like setting up your report card at the beginning of the game.
     * 
     * @param {string} topResponse - This is the best answer from all your robot friends.
     * @param {Array<Array<string>>} allPromptResponses - This is a list of all the answers from each robot friend.
     * @param {Array<Array<string>>} allContextFilledPrompts - This is a list of all the questions we asked each robot friend.
     * @param {Array<number>} performanceScores - This is like giving each robot friend a score for how well they did.
     * @param {Array<string>} modelNames - This is a list of your robot friends' names.
     */
    constructor(topResponse, allPromptResponses, allContextFilledPrompts, performanceScores, modelNames) {
      // We're saving all this information so we can look at it later if we need to.
      
      // The best answer we got from any of our robot friends
      this.topResponse = topResponse;
  
      // All the answers from all our robot friends. It's like keeping all their homework papers.
      this.allPromptResponses = allPromptResponses;
  
      // All the questions we asked our robot friends. It's like keeping a copy of the test questions.
      this.allContextFilledPrompts = allContextFilledPrompts;
  
      // How well each robot friend did. It's like their individual test scores.
      this.performanceScores = performanceScores;
  
      // The names of our robot friends. We want to remember who helped us!
      this.modelNames = modelNames;
    }
  
    /**
     * This is a special function that turns our report card into a string of text.
     * It's like if you had to read your report card out loud to your parents.
     * 
     * @returns {string} A text version of our report card with the most important information.
     */
    toString() {
      // We're going to build our report card text piece by piece.
      let resultString = "FusionChain Report Card 📊\n\n";
  
      // First, let's add the best answer we got.
      resultString += "Best Answer: " + this.topResponse + "\n\n";
  
      // Now, let's add how well each robot friend did.
      resultString += "Robot Friend Scores:\n";
      for (let i = 0; i < this.modelNames.length; i++) {
        // We're using a for loop here. It's like going through a list of your friends one by one.
        resultString += `${this.modelNames[i]}: ${this.performanceScores[i]}\n`;
        // This line is adding each robot friend's name and score to our report.
      }
  
      // Finally, we'll return our completed report card text.
      return resultString;
    }
  
    /**
     * This function gives us a detailed look at all the answers from one specific robot friend.
     * It's like looking at all the homework one of your friends did.
     * 
     * @param {number} modelIndex - This is which robot friend we want to look at (like saying "I want to see the 2nd friend's work").
     * @returns {string} A detailed report of one robot friend's answers.
     */
    getDetailedModelResponse(modelIndex) {
      // Let's make sure we're not trying to look at a robot friend that doesn't exist!
      if (modelIndex < 0 || modelIndex >= this.modelNames.length) {
        return "Oops! That robot friend doesn't exist in our group.";
      }
  
      // Now let's build our detailed report.
      let detailedReport = `Detailed Report for ${this.modelNames[modelIndex]}:\n\n`;
  
      // We'll go through each question and answer from this robot friend.
      for (let i = 0; i < this.allPromptResponses[modelIndex].length; i++) {
        detailedReport += `Question ${i + 1}: ${this.allContextFilledPrompts[modelIndex][i]}\n`;
        detailedReport += `Answer ${i + 1}: ${this.allPromptResponses[modelIndex][i]}\n\n`;
      }
  
      // Add the final score for this robot friend.
      detailedReport += `Final Score: ${this.performanceScores[modelIndex]}\n`;
  
      return detailedReport;
    }
  }
  
  // We're making our FusionChainResult available to other parts of our program.
  // It's like sharing our toy with friends so they can use it too!
  module.exports = FusionChainResult;