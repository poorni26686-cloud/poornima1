import { Star, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import templeImage from "@/assets/destination-temple.jpg";
import europeImage from "@/assets/destination-europe.jpg";
import mountainsImage from "@/assets/destination-mountains.jpg";
import desertImage from "@/assets/destination-desert.jpg";

const destinations = [
  {
    id: 1,
    name: "Angkor Wat",
    location: "Cambodia",
    image: templeImage,
    rating: 4.9,
    reviews: 2847,
    price: 45,
    category: "Heritage",
  },
  {
    id: 2,
    name: "Venice Canals",
    location: "Italy",
    image: europeImage,
    rating: 4.8,
    reviews: 3621,
    price: 120,
    category: "City",
  },
  {
    id: 3,
    name: "Swiss Alps",
    location: "Switzerland",
    image: mountainsImage,
    rating: 4.9,
    reviews: 1952,
    price: 85,
    category: "Adventure",
  },
  {
    id: 4,
    name: "Sahara Oasis",
    location: "Morocco",
    image: desertImage,
    rating: 4.7,
    reviews: 1284,
    price: 95,
    category: "Exotic",
  },
];

const FeaturedDestinations = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Top Destinations
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Explore Popular Places
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Discover the world's most breathtaking destinations curated by our travel experts
            </p>
          </div>
          <Link to="/destinations">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <Link
              key={destination.id}
              to={`/destinations/${destination.id}`}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="destination-card card-hover h-80 rounded-2xl overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {destination.category}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <div className="flex items-center gap-1 text-accent mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium text-primary-foreground">
                      {destination.rating}
                    </span>
                    <span className="text-primary-foreground/60 text-xs">
                      ({destination.reviews.toLocaleString()} reviews)
                    </span>
                  </div>
                  
                  <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
                    {destination.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-primary-foreground/70 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      {destination.location}
                    </div>
                    <div className="text-primary-foreground text-sm">
                      From <span className="font-bold text-lg">${destination.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
