// src/evaluators/AIEvaluator.js

class AIEvaluator {
    constructor({ criteria, scoreRange, aiProvider }) {
      this.criteria = criteria;
      this.scoreRange = scoreRange;
      this.aiProvider = aiProvider;
    }
  
    async evaluate(input) {
      if (Array.isArray(input)) {
        return this.evaluateMultiple(input);
      } else {
        return this.evaluateSingle(input);
      }
    }
  
    async evaluateSingle(output) {
      const prompt = this.constructPrompt(output.content);
      try {
        const response = await this.aiProvider.generateResponse(prompt);
        const evaluation = JSON.parse(response);
        return { id: output.id, ...evaluation };
      } catch (error) {
        throw new Error(`Evaluation failed: ${error.message}`);
      }
    }
  
    async evaluateMultiple(outputs) {
      const evaluations = await Promise.all(outputs.map(output => this.evaluateSingle(output)));
      return this.rankOutputs(evaluations);
    }
  
    constructPrompt(content) {
      return `
        Evaluate the following output based on these criteria:
        ${this.criteria.join(', ')}
        
        Use a score range of ${this.scoreRange[0]} to ${this.scoreRange[1]}.
        
        Output to evaluate:
        "${content}"
        
        Provide your evaluation in the following JSON format:
        {
          "scores": [score1, score2, ...],
          "overall_score": number,
          "explanation": "string"
        }
      `;
    }
  
    rankOutputs(evaluations) {
      const sorted = evaluations.sort((a, b) => b.overall_score - a.overall_score);
      return sorted.map((evaluation, index) => ({ ...evaluation, rank: index + 1 }));
    }
  }
  
  module.exports = AIEvaluator;