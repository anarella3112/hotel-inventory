"use client";

import { useActionState } from "react";
import {
  dispatchAutomation,
  type AutomationState,
} from "@/lib/actions/automation";

const initialState: AutomationState = {};

export function AutoReportSender({ canDispatch }: { canDispatch: boolean }) {
  const [state, formAction, pending] = useActionState(
    dispatchAutomation,
    initialState,
  );

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <form action={formAction}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-zinc-900">
              Reporte automático (n8n)
            </h3>
            <p className="text-sm text-zinc-500">
              Dispara el flujo: webhook → procesamiento → IA Gemini → salida por
              email/PDF.
            </p>
          </div>
          {canDispatch ? (
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {pending ? "Enviando a n8n…" : "↗ Disparar automatización"}
            </button>
          ) : (
            <span className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-500">
              Solo Gerencia y Administración
            </span>
          )}
        </div>
      </form>

      <div className="mt-4 space-y-3">
        {state.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </div>
        )}
        {state.success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            ✓ {state.success}
          </div>
        )}
        {state.preview && (
          <details className="rounded-lg border border-zinc-200 bg-zinc-50">
            <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-zinc-600">
              Ver payload generado
            </summary>
            <pre className="overflow-x-auto px-3 pb-3 text-xs text-zinc-700">
              {state.preview}
            </pre>
          </details>
        )}
      </div>
    </section>
  );
}
