import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEM_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const ultimateJsonParse = (str) => {
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

export const parseTailoringInput = async (userInput) => {
  try {
    // Dropdown elements aur input ka bacha kachra saaf krne k liye
    const cleanUserInput = userInput.replace(/\[Dress:.*?\]/gi, "").trim();

    // 🌟 FRONTEND HARD PROTECTION: Agar text m direct koi number maujood hai, to use pehle hi extract krlein
    const rawNumbers = cleanUserInput.match(/\d+/g);
    let backupPhone = "";
    if (rawNumbers) {
      // Jo bhi digits ka group mile (e.g. 923015800630), use nikal lein
      const longNumber = rawNumbers.find(num => num.length >= 10);
      if (longNumber) backupPhone = longNumber;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. 
      Urdu/Roman text se details nikalna aapka kaam hai.
      
      CRITICAL VALIDATION RULE:
      1. Text m se phone number ko dhondhein chahe us k sath koi Urdu lafz chipka ho.
      2. Agar text m phone number/mobile number bilkul NAHI hai, to phone_number field m "923001234567" ya "03000000000" jesa dummy number likhein taa k frontend crash na ho.`,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: cleanUserInput }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1
      },
    });

    const responseText = result.response.text();
    const parsedData = ultimateJsonParse(responseText) || {};

    // AI k response se number nikal kar us m se sirf digits filter krna (Urdu characters urhane k liye)
    let finalPhone = parsedData.phone_number ? String(parsedData.phone_number).replace(/\D/g, "") : "";
    
    // Agar AI se number saaf nahi mila, to jo humne backup extraction ki thi wo use krein
    if (!finalPhone || finalPhone.length < 10) {
      finalPhone = backupPhone || "923001234567"; 
    }

    const detectedName = parsedData.customer_name || cleanUserInput.split(/[\s,]+/)[0] || "Arham";

    return {
      customer_name: detectedName,
      phone_number: finalPhone,
      order_status: parsedData.order_status || "pending",
      total_suits: String(parsedData.total_suits || "1"),
      is_urgent: parsedData.is_urgent === true,
      delivery_date: parsedData.delivery_date || "",
      dress_type: "Shalwar Kameez",
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
    return {
      customer_name: "Arham", 
      phone_number: "923015800630", 
      order_status: "pending", 
      total_suits: "1", 
      is_urgent: false, 
      delivery_date: "", 
      dress_type: "Shalwar Kameez", 
      style_notes: "",
      measurements: { length: "", chest: "", waist: "", shoulder: "", sleeves: "", collar: "", daman: "", trouser_length: "", asan: "", paicha: "" }
    };
  }
};

export const parseOrderRegistry = parseTailoringInput;
export const parseTailoringMeasurements = parseTailoringInput;
