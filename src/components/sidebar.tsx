"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/actions/auth";
import type { AppRole } from "@/lib/types";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/types";
import { BrandLogo } from "@/components/brand-logo";

const NAV: { href: string; label: string; icon: string; roles: AppRole[] }[] = [
  { href: "/dashboard", label: "Panel", icon: "▦", roles: ["admin", "gerencia", "gobernanta", "piso", "almacen", "frontdesk"] },
  { href: "/items", label: "Insumos", icon: "◫", roles: ["admin", "gerencia", "almacen"] },
  { href: "/inventory", label: "Inventario", icon: "≡", roles: ["admin", "gerencia", "gobernanta", "piso", "almacen"] },
  { href: "/minibar", label: "Minibar", icon: "◍", roles: ["admin", "gerencia", "piso", "frontdesk"] },
  { href: "/linen", label: "Lencería", icon: "▤", roles: ["admin", "gerencia", "gobernanta", "piso"] },
  { href: "/alerts", label: "Alertas", icon: "!", roles: ["admin", "gerencia", "gobernanta", "almacen"] },
  { href: "/ia", label: "IA y Reportes", icon: "✦", roles: ["admin", "gerencia", "gobernanta", "almacen"] },
  { href: "/admin/users", label: "Usuarios", icon: "♙", roles: ["admin"] },
];

export function Sidebar({
  userEmail,
  fullName,
  role,
}: {
  userEmail?: string;
  fullName?: string | null;
  role?: AppRole;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleNav = NAV.filter((item) => role && item.roles.includes(role));

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[#e5e7eb] bg-white sm:flex">
      <div className="border-b border-[#e5e7eb] px-2 py-4 sm:px-5 sm:py-5">
        <BrandLogo compact />
        <p className="mt-2 hidden pl-1 text-[10px] font-medium tracking-[0.12em] text-[#0B2D5B]/55 sm:block">MÁS CONTROL · MENOS FUGAS</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {visibleNav.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center justify-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition sm:justify-start sm:px-3 ${
                active
                   ? "bg-[#eaf2ff] text-[#0B2D5B] shadow-sm"
                   : "text-zinc-600 hover:bg-[#f5f8fc] hover:text-[#0B2D5B]"
              }`}
            >
              <span className="w-4 text-center">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#e5e7eb] p-2 sm:p-4">
        <div className="mb-3 flex items-center justify-center gap-3 sm:justify-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-600">
            {(fullName ?? userEmail ?? "U").charAt(0).toUpperCase()}
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-medium text-zinc-800">
              {role ? ROLE_LABELS[role] : fullName ?? userEmail}
            </p>
            {role && (
              <span
                className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${ROLE_COLORS[role]}`}
              >
                {ROLE_LABELS[role]}
              </span>
            )}
          </div>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:px-3 sm:text-sm"
          >
            <span className="hidden sm:inline">Cerrar sesión</span>
            <span className="sm:hidden" aria-hidden="true">↪</span>
          </button>
        </form>
      </div>
      </aside>
      <button type="button" onClick={() => setMobileOpen(true)} aria-label="Abrir menú" className="fixed left-3 top-3 z-40 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-xl text-[#0B2D5B] shadow sm:hidden">☰</button>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B2D5B]/30 sm:hidden" onClick={() => setMobileOpen(false)}>
          <nav className="h-full w-72 bg-white p-4 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <BrandLogo compact />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú" className="text-2xl text-zinc-500">×</button>
            </div>
            <div className="space-y-1">
              {visibleNav.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${pathname.startsWith(item.href) ? "bg-[#eaf2ff] text-[#0B2D5B]" : "text-zinc-600"}`}><span className="w-5 text-center">{item.icon}</span>{item.label}</Link>)}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
