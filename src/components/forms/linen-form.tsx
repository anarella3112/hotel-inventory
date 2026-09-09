"use client";

import { useActionState } from "react";
import {
  registerLinenMerma,
  type ActionState,
} from "@/lib/actions/inventory";
import { FormResult } from "@/components/form-result";
import type { Item, Location } from "@/lib/types";

const initialState: ActionState = {};

export function LinenForm({
  items,
  locations,
}: {
  items: Pick<Item, "id" | "name">[];
  locations: Pick<Location, "id" | "name">[];
}) {
  const [state, formAction, pending] = useActionState(
    registerLinenMerma,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-5 md:grid-cols-3"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Prenda (lencería) *
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
          Cantidad *
        </label>
        <input
          name="quantity"
          type="number"
          min="1"
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Motivo de la merma *
        </label>
        <input
          name="motivo"
          required
          placeholder="ej. Daño en lavado industrial, pérdida, robo…"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
        >
          {pending ? "Registrando…" : "Registrar merma"}
        </button>
      </div>
      <div className="md:col-span-3">
        <FormResult state={state} />
      </div>
    </form>
  );
}