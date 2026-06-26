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
      systemInstruction: `Aap gul-tailors web app ke intelligent assistant hain.
      Urdu/Roman Urdu text se customer details aur tailoring measurements (naap) nikalna aapka kaam hai.
      
      Strictly aapne niche diye gaye JSON format mein response return karna hai:
      {
        "customer_name": "Name of customer or empty string",
        "phone_number": "Phone number or empty string",
        "total_suits": "Total suits counts as string, default '1'",
        "is_urgent": true/false,
        "delivery_date": "YYYY-MM-DD or empty string",
        "order_status": "Pending",
        "silayi": "price if mentioned or empty string",
        "measurements": {
          "lambaai": "value or empty string",
          "teera": "value or empty string",
          "baazu": "value or empty string",
          "ghera": "value or empty string",
          "shalwar": "value or empty string",
          "paincha": "value or empty string",
          "asan": "value or empty string",
          "galla": "value or empty string"
        }
      }`,
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

    const detectedName = parsedData.customer_name || parsedData.name || "";

    const mSource = parsedData.measurements || parsedData || {};

    // FRONTEND KEY NAMES MATCHING MATRIX
    return {
      customer_name: detectedName,
      name: detectedName,
      customerName: detectedName,
      
      phone_number: finalPhone,
      whatsapp_mobile: finalPhone,
      whatsapp_number: finalPhone,
      whatsappMobile: finalPhone,
      whatsappNumber: finalPhone,
      mobile: finalPhone,
      phone: finalPhone,

      order_status: parsedData.order_status || "Pending",
      total_suits: String(parsedData.total_suits || "1"),
      is_urgent: parsedData.is_urgent === true,
      delivery_date: parsedData.delivery_date || "",
      dress_type: "Shalwar Kameez",
      style_notes: parsedData.style_notes || "",
      
      silayi: parsedData.silayi || "",
      pKarhayi: parsedData.pKarhayi || "",
      gKarhayi: parsedData.gKarhayi || "",

      // Mapping both standard and explicit frontend structure keys
      measurements: {
        lambaai: String(mSource.lambaai || mSource.length || mSource.lambai || ""),
        teera: String(mSource.teera || mSource.shoulder || mSource.tera || ""),
        baazu: String(mSource.baazu || mSource.sleeves || mSource.bazu || mSource.baju || ""),
        ghera: String(mSource.ghera || mSource.daman || mSource.gera || ""),
        shalwar: String(mSource.shalwar || mSource.trouser || mSource.shalwar_length || ""),
        paincha: String(mSource.paincha || mSource.poncha || mSource.pancha || mSource.paicha || ""),
        asan: String(mSource.asan || mSource.asand || ""),
        galla: String(mSource.galla || mSource.collar || mSource.gala || "")
      }
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      customer_name: "", name: "",
      phone_number: "", whatsapp_mobile: "", whatsapp_number: "",
      order_status: "Pending", total_suits: "1", is_urgent: false, delivery_date: "", dress_type: "Shalwar Kameez", style_notes: "",
      measurements: { lambaai: "", teera: "", baazu: "", ghera: "", shalwar: "", paincha: "", asan: "", galla: "" }
    };
  }
};

export const parseOrderRegistry = parseTailoringInput;
export const parseTailoringMeasurements = parseTailoringInput;
