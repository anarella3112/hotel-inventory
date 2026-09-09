import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import type { AppRole } from "@/lib/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const role = (profile?.role as AppRole) ?? "piso";

  return (
    <div className="flex h-full overflow-hidden bg-zinc-50">
      <Sidebar
        userEmail={user.email}
        fullName={profile?.full_name}
        role={role}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar title="Hotel Inventory" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}