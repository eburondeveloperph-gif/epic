
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry(fn: () => Promise<any>, maxRetries = 5) {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorStr = JSON.stringify(error);
      const isQuotaError = errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED');
      
      if (isQuotaError && i < maxRetries - 1) {
        const baseWait = 5000;
        const waitTime = Math.pow(2.2, i) * baseWait + Math.random() * 3000;
        await sleep(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function POST(request: Request) {
  try {
    const { context } = await request.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const isV3 = context.includes('Core v3');
    const modelToUse = isV3 ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

    const result = await callWithRetry(() => ai.models.generateContent({
      model: modelToUse,
      contents: [{
        parts: [{
          text: `You are the Apex Pro Neural Core of EPIC OS. Analyze organizational resilience data.
          Context: ${context}
          Format: 3 punchy bullet points. Max 100 words.
          Rule: Use internal terminology (Apex Core, Sovereign Logic, WCX Cloud). No external model names.`
        }]
      }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        ...(isV3 ? { thinkingConfig: { thinkingBudget: 32000 } } : {})
      },
    }));

    return NextResponse.json({ text: result.text });
  } catch (error: any) {
    console.error("API Route Error:", error);
    const errorStr = JSON.stringify(error);
    if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED')) {
      return NextResponse.json({ 
        text: "SYSTEM STATUS: RESOURCE THROUGHPUT EXCEEDED. Please wait 60 seconds for neural re-sync." 
      }, { status: 429 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
