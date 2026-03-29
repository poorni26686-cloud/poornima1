/**
 * Place cards grid — displayed when a state is selected from search
 */

import { motion } from "framer-motion";
import { Star, Plus, Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTripCart } from "@/contexts/TripCartContext";
import placeDetails, { type PlaceDetail } from "@/data/placeDetails";

interface StatePlacesProps {
  selectedState: string;
  onClearState: () => void;
}

const StatePlaces = ({ selectedState, onClearState }: StatePlacesProps) => {
  const places = placeDetails[selectedState] || [];
  const { addItem, removeItem, isInCart } = useTripCart();

  if (!selectedState || places.length === 0) return null;

  const handleToggle = (place: PlaceDetail) => {
    if (isInCart(place.id)) {
      removeItem(place.id);
    } else {
      addItem(place);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-6 h-6 text-secondary" />
            Places in {selectedState}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Select places to add to your trip cart
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onClearState}>
          ← Back to Search
        </Button>
      </div>

      {/* Place Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, i) => {
          const inCart = isInCart(place.id);
          return (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl border overflow-hidden bg-card shadow-sm hover:shadow-lg transition-all group ${
                inCart ? "border-primary ring-2 ring-primary/20" : "border-border"
              }`}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {inCart && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> In Cart
                  </div>
                )}
                {/* Rating */}
                <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-sm font-medium">
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                  {place.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{place.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{place.state}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {place.description}
                </p>
                <Button
                  onClick={() => handleToggle(place)}
                  variant={inCart ? "outline" : "default"}
                  className="w-full gap-2"
                  size="sm"
                >
                  {inCart ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Trip
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Add to Trip
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StatePlaces;
