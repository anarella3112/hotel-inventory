"use client";

import { useActionState } from "react";
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
}: {
  items: Pick<Item, "id" | "name">[];
  locations: Pick<Location, "id" | "name">[];
}) {
  const [state, formAction, pending] = useActionState(
    registerMovement,
    initialState,
  );

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
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Tipo de movimiento *
        </label>
        <select
          name="type"
          required
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