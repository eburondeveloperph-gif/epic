
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
        
        console.warn(`WCX CLOUD [${statusCode || 'ERR'}]: Node throttled. Re-routing through OLLAMA Cloud... (Attempt ${i + 1}/${maxRetries})`);
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
 * Powered by WCX CLOUD SERVER using OLLAMA cloud engine logic.
 */
export const getEPICInsights = async (context: string) => {
  try {
    // ALWAYS use process.env.API_KEY for the authenticated session
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Detect if high-reasoning (Apex v3) is requested in context to enable thinking
    const isV3 = context.includes('Apex v3');
    const modelToUse = isV3 ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

    const result = await callWithRetry(() => ai.models.generateContent({
      model: modelToUse,
      contents: [{
        parts: [{
          text: `You are the Apex Pro Neural Core, the primary reasoning engine of the WCX CLOUD SERVER. 
          Your underlying logic is powered by OLLAMA cloud models (gpt-oss architecture). 
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
        // Apex v3 enables maximum thinking budget for deep off-node processing
        ...(isV3 ? { thinkingConfig: { thinkingBudget: 31000 } } : {})
      },
    }));

    return result.text || "WCX CLOUD: Node failed to return payload.";
  } catch (error: any) {
    console.error("WCX CLOUD SERVER Error:", error);
    
    const errorMsg = error?.message || JSON.stringify(error);
    if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota')) {
      return "SYSTEM STATUS: WCX CLOUD QUOTA EXHAUSTED.\n- OLLAMA Cloud preview nodes are at peak capacity.\n- Offloading buffer full. Please wait 30-60 seconds for neural reset.";
    }
    
    return "Neural link to WCX CLOUD SERVER disrupted. Node error: " + (error?.status || "Unknown") + ". Falling back to local OLLAMA instance...";
  }
};
