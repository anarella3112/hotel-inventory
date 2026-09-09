"use client";

import { useActionState } from "react";
import {
  registerMinibarConsumo,
  type ActionState,
} from "@/lib/actions/inventory";
import { FormResult } from "@/components/form-result";
import type { Item, Room } from "@/lib/types";

const initialState: ActionState = {};

export function MinibarForm({
  rooms,
  items,
}: {
  rooms: Pick<Room, "id" | "number">[];
  items: Pick<Item, "id" | "name">[];
}) {
  const [state, formAction, pending] = useActionState(
    registerMinibarConsumo,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-5 md:grid-cols-2 xl:grid-cols-4"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Habitación *
        </label>
        <select
          name="room_id"
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          <option value="">— Seleccionar —</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              Hab. {r.number}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Producto *
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
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Precio de venta (Bs) *
        </label>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div className="flex items-end md:col-span-2 xl:col-span-4">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
        >
          {pending ? "Registrando…" : "Registrar consumo"}
        </button>
      </div>
      <div className="md:col-span-2 xl:col-span-4">
        <FormResult state={state} />
      </div>
    </form>
  );
}