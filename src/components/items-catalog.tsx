"use client";

import { useMemo, useState } from "react";
import { CATEGORY_LABELS, SUBCATEGORY_LABELS, type InsumoCategoria } from "@/lib/types";

type CatalogItem = {
  id: string;
  name: string;
  sku: string;
  category: InsumoCategoria;
  subcategory: string | null;
  unit: string;
  cost: number;
  provider: string | null;
  stock_min: number;
  stock_max: number;
};

export function ItemsCatalog({ items }: { items: CatalogItem[] }) {
  const [category, setCategory] = useState("all");
  const [subcategory, setSubcategory] = useState("all");
  const availableSubcategories = category === "all"
    ? []
    : SUBCATEGORY_LABELS[category as InsumoCategoria] ?? [];
  const filteredItems = useMemo(
    () => items.filter((item) =>
      (category === "all" || item.category === category) &&
      (subcategory === "all" || item.subcategory === subcategory),
    ),
    [category, items, subcategory],
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 sm:flex-row">
        <select value={category} onChange={(event) => { setCategory(event.target.value); setSubcategory("all"); }} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm">
          <option value="all">Todas las categorías</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)} disabled={category === "all"} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm disabled:bg-zinc-50 disabled:text-zinc-400">
          <option value="all">Todas las subcategorías</option>
          {availableSubcategories.map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <span className="self-center text-sm text-zinc-500">{filteredItems.length} registros</span>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[850px] text-sm">
          <thead><tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3 font-semibold">Insumo</th><th className="px-4 py-3 font-semibold">SKU</th><th className="px-4 py-3 font-semibold">Categoría</th><th className="px-4 py-3 font-semibold">Subcategoría</th><th className="px-4 py-3 font-semibold">Unidad</th><th className="px-4 py-3 font-semibold">Costo</th><th className="px-4 py-3 font-semibold">Proveedor</th><th className="px-4 py-3 font-semibold">Stock mín/máx</th>
          </tr></thead>
          <tbody>{filteredItems.length > 0 ? filteredItems.map((item) => <tr key={item.id} className="border-b border-zinc-50 transition hover:bg-zinc-50/50">
            <td className="px-4 py-3 font-medium text-zinc-800">{item.name}</td><td className="px-4 py-3 font-mono text-xs text-zinc-500">{item.sku}</td><td className="px-4 py-3 text-zinc-700">{CATEGORY_LABELS[item.category]}</td><td className="px-4 py-3"><span className="rounded-md bg-[#eaf2ff] px-2 py-1 text-xs font-semibold text-[#0B2D5B]">{item.subcategory ?? "Sin subcategoría"}</span></td><td className="px-4 py-3 text-zinc-600">{item.unit}</td><td className="px-4 py-3 text-zinc-600">{Number(item.cost).toFixed(2)}</td><td className="px-4 py-3 text-zinc-600">{item.provider}</td><td className="px-4 py-3 text-zinc-600">{item.stock_min} / {item.stock_max}</td>
          </tr>) : <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-400">No hay insumos para ese filtro.</td></tr>}</tbody>
        </table>
      </div>
    </div>
  );
}
