// tests/AIEvaluator.test.js

const AIEvaluator = require('../src/evaluators/AIEvaluator');
const OpenAIProvider = require('../src/llm-providers/OpenAIProvider');

jest.mock('../src/llm-providers/OpenAIProvider');

describe('AIEvaluator', () => {
  let evaluator;
  let mockAIProvider;

  beforeEach(() => {
    mockAIProvider = new OpenAIProvider('fake-api-key', 'gpt-4');
    evaluator = new AIEvaluator({
      criteria: [
        "Relevance to the topic",
        "Factual accuracy",
        "Clarity of expression",
        "Coherence and flow"
      ],
      scoreRange: [1, 10],
      aiProvider: mockAIProvider
    });
  });

  test('evaluates a single output', async () => {
    const mockResponse = JSON.stringify({
      scores: [8, 7, 9, 8],
      overall_score: 8,
      explanation: "The output is highly relevant and clear, with good factual accuracy and coherence."
    });
    
    mockAIProvider.generateResponse.mockResolvedValue(mockResponse);

    const result = await evaluator.evaluate({
      id: 1,
      content: "Sample output for evaluation"
    });

    expect(result).toEqual({
      id: 1,
      scores: [8, 7, 9, 8],
      overall_score: 8,
      explanation: "The output is highly relevant and clear, with good factual accuracy and coherence."
    });

    expect(mockAIProvider.generateResponse).toHaveBeenCalledWith(expect.stringContaining("Sample output for evaluation"));
  });

  test('evaluates and ranks multiple outputs', async () => {
    const mockResponses = [
      JSON.stringify({
        scores: [8, 7, 9, 8],
        overall_score: 8,
        explanation: "Output A is highly relevant and clear."
      }),
      JSON.stringify({
        scores: [7, 8, 8, 7],
        overall_score: 7.5,
        explanation: "Output B is accurate but less coherent."
      }),
      JSON.stringify({
        scores: [9, 9, 8, 9],
        overall_score: 8.75,
        explanation: "Output C is excellent across all criteria."
      })
    ];
    
    mockAIProvider.generateResponse.mockImplementation(() => Promise.resolve(mockResponses.shift()));

    const results = await evaluator.evaluate([
      { id: 1, content: "Output A" },
      { id: 2, content: "Output B" },
      { id: 3, content: "Output C" }
    ]);

    expect(results).toEqual([
      {
        id: 3,
        scores: [9, 9, 8, 9],
        overall_score: 8.75,
        explanation: "Output C is excellent across all criteria.",
        rank: 1
      },
      {
        id: 1,
        scores: [8, 7, 9, 8],
        overall_score: 8,
        explanation: "Output A is highly relevant and clear.",
        rank: 2
      },
      {
        id: 2,
        scores: [7, 8, 8, 7],
        overall_score: 7.5,
        explanation: "Output B is accurate but less coherent.",
        rank: 3
      }
    ]);

    expect(mockAIProvider.generateResponse).toHaveBeenCalledTimes(3);
  });

  test('handles evaluation errors gracefully', async () => {
    mockAIProvider.generateResponse.mockRejectedValue(new Error('AI evaluation failed'));

    await expect(evaluator.evaluate({ id: 1, content: "Problematic output" }))
      .rejects.toThrow('AI evaluation failed');
  });
});