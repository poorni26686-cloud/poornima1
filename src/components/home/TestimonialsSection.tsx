import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Travel Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "The AI chatbot helped me plan my entire trip to Bali in minutes. It suggested hidden gems I would never have found on my own!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Adventure Seeker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "Booking a local guide through Wanderlust made my Swiss Alps adventure unforgettable. The platform is incredibly easy to use.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Digital Nomad",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    content: "As someone who travels constantly, this is the best travel companion I've found. The personalized recommendations are spot-on!",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary font-semibold text-sm uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
            Loved by Travelers
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            See what our community of travelers has to say about their experiences
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 card-hover relative border border-border/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-secondary/15" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary/20"
                />
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
