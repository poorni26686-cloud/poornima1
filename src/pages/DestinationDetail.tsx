/**
 * Destination Detail Page
 * Shows full destination info with reviews, tips, and nearby attractions.
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Clock, DollarSign, Heart, ArrowLeft, Send, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/chat/ChatBot";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
  profile_name?: string;
}

const DestinationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [nearby, setNearby] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setIsLoading(true);
      // Fetch destination
      const { data: dest } = await supabase
        .from("destinations")
        .select("*")
        .eq("id", id)
        .single();

      if (dest) {
        setDestination({
          ...dest,
          rating: Number(dest.rating),
          price_per_person: Number(dest.price_per_person),
          is_featured: dest.is_featured,
        });

        // Fetch nearby (same country, exclude current)
        const { data: nearbyData } = await supabase
          .from("destinations")
          .select("*")
          .eq("country", dest.country)
          .neq("id", id)
          .limit(3);

        if (nearbyData) {
          setNearby(nearbyData.map(d => ({ ...d, rating: Number(d.rating), price_per_person: Number(d.price_per_person), is_featured: d.is_featured })));
        }
      }

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from("destination_reviews")
        .select("*")
        .eq("destination_id", id)
        .order("created_at", { ascending: false });

      if (reviewsData) {
        // Fetch profile names for reviewers
        const userIds = [...new Set(reviewsData.map(r => r.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds);

        const profileMap = new Map(profiles?.map(p => [p.user_id, p.full_name]) || []);
        setReviews(reviewsData.map(r => ({
          ...r,
          profile_name: profileMap.get(r.user_id) || "Traveler",
        })));
      }

      // Check favorite status
      if (user) {
        const { data: fav } = await supabase
          .from("favorite_destinations")
          .select("id")
          .eq("user_id", user.id)
          .eq("destination_id", id)
          .maybeSingle();
        setIsFavorite(!!fav);
      }

      setIsLoading(false);
    };
    fetchData();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user || !id) {
      toast.error("Please sign in to save favorites");
      return;
    }
    if (isFavorite) {
      await supabase.from("favorite_destinations").delete().eq("user_id", user.id).eq("destination_id", id);
      setIsFavorite(false);
      toast.success("Removed from favorites");
    } else {
      await supabase.from("favorite_destinations").insert({ user_id: user.id, destination_id: id });
      setIsFavorite(true);
      toast.success("Added to favorites");
    }
  };

  const submitReview = async () => {
    if (!user) { toast.error("Please sign in to leave a review"); return; }
    if (!reviewTitle.trim() || !reviewComment.trim()) { toast.error("Please fill in all fields"); return; }
    setIsSubmitting(true);
    const { error } = await supabase.from("destination_reviews").insert({
      user_id: user.id,
      destination_id: id!,
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
    });
    if (error) {
      if (error.message.includes("duplicate")) toast.error("You've already reviewed this destination");
      else toast.error("Failed to submit review");
    } else {
      toast.success("Review submitted!");
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      // Refresh reviews
      const { data } = await supabase.from("destination_reviews").select("*").eq("destination_id", id!).order("created_at", { ascending: false });
      if (data) setReviews(data.map(r => ({ ...r, profile_name: r.user_id === user.id ? "You" : "Traveler" })));
    }
    setIsSubmitting(false);
  };

  const deleteReview = async (reviewId: string) => {
    const { error } = await supabase.from("destination_reviews").delete().eq("id", reviewId);
    if (!error) {
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      toast.success("Review deleted");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-muted-foreground mb-4">Destination not found</p>
          <Link to="/destinations"><Button>Browse Destinations</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Image */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[50vh] md:h-[60vh] overflow-hidden"
      >
        <img src={destination.image_url} alt={destination.name} className="w-full h-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <Link to="/destinations" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Destinations
            </Link>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-display text-4xl md:text-6xl font-bold text-white mb-2"
            >
              {destination.name}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {destination.location}, {destination.country}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-current text-accent" /> {destination.rating.toFixed(1)} ({destination.reviews_count} reviews)</span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm">{destination.category}</span>
            </div>
          </div>
        </div>
        {/* Favorite button */}
        <button onClick={toggleFavorite} className={cn(
          "absolute top-24 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all",
          isFavorite ? "bg-primary text-primary-foreground" : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
        )}>
          <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
        </button>
      </motion.section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Description */}
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">About this Destination</h2>
              <p className="text-muted-foreground leading-relaxed">{destination.description}</p>
            </div>

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {destination.highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm text-foreground">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Reviews ({reviews.length})
              </h2>

              {/* Review Form */}
              {user && (
                <div className="mb-8 p-4 rounded-xl bg-muted space-y-3">
                  <h3 className="font-semibold text-foreground">Write a Review</h3>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setReviewRating(star)}>
                        <Star className={cn("w-6 h-6 transition-colors", star <= reviewRating ? "text-accent fill-current" : "text-muted-foreground")} />
                      </button>
                    ))}
                  </div>
                  <Input placeholder="Review title" value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} />
                  <Textarea placeholder="Share your experience..." value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={3} />
                  <Button onClick={submitReview} disabled={isSubmitting} className="btn-gradient gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Review
                  </Button>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to share your experience!</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-xl border border-border"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">{(review.profile_name || "T")[0].toUpperCase()}</span>
                            </div>
                            <span className="font-medium text-foreground text-sm">{review.profile_name}</span>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={cn("w-3.5 h-3.5", s <= review.rating ? "text-accent fill-current" : "text-muted-foreground")} />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                          {user?.id === review.user_id && (
                            <button onClick={() => deleteReview(review.id)} className="text-destructive hover:text-destructive/80">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <h4 className="font-semibold text-foreground text-sm mb-1">{review.title}</h4>
                      <p className="text-muted-foreground text-sm">{review.comment}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Info */}
            <div className="bg-card rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">From</span>
                <span className="text-3xl font-bold text-primary">${destination.price_per_person.toFixed(0)}<span className="text-sm text-muted-foreground font-normal">/person</span></span>
              </div>
              {destination.best_time_to_visit && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                  <Clock className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Best Time to Visit</p>
                    <p className="text-sm font-medium text-foreground">{destination.best_time_to_visit}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                <DollarSign className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Budget Level</p>
                  <p className="text-sm font-medium text-foreground">
                    {destination.price_per_person < 500 ? "Budget" : destination.price_per_person < 1500 ? "Mid-Range" : "Premium"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted">
                <MapPin className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">Region</p>
                  <p className="text-sm font-medium text-foreground">{destination.continent}</p>
                </div>
              </div>
              <Link to="/planner">
                <Button className="w-full btn-gradient mt-2">Plan a Trip Here</Button>
              </Link>
            </div>

            {/* Travel Tips */}
            <div className="bg-card rounded-2xl p-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-foreground mb-3">Travel Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Book flights 2-3 months in advance for better deals</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Check visa requirements for {destination.country}</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Consider travel insurance for international trips</li>
                <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span>Learn basic local phrases for a better experience</li>
              </ul>
            </div>

            {/* Nearby Attractions */}
            {nearby.length > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">Nearby Destinations</h3>
                <div className="space-y-3">
                  {nearby.map(n => (
                    <Link key={n.id} to={`/destination/${n.id}`} className="flex gap-3 group">
                      <img src={n.image_url} alt={n.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{n.name}</p>
                        <p className="text-xs text-muted-foreground">{n.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-accent fill-current" />
                          <span className="text-xs text-foreground">{n.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default DestinationDetail;
