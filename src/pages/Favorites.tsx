 /**
  * Favorites Page Component
  * 
  * Displays all destinations saved by the authenticated user.
  * Fetches favorites from favorite_destinations table and joins with destinations.
  * 
  * @author Tourist Guiding System
  * @version 1.0.0
  */
 
 import { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { useAuth } from "@/hooks/useAuth";
 import { supabase } from "@/integrations/supabase/client";
 import Navbar from "@/components/layout/Navbar";
 import Footer from "@/components/layout/Footer";
 import { Button } from "@/components/ui/button";
 import { Heart, MapPin, Star, Loader2, Trash2 } from "lucide-react";
 import { toast } from "sonner";
 import { cn } from "@/lib/utils";
 
 // Type for destination with favorite data
 interface FavoriteDestination {
   id: string;
   destination_id: string;
   destination: {
     id: string;
     name: string;
     location: string;
     country: string;
     image_url: string;
     rating: number;
     reviews_count: number;
     price_per_person: number;
     category: string;
     description: string;
   };
 }
 
 const Favorites = () => {
   const { user, isLoading: authLoading } = useAuth();
   const navigate = useNavigate();
   
   const [favorites, setFavorites] = useState<FavoriteDestination[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [removingId, setRemovingId] = useState<string | null>(null);
 
   // Redirect to auth if not logged in
   useEffect(() => {
     if (!authLoading && !user) {
       navigate("/auth");
     }
   }, [user, authLoading, navigate]);
 
   // Fetch favorite destinations
   useEffect(() => {
     const fetchFavorites = async () => {
       if (!user) return;
       
       try {
         setIsLoading(true);
         
         // Fetch favorites with joined destination data
         const { data, error } = await supabase
           .from("favorite_destinations")
           .select(`
             id,
             destination_id,
             destinations (
               id,
               name,
               location,
               country,
               image_url,
               rating,
               reviews_count,
               price_per_person,
               category,
               description
             )
           `)
           .eq("user_id", user.id);
 
         if (error) {
           console.error("Error fetching favorites:", error);
           toast.error("Failed to load saved destinations");
           return;
         }
 
         // Transform data to match our interface
         const transformedData: FavoriteDestination[] = (data || [])
           .filter(item => item.destinations) // Filter out any null destinations
           .map(item => ({
             id: item.id,
             destination_id: item.destination_id,
             destination: {
               id: item.destinations.id,
               name: item.destinations.name,
               location: item.destinations.location,
               country: item.destinations.country,
               image_url: item.destinations.image_url,
               rating: Number(item.destinations.rating),
               reviews_count: item.destinations.reviews_count,
               price_per_person: Number(item.destinations.price_per_person),
               category: item.destinations.category,
               description: item.destinations.description,
             },
           }));
 
         setFavorites(transformedData);
       } catch (error) {
         console.error("Error fetching favorites:", error);
         toast.error("An unexpected error occurred");
       } finally {
         setIsLoading(false);
       }
     };
 
     if (user) {
       fetchFavorites();
     }
   }, [user]);
 
   /**
    * Remove a destination from favorites
    */
   const removeFavorite = async (favoriteId: string, destinationName: string) => {
     if (!user) return;
     
     setRemovingId(favoriteId);
     
     try {
       const { error } = await supabase
         .from("favorite_destinations")
         .delete()
         .eq("id", favoriteId)
         .eq("user_id", user.id);
 
       if (error) throw error;
 
       // Update local state
       setFavorites(prev => prev.filter(f => f.id !== favoriteId));
       toast.success(`${destinationName} removed from favorites`);
     } catch (error) {
       console.error("Error removing favorite:", error);
       toast.error("Failed to remove from favorites");
     } finally {
       setRemovingId(null);
     }
   };
 
   // Show loading state
   if (authLoading || isLoading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
     );
   }
 
   // Redirect handled in useEffect
   if (!user) {
     return null;
   }
 
   return (
     <div className="min-h-screen flex flex-col bg-background">
       <Navbar />
       
       <main className="flex-1 pt-24 pb-12">
         <div className="container mx-auto px-4">
           {/* Header */}
           <div className="mb-8">
             <div className="flex items-center gap-3 mb-2">
               <Heart className="h-8 w-8 text-primary fill-primary" />
               <h1 className="text-3xl font-bold">Saved Destinations</h1>
             </div>
             <p className="text-muted-foreground">
               {favorites.length === 0 
                 ? "You haven't saved any destinations yet." 
                 : `You have ${favorites.length} saved destination${favorites.length !== 1 ? 's' : ''}.`}
             </p>
           </div>
 
           {/* Empty State */}
           {favorites.length === 0 ? (
             <div className="text-center py-20 bg-muted/30 rounded-2xl">
               <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
               <h2 className="text-xl font-semibold mb-2">No saved destinations</h2>
               <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                 Start exploring and save destinations you'd like to visit by clicking the heart icon.
               </p>
               <Button onClick={() => navigate("/destinations")}>
                 Explore Destinations
               </Button>
             </div>
           ) : (
             /* Favorites Grid */
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {favorites.map((favorite) => (
                 <div
                   key={favorite.id}
                   className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                 >
                   {/* Destination Image */}
                   <div className="relative h-56 overflow-hidden">
                     <img
                       src={favorite.destination.image_url}
                       alt={favorite.destination.name}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                       loading="lazy"
                     />
                     {/* Category Badge */}
                     <div className="absolute top-4 left-4">
                       <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                         {favorite.destination.category}
                       </span>
                     </div>
                     {/* Remove Button */}
                     <button
                       onClick={() => removeFavorite(favorite.id, favorite.destination.name)}
                       disabled={removingId === favorite.id}
                       className={cn(
                         "absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                         "bg-primary text-primary-foreground hover:bg-destructive"
                       )}
                       aria-label="Remove from favorites"
                     >
                       {removingId === favorite.id ? (
                         <Loader2 className="w-4 h-4 animate-spin" />
                       ) : (
                         <Trash2 className="w-4 h-4" />
                       )}
                     </button>
                   </div>
 
                   {/* Destination Details */}
                   <div className="p-5">
                     {/* Rating */}
                     <div className="flex items-center gap-1 text-accent mb-2">
                       <Star className="w-4 h-4 fill-current" />
                       <span className="text-sm font-medium text-foreground">
                         {favorite.destination.rating.toFixed(1)}
                       </span>
                       <span className="text-muted-foreground text-xs">
                         ({favorite.destination.reviews_count.toLocaleString()} reviews)
                       </span>
                     </div>
 
                     {/* Name */}
                     <h3 className="font-display text-xl font-bold text-foreground mb-1">
                       {favorite.destination.name}
                     </h3>
 
                     {/* Location */}
                     <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                       <MapPin className="w-3.5 h-3.5" />
                       {favorite.destination.location}, {favorite.destination.country}
                     </div>
 
                     {/* Description */}
                     <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                       {favorite.destination.description}
                     </p>
 
                     {/* Price and Action */}
                     <div className="flex items-center justify-between">
                       <div className="text-foreground">
                         From{" "}
                         <span className="font-bold text-xl text-primary">
                           ${favorite.destination.price_per_person.toFixed(0)}
                         </span>
                         <span className="text-muted-foreground text-sm">
                           /person
                         </span>
                       </div>
                       <Button size="sm" className="btn-gradient">
                         View Details
                       </Button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
         </div>
       </main>
       
       <Footer />
     </div>
   );
 };
 
 export default Favorites;