-- Патч 4: приглашения мастеров по ссылке. Мастер открывает ссылку, вводит почту и придумывает пароль,
-- и аккаунт автоматически привязывается к его профилю (телефон и токен наружу не отдаются, колонки закрыты).
alter table public.staff add column if not exists phone text;
alter table public.staff add column if not exists invite_token text;
alter table public.staff add column if not exists invite_expires timestamptz;
create unique index if not exists staff_invite_token_key on public.staff (invite_token) where invite_token is not null;

create or replace function public.staff_invite_info(p_token text)
returns table(name text, role text)
language sql security definer set search_path = public as $$
  select s.name, s.role from staff s
   where s.invite_token = p_token and s.user_id is null and (s.invite_expires is null or s.invite_expires > now());
$$;
grant execute on function public.staff_invite_info(text) to anon, authenticated;

create or replace function public.claim_invite(p_token text)
returns public.staff
language plpgsql security definer set search_path = public as $$
declare v_row public.staff; v_email text;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select lower(email) into v_email from auth.users where id = auth.uid();
  update staff set user_id = auth.uid(), email = v_email, invite_token = null, invite_expires = null
   where invite_token = p_token and user_id is null and (invite_expires is null or invite_expires > now())
   returning * into v_row;
  if v_row.id is null then raise exception 'invalid or used invite'; end if;
  return v_row;
end $$;
grant execute on function public.claim_invite(text) to authenticated;

-- Выдать приглашение (выполняет админ в SQL Editor, срок 7 дней), ссылка: .../staff/?invite=<токен>
--   update public.staff set invite_token = replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
--          invite_expires = now() + interval '7 days' where id = 'dima' returning invite_token;
