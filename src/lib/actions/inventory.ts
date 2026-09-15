"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { InsumoCategoria, MovimientoTipo } from "@/lib/types";

export interface ActionState {
  error?: string;
  success?: string;
}

const CATEGORIES: InsumoCategoria[] = [
  "minibar",
  "lenceria",
  "limpieza",
  "amenities",
  "alimentos_bebidas",
];

// ---------- Catálogo ----------

export async function createItem(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const sku = String(formData.get("sku") ?? "").trim();
  const category = String(formData.get("category") ?? "") as InsumoCategoria;
  const subcategory = String(formData.get("subcategory") ?? "").trim() || null;
  const unit = String(formData.get("unit") ?? "").trim();
  const cost = Number(formData.get("cost") ?? 0);
  const provider = String(formData.get("provider") ?? "").trim() || null;
  const stock_min = Number(formData.get("stock_min") ?? 0);
  const stock_max = Number(formData.get("stock_max") ?? 0);

  if (!name || !sku || !unit || !subcategory) {
    return { error: "Nombre, SKU y unidad son obligatorios." };
  }
  if (!CATEGORIES.includes(category)) {
    return { error: "Categoría inválida." };
  }

  const { error } = await supabase.from("items").insert({
    name,
    sku,
    category,
    subcategory,
    unit,
    cost,
    provider,
    stock_min,
    stock_max,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe un insumo con ese SKU." };
    }
    return { error: error.message };
  }

  revalidatePath("/items");
  revalidatePath("/dashboard");
  return { success: `Insumo "${name}" registrado correctamente.` };
}

export async function toggleItemActive(id: string) {
  const supabase = await createClient();
  await supabase.from("items").update({ active: false }).eq("id", id);
  revalidatePath("/items");
  redirect("/items");
}

// ---------- Movimientos ----------

const MOVEMENT_TYPES: MovimientoTipo[] = [
  "entrada",
  "salida",
  "transferencia_entrada",
  "transferencia_salida",
  "ajuste",
  "merma",
  "consumo_minibar",
  "dotacion",
];

export async function registerMovement(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  const item_id = String(formData.get("item_id") ?? "");
  const location_id = String(formData.get("location_id") ?? "");
  const type = String(formData.get("type") ?? "") as MovimientoTipo;
  const quantity = Number(formData.get("quantity") ?? 0);
  const motivo = String(formData.get("motivo") ?? "").trim() || null;
  const reference = String(formData.get("reference") ?? "").trim() || null;

  if (!item_id || !location_id || !MOVEMENT_TYPES.includes(type)) {
    return { error: "Selecciona insumo, ubicación y tipo de movimiento." };
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { error: "La cantidad debe ser un número mayor que cero." };
  }
  if (type === "merma" && !motivo) {
    return { error: "Indica el motivo de la merma." };
  }

  const { error, data } = await supabase.rpc("apply_movement", {
    p_item_id: item_id,
    p_location_id: location_id,
    p_type: type,
    p_quantity: quantity,
    p_motivo: motivo,
    p_reference: reference,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  revalidatePath("/alerts");
  return {
    success: `Movimiento ${type} registrado (${data?.quantity ?? quantity} unidades).`,
  };
}

// ---------- Minibar ----------

export async function registerMinibarConsumo(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  const room_id = String(formData.get("room_id") ?? "");
  const item_id = String(formData.get("item_id") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);
  const price = Number(formData.get("price") ?? 0);

  if (!room_id || !item_id || quantity <= 0 || price <= 0) {
    return { error: "Completa los datos del consumo." };
  }

  const { error } = await supabase.from("minibar_consumos").insert({
    room_id,
    item_id,
    quantity,
    price,
    facturado: false,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/minibar");
  revalidatePath("/dashboard");
  return { success: "Consumo de minibar registrado (pendiente de facturación)." };
}

// ---------- Lencería ----------

export async function registerLinenMerma(
  prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  const item_id = String(formData.get("item_id") ?? "");
  const location_id = String(formData.get("location_id") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);
  const motivo = String(formData.get("motivo") ?? "").trim();

  if (!item_id || !location_id || quantity <= 0 || !motivo) {
    return { error: "Completa todos los campos, incluido el motivo." };
  }

  const { error } = await supabase.rpc("apply_movement", {
    p_item_id: item_id,
    p_location_id: location_id,
    p_type: "merma",
    p_quantity: quantity,
    p_motivo: motivo,
    p_reference: "LEN-YA",
  });

  if (error) {
    return { error: error.message };
  }

  await supabase.from("linen_cycle").insert({
    item_id,
    room_id: null,
    quantity,
    estado: "baja",
    baja_motivo: motivo,
  });

  revalidatePath("/linen");
  revalidatePath("/dashboard");
  return { success: "Merma de lencería registrada." };
}

// ---------- Alertas ----------

export async function resolveAlert(id: string) {
  const supabase = await createClient();
  await supabase
    .from("alerts")
    .update({ status: "resuelta", resolved_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/alerts");
  revalidatePath("/dashboard");
}
