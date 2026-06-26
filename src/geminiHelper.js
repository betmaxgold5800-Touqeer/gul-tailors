import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEM_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Safe JSON Parsing Utility to prevent crashes
const safeJsonParse = (str) => {
  try {
    // Clean any hidden unicode line terminators or backslash issues
    let cleanStr = str
      .replace(/[\u0000-\u0019]+/g, "")
      .replace(/^```json/i, "")
      .replace(/```$/, "")
      .trim();
    return JSON.parse(cleanStr);
  } catch (e) {
    console.error("JSON Clean Parse Error:", e);
    // Regex fallback if JSON parsing still complains about a specific character
    try {
      const fixedStr = str.replace(/\\/g, "\\\\");
      return JSON.parse(fixedStr);
    } catch (innerError) {
      return null;
    }
  }
};

// ========================================================
// 1. BACKWARD COMPATIBILITY: Auto routing to registry logic
// ========================================================
export const parseTailoringInput = async (userInput) => {
  return await parseOrderRegistry(userInput);
};

// ==========================================
// 2. REGISTRY PROMPT: For Customer & Order Details
// ==========================================
export const parseOrderRegistry = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. Aapka kaam Urdu script, Roman Urdu, ya English text se order registry details nikalna hai.
      
      Strict Formatting Rules:
      1. Response MUST be a single clean valid JSON object. No markdown, no explanations.
      2. All JSON keys MUST be in standard English alphabets.
      3. Values can extract Urdu characters if it's a name, but convert dates and phone numbers strictly to standard western digits (0-9).
      4. If a value is missing, return an empty string "".
      
      Expected JSON Format:
      {
        "customer_name": "Customer name (Extract from Urdu or Roman text, default '')",
        "phone_number": "Extract any phone number as standard digits, default ''",
        "order_status": "pending",
        "total_suits": "1",
        "is_urgent": false,
        "delivery_date": ""
      }`,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userInput }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1 // Low temperature makes the output very strict and predictable
      },
    });

    const responseText = result.response.text();
    const parsedData = safeJsonParse(responseText);

    if (!parsedData) throw new Error("Failed to parse clean JSON matrix");
    
    // Ensure numbers are strings to avoid frontend numeric input mutation bugs
    return {
      customer_name: parsedData.customer_name || "",
      phone_number: parsedData.phone_number || "",
      order_status: parsedData.order_status || "pending",
      total_suits: parsedData.total_suits ? String(parsedData.total_suits) : "1",
      is_urgent: !!parsedData.is_urgent,
      delivery_date: parsedData.delivery_date || ""
    };
  } catch (error) {
    console.error("Order Registry Parsing Error:", error);
    return null;
  }
};

// ==========================================
// 3. NAAP PROMPT: For Tailoring Measurements Only
// ==========================================
export const parseTailoringMeasurements = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. Aapka kaam suit k naap aur design details process krna hai.
      
      Strict Formatting Rules:
      1. Response must be pure standard JSON.
      2. Measurements keys must be exactly as defined below. Values must be numeric digits only or "".
      
      Expected JSON Format:
      {
        "dress_type": "Shalwar Kameez",
        "measurements": {
          "length": "",
          "chest": "",
          "waist": "",
          "shoulder": "",
          "sleeves": "",
          "collar": "",
          "daman": "",
          "trouser_length": "",
          "asan": "",
          "paicha": ""
        },
        "style_notes": ""
      }`,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userInput }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1
      },
    });

    const responseText = result.response.text();
    const parsedData = safeJsonParse(responseText);

    if (!parsedData) throw new Error("Failed to parse measurements matrix");

    if (!parsedData.measurements) parsedData.measurements = {};
    const keys = ["length", "chest", "waist", "shoulder", "sleeves", "collar", "daman", "trouser_length", "asan", "paicha"];
    keys.forEach(key => {
      if (parsedData.measurements[key] === null || parsedData.measurements[key] === undefined) {
        parsedData.measurements[key] = "";
      } else {
        parsedData.measurements[key] = String(parsedData.measurements[key]);
      }
    });

    return parsedData;
  } catch (error) {
    console.error("Tailoring Measurements Parsing Error:", error);
    return null;
  }
};
