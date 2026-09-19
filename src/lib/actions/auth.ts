"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "@/lib/types";

export interface AuthState {
  error?: string;
  success?: string;
}

export async function updateUserProfile(
  prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "") as AppRole;
  const active = formData.get("active") === "on";
  const roles: AppRole[] = ["admin", "gerencia", "gobernanta", "piso", "almacen", "frontdesk"];

  if (!id || !roles.includes(role)) return { error: "Perfil o rol inválido." };

  const { error } = await supabase.from("profiles").update({ role, active }).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/users");
  return { success: "Perfil actualizado." };
}

export async function login(
  prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase login failed", {
      email,
      message: error.message,
      code: error.code,
      status: error.status,
    });
    return { error: "Credenciales inválidas. Verifica e intenta de nuevo." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
