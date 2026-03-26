
-- Create reviews table for destination reviews
CREATE TABLE public.destination_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

-- Enable RLS
ALTER TABLE public.destination_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can view reviews"
  ON public.destination_reviews FOR SELECT
  TO public
  USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Users can create their own reviews"
  ON public.destination_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON public.destination_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON public.destination_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_destination_reviews_updated_at
  BEFORE UPDATE ON public.destination_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
