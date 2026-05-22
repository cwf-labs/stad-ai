require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const BaseLLMProvider = require('./BaseLLMProvider');

class GeminiProvider extends BaseLLMProvider {
  constructor(config) {
    super(config)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: config.model })
  }
  
  async generateResponse(prompt, history = []) {
    const historyText = this.formatHistory(history);

    const fullPrompt = historyText
      ? `${prompt}\n\n===CONVERSATION HISTORY ===\n${historyText}`
      : prompt;
    
    const result = await this.model.generateContent(fullPrompt);
    return result.response.text();
  }
}

module.exports = GeminiProvider;