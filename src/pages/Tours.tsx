/**
 * Tours Page — public list of tours.
 * Click any tour to see its details and assigned guides.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Loader2, ArrowRight, Compass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";

interface Tour {
  id: string;
  name: string;
  description: string;
  location: string | null;
  image_url: string | null;
}

const Tours = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("tours")
        .select("id,name,description,location,image_url")
        .order("created_at", { ascending: false });
      if (data) setTours(data as Tour[]);
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-12 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3"
          >
            Curated Tours
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our tours and meet the guides who'll bring them to life.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20">
            <Compass className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No tours available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/tour/${t.id}`}>
                  <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full group">
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      {t.image_url ? (
                        <img
                          src={t.image_url}
                          alt={t.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                          <Compass className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 space-y-2">
                      <h3 className="font-display text-xl font-bold text-foreground">{t.name}</h3>
                      {t.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {t.location}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                      <div className="flex items-center gap-1 text-sm font-semibold text-primary pt-1">
                        View tour <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Tours;
