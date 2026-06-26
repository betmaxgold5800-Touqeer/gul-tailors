// Fetching verified environment variables explicitly for Vite bundle lifecycle
const API_KEY = import.meta.env.VITE_GEM_API_KEY;

if (!API_KEY) {
  console.error("🚨 CRITICAL LIFE-CYCLE EXCEPTION: VITE_GEM_API_KEY is missing from Vercel variables panel.");
}

/**
 * Sanitizes and safely extracts native JSON streams from generative text blocks.
 * Recovers structure even if model inserts Markdown boundaries.
 */
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
      throw new Error("No architectural structural boundaries found inside return stream.");
    }
    const isolatedJson = cleanText.substring(firstBrace, lastBrace + 1);
    return JSON.parse(isolatedJson);
  } catch (error) {
    console.error("❌ INTERNAL STREAM PARSING FAULT:", error.message);
    throw new Error(`Data Parser Structure Mismatch: ${error.message}`);
  }
};

/**
 * Native Content Generation Wrapper mapped directly for Vercel Serverless Deployments.
 * Handles Urdu, Roman Urdu, and English input text.
 */
export const parseTailoringInput = async (textToProcess) => {
  if (!API_KEY) {
    throw new Error("Authentication Bridge Failed: API Key variable is undefined inside build script.");
  }
  if (!textToProcess || !textToProcess.trim()) return null;

  // Preserving your exact structural business criteria schema layout
  const systemInstruction = `
    You are an expert tailoring data extraction engine. Parse the given Urdu, Roman Urdu, or English text.
    Extract customer specifications cleanly into the following flat JSON object layout. Do NOT invent values.
    If a value is not mentioned, return null for that key. Do not output anything else except valid JSON.
    
    Expected JSON Structure:
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

  // Explicit version routing target with correct engine matrix mapping
  const primaryEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
  const backupEndpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const payloadConfiguration = {
    contents: [{
      parts: [{ text: `${systemInstruction}\n\nInput Processing Target Data:\n"${textToProcess}"` }]
    }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  };

  // Primary Run Routing Lifecycle
  try {
    const response = await fetch(primaryEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadConfiguration)
    });

    if (response.status === 404 || !response.ok) {
      throw new Error(`Primary Endpoint Destination Refused with status code ${response.status}`);
    }

    const outputData = await response.json();
    const rawAiText = outputData?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawAiText) throw new Error("Empty processing chunk returned from data center.");

    return safeExtractJSON(rawAiText);

  } catch (primaryError) {
    console.warn("⚠️ Primary Execution Node failed or route was unmapped. Shifting traffic to stable layer...", primaryError.message);
    
    // Fallback Run Routing Lifecycle (Direct Mirror Pipeline Strategy)
    try {
      const fallbackResponse = await fetch(backupEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadConfiguration)
      });

      if (!fallbackResponse.ok) {
        const errorDetails = await fallbackResponse.json().catch(() => ({}));
        throw new Error(errorDetails?.error?.message || `HTTP Gateway State ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      const fallbackRawText = fallbackData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!fallbackRawText) throw new Error("Empty backup stream processed.");

      return safeExtractJSON(fallbackRawText);

    } catch (fallbackError) {
      console.error("🛑 ALL ALLOCATED PRODUCTION DEPLOYMENT ROUTES CRASHED:", fallbackError.message);
      throw new Error(`Parsing matrix fault: Gemini Engine Request Refused: All connection pooling options failed. Details: ${fallbackError.message}`);
    }
  }
};
