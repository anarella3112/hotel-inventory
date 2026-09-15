"use client";

import { useActionState } from "react";
import { markMinibarPaid, type ActionState } from "@/lib/actions/inventory";

export function MinibarPaymentForm({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(markMinibarPaid, {});

  return (
    <form action={formAction} className="flex min-w-[190px] items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <select name="payment_method" required defaultValue="" className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs">
        <option value="">Método</option>
        <option value="Efectivo">Efectivo</option>
        <option value="Tarjeta">Tarjeta</option>
        <option value="Transferencia">Transferencia</option>
        <option value="Pago móvil">Pago móvil</option>
      </select>
      <button type="submit" disabled={pending} className="rounded-md bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
        {pending ? "..." : "Cobrar"}
      </button>
      {state.error && <span className="text-[10px] text-red-600">{state.error}</span>}
    </form>
  );
}
