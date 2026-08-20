"use client";

/**
 * One GSAP entry point for the whole site.
 *
 * Plugins register exactly once, on the client, and every module imports gsap
 * and its plugins from here rather than from `gsap/*` directly. Registering in
 * two places is how you end up with two ScrollTrigger instances fighting over
 * the same scroller.
 */

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Observer } from "gsap/Observer";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let ready = false;

/** Idempotent — safe to call from every component that needs GSAP. */
export function initGsap() {
  if (ready || typeof window === "undefined") return;
  ready = true;

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, ScrambleTextPlugin, Observer);

  /*
   * The house curves, as SVG paths because that is what CustomEase speaks.
   * `M0,0 C x1,y1 x2,y2 1,1` is the cubic-bezier of the same four numbers.
   */
  CustomEase.create("hop", "M0,0 C0.16,1 0.3,1 1,1"); // hard start, long settle
  CustomEase.create("swing", "M0,0 C0.76,0 0.24,1 1,1"); // symmetric, for things that go both ways
  CustomEase.create("drift", "M0,0 C0.33,1 0.68,1 1,1"); // gentle, for scrubbed motion

  gsap.defaults({ ease: "hop", duration: 1 });

  // A phone's URL bar collapsing is not a resize worth re-measuring pins for.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** True when the reader has asked the OS for less movement. */
export function prefersReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger, SplitText, CustomEase, Observer, ScrambleTextPlugin };
