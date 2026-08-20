"use client";

import { getLenis } from "./motion/SmoothScroll";

export default function BackToTop() {
  const toTop = () => {
    const lenis = getLenis();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Hand the scroll to Lenis when it owns the page, so the return trip uses
    // the same easing as every other scroll rather than jumping out of it.
    if (lenis && !reduced) {
      lenis.scrollTo(0, { duration: 1.6 });
      return;
    }
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button type="button" className="btn btn-quiet" onClick={toTop} data-magnetic="0.2" data-cursor>
      Back to top <span aria-hidden="true">↑</span>
    </button>
  );
}
