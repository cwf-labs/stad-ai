class BaseLLMProvider {
  constructor(config) {
    if (new.target === BaseLLMProvider) {
      throw new Error('BaseLLMProvider is abstract and cannot be instantiated directly.');
    }
    this.config = config;
  }

  // Every provider must implement this method
  async generateResponse(prompt, history = []) {
    throw new Error(`generateResponse() must be implemented by ${this.constructor.name}`)
  }

  // Helper to format conversation history into readable string
  formatHistory(history) {
    if (!history || history.length === 0) return '';

    return history
      .slice(-6) // Last 6 messages
      .map(h => `${h.role === 'user' ? 'Student' : 'Advisor'}: ${h.content}`)
      .join('\n');
  }
}

module.exports = BaseLLMProvider;
