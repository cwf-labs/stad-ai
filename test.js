// Load environment variables
require('dotenv').config()

// Import the Gemini library
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Create a connection to Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This is your knowledge base - your course advsiory context
const knowledgeBase = `
You are a University course advisor. Answer student questions
based ONLY on the information below. If you cannot find the Answer
in the information provided, simply say "I don't know, please contact
your academic advister"

Always respond in a friendly human non-chat bot style, professional tone
like a real course advisor.

Here is the knowledge base:
=== KNOWLEDGE BASE START ===

For 100 Level Rain Semester, students register:
MTH102 - Elementary Mathematics II - 5 units
MTH104 - Vector - 2 units
PHY102 - General Physics II - 3 units
PHY108 - Experimental Physics IB - 1 unit
CHM102 - Introductory Chemistry II - 4 units
CHM104 - Practical Chemistry II - 1 unit
CSC102 - Introduction to Computing II - 2 units
SER001 - Use of English - 4 units
Special Electives - 2 units

For Leave of Absence: You must write a letter clearly stating 
reasons (financial, family or health). Submit during normal 
registration period, not later than 2 weeks after lectures begin.

For Scholarship and Financial Assistance: Contact the Division 
of Students Affairs (DSA). Check notice boards at your Faculty 
and the DSA Building for advertisements.

For Research Opportunities: See your Academic Adviser or Head 
of Department.

=== KNOWLEDGE BASE END ===

`

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