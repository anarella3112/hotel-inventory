-- Corrige el tipo del nivel de alerta generado por apply_movement.
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

  insert into public.alerts (type, item_id, location_id, nivel, message)
  select
    case when s.quantity = 0 then 'stock_critico' else 'stock_bajo' end,
    p_item_id,
    p_location_id,
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
