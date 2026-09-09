import { createClient } from "@/lib/supabase/server";
import { NewItemForm } from "@/components/forms/new-item-form";
import { CATEGORY_LABELS, type InsumoCategoria } from "@/lib/types";

const CATEGORY_BADGES: Record<InsumoCategoria, string> = {
  minibar: "bg-sky-100 text-sky-800",
  lenceria: "bg-emerald-100 text-emerald-800",
  limpieza: "bg-amber-100 text-amber-800",
  amenities: "bg-violet-100 text-violet-800",
  alimentos_bebidas: "bg-rose-100 text-rose-800",
};

export default async function ItemsPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("items")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Catálogo de insumos</h1>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600">
          {items?.length ?? 0} registros
        </span>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-zinc-500">
          Registrar nuevo insumo
        </h2>
        <NewItemForm />
      </section>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-semibold">Insumo</th>
              <th className="px-4 py-3 font-semibold">SKU</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Unidad</th>
              <th className="px-4 py-3 font-semibold">Costo</th>
              <th className="px-4 py-3 font-semibold">Proveedor</th>
              <th className="px-4 py-3 font-semibold">Stock mín/máx</th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((it) => (
                <tr
                  key={it.id}
                  className="border-b border-zinc-50 transition hover:bg-zinc-50/50"
                >
                  <td className="px-4 py-3 font-medium text-zinc-800">
                    {it.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                    {it.sku}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold ${CATEGORY_BADGES[it.category as InsumoCategoria]}`}
                    >
                      {CATEGORY_LABELS[it.category as InsumoCategoria]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{it.unit}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {Number(it.cost).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{it.provider}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {it.stock_min} / {it.stock_max}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  No hay insumos registrados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}