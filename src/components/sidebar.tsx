"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import type { AppRole } from "@/lib/types";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/types";
import { BrandLogo } from "@/components/brand-logo";

const NAV = [
  { href: "/dashboard", label: "Panel", icon: "▦" },
  { href: "/items", label: "Insumos", icon: "◫" },
  { href: "/inventory", label: "Inventario", icon: "≡" },
  { href: "/minibar", label: "Minibar", icon: "◍" },
  { href: "/linen", label: "Lencería", icon: "▤" },
  { href: "/alerts", label: "Alertas", icon: "!" },
  { href: "/ia", label: "IA y Reportes", icon: "✦" },
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

  return (
    <aside className="flex w-64 flex-col border-r border-[#e5e7eb] bg-white">
      <div className="border-b border-[#e5e7eb] px-5 py-5">
        <BrandLogo compact />
        <p className="mt-2 pl-1 text-[10px] font-medium tracking-[0.12em] text-[#0B2D5B]/55">MÁS CONTROL · MENOS FUGAS</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                   ? "bg-[#eaf2ff] text-[#0B2D5B] shadow-sm"
                   : "text-zinc-600 hover:bg-[#f5f8fc] hover:text-[#0B2D5B]"
              }`}
            >
              <span className="w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#e5e7eb] p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 text-sm font-semibold text-zinc-600">
            {(fullName ?? userEmail ?? "U").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-zinc-800">
              {fullName ?? userEmail}
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
            className="w-full rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
