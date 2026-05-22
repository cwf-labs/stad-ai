require('dotenv').config();
const express = require('express');
const { getAdvisorResponse } = require('./src/services/ragEngine');
const MODELS = require('./src/config/models');

const app = express();
app.use(express.json());
// Server static files (our frontend)
app.use(express.static('public'));

// Endpoint to get available models for the frontend
app.get('/models', (req, res) => {
  const availableModels = Object.entries(MODELS)
    .filter(([key, m]) => m.available)
    .map(([key, m]) => ({
      key,
      label: m.label,
      description: m.description
    }));

    res.json(availableModels);
});

// This is the API endpoint students' messages are sent to
app.post('/chat', async(req, res) => {
  try {
    const { message, history = [], modelKey = 'ollama' } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        reply: "Please type a question."
      });
    }
    const response = await getAdvisorResponse(message, history, modelKey);

    // Handle both string and object responses
    const reply = typeof response === 'string'
      ? response
      : response.answer;

    res.json({ reply });
  } catch (error) {
    console.log('Server error: ', error.message)
    res.status(500).json({ reply: "Sorry, something went wrong. Please try again."})
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('STAD AI Course Advisor is running at http://localhost:3000');
})