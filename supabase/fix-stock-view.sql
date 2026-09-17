-- Evita crear falsos faltantes para combinaciones artículo/ubicación
-- que nunca fueron registradas físicamente.
create or replace view public.v_stock_actual as
select
  i.id as item_id,
  i.name,
  i.sku,
  i.category,
  i.subcategory,
  i.unit,
  i.cost,
  l.id as location_id,
  l.name as location,
  l.type as location_type,
  s.quantity,
  i.stock_min,
  i.stock_max,
  case
    when s.quantity <= 0 then 'stock_critico'
    when s.quantity < i.stock_min then 'stock_bajo'
    else 'ok'
  end as estado
from public.items i
join public.stock s on s.item_id = i.id
join public.locations l on l.id = s.location_id
where i.active and l.active;

grant select on public.v_stock_actual to authenticated;
