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
      
      CRITICAL KEY MATCHING RULES FOR URDU TERMS:
      - "گھیرا" or "ghera" -> Must map to "ghera"
      - "آسن" or "اسن" or "asan" -> Must map to "asan"
      - "پانچ" or "پانچہ" or "paincha" or "poncha" -> Must map to "paincha"
      - "بازو" or "baazu" or "bazu" -> Must map to "baazu"
      - "لمبائی" or "lambaai" or "lambai" -> Must map to "lambaai"
      - "تیرا" or "teera" or "tera" -> Must map to "teera"
      - "شلوار" or "shalwar" -> Must map to "shalwar"
      - "گلا" or "گلہ" or "galla" or "gala" -> Must map to "galla"

      Strictly aapne niche diye gaye FLAT JSON structure mein response return karna hai (Do not nest measurements):
      {
        "customer_name": "Name or empty string",
        "phone_number": "Phone or empty string",
        "total_suits": "1",
        "is_urgent": false,
        "delivery_date": "",
        "order_status": "Pending",
        "silayi": "",
        "lambaai": "value or empty string",
        "teera": "value or empty string",
        "baazu": "value or empty string",
        "ghera": "value or empty string",
        "shalwar": "value or empty string",
        "paincha": "value or empty string",
        "asan": "value or empty string",
        "galla": "value or empty string"
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

    // Direct extraction from root or nested backup fallback
    const mSource = parsedData;

    const finalLambaai = String(mSource.lambaai || parsedData.measurements?.lambaai || "");
    const finalTeera = String(mSource.teera || parsedData.measurements?.teera || "");
    const finalBaazu = String(mSource.baazu || parsedData.measurements?.baazu || "");
    const finalGhera = String(mSource.ghera || parsedData.measurements?.ghera || "");
    const finalShalwar = String(mSource.shalwar || parsedData.measurements?.shalwar || "");
    const finalPaincha = String(mSource.paincha || parsedData.measurements?.paincha || "");
    const finalAsan = String(mSource.asan || parsedData.measurements?.asan || "");
    const finalGalla = String(mSource.galla || parsedData.measurements?.galla || "");

    // RETURN MAXIMUM LAYER COVERAGE
    return {
      customer_name: detectedName,
      name: detectedName,
      customerName: detectedName,
      
      phone_number: finalPhone,
      whatsapp_mobile: finalPhone,
      whatsapp_number: finalPhone,
      mobile: finalPhone,
      phone: finalPhone,

      order_status: parsedData.order_status || "Pending",
      total_suits: String(parsedData.total_suits || "1"),
      is_urgent: parsedData.is_urgent === true,
      delivery_date: parsedData.delivery_date || "",
      dress_type: "Shalwar Kameez",
      
      silayi: parsedData.silayi || "",
      pKarhayi: parsedData.pKarhayi || "",
      gKarhayi: parsedData.gKarhayi || "",

      // Direct Flat Mapping for Size Vault
      lambaai: finalLambaai,
      teera: finalTeera,
      baazu: finalBaazu,
      ghera: finalGhera,
      shalwar: finalShalwar,
      paincha: finalPaincha,
      asan: finalAsan,
      galla: finalGalla,

      // Nested Object for backward compatibility
      measurements: {
        lambaai: finalLambaai,
        teera: finalTeera,
        baazu: finalBaazu,
        ghera: finalGhera,
        shalwar: finalShalwar,
        paincha: finalPaincha,
        asan: finalAsan,
        galla: finalGalla
      }
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      customer_name: "", name: "", phone_number: "",
      lambaai: "", teera: "", baazu: "", ghera: "", shalwar: "", paincha: "", asan: "", galla: "",
      measurements: { lambaai: "", teera: "", baazu: "", ghera: "", shalwar: "", paincha: "", asan: "", galla: "" }
    };
  }
};

export const parseOrderRegistry = parseTailoringInput;
export const parseTailoringMeasurements = parseTailoringInput;
