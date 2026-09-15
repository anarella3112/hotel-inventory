-- Define precios de venta centralizados para los productos de minibar.
alter table public.items add column if not exists sale_price numeric(12,2) not null default 0;

update public.items set sale_price = case sku
  when 'MIN-REF-01' then 3.00
  when 'MIN-AGU-01' then 2.50
  when 'MIN-JUG-01' then 3.50
  when 'MIN-BOT-01' then 4.00
  when 'MIN-GAL-01' then 3.00
  when 'MIN-CHO-01' then 4.50
  else sale_price
end
where category = 'minibar';
