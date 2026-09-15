-- Fase 1: datos hoteleros realistas para una instalación ya existente.
-- Ejecutar una sola vez en Supabase SQL Editor.

insert into public.locations (name, type, parent_id) values
  ('Recepción', 'habitacion', null),
  ('Área de Limpieza', 'almacen', null)
on conflict do nothing;

insert into public.items (name, sku, category, unit, cost, provider, stock_min, stock_max) values
  ('Toalla de manos', 'LEN-MAN-01', 'lenceria', 'unidad', 4.50, 'Textil del Oriente', 30, 120),
  ('Protector de colchón', 'LEN-PRO-01', 'lenceria', 'unidad', 18.00, 'Textil del Oriente', 10, 50),
  ('Almohada estándar', 'LEN-ALM-01', 'lenceria', 'unidad', 10.00, 'Textil del Oriente', 10, 50),
  ('Galletas individuales', 'MIN-GAL-01', 'minibar', 'unidad', 1.10, 'Distribuidora Norte', 24, 120),
  ('Chocolate individual', 'MIN-CHO-01', 'minibar', 'unidad', 1.50, 'Distribuidora Norte', 24, 120),
  ('Acondicionador 30ml', 'AME-ACO-01', 'amenities', 'unidad', 0.60, 'Suministros Hotel', 60, 400),
  ('Gorro de baño', 'AME-GOR-01', 'amenities', 'unidad', 0.35, 'Suministros Hotel', 60, 300),
  ('Kit dental', 'AME-KIT-01', 'amenities', 'unidad', 0.75, 'Suministros Hotel', 60, 300),
  ('Desengrasante 1L', 'LIM-DESG-01', 'limpieza', 'litro', 2.80, 'Químicos Caroní', 8, 40),
  ('Limpiavidrios 1L', 'LIM-VID-01', 'limpieza', 'litro', 2.20, 'Químicos Caroní', 8, 40),
  ('Bolsas para basura x20', 'LIM-BOL-01', 'limpieza', 'pack', 3.50, 'Suministros Hotel', 10, 60)
on conflict (sku) do nothing;

update public.items set category = 'amenities' where sku = 'LIM-PAP-01';

-- Stock inicial de los artículos nuevos en el almacén central.
insert into public.stock (item_id, location_id, quantity)
select i.id, l.id,
  case i.category
    when 'lenceria' then 40
    when 'minibar' then 60
    when 'amenities' then 100
    when 'limpieza' then 20
  end
from public.items i
cross join public.locations l
where l.name = 'Almacén Central'
  and i.sku in (
    'LEN-MAN-01', 'LEN-PRO-01', 'LEN-ALM-01', 'MIN-GAL-01', 'MIN-CHO-01',
    'AME-ACO-01', 'AME-GOR-01', 'AME-KIT-01', 'LIM-DESG-01', 'LIM-VID-01', 'LIM-BOL-01'
  )
on conflict (item_id, location_id) do nothing;

-- Puntos operativos con stock específico por ubicación.
insert into public.stock (item_id, location_id, quantity)
select i.id, l.id, 12
from public.items i
cross join public.locations l
where l.name = 'Recepción'
  and i.sku in ('MIN-GAL-01', 'MIN-CHO-01', 'MIN-REF-01', 'MIN-AGU-01')
on conflict (item_id, location_id) do nothing;

insert into public.stock (item_id, location_id, quantity)
select i.id, l.id, 8
from public.items i
cross join public.locations l
where l.name = 'Área de Limpieza'
  and i.sku in ('LIM-DESG-01', 'LIM-VID-01', 'LIM-BOL-01', 'LIM-CLO-01')
on conflict (item_id, location_id) do nothing;
