import { MapPin, Users, CalendarDays, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-beach.jpg";

const cards = [
  {
    title: "Destinations",
    description: "Explore breathtaking places across India",
    icon: MapPin,
    path: "/destinations",
    gradient: "from-primary to-primary/70",
  },
  {
    title: "Tour Guides",
    description: "Connect with expert local guides",
    icon: Users,
    path: "/guides",
    gradient: "from-secondary to-secondary/70",
  },
  {
    title: "Plan Trip",
    description: "Build your perfect itinerary with AI",
    icon: CalendarDays,
    path: "/planner",
    gradient: "from-accent to-accent/70",
  },
  {
    title: "About",
    description: "Learn more about our platform",
    icon: Info,
    path: "/about",
    gradient: "from-primary to-secondary",
  },
];

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
        <div className="max-w-5xl mx-auto text-center space-y-12">
          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  onClick={() => navigate(card.path)}
                  className="group relative rounded-2xl p-6 md:p-8 bg-white/10 backdrop-blur-md border border-white/20 text-white text-left overflow-hidden transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 cursor-pointer"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 to-transparent" />

                  <div className="relative z-10 flex flex-col items-center text-center gap-3">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl font-bold">
                      {card.title}
                    </h3>
                    <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <span className="text-white/60 text-lg">→</span>
                  </div>
                </motion.button>
              );
            })}
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
