require('dotenv').config();
const pool = require('../db/pgClient');
const { generateEmbedding } = require('./embeddingService');

const SIMILARITY_THRESHOLD = 0.7;

async function searchKnowledge(question, topK = 3) {
  // Step 1: Convert question to embedding
  console.log(`🔍 Searching for: "${question}"`);
  const questionEmbedding = await generateEmbedding(question);

  // Step 2: Search database for most similar chunks
  // The <=> operator is pgvector's cosine distance operator
  const result = await pool.query(`
    SELECT
      category,
      semester,
      additional_info,
      content,
      1 - (embedding <=> $1::vector) AS similarity
    FROM knowledge_chunks
    ORDER BY embedding <=> $1::vector
    LIMIT $2;`, [JSON.stringify(questionEmbedding), topK]);
  
  // Step 3: Return the matching chunks
  const relevantChunks = result.rows.filter(
    row => row.similarity >= SIMILARITY_THRESHOLD
  );

  if (relevantChunks.length === 0) {
    console.log('⚠️ No relevant chunks found above threshold');
  }

  return relevantChunks;
}

module.exports = { searchKnowledge };