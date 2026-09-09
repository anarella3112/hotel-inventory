import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { createClient as createSupabaseServer } from "@/lib/supabase/server";

export const DEFAULT_MODEL = "gemini-2.5-flash";

/**
 * Precios referenciales de Gemini 2.5 Flash (USD por millón de tokens).
 * Ajustar según el modelo usado. Solo con fines de estimación de costos.
 */
const PRICING = {
  "gemini-2.5-flash": { input: 0.3, output: 2.5 },
  "gemini-2.0-flash": { input: 0.1, output: 0.4 },
  "gemini-2.0-flash-lite": { input: 0.075, output: 0.3 },
};

export function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Falta la variable de entorno GEMINI_API_KEY. Consúltala en https://aistudio.google.com/apikey",
    );
  }
  return new GoogleGenAI({ apiKey });
}

export function getModel(): string {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL;
}

/**
 * Estima el costo de una llamada según los tokens usados.
 */
export function estimateCost(
  model: string,
  promptTokens: number,
  completionTokens: number,
): number {
  const price = PRICING[model as keyof typeof PRICING] ?? PRICING[DEFAULT_MODEL];
  return (promptTokens * price.input + completionTokens * price.output) / 1_000_000;
}

/**
 * Registra el consumo de tokens de cada llamada de IA en ai_usage_log
 * (requisito del baremo: "Recolección de información del uso de Tokens").
 */
export async function logAiUsage(
  feature: string,
  model: string,
  response: GenerateContentResponse,
) {
  const meta = response.usageMetadata;
  const promptTokens = meta?.promptTokenCount ?? 0;
  const completionTokens = meta?.candidatesTokenCount ?? 0;
  const totalTokens = meta?.totalTokenCount ?? promptTokens + completionTokens;
  const cost = estimateCost(model, promptTokens, completionTokens);

  try {
    const supabase = await createSupabaseServer();
    await supabase.from("ai_usage_log").insert({
      feature,
      model,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      cost_estimate: cost,
    });
  } catch {
    // No debe tumbar la funcionalidad si el registro de tokens falla.
  }

  return { promptTokens, completionTokens, totalTokens, cost };
}

/**
 * Ejecuta una consulta a Gemini y registra los tokens consumidos.
 * Devuelve el texto de la respuesta junto con las métricas de uso.
 */
export async function geminiComplete(feature: string, prompt: string) {
  const ai = getGemini();
  const model = getModel();

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { temperature: 0.3 },
  });

  const usage = await logAiUsage(feature, model, response);

  return {
    text: response.text ?? "",
    model,
    usage,
  };
}