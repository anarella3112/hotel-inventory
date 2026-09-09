-- ============================================================
-- HOTEL-INVENTORY | Seed de datos de demostración
-- Ejecutar en Supabase SQL Editor después de schema.sql
-- ============================================================

-- ---------- UBICACIONES ----------
insert into public.locations (name, type, parent_id) values
  ('Almacén Central', 'almacen', null),
  ('Lavandería / Ropería', 'lavanderia', null),
  ('Piso 1', 'piso', null),
  ('Piso 2', 'piso', null),
  ('Piso 3', 'piso', null);

-- ---------- HABITACIONES ----------
insert into public.rooms (number, room_type, floor, location_id) values
  ('101', 'standard', '1', (select id from public.locations where name = 'Piso 1')),
  ('102', 'standard', '1', (select id from public.locations where name = 'Piso 1')),
  ('201', 'doble', '2', (select id from public.locations where name = 'Piso 2')),
  ('202', 'doble', '2', (select id from public.locations where name = 'Piso 2')),
  ('301', 'suite', '3', (select id from public.locations where name = 'Piso 3'));

-- ---------- INSUMOS ----------
insert into public.items (name, sku, category, unit, cost, provider, stock_min, stock_max) values
  ('Toalla de baño 70x140', 'LEN-TOA-01', 'lenceria', 'unidad', 8.50, 'Textil del Oriente', 40, 180),
  ('Sábana estándar 2 plazas', 'LEN-SAB-01', 'lenceria', 'unidad', 12.00, 'Textil del Oriente', 30, 150),
  ('Funda de almohada', 'LEN-FUN-01', 'lenceria', 'unidad', 3.20, 'Textil del Oriente', 40, 200),
  ('Edredón', 'LEN-EDR-01', 'lenceria', 'unidad', 25.00, 'Textil del Oriente', 10, 60),
  ('Refresco cola 355ml', 'MIN-REF-01', 'minibar', 'unidad', 1.20, 'Distribuidora Norte', 24, 200),
  ('Agua mineral 500ml', 'MIN-AGU-01', 'minibar', 'unidad', 0.80, 'Distribuidora Norte', 36, 240),
  ('Jugo de naranja 330ml', 'MIN-JUG-01', 'minibar', 'unidad', 1.00, 'Distribuidora Norte', 24, 160),
  ('Botana de queso 40g', 'MIN-BOT-01', 'minibar', 'unidad', 1.35, 'Distribuidora Norte', 24, 120),
  ('Jabón de tocador', 'AME-JAB-01', 'amenities', 'unidad', 0.40, 'Suministros Hotel', 60, 400),
  ('Champú 30ml', 'AME-CHA-01', 'amenities', 'unidad', 0.55, 'Suministros Hotel', 60, 400),
  ('Crema dental 30ml', 'AME-CRE-01', 'amenities', 'unidad', 0.50, 'Suministros Hotel', 60, 400),
  ('Limpiador multiusos 1L', 'LIM-MUL-01', 'limpieza', 'litro', 2.10, 'Químicos Caroní', 12, 80),
  ('Detergente en polvo 5kg', 'LIM-DET-01', 'limpieza', 'litro', 6.00, 'Químicos Caroní', 6, 40),
  ('Cloro 1L', 'LIM-CLO-01', 'limpieza', 'litro', 1.50, 'Químicos Caroní', 12, 60),
  ('Papel higiénico x30', 'LIM-PAP-01', 'limpieza', 'pack', 7.50, 'Suministros Hotel', 10, 50),
  ('Desinfectante pisos 3L', 'LIM-DES-01', 'limpieza', 'litro', 4.00, 'Químicos Caroní', 8, 40);

-- ---------- DOTACIÓN ESTÁNDAR POR TIPO DE HABITACIÓN ----------
insert into public.room_dots (room_type, item_id, quantity) values
  ('standard', (select id from public.items where sku = 'LEN-TOA-01'), 2),
  ('standard', (select id from public.items where sku = 'LEN-SAB-01'), 1),
  ('standard', (select id from public.items where sku = 'LEN-FUN-01'), 2),
  ('standard', (select id from public.items where sku = 'AME-JAB-01'), 2),
  ('standard', (select id from public.items where sku = 'AME-CHA-01'), 2),
  ('standard', (select id from public.items where sku = 'AME-CRE-01'), 2),
  ('doble', (select id from public.items where sku = 'LEN-TOA-01'), 4),
  ('doble', (select id from public.items where sku = 'LEN-SAB-01'), 2),
  ('doble', (select id from public.items where sku = 'LEN-FUN-01'), 4),
  ('doble', (select id from public.items where sku = 'MIN-REF-01'), 4),
  ('doble', (select id from public.items where sku = 'MIN-AGU-01'), 4),
  ('doble', (select id from public.items where sku = 'AME-JAB-01'), 4),
  ('suite', (select id from public.items where sku = 'LEN-TOA-01'), 4),
  ('suite', (select id from public.items where sku = 'LEN-SAB-01'), 2),
  ('suite', (select id from public.items where sku = 'LEN-FUN-01'), 4),
  ('suite', (select id from public.items where sku = 'LEN-EDR-01'), 1),
  ('suite', (select id from public.items where sku = 'MIN-REF-01'), 6),
  ('suite', (select id from public.items where sku = 'MIN-AGU-01'), 6),
  ('suite', (select id from public.items where sku = 'MIN-JUG-01'), 4),
  ('suite', (select id from public.items where sku = 'MIN-BOT-01'), 4);

-- ---------- STOCK INICIAL ----------
insert into public.stock (item_id, location_id, quantity)
select i.id, l.id,
  case i.category
    when 'lenceria' then 90
    when 'minibar'  then 110
    when 'amenities' then 250
    when 'limpieza'  then 40
    else 40
  end
from public.items i, public.locations l
where l.name = 'Almacén Central';

-- Stock en lavandería (ciclo de lencería)
insert into public.stock (item_id, location_id, quantity)
select i.id, l.id, 25
from public.items i, public.locations l
where l.name = 'Lavandería / Ropería'
  and i.category = 'lenceria';

-- Stock por piso
insert into public.stock (item_id, location_id, quantity)
select i.id, l.id, 30
from public.items i, public.locations l
where l.name in ('Piso 1', 'Piso 2', 'Piso 3')
  and i.category in ('lenceria', 'limpieza');

-- ---------- MOVIMIENTOS DE DEMOSTRACIÓN ----------
insert into public.movements (item_id, location_id, type, quantity, motivo, reference) values
  ((select id from public.items where sku = 'LIM-MUL-01'),
   (select id from public.locations where name = 'Almacén Central'),
   'entrada', 60, 'Compra a proveedor', 'FAC-2026-001'),
  ((select id from public.items where sku = 'MIN-AGU-01'),
   (select id from public.locations where name = 'Almacén Central'),
   'entrada', 240, 'Compra a proveedor', 'FAC-2026-002'),
  ((select id from public.items where sku = 'LIM-CLO-01'),
   (select id from public.locations where name = 'Almacén Central'),
   'salida', 18, 'Dotación pisos', 'ORD-1001'),
  ((select id from public.items where sku = 'MIN-REF-01'),
   (select id from public.locations where name = 'Almacén Central'),
   'salida', 22, 'Reposición minibares', 'ORD-1002'),
  -- Mermas de ejemplo
  ((select id from public.items where sku = 'LEN-TOA-01'),
   (select id from public.locations where name = 'Lavandería / Ropería'),
   'merma', 3, 'Pérdida reportada por gobernanta', 'MM-0001'),
  ((select id from public.items where sku = 'LEN-SAB-01'),
   (select id from public.locations where name = 'Lavandería / Ropería'),
   'merma', 2, 'Daño en lavado industrial', 'MM-0002');

-- ---------- CONSUMO DE MINIBAR DE EJEMPLO ----------
insert into public.minibar_consumos (room_id, item_id, quantity, price, facturado) values
  ((select id from public.rooms where number = '201'),
   (select id from public.items where sku = 'MIN-REF-01'), 2, 3.00, true),
  ((select id from public.rooms where number = '202'),
   (select id from public.items where sku = 'MIN-AGU-01'), 3, 2.50, true);

-- ---------- ALERTAS DE EJEMPLO ----------
insert into public.alerts (type, item_id, location_id, nivel, message, status) values
  ('stock_bajo',
   (select id from public.items where sku = 'LIM-CLO-01'),
   (select id from public.locations where name = 'Almacén Central'),
   'baja', 'Stock de Cloro por debajo del mínimo', 'activa');