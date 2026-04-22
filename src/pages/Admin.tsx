/**
 * Admin Page
 * Two tabs:
 *   1. Tours — create/edit/delete tours and assign multiple guides per tour.
 *   2. Guides — manage the standalone guide directory (legacy).
 * Access controlled via the `user_roles` table.
 */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Plus, Trash2, Edit, X, ShieldAlert, Users, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ---------- Types ----------
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
  tour_id: string | null;
}

const emptyGuide = {
  name: "",
  photo_url: "",
  region: "",
  languages: "",
  experience_years: 0,
  specialties: "",
  phone: "",
  email: "",
  bio: "",
  price_per_day: 0,
  rating: 0,
  tour_id: "" as string,
};

const emptyTour = {
  name: "",
  description: "",
  location: "",
  image_url: "",
  latitude: "" as string,
  longitude: "" as string,
};

const Admin = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { hasRole, isLoading: roleLoading } = useRole("admin");

  // Tours state
  const [tours, setTours] = useState<Tour[]>([]);
  const [toursLoading, setToursLoading] = useState(true);
  const [tourForm, setTourForm] = useState(emptyTour);
  const [showTourForm, setShowTourForm] = useState(false);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [savingTour, setSavingTour] = useState(false);

  // Tour-guide management
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [tourGuides, setTourGuides] = useState<Guide[]>([]);
  const [tourGuidesLoading, setTourGuidesLoading] = useState(false);
  const [guideForm, setGuideForm] = useState(emptyGuide);
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [savingGuide, setSavingGuide] = useState(false);

  // Standalone guides
  const [allGuides, setAllGuides] = useState<Guide[]>([]);
  const [guidesLoading, setGuidesLoading] = useState(true);

  // ---------- Fetchers ----------
  const fetchTours = async () => {
    setToursLoading(true);
    const { data } = await supabase.from("tours").select("*").order("created_at", { ascending: false });
    if (data) setTours(data as Tour[]);
    setToursLoading(false);
  };

  const fetchTourGuides = async (tourId: string) => {
    setTourGuidesLoading(true);
    const { data } = await supabase
      .from("guides")
      .select("*")
      .eq("tour_id", tourId)
      .order("created_at", { ascending: false });
    setTourGuides((data as Guide[]) || []);
    setTourGuidesLoading(false);
  };

  const fetchAllGuides = async () => {
    setGuidesLoading(true);
    const { data } = await supabase.from("guides").select("*").order("created_at", { ascending: false });
    if (data) setAllGuides(data as Guide[]);
    setGuidesLoading(false);
  };

  useEffect(() => {
    if (hasRole) {
      fetchTours();
      fetchAllGuides();
    }
  }, [hasRole]);

  useEffect(() => {
    if (selectedTourId) fetchTourGuides(selectedTourId);
    else setTourGuides([]);
  }, [selectedTourId]);

  // ---------- Auth gate ----------
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!hasRole) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 text-center">
          <ShieldAlert className="w-16 h-16 mx-auto text-destructive mb-4" />
          <h1 className="font-display text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            You don't have admin privileges. Sign in as an admin from the auth page.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // ---------- Tour handlers ----------
  const resetTourForm = () => {
    setTourForm(emptyTour);
    setEditingTourId(null);
    setShowTourForm(false);
  };

  const startEditTour = (t: Tour) => {
    setTourForm({
      name: t.name,
      description: t.description,
      location: t.location || "",
      image_url: t.image_url || "",
      latitude: t.latitude !== null ? String(t.latitude) : "",
      longitude: t.longitude !== null ? String(t.longitude) : "",
    });
    setEditingTourId(t.id);
    setShowTourForm(true);
  };

  const submitTour = async () => {
    if (!tourForm.name.trim()) {
      toast.error("Tour name is required");
      return;
    }
    setSavingTour(true);
    const payload = {
      name: tourForm.name.trim(),
      description: tourForm.description.trim(),
      location: tourForm.location.trim() || null,
      image_url: tourForm.image_url.trim() || null,
      latitude: tourForm.latitude ? Number(tourForm.latitude) : null,
      longitude: tourForm.longitude ? Number(tourForm.longitude) : null,
      created_by: user.id,
    };
    const { error } = editingTourId
      ? await supabase.from("tours").update(payload).eq("id", editingTourId)
      : await supabase.from("tours").insert(payload);
    if (error) toast.error(error.message);
    else {
      toast.success(editingTourId ? "Tour updated" : "Tour created");
      resetTourForm();
      fetchTours();
    }
    setSavingTour(false);
  };

  const deleteTour = async (id: string) => {
    if (!confirm("Delete this tour? Its guides will be unlinked.")) return;
    const { error } = await supabase.from("tours").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Tour deleted");
      if (selectedTourId === id) setSelectedTourId(null);
      fetchTours();
      fetchAllGuides();
    }
  };

  // ---------- Guide handlers ----------
  const resetGuideForm = () => {
    setGuideForm(emptyGuide);
    setEditingGuideId(null);
    setShowGuideForm(false);
  };

  const startEditGuide = (g: Guide) => {
    setGuideForm({
      name: g.name,
      photo_url: g.photo_url || "",
      region: g.region,
      languages: g.languages.join(", "),
      experience_years: g.experience_years,
      specialties: g.specialties.join(", "),
      phone: g.phone || "",
      email: g.email || "",
      bio: g.bio || "",
      price_per_day: Number(g.price_per_day),
      rating: Number(g.rating || 0),
      tour_id: g.tour_id || "",
    });
    setEditingGuideId(g.id);
    setShowGuideForm(true);
  };

  const submitGuide = async (forceTourId?: string) => {
    if (!guideForm.name.trim()) {
      toast.error("Guide name is required");
      return;
    }
    const tourId = forceTourId ?? guideForm.tour_id ?? null;
    setSavingGuide(true);
    const payload = {
      name: guideForm.name.trim(),
      photo_url: guideForm.photo_url.trim() || null,
      region: guideForm.region.trim() || "—",
      languages: guideForm.languages.split(",").map(s => s.trim()).filter(Boolean),
      experience_years: Number(guideForm.experience_years) || 0,
      specialties: guideForm.specialties.split(",").map(s => s.trim()).filter(Boolean),
      phone: guideForm.phone.trim() || null,
      email: guideForm.email.trim() || null,
      bio: guideForm.bio.trim() || null,
      price_per_day: Number(guideForm.price_per_day) || 0,
      rating: Number(guideForm.rating) || 0,
      tour_id: tourId || null,
      created_by: user.id,
    };
    const { error } = editingGuideId
      ? await supabase.from("guides").update(payload).eq("id", editingGuideId)
      : await supabase.from("guides").insert(payload);
    if (error) toast.error(error.message);
    else {
      toast.success(editingGuideId ? "Guide updated" : "Guide added");
      resetGuideForm();
      if (selectedTourId) fetchTourGuides(selectedTourId);
      fetchAllGuides();
    }
    setSavingGuide(false);
  };

  const deleteGuide = async (id: string) => {
    if (!confirm("Delete this guide?")) return;
    const { error } = await supabase.from("guides").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Guide deleted");
      if (selectedTourId) fetchTourGuides(selectedTourId);
      fetchAllGuides();
    }
  };

  // ---------- UI helpers ----------
  const guideFields = (showTourSelect: boolean) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Name *</Label>
        <Input value={guideForm.name} onChange={e => setGuideForm({ ...guideForm, name: e.target.value })} />
      </div>
      <div>
        <Label>Phone (optional)</Label>
        <Input value={guideForm.phone} onChange={e => setGuideForm({ ...guideForm, phone: e.target.value })} />
      </div>
      <div className="md:col-span-2">
        <Label>Photo URL (optional)</Label>
        <Input placeholder="https://..." value={guideForm.photo_url} onChange={e => setGuideForm({ ...guideForm, photo_url: e.target.value })} />
      </div>
      {showTourSelect && (
        <div className="md:col-span-2">
          <Label>Assign to tour</Label>
          <select
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={guideForm.tour_id}
            onChange={e => setGuideForm({ ...guideForm, tour_id: e.target.value })}
          >
            <option value="">— No tour —</option>
            {tours.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <Label>Region</Label>
        <Input value={guideForm.region} onChange={e => setGuideForm({ ...guideForm, region: e.target.value })} />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={guideForm.email} onChange={e => setGuideForm({ ...guideForm, email: e.target.value })} />
      </div>
      <div>
        <Label>Languages (comma separated)</Label>
        <Input value={guideForm.languages} onChange={e => setGuideForm({ ...guideForm, languages: e.target.value })} />
      </div>
      <div>
        <Label>Specialties (comma separated)</Label>
        <Input value={guideForm.specialties} onChange={e => setGuideForm({ ...guideForm, specialties: e.target.value })} />
      </div>
      <div>
        <Label>Experience (years)</Label>
        <Input type="number" min="0" value={guideForm.experience_years} onChange={e => setGuideForm({ ...guideForm, experience_years: Number(e.target.value) })} />
      </div>
      <div>
        <Label>Price per day (₹)</Label>
        <Input type="number" min="0" value={guideForm.price_per_day} onChange={e => setGuideForm({ ...guideForm, price_per_day: Number(e.target.value) })} />
      </div>
      <div className="md:col-span-2">
        <Label>Bio</Label>
        <Textarea rows={3} value={guideForm.bio} onChange={e => setGuideForm({ ...guideForm, bio: e.target.value })} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage tours and their guides</p>
        </div>

        <Tabs defaultValue="tours">
          <TabsList className="mb-6">
            <TabsTrigger value="tours" className="gap-2"><Compass className="w-4 h-4" /> Tours</TabsTrigger>
            <TabsTrigger value="guides" className="gap-2"><Users className="w-4 h-4" /> All Guides</TabsTrigger>
          </TabsList>

          {/* ------------- TOURS TAB ------------- */}
          <TabsContent value="tours" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-xl font-bold">Tours</h2>
              <Button onClick={() => (showTourForm ? resetTourForm() : setShowTourForm(true))} className="gap-2">
                {showTourForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showTourForm ? "Cancel" : "New Tour"}
              </Button>
            </div>

            {showTourForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-semibold">{editingTourId ? "Edit Tour" : "Create Tour"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Tour name *</Label>
                        <Input value={tourForm.name} onChange={e => setTourForm({ ...tourForm, name: e.target.value })} />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea rows={4} value={tourForm.description} onChange={e => setTourForm({ ...tourForm, description: e.target.value })} />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input placeholder="e.g. Jaipur, Rajasthan" value={tourForm.location} onChange={e => setTourForm({ ...tourForm, location: e.target.value })} />
                      </div>
                      <div>
                        <Label>Cover image URL</Label>
                        <Input placeholder="https://..." value={tourForm.image_url} onChange={e => setTourForm({ ...tourForm, image_url: e.target.value })} />
                      </div>
                      <div>
                        <Label>Latitude (optional, for map)</Label>
                        <Input type="number" step="0.0001" value={tourForm.latitude} onChange={e => setTourForm({ ...tourForm, latitude: e.target.value })} />
                      </div>
                      <div>
                        <Label>Longitude (optional, for map)</Label>
                        <Input type="number" step="0.0001" value={tourForm.longitude} onChange={e => setTourForm({ ...tourForm, longitude: e.target.value })} />
                      </div>
                    </div>
                    <Button onClick={submitTour} disabled={savingTour} className="gap-2">
                      {savingTour && <Loader2 className="w-4 h-4 animate-spin" />}
                      {editingTourId ? "Update Tour" : "Create Tour"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {toursLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : tours.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tours yet. Create your first tour above.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tours.map(t => (
                  <Card
                    key={t.id}
                    className={`cursor-pointer transition-all ${selectedTourId === t.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                    onClick={() => setSelectedTourId(t.id === selectedTourId ? null : t.id)}
                  >
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        {t.image_url ? (
                          <img src={t.image_url} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Compass className="w-6 h-6 text-primary/40" /></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{t.name}</h3>
                        {t.location && <p className="text-xs text-muted-foreground truncate">{t.location}</p>}
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{t.description}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); startEditTour(t); }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); deleteTour(t.id); }}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Selected tour → manage its guides */}
            {selectedTourId && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-lg font-bold">
                    Guides for: <span className="text-primary">{tours.find(t => t.id === selectedTourId)?.name}</span>
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (showGuideForm) resetGuideForm();
                      else { setGuideForm({ ...emptyGuide, tour_id: selectedTourId }); setShowGuideForm(true); }
                    }}
                    className="gap-2"
                  >
                    {showGuideForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showGuideForm ? "Cancel" : "Add Guide"}
                  </Button>
                </div>

                {showGuideForm && (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <h4 className="font-semibold">{editingGuideId ? "Edit Guide" : "New Guide"}</h4>
                      {guideFields(false)}
                      <Button onClick={() => submitGuide(selectedTourId)} disabled={savingGuide} className="gap-2">
                        {savingGuide && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingGuideId ? "Update Guide" : "Add Guide"}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {tourGuidesLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
                ) : tourGuides.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No guides assigned to this tour yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tourGuides.map(g => (
                      <Card key={g.id}>
                        <CardContent className="p-4 flex gap-3 items-center">
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-muted shrink-0">
                            {g.photo_url ? (
                              <img src={g.photo_url} alt={g.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary/50">{g.name[0]}</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{g.name}</p>
                            {g.phone && <p className="text-xs text-muted-foreground truncate">{g.phone}</p>}
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => startEditGuide(g)}><Edit className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteGuide(g.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </TabsContent>

          {/* ------------- GUIDES TAB ------------- */}
          <TabsContent value="guides" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-xl font-bold">All Guides</h2>
              <Button
                onClick={() => {
                  if (showGuideForm) resetGuideForm();
                  else { setGuideForm(emptyGuide); setShowGuideForm(true); }
                }}
                className="gap-2"
              >
                {showGuideForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showGuideForm ? "Cancel" : "Add Guide"}
              </Button>
            </div>

            {showGuideForm && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">{editingGuideId ? "Edit Guide" : "New Guide"}</h3>
                  {guideFields(true)}
                  <Button onClick={() => submitGuide()} disabled={savingGuide} className="gap-2">
                    {savingGuide && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingGuideId ? "Update Guide" : "Add Guide"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {guidesLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : allGuides.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No guides yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allGuides.map(g => {
                  const tour = tours.find(t => t.id === g.tour_id);
                  return (
                    <Card key={g.id}>
                      <CardContent className="p-4 flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                          {g.photo_url ? (
                            <img src={g.photo_url} alt={g.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/40">{g.name[0]}</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{g.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{g.region} • {g.experience_years}y</p>
                          {tour && <p className="text-xs text-primary truncate">Tour: {tour.name}</p>}
                          {g.phone && <p className="text-xs text-muted-foreground truncate">{g.phone}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="icon" variant="ghost" onClick={() => startEditGuide(g)}><Edit className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => deleteGuide(g.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
