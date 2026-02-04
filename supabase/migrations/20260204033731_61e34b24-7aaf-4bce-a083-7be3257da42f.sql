-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create destinations table for tourist attractions
CREATE TABLE public.destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  continent TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  price_per_person DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  best_time_to_visit TEXT,
  highlights TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorite destinations table for users
CREATE TABLE public.favorite_destinations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, destination_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_destinations ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Destinations RLS policies (public read, admin write)
CREATE POLICY "Anyone can view destinations" 
ON public.destinations FOR SELECT 
USING (true);

-- Favorite destinations RLS policies
CREATE POLICY "Users can view their own favorites" 
ON public.favorite_destinations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" 
ON public.favorite_destinations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" 
ON public.favorite_destinations FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample destinations
INSERT INTO public.destinations (name, location, country, continent, image_url, rating, reviews_count, price_per_person, category, description, best_time_to_visit, highlights, is_featured)
VALUES 
  ('Angkor Wat Temple', 'Siem Reap', 'Cambodia', 'Asia', 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800', 4.9, 2847, 45.00, 'Heritage', 'Ancient temple complex and UNESCO World Heritage site featuring stunning Khmer architecture', 'November to February', ARRAY['Sunrise views', 'Ancient architecture', 'Guided tours'], true),
  ('Venice Canals', 'Venice', 'Italy', 'Europe', 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800', 4.8, 3621, 120.00, 'City', 'Romantic waterways and historic Renaissance architecture', 'April to June', ARRAY['Gondola rides', 'St. Marks Square', 'Murano glass'], true),
  ('Swiss Alps', 'Zermatt', 'Switzerland', 'Europe', 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', 4.9, 1952, 85.00, 'Adventure', 'Majestic mountain peaks and pristine alpine nature', 'June to September', ARRAY['Matterhorn views', 'Hiking trails', 'Skiing'], true),
  ('Sahara Oasis', 'Merzouga', 'Morocco', 'Africa', 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800', 4.7, 1284, 95.00, 'Exotic', 'Desert landscapes and traditional Berber culture', 'October to April', ARRAY['Camel treks', 'Desert camping', 'Stargazing'], true),
  ('Tropical Paradise', 'Phuket', 'Thailand', 'Asia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 4.9, 4521, 65.00, 'Beach', 'Crystal clear waters and white sandy beaches', 'November to April', ARRAY['Beach activities', 'Thai cuisine', 'Island hopping'], true),
  ('Santorini Sunset', 'Santorini', 'Greece', 'Europe', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', 4.8, 2156, 75.00, 'Heritage', 'Historical sites and Mediterranean charm with iconic blue domes', 'April to October', ARRAY['Sunset views', 'Wine tasting', 'Ancient ruins'], true),
  ('Machu Picchu', 'Cusco', 'Peru', 'South America', 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800', 4.9, 3892, 110.00, 'Heritage', 'Iconic Incan citadel high in the Andes Mountains', 'May to September', ARRAY['Inca Trail', 'Mountain views', 'Archaeological site'], true),
  ('Bali Rice Terraces', 'Ubud', 'Indonesia', 'Asia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 4.7, 2341, 55.00, 'Nature', 'Stunning terraced rice paddies and spiritual temples', 'April to October', ARRAY['Rice terraces', 'Yoga retreats', 'Temple visits'], false);