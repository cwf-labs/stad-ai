// This is the factory that creates the right provider based on the selected model:
const MODELS = require('../config/models');
const GeminiProvider = require('./GeminiProvider');
const OpenAIProvider = require('./OpenAIProvider');
const OllamaProvider = require('./OllamaProvider');
const GrokProvider = require('./GrokProvider');

const PROVIDER_MAP = {
  ollama: OllamaProvider,
  gemini: GeminiProvider,
  openai: OpenAIProvider,
  grok: GrokProvider
};

function createProvider(modelKey) {
  const modelConfig = MODELS[modelKey];

  if (!modelConfig) {
    throw new Error(`Unknown model: ${modelKey}`);
  }

  if (!modelConfig.available) {
    throw new Error(`Model ${modelConfig.label} is not available. Check your API keys.`);
  }

  const ProviderClass = PROVIDER_MAP[modelConfig.provider];

  if (!ProviderClass) {
    throw new Error(`No provider found for: ${modelConfig.provider}`);
  }

  return new ProviderClass(modelConfig);
}

module.exports = { createProvider };