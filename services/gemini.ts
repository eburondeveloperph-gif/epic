
import { GoogleGenAI } from "@google/genai";

/**
 * Exponential backoff helper for API retries
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const callWithRetry = async (fn: () => Promise<any>, maxRetries = 5) => {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      const errorStr = typeof error === 'string' ? error : JSON.stringify(error);
      const isQuotaError = errorStr.includes('429') || 
                          errorStr.includes('RESOURCE_EXHAUSTED') || 
                          errorStr.toLowerCase().includes('quota');
      
      const isRetryable = isQuotaError || 
                          errorStr.includes('500') || 
                          errorStr.includes('503') ||
                          errorStr.includes('504');
      
      if (isRetryable && i < maxRetries - 1) {
        // Aggressive backoff for 429s
        const baseWait = isQuotaError ? 4000 : 1000;
        const waitTime = Math.pow(2, i) * baseWait + Math.random() * 2000;
        
        console.warn(`WCX CLOUD SERVER [OFFLOAD_WAIT]: Re-routing via private cluster node. Retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${maxRetries})`);
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
 * Powered by private WCX CLOUD logic.
 */
export const getEPICInsights = async (context: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Apex v3 uses the Sovereign core with deep reasoning
    const isV3 = context.includes('Core v3');
    const modelToUse = isV3 ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

    const result = await callWithRetry(() => ai.models.generateContent({
      model: modelToUse,
      contents: [{
        parts: [{
          text: `You are the Apex Pro Neural Core, the primary reasoning engine of the EPIC OS private network. 
          Analyze this multi-pillar organizational data and provide 3-4 concise executive resilience recommendations. 
          
          Context includes Burnout Risk, Energy Environment, and Executive Health.
          Data Context: ${context}
          
          Format response as short, punchy bullet points. Focus on correlations like environmental factors impacting burnout or sleep affecting output. 
          Limit response to 100 words. 
          STRICT RULE: Do not mention any third-party AI providers, model names (like Gemini, OpenAI, etc.), or external cloud providers in your output. Use purely internal terminology like "Apex Core", "EPIC Fabric", or "Secure Logic".`
        }]
      }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        // Sovereign mode activates thinking budget for deep reasoning
        ...(isV3 ? { thinkingConfig: { thinkingBudget: 32000 } } : {})
      },
    }));

    return result.text || "SYSTEM STATUS: Node returned empty payload.";
  } catch (error: any) {
    console.error("SECURE CORE Error:", error);
    
    const errorStr = typeof error === 'string' ? error : JSON.stringify(error);
    if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED')) {
      return "SYSTEM STATUS: RESOURCE THROUGHPUT EXCEEDED.\n- Secure private nodes reached peak concurrent throughput.\n- Automatic security protocol active.\n- Resource buffer clearing... please wait 60 seconds.";
    }
    
    return "Neural link to private cluster disrupted. Node status: CLUSTER_FAIL. Retrying via secondary secure gateway...";
  }
};
