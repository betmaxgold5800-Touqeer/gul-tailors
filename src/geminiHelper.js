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
    const cleanUserInput = userInput.replace(/\[Dress:.*?\]/gi, "").trim();

    // Text se direct number nikalne ka backup code
    const rawNumbers = cleanUserInput.match(/\d+/g);
    let backupPhone = "";
    if (rawNumbers) {
      const longNumber = rawNumbers.find(num => num.length >= 10);
      if (longNumber) backupPhone = longNumber;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain.
      Urdu/Roman text se details nikalna aapka kaam hai.`,
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

    let finalPhone = parsedData.phone_number || parsedData.whatsapp_mobile || parsedData.mobile || "";
    finalPhone = String(finalPhone).replace(/\D/g, "");
    
    if (!finalPhone || finalPhone.length < 10) {
      finalPhone = backupPhone || "";
    }

    const detectedName = parsedData.customer_name || parsedData.name || cleanUserInput.split(/[\s,]+/)[0] || "Arham";

    // FRONTEND KEY NAMES MATCHING MATRIX
    // Hum har tarah ki possible key bhej rahe hain taa k jo bhi variable aap k state m ho wo fill ho jaye
    return {
      customer_name: detectedName,
      name: detectedName,
      customerName: detectedName,
      
      // All possible phone/whatsapp keys mapping
      phone_number: finalPhone,
      whatsapp_mobile: finalPhone,
      whatsapp_number: finalPhone,
      whatsappMobile: finalPhone,
      whatsappNumber: finalPhone,
      mobile: finalPhone,
      phone: finalPhone,

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
      customer_name: "Arham", name: "Arham",
      phone_number: "92301580063", whatsapp_mobile: "92301580063", whatsapp_number: "92301580063",
      order_status: "pending", total_suits: "1", is_urgent: false, delivery_date: "", dress_type: "Shalwar Kameez", style_notes: "",
      measurements: { length: "", chest: "", waist: "", shoulder: "", sleeves: "", collar: "", daman: "", trouser_length: "", asan: "", paicha: "" }
    };
  }
};

export const parseOrderRegistry = parseTailoringInput;
export const parseTailoringMeasurements = parseTailoringInput;
