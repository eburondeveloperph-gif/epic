
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getEPICInsights = async (context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this multi-pillar organizational data context for EPIC-OS and provide 3-4 concise executive resilience recommendations. 
      Context includes Burnout Risk, Energy Environment, and Executive Health.
      Data Context: ${context}
      
      Format response as short, punchy bullet points. Focus on correlations like environmental factors impacting burnout or sleep affecting output.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Unable to generate real-time AI insights at this moment. Please check system logs.";
  }
};
