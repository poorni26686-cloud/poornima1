/**
 * Reusable Destination Card Component
 */

import { Link } from "react-router-dom";
import { Star, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  id: string;
  name: string;
  location: string;
  country: string;
  image_url: string;
  rating: number;
  reviews_count: number;
  price_per_person: number;
  category: string;
  description: string;
  best_time_to_visit: string | null;
  is_featured: boolean | null;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  viewMode: "grid" | "list";
  index?: number;
}

const DestinationCard = ({
  id, name, location, country, image_url, rating, reviews_count,
  price_per_person, category, description, best_time_to_visit,
  is_featured, isFavorite, onToggleFavorite, viewMode, index = 0,
}: DestinationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn(
        "group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 card-hover",
        viewMode === "list" && "flex"
      )}
    >
      {/* Image */}
      <Link
        to={`/destination/${id}`}
        className={cn(
          "relative overflow-hidden block",
          viewMode === "grid" ? "h-56" : "w-80 h-48 shrink-0"
        )}
      >
        <img
          src={image_url}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
            {category}
          </span>
        </div>
        {is_featured && (
          <div className="absolute bottom-4 left-4">
            <span className="px-2 py-1 rounded bg-accent text-accent-foreground text-xs font-medium">Featured</span>
          </div>
        )}
      </Link>

      {/* Favorite Button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(id); }}
        className={cn(
          "absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors z-10",
          isFavorite ? "bg-primary text-primary-foreground" : "bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary"
        )}
      >
        <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
      </button>

      {/* Details */}
      <div className="p-5 flex-1">
        <div className="flex items-center gap-1 text-accent mb-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
          <span className="text-muted-foreground text-xs">({reviews_count?.toLocaleString() || 0} reviews)</span>
        </div>
        <Link to={`/destination/${id}`}>
          <h3 className="font-display text-xl font-bold text-foreground mb-1 hover:text-primary transition-colors">{name}</h3>
        </Link>
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />
          {location}, {country}
        </div>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
        {best_time_to_visit && (
          <p className="text-xs text-muted-foreground mb-3">Best time: {best_time_to_visit}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="text-foreground">
            From <span className="font-bold text-xl text-primary">${price_per_person.toFixed(0)}</span>
            <span className="text-muted-foreground text-sm">/person</span>
          </div>
          <Link to={`/destination/${id}`}>
            <Button size="sm" className="btn-gradient rounded-xl">View Details</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
