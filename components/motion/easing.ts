/**
 * One easing vocabulary for the whole site.
 *
 * `EASE_OUT` is the Modernist house curve — a hard start that settles slowly,
 * the same cubic-bezier the design canvas used for its line reveals. Every
 * entrance shares it so nothing reads as a different system.
 */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Symmetric curve for things that move both ways (drawers, curtains). */
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

/** Spring used for anything that tracks the pointer. */
export const POINTER_SPRING = { stiffness: 220, damping: 20, mass: 0.4 } as const;

/** Softer spring for scroll-linked movement, so parallax never jitters. */
export const SCROLL_SPRING = { stiffness: 120, damping: 30, mass: 0.35 } as const;
