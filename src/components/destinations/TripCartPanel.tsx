/**
 * Trip Cart Panel — slide-out panel showing selected places with AI trip planning
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, MapPin, Sparkles, Loader2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTripCart, playSound } from "@/contexts/TripCartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import TripMap from "@/components/map/TripMap";

interface TripCartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const TripCartPanel = ({ isOpen, onClose }: TripCartPanelProps) => {
  const { items, removeItem, clearCart, count } = useTripCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tripPlan, setTripPlan] = useState<string | null>(null);
  const [isPlanning, setIsPlanning] = useState(false);

  const generateTripPlan = async () => {
    if (items.length === 0) {
      toast.error("Add at least one place to plan a trip");
      return;
    }

    // Always re-check the session in case the cached user is stale
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    if (!user || !session) {
      toast.error("Please sign in to generate an AI trip plan");
      onClose();
      navigate("/auth");
      return;
    }

    setIsPlanning(true);
    setTripPlan(null);
    playSound("plan");

    try {
      const places = items.map((p) => `${p.name} (${p.state})`).join(", ");

      const { data, error } = await supabase.functions.invoke("generate-trip", {
        body: {
          destination: places,
          days: Math.max(items.length, 3),
          budget: "moderate",
          interests: ["sightseeing", "culture", "food"],
          travelType: "friends",
          season: "winter",
          pace: "moderate",
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        // Friendly auth error
        const msg = (error as any)?.message || "";
        if (msg.includes("401") || msg.toLowerCase().includes("auth")) {
          toast.error("Your session expired. Please sign in again.");
          onClose();
          navigate("/auth");
          return;
        }
        throw error;
      }


      const plan = data?.tripPlan;
      if (plan?.rawContent) {
        setTripPlan(plan.rawContent);
      } else if (plan?.itinerary) {
        // Format structured response
        let md = `## ${plan.summary || "Your Trip Plan"}\n\n`;
        if (plan.highlights) {
          md += `### ✨ Highlights\n${plan.highlights.map((h: string) => `- ${h}`).join("\n")}\n\n`;
        }
        if (plan.itinerary) {
          md += `### 📅 Day-wise Itinerary\n\n`;
          plan.itinerary.forEach((day: any) => {
            md += `**Day ${day.day}: ${day.title}**\n`;
            md += `- 🌅 Morning: ${day.morning}\n`;
            md += `- ☀️ Afternoon: ${day.afternoon}\n`;
            md += `- 🌙 Evening: ${day.evening}\n\n`;
          });
        }
        if (plan.tips) {
          md += `### 💡 Tips\n${plan.tips.map((t: string) => `- ${t}`).join("\n")}\n\n`;
        }
        if (plan.budget) {
          md += `### 💰 Budget\n- Total: ${plan.budget.total}\n`;
        }
        setTripPlan(md);
      } else {
        setTripPlan("Trip plan generated but format was unexpected. Please try again.");
      }

      toast.success("Trip plan generated!");
    } catch (err) {
      console.error("Trip plan error:", err);
      toast.error("Failed to generate trip plan. Please try again.");
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg text-foreground">Trip Cart</h2>
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
                  {count}
                </span>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Your trip cart is empty</p>
                  <p className="text-xs text-muted-foreground mt-1">Search for a state and add places</p>
                </div>
              ) : (
                items.map((place) => (
                  <motion.div
                    key={place.id}
                    layout
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  >
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">{place.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {place.state}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(place.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}

              {/* Map View */}
              {items.length > 0 && (
                <div className="mt-2">
                  <TripMap places={items} />
                </div>
              )}

              {/* Trip Plan Result */}
              {tripPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20"
                >
                  <h3 className="font-bold text-foreground flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-accent" />
                    AI Trip Plan
                  </h3>
                  <div className="prose prose-sm max-w-none text-foreground">
                    <ReactMarkdown>{tripPlan}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Actions */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border space-y-2">
                <Button
                  onClick={generateTripPlan}
                  disabled={isPlanning}
                  className="w-full gap-2 btn-gradient"
                >
                  {isPlanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Planning...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Plan My Trip
                    </>
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={clearCart} className="w-full text-muted-foreground">
                  Clear Cart
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TripCartPanel;
