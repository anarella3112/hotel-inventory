import { createClient } from "@/lib/supabase/server";
import { NewItemForm } from "@/components/forms/new-item-form";
import { ItemsCatalog } from "@/components/items-catalog";
import { ItemStockLookup } from "@/components/item-stock-lookup";

export default async function ItemsPage() {
  const supabase = await createClient();

  const [{ data: items }, { data: locations }, { data: stock }] = await Promise.all([
    supabase.from("items").select("*").order("name"),
    supabase.from("locations").select("id, name").eq("active", true).order("name"),
    supabase.from("v_stock_actual").select("item_id, location_id, quantity, stock_min, stock_max"),
  ]);
  const providers = Array.from(
    new Set((items ?? []).map((item) => item.provider).filter(Boolean)),
  ).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Catálogo de insumos</h1>
      </div>

      <ItemStockLookup items={items ?? []} locations={locations ?? []} stock={stock ?? []} />

      <section>
        <h2 className="mb-2 text-sm font-semibold text-zinc-500">
          Registrar nuevo insumo
        </h2>
        <NewItemForm providers={providers as string[]} />
      </section>

      <ItemsCatalog items={items ?? []} />
    </div>
  );
}
