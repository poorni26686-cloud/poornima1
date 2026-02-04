/**
 * Destinations Page Component
 * 
 * Displays a browsable list of tourist destinations fetched from the database.
 * Supports filtering by category, searching by name/location, and grid/list views.
 * 
 * Features:
 * - Real-time data fetching from Supabase
 * - Category filtering
 * - Search functionality
 * - Grid and list view modes
 * - Loading and error states
 * - Favorite destinations (for authenticated users)
 * 
 * @author Tourist Guiding System
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Search, MapPin, Star, Grid, List, SlidersHorizontal, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/chat/ChatBot";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Type definition for destination data from database
interface Destination {
  id: string;
  name: string;
  location: string;
  country: string;
  continent: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  price_per_person: number;
  category: string;
  description: string;
  best_time_to_visit: string | null;
  highlights: string[] | null;
  is_featured: boolean;
}

// Available category filters
const categories = ["All", "Beach", "Adventure", "Heritage", "City", "Exotic", "Nature"];

const Destinations = () => {
  // State for destinations data
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering and view options
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // State for favorites
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  // Auth hook for user-specific features
  const { user } = useAuth();

  /**
   * Fetch destinations from the database
   * Uses Supabase client to query the destinations table
   */
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Query destinations table - RLS allows public read access
        const { data, error: fetchError } = await supabase
          .from('destinations')
          .select('*')
          .order('is_featured', { ascending: false })
          .order('rating', { ascending: false });

        if (fetchError) {
          console.error('Error fetching destinations:', fetchError);
          setError('Failed to load destinations. Please try again.');
          return;
        }

        // Transform data to ensure correct types
        const transformedData: Destination[] = (data || []).map(dest => ({
          ...dest,
          rating: Number(dest.rating),
          price_per_person: Number(dest.price_per_person),
        }));

        setDestinations(transformedData);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  /**
   * Fetch user's favorite destinations if logged in
   */
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites(new Set());
        return;
      }

      try {
        const { data, error: favError } = await supabase
          .from('favorite_destinations')
          .select('destination_id')
          .eq('user_id', user.id);

        if (favError) {
          console.error('Error fetching favorites:', favError);
          return;
        }

        setFavorites(new Set(data?.map(f => f.destination_id) || []));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };

    fetchFavorites();
  }, [user]);

  /**
   * Toggle favorite status for a destination
   * Requires authentication
   */
  const toggleFavorite = async (destinationId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    const isFavorite = favorites.has(destinationId);

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorite_destinations')
          .delete()
          .eq('user_id', user.id)
          .eq('destination_id', destinationId);

        if (error) throw error;

        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(destinationId);
          return newFavorites;
        });
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorite_destinations')
          .insert({ user_id: user.id, destination_id: destinationId });

        if (error) throw error;

        setFavorites(prev => new Set([...prev, destinationId]));
        toast.success('Added to favorites');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('Failed to update favorites');
    }
  };

  // Filter destinations based on search query and category
  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Search */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore Destinations
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover amazing places around the world and start planning your
              next adventure
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, countries, or experiences..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-6 border-b border-border bg-card sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* View Options */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-muted"
                  )}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading destinations...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-20">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          )}

          {/* Results */}
          {!isLoading && !error && (
            <>
              <p className="text-muted-foreground mb-6">
                Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
              </p>

              {filteredDestinations.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No destinations found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div
                  className={cn(
                    "gap-6",
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "flex flex-col"
                  )}
                >
                  {filteredDestinations.map((destination) => (
                    <div
                      key={destination.id}
                      className={cn(
                        "group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 card-hover",
                        viewMode === "list" && "flex"
                      )}
                    >
                      {/* Destination Image */}
                      <div
                        className={cn(
                          "relative overflow-hidden",
                          viewMode === "grid" ? "h-56" : "w-80 h-48 shrink-0"
                        )}
                      >
                        <img
                          src={destination.image_url}
                          alt={destination.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                            {destination.category}
                          </span>
                        </div>
                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(destination.id);
                          }}
                          className={cn(
                            "absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                            favorites.has(destination.id)
                              ? "bg-primary text-primary-foreground"
                              : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary"
                          )}
                          aria-label={favorites.has(destination.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart className={cn("w-5 h-5", favorites.has(destination.id) && "fill-current")} />
                        </button>
                        {/* Featured Badge */}
                        {destination.is_featured && (
                          <div className="absolute bottom-4 left-4">
                            <span className="px-2 py-1 rounded bg-accent text-accent-foreground text-xs font-medium">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Destination Details */}
                      <div className="p-5 flex-1">
                        {/* Rating */}
                        <div className="flex items-center gap-1 text-accent mb-2">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium text-foreground">
                            {destination.rating.toFixed(1)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            ({destination.reviews_count.toLocaleString()} reviews)
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="font-display text-xl font-bold text-foreground mb-1">
                          {destination.name}
                        </h3>

                        {/* Location */}
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                          <MapPin className="w-3.5 h-3.5" />
                          {destination.location}, {destination.country}
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {destination.description}
                        </p>

                        {/* Best Time to Visit */}
                        {destination.best_time_to_visit && (
                          <p className="text-xs text-muted-foreground mb-3">
                            Best time: {destination.best_time_to_visit}
                          </p>
                        )}

                        {/* Price and Action */}
                        <div className="flex items-center justify-between">
                          <div className="text-foreground">
                            From{" "}
                            <span className="font-bold text-xl text-primary">
                              ${destination.price_per_person.toFixed(0)}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              /person
                            </span>
                          </div>
                          <Button size="sm" className="btn-gradient">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Destinations;
