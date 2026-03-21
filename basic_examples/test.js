// Load environment variables
require('dotenv').config()

// Import the Gemini library
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Create a connection to Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: knowledgeBase
});

// This is the main function that talks to Gemini
async function askGemini(question) {
  const result = await model.generateContent(question);
  const response = result.response.text();
  console.log("Advisor says:", response);
}

// Ask Gemini a test question
askGemini("What MTH courses do I need in 500 Level Harmattan semester?");