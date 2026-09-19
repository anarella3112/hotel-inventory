"use client";

import { useActionState } from "react";
import { updateUserProfile, type AuthState } from "@/lib/actions/auth";
import type { AppRole } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";

export function UserRoleForm({ user }: { user: { id: string; full_name: string | null; role: AppRole; active: boolean } }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(updateUserProfile, {});

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={user.id} />
      <select name="role" defaultValue={user.role} className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs">
        {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <label className="flex items-center gap-1 text-xs text-zinc-600">
        <input type="checkbox" name="active" defaultChecked={user.active} /> Activo
      </label>
      <button type="submit" disabled={pending} className="rounded-md bg-[#0B2D5B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1E6BD6] disabled:opacity-50">
        {pending ? "Guardando…" : "Guardar"}
      </button>
      {state.error && <span className="text-xs text-red-600">{state.error}</span>}
      {state.success && <span className="text-xs text-emerald-700">{state.success}</span>}
    </form>
  );
}
