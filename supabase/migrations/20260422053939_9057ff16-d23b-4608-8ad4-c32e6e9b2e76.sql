-- Tours table
CREATE TABLE public.tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT,
  image_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tours"
  ON public.tours FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert tours"
  ON public.tours FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update tours"
  ON public.tours FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete tours"
  ON public.tours FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON public.tours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Link guides to a tour (nullable so existing guides stay valid)
ALTER TABLE public.guides
  ADD COLUMN tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE;

CREATE INDEX idx_guides_tour_id ON public.guides(tour_id);