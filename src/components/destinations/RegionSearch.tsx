/**
 * Region-wise destination search with auto-suggestions for all Indian states & UTs
 * Features: preview images, famous places, region grouping, text highlighting
 */

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import indianRegions from "@/data/indianStates";

interface RegionSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RegionSearch = ({ value, onChange, placeholder = "Search states, cities, or attractions across India..." }: RegionSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const query = value.toLowerCase().trim();

  // Filter by state name, places, or region name
  const filteredRegions = indianRegions
    .map((r) => ({
      ...r,
      states: r.states.filter(
        (s) =>
          !query ||
          s.name.toLowerCase().includes(query) ||
          s.places.some((p) => p.toLowerCase().includes(query)) ||
          r.region.toLowerCase().includes(query)
      ),
    }))
    .filter((r) => r.states.length > 0);

  const totalResults = filteredRegions.reduce((a, r) => a + r.states.length, 0);

  const handleSelect = (state: string) => {
    onChange(state);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleFocus = () => {
    setInputFocused(true);
    setIsOpen(true);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  /** Highlight matching substring */
  const highlight = (text: string) => {
    if (!query) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(query);
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <span className="font-semibold text-primary">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative max-w-2xl mx-auto">
      {/* Search Input */}
      <div
        className={cn(
          "relative rounded-2xl border bg-card shadow-sm transition-all",
          inputFocused ? "border-primary ring-2 ring-primary/20" : "border-border"
        )}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setInputFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-4 rounded-2xl bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && filteredRegions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
          >
            <div className="max-h-[420px] overflow-y-auto">
              {filteredRegions.map((region) => (
                <div key={region.region}>
                  {/* Region Header */}
                  <div className="sticky top-0 z-10 px-4 py-2.5 bg-muted/80 backdrop-blur-sm border-b border-border flex items-center gap-2">
                    <span className="text-base">{region.emoji}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent">
                      {region.region}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {region.states.length} state{region.states.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* State Items */}
                  {region.states.map((state) => (
                    <button
                      key={state.name}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(state.name)}
                      className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors flex items-start gap-3 group"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border">
                        <img
                          src={state.image}
                          alt={state.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                          <span className="text-sm font-medium text-foreground truncate">
                            {highlight(state.name)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Landmark className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground truncate">
                            {state.places.map((p, i) => (
                              <span key={p}>
                                {i > 0 && " · "}
                                {highlight(p)}
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-2.5 bg-muted/50 text-xs text-muted-foreground text-center">
              {totalResults} state{totalResults !== 1 ? "s" : ""} across {filteredRegions.length} region{filteredRegions.length !== 1 ? "s" : ""}
            </div>
          </motion.div>
        )}

        {isOpen && query && filteredRegions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-lg p-6 text-center"
          >
            <p className="text-muted-foreground text-sm">No states or places found for "{value}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegionSearch;
