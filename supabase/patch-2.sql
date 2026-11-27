-- Патч 2: контакт клиента — телефон ИЛИ почта ИЛИ ник в Telegram (достаточно одного).
create or replace function public.book_appointment(p_staff text, p_service text, p_start timestamptz, p_name text, p_phone text, p_note text default '')
returns public.appointments
language plpgsql security definer set search_path = public as $$
declare v_min int; v_row public.appointments; v_c text := trim(coalesce(p_phone,''));
begin
  if length(trim(coalesce(p_name,''))) < 2 or not (
       regexp_replace(v_c, '\D', '', 'g') ~ '^\d{9,15}$'
    or v_c ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    or (v_c ~ '^@?[A-Za-z0-9_]{5,32}$' and v_c ~ '[A-Za-z]')
  ) then
    raise exception 'invalid contact';
  end if;
  if p_start < now() then raise exception 'in the past'; end if;
  if p_start > now() + interval '90 days' then raise exception 'too far'; end if;
  select minutes into v_min from services where id = p_service and active;
  if v_min is null then raise exception 'unknown service'; end if;
  if exists (select 1 from blocks b where b.staff_id = p_staff and b.start_at < p_start + make_interval(mins => v_min) and b.end_at > p_start) then
    raise exception 'time blocked';
  end if;
  insert into appointments(staff_id, service_id, start_at, end_at, client_name, client_phone, client_user, note, source)
  values (p_staff, p_service, p_start, p_start + make_interval(mins => v_min), trim(p_name), v_c, auth.uid(), left(coalesce(p_note,''), 300), 'site')
  returning * into v_row;
  return v_row;
end $$;
