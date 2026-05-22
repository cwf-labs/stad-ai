const MODELS = {
  ollama: {
    provider: 'ollama',
    label: 'Llama 3.2 3B (Local)',
    model: 'llama3.2:3b',
    description: 'Runs locally. Free, private.',
    available: true
  },
  gemma: {
    provider: 'ollama',
    label: 'Gemma 3 1B (Local - Fastest)',
    model: 'gemma3:1b',
    description: 'Fastest local model. Great for simple questions.',
    available: true
  },
  grok_fast: {
    provider: 'grok',
    label: 'Grok 4.1 Fast',
    model: 'grok-4-1-fast',
    description: 'Powerful reasoning.',
    available: !!process.env.XAI_API_KEY,
  },
  grok: {
    provider: 'grok',
    label: 'Grok 4',
    model: 'grok-4',
    description: 'Powerful reasoning.',
    available: !!process.env.XAI_API_KEY,
  },
  gemini_flash_lite: {
    provider: 'gemini',
    label: 'Gemini 2.5 Flash Lite',
    model: 'gemini-2.5-flash-lite',
    description: 'Fast and capable. Free tier available.',
    available: true
  },
  gemini_flash: {
    provider: 'gemini',
    label: 'Gemini 2.5 Flash',
    model: 'gemini-2.5-flash',
    description: 'More powerful. Better for complex questions.',
    available: true
  },
  openai: {
    provider: 'openai',
    label: 'GPT-4o Mini',
    model: 'gpt-4o-mini',
    description: 'OpenAI model. Requires API key.',
    available: !!process.env.OPENAI_API_KEY
  }
}

module.exports = MODELS;
