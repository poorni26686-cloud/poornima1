import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Destinations", href: "/destinations" },
    { name: "Tour Guides", href: "/guides" },
    { name: "Plan Trip", href: "/planner" },
    { name: "About", href: "/about" },
  ];

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
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
            <Link to="/auth" onClick={() => setIsOpen(false)}>
              <Button className="w-full">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
