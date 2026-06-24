
-- 1) has_role: switch to SECURITY INVOKER and tighten EXECUTE
ALTER FUNCTION public.has_role(uuid, public.app_role) SECURITY INVOKER;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2) claim_admin: drop (admin already exists; bootstrap no longer needed)
DROP FUNCTION IF EXISTS public.claim_admin();

-- 3) applications: prevent flooding by enforcing one submission per (project_slug, lower(email))
DELETE FROM public.applications a
USING public.applications b
WHERE a.ctid < b.ctid
  AND a.project_slug = b.project_slug
  AND lower(a.email) = lower(b.email);

CREATE UNIQUE INDEX IF NOT EXISTS applications_unique_email_per_project
  ON public.applications (project_slug, lower(email));

-- Tighten the public insert policy with stricter field bounds
DROP POLICY IF EXISTS "anyone submits" ON public.applications;
CREATE POLICY "anyone submits" ON public.applications
  FOR INSERT
  WITH CHECK (
    char_length(full_name) BETWEEN 1 AND 200
    AND char_length(email) BETWEEN 3 AND 320
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(motivation) BETWEEN 10 AND 5000
    AND char_length(project_slug) BETWEEN 1 AND 200
    AND char_length(project_title) BETWEEN 1 AND 300
    AND (phone IS NULL OR char_length(phone) <= 40)
    AND (city IS NULL OR char_length(city) <= 200)
    AND (passport_type IS NULL OR char_length(passport_type) <= 80)
    AND (english_level IS NULL OR char_length(english_level) <= 80)
    AND (ngo_experience IS NULL OR char_length(ngo_experience) <= 2000)
    AND (consent_age IS NULL OR char_length(consent_age) <= 40)
    AND (admin_notes IS NULL)
    AND (status = 'pending')
    AND (coalesce(array_length(barriers, 1), 0) <= 20)
  );
