/**
 * PRODUCTION-GRADE GEMINI AI ASSISTANCE UTILITY
 * Gul Tailors Digital Ecosystem Pipeline
 */

// FIX 5: Validate Environment Variables before execution
const API_KEY = import.meta.env.VITE_GEM_API_KEY;

if (!API_KEY) {
  console.error("🚨 CRITICAL CONFIGURATION ERROR: VITE_GEM_API_KEY is not defined in the environment variables setup.");
}

/**
 * Clean and isolate raw string blocks to extract pure JSON structures.
 * FIX 4: Handles Markdown code fences, carriage returns, trailing whitespaces, and unexpected outer wrappers.
 * @param {string} rawString 
 * @returns {object|null}
 */
const safeExtractJSON = (rawString) => {
  if (!rawString || typeof rawString !== 'string') return null;

  try {
    let cleanText = rawString.trim();

    // Remove markdown json block wrappers if present
    if (cleanText.includes("```")) {
      cleanText = cleanText.replace(/```json/gi, "").replace(/```/g, "").trim();
    }

    // Clean up invisible carriage returns, tabs, and line breaks that break JSON specs
    cleanText = cleanText.replace(/[\r\n\t]/g, " ");

    // Isolate structural json scope bound by outermost curly braces
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Invalid output layout: No structural json payload boundaries located.");
    }

    const isolatedJson = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(isolatedJson);
  } catch (error) {
    // FIX 6: Detailed production debugging telemetry logging
    console.error("❌ JSON SANITIZATION & PARSING PIPELINE EXCEPTION:", error.message, "-> Raw Text:", rawString);
    throw new Error(`Parsing Engine Mismatch: ${error.message}`);
  }
};

/**
 * Connects with the Gemini Engine to process raw text/audio data into standard structures.
 * @param {string} textToProcess 
 * @returns {Promise<object>} Highly structured normalized tailors format
 */
export const parseTailoringInput = async (textToProcess) => {
  // FIX 5: Explicit runtime validation crash protection
  if (!API_KEY) {
    throw new Error("API Key configuration mismatch. Please define VITE_GEM_API_KEY in your deployment panel environment variable matrix.");
  }

  if (!textToProcess || !textToProcess.trim()) {
    return null;
  }

  // Production system prompt enforcing key architecture
  const systemInstruction = `
    You are an expert tailoring data extraction engine. Parse the given Urdu (written in Latin/Roman script or Nastaliq) or English text.
    Extract customer specifications cleanly into the following flat JSON object layout. 
    Do NOT invent values. Leave unknown or unmentioned parameters completely absent from your JSON response.
    
    Expected JSON Structure:
    {
      "customer_name": "string or null",
      "phone_number": "string or null",
      "total_suits": "number or null",
      "silayi": "number or null",
      "pKarhayi": "number or null",
      "gKarhayi": "number or null",
      "delivery_date": "YYYY-MM-DD string or null",
      "is_urgent": "boolean or null",
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
    // FIX 6: Robust fetch client fallback matching Google API protocols directly
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemInstruction}\n\nInput Text to Parse:\n"${textToProcess}"`
          }]
        }]
      })
    });

    if (!response.ok) {
      // FIX 6: HTTP level error analysis and custom metrics
      const errorPayload = await response.json().catch(() => ({}));
      const errorMessage = errorPayload?.error?.message || `HTTP Server Exception Code ${response.status}`;
      throw new Error(`Gemini Engine Request Refused: ${errorMessage}`);
    }

    const outputData = await response.json();
    const rawAiText = outputData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawAiText) {
      throw new Error("Empty processing stream returned from Google Gemini endpoint.");
    }

    // Process output securely via our clean execution sandbox
    const validatedJson = safeExtractJSON(rawAiText);
    return validatedJson;

  } catch (err) {
    // FIX 6: Propagate meaningful explicit errors up to the UI Layer
    console.error("🛑 GEMINI SYSTEM INTEGRATION BRIDGE FAULT:", err.message);
    throw err; 
  }
};
