import type { Variants } from 'framer-motion';

/**
 * Shared animation variants for consistent motion across all pages
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
    scale: 0.8,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

export const itemVariantsSubtle: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 12,
    },
  },
};

export const heroVariants: Variants = {
  hidden: {
    scale: 0,
    rotate: -10,
    opacity: 0,
  },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      delay: 0.5,
    },
  },
};

export const slideVariants: Variants = {
  hidden: {
    y: 100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12,
    },
  },
};

export const slideVariantsTop: Variants = {
  hidden: {
    y: -100,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 12,
    },
  },
};

export const fadeScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

/**
 * Staged text entrance helpers
 *
 * Each element:
 * - briefly appears centered
 * - then settles slightly higher as later elements arrive
 * - uses ease-out-quad for a smooth, low-bounce feel
 */

export const STAGED_TEXT_DELAYS = {
  HEADLINE: 0.0,
  SUBHEADLINE: 0.5,
  METRIC: 1.0,
  LABEL: 1.5,
} as const;

export const createStagedTextVariant = (delaySeconds: number): Variants => ({
  hidden: {
    opacity: 0,
    y: 0,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: -12,
    scale: 1,
    transition: {
      duration: 1.0,
      delay: delaySeconds,
      // ease-out-quad: cubic-bezier(.25, .46, .45, .94)
      ease: [0.25, 0.46, 0.45, 0.94],
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

  // Base container animation
  duration += 0.3;

  // Staged text (longest delay + animation duration)
  if (elements.hasStaged) {
    duration += STAGED_TEXT_DELAYS.LABEL + 1.0; // Last element delay + duration
  }

  // Animated counter
  if (elements.hasCounter) {
    duration += 2.5; // Counter animation duration
  }

  // Staggered list
  if (elements.hasStaggeredList && elements.listItemCount) {
    duration += elements.listItemCount * 0.3; // 0.3s per item
  }

  // Multi-step slides (for internal transitions)
  if (elements.hasMultiStep && elements.stepCount) {
    duration += elements.stepCount * 4.0; // 4s per step
  }

  return duration;
};
