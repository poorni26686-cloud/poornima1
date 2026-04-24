import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ReactNode } from "react";

interface StaticPageProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const StaticPage = ({ title, subtitle, children }: StaticPageProps) => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
      <header className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-3">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
      </header>
      <article className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground/80 leading-relaxed">
        {children}
      </article>
    </main>
    <Footer />
  </div>
);

export default StaticPage;
