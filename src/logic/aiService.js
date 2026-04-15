/**
 * Service to handle communication with the Hugging Face Router API.
 */
export const getAIResponse = async (query, contextSnippet) => {
  const HF_ROUTER_URL = "https://router.huggingface.co/v1/chat/completions";
  const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

  if (!HF_TOKEN) {
    console.error("HF Token missing! Check your .env file.");
    throw new Error("Missing API configuration.");
  }

  // Construct the system prompt with context from our knowledge base
  const systemPrompt = `
    You are Academia AI, the official assistant for our college.
    
    GUIDELINES:
    1. PRIORITIZE the "KNOWLEDGE BASE CONTEXT" provided below.
    2. If the answer is directly in the context, provide it precisely.
    3. If the context is missing or partial, answer using your general knowledge but add a disclaimer: 
       "Based on general information (please verify with the admin office for official policy)..."
    4. Maintain a helpful, respectful, and professional tone at all times.
    5. If you are extremely unsure, suggest the user contact info@college.edu.
    
    KNOWLEDGE BASE CONTEXT:
    ${contextSnippet}
    
    Answer clearly and professionally.
  `;

  try {
    const response = await fetch(HF_ROUTER_URL, {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        model: "openai/gpt-oss-20b:groq",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch from AI service");
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      type: 'bot',
      intent: 'rag-response'
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    return {
      text: `Sorry, I encountered an error: ${error.message}. Please try again later.`,
      type: 'bot',
      intent: 'error'
    };
  }
};
