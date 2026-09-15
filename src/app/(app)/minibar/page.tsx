import { createClient } from "@/lib/supabase/server";
import { MinibarForm } from "@/components/forms/minibar-form";
import { MinibarPaymentForm } from "@/components/forms/minibar-payment-form";

export default async function MinibarPage() {
  const supabase = await createClient();

  const [{ data: rooms }, { data: items }, { data: consumos }] =
    await Promise.all([
      supabase.from("rooms").select("id, number").eq("active", true).order("number"),
      supabase
        .from("items")
         .select("id, name, sale_price")
        .eq("active", true)
        .in("category", ["minibar", "alimentos_bebidas"])
        .order("name"),
      supabase
        .from("minibar_consumos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30),
    ]);

  const roomMap = new Map((rooms ?? []).map((r) => [r.id, r.number]));
  const itemMap = new Map((items ?? []).map((i) => [i.id, i.name]));

  const rows = (consumos ?? []).map((c) => ({
    ...c,
    roomNumber: roomMap.get(c.room_id) ?? "—",
    itemName: itemMap.get(c.item_id) ?? "—",
  }));

  const totalNoFacturado = rows
    .filter((c) => !c.facturado)
    .reduce((acc, c) => acc + Number(c.price) * c.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Control de minibar</h1>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
          Por cobrar: {totalNoFacturado.toFixed(2)} Bs
        </span>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-zinc-500">
          Registrar consumo detectado en habitación
        </h2>
        <MinibarForm rooms={rooms ?? []} items={items ?? []} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h3 className="font-semibold text-zinc-900">Consumos registrados</h3>
        </header>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-semibold">Habitación</th>
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Cant.</th>
              <th className="px-4 py-3 font-semibold">Importe</th>
              <th className="px-4 py-3 font-semibold">Estado / cobro</th>
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
                  <td className="px-4 py-2.5 font-semibold text-zinc-800">
                    Hab. {c.roomNumber}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">{c.itemName}</td>
                  <td className="px-4 py-2.5 text-zinc-600">{c.quantity}</td>
                  <td className="px-4 py-2.5 font-semibold text-zinc-800">
                    {(Number(c.price) * c.quantity).toFixed(2)} Bs
                  </td>
                  <td className="px-4 py-2.5">
                    {c.facturado ? (
                      <div className="space-y-1"><span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">Cobrado</span><p className="text-[11px] text-zinc-500">{c.payment_method ?? "Método no registrado"} · {c.paid_at ? new Date(c.paid_at).toLocaleDateString("es-VE") : "Fecha no registrada"}</p></div>
                    ) : (
                      <div className="space-y-1"><span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Pendiente</span><MinibarPaymentForm id={c.id} /></div>
                    )}
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
                  Sin consumos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
