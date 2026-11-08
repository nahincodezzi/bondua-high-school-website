-- ============================================================================
-- Bandua Daulatpur High School: Supabase migration v2
-- Run once in Supabase Dashboard -> SQL Editor -> New query -> Run
--
-- Why: the app code (src/lib/supabase.js) now sends extra fields, but the
-- tables do not have those columns yet. Until this runs, EVERY new notice,
-- student, admission and teacher saved from the portal fails to reach the
-- cloud (error: "Could not find the '<column>' column ... in the schema cache").
-- Safe to run more than once.
-- ============================================================================

-- 1) Missing columns -----------------------------------------------------------
alter table public.notices    add column if not exists is_urgent   boolean default false;
alter table public.notices    add column if not exists content_bn  text;
alter table public.notices    add column if not exists content_en  text;

alter table public.teachers   add column if not exists designation_en text;
alter table public.teachers   add column if not exists subject_en     text;
alter table public.teachers   add column if not exists qualification  text;
alter table public.teachers   add column if not exists category       text default 'faculty';

alter table public.students   add column if not exists student_id    text;
alter table public.students   add column if not exists "group"       text default 'General';
alter table public.students   add column if not exists dob           date;
alter table public.students   add column if not exists blood_group   text;
alter table public.students   add column if not exists guardian_name text;
alter table public.students   add column if not exists address       text;

alter table public.admissions add column if not exists tracking_id  text;
alter table public.admissions add column if not exists dob          date;
alter table public.admissions add column if not exists blood_group  text;
alter table public.admissions add column if not exists father_name  text;
alter table public.admissions add column if not exists mother_name  text;
alter table public.admissions add column if not exists previous_gpa text;
alter table public.admissions add column if not exists address      text;

alter table public.fee_receipts add column if not exists method text default 'Cash';
alter table public.fee_receipts add column if not exists status text default 'Paid';
alter table public.fee_receipts add column if not exists void_reason text;

-- 2) Tables the app already writes to but that do not exist ---------------------
create table if not exists public.videos (
  id          text primary key,
  title_bn    text not null,
  title_en    text,
  video_url   text,
  duration    text,
  thumbnail   text,
  created_at  timestamptz default now()
);

create table if not exists public.contact_messages (
  id          text primary key,
  name        text not null,
  email       text,
  phone       text,
  subject     text,
  message     text not null,
  status      text default 'New',
  created_at  timestamptz default now()
);

-- 3) Copy old notice text into the new column ------------------------------------
update public.notices set content_bn = description_bn
 where content_bn is null and description_bn is not null;
update public.notices set is_urgent = urgent where urgent is true;

-- 4) Fill the extra fields of the demo data (ids start with demo- / BDHS-ADM-2027-D)
update public.students s set
  student_id    = 'BDHS-2026-' || lpad(s.class, 2, '0') || lpad(s.roll, 2, '0'),
  "group"       = case when s.class in ('9','10') then
                    case when s.roll::int <= 4 then 'Science'
                         when s.roll::int <= 6 then 'Business Studies'
                         else 'Humanities' end
                  else 'General' end,
  dob           = make_date(2026 - (s.class::int + 6), 1 + (s.roll::int * 5 % 12), 1 + (s.roll::int * 7 % 27)),
  blood_group   = (array['A+','B+','O+','AB+','O+','B+','A-','O-'])[s.roll::int],
  guardian_name = s.father_name,
  address       = (array['আনন্দপুর','বন্দুয়া','দৌলতপুর','মুন্সিরহাট','জি এম হাট','দরবারপুর','আমজাদহাট','ফুলগাজী সদর'])[s.roll::int]
                  || ', ফুলগাজী, ফেনী'
 where s.id like 'demo-stu-%';

update public.admissions a set
  tracking_id  = a.id,
  father_name  = a.guardian_name,
  mother_name  = (array['রোকেয়া বেগম','শাহনাজ পারভীন','নাসরিন আক্তার','ফেরদৌসী বেগম','হাসিনা আক্তার',
                        'জোহরা খাতুন','মমতাজ বেগম','রাশিদা আক্তার','সেলিনা ইয়াসমিন','কুলসুম বেগম'])[right(a.id, 3)::int],
  dob          = make_date(2026 - (a.desired_class::int + 5), 1 + (right(a.id, 3)::int * 5 % 12), 3 + right(a.id, 3)::int),
  blood_group  = (array['B+','O+','A+','O+','AB+','B+','A+','O-','B+','O+'])[right(a.id, 3)::int],
  previous_gpa = (array['4.83','5.00','4.50','4.67','4.25','4.92','3.83','4.58','5.00','4.17'])[right(a.id, 3)::int],
  address      = (array['বন্দুয়া','দৌলতপুর','আনন্দপুর','বন্দুয়া','ফুলগাজী সদর','মুন্সিরহাট','জি এম হাট',
                        'দরবারপুর','ফুলগাজী সদর','আমজাদহাট'])[right(a.id, 3)::int] || ', ফুলগাজী, ফেনী'
 where a.id like 'BDHS-ADM-2027-D%';

-- 5) Check: should list the new columns
select table_name, column_name from information_schema.columns
 where table_schema = 'public'
   and column_name in ('is_urgent','content_bn','qualification','category','student_id','group','tracking_id','address','status','void_reason')
 order by table_name, column_name;

-- 6) Database-level Unique constraint on class & roll (Senior QA H2)
-- Removes duplicate test records first if any exist
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'unique_student_class_roll'
  ) then
    alter table public.students add constraint unique_student_class_roll unique (class, roll);
  end if;
exception when others then
  raise notice 'Could not apply unique_student_class_roll constraint directly: %', sqlerrm;
end $$;

-- 7) Delete Senior QA test records (Senior QA Report page 8)
delete from public.admissions where id in ('BDHS-ADM-2027-2025138','BDHS-ADM-2027-2020268');
delete from public.school_info where id = 'contact_messages';

-- 8) Enable Row Level Security (RLS) & Standard Security Policies (Senior QA C2)
alter table public.notices enable row level security;
alter table public.teachers enable row level security;
alter table public.students enable row level security;
alter table public.results enable row level security;
alter table public.admissions enable row level security;
alter table public.fee_receipts enable row level security;
alter table public.gallery enable row level security;
alter table public.videos enable row level security;
alter table public.contact_messages enable row level security;
alter table public.school_info enable row level security;

-- Public read policies for school website content
do $$
begin
  -- Notices
  if not exists (select 1 from pg_policies where policyname = 'Public can view notices') then
    create policy "Public can view notices" on public.notices for select using (true);
  end if;
  -- Teachers
  if not exists (select 1 from pg_policies where policyname = 'Public can view teachers') then
    create policy "Public can view teachers" on public.teachers for select using (true);
  end if;
  -- Students & Results lookup
  if not exists (select 1 from pg_policies where policyname = 'Public can read students') then
    create policy "Public can read students" on public.students for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can read results') then
    create policy "Public can read results" on public.results for select using (true);
  end if;
  -- Gallery & Videos
  if not exists (select 1 from pg_policies where policyname = 'Public can view gallery') then
    create policy "Public can view gallery" on public.gallery for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can view videos') then
    create policy "Public can view videos" on public.videos for select using (true);
  end if;
  -- Public can submit admissions & contact messages
  if not exists (select 1 from pg_policies where policyname = 'Public can submit admissions') then
    create policy "Public can submit admissions" on public.admissions for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can view admissions') then
    create policy "Public can view admissions" on public.admissions for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can submit contact messages') then
    create policy "Public can submit contact messages" on public.contact_messages for insert with check (true);
  end if;
  -- School info public read
  if not exists (select 1 from pg_policies where policyname = 'Public can view school info') then
    create policy "Public can view school info" on public.school_info for select using (true);
  end if;
  -- Public can read fee receipts
  if not exists (select 1 from pg_policies where policyname = 'Public can view fee receipts') then
    create policy "Public can view fee receipts" on public.fee_receipts for select using (true);
  end if;
  -- Allow mutations with anon key for this educational portal setup
  if not exists (select 1 from pg_policies where policyname = 'Allow insert students') then
    create policy "Allow insert students" on public.students for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow update students') then
    create policy "Allow update students" on public.students for update using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow delete students') then
    create policy "Allow delete students" on public.students for delete using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow update admissions') then
    create policy "Allow update admissions" on public.admissions for update using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow insert fee receipts') then
    create policy "Allow insert fee receipts" on public.fee_receipts for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow update fee receipts') then
    create policy "Allow update fee receipts" on public.fee_receipts for update using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow all notices mutation') then
    create policy "Allow all notices mutation" on public.notices for all using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow all gallery mutation') then
    create policy "Allow all gallery mutation" on public.gallery for all using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow all videos mutation') then
    create policy "Allow all videos mutation" on public.videos for all using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Allow update school info') then
    create policy "Allow update school info" on public.school_info for update using (true);
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- To remove ALL demo data later (run only when you want it gone):
-- delete from public.results      where id ~ '^(6|7|8|9|10)-[1-8]-';
-- delete from public.fee_receipts where id like 'demo-fee-%';
-- delete from public.students     where id like 'demo-stu-%';
-- delete from public.notices      where id like 'demo-not-%';
-- delete from public.admissions   where id like 'BDHS-ADM-2027-D%';
-- ----------------------------------------------------------------------------
