/**
 * Region-wise destination search with auto-suggestions for Indian states
 */

import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface RegionData {
  region: string;
  states: string[];
}

const indianRegions: RegionData[] = [
  {
    region: "North India",
    states: [
      "Chandigarh", "Delhi", "Haryana", "Himachal Pradesh",
      "Jammu & Kashmir", "Ladakh", "Punjab", "Rajasthan",
      "Uttar Pradesh", "Uttarakhand",
    ],
  },
  {
    region: "South India",
    states: [
      "Andhra Pradesh", "Karnataka", "Kerala",
      "Puducherry", "Tamil Nadu", "Telangana",
    ],
  },
  {
    region: "East India",
    states: [
      "Arunachal Pradesh", "Assam", "Bihar", "Jharkhand",
      "Manipur", "Meghalaya", "Mizoram", "Nagaland",
      "Odisha", "Sikkim", "Tripura", "West Bengal",
    ],
  },
  {
    region: "West India",
    states: [
      "Dadra & Nagar Haveli", "Daman & Diu", "Goa",
      "Gujarat", "Madhya Pradesh", "Maharashtra",
    ],
  },
];

interface RegionSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RegionSearch = ({ value, onChange, placeholder = "Search destinations across India..." }: RegionSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  // Filter regions/states based on query
  const filteredRegions = indianRegions
    .map((r) => ({
      ...r,
      states: r.states.filter(
        (s) => !query || s.toLowerCase().includes(query) || r.region.toLowerCase().includes(query)
      ),
    }))
    .filter((r) => r.states.length > 0);

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
            className="absolute z-50 left-0 right-0 mt-2 rounded-2xl border border-border bg-card shadow-lg overflow-hidden"
          >
            <div className="max-h-80 overflow-y-auto py-2">
              {filteredRegions.map((region) => (
                <div key={region.region}>
                  {/* Region Header */}
                  <div className="px-4 py-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {region.region}
                    </span>
                  </div>

                  {/* States */}
                  {region.states.map((state) => {
                    // Highlight matching text
                    const idx = state.toLowerCase().indexOf(query);
                    return (
                      <button
                        key={state}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelect(state)}
                        className="w-full text-left px-6 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors flex items-center gap-2"
                      >
                        {query && idx !== -1 ? (
                          <span>
                            {state.slice(0, idx)}
                            <span className="font-semibold text-primary">
                              {state.slice(idx, idx + query.length)}
                            </span>
                            {state.slice(idx + query.length)}
                          </span>
                        ) : (
                          <span>{state}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="border-t border-border px-4 py-2.5 text-xs text-muted-foreground text-center">
              {filteredRegions.reduce((a, r) => a + r.states.length, 0)} results across {filteredRegions.length} region{filteredRegions.length !== 1 ? "s" : ""}
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
            <p className="text-muted-foreground text-sm">No states found for "{value}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegionSearch;
