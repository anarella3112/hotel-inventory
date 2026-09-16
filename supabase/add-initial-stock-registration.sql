-- Permite crear el stock inicial al registrar un nuevo artículo.
drop policy if exists "inserta_stock_roles" on public.stock;
create policy "inserta_stock_roles" on public.stock for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);

drop policy if exists "actualiza_items_roles" on public.items;
create policy "actualiza_items_roles" on public.items for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);
