// examples/pipelineChainExample.js

const PipelineChain = require('../src/chain/PipelineChain');

// Simulated NLP functions
const cleanText = (text) => {
    // Remove special characters and extra spaces
    return text.replace(/[^\w\s]|_/g, "")
               .replace(/\s+/g, " ")
               .toLowerCase();
};

const analyzeSentiment = (text) => {
    // Very simple sentiment analysis (just for demonstration)
    const positiveWords = ['good', 'great', 'excellent', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible'];
    
    let score = 0;
    text.split(' ').forEach(word => {
        if (positiveWords.includes(word)) score++;
        if (negativeWords.includes(word)) score--;
    });

    return score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral';
};

const translateText = (text, targetLang = 'Spanish') => {
    // Simulated translation (just for demonstration)
    const translations = {
        'hello': 'hola',
        'world': 'mundo',
        'good': 'bueno',
        'bad': 'malo',
        'day': 'día'
    };

    return text.split(' ')
               .map(word => translations[word] || word)
               .join(' ');
};

const summarizeText = (text, maxLength = 10) => {
    // Simple summarization by truncation
    const words = text.split(' ');
    if (words.length <= maxLength) return text;
    return words.slice(0, maxLength).join(' ') + '...';
};

// Create our PipelineChain
const nlpPipeline = new PipelineChain();

nlpPipeline
    .addStep((input, context) => {
        console.log("🧼 Cleaning text...");
        const cleaned = cleanText(input);
        context.cleaned = cleaned;
        return cleaned;
    })
    .addStep((input, context) => {
        console.log("🎭 Analyzing sentiment...");
        const sentiment = analyzeSentiment(input);
        context.sentiment = sentiment;
        return input; // Pass the original input to the next step
    })
    .addStep((input, context) => {
        console.log("🌎 Translating text...");
        const translated = translateText(input);
        context.translated = translated;
        return translated;
    })
    .addStep((input, context) => {
        console.log("📝 Summarizing text...");
        const summary = summarizeText(input);
        context.summary = summary;
        return summary;
    });

// Run our pipeline
async function runNLPPipeline(text) {
    console.log("📊 Starting NLP Pipeline...");
    console.log("📥 Input text:", text);

    const context = {};
    const result = await nlpPipeline.run(text, context);

    console.log("\n📊 Pipeline Results:");
    console.log("✨ Cleaned text:", context.cleaned);
    console.log("😊 Sentiment:", context.sentiment);
    console.log("🌐 Translated text:", context.translated);
    console.log("📜 Summarized text:", result);
    console.log("🏁 Pipeline complete!");
}

// Test our pipeline
runNLPPipeline("Hello world! Today is a good day. The weather is amazing and I feel great.")
    .catch(console.error);