/**
 * Floating cart button shown on the Destinations page
 */

import { ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTripCart } from "@/contexts/TripCartContext";

interface CartFloatingButtonProps {
  onClick: () => void;
}

const CartFloatingButton = ({ onClick }: CartFloatingButtonProps) => {
  const { count } = useTripCart();

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-6 z-40 bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
    >
      <ShoppingBag className="w-6 h-6" />
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CartFloatingButton;
