-- Agrega trazabilidad de cobros de minibar.
alter table public.minibar_consumos add column if not exists paid_at timestamptz;
alter table public.minibar_consumos add column if not exists payment_method text;

update public.minibar_consumos
set paid_at = coalesce(paid_at, created_at),
    payment_method = coalesce(payment_method, 'No registrado')
where facturado = true;

drop policy if exists "actualiza_cobros_minibar" on public.minibar_consumos;
create policy "actualiza_cobros_minibar" on public.minibar_consumos for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','frontdesk'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','frontdesk'))
);
