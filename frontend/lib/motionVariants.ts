import type { Variants } from 'framer-motion';

/**
 * Shared animation variants for consistent motion across all pages
 * 
 * Animation principles:
 * - Use blur as an in-between state for smoother transitions
 * - Snappy springs with higher stiffness and damping (less bounce)
 * - ease-out curves for entering elements
 * - Duration ~0.25-0.3s for most animations
 */

// Easing curves (from animation guidelines)
export const EASING = {
  easeOutQuad: [0.25, 0.46, 0.45, 0.94],
  easeOutCubic: [0.215, 0.61, 0.355, 1],
  easeOutQuart: [0.165, 0.84, 0.44, 1],
  easeOutQuint: [0.23, 1, 0.32, 1],
  easeInOutCubic: [0.645, 0.045, 0.355, 1],
} as const;

// Snappy spring config (less bouncy, more responsive)
const snappySpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

const gentleSpring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 25,
};

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const containerVariantsSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: {
    y: 30,
    opacity: 0,
    scale: 0.95,
    filter: 'blur(8px)',
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...snappySpring,
      filter: { duration: 0.25, ease: EASING.easeOutCubic },
    },
  },
};

export const itemVariantsSubtle: Variants = {
  hidden: {
    y: 16,
    opacity: 0,
    filter: 'blur(4px)',
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      ...gentleSpring,
      filter: { duration: 0.2, ease: EASING.easeOutCubic },
    },
  },
};

export const heroVariants: Variants = {
  hidden: {
    scale: 0.8,
    rotate: -5,
    opacity: 0,
    filter: 'blur(12px)',
  },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      ...snappySpring,
      delay: 0.3,
      filter: { duration: 0.3, ease: EASING.easeOutQuart, delay: 0.3 },
    },
  },
};

export const slideVariants: Variants = {
  hidden: {
    y: 60,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      ...snappySpring,
      filter: { duration: 0.25, ease: EASING.easeOutCubic },
    },
  },
};

export const slideVariantsTop: Variants = {
  hidden: {
    y: -60,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      ...snappySpring,
      filter: { duration: 0.25, ease: EASING.easeOutCubic },
    },
  },
};

export const fadeScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...gentleSpring,
      filter: { duration: 0.25, ease: EASING.easeOutCubic },
    },
  },
};

/**
 * Staged text entrance helpers
 *
 * Each element:
 * - Fades in with blur for smooth transition
 * - Settles slightly higher as later elements arrive
 * - Uses ease-out-quart for a snappy, responsive feel
 */

export const STAGED_TEXT_DELAYS = {
  HEADLINE: 0.0,
  SUBHEADLINE: 0.35,
  METRIC: 0.7,
  LABEL: 1.0,
} as const;

export const createStagedTextVariant = (delaySeconds: number): Variants => ({
  hidden: {
    opacity: 0,
    y: 8,
    scale: 0.98,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: -8,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      delay: delaySeconds,
      ease: EASING.easeOutQuart,
    },
  },
});

export const stagedHeadline = createStagedTextVariant(STAGED_TEXT_DELAYS.HEADLINE);
export const stagedSubheadline = createStagedTextVariant(STAGED_TEXT_DELAYS.SUBHEADLINE);
export const stagedMetric = createStagedTextVariant(STAGED_TEXT_DELAYS.METRIC);
export const stagedLabel = createStagedTextVariant(STAGED_TEXT_DELAYS.LABEL);

/**
 * Calculate total animation duration for a slide
 * Used to determine when to trigger auto-advance
 */
export const calculateAnimationDuration = (elements: {
  hasStaged?: boolean; // Has staged text (HEADLINE→SUBHEADLINE→METRIC→LABEL)
  hasCounter?: boolean; // Has AnimatedCounter
  hasStaggeredList?: boolean; // Has staggered list items
  listItemCount?: number; // Number of items in list
  hasMultiStep?: boolean; // Has internal steps (like BookDetails)
  stepCount?: number; // Number of internal steps
}): number => {
  let duration = 0;

  // Base container animation (faster with snappy springs)
  duration += 0.2;

  // Staged text (longest delay + animation duration)
  if (elements.hasStaged) {
    duration += STAGED_TEXT_DELAYS.LABEL + 0.5; // Last element delay + duration
  }

  // Animated counter
  if (elements.hasCounter) {
    duration += 2.0; // Counter animation duration (slightly faster)
  }

  // Staggered list (faster stagger)
  if (elements.hasStaggeredList && elements.listItemCount) {
    duration += elements.listItemCount * 0.15; // 0.15s per item
  }

  // Multi-step slides (for internal transitions)
  if (elements.hasMultiStep && elements.stepCount) {
    duration += elements.stepCount * 3.5; // 3.5s per step
  }

  return duration;
};

/**
 * Slide transition variants with blur
 * Used for transitioning between slides in StoryViewer
 */
export const slideTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    x: 60,
    filter: 'blur(12px)',
  },
  animate: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: EASING.easeOutQuart,
    },
  },
  exit: {
    opacity: 0,
    x: -60,
    filter: 'blur(12px)',
    transition: {
      duration: 0.25,
      ease: EASING.easeOutCubic,
    },
  },
};

/**
 * Popup/dropdown variants with blur
 */
export const popupVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.2,
      ease: EASING.easeOutQuart,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    filter: 'blur(4px)',
    transition: {
      duration: 0.15,
      ease: EASING.easeOutCubic,
    },
  },
};
