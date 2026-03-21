require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { searchKnowledge } = require('./vectorSearch');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System instructions for the advisor
const SYSTEM_INSTRUCTIONS = `
You are a University course advisor. Answer student questions
based ONLY on the information below. If you cannot find the Answer
in the information provided, simply say "I don't know, please contact
your academic adviser"

Always respond in a friendly human non-chat bot style, professional tone
like a real course advisor.
Never start your response with greetings like "Hi there", "Hello there", "Hi", "Hello!" or
any similar opening phrase.
When you ask a follow-up question, Do not add "Is there anything else I can help you with?" in order
to keep the conversation in flow
Go straight to answering the question directly.
Tabulate course listing and similar answers.
End responses by asking if there is anything else you can help with.
Never make up information not found in the context.
`;

async function getAdvisorResponse(question, history = []) {
  try {
    // Build a context-aware search query
    // Combine last exchange + current question for better search
    const searchQuery = history.length > 0
      ? `${history[history.length - 2]?.content || ''} ${question}`
      : question;

    // Step 1: Search for relevant knowledge chunks
    const relevantChunks = await searchKnowledge(searchQuery, 3);

    // Step 2: Handle case where no relevant chunks found
    if (relevantChunks.length === 0) {
      return "I don't know, please contact your academic adviser for help with that.";
    }

    // Step 3: Build context from retrieved chunks
    const context = relevantChunks
      .map((chunk, index) => `
        [Source ${index + 1}]
        Category: ${chunk.category}
        information: ${chunk.content}
      `)
      .join(`\n---\n`);
    
    // Step 4: Build conversation history string
    const historyText = history.length > 0
      ? history
          .slice(-6)  // Only use last 6 messages to keep prompt concise
          .map(h => `${h.role === 'user' ? 'Student' : 'Advisor'}: ${h.content}`)
          .join('\n')
      : '';
    
    // Step 5: Build the full prompt
    const prompt = `
      ${SYSTEM_INSTRUCTIONS}

      === RELEVANT CONTEXT ===
      ${context}
      === END CONTEXT ===

      ${historyText ? `=== CONVERSATION HISTORY ===
      ${historyText}
      === END HISTORY ===` : ''}

      Student Question: ${question}
    `;

    // Step 5: Send to Gemini and get response
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const result= await model.generateContent(prompt);
    const response = result.response.text();

    // Step 6: Return answer with sources for transparency
    return {
      answer: response,
      sources: relevantChunks.map(c => c.category),
      similarity: relevantChunks.map(c => c.similarity.toFixed(3))
    };
  } catch (error) {
    console.error('❌ RAG Engine error:', error.message);
    throw error;
  }
}

module.exports = { getAdvisorResponse };
