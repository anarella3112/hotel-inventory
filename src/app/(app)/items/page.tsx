import { createClient } from "@/lib/supabase/server";
import { NewItemForm } from "@/components/forms/new-item-form";
import { ItemsCatalog } from "@/components/items-catalog";

export default async function ItemsPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: locations }] = await Promise.all([
    supabase.from("items").select("*").order("name"),
    supabase.from("locations").select("id, name").eq("active", true).order("name"),
  ]);
  const providers = Array.from(
    new Set((items ?? []).map((item) => item.provider).filter(Boolean)),
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Catálogo de insumos</h1>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-zinc-500">
          Registrar nuevo insumo
        </h2>
        <NewItemForm providers={providers as string[]} locations={locations ?? []} />
      </section>

      <ItemsCatalog items={items ?? []} />
    </div>
  );
}
