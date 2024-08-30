// src/chain/PipelineChain.js

/**
 * PipelineChain class
 * 
 * This class represents a chain of operations where the output of each step
 * becomes the input of the next step. It's like a factory assembly line for data! 🏭
 */
class PipelineChain {
    /**
     * Constructor for PipelineChain
     * 
     * We start with an empty array of steps. It's like having an empty assembly line
     * ready for us to add machines (steps). 🔧
     */
    constructor() {
      this.steps = [];
    }
  
    /**
     * Add a step to the pipeline
     * 
     * @param {Function} step - The function to add as a step
     * @returns {PipelineChain} - Returns this PipelineChain for method chaining
     * 
     * This is like adding a new machine to our assembly line. Each machine (step)
     * does a specific job on our data. 🦾
     */
    addStep(step) {
      this.steps.push(step);
      return this;
    }
  
    /**
     * Run the pipeline
     * 
     * @param {*} input - The initial input to the pipeline
     * @param {Object} context - An optional context object that's passed to each step
     * @returns {Promise<*>} - The final output of the pipeline
     * 
     * This is like starting our assembly line. We put our raw material (input) in,
     * and it goes through each machine (step) until we get our finished product! 🎉
     */
    async run(input, context = {}) {
      let currentInput = input;
  
      for (const step of this.steps) {
        try {
          // Each step can be synchronous or asynchronous
          currentInput = await step(currentInput, context);
        } catch (error) {
          // If any step fails, we stop the whole assembly line
          console.error(`Error in pipeline step: ${error.message}`);
          throw error;
        }
      }
  
      return currentInput;
    }
  }
  
  module.exports = PipelineChain;