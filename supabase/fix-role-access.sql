-- Gobernanta no registra ni cobra consumos de minibar.
drop policy if exists "escritura_consumos" on public.minibar_consumos;
create policy "escritura_consumos" on public.minibar_consumos for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','piso','frontdesk'))
);
