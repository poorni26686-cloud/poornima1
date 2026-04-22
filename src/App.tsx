/**
 * Main Application Component
 * 
 * Root component that sets up the application with:
 * - React Query for data fetching
 * - Authentication provider
 * - Routing configuration
 * - Toast notifications
 * 
 * @author Tourist Guiding System
 * @version 1.0.0
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { TripCartProvider } from "@/contexts/TripCartContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import TripPlanner from "./pages/TripPlanner";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import Guides from "./pages/Guides";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

// Create React Query client with default options
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TripCartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tour/:id" element={<TourDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </TripCartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
