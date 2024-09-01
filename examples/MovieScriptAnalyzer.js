// src/examples/MovieScriptAnalyzer.js

class MovieScriptAnalyzer {
    constructor(aiEvaluator) {
      this.aiEvaluator = aiEvaluator;
      this.criteria = [
        "Plot Coherence",
        "Character Development",
        "Dialogue Quality",
        "Pacing",
        "Commercial Potential"
      ];
    }
  
    async analyzeScript(script) {
      const evaluation = await this.aiEvaluator.evaluate({
        id: script.id,
        content: script.content
      });
  
      return this.formatEvaluation(script.title, evaluation);
    }
  
    async analyzeScripts(scripts) {
      const scriptContents = scripts.map(script => ({
        id: script.id,
        content: script.content
      }));
  
      const evaluations = await this.aiEvaluator.evaluate(scriptContents);
  
      return evaluations.map((evaluation, index) => 
        this.formatEvaluation(scripts[index].title, evaluation)
      );
    }
  
    formatEvaluation(title, evaluation) {
      const scores = {};
      this.criteria.forEach((criterion, index) => {
        scores[criterion] = evaluation.scores[index];
      });
  
      return {
        id: evaluation.id,
        title: title,
        scores: scores,
        overall_score: evaluation.overall_score,
        explanation: evaluation.explanation,
        rank: evaluation.rank
      };
    }
  }
  
  module.exports = MovieScriptAnalyzer;