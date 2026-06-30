-- ============================================================================
-- Note2Frais — Initial schema (app_b7abd1d2)
-- Idempotent DDL only. No seed data.
-- Tables: users (profile), categories (app-owned lookup), reviews (expenses).
-- ============================================================================

-- ============================================================================
-- 1. Users — profile table. id mirrors auth.users(id) so every auth user has
--    exactly one profile row that owns their expenses.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.app_b7abd1d2_users (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text,
  full_name     text,
  avatar_url    text,
  phone         text,
  role          text NOT NULL DEFAULT 'member',
  total_due_eur numeric NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. Categories — app-owned lookup of expense categories.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.app_b7abd1d2_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  description text,
  image_url   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. Reviews (expenses) — owned by users.
--    user_id   = the consultant who owns the expense (NOT NULL, embeddable).
--    author_id = optional author reference (embeddable, nullable).
--    Both reference the PUBLIC users table (never auth.users) so PostgREST
--    resource embedding resolves cleanly.
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.app_b7abd1d2_reviews (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id    uuid REFERENCES public.app_b7abd1d2_users(id) ON DELETE SET NULL,
  user_id      uuid NOT NULL REFERENCES public.app_b7abd1d2_users(id) ON DELETE CASCADE,
  amount_eur   numeric NOT NULL,
  description  text NOT NULL,
  comment      text,
  expense_date date NOT NULL,
  receipt_url  text,
  status       text NOT NULL DEFAULT 'en_attente',
  rating       numeric,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ============================================================================
-- Grants — anon + authenticated can read/write (permissive for this app).
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_b7abd1d2_users      TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_b7abd1d2_categories TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_b7abd1d2_reviews    TO anon, authenticated;

-- ============================================================================
-- Row Level Security — enabled, with permissive policies (app enforces rules
-- client-side via role checks). DROP IF EXISTS keeps the migration idempotent.
-- ============================================================================
ALTER TABLE public.app_b7abd1d2_users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_b7abd1d2_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_b7abd1d2_reviews    ENABLE ROW LEVEL SECURITY;

-- app_b7abd1d2_users
DROP POLICY IF EXISTS app_b7abd1d2_users_all ON public.app_b7abd1d2_users;
CREATE POLICY app_b7abd1d2_users_all ON public.app_b7abd1d2_users
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- app_b7abd1d2_categories
DROP POLICY IF EXISTS app_b7abd1d2_categories_all ON public.app_b7abd1d2_categories;
CREATE POLICY app_b7abd1d2_categories_all ON public.app_b7abd1d2_categories
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- app_b7abd1d2_reviews
DROP POLICY IF EXISTS app_b7abd1d2_reviews_all ON public.app_b7abd1d2_reviews;
CREATE POLICY app_b7abd1d2_reviews_all ON public.app_b7abd1d2_reviews
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
