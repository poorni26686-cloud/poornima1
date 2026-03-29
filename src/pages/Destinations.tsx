/**
 * Destinations Page — with state selection, place cards, trip cart, and AI planning
 */

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/chat/ChatBot";
import SearchFilters, { FilterState } from "@/components/destinations/SearchFilters";
import DestinationCard from "@/components/destinations/DestinationCard";
import StatePlaces from "@/components/destinations/StatePlaces";
import TripCartPanel from "@/components/destinations/TripCartPanel";
import CartFloatingButton from "@/components/destinations/CartFloatingButton";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
  is_featured: boolean | null;
}

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedState, setSelectedState] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: "All",
    continent: "All",
    priceRange: [0, 5000],
    minRating: 0,
  });

  const { user } = useAuth();

  // Check if a state was selected from the search dropdown
  useEffect(() => {
    // When searchQuery exactly matches a state name, show its places
    const query = filters.searchQuery.trim();
    if (query && query.length > 3) {
      // Import check against place data
      import("@/data/placeDetails").then((mod) => {
        if (mod.default[query]) {
          setSelectedState(query);
        }
      });
    }
  }, [filters.searchQuery]);

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("destinations")
        .select("*")
        .order("is_featured", { ascending: false })
        .order("rating", { ascending: false });

      if (fetchError) {
        setError("Failed to load destinations.");
        setIsLoading(false);
        return;
      }

      setDestinations(
        (data || []).map((d) => ({
          ...d,
          rating: Number(d.rating),
          price_per_person: Number(d.price_per_person),
          is_featured: d.is_featured,
        }))
      );
      setIsLoading(false);
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (!user) { setFavorites(new Set()); return; }
    supabase
      .from("favorite_destinations")
      .select("destination_id")
      .eq("user_id", user.id)
      .then(({ data }) => {
        setFavorites(new Set(data?.map((f) => f.destination_id) || []));
      });
  }, [user]);

  const toggleFavorite = async (destinationId: string) => {
    if (!user) { toast.error("Please sign in to save favorites"); return; }
    const isFav = favorites.has(destinationId);
    try {
      if (isFav) {
        await supabase.from("favorite_destinations").delete().eq("user_id", user.id).eq("destination_id", destinationId);
        setFavorites((prev) => { const n = new Set(prev); n.delete(destinationId); return n; });
        toast.success("Removed from favorites");
      } else {
        await supabase.from("favorite_destinations").insert({ user_id: user.id, destination_id: destinationId });
        setFavorites((prev) => new Set([...prev, destinationId]));
        toast.success("Added to favorites");
      }
    } catch { toast.error("Failed to update favorites"); }
  };

  const filteredDestinations = destinations.filter((d) => {
    const q = filters.searchQuery.toLowerCase();
    const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
    const matchesCategory = filters.category === "All" || d.category === filters.category;
    const matchesContinent = filters.continent === "All" || d.continent === filters.continent;
    const matchesPrice = d.price_per_person >= filters.priceRange[0] && d.price_per_person <= filters.priceRange[1];
    const matchesRating = d.rating >= filters.minRating;
    return matchesSearch && matchesCategory && matchesContinent && matchesPrice && matchesRating;
  });

  const handleClearState = () => {
    setSelectedState("");
    setFilters((f) => ({ ...f, searchQuery: "" }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Explore Destinations
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Search by state, pick your favorite places, and generate an AI trip plan
          </motion.p>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <SearchFilters
            filters={filters}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={filteredDestinations.length}
          />

          {/* State Places View */}
          {selectedState ? (
            <StatePlaces selectedState={selectedState} onClearState={handleClearState} />
          ) : (
            <>
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-muted-foreground">Loading destinations...</p>
                </div>
              )}

              {error && !isLoading && (
                <div className="text-center py-20">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              )}

              {!isLoading && !error && filteredDestinations.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No destinations found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFilters({ searchQuery: "", category: "All", continent: "All", priceRange: [0, 5000], minRating: 0 })}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {!isLoading && !error && filteredDestinations.length > 0 && (
                <div className={cn("gap-6 mt-6", viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col")}>
                  {filteredDestinations.map((d, i) => (
                    <DestinationCard
                      key={d.id}
                      {...d}
                      isFavorite={favorites.has(d.id)}
                      onToggleFavorite={toggleFavorite}
                      viewMode={viewMode}
                      index={i}
                      reviews_count={d.reviews_count ?? 0}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
      <ChatBot />

      {/* Cart */}
      <CartFloatingButton onClick={() => setIsCartOpen(true)} />
      <TripCartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Destinations;
