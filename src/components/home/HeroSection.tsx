import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-beach.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful tropical destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            AI-Powered Travel Assistant
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            Discover Your Next
            <span className="block text-secondary">Adventure</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            Explore breathtaking destinations, connect with expert local guides,
            and plan your perfect journey with our intelligent travel companion.
          </p>

          {/* CTA Button */}
          <Button
            onClick={() => navigate("/destinations")}
            className="btn-gradient text-base font-semibold px-8 py-6 rounded-xl"
          >
            <Search className="w-5 h-5 mr-2" />
            Explore Destinations
          </Button>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 pt-8">
            {[
              { value: "500+", label: "Destinations" },
              { value: "1000+", label: "Tour Guides" },
              { value: "50K+", label: "Happy Travelers" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-white/50" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
