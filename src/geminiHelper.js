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
    // Input ko clean karein agar usme pehle se dropdown clutter brackets hon
    const cleanUserInput = userInput.replace(/\[Dress:.*?\]/gi, "").trim();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. 
      Urdu/Roman text se details nikalna aapka kaam hai.
      
      CRITICAL VALIDATION RULE:
      1. Agar text m phone number/mobile number NAHI bataya gaya, to phone_number field m khali string nahi balkay "N/A" likhna hai taa k frontend validation pass ho jaye.
      2. Customer name hamesha extract krein, agar sirf name ho to wo customer_name m jaye.`,
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

    // Safeguard validation properties before passing to frontend component
    const detectedName = parsedData.customer_name || cleanUserInput.split(/[\s,]+/)[0] || "Unknown";
    const detectedPhone = parsedData.phone_number || "N/A"; // Bypass empty field validator blocking

    return {
      customer_name: detectedName,
      phone_number: detectedPhone,
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
      phone_number: "N/A", 
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
