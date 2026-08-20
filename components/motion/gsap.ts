"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * One GSAP instance, registered once, with the site's easing vocabulary
 * attached to it.
 *
 * Every motion component imports `gsap` from here rather than from the package
 * directly. Registering plugins at each call site is how you end up with a
 * component that animates in isolation and silently no-ops the moment it is
 * rendered before the module that happened to register ScrollTrigger.
 */
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase);

/**
 * The house curve — a hard start that settles slowly. Identical numbers to the
 * `cubic-bezier(0.16, 1, 0.3, 1)` the CSS layer uses for its transitions, so a
 * hover written in CSS and an entrance written in GSAP move the same way.
 *
 * CustomEase reads SVG path data: `M0,0 C{x1},{y1} {x2},{y2} 1,1` is exactly
 * the cubic-bezier of the same four numbers.
 */
CustomEase.create("site", "M0,0 C0.16,1 0.3,1 1,1");

/** Symmetric curve for anything that moves both ways (curtains, drawers). */
CustomEase.create("site-io", "M0,0 C0.76,0 0.24,1 1,1");

export const EASE = "site";
export const EASE_IO = "site-io";

if (typeof window !== "undefined") {
  gsap.defaults({ ease: EASE, duration: 0.9 });

  // A tab that has been backgrounded hands back one enormous delta. Without
  // lag smoothing off, GSAP would compensate by skipping the tween forward;
  // with Lenis driving the same ticker that produces a scroll jump.
  gsap.ticker.lagSmoothing(0);

  // iOS collapses its URL bar mid-scroll, which fires a resize and would
  // otherwise re-measure every trigger in the middle of a gesture.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * Read the reduced-motion preference at animation-setup time.
 *
 * A synchronous read rather than a hook on purpose: it is only ever called
 * from inside a `useGSAP` callback, which already runs on the client after
 * mount, so there is no server/client mismatch to reconcile and no re-render
 * to pay for.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True only for a real mouse — never for a finger that fires one `move`. */
export function hasFinePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Drop an element (and any descendants) into its resting, fully visible state.
 *
 * The CSS layer ships every entrance pre-hidden so the prerendered HTML never
 * flashes its content before GSAP takes over. That means "do not animate" can
 * never mean "do nothing" — something has to put the element back. Reduced
 * motion, and the failsafe in {@link MotionFailsafe}, both land here.
 */
export function settle(targets: gsap.TweenTarget) {
  gsap.set(targets, {
    opacity: 1,
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    rotate: 0,
    skewX: 0,
    skewY: 0,
    filter: "none",
    clipPath: "none",
  });
}

/**
 * Marks a subtree as owned by a live animation.
 *
 * The failsafe sweep leaves anything carrying this attribute alone — it is the
 * difference between "this element is hidden because it is waiting its turn"
 * and "this element is hidden because the script that was going to reveal it
 * never ran".
 */
export function claim(el: Element | null | undefined) {
  el?.setAttribute("data-motion-ready", "");
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
