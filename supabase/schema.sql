-- GRIND / Rega: схема базы для реального режима (Supabase, бесплатный тариф).
-- Как применить: Supabase → SQL Editor → вставить весь файл → Run. Подробно: supabase/README.md

create extension if not exists btree_gist;

-- ===== Мастера =====
create table if not exists public.staff (
  id text primary key,                       -- 'dima', 'tasha', 'kirill'
  name text not null,
  role text not null default '',
  color text not null default '#ff6a13',
  img text not null default '',
  email text unique,                         -- Google-почта мастера: по ней он «забирает» свой профиль при первом входе
  user_id uuid unique references auth.users(id) on delete set null,
  google_calendar_id text,                   -- id календаря мастера (обычно его gmail-адрес); пусто — синхронизация выключена
  gcal_synced boolean not null default false,
  -- часы работы по дням недели, 0 = воскресенье; null = выходной
  hours jsonb not null default '[["10:00","20:00"],["10:00","20:00"],["10:00","20:00"],["10:00","20:00"],["10:00","20:00"],["09:00","15:00"],null]'::jsonb
);

-- ===== Услуги =====
create table if not exists public.services (
  id text primary key,
  title text not null,
  minutes int not null check (minutes > 0),
  price int not null default 0,
  active boolean not null default true
);

-- ===== Записи =====
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  staff_id text not null references public.staff(id),
  service_id text not null references public.services(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  client_name text not null default '',
  client_phone text not null default '',
  client_user uuid references auth.users(id) on delete set null,
  note text not null default '',
  status text not null default 'booked' check (status in ('booked','cancelled','done')),
  source text not null default 'site',
  gcal_event_id text,
  created_at timestamptz not null default now(),
  check (end_at > start_at),
  -- защита от двойной записи на уровне базы: у одного мастера активные записи не пересекаются
  constraint no_double_booking exclude using gist (staff_id with =, tstzrange(start_at, end_at) with &&) where (status = 'booked')
);
create index if not exists appointments_staff_time on public.appointments (staff_id, start_at);
create index if not exists appointments_client on public.appointments (client_user);

-- ===== Закрытое время =====
create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  staff_id text not null references public.staff(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text not null default '',
  check (end_at > start_at)
);

-- ===== Права доступа (RLS) =====
alter table public.staff enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.blocks enable row level security;

-- мастера и услуги видны всем (нужны для выбора на сайте); email мастеров публично не отдаём через вью ниже
create policy staff_read on public.staff for select using (true);
create policy services_read on public.services for select using (active);

-- мастер редактирует только свой профиль
create policy staff_update_self on public.staff for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- записи: мастер видит и меняет только свои; клиент видит только свои; чужие имена и телефоны никому не видны
create policy appt_staff_all on public.appointments for all
  using (exists (select 1 from public.staff s where s.id = staff_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.staff s where s.id = staff_id and s.user_id = auth.uid()));
create policy appt_client_read on public.appointments for select using (client_user = auth.uid());
create policy appt_client_cancel on public.appointments for update
  using (client_user = auth.uid() and status = 'booked') with check (client_user = auth.uid() and status in ('booked','cancelled'));

create policy blocks_staff_all on public.blocks for all
  using (exists (select 1 from public.staff s where s.id = staff_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.staff s where s.id = staff_id and s.user_id = auth.uid()));

-- ===== Функции для сайта =====

-- Занятое время мастера (без имён и телефонов): по нему сайт считает свободные окна.
create or replace function public.busy(p_staff text, p_from timestamptz, p_to timestamptz)
returns table(start_at timestamptz, end_at timestamptz)
language sql security definer set search_path = public as $$
  select a.start_at, a.end_at from appointments a
   where a.staff_id = p_staff and a.status = 'booked' and a.start_at < p_to and a.end_at > p_from
  union all
  select b.start_at, b.end_at from blocks b
   where b.staff_id = p_staff and b.start_at < p_to and b.end_at > p_from;
$$;
grant execute on function public.busy(text, timestamptz, timestamptz) to anon, authenticated;

-- Запись клиента с сайта. Длительность берётся из услуги, пересечения отсекает ограничение no_double_booking.
create or replace function public.book_appointment(p_staff text, p_service text, p_start timestamptz, p_name text, p_phone text, p_note text default '')
returns public.appointments
language plpgsql security definer set search_path = public as $$
declare v_min int; v_row public.appointments;
begin
  if length(trim(coalesce(p_name,''))) < 2 or length(regexp_replace(coalesce(p_phone,''), '\D', '', 'g')) < 9 then
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
  values (p_staff, p_service, p_start, p_start + make_interval(mins => v_min), trim(p_name), trim(p_phone), auth.uid(), left(coalesce(p_note,''), 300), 'site')
  returning * into v_row;
  return v_row;
end $$;
grant execute on function public.book_appointment(text, text, timestamptz, text, text, text) to anon, authenticated;

-- Первый вход мастера: привязываем его Google-аккаунт к профилю по почте.
create or replace function public.claim_staff()
returns public.staff
language plpgsql security definer set search_path = public as $$
declare v_email text; v_row public.staff;
begin
  select lower(email) into v_email from auth.users where id = auth.uid();
  update staff set user_id = auth.uid() where lower(email) = v_email and user_id is null returning * into v_row;
  if v_row.id is null then select * into v_row from staff where user_id = auth.uid(); end if;
  return v_row;
end $$;
grant execute on function public.claim_staff() to authenticated;

-- ===== Стартовые данные =====
insert into public.services (id, title, minutes, price) values
  ('cut','Стрижка',60,150), ('beard','Борода',30,100), ('combo','Стрижка + борода',90,230), ('long','Удлинённая ножницами',90,180)
on conflict (id) do nothing;

-- Почты мастеров замените на настоящие Google-аккаунты (можно и позже через Table Editor).
insert into public.staff (id, name, role, color, img, email) values
  ('dima','Дима','Основатель · барбер','#ff6a13','assets/img/dima2.jpg', null),
  ('tasha','Таша','Основатель · барбер · дреды','#d7ff1a','assets/img/tasha.jpg', null),
  ('kirill','Кирилл','Барбер','#5aa9ff','assets/img/kirill.jpg', null)
on conflict (id) do nothing;
