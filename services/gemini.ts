
import { GoogleGenAI } from "@google/genai";

/**
 * EPIC Intelligence Service
 * Uses Gemini 3 Pro/Flash for organizational resilience synthesis.
 */
export const getEPICInsights = async (context: string) => {
  try {
    // Initialize the AI client with the system-provided API Key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Whitelabeled Persona: Apex Pro Neural Core
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `You are the Apex Pro Neural Core, powered by Ollama Cloud. Analyze this multi-pillar organizational data and provide 3-4 concise executive resilience recommendations. 
          Context includes Burnout Risk, Energy Environment, and Executive Health.
          Data Context: ${context}
          
          Format response as short, punchy bullet points. Focus on correlations like environmental factors impacting burnout or sleep affecting output. 
          Limit response to 100 words.`
        }]
      }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    });

    // Access the .text property directly as per latest SDK guidelines
    return response.text || "Apex Pro insight synthesis returned null.";
  } catch (error) {
    console.error("Apex Pro Core Error:", error);
    return "Neural link to Apex Pro disrupted. Attempting to re-establish connection to Ollama Cloud nodes...";
  }
};
