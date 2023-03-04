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

// Post edit Component
export const editVariants: Variants = {
  enter: {
    opacity: 0,
    transition: { duration: 5 },
  },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.4,
      bounce: 0,
    },
  },
  exit: {
    transition: { duration: 0.4 },
    opacity: 0,
  },
};

export const headerVariants: Variants = {
  enter: {
    y: 0,
    transition: {
      type: "spring",
      duration: 0.4,
      bounce: 0,
    },
  },
  static: {
    y: 0,
  },
  exit: {
    y: "-5rem",
    transition: {
      type: "spring",
      duration: 0.7,
      bounce: 0,
    },
  },
};

export const stickyVariants: Variants = {
  enter: {
    y: "-5rem",
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0,
    },
  },
  static: {
    y: 0,
  },
  exit: {
    y: 0,
    transition: {
      type: "spring",
      duration: 0.7,
      bounce: 0,
    },
  },
};
