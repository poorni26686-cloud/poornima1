import { useState } from "react";
import { Search, MapPin, Star, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/chat/ChatBot";
import { cn } from "@/lib/utils";

import templeImage from "@/assets/destination-temple.jpg";
import europeImage from "@/assets/destination-europe.jpg";
import mountainsImage from "@/assets/destination-mountains.jpg";
import desertImage from "@/assets/destination-desert.jpg";
import heroImage from "@/assets/hero-beach.jpg";

const destinations = [
  {
    id: 1,
    name: "Angkor Wat Temple",
    location: "Cambodia, Asia",
    image: templeImage,
    rating: 4.9,
    reviews: 2847,
    price: 45,
    category: "Heritage",
    description: "Ancient temple complex and UNESCO World Heritage site",
  },
  {
    id: 2,
    name: "Venice Canals",
    location: "Italy, Europe",
    image: europeImage,
    rating: 4.8,
    reviews: 3621,
    price: 120,
    category: "City",
    description: "Romantic waterways and historic architecture",
  },
  {
    id: 3,
    name: "Swiss Alps",
    location: "Switzerland, Europe",
    image: mountainsImage,
    rating: 4.9,
    reviews: 1952,
    price: 85,
    category: "Adventure",
    description: "Majestic mountain peaks and pristine nature",
  },
  {
    id: 4,
    name: "Sahara Oasis",
    location: "Morocco, Africa",
    image: desertImage,
    rating: 4.7,
    reviews: 1284,
    price: 95,
    category: "Exotic",
    description: "Desert landscapes and traditional culture",
  },
  {
    id: 5,
    name: "Tropical Paradise",
    location: "Thailand, Asia",
    image: heroImage,
    rating: 4.9,
    reviews: 4521,
    price: 65,
    category: "Beach",
    description: "Crystal clear waters and white sandy beaches",
  },
  {
    id: 6,
    name: "Ancient Ruins",
    location: "Greece, Europe",
    image: templeImage,
    rating: 4.8,
    reviews: 2156,
    price: 75,
    category: "Heritage",
    description: "Historical sites and Mediterranean charm",
  },
];

const categories = ["All", "Beach", "Adventure", "Heritage", "City", "Exotic"];

const Destinations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
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

      {/* Filters */}
      <section className="py-6 border-b border-border bg-card sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Categories */}
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
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground mb-6">
            Showing {filteredDestinations.length} destinations
          </p>

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
                {/* Image */}
                <div
                  className={cn(
                    "relative overflow-hidden",
                    viewMode === "grid" ? "h-56" : "w-80 h-48 shrink-0"
                  )}
                >
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {destination.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1">
                  <div className="flex items-center gap-1 text-accent mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium text-foreground">
                      {destination.rating}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({destination.reviews.toLocaleString()} reviews)
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-foreground mb-1">
                    {destination.name}
                  </h3>

                  <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {destination.location}
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    {destination.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-foreground">
                      From{" "}
                      <span className="font-bold text-xl text-primary">
                        ${destination.price}
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
        </div>
      </section>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Destinations;
