require('dotenv').config();
const { Client } = require('pg');
const { generateEmbedding } = require('./embeddings');
const ExcelJS = require('exceljs');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});


function extractText(value) {
  if (!value) return '';
  if (typeof value === 'object' && value.richText) {
    return value.richText.map(r => r.text).join('');
  }
  if (typeof value === 'object' && value.result) {
    return String(value.result);
  }
  return String(value);
}

async function loadDataIntoDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Read Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./StadDataTable.xlsx');
    const sheet = workbook.worksheets[0];
    
    // Get headers from first row
    const headers = [];
    sheet.getRow(1).eachCell((cell) => {
      headers.push(cell.value || '');
    });

    // Convert rows to array of objects
    const rows = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      const rowObj = {};
      row.eachCell((cell, colNumber) => {
        rowObj[headers[colNumber - 1]] = extractText(cell.value) || '';
      });
      rows.push(rowObj);
    })

    // Clear existing data to avoid duplicates
    await client.query('TRUNCATE TABLE knowledge_chunks RESTART IDENTITY;');

    // Loop through each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Extract the relevant columns
      const category          = row['Category'] || '';
      const semester          = row['Semester'] || '';
      const additional_info   = row['Additional information'] || '';
      const content           = row['Response'] || '';

      // Skip empty rows
      if (!content) continue;

      // Create a combined text for embedding
      // (combining category + content gives better search results)
      const textToEmbed = `${category} ${semester} ${additional_info} ${content}`;

      // Generate embedding for this row
      const embedding = await generateEmbedding(textToEmbed);

      // Store in database
      await client.query(
        `INSERT INTO knowledge_chunks
        (category, semester, additional_info, content, embedding)
        VALUES ($1, $2, $3, $4, $5)`,
        [category, semester, additional_info, content, JSON.stringify(embedding)]
      );

      console.log(`✅ Loaded row ${i + 1}/${rows.length}: ${category}`);

      // Small delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉  All data loaded successfully!');
  } catch (error) {
    console.error('❌ Error loading data:', error.message);
  } finally {
    await client.end();
  }
}

loadDataIntoDatabase();