import type { Variants } from "framer-motion";

/**
 * Expand component
 */
export const expandVariants: Variants = {
  expand: {
    display: "flex",
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 1.4,
      bounce: 0,
    },
  },
  shrink: {
    y: -20,
    transition: { duration: 0.4 },
    opacity: 0,
    transitionEnd: { display: "none" },
  },
};
