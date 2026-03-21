require('dotenv').config()
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function setupDatabase() {
  try {
    // Connect to PostgreSQL
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Enabled pgvector extension
    await client.query(`CREATE EXTENSION IF NOT EXISTS vector;`)
    console.log('✅ pgvector extension enabled');

    // Create knowledge_chunks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id                SERIAL PRIMARY KEY,
      category          TEXT NOT NULL,
      semester          TEXT,
      additional_info   TEXT,
      content           TEXT NOT NULL,
      embedding         vector(768),
      created_at        TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ knowledge_chunks table created');

    // Create an index for fast vector search
    await client.query(`
      CREATE INDEX IF NOT EXISTS knowledge_embedding_idx
      ON knowledge_chunks
      USING hnsw (embedding vector_cosine_ops);
    `);
    console.log('✅ Vector search index created');

    // Create chat_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_logs (
      id            SERIAL PRIMARY KEY,
      student_query TEXT NOT NULL,
      advisor_reply TEXT NOT NULL,
      created_at    TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ chat_logs table created');

    console.log('\n🎉 Database setup completed!');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
  } finally {
    await client.end();
  }
}

setupDatabase();