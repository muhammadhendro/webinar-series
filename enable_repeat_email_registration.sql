-- Run this once on an existing Supabase project to allow the same email
-- address to be submitted multiple times as separate registration rows.

alter table speakers
drop constraint if exists speakers_email_key;

drop policy if exists "Enable update for everyone" on speakers;

create index if not exists speakers_email_idx on speakers (email);
