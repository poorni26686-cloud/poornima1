import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(224, 72%, 33%) 0%, hsl(199, 89%, 50%) 100%)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Start Your Journey Today
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            Ready to Explore the World?
          </h2>

          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of travelers who trust Wanderlust for their adventures.
            Create your free account and start planning your dream trip.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 rounded-xl shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/destinations">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 rounded-xl"
              >
                Browse Destinations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
