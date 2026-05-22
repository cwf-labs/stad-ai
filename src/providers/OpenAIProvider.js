require('dotenv').config();
const BaseLLMProvider = require('./BaseLLMProvider');

class OpenAIProvider extends BaseLLMProvider {
  constructor(config) {
    super(config);

    // Lazy load to avoid errors if openai package is not installed
    const OpenAI = require('openai');
    this.client = new OpenAI({ apiKey: process.env.OpenAI_API_KEY });
  }

  async generateResponse(prompt, history = []) {
    const historyText = this.formatHistory(history);

    const messages = [
      { role: 'system', content: prompt },
      ...(historyText ? [{ role: 'user', content: historyText }] : [])
    ];

    const response = await this.client.chat.completions.create({
      model: this.config.model,
      messages,
      max_token: 1000
    });

    return response.choices[0].message.content;
  }
}

module.exports = OpenAIProvider;