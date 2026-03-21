const { getAdvisorResponse } = require('../ragEngine');

async function test() {
  const questions = [
    "What courses do I register for 100 level rain semester?",
    "How do I apply for leave of absence?",
    "How can I get a scholarship?",
    "What is the best restuarant in Lagos?" // should say "I don't know"
  ];

  for (const question of questions) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`❓ Question: ${question}`);
    console.log('='.repeat(60));

    const response = await getAdvisorResponse(question);

    if (typeof response === 'string') {
      console.log(`💬 Answer: ${response}`);
    } else {
      console.log(`💬 Answer: ${response.answer}`);
      console.log(`📚 Sources: ${response.sources.join(', ')}`);
      console.log(`📊 Similarity: ${response.similarity.join(', ')}`);
    }
  }

  process.exit(0);
}

test();