import { Map, MessageCircle, Calendar, Shield, Users, Sparkles } from "lucide-react";

const features = [
  {
    icon: Map,
    title: "Interactive Maps",
    description: "Explore destinations with GPS-powered maps and real-time navigation",
    color: "bg-primary text-primary-foreground",
  },
  {
    icon: MessageCircle,
    title: "AI Travel Assistant",
    description: "Get instant answers and personalized recommendations from our chatbot",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Calendar,
    title: "Smart Itinerary",
    description: "Plan your perfect trip with day-by-day scheduling and suggestions",
    color: "bg-accent text-accent-foreground",
  },
  {
    icon: Users,
    title: "Expert Guides",
    description: "Connect with verified local guides for authentic experiences",
    color: "bg-primary text-primary-foreground",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Book with confidence using our secure payment system",
    color: "bg-secondary text-secondary-foreground",
  },
  {
    icon: Sparkles,
    title: "Personalized",
    description: "Receive tailored recommendations based on your preferences",
    color: "bg-accent text-accent-foreground",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
            Travel Smarter with AI
          </h2>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
            Experience the future of travel planning with our intelligent features
            designed to make your journey unforgettable
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 card-hover border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
