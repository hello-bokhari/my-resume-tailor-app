// src/app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';
import { enhancePrompt } from '@/lib/promptEnhancer';

export async function POST(req: NextRequest) {
  try {
    const { entry } = await req.json();
    const prompt = enhancePrompt(entry);
    const reply = await getGeminiResponse(prompt);
    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: "Gemini failed" }, { status: 500 });
  }
}
