import { createClient } from "@/lib/supabase/server";
import { UserRoleForm } from "@/components/forms/user-role-form";
import type { AppRole } from "@/lib/types";

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, active")
    .order("full_name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Administración de usuarios</h1>
        <p className="mt-1 text-sm text-zinc-500">Cambia roles y estado. Las cuentas se crean desde Supabase Authentication.</p>
      </div>
      <section className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[680px] text-sm">
          <thead><tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500"><th className="px-4 py-3">Usuario</th><th className="px-4 py-3">ID</th><th className="px-4 py-3">Rol y estado</th></tr></thead>
          <tbody>
            {(profiles ?? []).map((profile) => <tr key={profile.id} className="border-b border-zinc-50 align-top"><td className="px-4 py-4 font-medium text-zinc-800">{profile.full_name ?? "Sin nombre"}</td><td className="px-4 py-4 font-mono text-[10px] text-zinc-400">{profile.id}</td><td className="px-4 py-4"><UserRoleForm user={{ ...profile, role: profile.role as AppRole }} /></td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}
