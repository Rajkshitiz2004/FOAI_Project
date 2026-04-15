import { handleQuery } from './src/logic/intentHandler.js';

const testQueries = [
  "What is the hostel fee?", // Combined
  "fees",                    // Vague
  "Tell me about CS",        // Keyword match
  "How to apply?",          // FAQ match
  "blah blah"               // Fallback
];

console.log("--- Testing Chatbot Logic ---");
testQueries.forEach(q => {
  const res = handleQuery(q);
  console.log(`Query: ${q}`);
  console.log(`Response: ${res.text}`);
  console.log('---');
});
