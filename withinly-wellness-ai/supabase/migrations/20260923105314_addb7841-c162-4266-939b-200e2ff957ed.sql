CREATE TABLE public.waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_full_name_length CHECK (char_length(trim(full_name)) BETWEEN 2 AND 100),
  CONSTRAINT waitlist_email_length CHECK (char_length(trim(email)) BETWEEN 5 AND 254)
);

CREATE UNIQUE INDEX waitlist_signups_email_unique ON public.waitlist_signups (lower(trim(email)));

GRANT ALL ON public.waitlist_signups TO service_role;

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;