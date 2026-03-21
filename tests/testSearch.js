const { searchKnowledge } = require('../vectorSearch');

async function test() {
  // Test 1: Direct question
  console.log('\n=== Test 1: Direct Question ===');
  const results1 = await searchKnowledge(
    "What courses do I register for 100 level?"
  );
  results1.forEach(r => {
    console.log(`📌 ${r.category} | Similarity: ${r.similarity.toFixed(3)}`);
    console.log(`   ${r.content.substring(0, 100)}...`);
  });

  // Test 2: Different wording, same meaning
  console.log('\n===Test 2: Different Wording ===');
  const results2 = await searchKnowledge(
    "How do I enrol for classes this semester?"
  );
  results2.forEach(r => {
    console.log(`📌 ${r.category} | Similarity: ${r.similarity.toFixed(3)}`);
    console.log(`   ${r.content.substring(0, 100)}...`);
  });

  // Test 3: Completely unrelated question
  console.log('\n===Test 3: Unrelated Question ===');
  const results3 = await searchKnowledge(
    "What is the best restuarant in Laogs?"
  );
  results3.forEach(r => {
    console.log(`📌 ${r.category} | Similarity: ${r.similarity.toFixed(3)}`);
  });

  process.exit(0)
}

test();