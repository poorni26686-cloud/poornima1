/**
 * Admin Page
 * Allows admins to manage tour guides (add, edit, delete).
 * Access is controlled via the `user_roles` table.
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

const emptyForm = {
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
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchGuides = async () => {
    const { data } = await supabase.from("guides").select("*").order("created_at", { ascending: false });
    if (data) setGuides(data as Guide[]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (hasRole) fetchGuides();
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
            You don't have admin privileges. Ask an existing admin to grant you the 'admin' role in the user_roles table.
          </p>
          <p className="text-xs text-muted-foreground mt-4">Your user ID: <code className="bg-muted px-2 py-1 rounded">{user.id}</code></p>
        </div>
        <Footer />
      </div>
    );
  }

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (g: Guide) => {
    setForm({
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
    setEditingId(g.id);
    setShowForm(true);
  };

  const submit = async () => {
    if (!form.name.trim() || !form.region.trim()) {
      toast.error("Name and region are required");
      return;
    }
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      photo_url: form.photo_url.trim() || null,
      region: form.region.trim(),
      languages: form.languages.split(",").map(s => s.trim()).filter(Boolean),
      experience_years: Number(form.experience_years) || 0,
      specialties: form.specialties.split(",").map(s => s.trim()).filter(Boolean),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      bio: form.bio.trim() || null,
      price_per_day: Number(form.price_per_day) || 0,
      rating: Number(form.rating) || 0,
      created_by: user.id,
    };

    const { error } = editingId
      ? await supabase.from("guides").update(payload).eq("id", editingId)
      : await supabase.from("guides").insert(payload);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(editingId ? "Guide updated" : "Guide added");
      resetForm();
      fetchGuides();
    }
    setSubmitting(false);
  };

  const deleteGuide = async (id: string) => {
    if (!confirm("Delete this guide?")) return;
    const { error } = await supabase.from("guides").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Guide deleted");
      fetchGuides();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage tour guides</p>
          </div>
          <Button onClick={() => (showForm ? resetForm() : setShowForm(true))} className="gap-2">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Add Guide"}
          </Button>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-display text-xl font-bold">{editingId ? "Edit Guide" : "New Guide"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name *</Label>
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Region *</Label>
                    <Input placeholder="e.g. Goa, Rajasthan" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Photo URL</Label>
                    <Input placeholder="https://..." value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} />
                  </div>
                  <div>
                    <Label>Languages (comma separated)</Label>
                    <Input placeholder="English, Hindi, Tamil" value={form.languages} onChange={e => setForm({ ...form, languages: e.target.value })} />
                  </div>
                  <div>
                    <Label>Specialties (comma separated)</Label>
                    <Input placeholder="Heritage, Trekking, Food" value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })} />
                  </div>
                  <div>
                    <Label>Experience (years)</Label>
                    <Input type="number" min="0" value={form.experience_years} onChange={e => setForm({ ...form, experience_years: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Price per day (₹)</Label>
                    <Input type="number" min="0" value={form.price_per_day} onChange={e => setForm({ ...form, price_per_day: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Rating (0-5)</Label>
                    <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Bio</Label>
                    <Textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
                  </div>
                </div>
                <Button onClick={submit} disabled={submitting} className="gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Update Guide" : "Add Guide"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : guides.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No guides yet. Add your first guide above.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map(g => (
              <Card key={g.id}>
                <CardContent className="p-4 flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    {g.photo_url ? (
                      <img src={g.photo_url} alt={g.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/40">
                        {g.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{g.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{g.region} • {g.experience_years}y</p>
                    <p className="text-xs text-muted-foreground truncate">{g.languages.join(", ")}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(g)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteGuide(g.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
