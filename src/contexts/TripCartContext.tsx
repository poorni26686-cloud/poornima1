/**
 * Trip Cart Context — manages selected places for trip planning
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type PlaceDetail } from "@/data/placeDetails";

interface TripCartContextType {
  items: PlaceDetail[];
  addItem: (place: PlaceDetail) => void;
  removeItem: (placeId: string) => void;
  clearCart: () => void;
  isInCart: (placeId: string) => boolean;
  count: number;
}

const TripCartContext = createContext<TripCartContextType | null>(null);

/** Play a subtle UI sound */
const playSound = (type: "add" | "remove" | "plan") => {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.value = 0.08;

    if (type === "add") {
      osc.frequency.value = 600;
      osc.type = "sine";
    } else if (type === "remove") {
      osc.frequency.value = 350;
      osc.type = "triangle";
    } else {
      osc.frequency.value = 800;
      osc.type = "sine";
    }

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // silently fail — audio not critical
  }
};

export const TripCartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<PlaceDetail[]>([]);

  const addItem = useCallback((place: PlaceDetail) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === place.id)) return prev;
      playSound("add");
      return [...prev, place];
    });
  }, []);

  const removeItem = useCallback((placeId: string) => {
    playSound("remove");
    setItems((prev) => prev.filter((p) => p.id !== placeId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (placeId: string) => items.some((p) => p.id === placeId),
    [items]
  );

  return (
    <TripCartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, count: items.length }}>
      {children}
    </TripCartContext.Provider>
  );
};

export const useTripCart = () => {
  const ctx = useContext(TripCartContext);
  if (!ctx) throw new Error("useTripCart must be used within TripCartProvider");
  return ctx;
};

export { playSound };
