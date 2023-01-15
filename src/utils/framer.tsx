import type { Variants } from "framer-motion";

export const expandVariants: Variants = {
  expand: {
    display: "flex",
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 1,
      bounce: 0,
    },
  },
  shrink: {
    y: -60,
    transition: { duration: 0.2 },
    opacity: 0,
    transitionEnd: { display: "none" },
  },
};
