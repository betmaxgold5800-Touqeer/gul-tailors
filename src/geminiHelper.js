const API_KEY = import.meta.env.VITE_GEM_API_KEY;

if (!API_KEY) {
  console.error("🚨 CRITICAL CONFIGURATION ERROR: VITE_GEM_API_KEY is missing.");
}

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
      throw new Error("Invalid structure: No JSON block found.");
    }
    const isolatedJson = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(isolatedJson);
  } catch (error) {
    console.error("❌ JSON PARSING EXCEPTION:", error.message);
    throw new Error(`Parsing Mismatch: ${error.message}`);
  }
};

export const parseTailoringInput = async (textToProcess) => {
  if (!API_KEY) {
    throw new Error("API Key configuration missing. Please define VITE_GEM_API_KEY.");
  }
  if (!textToProcess || !textToProcess.trim()) return null;

  const systemInstruction = `
    You are an expert tailoring data extraction engine. Parse the given Urdu or English text.
    Extract customer specifications cleanly into the following flat JSON object layout. Do NOT invent values.
    If a value is not mentioned, return null for that key.
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

  // 🛠️ SENIOR ARCHITECTURE: Direct Stable Production Endpoint (Strictly v1)
  const endpoint = `[https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=$](https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=$){API_KEY}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemInstruction}\n\nInput Text:\n"${textToProcess}"` }]
        }]
      })
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      throw new Error(errorPayload?.error?.message || `HTTP Error ${response.status}`);
    }

    const outputData = await response.json();
    const rawAiText = outputData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawAiText) throw new Error("Empty response from Gemini.");

    return safeExtractJSON(rawAiText);
  } catch (err) {
    console.error("🛑 FETCH ENGINE FAULT:", err.message);
    throw err;
  }
};
