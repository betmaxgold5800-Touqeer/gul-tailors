import { GoogleGenAI } from '@google/generative-ai';

// Vercel aur Local dono ke liye correct variable key verify karna
const API_KEY = import.meta.env.VITE_GEM_API_KEY;

if (!API_KEY) {
  console.error("🚨 CRITICAL CONFIGURATION ERROR: VITE_GEM_API_KEY is missing in your panel.");
}

// JSON data ko safely clean aur parse karne ka behtareen helper
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
      throw new Error("Invalid output layout: No structural json boundaries located.");
    }
    const isolatedJson = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(isolatedJson);
  } catch (error) {
    console.error("❌ JSON PARSING EXCEPTION:", error.message);
    throw new Error(`Parsing Engine Mismatch: ${error.message}`);
  }
};

export const parseTailoringInput = async (textToProcess) => {
  if (!API_KEY) {
    throw new Error("API Key configuration mismatch. Please define VITE_GEM_API_KEY.");
  }
  if (!textToProcess || !textToProcess.trim()) return null;

  try {
    // 🛠️ USING OFFICIAL GOOGLE SDK - ELIMINATES ALL 404 URL ROUTING ISSUES FOREVER
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Using the absolute standard production model
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      You are an expert tailoring data extraction engine. Parse the given Urdu or English text.
      Extract customer specifications cleanly into the following flat JSON object layout. Do NOT invent values.
      If a value is not mentioned, return null for that key.
      
      Expected Response Format (Strict JSON):
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

    const prompt = `${systemInstruction}\n\nInput Text to Parse:\n"${textToProcess}"`;

    const result = await model.generateContent(prompt);
    const rawAiText = result.response.text();

    if (!rawAiText) throw new Error("Empty processing stream returned from Google Gemini.");

    return safeExtractJSON(rawAiText);
  } catch (err) {
    console.error("🛑 GEMINI SYSTEM INTEGRATION BRIDGE FAULT:", err.message);
    throw err; 
  }
};
