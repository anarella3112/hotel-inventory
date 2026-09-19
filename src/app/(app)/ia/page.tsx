import { createClient } from "@/lib/supabase/server";
import { AiAnalyzer } from "@/components/ai-analyzer";
import { AutoReportSender } from "@/components/auto-report-sender";

export default async function IaPage() {
  const supabase = await createClient();

  const [{ data: userData }, { data: usageLog }, { data: predictions }, { data: items }] =
    await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from("ai_usage_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("ai_predictions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.from("items").select("id, name, sku"),
    ]);

  const itemMap = new Map((items ?? []).map((i) => [i.id, i]));
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user?.id ?? "")
    .maybeSingle();
  const canDispatch = profile?.role === "admin" || profile?.role === "gerencia";

  const predRows = (predictions ?? []).map((p) => ({
    ...p,
    item: itemMap.get(p.item_id),
  }));

  const totals = (usageLog ?? []).reduce(
    (acc, u) => {
      acc.prompt += u.prompt_tokens;
      acc.completion += u.completion_tokens;
      acc.total += u.total_tokens;
      acc.cost += u.cost_estimate ?? 0;
      return acc;
    },
    { prompt: 0, completion: 0, total: 0, cost: 0 },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">IA y Reportes</h1>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
          Gemini · {usageLog?.[0]?.model ?? "gemini-3.6-flash"}
        </span>
      </div>

      <AiAnalyzer />

      <AutoReportSender canDispatch={canDispatch} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Tokens de entrada acumulados", value: totals.prompt.toLocaleString() },
          { label: "Tokens de salida acumulados", value: totals.completion.toLocaleString() },
          { label: "Tokens totales acumulados", value: totals.total.toLocaleString() },
          { label: "Costo acumulado (USD)", value: `$${totals.cost.toFixed(6)}` },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-zinc-200 bg-white p-4"
          >
            <p className="text-2xl font-bold text-zinc-900">{m.value}</p>
            <p className="text-xs text-zinc-500">{m.label}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h3 className="font-semibold text-zinc-900">
            Registro de consumo de tokens (baremo punto 10)
          </h3>
        </header>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-semibold">Función</th>
              <th className="px-4 py-3 font-semibold">Modelo</th>
              <th className="px-4 py-3 font-semibold">Entrada</th>
              <th className="px-4 py-3 font-semibold">Salida</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Costo (USD)</th>
              <th className="px-4 py-3 font-semibold">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {usageLog && usageLog.length > 0 ? (
              usageLog.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-zinc-50 transition hover:bg-zinc-50/50"
                >
                  <td className="px-4 py-2.5 font-medium text-zinc-800">
                    {u.feature}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">
                    {u.model}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">
                    {u.prompt_tokens}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">
                    {u.completion_tokens}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-zinc-800">
                    {u.total_tokens}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">
                    ${(u.cost_estimate ?? 0).toFixed(6)}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-500">
                    {new Date(u.created_at).toLocaleString("es-VE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-400">
                  Aún no hay llamadas a la IA. Ejecuta el análisis para ver el
                  consumo de tokens.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <header className="border-b border-zinc-100 px-5 py-4">
          <h3 className="font-semibold text-zinc-900">
            Predicciones de reposición generadas
          </h3>
        </header>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <th className="px-4 py-3 font-semibold">Insumo</th>
              <th className="px-4 py-3 font-semibold">SKU</th>
              <th className="px-4 py-3 font-semibold">Fecha prevista</th>
              <th className="px-4 py-3 font-semibold">Cantidad</th>
              <th className="px-4 py-3 font-semibold">Modelo</th>
            </tr>
          </thead>
          <tbody>
            {predRows.length > 0 ? (
              predRows.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-50 transition hover:bg-zinc-50/50"
                >
                  <td className="px-4 py-2.5 font-medium text-zinc-800">
                    {p.item?.name}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">
                    {p.item?.sku}
                  </td>
                  <td className="px-4 py-2.5 text-zinc-600">
                    {new Date(p.predicted_date + "T12:00:00").toLocaleDateString(
                      "es-VE",
                      { dateStyle: "short" },
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-zinc-800">
                    {p.quantity_pred}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-zinc-500">
                    {p.model}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400">
                  Sin predicciones todavía. Ejecuta el análisis IA.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
