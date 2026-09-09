"use server";

import { createClient } from "@/lib/supabase/server";

export interface AutomationState {
  error?: string;
  success?: string;
  preview?: string;
  sent?: boolean;
}

/**
 * Construye el "reporte de operación" (stock bajo, mermas, minibar pendiente)
 * y lo envía al webhook de n8n para su procesamiento automático:
 *   trigger (webhook) -> procesamiento -> IA (Gemini) -> salida (email/PDF).
 * Si N8N_WEBHOOK_URL no está configurado, devuelve el payload para demostración.
 */
export async function dispatchAutomation(
  prev: AutomationState,
  formData: FormData,
): Promise<AutomationState> {
  const supabase = await createClient();

  const [{ data: stock }, { data: mermas }, { data: consumos }] =
    await Promise.all([
      supabase.from("v_stock_actual").select("*").in("estado", ["stock_bajo", "stock_critico"]),
      supabase.from("v_mermas").select("*").limit(20),
      supabase
        .from("minibar_consumos")
        .select("*")
        .eq("facturado", false)
        .limit(20),
    ]);

  const report = {
    generated_at: new Date().toISOString(),
    hotel: "Hotel Paradise UNEG",
    resumen: {
      items_stock_bajo: stock?.length ?? 0,
      mermas_ultimas: mermas?.length ?? 0,
      consumos_minibar_pendientes: consumos?.length ?? 0,
      importe_minibar_por_cobrar: (consumos ?? []).reduce(
        (acc, c) => acc + Number(c.price) * c.quantity,
        0,
      ),
    },
    stock_bajo: (stock ?? []).map((r) => ({
      insumo: r.name,
      ubicacion: r.location,
      cantidad: r.quantity,
      minimo: r.stock_min,
    })),
    mermas: (mermas ?? []).map((m) => ({
      insumo: m.item,
      cantidad: m.quantity,
      motivo: m.motivo,
    })),
    minibar_pendiente: (consumos ?? []).map((c) => ({
      habitacion_id: c.room_id,
      producto_id: c.item_id,
      cantidad: c.quantity,
      precio: c.price,
    })),
  };

  const payload = { command: "daily_operation_report", data: report };
  const preview = JSON.stringify(payload, null, 2).slice(0, 400);

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      sent: false,
      preview,
      success:
        "N8N_WEBHOOK_URL no está configurado. El flujo de automatización no se ejecutó; aquí tienes el payload generado.",
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return {
        sent: false,
        preview,
        error: `n8n respondió con estado ${res.status}: ${res.statusText}`,
      };
    }
    return {
      sent: true,
      preview,
      success: "Reporte enviado a n8n: trigger -> procesamiento -> IA -> email/PDF.",
    };
  } catch (e) {
    return {
      sent: false,
      preview,
      error: `No se pudo contactar a n8n: ${(e as Error).message}`,
    };
  }
}