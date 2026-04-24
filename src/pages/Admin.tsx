/**
 * Admin Page
 * Manage the guide directory.
 * Access controlled via the `user_roles` table.
 */
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2, Plus, Trash2, Edit, X, ShieldAlert } from "lucide-react";
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
};

const Admin = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { hasRole, isLoading: roleLoading } = useRole("admin");

  const [allGuides, setAllGuides] = useState<Guide[]>([]);
  const [guidesLoading, setGuidesLoading] = useState(true);
  const [guideForm, setGuideForm] = useState(emptyGuide);
  const [showGuideForm, setShowGuideForm] = useState(false);
  const [editingGuideId, setEditingGuideId] = useState<string | null>(null);
  const [savingGuide, setSavingGuide] = useState(false);

  const fetchAllGuides = async () => {
    setGuidesLoading(true);
    const { data } = await supabase.from("guides").select("*").order("created_at", { ascending: false });
    if (data) setAllGuides(data as Guide[]);
    setGuidesLoading(false);
  };

  useEffect(() => {
    if (hasRole) fetchAllGuides();
  }, [hasRole]);

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
    });
    setEditingGuideId(g.id);
    setShowGuideForm(true);
  };

  const submitGuide = async () => {
    if (!guideForm.name.trim()) {
      toast.error("Guide name is required");
      return;
    }
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
      created_by: user.id,
    };
    const { error } = editingGuideId
      ? await supabase.from("guides").update(payload).eq("id", editingGuideId)
      : await supabase.from("guides").insert(payload);
    if (error) toast.error(error.message);
    else {
      toast.success(editingGuideId ? "Guide updated" : "Guide added");
      resetGuideForm();
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
      fetchAllGuides();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage tour guides</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-xl font-bold">All Guides</h2>
            <Button
              onClick={() => (showGuideForm ? resetGuideForm() : setShowGuideForm(true))}
              className="gap-2"
            >
              {showGuideForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showGuideForm ? "Cancel" : "Add Guide"}
            </Button>
          </div>

          {showGuideForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">{editingGuideId ? "Edit Guide" : "New Guide"}</h3>
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
                  <Button onClick={submitGuide} disabled={savingGuide} className="gap-2">
                    {savingGuide && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingGuideId ? "Update Guide" : "Add Guide"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {guidesLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : allGuides.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No guides yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allGuides.map(g => (
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
                      {g.phone && <p className="text-xs text-muted-foreground truncate">{g.phone}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="icon" variant="ghost" onClick={() => startEditGuide(g)}><Edit className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteGuide(g.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
