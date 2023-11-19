const mobileBreakpointPx = 834;

export const media = {
  /** Enable hover only on non-touch devices */
  hoverNonTouch: `@media (hover: hover) and (pointer: fine)`,
  prefersReducedMotion: `@media (prefers-reduced-motion)`,
  /** Mobile */
  mobileStyle: `@media (max-width: ${mobileBreakpointPx}px)`,
  /** Tablet and Smaller Desktop */
  tabletAndSmallerDesktopStyle: `@media (min-width: ${
    mobileBreakpointPx + 1
  }px) and (max-width: 1120px)`,
  prefersColorSchemeDark: `@media (prefers-color-scheme: dark)`,
} as const;
