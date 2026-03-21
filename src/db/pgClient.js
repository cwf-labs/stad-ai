// Single DB Connection
require('dotenv').config();
const { Pool } = require('pg');

// Use Pool instead of Client for better connection management
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,    // Maximum 10 concurrent connections
  idleTimeoutMillis: 30000
});

pool.on('error', (err) => {
  console.error('Unexpected DB error:', err.message);
});

module.exports = pool;