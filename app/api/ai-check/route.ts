// app/api/ai-check/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { front, back, answer } = await req.json();

  const prompt = `
  Corrige la respuesta del usuario para un ejercicio de traducción.
  Pregunta: ${front}
  Respuesta esperada: ${back}
  Respuesta del usuario: ${answer}
  Evalúa si es correcta y explica brevemente el motivo.
  Devuelve un JSON: { "correct": true|false, "explanation": "texto corto con ✅ o ❌" }
  `;

  const completion = await openai.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
  });

  const text = completion.output[0].content[0].text;
  try {
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      correct: false,
      explanation: '❌ Error de formato IA.',
    });
  }
}
