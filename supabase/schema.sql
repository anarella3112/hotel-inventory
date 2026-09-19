-- ============================================================
-- HOTEL-INVENTORY | Schema PostgreSQL (Supabase)
-- Proyecto #14: Control de inventario de insumos hoteleros
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- CATEGORÍAS DE INSUMOS ----------
create type public.insumo_categoria as enum (
  'minibar', 'lenceria', 'limpieza', 'amenities', 'alimentos_bebidas'
);

-- ---------- TIPOS DE UBICACIÓN ----------
create type public.ubicacion_tipo as enum (
  'almacen', 'lavanderia', 'piso', 'habitacion'
);

-- ---------- TIPOS DE MOVIMIENTO ----------
create type public.movimiento_tipo as enum (
  'entrada', 'salida', 'transferencia_entrada', 'transferencia_salida',
  'ajuste', 'merma', 'consumo_minibar', 'dotacion'
);

-- ---------- ESTADOS DE LENCERÍA ----------
create type public.lenceria_estado as enum (
  'limpia', 'sucia', 'lavanderia', 'baja'
);

-- ---------- NIVELES DE ALERTA ----------
create type public.alerta_nivel as enum ('info', 'baja', 'media', 'critica');

-- ---------- ROLES DE USUARIO ----------
create type public.app_role as enum (
  'admin', 'gerencia', 'gobernanta', 'piso', 'almacen', 'frontdesk'
);

-- ---------- UBICACIONES ----------
create table public.locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type ubicacion_tipo not null,
  parent_id uuid references public.locations(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- HABITACIONES ----------
create table public.rooms (
  id uuid primary key default uuid_generate_v4(),
  number text not null unique,
  room_type text not null,               -- ej. 'standard', 'doble', 'suite'
  floor text not null,
  location_id uuid references public.locations(id),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- INSUMOS / PRODUCTOS ----------
create table public.items (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  sku text not null unique,
  category insumo_categoria not null,
  subcategory text,
  unit text not null,                    -- ej. unidad, mt2, litro, pack
  cost numeric(12,2) not null default 0, -- costo unitario referencial
  sale_price numeric(12,2) not null default 0, -- precio de venta para minibar
  provider text,
  stock_min int not null default 0,
  stock_max int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- STOCK POR UBICACIÓN ----------
create table public.stock (
  item_id uuid references public.items(id) on delete cascade,
  location_id uuid references public.locations(id) on delete cascade,
  quantity int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (item_id, location_id)
);

-- ---------- MOVIMIENTOS DE INVENTARIO ----------
create table public.movements (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid references public.items(id),
  location_id uuid references public.locations(id),
  type movimiento_tipo not null,
  quantity int not null,
  motivo text,
  reference text,                        -- factura, nota, orden, etc.
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists idx_movements_item on public.movements(item_id);
create index if not exists idx_movements_location on public.movements(location_id);
create index if not exists idx_movements_created on public.movements(created_at desc);

-- ---------- CICLO DE LENCERÍA ----------
create table public.linen_cycle (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid references public.items(id),
  room_id uuid references public.rooms(id),
  quantity int not null,
  estado lenceria_estado not null default 'limpia',
  baja_motivo text,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ---------- CONSUMOS DE MINIBAR ----------
create table public.minibar_consumos (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid references public.rooms(id),
  item_id uuid references public.items(id),
  quantity int not null,
  price numeric(12,2) not null,          -- precio de venta
  facturado boolean not null default false,
  paid_at timestamptz,
  payment_method text,
  checkout_at timestamptz,
  user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

-- ---------- DOTACIÓN ESTÁNDAR POR TIPO DE HABITACIÓN ----------
create table public.room_dots (
  room_type text not null,
  item_id uuid references public.items(id) on delete cascade,
  quantity int not null default 0,
  primary key (room_type, item_id)
);

-- ---------- ALERTAS ----------
create table public.alerts (
  id uuid primary key default uuid_generate_v4(),
  type text not null,                    -- stock_bajo, stock_critico, consumo_anomalo, merma
  item_id uuid references public.items(id),
  location_id uuid references public.locations(id),
  nivel alerta_nivel not null default 'media',
  message text not null,
  status text not null default 'activa', -- activa | resuelta
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- PREDICCIONES DE IA ----------
create table public.ai_predictions (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid references public.items(id),
  location_id uuid references public.locations(id),
  predicted_date date not null,
  quantity_pred numeric(10,2) not null,
  model text,
  created_at timestamptz not null default now()
);

-- ---------- REGISTRO DE CONSUMO DE TOKENS DE IA (Baremo punto 10) ----------
create table public.ai_usage_log (
  id uuid primary key default uuid_generate_v4(),
  feature text not null,                 -- reposicion_sugerida | deteccion_fugas | resumen
  model text not null,
  prompt_tokens int not null default 0,
  completion_tokens int not null default 0,
  total_tokens int not null default 0,
  cost_estimate numeric(12,6),
  created_at timestamptz not null default now()
);

-- ---------- PERFILES DE USUARIO ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role app_role not null default 'piso',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ============================================================
-- AUTOMATIZACIÓN DE STOCK: función que aplica un movimiento
-- ============================================================
create or replace function public.apply_movement(
  p_item_id uuid,
  p_location_id uuid,
  p_type movimiento_tipo,
  p_quantity int,
  p_motivo text default null,
  p_reference text default null,
  p_user_id uuid default auth.uid()
) returns public.movements
language plpgsql
security definer
as $$
declare
  v_mov public.movements;
  v_sign int;
begin
  if p_quantity <= 0 then
    raise exception 'La cantidad debe ser mayor a cero';
  end if;

  case p_type
    when 'entrada' then v_sign := 1;
    when 'transferencia_entrada' then v_sign := 1;
    when 'ajuste' then v_sign := 1;
    when 'salida' then v_sign := -1;
    when 'transferencia_salida' then v_sign := -1;
    when 'merma' then v_sign := -1;
    when 'consumo_minibar' then v_sign := -1;
    when 'dotacion' then v_sign := -1;
  end case;

  if v_sign < 0 and
     (select coalesce(quantity, 0) from public.stock
      where item_id = p_item_id and location_id = p_location_id) < p_quantity then
    raise exception 'Stock insuficiente en la ubicación seleccionada';
  end if;

  insert into public.stock (item_id, location_id, quantity, updated_at)
  values (p_item_id, p_location_id, p_quantity, now())
  on conflict (item_id, location_id)
  do update set quantity = public.stock.quantity + v_sign * p_quantity,
                updated_at = now();

  insert into public.movements (item_id, location_id, type, quantity, motivo, reference, user_id)
  values (p_item_id, p_location_id, p_type, p_quantity, p_motivo, p_reference, p_user_id)
  returning * into v_mov;

  -- Genera alerta automática si el stock quedó bajo el mínimo
  insert into public.alerts (type, item_id, location_id, nivel, message)
  select
    case when s.quantity = 0 then 'stock_critico' else 'stock_bajo' end,
    p_item_id, p_location_id,
     (case when s.quantity = 0 then 'critica' else 'baja' end)::public.alerta_nivel,
    'Stock de "' || i.name || '" en ' || l.name || ': ' || s.quantity ||
    ' (mínimo: ' || i.stock_min || ')'
  from public.stock s
  join public.items i on i.id = s.item_id
  join public.locations l on l.id = s.location_id
  where s.item_id = p_item_id and s.location_id = p_location_id
    and s.quantity < i.stock_min;

  return v_mov;
end;
$$;

-- ============================================================
-- SEGURIDAD A NIVEL DE FILA (RLS)
-- ============================================================
alter table public.locations enable row level security;
alter table public.rooms enable row level security;
alter table public.items enable row level security;
alter table public.stock enable row level security;
alter table public.movements enable row level security;
alter table public.linen_cycle enable row level security;
alter table public.minibar_consumos enable row level security;
alter table public.room_dots enable row level security;
alter table public.alerts enable row level security;
alter table public.ai_predictions enable row level security;
alter table public.ai_usage_log enable row level security;
alter table public.profiles enable row level security;

-- Usuarios autenticados pueden leer datos maestros y stock
create policy "lectura_autenticados" on public.locations for select to authenticated using (true);
create policy "lectura_autenticados" on public.rooms for select to authenticated using (true);
create policy "lectura_autenticados" on public.items for select to authenticated using (true);
create policy "lectura_autenticados" on public.stock for select to authenticated using (true);
create policy "lectura_autenticados" on public.movements for select to authenticated using (true);
create policy "lectura_autenticados" on public.linen_cycle for select to authenticated using (true);
create policy "lectura_autenticados" on public.minibar_consumos for select to authenticated using (true);
create policy "lectura_autenticados" on public.room_dots for select to authenticated using (true);
create policy "lectura_autenticados" on public.alerts for select to authenticated using (true);
create policy "lectura_autenticados" on public.ai_predictions for select to authenticated using (true);
create policy "lectura_propio" on public.ai_usage_log for select to authenticated using (true);

-- Solo personal con permiso (rol) puede escribir. Acciones administrativas (ajustes) por rol.
create policy "escritura_roles" on public.locations for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);
create policy "escritura_roles" on public.rooms for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);
create policy "escritura_roles" on public.items for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);
create policy "actualiza_stock_roles" on public.stock for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);
create policy "actualiza_items_roles" on public.items for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);
create policy "inserta_stock_roles" on public.stock for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);
create policy "escritura_roles" on public.room_dots for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);
create policy "escritura_movimientos" on public.movements for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen','gobernanta','piso'))
);
create policy "escritura_consumos" on public.minibar_consumos for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','gobernanta','piso','frontdesk'))
);
create policy "actualiza_cobros_minibar" on public.minibar_consumos for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','frontdesk'))
) with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','frontdesk'))
);
create policy "escritura_lenceria" on public.linen_cycle for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','gobernanta','piso'))
);
create policy "escritura_roles" on public.alerts for insert to authenticated with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia'))
);
create policy "resolver_alertas_roles" on public.alerts for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','gerencia','almacen'))
);
create policy "lectura_roles_propio" on public.profiles for select to authenticated using (id = auth.uid());
create policy "lectura_perfiles_admin" on public.profiles for select to authenticated using (public.is_admin());
create policy "actualiza_perfiles_admin" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- VISTAS ÚTILES
-- ============================================================
create or replace view public.v_stock_actual as
select
  i.id as item_id, i.name, i.sku, i.category, i.unit, i.cost,
  l.id as location_id, l.name as location, l.type as location_type,
  coalesce(s.quantity, 0) as quantity,
  i.stock_min, i.stock_max,
  case
    when coalesce(s.quantity, 0) <= 0 then 'stock_critico'
    when coalesce(s.quantity, 0) < i.stock_min then 'stock_bajo'
    else 'ok'
  end as estado
from public.items i
join public.stock s on s.item_id = i.id
join public.locations l on l.id = s.location_id
where i.active and l.active;

create or replace view public.v_mermas as
select
  m.id, m.item_id, i.name as item, m.quantity, m.motivo,
  m.reference, m.user_id, m.created_at
from public.movements m
join public.items i on i.id = m.item_id
where m.type = 'merma';

-- Permisos de ejecución para funciones y vistas
grant execute on function public.apply_movement to authenticated;
grant select on public.v_stock_actual to authenticated;
grant select on public.v_mermas to authenticated;
