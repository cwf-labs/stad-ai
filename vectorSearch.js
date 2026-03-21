require('dotenv').config();
const { Client } = require('pg');
const { generateEmbedding } = require('./embeddings');

const SIMILARITY_THRESHOLD = 0.7;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
}

async function searchKnowledge(question, topK = 3) {
  await connectDB();

  // Step 1: Convert question to embedding
  console.log(`🔍 Searching for: "${question}"`);
  const questionEmbedding = await generateEmbedding(question);

  // Step 2: Search database for most similar chunks
  // The <=> operator is pgvector's cosine distance operator
  const result = await client.query(`
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