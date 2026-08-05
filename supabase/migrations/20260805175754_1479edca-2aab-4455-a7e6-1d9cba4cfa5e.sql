CREATE TABLE public.review_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 60),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  text text NOT NULL CHECK (char_length(text) BETWEEN 10 AND 1500),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.review_submissions TO anon;
GRANT INSERT ON public.review_submissions TO authenticated;
GRANT ALL ON public.review_submissions TO service_role;

ALTER TABLE public.review_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a review"
  ON public.review_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER review_submissions_updated_at
BEFORE UPDATE ON public.review_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();