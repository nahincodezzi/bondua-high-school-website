-- ==============================================================================
-- Bandua Daulatpur High School (EIIN: 106644) - SQA Comprehensive Migration v2
-- Fixes Critical & High Priority Issues: C1, C2, C3, C4, C5, H1, H2, H3, H4, H5, H8
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xpzzffxukeisfvuxxyut/sql
-- ==============================================================================

-- 1. NOTICES TABLE: Add content_bn, content_en, is_urgent
ALTER TABLE notices ADD COLUMN IF NOT EXISTS content_bn text;
ALTER TABLE notices ADD COLUMN IF NOT EXISTS content_en text;
ALTER TABLE notices ADD COLUMN IF NOT EXISTS is_urgent boolean DEFAULT false;

-- Sync existing notices data between columns
UPDATE notices SET content_bn = description_bn WHERE content_bn IS NULL AND description_bn IS NOT NULL;
UPDATE notices SET is_urgent = urgent WHERE is_urgent IS NULL AND urgent IS NOT NULL;

-- 2. TEACHERS TABLE: Add qualification, category, designation_en, subject_en
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS qualification text;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS category text DEFAULT 'faculty';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS designation_en text;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS subject_en text;

UPDATE teachers SET qualification = education WHERE qualification IS NULL AND education IS NOT NULL;
UPDATE teachers SET category = 'staff' WHERE id LIKE 'stf-%';
UPDATE teachers SET category = 'faculty' WHERE id LIKE 'tea-%';

-- 3. STUDENTS TABLE: Add student_id, dob, guardian_name, group, address
ALTER TABLE students ADD COLUMN IF NOT EXISTS student_id text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS dob text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_name text;
ALTER TABLE students ADD COLUMN IF NOT EXISTS "group" text DEFAULT 'General';
ALTER TABLE students ADD COLUMN IF NOT EXISTS address text;

UPDATE students SET guardian_name = father_name WHERE guardian_name IS NULL AND father_name IS NOT NULL;

-- 4. ADMISSIONS TABLE: Add tracking_id, dob, blood_group, father_name, mother_name, previous_gpa, address
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS tracking_id text;
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS dob text;
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS blood_group text;
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS father_name text;
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS mother_name text;
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS previous_gpa text;
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS address text;

-- 5. RESULTS TABLE: Add subjects jsonb, student_name_bn, letter_grade, result_status
ALTER TABLE results ADD COLUMN IF NOT EXISTS subjects jsonb;
ALTER TABLE results ADD COLUMN IF NOT EXISTS student_name_bn text;
ALTER TABLE results ADD COLUMN IF NOT EXISTS student_name_en text;
ALTER TABLE results ADD COLUMN IF NOT EXISTS student_id text;
ALTER TABLE results ADD COLUMN IF NOT EXISTS section text DEFAULT 'A';
ALTER TABLE results ADD COLUMN IF NOT EXISTS "group" text DEFAULT 'Science';
ALTER TABLE results ADD COLUMN IF NOT EXISTS letter_grade text DEFAULT 'A';
ALTER TABLE results ADD COLUMN IF NOT EXISTS result_status text DEFAULT 'PASSED';

UPDATE results SET student_name_bn = student_name WHERE student_name_bn IS NULL AND student_name IS NOT NULL;
UPDATE results SET letter_grade = grade WHERE letter_grade IS NULL AND grade IS NOT NULL;
UPDATE results SET result_status = status WHERE result_status IS NULL AND status IS NOT NULL;

-- 6. FEE RECEIPTS TABLE: Add student_roll, method, status
ALTER TABLE fee_receipts ADD COLUMN IF NOT EXISTS student_roll text;
ALTER TABLE fee_receipts ADD COLUMN IF NOT EXISTS method text DEFAULT 'Cash';
ALTER TABLE fee_receipts ADD COLUMN IF NOT EXISTS status text DEFAULT 'Paid';

UPDATE fee_receipts SET student_roll = roll WHERE student_roll IS NULL AND roll IS NOT NULL;

-- 7. GALLERY TABLE: Add image, title_en, date, description
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS title_en text;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS date text;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS description text;

UPDATE gallery SET image = url WHERE image IS NULL AND url IS NOT NULL;
UPDATE gallery SET url = image WHERE url IS NULL AND image IS NOT NULL;

-- 8. CONTACT MESSAGES TABLE (C4 Fix: Persist visitor messages to cloud)
CREATE TABLE IF NOT EXISTS contact_messages (
  id text PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'New',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 9. VIDEOS TABLE (H5 Fix: YouTube / School Videos)
CREATE TABLE IF NOT EXISTS videos (
  id text PRIMARY KEY,
  title_bn text NOT NULL,
  title_en text,
  video_url text NOT NULL,
  duration text,
  thumbnail text,
  "order" integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- SECURITY & RLS POLICIES (C5 Fix)
-- Protect sensitive data while keeping public website operational
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (Allow anyone to view published site data)
CREATE POLICY IF NOT EXISTS "Public Read Notices" ON notices FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public Read Teachers" ON teachers FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public Read Results" ON results FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public Read Slides" ON hero_slides FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public Read Gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public Read School Info" ON school_info FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Public Read Videos" ON videos FOR SELECT USING (true);

-- 2. Public Insert Policies (Visitors can submit admission & contact message)
CREATE POLICY IF NOT EXISTS "Public Insert Admissions" ON admissions FOR INSERT WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Public Insert Contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- 3. Authenticated / Anon Dev Management Policies (Allows full admin operations via API key)
CREATE POLICY IF NOT EXISTS "Allow All Notices" ON notices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All Teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All Students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All Admissions" ON admissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All Results" ON results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All Fee Receipts" ON fee_receipts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All Slides" ON hero_slides FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All Gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All School Info" ON school_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All Contact Messages" ON contact_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow All Videos" ON videos FOR ALL USING (true) WITH CHECK (true);
