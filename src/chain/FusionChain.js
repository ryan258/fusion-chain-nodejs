// src/chain/FusionChain.js

// 📚 We're bringing in some helper tools we made earlier
const FusionChainResult = require('./FusionChainResult');
const MinimalChainable = require('./MinimalChainable');

// 🤖 This is our FusionChain class. It's like a super smart robot that can talk to many AI friends at once!
class FusionChain {
  // 🏃‍♂️ This is our main "run" function. It's like starting a race with all our AI friends!
  static async run(context, models, callable, prompts, evaluator, getModelName = (model) => model.toString()) {
    // 📦 We're creating some empty boxes to store our results
    const allOutputs = [];
    const allContextFilledPrompts = [];
    // 🧠 This is like a special notebook where we write down what we learn
    const runContext = { ...context, previousAnswers: [] };

    // 🔁 We're going to talk to each of our AI friends one by one
    for (const model of models) {
      try {
        // 📞 We're using our special phone (MinimalChainable) to call each AI friend
        const [outputs, contextFilledPrompts] = await MinimalChainable.run(runContext, model, async (model, prompt) => {
          return await callable(model, prompt, runContext);
        }, prompts);
        
        // 📥 We're putting the answers in our result boxes
        allOutputs.push(outputs);
        allContextFilledPrompts.push(contextFilledPrompts);
        // ✏️ We're writing down what we learned in our special notebook
        runContext.previousAnswers.push(...outputs);
      } catch (error) {
        // 🚨 Oops! Something went wrong when talking to this AI friend
        console.error(`Error processing model ${model.constructor.name}:`, error);
        throw error;
      }
    }

    // 🏅 We're picking the best answer from all our AI friends
    const lastOutputs = allOutputs.map(outputs => outputs[outputs.length - 1]);
    const [topResponse, performanceScores] = evaluator(lastOutputs);
    // 🏷️ We're giving each AI friend a name tag
    const modelNames = models.map(getModelName);

    // 🎁 We're wrapping up all our results in a nice package
    return new FusionChainResult(topResponse, allOutputs, allContextFilledPrompts, performanceScores, modelNames);
  }

  // 🚀 This is our "runParallel" function. It's like having a big party where all our AI friends talk at once!
  static async runParallel(context, models, callable, prompts, evaluator, getModelName = (model) => model.toString()) {
    // 🧠 We're setting up our special notebook again
    const runContext = { ...context, previousAnswers: [] };

    // 🎉 We're inviting all our AI friends to the party at the same time
    const modelPromises = models.map(model => 
      MinimalChainable.run(runContext, model, async (model, prompt) => {
        return await callable(model, prompt, runContext);
      }, prompts)
        .catch(error => {
          // 🚨 Oops! This AI friend had a problem
          console.error(`Error processing model ${model.constructor.name}:`, error);
          throw error;
        })
    );
    
    try {
      // ⏳ We're waiting for all our AI friends to finish talking
      const results = await Promise.all(modelPromises);
      
      // 📦 We're organizing all the answers we got
      const allOutputs = results.map(result => result[0]);
      const allContextFilledPrompts = results.map(result => result[1]);
      
      // 🏅 We're picking the best answer from the party
      const lastOutputs = allOutputs.map(outputs => outputs[outputs.length - 1]);
      const [topResponse, performanceScores] = evaluator(lastOutputs);
      
      // 🏷️ We're giving each AI friend a name tag
      const modelNames = models.map(getModelName);
      
      // 🎁 We're wrapping up all our party results in a nice package
      return new FusionChainResult(topResponse, allOutputs, allContextFilledPrompts, performanceScores, modelNames);
    } catch (error) {
      // 🚨 Oh no! Something went wrong at our AI party
      console.error("Error in runParallel:", error);
      throw error;
    }
  }
}

// 🚪 We're making our FusionChain available for others to use
module.exports = FusionChain;