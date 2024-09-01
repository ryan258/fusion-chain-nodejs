// tests/MovieScriptAnalyzer.test.js

const MovieScriptAnalyzer = require('../examples/MovieScriptAnalyzer');
const AIEvaluator = require('../src/evaluators/AIEvaluator');
const OpenAIProvider = require('../src/llm-providers/OpenAIProvider');

jest.mock('../src/evaluators/AIEvaluator');
jest.mock('../src/llm-providers/OpenAIProvider');

describe('MovieScriptAnalyzer', () => {
  let analyzer;
  let mockAIEvaluator;
  let mockOpenAIProvider;

  beforeEach(() => {
    mockOpenAIProvider = new OpenAIProvider('fake-api-key', 'gpt-4');
    mockAIEvaluator = new AIEvaluator({
      criteria: [
        "Plot Coherence",
        "Character Development",
        "Dialogue Quality",
        "Pacing",
        "Commercial Potential"
      ],
      scoreRange: [1, 10],
      aiProvider: mockOpenAIProvider
    });

    analyzer = new MovieScriptAnalyzer(mockAIEvaluator);
  });

  test('analyzes a single movie script', async () => {
    const mockScript = {
      id: 1,
      title: "The Great Adventure",
      content: "INT. SPACESHIP - DAY\n\nHero enters the control room...",
    };

    const mockEvaluation = {
      id: 1,
      scores: [8, 7, 9, 8, 7],
      overall_score: 7.8,
      explanation: "The script shows strong plot coherence and excellent dialogue...",
    };

    mockAIEvaluator.evaluate.mockResolvedValue(mockEvaluation);

    const result = await analyzer.analyzeScript(mockScript);

    expect(result).toEqual({
      id: 1,
      title: "The Great Adventure",
      scores: {
        "Plot Coherence": 8,
        "Character Development": 7,
        "Dialogue Quality": 9,
        "Pacing": 8,
        "Commercial Potential": 7
      },
      overall_score: 7.8,
      explanation: "The script shows strong plot coherence and excellent dialogue...",
    });

    expect(mockAIEvaluator.evaluate).toHaveBeenCalledWith({
      id: 1,
      content: expect.stringContaining("INT. SPACESHIP - DAY"),
    });
  });

  test('analyzes multiple movie scripts', async () => {
    const mockScripts = [
      { id: 1, title: "The Great Adventure", content: "Script 1 content..." },
      { id: 2, title: "Love in Paris", content: "Script 2 content..." },
    ];

    const mockEvaluations = [
      {
        id: 1,
        scores: [8, 7, 9, 8, 7],
        overall_score: 7.8,
        explanation: "Evaluation for Script 1...",
        rank: 1,
      },
      {
        id: 2,
        scores: [7, 8, 8, 7, 9],
        overall_score: 7.8,
        explanation: "Evaluation for Script 2...",
        rank: 2,
      },
    ];

    mockAIEvaluator.evaluate.mockResolvedValue(mockEvaluations);

    const results = await analyzer.analyzeScripts(mockScripts);

    expect(results).toHaveLength(2);
    expect(results[0].title).toBe("The Great Adventure");
    expect(results[1].title).toBe("Love in Paris");
    expect(results[0].rank).toBe(1);
    expect(results[1].rank).toBe(2);

    expect(mockAIEvaluator.evaluate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, content: "Script 1 content..." }),
        expect.objectContaining({ id: 2, content: "Script 2 content..." }),
      ])
    );
  });
});