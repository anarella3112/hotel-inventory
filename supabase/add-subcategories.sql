-- Agrega subcategorías al catálogo existente.
alter table public.items add column if not exists subcategory text;

update public.items set subcategory = case
  when sku in ('LEN-TOA-01', 'LEN-MAN-01') then 'Toallas'
  when sku in ('LEN-SAB-01', 'LEN-EDR-01') then 'Sábanas'
  when sku = 'LEN-FUN-01' then 'Fundas y almohadas'
  when sku in ('LEN-PRO-01', 'LEN-ALM-01') then 'Protectores'
  when sku in ('MIN-REF-01', 'MIN-AGU-01', 'MIN-JUG-01') then 'Bebidas'
  when sku in ('MIN-BOT-01', 'MIN-GAL-01', 'MIN-CHO-01') then 'Snacks'
  when sku in ('AME-JAB-01', 'AME-CHA-01', 'AME-CRE-01', 'AME-ACO-01', 'AME-GOR-01', 'AME-KIT-01') then 'Higiene personal'
  when sku = 'LIM-PAP-01' then 'Artículos de habitación'
  when sku in ('LIM-MUL-01', 'LIM-DET-01', 'LIM-CLO-01', 'LIM-DES-01', 'LIM-DESG-01', 'LIM-VID-01') then 'Químicos'
  when sku = 'LIM-BOL-01' then 'Consumibles'
  else 'General'
end
where subcategory is null;
