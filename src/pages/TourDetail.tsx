/**
 * Tour Detail Page
 * Shows a tour's info, optional map, and the list of available guides
 * (fetched from the `guides` table joined by `tour_id`).
 */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Loader2, ArrowLeft, Phone, Users } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Fix default marker icons (required when bundling Leaflet via Vite)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Tour {
  id: string;
  name: string;
  description: string;
  location: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface Guide {
  id: string;
  name: string;
  phone: string | null;
  photo_url: string | null;
}

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [tourLoading, setTourLoading] = useState(true);
  const [guidesLoading, setGuidesLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data } = await supabase
        .from("tours")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      setTour(data as Tour | null);
      setTourLoading(false);
    })();

    // Fetch guides — emulates GET /tours/:id/guides
    (async () => {
      setGuidesLoading(true);
      const { data } = await supabase
        .from("guides")
        .select("id,name,phone,photo_url")
        .eq("tour_id", id)
        .order("created_at", { ascending: false });
      setGuides((data as Guide[]) || []);
      setGuidesLoading(false);
    })();
  }, [id]);

  if (tourLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-2">Tour not found</h1>
          <Link to="/tours" className="text-primary hover:underline">← Back to tours</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasMap = tour.latitude !== null && tour.longitude !== null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative pt-28 pb-12"
      >
        <div className="container mx-auto px-4">
          <Link to="/tours" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" /> All tours
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              {tour.image_url ? (
                <img src={tour.image_url} alt={tour.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
              )}
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground mb-3">{tour.name}</h1>
              {tour.location && (
                <div className="flex items-center gap-1 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" /> {tour.location}
                </div>
              )}
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{tour.description}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Map */}
      {hasMap && (
        <section className="container mx-auto px-4 pb-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Tour location</h2>
          <div className="rounded-2xl overflow-hidden border border-border h-[360px]">
            <MapContainer
              center={[Number(tour.latitude), Number(tour.longitude)]}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[Number(tour.latitude), Number(tour.longitude)]}
                icon={markerIcon}
              >
                <Popup>{tour.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>
      )}

      {/* Guides */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="container mx-auto px-4 pb-20"
      >
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="font-display text-2xl font-bold text-foreground">Available Tour Guides</h2>
        </div>

        {guidesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : guides.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground">No guides available for this tour.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {guides.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-muted shrink-0">
                      {g.photo_url ? (
                        <img src={g.photo_url} alt={g.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-3xl font-bold text-primary/50">
                          {g.name[0]}
                        </div>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{g.name}</h3>
                    {g.phone ? (
                      <Button asChild size="sm" className="gap-2 w-full">
                        <a href={`tel:${g.phone}`}>
                          <Phone className="w-4 h-4" /> Call {g.phone}
                        </a>
                      </Button>
                    ) : (
                      <p className="text-xs text-muted-foreground">Phone not available</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      <Footer />
    </div>
  );
};

export default TourDetail;
