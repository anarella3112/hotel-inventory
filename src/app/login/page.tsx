"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/lib/actions/auth";
import { BrandLogo } from "@/components/brand-logo";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-full items-center justify-center bg-[radial-gradient(circle_at_top,#1e6bd6_0%,#0b2d5b_52%,#071d3b_100%)] p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center"><BrandLogo /></div>
          <p className="mt-1 text-sm text-zinc-500">
            Más control · Menos fugas · Mayor eficiencia
          </p>
          <span className="mt-3 inline-block rounded-full bg-[#eaf2ff] px-3 py-1 text-xs font-medium text-[#0B2D5B]">
            Proyecto #14 · UNEG · Ingeniería de Software I
          </span>
        </div>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="usuario@hotel.com"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[#1E6BD6] focus:ring-2 focus:ring-[#cfe0fb]"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[#1E6BD6] focus:ring-2 focus:ring-[#cfe0fb]"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[#0B2D5B] py-2 text-sm font-semibold text-white transition hover:bg-[#1E6BD6] disabled:opacity-50"
          >
            {pending ? "Ingresando…" : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Proyecto académico · Powered by{" "}
          <Link href="https://nextjs.org" className="underline">
            Next.js
          </Link>{" "}
          ·{" "}
          <Link href="https://supabase.com" className="underline">
            Supabase
          </Link>{" "}
          · Gemini
        </p>
      </div>
    </div>
  );
}
