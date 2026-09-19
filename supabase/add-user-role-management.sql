-- Permite al administrador consultar y actualizar perfiles desde la aplicación.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "lectura_perfiles_admin" on public.profiles;
create policy "lectura_perfiles_admin" on public.profiles for select to authenticated using (public.is_admin());

drop policy if exists "actualiza_perfiles_admin" on public.profiles;
create policy "actualiza_perfiles_admin" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
