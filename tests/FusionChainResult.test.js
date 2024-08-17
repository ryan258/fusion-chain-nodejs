// tests/FusionChainResult.test.js

// First, we need to import our FusionChainResult class
const FusionChainResult = require('../src/chain/FusionChainResult');

// Now, let's describe our test suite for FusionChainResult
describe('FusionChainResult', () => {
  // We'll create some sample data to use in our tests
  const sampleData = {
    topResponse: "The best answer is 42.",
    allPromptResponses: [
      ["Answer 1 from Model 1", "Answer 2 from Model 1"],
      ["Answer 1 from Model 2", "Answer 2 from Model 2"]
    ],
    allContextFilledPrompts: [
      ["Question 1 for Model 1", "Question 2 for Model 1"],
      ["Question 1 for Model 2", "Question 2 for Model 2"]
    ],
    performanceScores: [0.9, 0.8],
    modelNames: ["Model 1", "Model 2"]
  };

  // Let's test the constructor
  test('constructor should correctly set all properties', () => {
    const result = new FusionChainResult(
      sampleData.topResponse,
      sampleData.allPromptResponses,
      sampleData.allContextFilledPrompts,
      sampleData.performanceScores,
      sampleData.modelNames
    );

    // Now we'll check if each property was set correctly
    expect(result.topResponse).toBe(sampleData.topResponse);
    expect(result.allPromptResponses).toEqual(sampleData.allPromptResponses);
    expect(result.allContextFilledPrompts).toEqual(sampleData.allContextFilledPrompts);
    expect(result.performanceScores).toEqual(sampleData.performanceScores);
    expect(result.modelNames).toEqual(sampleData.modelNames);
  });

  // Let's test the toString method
  test('toString should return a correctly formatted string', () => {
    const result = new FusionChainResult(
      sampleData.topResponse,
      sampleData.allPromptResponses,
      sampleData.allContextFilledPrompts,
      sampleData.performanceScores,
      sampleData.modelNames
    );

    const expectedString = 
      "FusionChain Report Card 📊\n\n" +
      "Best Answer: The best answer is 42.\n\n" +
      "Robot Friend Scores:\n" +
      "Model 1: 0.9\n" +
      "Model 2: 0.8\n";

    expect(result.toString()).toBe(expectedString);
  });

  // Let's test the getDetailedModelResponse method
  test('getDetailedModelResponse should return correct details for a valid index', () => {
    const result = new FusionChainResult(
      sampleData.topResponse,
      sampleData.allPromptResponses,
      sampleData.allContextFilledPrompts,
      sampleData.performanceScores,
      sampleData.modelNames
    );

    const expectedDetailedResponse = 
      "Detailed Report for Model 1:\n\n" +
      "Question 1: Question 1 for Model 1\n" +
      "Answer 1: Answer 1 from Model 1\n\n" +
      "Question 2: Question 2 for Model 1\n" +
      "Answer 2: Answer 2 from Model 1\n\n" +
      "Final Score: 0.9\n";

    expect(result.getDetailedModelResponse(0)).toBe(expectedDetailedResponse);
  });

  test('getDetailedModelResponse should return an error message for an invalid index', () => {
    const result = new FusionChainResult(
      sampleData.topResponse,
      sampleData.allPromptResponses,
      sampleData.allContextFilledPrompts,
      sampleData.performanceScores,
      sampleData.modelNames
    );

    expect(result.getDetailedModelResponse(5)).toBe("Oops! That robot friend doesn't exist in our group.");
  });
});