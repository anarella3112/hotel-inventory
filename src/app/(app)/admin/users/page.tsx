import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type AppRole } from "@/lib/types";

const ROLE_ACCESS: Record<AppRole, string> = {
  admin: "Todos los módulos y configuración",
  gerencia: "Dashboard, insumos, inventario, minibar, lencería, alertas e IA",
  gobernanta: "Dashboard, inventario, lencería, alertas e IA",
  piso: "Dashboard, inventario, minibar y lencería",
  almacen: "Dashboard, insumos, inventario, alertas e IA",
  frontdesk: "Dashboard y minibar",
};

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, active")
    .order("full_name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Administración de usuarios</h1>
        <p className="mt-1 text-sm text-zinc-500">Consulta de usuarios, roles, estados y accesos. Las cuentas se crean desde Supabase Authentication.</p>
      </div>
      <section className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead><tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500"><th className="px-4 py-3">Usuario</th><th className="px-4 py-3">Correo</th><th className="px-4 py-3">Rol</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Accesos</th></tr></thead>
          <tbody>
            {(profiles ?? []).map((profile) => <tr key={profile.id} className="border-b border-zinc-50 align-top"><td className="px-4 py-4 font-medium text-zinc-800">{profile.full_name ?? "Sin nombre"}</td><td className="px-4 py-4 text-zinc-600">{profile.email ?? "Sin correo registrado"}</td><td className="px-4 py-4"><span className="rounded-md bg-[#eaf2ff] px-2 py-1 text-xs font-semibold text-[#0B2D5B]">{ROLE_LABELS[profile.role as AppRole]}</span></td><td className="px-4 py-4"><span className={`rounded-md px-2 py-1 text-xs font-semibold ${profile.active ? "bg-emerald-100 text-emerald-800" : "bg-zinc-100 text-zinc-600"}`}>{profile.active ? "Activo" : "Inactivo"}</span></td><td className="max-w-xs px-4 py-4 text-xs leading-5 text-zinc-500">{ROLE_ACCESS[profile.role as AppRole]}</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}
