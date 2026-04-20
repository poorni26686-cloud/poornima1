/**
 * About Page
 *
 * Tells the story of the Tourist Guiding System: mission, values,
 * what we offer, the team behind it, and how to get in touch.
 */

import { motion } from "framer-motion";
import {
  Compass,
  Globe2,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Users,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const values = [
  {
    icon: Compass,
    title: "Curated Journeys",
    description:
      "Every destination is hand-picked and reviewed so you discover places worth your time.",
  },
  {
    icon: HeartHandshake,
    title: "Traveler First",
    description:
      "From planning to packing, our tools are built around what real travelers actually need.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    description:
      "Verified guides, secure bookings, and transparent reviews keep your trip stress-free.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Planning",
    description:
      "Smart itineraries built in seconds, personalized to your pace, budget, and interests.",
  },
];

const stats = [
  { value: "36+", label: "States & UTs covered" },
  { value: "500+", label: "Curated destinations" },
  { value: "10k+", label: "Happy travelers" },
  { value: "24/7", label: "Travel support" },
];

const team = [
  {
    name: "Poornima S.",
    role: "Founder & Product Lead",
    bio: "Passionate about making travel planning effortless for everyone.",
  },
  {
    name: "Arjun R.",
    role: "Head of Destinations",
    bio: "Spent 8+ years curating offbeat experiences across India.",
  },
  {
    name: "Meera K.",
    role: "AI & Engineering",
    bio: "Builds the intelligence behind smart itineraries and recommendations.",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
              <Globe2 className="h-4 w-4 text-primary" />
              About Us
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
              Travel made <span className="text-primary">personal</span>,
              planning made <span className="text-secondary">simple</span>.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              We're on a mission to help every traveler discover incredible
              places, plan smarter trips, and create memories that last a
              lifetime — all from one beautifully simple platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold md:text-4xl">Our Mission</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Travel should be exciting, not exhausting. We started this
                platform because planning a trip — picking destinations,
                building itineraries, juggling bookings — often takes more
                energy than the trip itself.
              </p>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Our goal is simple: give travelers the tools, guidance, and
                inspiration they need to focus on the journey, not the
                logistics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((s) => (
                <Card key={s.label} className="border-border bg-card">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary md:text-4xl">
                      {s.value}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {s.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">What we stand for</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              The principles that guide every feature we build and every
              recommendation we make.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full border-border transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <v.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {v.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              The Team
            </span>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Meet the people behind the platform
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              A small, passionate team obsessed with great travel experiences.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full border-border">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-primary-foreground">
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-lg md:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Ready to start your journey?
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                Explore destinations or let our AI plan a trip tailored just for
                you.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" onClick={() => navigate("/destinations")}>
                  Explore Destinations
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/planner")}
                >
                  Plan My Trip
                </Button>
              </div>
            </div>

            <div className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Email</div>
                  <div className="text-sm font-medium">hello@travel.app</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Support</div>
                  <div className="text-sm font-medium">+91 98765 43210</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Based in</div>
                  <div className="text-sm font-medium">Bengaluru, India</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
