CREATE TABLE public.director_registration (
  singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton),
  closed_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.director_registration TO service_role;
ALTER TABLE public.director_registration ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.staff_registration_permits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.staff_registration_permits TO service_role;
ALTER TABLE public.staff_registration_permits ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX overnight_only_one_director ON public.user_roles (role) WHERE role = 'admin';

CREATE OR REPLACE FUNCTION public.initial_registration_open()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT NOT EXISTS (SELECT 1 FROM public.director_registration) AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'); $$;
REVOKE ALL ON FUNCTION public.initial_registration_open() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.initial_registration_open() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.guard_initial_registration()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE permit_id uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(726311902);
  DELETE FROM public.staff_registration_permits
    WHERE id::text = NEW.raw_app_meta_data->>'signup_permit'
      AND lower(email) = lower(NEW.email)
      AND created_at > now() - interval '15 minutes'
    RETURNING id INTO permit_id;
  IF permit_id IS NOT NULL THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'moderator');
    RETURN NEW;
  END IF;
  IF EXISTS (SELECT 1 FROM public.director_registration)
     OR EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RAISE EXCEPTION 'Initial registration is permanently closed' USING ERRCODE = '42501';
  END IF;
  INSERT INTO public.director_registration(singleton) VALUES (true);
  INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id, 'admin');
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_initial_registration() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER overnight_initial_registration AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.guard_initial_registration();