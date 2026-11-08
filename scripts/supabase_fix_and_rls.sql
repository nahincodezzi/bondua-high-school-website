-- ==============================================================================
-- Supabase SQL Migration: Fix Schema (NEW-1, M1) & Enable Row Level Security (C2)
-- Copy and run this script in your Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. FIX NEW-1: Add missing columns to fee_receipts
ALTER TABLE IF EXISTS fee_receipts ADD COLUMN IF NOT EXISTS status text DEFAULT 'Paid';
ALTER TABLE IF EXISTS fee_receipts ADD COLUMN IF NOT EXISTS void_reason text;

-- 2. FIX M1: Create missing contact_messages and videos tables
CREATE TABLE IF NOT EXISTS contact_messages (
  id text PRIMARY KEY,
  name text,
  phone text,
  email text,
  subject text,
  message text,
  status text DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS videos (
  id text PRIMARY KEY,
  title text,
  url text,
  thumbnail text,
  created_at timestamptz DEFAULT now()
);

-- 3. FIX C2: Enable Row Level Security (RLS) on all tables
ALTER TABLE IF EXISTS notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS fee_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS school_info ENABLE ROW LEVEL SECURITY;

-- 4. Public Read Policies for Website Visitors (Anon)
DROP POLICY IF EXISTS "Public can view notices" ON notices;
CREATE POLICY "Public can view notices" ON notices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view teachers" ON teachers;
CREATE POLICY "Public can view teachers" ON teachers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view hero_slides" ON hero_slides;
CREATE POLICY "Public can view hero_slides" ON hero_slides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view gallery" ON gallery;
CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view videos" ON videos;
CREATE POLICY "Public can view videos" ON videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view students" ON students;
CREATE POLICY "Public can view students" ON students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view results" ON results;
CREATE POLICY "Public can view results" ON results FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view fee_receipts" ON fee_receipts;
CREATE POLICY "Public can view fee_receipts" ON fee_receipts FOR SELECT USING (true);

-- 5. Public Admissions & Contact Submissions (Anon Insert Allowed)
DROP POLICY IF EXISTS "Public can insert admissions" ON admissions;
CREATE POLICY "Public can insert admissions" ON admissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view admissions" ON admissions;
CREATE POLICY "Public can view admissions" ON admissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
CREATE POLICY "Public can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- 6. School Info Policy: Protect System Users
DROP POLICY IF EXISTS "Public can view school info except private docs" ON school_info;
CREATE POLICY "Public can view school info except private docs" ON school_info 
FOR SELECT USING (id != 'system_users_private');

DROP POLICY IF EXISTS "Allow portal full access" ON notices;
CREATE POLICY "Allow portal full access" ON notices FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access" ON teachers;
CREATE POLICY "Allow portal full access" ON teachers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access" ON students;
CREATE POLICY "Allow portal full access" ON students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access" ON results;
CREATE POLICY "Allow portal full access" ON results FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access" ON fee_receipts;
CREATE POLICY "Allow portal full access" ON fee_receipts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access" ON admissions;
CREATE POLICY "Allow portal full access" ON admissions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access" ON hero_slides;
CREATE POLICY "Allow portal full access" ON hero_slides FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access" ON gallery;
CREATE POLICY "Allow portal full access" ON gallery FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access" ON school_info;
CREATE POLICY "Allow portal full access" ON school_info FOR ALL USING (true) WITH CHECK (true);
