import { createClient } from "@/lib/supabase/server";
import { MovementForm } from "@/components/forms/movement-form";
import { TYPE_LABELS, type MovimientoTipo } from "@/lib/types";

const ESTADO_BADGES: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-800",
  stock_bajo: "bg-amber-100 text-amber-800",
  stock_critico: "bg-red-100 text-red-800",
};

export default async function InventoryPage() {
  const supabase = await createClient();

  const [{ data: stock }, { data: locations }, { data: items }, { data: movements }] =
    await Promise.all([
      supabase.from("v_stock_actual").select("*").order("name"),
      supabase.from("locations").select("id, name").eq("active", true).order("name"),
        supabase.from("items").select("id, name, stock_min, stock_max").eq("active", true).order("name"),
      supabase
        .from("movements")
        .select("id, type, quantity, motivo, reference, created_at")
        .order("created_at", { ascending: false })
        .limit(15),
    ]);

  const grouped = new Map<string, typeof stock>();
  for (const row of stock ?? []) {
    const list = grouped.get(row.item_id) ?? [];
    list.push(row);
    grouped.set(row.item_id, list);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Inventario y movimientos</h1>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-zinc-500">
          Registrar movimiento (entrada, salida, merma…)
        </h2>
        <MovementForm items={items ?? []} locations={locations ?? []} stock={stock ?? []} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h3 className="font-semibold text-zinc-900">Stock actual por ubicación</h3>
        </header>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-semibold">Insumo</th>
              <th className="px-4 py-3 font-semibold">Ubicación</th>
              <th className="px-4 py-3 font-semibold">Cantidad</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {stock && stock.length > 0 ? (
              stock.map((r) => (
                <tr
                  key={`${r.item_id}-${r.location_id}`}
                  className="border-b border-zinc-50 transition hover:bg-zinc-50/50"
                >
                  <td className="px-4 py-2.5 font-medium text-zinc-800">
                    {r.name}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">{r.location}</td>
                  <td className="px-4 py-2.5 font-semibold text-zinc-800">
                    {r.quantity} <span className="font-normal text-zinc-400">({r.unit})</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold ${ESTADO_BADGES[r.estado] ?? "bg-zinc-100 text-zinc-700"}`}
                    >
                      {r.estado === "ok"
                        ? "OK"
                        : r.estado === "stock_bajo"
                          ? "Stock bajo"
                          : "Crítico"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-400">
                  Sin datos de stock.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h3 className="font-semibold text-zinc-900">Últimos movimientos</h3>
        </header>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Cantidad</th>
              <th className="px-4 py-3 font-semibold">Motivo</th>
              <th className="px-4 py-3 font-semibold">Ref.</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movements && movements.length > 0 ? (
              movements.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-zinc-50 transition hover:bg-zinc-50/50"
                >
                  <td className="px-4 py-2.5">
                    <span className="font-medium text-zinc-700">
                      {TYPE_LABELS[m.type as MovimientoTipo]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-zinc-800">
                    {m.quantity}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">{m.motivo ?? "—"}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">
                    {m.reference ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-500">
                    {new Date(m.created_at).toLocaleString("es-VE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  Sin movimientos todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
