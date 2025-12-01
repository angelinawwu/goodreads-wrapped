import type { Variants } from 'framer-motion';

/**
 * Shared animation variants for consistent motion across all pages
 * Inspired by Spotify Wrapped and high-energy motion graphics
 */

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const containerVariantsSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { 
    y: 50, 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 10 
    } 
  },
};

export const itemVariantsSubtle: Variants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 150, 
      damping: 12 
    } 
  },
};

export const heroVariants: Variants = {
  hidden: { 
    scale: 0, 
    rotate: -10,
    opacity: 0
  },
  visible: { 
    scale: 1, 
    rotate: 0,
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 15,
      delay: 0.5
    } 
  },
};

export const slideVariants: Variants = {
  hidden: { 
    y: 100, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 12 
    } 
  },
};

export const slideVariantsTop: Variants = {
  hidden: { 
    y: -100, 
    opacity: 0 
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 12 
    } 
  },
};

export const fadeScaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15 
    } 
  },
};

