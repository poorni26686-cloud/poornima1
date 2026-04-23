/**
 * Tour Guides Page
 * Public listing of all guides added by admins.
 */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Languages, Award, Phone, Mail, Star, Loader2, IndianRupee, CalendarCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/chat/ChatBot";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookGuideDialog from "@/components/guides/BookGuideDialog";

interface Guide {
  id: string;
  name: string;
  photo_url: string | null;
  region: string;
  languages: string[];
  experience_years: number;
  specialties: string[];
  phone: string | null;
  email: string | null;
  bio: string | null;
  price_per_day: number;
  rating: number | null;
}

const Guides = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookingGuide, setBookingGuide] = useState<Guide | null>(null);

  useEffect(() => {
    const fetchGuides = async () => {
      const { data } = await supabase.from("guides").select("*").order("created_at", { ascending: false });
      if (data) setGuides(data as Guide[]);
      setIsLoading(false);
    };
    fetchGuides();
  }, []);

  const filtered = guides.filter(
    g =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.region.toLowerCase().includes(search.toLowerCase()) ||
      g.languages.some(l => l.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-12 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Meet Our Tour Guides
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Connect with experienced local guides who know every hidden gem.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, region or language..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            {guides.length === 0 ? "No guides have been added yet. Check back soon!" : "No guides match your search."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="aspect-[4/3] bg-muted relative">
                    {g.photo_url ? (
                      <img src={g.photo_url} alt={g.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                        <span className="text-5xl font-bold text-primary/40">{g.name[0]}</span>
                      </div>
                    )}
                    {g.rating && g.rating > 0 && (
                      <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-accent fill-current" />
                        <span className="text-xs font-semibold">{Number(g.rating).toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-foreground">{g.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {g.region}
                      </div>
                    </div>

                    {g.bio && <p className="text-sm text-muted-foreground line-clamp-2">{g.bio}</p>}

                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{g.experience_years} yrs experience</span>
                    </div>

                    {g.languages.length > 0 && (
                      <div className="flex items-start gap-2 text-sm">
                        <Languages className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <span className="text-foreground">{g.languages.join(", ")}</span>
                      </div>
                    )}

                    {g.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {g.specialties.map((s, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="pt-3 border-t border-border space-y-2">
                      {g.phone && (
                        <a href={`tel:${g.phone}`} className="flex items-center gap-2 text-sm text-foreground hover:text-primary">
                          <Phone className="w-3.5 h-3.5" /> {g.phone}
                        </a>
                      )}
                      {g.email && (
                        <a href={`mailto:${g.email}`} className="flex items-center gap-2 text-sm text-foreground hover:text-primary">
                          <Mail className="w-3.5 h-3.5" /> {g.email}
                        </a>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-muted-foreground">Per day</span>
                        <span className="flex items-center font-bold text-primary">
                          <IndianRupee className="w-4 h-4" />
                          {Number(g.price_per_day).toFixed(0)}
                        </span>
                      </div>
                      <Button className="w-full mt-2" size="sm" onClick={() => setBookingGuide(g)}>
                        <CalendarCheck className="w-4 h-4" /> Book Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default Guides;
