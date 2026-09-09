"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/lib/actions/auth";

const initialState: AuthState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-full items-center justify-center bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-2xl font-bold text-white">
            H
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Hotel Inventory</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Control de inventario de insumos hoteleros
          </p>
          <span className="mt-2 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
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
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
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
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-sky-600 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
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