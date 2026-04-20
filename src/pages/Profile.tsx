 /**
  * Profile Page Component
  * 
  * Displays and allows editing of user profile information.
  * Requires authentication to access.
  */
 
 import { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "@/hooks/useAuth";
 import { supabase } from "@/integrations/supabase/client";
 import Navbar from "@/components/layout/Navbar";
 import Footer from "@/components/layout/Footer";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Loader2, Save } from "lucide-react";
import { profileSchema } from "@/lib/validations";
 
 interface ProfileData {
   full_name: string | null;
   phone: string | null;
   avatar_url: string | null;
 }
 
 const Profile = () => {
   const { user, isLoading: authLoading } = useAuth();
   const navigate = useNavigate();
   const { toast } = useToast();
   
   const [profile, setProfile] = useState<ProfileData>({
     full_name: "",
     phone: "",
     avatar_url: "",
   });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ full_name?: string; phone?: string; avatar_url?: string }>({});
 
   // Redirect to auth if not logged in
   useEffect(() => {
     if (!authLoading && !user) {
       navigate("/auth");
     }
   }, [user, authLoading, navigate]);
 
   // Fetch profile data
   useEffect(() => {
     const fetchProfile = async () => {
       if (!user) return;
       
       try {
         const { data, error } = await supabase
           .from("profiles")
           .select("full_name, phone, avatar_url")
           .eq("user_id", user.id)
           .single();
 
         if (error && error.code !== "PGRST116") {
           console.error("Error fetching profile:", error);
           return;
         }
 
         if (data) {
           setProfile({
             full_name: data.full_name || "",
             phone: data.phone || "",
             avatar_url: data.avatar_url || "",
           });
         }
       } catch (error) {
         console.error("Error fetching profile:", error);
       } finally {
         setIsLoading(false);
       }
     };
 
     if (user) {
       fetchProfile();
     }
   }, [user]);
 
  // Handle profile update
  const handleSave = async () => {
    if (!user) return;

    // Validate inputs with zod
    const parsed = profileSchema.safeParse({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      avatar_url: profile.avatar_url ?? "",
    });
    if (!parsed.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of parsed.error.errors) {
        const key = issue.path[0] as keyof typeof errors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast({
        title: "Please fix the errors",
        description: parsed.error.errors[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setErrors({});

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
           full_name: profile.full_name,
           phone: profile.phone,
           avatar_url: profile.avatar_url,
           updated_at: new Date().toISOString(),
         })
         .eq("user_id", user.id);
 
       if (error) throw error;
 
       toast({
         title: "Profile updated",
         description: "Your profile has been saved successfully.",
       });
     } catch (error) {
       console.error("Error updating profile:", error);
       toast({
         title: "Error",
         description: "Failed to update profile. Please try again.",
         variant: "destructive",
       });
     } finally {
       setIsSaving(false);
     }
   };
 
   // Get user initials for avatar fallback
   const getInitials = () => {
     if (profile.full_name) {
       return profile.full_name
         .split(" ")
         .map((n) => n[0])
         .join("")
         .toUpperCase()
         .slice(0, 2);
     }
     return user?.email?.charAt(0).toUpperCase() || "U";
   };
 
   if (authLoading || isLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
   if (!user) {
     return null;
   }
 
   return (
     <div className="min-h-screen flex flex-col bg-background">
       <Navbar />
       
       <main className="flex-1 container mx-auto px-4 py-8">
         <div className="max-w-2xl mx-auto">
           <h1 className="text-3xl font-bold mb-8">My Profile</h1>
           
           <Card>
             <CardHeader>
               <div className="flex items-center gap-4">
                 <Avatar className="h-20 w-20">
                   <AvatarImage src={profile.avatar_url || undefined} />
                   <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                     {getInitials()}
                   </AvatarFallback>
                 </Avatar>
                 <div>
                   <CardTitle>{profile.full_name || "Your Name"}</CardTitle>
                   <CardDescription>{user.email}</CardDescription>
                 </div>
               </div>
             </CardHeader>
             
             <CardContent className="space-y-6">
               {/* Full Name */}
               <div className="space-y-2">
                 <Label htmlFor="full_name" className="flex items-center gap-2">
                   <User className="h-4 w-4" />
                   Full Name
                 </Label>
                  <Input
                    id="full_name"
                    value={profile.full_name || ""}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Enter your full name"
                    maxLength={100}
                    aria-invalid={!!errors.full_name}
                  />
                  {errors.full_name && (
                    <p className="text-xs text-destructive">{errors.full_name}</p>
                  )}
                </div>
 
               {/* Email (read-only) */}
               <div className="space-y-2">
                 <Label htmlFor="email" className="flex items-center gap-2">
                   <Mail className="h-4 w-4" />
                   Email
                 </Label>
                 <Input
                   id="email"
                   value={user.email || ""}
                   disabled
                   className="bg-muted"
                 />
                 <p className="text-xs text-muted-foreground">
                   Email cannot be changed here.
                 </p>
               </div>
 
               {/* Phone */}
               <div className="space-y-2">
                 <Label htmlFor="phone" className="flex items-center gap-2">
                   <Phone className="h-4 w-4" />
                   Phone Number
                 </Label>
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={profile.phone || ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    maxLength={20}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone ? (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Include country code, e.g. +91 98765 43210
                    </p>
                  )}
                </div>
 
               {/* Save Button */}
               <Button 
                 onClick={handleSave} 
                 disabled={isSaving}
                 className="w-full"
               >
                 {isSaving ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Saving...
                   </>
                 ) : (
                   <>
                     <Save className="mr-2 h-4 w-4" />
                     Save Changes
                   </>
                 )}
               </Button>
             </CardContent>
           </Card>
         </div>
       </main>
       
       <Footer />
     </div>
   );
 };
 
 export default Profile;