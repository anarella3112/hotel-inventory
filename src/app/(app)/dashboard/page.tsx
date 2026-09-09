import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS, type InsumoCategoria } from "@/lib/types";

const CATEGORY_COLORS: Record<InsumoCategoria, string> = {
  minibar: "bg-sky-100 text-sky-800",
  lenceria: "bg-emerald-100 text-emerald-800",
  limpieza: "bg-amber-100 text-amber-800",
  amenities: "bg-violet-100 text-violet-800",
  alimentos_bebidas: "bg-rose-100 text-rose-800",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: alerts }, { data: stockRows }, { data: movements }] =
    await Promise.all([
      supabase.from("items").select("id, name, category, cost").eq("active", true),
      supabase
        .from("alerts")
        .select("*")
        .eq("status", "activa")
        .order("created_at", { ascending: false })
        .limit(8),
      supabase.from("v_stock_actual").select("item_id, quantity, stock_min"),
      supabase
        .from("movements")
        .select("id")
        .gte("created_at", new Date(Date.now() - 86400000).toISOString()),
    ]);

  const totalItems = items?.length ?? 0;
  const activeAlerts = alerts?.length ?? 0;
  const totalValue = (stockRows ?? []).reduce((acc, r) => acc + Math.max(0, r.quantity), 0);
  const movementsToday = movements?.length ?? 0;

  const lowStock = (stockRows ?? []).filter((r) => r.quantity < 5).length;

  const recentByCat = (items ?? []).reduce(
    (acc, it) => {
      acc[it.category] = (acc[it.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const cards = [
    {
      label: "Insumos registrados",
      value: totalItems,
      sub: `${Object.keys(recentByCat).length} categorías`,
      color: "bg-sky-50 text-sky-700",
    },
    {
      label: "Alertas activas",
      value: activeAlerts,
      sub: `${lowStock} ítems con stock crítico`,
      color: "bg-red-50 text-red-700",
    },
    {
      label: "Unidades en stock",
      value: totalValue.toLocaleString("es-VE"),
      sub: "Suma de existencias",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Movimientos (24 h)",
      value: movementsToday,
      sub: "Entradas y salidas",
      color: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5"
          >
            <p className={`text-3xl font-bold ${c.color.split(" ")[1]}`}>
              {c.value}
            </p>
            <p className="mt-1 text-sm font-semibold text-zinc-800">{c.label}</p>
            <p className="text-xs text-zinc-400">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white">
          <header className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h3 className="font-semibold text-zinc-900">Insumos por categoría</h3>
            <Link
              href="/items"
              className="text-sm font-medium text-sky-600 hover:underline"
            >
              Ver catálogo →
            </Link>
          </header>
          <div className="space-y-3 p-5">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const count = recentByCat[key] ?? 0;
              const max = Math.max(1, Math.max(...Object.values(recentByCat), 1));
              return (
                <div key={key} className="flex items-center gap-3">
                  <span
                    className={`w-28 rounded-md px-2 py-1 text-center text-xs font-semibold ${CATEGORY_COLORS[key as InsumoCategoria]}`}
                  >
                    {label}
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-sky-500"
                      style={{ width: `${(count / max) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-zinc-600">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white">
          <header className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h3 className="font-semibold text-zinc-900">Alertas recientes</h3>
            <Link
              href="/alerts"
              className="text-sm font-medium text-sky-600 hover:underline"
            >
              Ver todas →
            </Link>
          </header>
          <div className="p-5">
            {alerts && alerts.length > 0 ? (
              <ul className="space-y-3">
                {alerts.map((a) => (
                  <li
                    key={a.id}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      a.nivel === "critica"
                        ? "bg-red-50 text-red-800"
                        : a.nivel === "media"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-zinc-50 text-zinc-700"
                    }`}
                  >
                    <span className="font-semibold uppercase">{a.type.replace("_", " ")}:</span>{" "}
                    {a.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-zinc-400">
                No hay alertas activas. Todo bajo control. 
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}