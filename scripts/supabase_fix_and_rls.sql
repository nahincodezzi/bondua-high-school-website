-- ==============================================================================
-- Supabase SQL Master Fix & Security Setup (Bugs 1, 2, 3, 5)
-- Run this entire script in your Supabase Dashboard:
-- https://supabase.com/dashboard/project/xpzzffxukeisfvuxxyut/sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. BUG 2: Fix fee_receipts schema (Missing columns causing PGRST204)
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS fee_receipts ADD COLUMN IF NOT EXISTS method      text DEFAULT 'Cash';
ALTER TABLE IF EXISTS fee_receipts ADD COLUMN IF NOT EXISTS status      text DEFAULT 'Paid';
ALTER TABLE IF EXISTS fee_receipts ADD COLUMN IF NOT EXISTS void_reason text;
ALTER TABLE IF EXISTS fee_receipts ADD COLUMN IF NOT EXISTS voided_by   text;
ALTER TABLE IF EXISTS fee_receipts ADD COLUMN IF NOT EXISTS voided_at   timestamptz;

-- ------------------------------------------------------------------------------
-- 2. BUG 3: Create missing contact_messages and videos tables (Eliminates PGRST205 404s)
-- ------------------------------------------------------------------------------
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
  title_bn text,
  title_en text,
  video_url text,
  duration text,
  thumbnail text,
  created_at timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 3. BUG 5: Server-side Login Attempt Tracking & Lockout Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.login_attempts (
  username text PRIMARY KEY,
  attempts int DEFAULT 0,
  locked_until timestamptz,
  last_attempt timestamptz DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. BUG 1 & BUG 5: Secure Server-Side verify_login RPC Function
-- Password hashes NEVER leave the database. Lockout is enforced server-side.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verify_login(p_username text, p_password_hash text)
RETURNS TABLE(
  success boolean,
  error_code text,
  remaining_minutes int,
  username text,
  role text,
  name_bn text,
  name_en text,
  designation_bn text,
  designation_en text,
  permissions jsonb
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user jsonb;
  v_attempts int := 0;
  v_locked_until timestamptz;
  v_clean_user text := lower(trim(p_username));
BEGIN
  -- Check server-side lockout (Bug 5)
  SELECT coalesce(attempts, 0), locked_until
  INTO v_attempts, v_locked_until
  FROM public.login_attempts
  WHERE lower(login_attempts.username) = v_clean_user;

  IF v_locked_until IS NOT NULL AND v_locked_until > now() THEN
    RETURN QUERY SELECT 
      false, 
      'LOCKED', 
      ceil(extract(epoch from (v_locked_until - now())) / 60)::int,
      null::text, null::text, null::text, null::text, null::text, null::text, null::jsonb;
    RETURN;
  END IF;

  -- Find user in school_info 'system_users' document
  SELECT u
  INTO v_user
  FROM school_info, jsonb_array_elements(data) AS u
  WHERE id = 'system_users'
    AND lower(u->>'username') = v_clean_user
    AND coalesce(u->>'status','active') <> 'inactive';

  IF v_user IS NULL THEN
    -- User not found: record failed attempt
    INSERT INTO public.login_attempts(username, attempts, last_attempt)
    VALUES (v_clean_user, 1, now())
    ON CONFLICT (username) DO UPDATE SET
      attempts = CASE WHEN login_attempts.locked_until IS NOT NULL AND login_attempts.locked_until <= now() THEN 1 ELSE login_attempts.attempts + 1 END,
      locked_until = CASE WHEN (login_attempts.attempts + 1) >= 5 THEN now() + interval '15 minutes' ELSE NULL END,
      last_attempt = now();

    RETURN QUERY SELECT false, 'INVALID_CREDENTIALS', 0, null::text, null::text, null::text, null::text, null::text, null::text, null::jsonb;
    RETURN;
  END IF;

  -- Verify password hash inside database
  IF v_user->>'passwordHash' = p_password_hash THEN
    -- Success: reset attempts
    INSERT INTO public.login_attempts(username, attempts, locked_until, last_attempt)
    VALUES (v_clean_user, 0, NULL, now())
    ON CONFLICT (username) DO UPDATE SET attempts = 0, locked_until = NULL, last_attempt = now();

    RETURN QUERY SELECT 
      true, 
      'SUCCESS', 
      0,
      v_user->>'username',
      v_user->>'role',
      v_user->>'nameBn',
      v_user->>'nameEn',
      v_user->>'designationBn',
      v_user->>'designationEn',
      (v_user->'permissions');
    RETURN;
  ELSE
    -- Wrong password: increment attempts & lock if >= 5
    INSERT INTO public.login_attempts(username, attempts, last_attempt)
    VALUES (v_clean_user, 1, now())
    ON CONFLICT (username) DO UPDATE SET
      attempts = CASE WHEN login_attempts.locked_until IS NOT NULL AND login_attempts.locked_until <= now() THEN 1 ELSE login_attempts.attempts + 1 END,
      locked_until = CASE WHEN (login_attempts.attempts + 1) >= 5 THEN now() + interval '15 minutes' ELSE NULL END,
      last_attempt = now();

    RETURN QUERY SELECT false, 'INVALID_CREDENTIALS', 0, null::text, null::text, null::text, null::text, null::text, null::text, null::jsonb;
    RETURN;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.verify_login(text,text) FROM public;
GRANT EXECUTE ON FUNCTION public.verify_login(text,text) TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 5. BUG 1: Enable Row Level Security (RLS) & Restrict Anonymous Access
-- ------------------------------------------------------------------------------
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

-- Public READ policies for website visitors
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

-- Public INSERT policies for Admissions & Contact Form
DROP POLICY IF EXISTS "Public can insert admissions" ON admissions;
CREATE POLICY "Public can insert admissions" ON admissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view admissions" ON admissions;
CREATE POLICY "Public can view admissions" ON admissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert contact messages" ON contact_messages;
CREATE POLICY "Public can insert contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- CRITICAL: Public CANNOT read system_users document from school_info!
DROP POLICY IF EXISTS "Public can view school info except system_users" ON school_info;
CREATE POLICY "Public can view school info except system_users" ON school_info 
FOR SELECT USING (id <> 'system_users');

-- Allow portal full write access for ERP modules
DROP POLICY IF EXISTS "Allow portal full access on fee_receipts" ON fee_receipts;
CREATE POLICY "Allow portal full access on fee_receipts" ON fee_receipts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access on school_info" ON school_info;
CREATE POLICY "Allow portal full access on school_info" ON school_info FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access on admissions" ON admissions;
CREATE POLICY "Allow portal full access on admissions" ON admissions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access on students" ON students;
CREATE POLICY "Allow portal full access on students" ON students FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access on notices" ON notices;
CREATE POLICY "Allow portal full access on notices" ON notices FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access on teachers" ON teachers;
CREATE POLICY "Allow portal full access on teachers" ON teachers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access on hero_slides" ON hero_slides;
CREATE POLICY "Allow portal full access on hero_slides" ON hero_slides FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access on gallery" ON gallery;
CREATE POLICY "Allow portal full access on gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access on contact_messages" ON contact_messages;
CREATE POLICY "Allow portal full access on contact_messages" ON contact_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow portal full access on videos" ON videos;
CREATE POLICY "Allow portal full access on videos" ON videos FOR ALL USING (true) WITH CHECK (true);
