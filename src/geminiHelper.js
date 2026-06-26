import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel par jo key ka naam save hua tha, wahi yahan call kiya hai
const apiKey = import.meta.env.VITE_GEM_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const parseTailoringInput = async (userInput) => {
  try {
    // Fast aur accurate model for structured data
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      // Advanced instructions for local tailoring terms, shortcuts, and edge cases
      systemInstruction: `Aap gul-tailors web app k intelligent assistant hain. Aapka kaam tailor ya customer k aam text, Roman Urdu, English, ya voice note data ko samajhna aur usy clean, standardized JSON m convert krna hai.
      
      Strict Formatting Rules:
      1. Aapka response hamesha sirf aur sirf aik valid JSON object hona chahiye, koi markdown backticks (\`\`\`json) ya extra text ya explanation nahi honi chahiye.
      2. Agar koi measurement ya field text m maujood na ho, to uski value null rkhni hai.
      3. Naap (measurements) m sirf numeric values (e.g., 38.5, 40) rkhni hain, inches ya " ki zarorat nahi.
      
      Tailoring Vocabulary Mapping (Roman Urdu & Shortcuts):
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

      Style Notes Extraction:
      - Pocket details (e.g., single pocket, side pocket, front pocket).
      - Collar/Gala type (e.g., Ban, Soft Ban, Regular Collar, V-Neck, Gol Gala).
      - Cuff/Bazu style (e.g., Gol cuff, Square cuff, Simple bazu).
      - Daman type (e.g., Gol ghera, Straight/Choras ghera).
      - Stitching details (e.g., Double silai, Kacha, Tayaar naap).
      
      Expected JSON Format:
      {
        "customer_name": "Customer ka naam (agar bataya ho, warna null)",
        "dress_type": "Shalwar Kameez / Kurta / Pent Shirt / Waistcoat / Pant / Shirt (Identify from text, default to 'Shalwar Kameez' if unclear)",
        "measurements": {
          "length": null,
          "chest": null,
          "waist": null,
          "shoulder": null,
          "sleeves": null,
          "collar": null,
          "daman": null,
          "trouser_length": null,
          "asan": null,
          "paicha": null
        },
        "style_notes": "Design details jaise pocket, collar type, cuff style, double silai, etc. (Combine all styling notes here as a clean string)",
        "delivery_date": "YYYY-MM-DD format m agar din, date ya 'haftay baad', 'eid se pehle' jesa koi hint ho to convert krein, warna null"
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
