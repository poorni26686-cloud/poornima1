/**
 * Navigation Bar Component
 * 
 * Responsive navigation with authentication state awareness.
 * Shows user profile or sign-in button based on auth status.
 * 
 * @author Tourist Guiding System
 * @version 1.0.0
 */

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, MapPin, User, Search, LogOut, Heart, Shield } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  
  // Get authentication state
  const { user, signOut, isLoading } = useAuth();
  const { hasRole: isAdmin } = useRole("admin");

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links configuration
  const navLinks = [
    { name: "Destinations", href: "/destinations" },
    { name: "Tours", href: "/tours" },
    { name: "Tour Guides", href: "/guides" },
    { name: "Plan Trip", href: "/planner" },
    { name: "About", href: "/about" },
  ];

  /**
   * Handle user sign out
   * Clears session and redirects to home
   */
  const handleSignOut = async () => {
    await signOut();
    toast.success("You have been signed out");
    navigate("/");
  };

  // Get user display name from metadata or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || !isHome
          ? "bg-background/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
              isScrolled || !isHome ? "bg-primary" : "bg-primary-foreground/20 backdrop-blur-sm"
            )}>
              <MapPin className={cn(
                "w-5 h-5",
                isScrolled || !isHome ? "text-primary-foreground" : "text-primary-foreground"
              )} />
            </div>
            <span className={cn(
              "font-display text-xl font-bold transition-colors",
              isScrolled || !isHome ? "text-foreground" : "text-primary-foreground"
            )}>
              Wanderlust
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isScrolled || !isHome
                    ? "text-muted-foreground"
                    : "text-primary-foreground/80 hover:text-primary-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                isScrolled || !isHome
                  ? "text-foreground"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Show user menu if authenticated, otherwise show sign in button */}
            {!isLoading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={isScrolled || !isHome ? "outline" : "secondary"}
                      className={cn(
                        "font-medium gap-2",
                        !isScrolled && isHome && "bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
                      )}
                    >
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="max-w-[100px] truncate">{displayName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/favorites")}>
                      <Heart className="w-4 h-4 mr-2" />
                      Saved Destinations
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button
                    variant={isScrolled || !isHome ? "default" : "secondary"}
                    className={cn(
                      "font-medium",
                      !isScrolled && isHome && "bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
                    )}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              isScrolled || !isHome
                ? "text-foreground"
                : "text-primary-foreground"
            )}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-muted-foreground hover:text-primary transition-colors py-2"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start mb-2">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>
                </Link>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
