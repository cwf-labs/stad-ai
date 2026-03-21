require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const knowledgeBase = require('./knowledgeBase');

const app = express();
app.use(express.json());

// Server static files (our frontend)
app.use(express.static('public'));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: knowledgeBase
});

// This is the API endpoint students' messages are sent to
app.post('/chat', async(req, res) => {
  try {
    const { message } = req.body;
    const result = await model.generateContent(message);
    const response = result.response.text();
    res.json({ reply: response });
  } catch (error) {
    console.log(error)
    res.status(500).json({ reply: "Sorry, something went wrong. Please try again."})
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('STAD AI Course Advisor is running at http://localhost:3000');
})