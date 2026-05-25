require('dotenv').config();
const BaseLLMProvider = require('./BaseLLMProvider');

class OllamaProvider extends BaseLLMProvider {
  constructor(config) {
    super(config);
    this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
  }

  async generateResponse(prompt, history = []) {
    const historyText = this.formatHistory(history);

    const fullPrompt = historyText
      ? `${prompt}\n\n=== CONVERSATION HISTORY ===\n${historyText}`
      : prompt;

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.config.model,
        prompt: fullPrompt,
        stream: false,
        system: "/no_think",
        options: {
          chat_template_kwargs: { enable_thinking: false },
          num_thread: 8
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Ollama error: ${data.error}`);
    }

    return data.response;
  }
}

module.exports = OllamaProvider;