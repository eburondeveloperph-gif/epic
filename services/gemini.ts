
import { GoogleGenAI } from "@google/genai";

/**
 * EPIC Intelligence Service
 * Uses Gemini 3 Pro/Flash for organizational resilience synthesis.
 */
export const getEPICInsights = async (context: string) => {
  try {
    // Initialize the AI client with the system-provided API Key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Use gemini-3-flash-preview for high-performance executive summaries
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `You are the EPIC-OS Neural Core. Analyze this multi-pillar organizational data and provide 3-4 concise executive resilience recommendations. 
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
    return response.text || "Insight generation returned an empty result.";
  } catch (error) {
    console.error("Neural Core Error:", error);
    return "Neural link disrupted. Attempting to re-establish connection to Ollama/Gemini cloud nodes...";
  }
};
