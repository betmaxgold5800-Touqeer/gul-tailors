import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEM_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ========================================================
// 1. BACKWARD COMPATIBILITY: Purane code ko crash se bachane k liye
// ========================================================
export const parseTailoringInput = async (userInput) => {
  // Agar aapka purana component ise call kare, to yeh auto Registry wala kaam karega
  return await parseOrderRegistry(userInput);
};

// ==========================================
// 2. REGISTRY PROMPT: For Customer & Order Details
// ==========================================
export const parseOrderRegistry = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. Aapka kaam tailor ya customer k text ya voice data se order aur registry ki details nikalna hai.
      
      Strict Formatting Rules:
      1. Response sirf aur sirf valid JSON hona chahiye. Koi markdown backticks ya extra text nahi.
      2. Jo field text m na ho, uski value empty string "" rkhni hai.
      
      Expected JSON Format:
      {
        "customer_name": "Customer ka naam (agar bataya ho, warna '')",
        "phone_number": "Agar text m koi phone number ya mobile number ho (jaise 923... ya 03...), warna ''",
        "order_status": "Hamesha 'pending' rkhna hai jab tak text m 'completed' ya 'delivered' na bola jaye",
        "total_suits": "Suits ki tadad (numeric value, e.g. 1, 2, 3). Agar text m zikr na ho to default 1 rkhna hai",
        "is_urgent": true (agar text m 'urgent', 'jaldi', 'emergency' jesa zikr ho) warna false,
        "delivery_date": "YYYY-MM-DD format m agar koi date ya hint ho, warna ''"
      }`,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userInput }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    let responseText = result.response.text().trim();
    responseText = responseText.replace(/^```json/i, "").replace(/```$/, "").trim();
    return JSON.parse(responseText);
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
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. Aapka kaam sirf aur sirf suit k naap (measurements) aur design details ko process krna hai.
      
      Strict Formatting Rules:
      1. Response sirf aur sirf valid JSON hona chahiye.
      2. Naap (measurements) m sirf numeric digits rkhne hain (e.g. 38.5, 40). Agar koi naap na ho to use empty string "" rkhna hai.
      
      Tailoring Vocabulary Mapping:
      - "Naap/Lambai/Length" -> length
      - "Chaati/Chest" -> chest
      - "Kamar/Waist" -> waist
      - "Teera/Shoulder" -> shoulder
      - "Bazu/Sleeves" -> sleeves
      - "Gala/Collar" -> collar
      - "Ghera/Daman" -> daman
      - "Shalwar Lambai/Trousers" -> trouser_length
      - "Asan" -> asan
      - "Paicha/Bottom" -> paicha

      Expected JSON Format:
      {
        "dress_type": "Shalwar Kameez / Kurta / Pent Shirt / Waistcoat",
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
        "style_notes": "Design details jaise pocket style, collar type, cuff style, double silai, etc. (Warna '')"
      }`,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userInput }] }],
      generationConfig: { responseMimeType: "application/json" },
    });

    let responseText = result.response.text().trim();
    responseText = responseText.replace(/^```json/i, "").replace(/```$/, "").trim();
    
    const parsedData = JSON.parse(responseText);

    if (!parsedData.measurements) parsedData.measurements = {};
    const keys = ["length", "chest", "waist", "shoulder", "sleeves", "collar", "daman", "trouser_length", "asan", "paicha"];
    keys.forEach(key => {
      if (parsedData.measurements[key] === null || parsedData.measurements[key] === undefined) {
        parsedData.measurements[key] = "";
      }
    });

    return parsedData;
  } catch (error) {
    console.error("Tailoring Measurements Parsing Error:", error);
    return null;
  }
};
