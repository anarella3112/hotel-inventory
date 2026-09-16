"use client";

import { useActionState, useState } from "react";
import { createItem, type ActionState } from "@/lib/actions/inventory";
import { FormResult } from "@/components/form-result";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS, UNIT_OPTIONS, type InsumoCategoria } from "@/lib/types";

const initialState: ActionState = {};

const CATEGORIES = Object.keys(CATEGORY_LABELS) as InsumoCategoria[];

export function NewItemForm({ providers }: { providers: string[] }) {
  const [state, formAction, pending] = useActionState(createItem, initialState);
  const [category, setCategory] = useState<InsumoCategoria>("minibar");
  const [provider, setProvider] = useState("");
  const [unit, setUnit] = useState(UNIT_OPTIONS.minibar[0]);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Nombre del insumo *
        </label>
        <input
          name="name"
          required
          placeholder="ej. Toalla de baño 70x140"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          SKU *
        </label>
        <input
          name="sku"
          required
          placeholder="ej. LEN-TOA-01"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Categoría *
        </label>
        <select
          name="category"
          required
          value={category}
          onChange={(event) => {
            const nextCategory = event.target.value as InsumoCategoria;
            setCategory(nextCategory);
            setUnit(UNIT_OPTIONS[nextCategory][0]);
          }}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Subcategoría *
        </label>
        <select
          name="subcategory"
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          {SUBCATEGORY_LABELS[category].map((subcategory) => (
            <option key={subcategory} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Unidad *
        </label>
        <select
          name="unit"
          required
          value={unit}
          onChange={(event) => setUnit(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          {UNIT_OPTIONS[category].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Costo unitario (Bs/USD)
        </label>
        <input
          name="cost"
          type="number"
          step="0.01"
          min="0"
          defaultValue={0}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Proveedor
        </label>
        <select
          name="provider"
          value={provider}
          onChange={(event) => setProvider(event.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        >
          <option value="">— Sin proveedor —</option>
          {providers.map((item) => <option key={item} value={item}>{item}</option>)}
          <option value="__new__">+ Agregar otro proveedor</option>
        </select>
        {provider === "__new__" && (
          <input
            name="new_provider"
            required
            autoFocus
            placeholder="Nombre del nuevo proveedor"
            className="mt-2 w-full rounded-lg border border-[#1E6BD6] px-3 py-2 text-sm outline-none ring-2 ring-[#cfe0fb]"
          />
        )}
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Stock mínimo *
        </label>
        <input
          name="stock_min"
          type="number"
          min="0"
          required
          defaultValue={0}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-600">
          Stock máximo *
        </label>
        <input
          name="stock_max"
          type="number"
          min="0"
          required
          defaultValue={0}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        />
      </div>
      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
        >
          {pending ? "Registrando…" : "Registrar insumo"}
        </button>
      </div>
      <div className="sm:col-span-2 lg:col-span-3">
        <FormResult state={state} />
      </div>
    </form>
  );
}
