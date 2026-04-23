-- Create guide_bookings table for users to book tour guides
CREATE TABLE public.guide_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  num_people INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  contact_phone TEXT,
  total_price NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.guide_bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view their own bookings"
ON public.guide_bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.guide_bookings FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can create their own bookings
CREATE POLICY "Users can create their own bookings"
ON public.guide_bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (e.g. cancel)
CREATE POLICY "Users can update their own bookings"
ON public.guide_bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can update any booking (approve/reject)
CREATE POLICY "Admins can update any booking"
ON public.guide_bookings FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Users can delete their own bookings
CREATE POLICY "Users can delete their own bookings"
ON public.guide_bookings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_guide_bookings_updated_at
BEFORE UPDATE ON public.guide_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_guide_bookings_user ON public.guide_bookings(user_id);
CREATE INDEX idx_guide_bookings_guide ON public.guide_bookings(guide_id);