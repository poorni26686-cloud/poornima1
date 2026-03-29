/**
 * Advanced Search and Filter Component for Destinations
 */

/**
 * Advanced Search and Filter Component for Destinations
 */

import { useState } from "react";
import { SlidersHorizontal, Grid, List, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import RegionSearch from "./RegionSearch";

const categories = ["All", "Beach", "Adventure", "Heritage", "City", "Exotic", "Nature"];
const continents = ["All", "Asia", "Europe", "Africa", "North America", "South America", "Oceania"];

export interface FilterState {
  searchQuery: string;
  category: string;
  continent: string;
  priceRange: [number, number];
  minRating: number;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  resultCount: number;
}

const SearchFilters = ({ filters, onFiltersChange, viewMode, onViewModeChange, resultCount }: SearchFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      category: "All",
      continent: "All",
      priceRange: [0, 5000],
      minRating: 0,
    });
  };

  const hasActiveFilters = filters.category !== "All" || filters.continent !== "All" ||
    filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 || filters.minRating > 0;

  return (
    <div className="space-y-4">
      {/* Region-wise Search Bar */}
      <RegionSearch
        value={filters.searchQuery}
        onChange={(val) => updateFilter("searchQuery", val)}
      />

      {/* Category & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter("category", cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                filters.category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showAdvanced ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent" />}
          </Button>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Advanced Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground gap-1">
                  <X className="w-3 h-3" /> Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Continent */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Continent</label>
                  <div className="flex flex-wrap gap-1.5">
                    {continents.map(c => (
                      <button
                        key={c}
                        onClick={() => updateFilter("continent", c)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          filters.continent === c
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </label>
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(v) => updateFilter("priceRange", v as [number, number])}
                    min={0}
                    max={5000}
                    step={100}
                    className="mt-3"
                  />
                </div>

                {/* Min Rating */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Minimum Rating: {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
                  </label>
                  <Slider
                    value={[filters.minRating]}
                    onValueChange={(v) => updateFilter("minRating", v[0])}
                    min={0}
                    max={5}
                    step={0.5}
                    className="mt-3"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result count */}
      <p className="text-muted-foreground text-sm">
        Showing {resultCount} destination{resultCount !== 1 ? "s" : ""}
        {hasActiveFilters && (
          <button onClick={clearFilters} className="ml-2 text-primary hover:underline text-xs">Clear filters</button>
        )}
      </p>
    </div>
  );
};

export default SearchFilters;
