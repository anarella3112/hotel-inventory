"use client";

import { useActionState, useState } from "react";
import { registerMovement, type ActionState } from "@/lib/actions/inventory";
import { FormResult } from "@/components/form-result";
import type { Item, Location, MovimientoTipo } from "@/lib/types";
import { TYPE_LABELS } from "@/lib/types";

const initialState: ActionState = {};

const TYPES: MovimientoTipo[] = [
  "entrada",
  "salida",
  "merma",
  "ajuste",
  "consumo_minibar",
];

export function MovementForm({
  items,
  locations,
  stock,
}: {
  items: Pick<Item, "id" | "name" | "stock_min" | "stock_max">[];
  locations: Pick<Location, "id" | "name">[];
  stock: { item_id: string; location_id: string; quantity: number; stock_min: number; stock_max: number }[];
}) {
  const [state, formAction, pending] = useActionState(
    registerMovement,
    initialState,
  );
  const [itemId, setItemId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [movementType, setMovementType] = useState<MovimientoTipo>("entrada");
  const [quantity, setQuantity] = useState(0);
  const [searched, setSearched] = useState(false);
  const selectedStock = stock.find((row) => row.item_id === itemId && row.location_id === locationId);
  const selectedItem = items.find((item) => item.id === itemId);
  const projectedMax = (selectedStock?.quantity ?? 0) + quantity;

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-5 md:grid-cols-2 xl:grid-cols-3"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Insumo *
        </label>
        <select
          name="item_id"
          required
          value={itemId}
          onChange={(event) => { setItemId(event.target.value); setSearched(false); }}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          <option value="">— Seleccionar —</option>
          {items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Ubicación *
        </label>
        <select
          name="location_id"
          required
          value={locationId}
          onChange={(event) => { setLocationId(event.target.value); setSearched(false); }}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          <option value="">— Seleccionar —</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-end">
        <button type="button" onClick={() => setSearched(Boolean(itemId && locationId))} disabled={!itemId || !locationId} className="w-full rounded-lg border border-[#1E6BD6] px-3 py-2 text-sm font-semibold text-[#0B2D5B] transition hover:bg-[#eaf2ff] disabled:cursor-not-allowed disabled:opacity-50">
          Buscar artículo
        </button>
      </div>
      {searched && itemId && locationId && (
        <div className="rounded-lg border border-[#cfe0fb] bg-[#f4f8ff] px-3 py-2 text-xs text-[#0B2D5B] md:col-span-2 xl:col-span-3">
          <strong>{selectedItem?.name}</strong>: stock actual <strong>{selectedStock?.quantity ?? 0}</strong> · mínimo <strong>{selectedStock?.stock_min ?? selectedItem?.stock_min ?? 0}</strong> · máximo actual <strong>{selectedStock?.stock_max ?? selectedItem?.stock_max ?? 0}</strong>.
          {movementType === "entrada" && quantity > 0 && <span className="ml-1 font-semibold text-emerald-700">Máximo después de añadir {quantity}: {projectedMax}</span>}
          <span className="ml-1 block text-[#0B2D5B]/70">El mínimo activa la alerta; el máximo es la meta de reposición.</span>
        </div>
      )}
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Tipo de movimiento *
        </label>
        <select
          name="type"
          required
          value={movementType}
          onChange={(event) => setMovementType(event.target.value as MovimientoTipo)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Cantidad *
        </label>
        <input
          name="quantity"
          type="number"
          min="1"
          step="1"
          required
          value={quantity || ""}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Referencia (factura/orden)
        </label>
        <input
          name="reference"
          placeholder="ej. FAC-2026-010"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Motivo (obligatorio en mermas)
        </label>
        <input
          name="motivo"
          placeholder="ej. Pérdida en lavandería"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div className="flex items-end md:col-span-2 xl:col-span-3">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
        >
          {pending ? "Registrando…" : "Registrar movimiento"}
        </button>
      </div>
      <div className="md:col-span-2 xl:col-span-3">
        <FormResult state={state} />
      </div>
    </form>
  );
}
