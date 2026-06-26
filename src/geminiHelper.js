import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel par jo key ka naam save hua tha, wahi yahan call kiya hai
const apiKey = import.meta.env.VITE_GEM_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const parseTailoringInput = async (userInput) => {
  try {
    // Fast aur accurate model for structured data
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Strict instructions jo system ko manage krein gi aur sirf JSON dain gi
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. Aapka kaam tailor ya customer k aam text ya voice note data ko samajhna aur usy clean JSON m convert krna hai.
      
      Aapka response hamesha sirf aur sirf aik valid JSON object hona chahiye, koi extra text ya explanation nahi honi chahiye.
      
      Expected JSON Format:
      {
        "customer_name": "Customer ka naam (agar bataya ho)",
        "dress_type": "Shalwar Kameez / Kurta / Pent Shirt / Waistcoat",
        "measurements": {
          "length": "Inches m naap (numeric value ya null)",
          "chest": "Inches m naap (numeric value ya null)",
          "waist": "Inches m naap (numeric value ya null)",
          "shoulder": "Inches m naap (numeric value ya null)",
          "sleeves": "Inches m naap (numeric value ya null)"
        },
        "style_notes": "Design details jaise pocket, collar type, cuff style, etc.",
        "delivery_date": "YYYY-MM-DD format m agar din ya date batayi ho"
      }`,
    });

    // JSON output generate krne k liye setting
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userInput }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    // JSON parse kr k return krein gy taa k direct frontend input fields m fill ho sakay
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini AI Integration Error:", error);
    return null; // System crash na ho, fallback return kray
  }
};
