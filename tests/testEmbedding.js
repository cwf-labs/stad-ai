const { generateEmbedding } = require('../src/services/embeddingService');

async function test() {
  console.log('Generating embedding for test sentence...');

  const embedding = await generateEmbedding(
    "What courses do I register for 100 level?"
  );

  console.log('✅ Embedding generated!');
  console.log(`📐 Dimensions: ${embedding.length}`);
  console.log(`🔢 First 5 values: ${embedding.slice(0, 5)}`);
}

test();