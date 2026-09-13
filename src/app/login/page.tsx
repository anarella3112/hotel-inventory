"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/lib/actions/auth";
import { BrandLogo } from "@/components/brand-logo";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

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
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 pr-10 text-sm outline-none focus:border-[#1E6BD6] focus:ring-2 focus:ring-[#cfe0fb]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 transition hover:text-[#0B2D5B]"
              >
                {showPassword ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.5 4.2 9.5 7a15 15 0 0 1-3 4.4M6.2 6.2C3.9 7.7 2.6 10 2.5 12c1 2.8 4.5 7 9.5 7 1.2 0 2.4-.2 3.4-.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </svg>
                )}
              </button>
            </div>
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
