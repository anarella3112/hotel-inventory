"use client";

import { useActionState } from "react";
import { runAiAnalysis, type AiState } from "@/lib/actions/ai";

const initialState: AiState = {};

export function AiAnalyzer() {
  const [state, formAction, pending] = useActionState(
    runAiAnalysis,
    initialState,
  );

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <form action={formAction}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-zinc-900">
              Análisis inteligente del inventario
            </h3>
            <p className="text-sm text-zinc-500">
              Gemini analiza stock, mermas y consumos pendientes para detectar
              fugas y sugerir reposiciones.
            </p>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-gradient-to-r from-sky-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Analizando con Gemini…" : "✦ Ejecutar análisis IA"}
          </button>
        </div>
      </form>

      <div className="mt-4 space-y-4">
        {state.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {state.analysis && (
          <>
            <div className="rounded-lg border border-violet-100 bg-violet-50 p-4">
              <p className="text-sm text-violet-900">{state.analysis}</p>
            </div>

            {state.riesgos && state.riesgos.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Riesgos / fugas detectadas
                </h4>
                <ul className="space-y-1.5">
                  {state.riesgos.map((r, i) => (
                    <li
                      key={i}
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800"
                    >
                      ⚠ {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {state.reposiciones && state.reposiciones.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-zinc-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                       <th className="px-3 py-2 font-semibold">Insumo</th>
                       <th className="px-3 py-2 font-semibold">SKU</th>
                      <th className="px-3 py-2 font-semibold">
                        Reposición sugerida
                      </th>
                      <th className="px-3 py-2 font-semibold">Justificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.reposiciones.map((r, i) => (
                      <tr key={i} className="border-b border-zinc-50">
                         <td className="px-3 py-2 font-medium text-zinc-800">{r.name}</td>
                         <td className="px-3 py-2 font-mono text-xs">{r.sku}</td>
                        <td className="px-3 py-2 font-semibold text-emerald-700">
                          {r.cantidad_sugerida}
                        </td>
                        <td className="px-3 py-2 text-zinc-600">
                          {r.justificacion}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {state.usage && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Tokens de entrada", value: state.usage.promptTokens },
                  {
                    label: "Tokens de salida",
                    value: state.usage.completionTokens,
                  },
                  { label: "Tokens totales", value: state.usage.totalTokens },
                  {
                    label: "Costo estimado (USD)",
                    value: `$${state.usage.cost.toFixed(6)}`,
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-center"
                  >
                    <p className="text-lg font-bold text-zinc-800">{m.value}</p>
                    <p className="text-[11px] text-zinc-500">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
