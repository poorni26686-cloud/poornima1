import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Wanderlust</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Your intelligent travel companion. Discover amazing destinations,
              connect with expert guides, and plan unforgettable adventures.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="text-primary-foreground/50 hover:text-secondary transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "Destinations", to: "/destinations" },
                { label: "Tour Guides", to: "/guides" },
                { label: "Trip Planner", to: "/planner" },
                { label: "Favorites", to: "/favorites" },
                { label: "About", to: "/about" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/60 text-sm">
                  123 Travel Street, Adventure City, TC 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <a href="mailto:hello@wanderlust.com" className="text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                  hello@wanderlust.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary" />
                <a href="tel:+1234567890" className="text-primary-foreground/60 hover:text-secondary transition-colors text-sm">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/40 text-sm">
            © 2025 Wanderlust. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Service", to: "/terms" },
              { label: "Cookies", to: "/cookies" },
            ].map((item) => (
              <Link key={item.label} to={item.to} className="text-primary-foreground/40 hover:text-secondary text-sm transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
