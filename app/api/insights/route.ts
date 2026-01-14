
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { context } = await request.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const isV3 = context.includes('Apex v3');
    const modelToUse = isV3 ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

    const result = await ai.models.generateContent({
      model: modelToUse,
      contents: [{
        parts: [{
          text: `IDENTITY PROTOCOL: You are the Apex Pro Neural Core.
          INFRASTRUCTURE: WCX CLOUD SERVER.
          
          TASK: Analyze organizational resilience data.
          Context: ${context}
          
          Format: 3 punchy bullet points. Max 100 words.`
        }]
      }],
      config: {
        temperature: 0.7,
        ...(isV3 ? { thinkingConfig: { thinkingBudget: 24000 } } : {})
      },
    });

    return NextResponse.json({ text: result.text });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
