import {
  MapPin,
  Calendar,
  Utensils,
  Lightbulb,
  Clock,
  Shield,
  Wallet,
  RotateCcw,
  Star,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TripPlan } from "@/pages/TripPlanner";
import ReactMarkdown from "react-markdown";
import { generateTravelPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";

/** Convert structured TripPlan into markdown for the PDF generator */
const tripPlanToMarkdown = (plan: TripPlan, destination: string, days: number): string => {
  const parts: string[] = [];

  if (plan.summary) {
    parts.push(`## Overview\n${plan.summary}`);
  }

  if (plan.highlights?.length) {
    parts.push(`## Must-See Highlights`);
    plan.highlights.forEach((h, i) => parts.push(`${i + 1}. ${h}`));
  }

  if (plan.itinerary?.length) {
    parts.push(`## Day-by-Day Itinerary`);
    plan.itinerary.forEach((d) => {
      parts.push(`### Day ${d.day}: ${d.title}`);
      parts.push(`**Morning:** ${d.morning}`);
      parts.push(`**Afternoon:** ${d.afternoon}`);
      parts.push(`**Evening:** ${d.evening}`);
    });
  }

  if (plan.restaurants?.length) {
    parts.push(`## Recommended Restaurants`);
    plan.restaurants.forEach((r) => {
      parts.push(`**${r.name}** (${r.priceRange}) — ${r.cuisine}`);
      parts.push(`Specialty: ${r.specialty}`);
    });
  }

  if (plan.tips?.length) {
    parts.push(`## Local Travel Tips`);
    plan.tips.forEach((t, i) => parts.push(`${i + 1}. ${t}`));
  }

  if (plan.safety?.length) {
    parts.push(`## Safety & Cultural Tips`);
    plan.safety.forEach((s) => parts.push(`- ${s}`));
  }

  if (plan.bestTimes?.length) {
    parts.push(`## Best Times to Visit`);
    plan.bestTimes.forEach((b) => {
      parts.push(`**${b.place}** — ${b.bestTime}`);
      parts.push(b.reason);
    });
  }

  if (plan.budget) {
    parts.push(`## Estimated Budget`);
    parts.push(`- Accommodation: ${plan.budget.accommodation}`);
    parts.push(`- Food: ${plan.budget.food}`);
    parts.push(`- Activities: ${plan.budget.activities}`);
    parts.push(`- Transport: ${plan.budget.transport}`);
    parts.push(`**Total: ${plan.budget.total}**`);
  }

  return parts.join("\n\n");
};

interface TripResultsProps {
  tripPlan: TripPlan;
  destination: string;
  days: number;
  onReset: () => void;
}

const TripResults = ({ tripPlan, destination, days, onReset }: TripResultsProps) => {
  const handleDownloadPDF = () => {
    try {
      const content = tripPlan.rawContent
        ? tripPlan.rawContent
        : tripPlanToMarkdown(tripPlan, destination, days);
      generateTravelPDF(content, {
        title: "Your Travel Plan",
        destination: `${destination} • ${days} Days`,
      });
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Failed to generate PDF");
    }
  };

  // If we got raw content instead of structured JSON
  if (tripPlan.rawContent) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Your Trip to {destination}
            </h2>
            <div className="flex gap-3">
              <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button onClick={onReset} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Plan Another Trip
              </Button>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-8 prose prose-lg max-w-none">
            <ReactMarkdown>{tripPlan.rawContent}</ReactMarkdown>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{days} Days Trip</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Your Trip to {destination}
            </h2>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Button onClick={onReset} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Trip
            </Button>
          </div>
        </div>

        {/* Summary */}
        {tripPlan.summary && (
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 mb-8">
            <p className="text-lg text-foreground leading-relaxed">{tripPlan.summary}</p>
          </div>
        )}

        {/* Highlights */}
        {tripPlan.highlights && tripPlan.highlights.length > 0 && (
          <div className="mb-12">
            <h3 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground mb-6">
              <Star className="w-6 h-6 text-accent" />
              Must-See Highlights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tripPlan.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-5 border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <p className="text-foreground">{highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day-by-Day Itinerary */}
        {tripPlan.itinerary && tripPlan.itinerary.length > 0 && (
          <div className="mb-12">
            <h3 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              Day-by-Day Itinerary
            </h3>
            <div className="space-y-6">
              {tripPlan.itinerary.map((day, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl overflow-hidden border border-border"
                >
                  <div className="bg-gradient-to-r from-primary to-secondary p-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold">
                        {day.day}
                      </span>
                      <h4 className="font-display text-xl font-semibold text-primary-foreground">
                        {day.title}
                      </h4>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 text-sm font-medium text-primary">
                        Morning
                      </div>
                      <p className="text-foreground">{day.morning}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 text-sm font-medium text-secondary">
                        Afternoon
                      </div>
                      <p className="text-foreground">{day.afternoon}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 text-sm font-medium text-accent">
                        Evening
                      </div>
                      <p className="text-foreground">{day.evening}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restaurants */}
        {tripPlan.restaurants && tripPlan.restaurants.length > 0 && (
          <div className="mb-12">
            <h3 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground mb-6">
              <Utensils className="w-6 h-6 text-primary" />
              Recommended Restaurants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tripPlan.restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-5 border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-foreground">{restaurant.name}</h4>
                    <span className="text-sm font-medium text-primary">
                      {restaurant.priceRange}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{restaurant.cuisine}</p>
                  <p className="text-sm text-foreground">{restaurant.specialty}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips & Best Times Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Travel Tips */}
          {tripPlan.tips && tripPlan.tips.length > 0 && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-foreground mb-4">
                <Lightbulb className="w-5 h-5 text-accent" />
                Local Travel Tips
              </h3>
              <ul className="space-y-3">
                {tripPlan.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Tips */}
          {tripPlan.safety && tripPlan.safety.length > 0 && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-foreground mb-4">
                <Shield className="w-5 h-5 text-secondary" />
                Safety & Cultural Tips
              </h3>
              <ul className="space-y-3">
                {tripPlan.safety.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Best Times to Visit */}
        {tripPlan.bestTimes && tripPlan.bestTimes.length > 0 && (
          <div className="mb-12">
            <h3 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground mb-6">
              <Clock className="w-6 h-6 text-primary" />
              Best Times to Visit
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tripPlan.bestTimes.map((item, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-5 border border-border"
                >
                  <h4 className="font-semibold text-foreground mb-2">{item.place}</h4>
                  <p className="text-primary font-medium text-sm mb-1">{item.bestTime}</p>
                  <p className="text-sm text-muted-foreground">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Budget Breakdown */}
        {tripPlan.budget && (
          <div className="mb-12">
            <h3 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground mb-6">
              <Wallet className="w-6 h-6 text-primary" />
              Estimated Budget
            </h3>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Accommodation</p>
                  <p className="text-xl font-bold text-foreground">{tripPlan.budget.accommodation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Food</p>
                  <p className="text-xl font-bold text-foreground">{tripPlan.budget.food}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Activities</p>
                  <p className="text-xl font-bold text-foreground">{tripPlan.budget.activities}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transport</p>
                  <p className="text-xl font-bold text-foreground">{tripPlan.budget.transport}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="text-lg font-medium text-foreground">Estimated Total</span>
                <span className="text-2xl font-bold text-primary">{tripPlan.budget.total}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TripResults;
