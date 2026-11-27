-- Патч: правила доступа через функцию is_my_staff (чтобы вошедшие пользователи не упирались в закрытые колонки staff)
create or replace function public.is_my_staff(p_staff text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff s where s.id = p_staff and s.user_id = auth.uid());
$$;
grant execute on function public.is_my_staff(text) to anon, authenticated;
drop policy if exists staff_update_self on public.staff;
create policy staff_update_self on public.staff for update using (public.is_my_staff(id)) with check (public.is_my_staff(id));
drop policy if exists appt_staff_all on public.appointments;
create policy appt_staff_all on public.appointments for all using (public.is_my_staff(staff_id)) with check (public.is_my_staff(staff_id));
drop policy if exists blocks_staff_all on public.blocks;
create policy blocks_staff_all on public.blocks for all using (public.is_my_staff(staff_id)) with check (public.is_my_staff(staff_id));
