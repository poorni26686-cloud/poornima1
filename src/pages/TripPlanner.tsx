import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Wallet,
  Heart,
  Users,
  Sun,
  Gauge,
  Sparkles,
  Loader2,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/chat/ChatBot";
import TripResults from "@/components/planner/TripResults";

const interests = [
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "temples", label: "Temples", icon: "🛕" },
  { id: "beaches", label: "Beaches", icon: "🏖️" },
  { id: "history", label: "History", icon: "🏛️" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "adventure", label: "Adventure", icon: "🧗" },
  { id: "food", label: "Food & Dining", icon: "🍽️" },
  { id: "nightlife", label: "Nightlife", icon: "🌙" },
  { id: "art", label: "Art & Culture", icon: "🎨" },
  { id: "wildlife", label: "Wildlife", icon: "🦁" },
];

const travelTypes = [
  { id: "solo", label: "Solo", icon: "🧑" },
  { id: "couple", label: "Couple", icon: "💑" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "friends", label: "Friends", icon: "👯" },
];

const budgetRanges = [
  { id: "budget", label: "Budget ($)", description: "Hostels, street food" },
  { id: "moderate", label: "Moderate ($$)", description: "Mid-range hotels, restaurants" },
  { id: "luxury", label: "Luxury ($$$)", description: "Premium experiences" },
];

const paceOptions = [
  { id: "relaxed", label: "Relaxed", description: "2-3 activities per day" },
  { id: "moderate", label: "Moderate", description: "4-5 activities per day" },
  { id: "fast", label: "Fast-paced", description: "Pack in as much as possible" },
];

const seasons = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export interface TripPlan {
  summary?: string;
  highlights?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    morning: string;
    afternoon: string;
    evening: string;
  }>;
  restaurants?: Array<{
    name: string;
    cuisine: string;
    priceRange: string;
    specialty: string;
  }>;
  tips?: string[];
  bestTimes?: Array<{
    place: string;
    bestTime: string;
    reason: string;
  }>;
  safety?: string[];
  budget?: {
    accommodation: string;
    food: string;
    activities: string;
    transport: string;
    total: string;
  };
  rawContent?: string;
}

const TripPlanner = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [formData, setFormData] = useState({
    destination: "",
    days: 5,
    budget: "moderate",
    interests: [] as string[],
    travelType: "couple",
    season: new Date().toLocaleString("default", { month: "long" }),
    pace: "moderate",
  });

  const toggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const handleGenerate = async () => {
    if (!formData.destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }
    if (formData.interests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    setIsGenerating(true);
    setTripPlan(null);

    try {
      // Ensure user is authenticated before invoking the protected edge function
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session) {
        toast.error("Please sign in to generate a trip plan");
        navigate("/auth");
        setIsGenerating(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("generate-trip", {
        body: formData,
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) {
        const msg = (error as any)?.message || "";
        if (msg.includes("401") || msg.toLowerCase().includes("auth")) {
          toast.error("Your session expired. Please sign in again.");
          navigate("/auth");
          return;
        }
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to generate trip plan");
      }

      setTripPlan(data.tripPlan);
      toast.success("Your personalized trip plan is ready!");
    } catch (error) {
      console.error("Error generating trip:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate trip plan";
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered Planning
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Plan Your Perfect Trip
            </h1>
            <p className="text-muted-foreground text-lg">
              Tell us about your dream vacation and let our AI create a
              personalized itinerary just for you
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      {!tripPlan && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-card rounded-3xl shadow-lg p-8 md:p-12 space-y-10">
              {/* Destination */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  Where do you want to go?
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, destination: e.target.value }))
                  }
                  placeholder="e.g., Paris, France or Bali, Indonesia"
                  className="w-full px-6 py-4 rounded-2xl border border-border bg-background text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              {/* Days & Season */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    How many days?
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={formData.days}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, days: parseInt(e.target.value) }))
                      }
                      className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="w-16 text-center text-2xl font-bold text-primary">
                      {formData.days}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                    <Sun className="w-5 h-5 text-primary" />
                    When are you traveling?
                  </label>
                  <div className="relative">
                    <select
                      value={formData.season}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, season: e.target.value }))
                      }
                      className="w-full px-6 py-4 rounded-2xl border border-border bg-background text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                    >
                      {seasons.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                  <Wallet className="w-5 h-5 text-primary" />
                  What's your budget?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {budgetRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setFormData((prev) => ({ ...prev, budget: range.id }))}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left transition-all",
                        formData.budget === range.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="font-semibold text-foreground">{range.label}</div>
                      <div className="text-sm text-muted-foreground">{range.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                  <Heart className="w-5 h-5 text-primary" />
                  What are you interested in?
                </label>
                <div className="flex flex-wrap gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      className={cn(
                        "px-4 py-2 rounded-full border-2 flex items-center gap-2 transition-all",
                        formData.interests.includes(interest.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span>{interest.icon}</span>
                      <span>{interest.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Type */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                  <Users className="w-5 h-5 text-primary" />
                  Who are you traveling with?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {travelTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData((prev) => ({ ...prev, travelType: type.id }))}
                      className={cn(
                        "p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all",
                        formData.travelType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="text-3xl">{type.icon}</span>
                      <span className="font-medium text-foreground">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pace */}
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
                  <Gauge className="w-5 h-5 text-primary" />
                  What's your preferred pace?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paceOptions.map((pace) => (
                    <button
                      key={pace.id}
                      onClick={() => setFormData((prev) => ({ ...prev, pace: pace.id }))}
                      className={cn(
                        "p-4 rounded-2xl border-2 text-left transition-all",
                        formData.pace === pace.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="font-semibold text-foreground">{pace.label}</div>
                      <div className="text-sm text-muted-foreground">{pace.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-6 text-lg font-semibold btn-gradient rounded-2xl"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Crafting your perfect trip...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate My Trip Plan
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {tripPlan && (
        <TripResults 
          tripPlan={tripPlan} 
          destination={formData.destination}
          days={formData.days}
          onReset={() => setTripPlan(null)} 
        />
      )}

      <Footer />
      <ChatBot />
    </div>
  );
};

export default TripPlanner;
