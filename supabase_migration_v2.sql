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
   and column_name in ('is_urgent','content_bn','qualification','category','student_id','group','tracking_id','address')
 order by table_name, column_name;

-- ----------------------------------------------------------------------------
-- To remove ALL demo data later (run only when you want it gone):
-- delete from public.results      where id ~ '^(6|7|8|9|10)-[1-8]-';
-- delete from public.fee_receipts where id like 'demo-fee-%';
-- delete from public.students     where id like 'demo-stu-%';
-- delete from public.notices      where id like 'demo-not-%';
-- delete from public.admissions   where id like 'BDHS-ADM-2027-D%';
-- ----------------------------------------------------------------------------
