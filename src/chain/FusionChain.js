// src/chain/FusionChain.js

const FusionChainResult = require('./FusionChainResult');
const MinimalChainable = require('./MinimalChainable');

/**
 * Hey there! 👋 This is our FusionChain class. It's like a super-smart robot 🤖 
 * that can talk to many AI models at once and figure out which one gives the best answer!
 */
class FusionChain {
  /**
   * This method runs our chain of AI models one after the other.
   * It's like asking a bunch of smart friends questions, but we ask them one at a time.
   * 
   * @param {Object} context - This is the background info for our questions.
   * @param {Array} models - These are our AI friends who will answer our questions.
   * @param {Function} callable - This is how we ask our AI friends questions.
   * @param {Array} prompts - These are the questions we want to ask.
   * @param {Function} evaluator - This helps us decide which answer is the best.
   * @param {Function} [getModelName] - This helps us remember our AI friends' names.
   * @returns {Promise<FusionChainResult>} - This gives us back a report card of how our AI friends did.
   */
  static async run(context, models, callable, prompts, evaluator, getModelName = (model) => model.toString()) {
    const allOutputs = [];
    const allContextFilledPrompts = [];

    // Let's ask each AI friend our questions
    for (const model of models) {
      const [outputs, contextFilledPrompts] = await MinimalChainable.run(context, model, callable, prompts);
      allOutputs.push(outputs);
      allContextFilledPrompts.push(contextFilledPrompts);
    }

    // Now, let's see which answer was the best
    const lastOutputs = allOutputs.map(outputs => outputs[outputs.length - 1]);
    const [topResponse, performanceScores] = evaluator(lastOutputs);

    // Let's remember our AI friends' names
    const modelNames = models.map(getModelName);

    // Time to create our report card!
    return new FusionChainResult(topResponse, allOutputs, allContextFilledPrompts, performanceScores, modelNames);
  }

  /**
   * This method runs our chain of AI models all at the same time!
   * It's like asking all our smart friends questions at once.
   * 
   * @param {Object} context - This is the background info for our questions.
   * @param {Array} models - These are our AI friends who will answer our questions.
   * @param {Function} callable - This is how we ask our AI friends questions.
   * @param {Array} prompts - These are the questions we want to ask.
   * @param {Function} evaluator - This helps us decide which answer is the best.
   * @param {Function} [getModelName] - This helps us remember our AI friends' names.
   * @returns {Promise<FusionChainResult>} - This gives us back a report card of how our AI friends did.
   */
  static async runParallel(context, models, callable, prompts, evaluator, getModelName = (model) => model.toString()) {
    // Let's ask all our AI friends questions at the same time!
    const runPromises = models.map(model => MinimalChainable.run(context, model, callable, prompts));
    
    // Now we wait for all of them to finish answering
    const results = await Promise.all(runPromises);
    
    // Let's organize their answers
    const allOutputs = results.map(result => result[0]);
    const allContextFilledPrompts = results.map(result => result[1]);
    
    // Let's see which answer was the best
    const lastOutputs = allOutputs.map(outputs => outputs[outputs.length - 1]);
    const [topResponse, performanceScores] = evaluator(lastOutputs);
    
    // Let's remember our AI friends' names
    const modelNames = models.map(getModelName);
    
    // Time to create our report card!
    return new FusionChainResult(topResponse, allOutputs, allContextFilledPrompts, performanceScores, modelNames);
  }
}

// We're making our FusionChain available for others to use.
// It's like sharing our super-smart robot with friends!
module.exports = FusionChain;