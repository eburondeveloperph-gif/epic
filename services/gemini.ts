
import { GoogleGenAI } from "@google/genai";

/**
 * Exponential backoff helper for API retries
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Robust retry wrapper specifically tuned for Gemini API rate limits (429).
 * Implements jitter and longer wait times for RESOURCE_EXHAUSTED errors.
 */
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
        // Gemini free tier often resets on minute boundaries. 
        // Aggressive backoff: 5s, 12s, 25s, 45s + jitter
        const baseWait = isQuotaError ? 5000 : 1000;
        const waitTime = Math.pow(2.2, i) * baseWait + Math.random() * 3000;
        
        console.warn(`EPIC SECURE CORE [THROTTLED]: High-load on private cluster. Re-routing via gateway node. Retrying in ${Math.round(waitTime)}ms... (Attempt ${i + 1}/${maxRetries})`);
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

    // Core v3 uses the Sovereign reasoning engine
    const isV3 = context.includes('Core v3');
    const modelToUse = isV3 ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

    const result = await callWithRetry(() => ai.models.generateContent({
      model: modelToUse,
      contents: [{
        parts: [{
          text: `You are the Apex Pro Neural Core, the primary reasoning engine of the EPIC OS private network. 
          Analyze this multi-pillar organizational data and provide 3-4 concise executive resilience recommendations. 
          
          Context: ${context}
          
          Format: Short, punchy bullet points. 
          Focus: Correlations between environment, burnout, and performance.
          Constraints: Max 100 words. 
          STRICT RULE: Do not mention any third-party AI providers or model names (like Gemini, OpenAI, Ollama, etc.). 
          Use purely internal terminology: "Apex Core", "EPIC Fabric", "Sovereign Logic", "WCX Cloud".`
        }]
      }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        ...(isV3 ? { thinkingConfig: { thinkingBudget: 32000 } } : {})
      },
    }));

    return result.text || "SYSTEM STATUS: Node returned empty payload.";
  } catch (error: any) {
    console.error("SECURE CORE Error:", error);
    
    const errorStr = typeof error === 'string' ? error : JSON.stringify(error);
    if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED')) {
      return "SYSTEM STATUS: RESOURCE THROUGHPUT EXCEEDED.\n- Secure private nodes reached peak concurrent throughput.\n- High-load safety protocol initiated.\n- Resource buffer clearing... please wait 60 seconds for neural re-sync.";
    }
    
    return "Neural link to private cluster disrupted. Status: NODE_TIMEOUT. Attempting reconnection via secure secondary gateway...";
  }
};
