import { createClient } from "@/lib/supabase/server";
import { resolveAlert } from "@/lib/actions/inventory";

const NIVEL_BADGES: Record<string, string> = {
  critica: "bg-red-100 text-red-800",
  media: "bg-amber-100 text-amber-800",
  baja: "bg-sky-100 text-sky-800",
  info: "bg-zinc-100 text-zinc-700",
};

export default async function AlertsPage() {
  const supabase = await createClient();

  const { data: alerts } = await supabase
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false });

  const activas = alerts?.filter((a) => a.status === "activa") ?? [];
  const resueltas = alerts?.filter((a) => a.status === "resuelta") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Alertas de inventario</h1>
        <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-700">
          {activas.length} activas
        </span>
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h3 className="font-semibold text-zinc-900">Alertas activas</h3>
        </header>
        <ul className="divide-y divide-zinc-50">
          {activas.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-zinc-400">
              No hay alertas activas.
            </li>
          )}
          {activas.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-3">
              <div className="min-w-0">
                <div className="mb-0.5 flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase ${NIVEL_BADGES[a.nivel] ?? "bg-zinc-100 text-zinc-700"}`}
                  >
                    {a.nivel}
                  </span>
                  <span className="text-xs font-semibold uppercase text-zinc-500">
                    {a.type.replace("_", " ")}
                  </span>
                  <span className="text-xs text-zinc-300">
                    {new Date(a.created_at).toLocaleString("es-VE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <p className="text-sm text-zinc-800">{a.message}</p>
              </div>
              <form action={resolveAlert.bind(null, a.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                >
                  Resolver
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      {resueltas.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          <header className="border-b border-zinc-100 px-5 py-4">
            <h3 className="font-semibold text-zinc-900">
              Resueltas ({resueltas.length})
            </h3>
          </header>
          <ul className="divide-y divide-zinc-50">
            {resueltas.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <p className="text-sm text-zinc-500 line-through decoration-zinc-300">
                  {a.message}
                </p>
                <span className="text-xs text-zinc-400">
                  {a.resolved_at
                    ? new Date(a.resolved_at).toLocaleString("es-VE", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}