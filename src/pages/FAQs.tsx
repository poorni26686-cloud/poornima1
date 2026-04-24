import StaticPage from "./StaticPage";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I book a tour guide?", a: "Browse our Tour Guides page, click 'Book Guide', pick your dates and party size, and submit your request." },
  { q: "Can I customize my itinerary?", a: "Yes — use the AI Trip Planner to generate a personalized day-wise plan, then export it as PDF." },
  { q: "Are payments secure?", a: "Yes, all transactions are processed through encrypted, PCI-compliant gateways." },
  { q: "What if my guide cancels?", a: "We will assign an alternate verified guide or fully refund your booking." },
  { q: "Do you offer group discounts?", a: "Yes, group rates are available for parties of 6 or more — contact us for a quote." },
];

const FAQs = () => (
  <StaticPage title="Frequently Asked Questions" subtitle="Quick answers to common questions.">
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((f, i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
          <AccordionContent className="text-foreground/70">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </StaticPage>
);

export default FAQs;
