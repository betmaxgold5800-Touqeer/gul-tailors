import { GoogleGenerativeAI } from '@google/generative-ai';

// Fetching environment variable strictly for Vite + Vercel pipeline
const API_KEY = import.meta.env.VITE_GEM_API_KEY;

if (!API_KEY) {
  console.error("🚨 CRITICAL CONFIGURATION ERROR: VITE_GEM_API_KEY is not defined in the Vercel/Local panel.");
}

/**
 * Robust JSON extraction and sanitization layer.
 * Recovers data even if the model wraps it inside markdown code blocks.
 */
const safeExtractJSON = (rawString) => {
  if (!rawString || typeof rawString !== 'string') return null;
  try {
    let cleanText = rawString.trim();
    // Strip Markdown wrapper if present
    if (cleanText.includes("```")) {
      cleanText = cleanText.replace(/```json/gi, "").replace(/```/g, "").trim();
    }
    // Remove control characters that break JSON parsing
    cleanText = cleanText.replace(/[\r\n\t]/g, " ");
    
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("No structural structural JSON payload boundaries located.");
    }
    
    const isolatedJson = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(isolatedJson);
  } catch (error) {
    console.error("❌ JSON SANITIZATION & PARSING EXCEPTION:", error.message);
    throw new Error(`Parsing Engine Mismatch: ${error.message}`);
  }
};

/**
 * Main Data Extraction Handler with Multi-Model Fallback Routine.
 * Processes Urdu, Roman Urdu, and English flawlessly.
 */
export const parseTailoringInput = async (textToProcess) => {
  // 1. Guard Clauses for Critical Configurations
  if (!API_KEY) {
    throw new Error("Authentication Refused: API Key configuration missing. Please define VITE_GEM_API_KEY.");
  }
  if (!textToProcess || !textToProcess.trim()) return null;

  // Initialize the verified Google AI client wrapper
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Define the system instructions precisely keeping your existing schema intact
  const systemInstruction = `
    You are an expert tailoring data extraction engine. Parse the given Urdu, Roman Urdu, or English text.
    Extract customer specifications cleanly into the following flat JSON object layout. Do NOT invent values.
    If a value is not mentioned in the text, return null for that specific key. 
    Do not output any introductory or conversational text, return ONLY a valid JSON block.

    Strict JSON Schema:
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

  // 2. Primary Execution Block - Model: gemini-2.5-flash
  try {
    console.log("⚡ Initiating parsing engine with primary model: gemini-2.5-flash");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const rawAiText = result.response.text();

    if (!rawAiText) throw new Error("Empty streaming chunk received from primary engine.");
    return safeExtractJSON(rawAiText);

  } catch (primaryError) {
    console.warn("⚠️ Primary Model Refused or Unavailable. Initializing Fallback Layer...", primaryError.message);

    // 3. Fallback Execution Block - Model: gemini-1.5-flash-latest
    try {
      console.log("🔄 Running recovery fallback model: gemini-1.5-flash-latest");
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const fallbackResult = await fallbackModel.generateContent(prompt);
      const fallbackRawText = fallbackResult.response.text();

      if (!fallbackRawText) throw new Error("Empty streaming chunk received from fallback engine.");
      return safeExtractJSON(fallbackRawText);

    } catch (fallbackError) {
      // 4. Ultimate Production Error Aggregation
      console.error("🛑 ALL MODEL ENDPOINTS CRASHED PERMANENTLY:", fallbackError.message);
      throw new Error(`Gemini Engine Request Refused: All allocated parsing models failed or API quota hit. Details: ${fallbackError.message}`);
    }
  }
};
