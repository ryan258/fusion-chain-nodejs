// src/chain/ConditionalChain.js

// Imagine you're building a big Lego machine that can do different things based on what you tell it.
// This ConditionalChain is like that machine - it can do different tasks depending on what's happening.

class ConditionalChain {
    // This is like setting up our Lego machine when we first get it out of the box.
    constructor() {
      // We're creating two special containers:
      // 1. A map for our "if-then" rules (we call these branches)
      // 2. A place to store our "default" action if none of our rules match
      
      // Imagine a board with hooks (that's our Map). We'll hang our rules on these hooks.
      this.branches = new Map();
      
      // This is like a special box where we keep our "just in case" plan.
      this.defaultBranch = null;
    }
  
    // This is how we add a new rule (or branch) to our machine.
    // It's like saying "IF this happens, THEN do that".
    addBranch(condition, chain) {
      // First, we check if our 'condition' is a function.
      // A function is like a little machine that does a specific job when we ask it to.
      if (typeof condition !== 'function') {
        // If it's not a function, we stop everything and say there's a problem.
        // It's like trying to use a banana as a Lego piece - it just doesn't work!
        throw new Error('Condition must be a function');
      }
      
      // If everything is okay, we add our new rule to our board (Map).
      // It's like hanging a new sign on one of our hooks.
      this.branches.set(condition, chain);
      
      // We return 'this' so we can add more rules right away if we want to.
      // It's like saying "I'm done with this rule, what's next?"
      return this;
    }
  
    // This is how we set up our "just in case" plan.
    // It's like having a backup plan if none of our other plans work out.
    setDefaultBranch(chain) {
      // We put our backup plan in its special box.
      this.defaultBranch = chain;
      
      // Again, we return 'this' in case we want to do something else right away.
      return this;
    }
  
    // This is how someone can look at all the rules we've set up.
    // It's like letting someone see our board with all the rule signs.
    getBranches() {
      return this.branches;
    }
  
    // This is how someone can check what our backup plan is.
    // It's like peeking into our special "just in case" box.
    getDefaultBranch() {
      return this.defaultBranch;
    }
  
    // This is the main part where our machine does its job!
    // It's like starting up our Lego machine and watching it work.
    async run(context, model, callable, prompts) {
      // We look at each rule we've set up, one by one.
      // It's like going down our board and reading each sign.
      for (const [condition, chain] of this.branches) {
        // We check if this rule applies to our current situation.
        // It's like asking "Does this sign match what we're doing right now?"
        if (await condition(context)) {
          // If it matches, we do what the rule says!
          // It's like following the instructions on the matching sign.
          return this.executeBranch(chain, context, model, callable, prompts);
        }
      }
  
      // If none of our rules matched, we check if we have a backup plan.
      if (this.defaultBranch) {
        // If we do have a backup plan, we do that instead.
        // It's like saying "None of our signs matched, so let's do our backup plan."
        return this.executeBranch(this.defaultBranch, context, model, callable, prompts);
      }
  
      // If we don't have a backup plan, we have a problem!
      // It's like our machine doesn't know what to do, so it stops and calls for help.
      throw new Error('No matching condition and no default branch set');
    }
  
    // This is a helper function that actually does the job for each rule.
    // It's like the part of our machine that follows the instructions on our signs.
    async executeBranch(chain, context, model, callable, prompts) {
      // We check what kind of instructions we have:
      
      // If our instructions are a function (a little machine), we use it directly.
      // It's like having a special button that does a specific thing when pressed.
      if (typeof chain === 'function') {
        return chain(context, model, callable, prompts);
      } 
      // If our instructions are another machine with a 'run' button, we press that button.
      // It's like having a smaller Lego machine as part of our big machine.
      else if (typeof chain.run === 'function') {
        return chain.run(context, model, callable, prompts);
      } 
      // If our instructions are something else, we don't know what to do!
      // It's like finding a puzzle piece that doesn't fit anywhere in our machine.
      else {
        throw new Error('Invalid branch type');
      }
    }
  }
  
  // We're making our ConditionalChain machine available for others to use.
  // It's like putting instructions in the box so other people can build this machine too!
  module.exports = ConditionalChain;