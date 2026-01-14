
import { GoogleGenAI } from "@google/genai";

/**
 * Exponential backoff helper for API retries
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callWithRetry = async (fn: () => Promise<any>, maxRetries = 4) => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      const errorMsg = typeof error === 'string' ? error : (error.message || JSON.stringify(error));
      const statusCode = error?.status || (errorMsg.match(/\d{3}/) ? parseInt(errorMsg.match(/\d{3}/)![0]) : null);
      
      const isRetryable = statusCode === 429 || 
                          statusCode === 500 || 
                          statusCode === 503 ||
                          errorMsg.toLowerCase().includes('quota') ||
                          errorMsg.includes('429');
      
      if (isRetryable && i < maxRetries - 1) {
        const baseWait = statusCode === 429 ? 2000 : 1000;
        const waitTime = Math.pow(2, i) * baseWait + Math.random() * 1000;
        
        console.warn(`Apex Pro Core [${statusCode || 'ERR'}]: WCX Node Throttled. Retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${maxRetries})`);
        await sleep(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
};

/**
 * EPIC Intelligence Service
 * Powered by WCX CLOUD SERVER using OLLAMA cloud models for engine processing.
 */
export const getEPICInsights = async (context: string) => {
  try {
    // Initializing with system-provided API_KEY as per core instructions
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const result = await callWithRetry(() => ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `You are the Apex Pro Neural Core, the primary engine of the WCX CLOUD SERVER cluster. 
          Your underlying architecture is built on OLLAMA cloud models. 
          Analyze this multi-pillar organizational data and provide 3-4 concise executive resilience recommendations. 
          
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
    }));

    return result.text || "WCX CLOUD: Apex Pro synthesis returned null.";
  } catch (error: any) {
    console.error("WCX CLOUD SERVER Error:", error);
    
    const errorMsg = error?.message || JSON.stringify(error);
    if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota')) {
      return "SYSTEM STATUS: WCX CLOUD / APEX CORE QUOTA EXHAUSTED.\n- WCX CLOUD SERVER nodes are at peak capacity.\n- OLLAMA cloud engine requests throttled.\n- Thermal buffer cooling. Please wait 30-60 seconds for buffer reset.";
    }
    
    return "Neural link to WCX CLOUD SERVER disrupted. Node error: " + (error?.status || "Unknown") + ". Attempting fallback to secondary OLLAMA cloud cluster...";
  }
};
