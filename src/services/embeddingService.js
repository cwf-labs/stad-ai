require('dotenv').config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This function converts any text into a vector embedding
async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-embedding-001"
    });

    const result = await model.embedContent({
      content: { parts: [{ text: text }], role: "user" },
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: 768
    });
    
    return result.embedding.values;

  } catch (error) {
    console.error('❌ Error generating embedding:', error.message);
    throw error;
  }
}

module.exports = { generateEmbedding };
