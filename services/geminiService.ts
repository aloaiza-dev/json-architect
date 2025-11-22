import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const repairJsonWithAi = async (brokenJson: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Missing API Key");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Fix the following JSON string. It may have syntax errors like missing quotes, trailing commas, or invalid formatting. 
      Return ONLY the valid, minified JSON string. Do not wrap it in markdown code blocks.
      
      Broken JSON:
      ${brokenJson}`,
      config: {
        // We want a deterministic fix
        temperature: 0.1,
      }
    });

    let text = response.text || '';
    
    // Cleanup if the model includes markdown despite instructions
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```/, '').replace(/```$/, '');
    }
    
    return text.trim();
  } catch (error) {
    console.error("Gemini repair failed:", error);
    throw new Error("Failed to repair JSON with AI.");
  }
};