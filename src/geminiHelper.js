const API_KEY = import.meta.env.VITE_GEM_API_KEY;

if (!API_KEY) {
  console.error("🚨 CRITICAL CONFIGURATION ERROR: VITE_GEM_API_KEY is missing in production environment.");
}

// JSON boundaries locate aur parse karne ka static helper
const safeExtractJSON = (rawString) => {
  if (!rawString || typeof rawString !== 'string') return null;
  try {
    let cleanText = rawString.trim();
    if (cleanText.includes("```")) {
      cleanText = cleanText.replace(/```json/gi, "").replace(/```/g, "").trim();
    }
    cleanText = cleanText.replace(/[\r\n\t]/g, " ");
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Invalid output layout: No explicit structural json block bounded.");
    }
    const isolatedJson = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(isolatedJson);
  } catch (error) {
    console.error("❌ PARSING MATRIX EXCEPTION:", error.message);
    throw new Error(`Parsing Engine Mismatch: ${error.message}`);
  }
};

export const parseTailoringInput = async (textToProcess) => {
  if (!API_KEY) {
    throw new Error("API Key configuration mismatch. Please define VITE_GEM_API_KEY.");
  }
  if (!textToProcess || !textToProcess.trim()) return null;

  const systemInstruction = `
    You are an expert tailoring data extraction engine. Parse the given Urdu or English text.
    Extract customer specifications cleanly into the following flat JSON object layout. Do NOT invent values.
    If a value is not mentioned, return null for that key. Do not output anything else except valid JSON.
    
    {
      "lambaai": "string/number or null",
      "teera": "string/number or null",
      "baazu": "string/number or null",
      "ghera": "string/number or null",
      "shalwar": "string/number or null",
      "paincha": "string/number or null",
      "asan": "string/number or null",
      "galla": "string/number or null"
    }
  `;

  try {
    // 🔥 FORCED EXPLICIT PRODUCTION ROUTING DIRECT TO STABLE V1 REPOSITORY
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemInstruction}\n\nInput Text to Parse:\n"${textToProcess}"` }]
        }]
      })
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      const errorMessage = errorPayload?.error?.message || `HTTP Server Gateway Error ${response.status}`;
      throw new Error(`Gemini Engine Request Refused: ${errorMessage}`);
    }

    const outputData = await response.json();
    const rawAiText = outputData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawAiText) throw new Error("Empty processing stream returned from Google Gemini.");

    return safeExtractJSON(rawAiText);
  } catch (err) {
    console.error("🛑 GEMINI SYSTEM INTEGRATION BRIDGE FAULT:", err.message);
    throw err; 
  }
};
