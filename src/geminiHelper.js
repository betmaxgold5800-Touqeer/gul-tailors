import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEM_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Super safe JSON parser that never fails
const ultimateJsonParse = (str) => {
  try {
    let cleanStr = str
      .replace(/[\u0000-\u0019]+/g, "")
      .replace(/^```json/i, "")
      .replace(/```$/, "")
      .trim();
    return JSON.parse(cleanStr);
  } catch (e) {
    // Fallback using regex regex to pull values if JSON formatting is slightly off
    const extractField = (field, text) => {
      const match = text.match(new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`));
      return match ? match[1] : "";
    };
    return {
      customer_name: extractField("customer_name", str),
      phone_number: extractField("phone_number", str),
      order_status: "pending"
    };
  }
};

// ========================================================
// Main Entry Point that protects frontend at all costs
// ========================================================
export const parseTailoringInput = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. 
      Urdu, Roman Urdu ya English text ko samajh kar details nikalna aapka kaam hai.
      
      Rules:
      1. Response strictly JSON format m hona chahiye.
      2. Dates, names aur numbers ko text se extract krein.
      3. Missing parameters ko default empty string "" rkhna hai.`,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userInput }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1
      },
    });

    const responseText = result.response.text();
    const parsedData = ultimateJsonParse(responseText) || {};

    // 100% Flat Structure Layer:
    // Frontend handles nested measurements properties. If they are completely missing or flattened, 
    // we inject them right here so 'result.measurements.length' never reads from undefined.
    return {
      customer_name: parsedData.customer_name || "",
      phone_number: parsedData.phone_number || "",
      order_status: parsedData.order_status || "pending",
      total_suits: String(parsedData.total_suits || "1"),
      is_urgent: parsedData.is_urgent === true || String(parsedData.is_urgent).toLowerCase() === "true",
      delivery_date: parsedData.delivery_date || "",
      dress_type: parsedData.dress_type || "Shalwar Kameez",
      style_notes: parsedData.style_notes || "",
      measurements: {
        length: String(parsedData.measurements?.length || parsedData.length || ""),
        chest: String(parsedData.measurements?.chest || parsedData.chest || ""),
        waist: String(parsedData.measurements?.waist || parsedData.waist || ""),
        shoulder: String(parsedData.measurements?.shoulder || parsedData.shoulder || ""),
        sleeves: String(parsedData.measurements?.sleeves || parsedData.sleeves || ""),
        collar: String(parsedData.measurements?.collar || parsedData.collar || ""),
        daman: String(parsedData.measurements?.daman || parsedData.daman || ""),
        trouser_length: String(parsedData.measurements?.trouser_length || parsedData.trouser_length || ""),
        asan: String(parsedData.measurements?.asan || parsedData.asan || ""),
        paicha: String(parsedData.measurements?.paicha || parsedData.paicha || "")
      }
    };
  } catch (error) {
    console.error("AI Error:", error);
    // Absolute fallback object structure to guarantee frontend never throws an alert
    return {
      customer_name: "", phone_number: "", order_status: "pending", total_suits: "1", is_urgent: false, delivery_date: "", dress_type: "Shalwar Kameez", style_notes: "",
      measurements: { length: "", chest: "", waist: "", shoulder: "", sleeves: "", collar: "", daman: "", trouser_length: "", asan: "", paicha: "" }
    };
  }
};

// Functions mapping for dual prompt support
export const parseOrderRegistry = parseTailoringInput;
export const parseTailoringMeasurements = parseTailoringInput;
