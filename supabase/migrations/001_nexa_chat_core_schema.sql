-- Nexa Chat core schema (applied to Supabase project via MCP on 2026-07-17)
-- profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  status_text text default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles
  for select using (auth.uid() is not null);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- channels ---------------------------------------------------------------
create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  name text unique,                     -- null for DMs
  description text default '',
  type text not null default 'public' check (type in ('public','private','dm')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.channel_members (
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz not null default now(),
  primary key (channel_id, user_id)
);

-- helper to avoid RLS recursion between channels and channel_members
create or replace function public.is_channel_member(p_channel_id uuid, p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.channel_members
    where channel_id = p_channel_id and user_id = p_user_id
  );
$$;

alter table public.channels enable row level security;
alter table public.channel_members enable row level security;

create policy "channels_select" on public.channels
  for select using (
    type = 'public' or public.is_channel_member(id, auth.uid())
  );
create policy "channels_insert" on public.channels
  for insert with check (auth.uid() = created_by);
create policy "channels_update_creator" on public.channels
  for update using (auth.uid() = created_by);
create policy "channels_delete_creator" on public.channels
  for delete using (auth.uid() = created_by);

create policy "members_select" on public.channel_members
  for select using (
    user_id = auth.uid() or public.is_channel_member(channel_id, auth.uid())
  );
create policy "members_insert_self" on public.channel_members
  for insert with check (
    user_id = auth.uid()
    or exists (
      -- DM creator may add the other participant
      select 1 from public.channels c
      where c.id = channel_id and c.type = 'dm' and c.created_by = auth.uid()
    )
  );
create policy "members_delete_self" on public.channel_members
  for delete using (user_id = auth.uid());
create policy "members_update_self" on public.channel_members
  for update using (user_id = auth.uid());

-- messages ---------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  edited_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_channel_created_idx
  on public.messages (channel_id, created_at desc);

alter table public.messages enable row level security;

create policy "messages_select_member" on public.messages
  for select using (public.is_channel_member(channel_id, auth.uid()));
create policy "messages_insert_member" on public.messages
  for insert with check (
    auth.uid() = user_id and public.is_channel_member(channel_id, auth.uid())
  );
create policy "messages_update_own" on public.messages
  for update using (auth.uid() = user_id);
create policy "messages_delete_own" on public.messages
  for delete using (auth.uid() = user_id);

-- reactions ----------------------------------------------------------------
create table if not exists public.message_reactions (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  primary key (message_id, user_id, emoji)
);

alter table public.message_reactions enable row level security;

create policy "reactions_select" on public.message_reactions
  for select using (
    exists (
      select 1 from public.messages m
      where m.id = message_id and public.is_channel_member(m.channel_id, auth.uid())
    )
  );
create policy "reactions_insert_own" on public.message_reactions
  for insert with check (
    auth.uid() = user_id and exists (
      select 1 from public.messages m
      where m.id = message_id and public.is_channel_member(m.channel_id, auth.uid())
    )
  );
create policy "reactions_delete_own" on public.message_reactions
  for delete using (auth.uid() = user_id);

-- auto-create profile on signup --------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1) || '-' || left(new.id::text, 4)),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- seed default channel ------------------------------------------------------
insert into public.channels (name, description, type)
values ('general', 'Company-wide announcements and chatter', 'public')
on conflict (name) do nothing;

-- realtime -------------------------------------------------------------------
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.message_reactions;
alter publication supabase_realtime add table public.channel_members;
alter publication supabase_realtime add table public.channels;
