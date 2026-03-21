require('dotenv').config();
const express = require('express');
const { getAdvisorResponse } = require('./ragEngine');

const app = express();
app.use(express.json());

// Server static files (our frontend)
app.use(express.static('public'));

// This is the API endpoint students' messages are sent to
app.post('/chat', async(req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        reply: "Please type a question."
      });
    }
    const response = await getAdvisorResponse(message);

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