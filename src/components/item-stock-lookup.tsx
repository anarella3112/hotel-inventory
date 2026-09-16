"use client";

import { useActionState, useState } from "react";
import { registerMovement, type ActionState } from "@/lib/actions/inventory";
import type { Item, Location } from "@/lib/types";

type StockRow = { item_id: string; location_id: string; quantity: number; stock_min: number; stock_max: number };

export function ItemStockLookup({
  items,
  locations,
  stock,
}: {
  items: Pick<Item, "id" | "name" | "stock_min" | "stock_max">[];
  locations: Pick<Location, "id" | "name">[];
  stock: StockRow[];
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(registerMovement, {});
  const [itemId, setItemId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [searched, setSearched] = useState(false);
  const selectedItem = items.find((item) => item.id === itemId);
  const selectedStock = stock.find((row) => row.item_id === itemId && row.location_id === locationId);
  const current = selectedStock?.quantity ?? 0;
  const minimum = selectedStock?.stock_min ?? selectedItem?.stock_min ?? 0;
  const maximum = current + quantity;

  return (
    <section className="rounded-2xl border border-[#cfe0fb] bg-[#f8fbff] p-5">
      <div className="mb-4">
        <h2 className="font-semibold text-[#0B2D5B]">Consultar y reponer artículo</h2>
        <p className="text-sm text-zinc-500">Busca un artículo existente para conocer su stock actual y calcular la reposición.</p>
      </div>
      <form action={formAction} className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input type="hidden" name="type" value="entrada" />
        <input type="hidden" name="item_id" value={itemId} />
        <input type="hidden" name="location_id" value={locationId} />
        <input type="hidden" name="quantity" value={quantity} />
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">Artículo *</label>
          <select required value={itemId} onChange={(event) => { setItemId(event.target.value); setSearched(false); }} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm">
            <option value="">— Seleccionar artículo —</option>
            {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">Ubicación *</label>
          <select required value={locationId} onChange={(event) => { setLocationId(event.target.value); setSearched(false); }} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm">
            <option value="">— Seleccionar ubicación —</option>
            {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button type="button" onClick={() => setSearched(Boolean(itemId && locationId))} disabled={!itemId || !locationId} className="w-full rounded-lg border border-[#1E6BD6] px-3 py-2 text-sm font-semibold text-[#0B2D5B] hover:bg-[#eaf2ff] disabled:opacity-50">Buscar artículo</button>
        </div>
        {searched && (
          <div className="rounded-lg border border-[#cfe0fb] bg-white p-3 text-sm text-[#0B2D5B] md:col-span-3">
            <p><strong>{selectedItem?.name}</strong> · Stock actual: <strong>{current}</strong> · Mínimo: <strong>{minimum}</strong> · Máximo actual: <strong>{selectedStock?.stock_max ?? selectedItem?.stock_max ?? 0}</strong></p>
            <p className="mt-1 text-xs text-zinc-500">El mínimo activa la alerta. El máximo resultante será el stock actual más la cantidad añadida.</p>
          </div>
        )}
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">Cantidad a añadir</label>
          <input type="number" min="0" value={quantity || ""} onChange={(event) => setQuantity(Number(event.target.value))} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        </div>
        <div className="flex items-end rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800 md:col-span-2">
          Máximo después de añadir: <strong className="ml-1">{maximum}</strong>
        </div>
        <button type="submit" disabled={!searched || quantity <= 0 || pending} className="rounded-lg bg-[#0B2D5B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1E6BD6] disabled:opacity-50 md:col-span-3">
          {pending ? "Registrando…" : "Registrar reposición"}
        </button>
        {state.error && <p className="text-sm text-red-700 md:col-span-3">{state.error}</p>}
        {state.success && <p className="text-sm text-emerald-700 md:col-span-3">✓ {state.success}</p>}
      </form>
    </section>
  );
}
