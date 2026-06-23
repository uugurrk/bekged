
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;

DROP POLICY IF EXISTS "anyone submits" ON public.applications;
CREATE POLICY "anyone submits" ON public.applications FOR INSERT
  WITH CHECK (char_length(full_name) BETWEEN 1 AND 200
              AND char_length(email) BETWEEN 3 AND 320
              AND char_length(motivation) BETWEEN 10 AND 5000
              AND char_length(project_slug) BETWEEN 1 AND 200);
