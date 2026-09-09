import { createClient } from "@/lib/supabase/server";
import { LinenForm } from "@/components/forms/linen-form";

const ESTADO_LABELS: Record<string, string> = {
  limpia: "Limpia",
  sucia: "Sucia",
  lavanderia: "En lavandería",
  baja: "Dada de baja",
};

export default async function LinenPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: locations }, { data: cycle }, { data: rooms }] =
    await Promise.all([
      supabase
        .from("items")
        .select("id, name")
        .eq("active", true)
        .eq("category", "lenceria")
        .order("name"),
      supabase.from("locations").select("id, name").eq("active", true).order("name"),
      supabase
        .from("linen_cycle")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30),
      supabase.from("rooms").select("id, number"),
    ]);

  const itemMap = new Map((items ?? []).map((i) => [i.id, i.name]));
  const roomMap = new Map((rooms ?? []).map((r) => [r.id, r.number]));

  const rows = (cycle ?? []).map((c) => ({
    ...c,
    itemName: itemMap.get(c.item_id) ?? "—",
    roomNumber: c.room_id ? roomMap.get(c.room_id) ?? "—" : null,
  }));

  const lavanderia = locations?.find((l) => l.name === "Lavandería / Ropería");
  const locationsFiltered = lavanderia ? [lavanderia] : (locations ?? []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Ciclo de lencería</h1>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-zinc-500">
          Registrar merma / baja de lencería (trazabilidad)
        </h2>
        <LinenForm items={items ?? []} locations={locationsFiltered} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h3 className="font-semibold text-zinc-900">Registro del ciclo de lencería</h3>
        </header>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-semibold">Prenda</th>
              <th className="px-4 py-3 font-semibold">Habitación</th>
              <th className="px-4 py-3 font-semibold">Cant.</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Motivo de baja</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-zinc-50 transition hover:bg-zinc-50/50"
                >
                  <td className="px-4 py-2.5 font-medium text-zinc-800">
                    {c.itemName}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">
                    {c.roomNumber ? `Hab. ${c.roomNumber}` : "—"}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-zinc-800">
                    {c.quantity}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                        c.estado === "baja"
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {ESTADO_LABELS[c.estado as string]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">
                    {c.baja_motivo ?? "—"}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-500">
                    {new Date(c.created_at).toLocaleString("es-VE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-400">
                  Sin registros de lencería todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}