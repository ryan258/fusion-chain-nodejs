// src/chain/FusionChain.js

// First, we're bringing in some helper tools we've made before.
// It's like getting our coloring pencils and paper ready before we start drawing.
const FusionChainResult = require('./FusionChainResult');
const MinimalChainable = require('./MinimalChainable');

// This is our FusionChain class. Think of it as a big robot that can talk to many smaller robots.
class FusionChain {
  // This is a special function that can talk to many robot friends one by one.
  // It's like asking each of your friends a question, one after another.
  static async run(context, models, callable, prompts, evaluator, getModelName = (model) => model.toString()) {
    // We're making two empty boxes to put our answers and questions in.
    const allOutputs = [];
    const allContextFilledPrompts = [];

    // We're making a special notebook to write down what we learn.
    const runContext = { ...context, previousAnswers: [] };

    // We're going to talk to each of our robot friends one by one.
    for (const model of models) {
      try {
        // We're using our MinimalChainable tool to talk to each robot friend.
        // It's like having a special telephone to call each friend.
        const [outputs, contextFilledPrompts] = await MinimalChainable.run(runContext, model, callable, prompts);
        
        // We're putting the answers and questions in our boxes.
        allOutputs.push(outputs);
        allContextFilledPrompts.push(contextFilledPrompts);
        
        // We're writing down what we learned in our special notebook.
        runContext.previousAnswers.push(...outputs);
      } catch (error) {
        // Oops! Something went wrong when talking to this robot friend.
        // We're going to tell everyone about it.
        console.error(`Error processing model ${model.constructor.name}:`, error);
        
        // We're also going to stop everything if something goes wrong.
        // It's like stopping a game if someone gets hurt.
        throw error;
      }
    }

    // We're looking at the last answer from each robot friend.
    const lastOutputs = allOutputs.map(outputs => outputs[outputs.length - 1]);
    
    // We're using our special judge (evaluator) to pick the best answer.
    const [topResponse, performanceScores] = evaluator(lastOutputs);

    // We're giving each robot friend a name tag.
    const modelNames = models.map(getModelName);

    // We're putting all our results in a special box to give back.
    return new FusionChainResult(topResponse, allOutputs, allContextFilledPrompts, performanceScores, modelNames);
  }

  // This is another special function that can talk to all our robot friends at the same time!
  // It's like asking all your friends a question at once in a big group.
  static async runParallel(context, models, callable, prompts, evaluator, getModelName = (model) => model.toString()) {
    // We're making our special notebook again.
    const runContext = { ...context, previousAnswers: [] };

    // We're asking all our robot friends the question at the same time.
    // It's like shouting a question to a group of friends.
    const modelPromises = models.map(model => 
      MinimalChainable.run(runContext, model, callable, prompts)
        .catch(error => {
          // Oops! Something went wrong when talking to this robot friend.
          // We're going to tell everyone about it.
          console.error(`Error processing model ${model.constructor.name}:`, error);
          
          // We're also going to stop everything if something goes wrong.
          throw error;
        })
    );
    
    try {
      // We're waiting for all our friends to answer.
      const results = await Promise.all(modelPromises);
      
      // We're sorting all the answers and questions into our boxes.
      const allOutputs = results.map(result => result[0]);
      const allContextFilledPrompts = results.map(result => result[1]);
      
      // We're looking at the last answer from each friend.
      const lastOutputs = allOutputs.map(outputs => outputs[outputs.length - 1]);
      
      // We're using our special judge (evaluator) to pick the best answer.
      const [topResponse, performanceScores] = evaluator(lastOutputs);
      
      // We're giving each robot friend a name tag.
      const modelNames = models.map(getModelName);
      
      // We're putting all our results in a special box to give back.
      return new FusionChainResult(topResponse, allOutputs, allContextFilledPrompts, performanceScores, modelNames);
    } catch (error) {
      // Oops! Something went wrong when talking to our friends.
      // We're going to tell everyone about it.
      console.error("Error in runParallel:", error);
      
      // We're also going to stop everything if something goes wrong.
      throw error;
    }
  }
}

// We're making our FusionChain available for others to use.
// It's like sharing our cool robot with friends!
module.exports = FusionChain;