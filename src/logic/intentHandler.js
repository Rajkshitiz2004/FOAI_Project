import faqData from '../data/faqData.json';

const INTENTS = {
  HOSTEL_INFO: 'hostel_info',
  FEES_INFO: 'fees_info',
  COURSE_INFO: 'course_info',
  HOSTEL_FEES: 'hostel_fee_info',
  CLARIFY_FEES: 'clarify_fees',
  FALLBACK: 'fallback'
};

/**
 * Simulates intent classification based on keywords and rules.
 */
export const classifyIntent = (query) => {
  const q = query.toLowerCase();

  // Rule 1: Conditional Routing (Combo Intents)
  if (q.includes('fees') && q.includes('hostel')) {
    return INTENTS.HOSTEL_FEES;
  }

  // Rule 2: Vague Query Handling
  if (q === 'fees' || q === 'payment' || q === 'price') {
    return INTENTS.CLARIFY_FEES;
  }

  // Rule 3: Keyword mapping
  if (q.includes('hostel') || q.includes('stay') || q.includes('accommodation')) {
    return INTENTS.HOSTEL_INFO;
  }
  if (q.includes('fees') || q.includes('payment') || q.includes('cost')) {
    return INTENTS.FEES_INFO;
  }
  if (q.includes('course') || q.includes('branch') || q.includes('syllabus') || q.includes('major')) {
    return INTENTS.COURSE_INFO;
  }

  return INTENTS.FALLBACK;
};

/**
 * Classifies the query and retrieves relevant context from the FAQ knowledge base.
 * Improved: Uses word-overlap scoring on both questions and keywords.
 */
export const getQueryContext = (query) => {
  const qStr = query.toLowerCase();
  const qWords = qStr.split(/\W+/).filter(w => w.length > 2); // Filter short noise words
  
  const matches = [];

  faqData.faqs.forEach(faq => {
    let score = 0;
    
    // 1. Check Keywords (high priority)
    faq.keywords.forEach(k => {
      if (qStr.includes(k.toLowerCase())) score += 3;
    });

    // 2. Check individual word overlap with question and keywords
    const searchString = `${faq.question} ${faq.keywords.join(' ')}`.toLowerCase();
    qWords.forEach(word => {
      if (searchString.includes(word)) score += 1;
    });

    if (score > 1) {
      matches.push({ score, text: `Q: ${faq.question} A: ${faq.answer}` });
    }
  });

  // Sort by score and take top 4 items for more context
  const topMatches = matches
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(m => m.text)
    .join("\n\n");

  return topMatches || "Note: No direct matches found in local knowledge base. Answer to the best of your general ability while staying professional.";
};

/**
 * Legacy handleQuery kept for sync Fallback support if needed.
 */
export const handleQuery = (query) => {
  return {
    text: "I'm processing your request with my AI brain...",
    type: 'bot',
    intent: 'loading'
  };
};

/**
 * Finds the best match from the FAQ JSON based on keywords.
 */
export const findBestMatch = (query, category) => {
  const q = query.toLowerCase();
  let bestMatch = null;
  let maxMatches = 0;

  const searchPool = category 
    ? faqData.faqs.filter(f => f.category === category)
    : faqData.faqs;

  for (const faq of searchPool) {
    let matchCount = 0;
    for (const keyword of faq.keywords) {
      if (q.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    
    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestMatch = faq;
    }
  }

  if (bestMatch && maxMatches > 0) {
    return bestMatch;
  }

  return null;
};
