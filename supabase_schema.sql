-- ==============================================================================
-- Bandua Daulatpur High School (EIIN: 106644) - Supabase Database Schema
-- Run this script in the Supabase SQL Editor to initialize all 9 tables.
-- ==============================================================================

-- 1. School Information Table (School Settings, Vision, Contact)
create table if not exists school_info (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Notices Table
create table if not exists notices (
  id text primary key,
  title_bn text not null,
  title_en text,
  category text default 'academic',
  date date not null default current_date,
  urgent boolean default false,
  description_bn text,
  file_url text,
  author text default 'প্রধান শিক্ষক',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Teachers & Staff Table
create table if not exists teachers (
  id text primary key,
  name_bn text not null,
  name_en text,
  designation_bn text not null,
  subject_bn text,
  phone text,
  email text,
  education text,
  image text,
  "order" integer default 10,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Students Directory Table
create table if not exists students (
  id text primary key,
  roll text not null,
  name_bn text not null,
  name_en text,
  class text not null,
  section text default 'ক',
  shift text default 'দিবা',
  gender text default 'ছাত্র',
  father_name text,
  guardian_phone text,
  status text default 'নিয়মিত',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Online Admissions Table
create table if not exists admissions (
  id text primary key,
  applicant_name_bn text not null,
  applicant_name_en text,
  desired_class text not null,
  gender text,
  guardian_name text not null,
  guardian_phone text not null,
  previous_school text,
  status text default 'pending',
  applied_date timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Exam Results Table
create table if not exists results (
  id text primary key,
  exam text not null,
  year text not null,
  class text not null,
  roll text not null,
  student_name text not null,
  gpa numeric(3,2),
  grade text,
  status text default 'PASSED',
  marksheet jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Fee Collection & Receipts Table
create table if not exists fee_receipts (
  id text primary key,
  receipt_no text not null,
  student_id text,
  student_name text not null,
  class text not null,
  roll text not null,
  fee_type text not null,
  amount numeric(10,2) not null,
  paid_date timestamp with time zone default timezone('utc'::text, now())
);

-- 8. Hero Slider Slides Table
create table if not exists hero_slides (
  id text primary key,
  title_bn text not null,
  subtitle_bn text,
  tag_bn text,
  image text,
  "order" integer default 1,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 9. Photo & Media Gallery Table
create table if not exists gallery (
  id text primary key,
  title_bn text not null,
  category text default 'campus',
  url text not null,
  type text default 'photo',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
