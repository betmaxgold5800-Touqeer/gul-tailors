import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEM_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Safe JSON Clean Parsing
const safeJsonParse = (str) => {
  try {
    let cleanStr = str
      .replace(/[\u0000-\u0019]+/g, "")
      .replace(/^```json/i, "")
      .replace(/```$/, "")
      .trim();
    return JSON.parse(cleanStr);
  } catch (e) {
    return null;
  }
};

// ========================================================
// 1. COMBINED BACKWARD COMPATIBILITY (Frontend crash protection)
// ========================================================
export const parseTailoringInput = async (userInput) => {
  // Agar aapka frontend purane tareeqe se ise call kare, to hum registry aur khali naap dono bhejenge taake frontend crash na ho
  const registryData = await parseOrderRegistry(userInput);
  if (!registryData) return null;

  return {
    ...registryData,
    dress_type: "Shalwar Kameez",
    measurements: {
      length: "", chest: "", waist: "", shoulder: "", sleeves: "",
      collar: "", daman: "", trouser_length: "", asan: "", paicha: ""
    },
    style_notes: ""
  };
};

// ==========================================
// 2. REGISTRY PROMPT: For Customer & Order Details
// ==========================================
export const parseOrderRegistry = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. Aapka kaam Urdu, Roman Urdu, ya English text se registry details nikalna hai.
      
      Rules:
      1. Response sirf valid JSON object hona chahiye.
      2. Keys hamesha standard English alphabets m honi chahiye.
      3. Missing values ko hamesha empty string "" rkhna hai. Numbers ko string format m rkhna hai.
      
      Expected JSON Format:
      {
        "customer_name": "Customer ka naam (Extract from Urdu/Roman text, warna '')",
        "phone_number": "Phone number strictly standard digits m (0-9), warna ''",
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
        temperature: 0.1
      },
    });

    const responseText = result.response.text();
    const parsedData = safeJsonParse(responseText);

    if (!parsedData) return null;
    
    return {
      customer_name: parsedData.customer_name || "",
      phone_number: parsedData.phone_number ? String(parsedData.phone_number) : "",
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
      
      Expected JSON Format:
      {
        "dress_type": "Shalwar Kameez",
        "measurements": {
          "length": "", "chest": "", "waist": "", "shoulder": "", "sleeves": "",
          "collar": "", "daman": "", "trouser_length": "", "asan": "", "paicha": ""
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

    if (!parsedData) return null;

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
