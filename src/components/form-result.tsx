import type { ActionState } from "@/lib/actions/inventory";

export function FormResult({ state }: { state: ActionState }) {
  if (!state) return null;
  if (state.success) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
        ✓ {state.success}
      </div>
    );
  }
  if (state.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        ✕ {state.error}
      </div>
    );
  }
  return null;
}