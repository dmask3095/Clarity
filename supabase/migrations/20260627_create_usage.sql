create table if not exists public.usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null default current_date,
  message_count integer not null default 0,
  unique(user_id, date)
);

alter table public.usage enable row level security;

drop policy if exists "Users can view own usage" on public.usage;
create policy "Users can view own usage"
  on public.usage
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own usage" on public.usage;
create policy "Users can update own usage"
  on public.usage
  for update
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own usage" on public.usage;
create policy "Users can insert own usage"
  on public.usage
  for insert
  with check (auth.uid() = user_id);
